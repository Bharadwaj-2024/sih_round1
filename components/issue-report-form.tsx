"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Camera, MapPin, ArrowLeft, ArrowRight, Check } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { useIssueStore } from "@/lib/issue-store"

interface IssueFormData {
  title: string
  description: string
  category: string
  customCategory?: string // Added for "Other" category text input
  urgency: "low" | "medium" | "high"
  location: string
  coordinates?: { lat: number; lng: number }
  tags: string[]
  photos: File[]
  duration: string
  previousReports: string
  affectedPeople: string
  additionalInfo: string
}

const categories = [
  { id: "roads", name: "Roads & Infrastructure", questions: ["Is it a pothole?", "Is it affecting traffic?"] },
  { id: "electricity", name: "Electricity", questions: ["Is it a power outage?", "Is it a street light issue?"] },
  { id: "sanitation", name: "Sanitation & Waste", questions: ["Is it garbage collection?", "Is it a drainage issue?"] },
  { id: "water", name: "Water Supply", questions: ["Is it a water shortage?", "Is it a pipe leak?"] },
  { id: "traffic", name: "Traffic & Transport", questions: ["Is it a signal issue?", "Is it parking related?"] },
  { id: "other", name: "Other", questions: [] }, // Removed questions for "Other" category
]

const departments = {
  roads: "Public Works Department",
  electricity: "Electricity Board",
  sanitation: "Municipal Corporation",
  water: "Water Supply Department",
  traffic: "Traffic Police",
  other: "General Administration",
}

