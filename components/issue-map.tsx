"use client"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin, Layers } from "lucide-react"
import { useIssueStore } from "@/lib/issue-store"

interface IssueMapProps {
  selectedCategory?: string
  selectedStatus?: string
  onIssueSelect?: (issueId: string) => void
}

export function IssueMap({ selectedCategory = "all", selectedStatus = "all", onIssueSelect }: IssueMapProps) {
  const issues = useIssueStore((state) => state.issues) // Use issues from store instead of mock data
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const markersRef = useRef<any[]>([])
  const isMountedRef = useRef(true)
  const [isMapLoaded, setIsMapLoaded] = useState(false)
  const [mapView, setMapView] = useState<"satellite" | "street">("street")

  // Filter issues based on selected filters
  const filteredIssues = issues.filter((issue) => {
    const matchesCategory = selectedCategory === "all" || issue.category === selectedCategory
    const matchesStatus = selectedStatus === "all" || issue.status === selectedStatus
    return matchesCategory && matchesStatus && issue.coordinates // Only show issues with coordinates
  })

  const getMarkerColor = (status: string, urgency: string) => {
    if (status === "resolved") return "#10b981" // green
    if (urgency === "high") return "#ef4444" // red
    if (urgency === "medium") return "#f59e0b" // orange
    return "#6b7280" // gray
  }

  const getCategoryIcon = (category: string) => {
    const icons = {
      roads: "🛣️",
      electricity: "💡",
      sanitation: "🗑️",
      water: "💧",
      traffic: "🚦",
      other: "📍",
    }
    return icons[category as keyof typeof icons] || "📍"
  }

  useEffect(() => {
    // Load Leaflet dynamically
    const loadLeaflet = async () => {
      if (typeof window === "undefined") return

      // Add Leaflet CSS
      if (!document.querySelector('link[href*="leaflet"]')) {
        const link = document.createElement("link")
        link.rel = "stylesheet"
        link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        document.head.appendChild(link)
      }

      // Load Leaflet JS
      if (!(window as any).L) {
        const script = document.createElement("script")
        script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
        script.onload = () => initializeMap()
        document.head.appendChild(script)
      } else {
        initializeMap()
      }
    }

    const initializeMap = () => {
      if (!mapRef.current || mapInstanceRef.current) return

      try {
        const L = (window as any).L
        if (!L) {
          console.error("Leaflet library not loaded")
          return
        }

        const map = L.map(mapRef.current, {
          zoomControl: true,
          attributionControl: true,
        }).setView([12.9716, 77.5946], 12)

        // Add OpenStreetMap tiles
        const streetLayer = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19,
        })

        const satelliteLayer = L.tileLayer(
          "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
          {
            attribution: "© Esri",
            maxZoom: 19,
          },
        )

        streetLayer.addTo(map)

        // Store map instance
        mapInstanceRef.current = map

        // Store layer references for switching
        ;(map as any)._streetLayer = streetLayer
        ;(map as any)._satelliteLayer = satelliteLayer

        // Add error handling for map events
        map.on('error', (e: any) => {
          console.warn("Map error:", e)
        })

        // Only set loaded state if component is still mounted
        if (isMountedRef.current) {
          setIsMapLoaded(true)
        }
      } catch (error) {
        console.error("Error initializing map:", error)
        if (isMountedRef.current) {
          setIsMapLoaded(false)
        }
      }
    }

    loadLeaflet()

    return () => {
      isMountedRef.current = false

      // Clean up markers first
      if (markersRef.current.length > 0) {
        markersRef.current.forEach((marker) => {
          try {
            if (mapInstanceRef.current && marker && mapInstanceRef.current.hasLayer && mapInstanceRef.current.hasLayer(marker)) {
              mapInstanceRef.current.removeLayer(marker)
            }
          } catch (error) {
            console.warn("Error cleaning up marker:", error)
          }
        })
        markersRef.current = []
      }

      // Clean up map instance
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.remove()
        } catch (error) {
          console.warn("Error removing map:", error)
        } finally {
          mapInstanceRef.current = null
        }
      }
    }
  }, [])

  useEffect(() => {
    if (!isMapLoaded || !mapInstanceRef.current || !isMountedRef.current) return

    const L = (window as any).L
    const map = mapInstanceRef.current

    // Additional safety check - ensure map is still valid
    if (!map || !map.getContainer()) {
      console.warn("Map instance is invalid, skipping marker update")
      return
    }

    // Clear existing markers safely
    markersRef.current.forEach((marker) => {
      try {
        if (map && marker && map.hasLayer && map.hasLayer(marker)) {
          map.removeLayer(marker)
        }
      } catch (error) {
        console.warn("Error removing marker:", error)
      }
    })
    markersRef.current = []

    // Add markers for filtered issues
    filteredIssues.forEach((issue) => {
      if (!issue.coordinates) return // Skip issues without coordinates

      try {
        const color = getMarkerColor(issue.status, issue.urgency)
        const icon = getCategoryIcon(issue.category)

        // Create custom marker
        const marker = L.circleMarker([issue.coordinates.lat, issue.coordinates.lng], {
          radius: 8,
          fillColor: color,
          color: "#ffffff",
          weight: 2,
          opacity: 1,
          fillOpacity: 0.8,
        })

        // Add popup with issue details
        const popupContent = `
          <div class="p-2 min-w-[200px]">
            <div class="flex items-center gap-2 mb-2">
              <span class="text-lg">${icon}</span>
              <h3 class="font-semibold text-sm">${issue.title}</h3>
            </div>
            <p class="text-xs text-gray-600 mb-2">${issue.description}</p>
            <div class="flex gap-1 mb-2">
              <span class="px-2 py-1 text-xs rounded ${
                issue.status === "resolved"
                  ? "bg-green-100 text-green-800"
                  : issue.status === "in-progress"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-yellow-100 text-yellow-800"
              }">${issue.status}</span>
              <span class="px-2 py-1 text-xs rounded ${
                issue.urgency === "high"
                  ? "bg-red-100 text-red-800"
                  : issue.urgency === "medium"
                    ? "bg-orange-100 text-orange-800"
                    : "bg-green-100 text-green-800"
              }">${issue.urgency}</span>
            </div>
            <div class="text-xs text-gray-500">
              <p>📍 ${issue.location}</p>
              <p>👍 ${issue.upvotes} upvotes • 💬 ${issue.comments.length} comments</p>
            </div>
          </div>
        `

        marker.bindPopup(popupContent)

        // Add click handler
        marker.on("click", () => {
          if (onIssueSelect) {
            onIssueSelect(issue.id)
          }
        })

        // Safety check before adding marker to map
        if (map && map.getContainer()) {
          marker.addTo(map)
          markersRef.current.push(marker)
        }
      } catch (error) {
        console.warn("Error creating marker for issue:", issue.id, error)
      }
    })

    // Fit map to show all markers if there are any
    if (markersRef.current.length > 0 && map && map.getContainer()) {
      try {
        const group = new L.featureGroup(markersRef.current)
        map.fitBounds(group.getBounds().pad(0.1))
      } catch (error) {
        console.warn("Error fitting map bounds:", error)
      }
    }
  }, [filteredIssues, isMapLoaded, onIssueSelect])

  const switchMapView = (view: "satellite" | "street") => {
    if (!mapInstanceRef.current) {
      console.warn("Cannot switch map view: map not initialized")
      return
    }

    try {
      const map = mapInstanceRef.current

      // Ensure map is still valid
      if (!map.getContainer()) {
        console.warn("Cannot switch map view: map container invalid")
        return
      }

      if (view === "satellite") {
        if ((map as any)._streetLayer && map.hasLayer((map as any)._streetLayer)) {
          map.removeLayer((map as any)._streetLayer)
        }
        if ((map as any)._satelliteLayer) {
          map.addLayer((map as any)._satelliteLayer)
        }
      } else {
        if ((map as any)._satelliteLayer && map.hasLayer((map as any)._satelliteLayer)) {
          map.removeLayer((map as any)._satelliteLayer)
        }
        if ((map as any)._streetLayer) {
          map.addLayer((map as any)._streetLayer)
        }
      }

      setMapView(view)
    } catch (error) {
      console.error("Error switching map view:", error)
    }
  }

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Issues Map - Bangalore
          </CardTitle>
          <div className="flex items-center gap-2">
            <Select value={mapView} onValueChange={(value: "satellite" | "street") => switchMapView(value)}>
              <SelectTrigger className="w-[120px]">
                <Layers className="mr-2 h-4 w-4" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="street">Street</SelectItem>
                <SelectItem value="satellite">Satellite</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="relative">
          <div ref={mapRef} className="h-[400px] w-full rounded-b-lg" />
          {!isMapLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-muted rounded-b-lg">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                <p className="text-sm text-muted-foreground">Loading map...</p>
              </div>
            </div>
          )}
        </div>

        {/* Map Legend */}
        <div className="p-4 border-t">
          <h4 className="text-sm font-medium mb-2">Legend</h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span>High Priority</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-orange-500"></div>
              <span>Medium Priority</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span>Resolved</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gray-500"></div>
              <span>Low Priority</span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-2">Showing {filteredIssues.length} issues on map</p>
        </div>
      </CardContent>
    </Card>
  )
}