export function IssueReportForm({ onClose }: { onClose: () => void }) {
  const { user } = useAuth()
  const addIssue = useIssueStore((state) => state.addIssue)
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState<IssueFormData>({
    title: "",
    description: "",
    category: "",
    urgency: "medium",
    location: "",
    tags: [],
    photos: [],
    duration: "",
    previousReports: "",
    affectedPeople: "",
    additionalInfo: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const selectedCategory = categories.find((cat) => cat.id === formData.category)

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setFormData((prev) => ({ ...prev, photos: [...prev.photos, ...files] }))
  }

  const removePhoto = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index),
    }))
  }

  const handleTagToggle = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag) ? prev.tags.filter((t) => t !== tag) : [...prev.tags, tag],
    }))
  }

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData((prev) => ({
            ...prev,
            coordinates: {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            },
            location: `Lat: ${position.coords.latitude.toFixed(4)}, Lng: ${position.coords.longitude.toFixed(4)}`,
          }))
        },
        (error) => {
          console.error("Error getting location:", error)
          alert("Unable to get current location. Please enter manually.")
        },
      )
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)

    const categoryName =
      formData.category === "other" ? formData.customCategory || "Other" : selectedCategory?.name || formData.category
    const assignedDepartment = departments[formData.category as keyof typeof departments]

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    addIssue({
      title: formData.title,
      description: formData.description,
      category: categoryName, // Use processed category name
      urgency: formData.urgency,
      location: formData.location,
      coordinates: formData.coordinates,
      tags: formData.tags,
      photos: formData.photos.map((file) => URL.createObjectURL(file)),
      assignedDepartment,
      reportedBy: user?.name || "Anonymous",
      reportedAt: new Date().toISOString(),
      status: "pending",
      additionalDetails: {
        duration: formData.duration,
        previousReports: formData.previousReports,
        affectedPeople: formData.affectedPeople,
        additionalInfo: formData.additionalInfo,
      },
    })

    setIsSubmitting(false)
    alert("Issue reported successfully! You will receive updates on its status.")
    onClose()
  }

  const canProceedToStep2 =
    formData.title &&
    formData.description &&
    formData.category &&
    (formData.category !== "other" || formData.customCategory)
  const canProceedToStep3 = formData.location && formData.urgency
  const canProceedToStep4 = formData.duration && formData.previousReports && formData.affectedPeople
  const canSubmit = canProceedToStep4 && formData.photos.length > 0

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Report Civic Issue</CardTitle>
              <CardDescription>Help improve your community by reporting issues</CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              ×
            </Button>
          </div>
          <div className="flex items-center gap-2 mt-4">
            {[1, 2, 3, 4].map(
              (
                stepNum, // Added step 4
              ) => (
                <div key={stepNum} className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      step >= stepNum ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {step > stepNum ? <Check className="h-4 w-4" /> : stepNum}
                  </div>
                  {stepNum < 4 && <div className="w-8 h-0.5 bg-muted mx-2" />}
                </div>
              ),
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Issue Details</h3>

              <div className="space-y-2">
                <Label htmlFor="title">Issue Title *</Label>
                <Input
                  id="title"
                  placeholder="Brief description of the issue"
                  value={formData.title}
                  onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Detailed Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Provide more details about the issue"
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label>Category *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select issue category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {formData.category === "other" && (
                <div className="space-y-2">
                  <Label htmlFor="customCategory">Please specify the category *</Label>
                  <Input
                    id="customCategory"
                    placeholder="Enter the type of issue"
                    value={formData.customCategory || ""}
                    onChange={(e) => setFormData((prev) => ({ ...prev, customCategory: e.target.value }))}
                  />
                </div>
              )}

              {selectedCategory && selectedCategory.questions.length > 0 && (
                <div className="space-y-2">
                  <Label>Help us categorize better</Label>
                  <div className="space-y-2">
                    {selectedCategory.questions.map((question, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Checkbox
                          id={`question-${index}`}
                          checked={formData.tags.includes(question)}
                          onCheckedChange={() => handleTagToggle(question)}
                        />
                        <Label htmlFor={`question-${index}`} className="text-sm">
                          {question}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Location & Priority</h3>

              <div className="space-y-2">
                <Label htmlFor="location">Location *</Label>
                <div className="flex gap-2">
                  <Input
                    id="location"
                    placeholder="Enter location or address"
                    value={formData.location}
                    onChange={(e) => setFormData((prev) => ({ ...prev, location: e.target.value }))}
                    className="flex-1"
                  />
                  <Button type="button" variant="outline" onClick={getCurrentLocation}>
                    <MapPin className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Urgency Level *</Label>
                <RadioGroup
                  value={formData.urgency}
                  onValueChange={(value: "low" | "medium" | "high") =>
                    setFormData((prev) => ({ ...prev, urgency: value }))
                  }
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="low" id="low" />
                    <Label htmlFor="low">Low - Can wait a few weeks</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="medium" id="medium" />
                    <Label htmlFor="medium">Medium - Should be addressed soon</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="high" id="high" />
                    <Label htmlFor="high">High - Needs immediate attention</Label>
                  </div>
                </RadioGroup>
              </div>

              {formData.category && (
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm font-medium">Auto-assigned Department:</p>
                  <Badge className="mt-1">{departments[formData.category as keyof typeof departments]}</Badge>
                </div>
              )}
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Additional Details</h3>

              <div className="space-y-2">
                <Label htmlFor="duration">How long have you been facing this issue? *</Label>
                <Select
                  value={formData.duration}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, duration: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="few-days">A few days</SelectItem>
                    <SelectItem value="1-week">About a week</SelectItem>
                    <SelectItem value="2-4-weeks">2-4 weeks</SelectItem>
                    <SelectItem value="1-3-months">1-3 months</SelectItem>
                    <SelectItem value="more-than-3-months">More than 3 months</SelectItem>
                    <SelectItem value="over-a-year">Over a year</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="previousReports">Have you reported this issue to any authorities before? *</Label>
                <RadioGroup
                  value={formData.previousReports}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, previousReports: value }))}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="no-reports" />
                    <Label htmlFor="no-reports">No, this is my first report</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="local-office" id="local-office" />
                    <Label htmlFor="local-office">Yes, to local municipal office</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="helpline" id="helpline" />
                    <Label htmlFor="helpline">Yes, through helpline/phone</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="online" id="online" />
                    <Label htmlFor="online">Yes, through online portal</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="multiple" id="multiple" />
                    <Label htmlFor="multiple">Yes, multiple times through different channels</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="affectedPeople">How many people are affected by this issue? *</Label>
                <Select
                  value={formData.affectedPeople}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, affectedPeople: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select affected population" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="just-me">Just me/my family</SelectItem>
                    <SelectItem value="few-neighbors">A few neighbors (5-10 people)</SelectItem>
                    <SelectItem value="street-area">Entire street/area (20-50 people)</SelectItem>
                    <SelectItem value="locality">Whole locality (100+ people)</SelectItem>
                    <SelectItem value="widespread">Widespread community issue (500+ people)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="additionalInfo">Any additional information or suggestions?</Label>
                <Textarea
                  id="additionalInfo"
                  placeholder="Any other details, possible causes, or suggestions for resolution..."
                  value={formData.additionalInfo}
                  onChange={(e) => setFormData((prev) => ({ ...prev, additionalInfo: e.target.value }))}
                  rows={3}
                />
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Photos & Evidence</h3>

              <div className="space-y-2">
                <Label>Upload Photos *</Label>
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handlePhotoUpload}
                    className="hidden"
                    id="photo-upload"
                  />
                  <Label htmlFor="photo-upload" className="cursor-pointer">
                    <div className="flex flex-col items-center gap-2">
                      <Camera className="h-8 w-8 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">Click to upload photos or drag and drop</p>
                    </div>
                  </Label>
                </div>
              </div>

              {formData.photos.length > 0 && (
                <div className="space-y-2">
                  <Label>Uploaded Photos ({formData.photos.length})</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {formData.photos.map((photo, index) => (
                      <div key={index} className="relative">
                        <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                          <span className="text-sm text-muted-foreground">{photo.name}</span>
                        </div>
                        <Button
                          variant="destructive"
                          size="sm"
                          className="absolute top-1 right-1"
                          onClick={() => removePhoto(index)}
                        >
                          ×
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-2">Review Your Report</h4>
                <div className="space-y-1 text-sm">
                  <p>
                    <strong>Title:</strong> {formData.title}
                  </p>
                  <p>
                    <strong>Category:</strong>{" "}
                    {formData.category === "other" ? formData.customCategory : selectedCategory?.name}
                  </p>
                  <p>
                    <strong>Location:</strong> {formData.location}
                  </p>
                  <p>
                    <strong>Urgency:</strong> {formData.urgency}
                  </p>
                  <p>
                    <strong>Duration:</strong> {formData.duration}
                  </p>
                  <p>
                    <strong>Previous Reports:</strong> {formData.previousReports}
                  </p>
                  <p>
                    <strong>Photos:</strong> {formData.photos.length} uploaded
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={step === 1 ? onClose : () => setStep(step - 1)}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              {step === 1 ? "Cancel" : "Previous"}
            </Button>

            {step < 4 ? (
              <Button
                onClick={() => setStep(step + 1)}
                disabled={
                  (step === 1 && !canProceedToStep2) ||
                  (step === 2 && !canProceedToStep3) ||
                  (step === 3 && !canProceedToStep4)
                }
              >
                Next
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={!canSubmit || isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit Report"}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
