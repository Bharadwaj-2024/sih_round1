"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/components/auth-provider"
import { useIssueStore } from "@/lib/issue-store"
import { X, User, Mail, Phone, MapPin, Award } from "lucide-react"

interface ProfileModalProps {
  onClose: () => void
}

export function ProfileModal({ onClose }: ProfileModalProps) {
  const { user } = useAuth()
  const issues = useIssueStore((state) => state.issues)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "+91 9876543210",
    address: "Koramangala, Bangalore",
    bio: "Active citizen contributing to community development",
  })

  const userStats = {
    totalReports: issues.filter((i) => i.reportedBy === user?.name).length,
    resolvedReports: issues.filter((i) => i.reportedBy === user?.name && i.status === "resolved").length,
    totalUpvotes: issues.filter((i) => i.reportedBy === user?.name).reduce((sum, issue) => sum + issue.upvotes, 0),
    joinDate: "January 2024",
    rank: "Community Champion",
  }

  const handleSave = () => {
    // In a real app, this would update the user profile
    console.log("Saving profile:", formData)
    setIsEditing(false)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              User Profile
            </CardTitle>
            <CardDescription>Manage your account and view your civic impact</CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Profile Picture and Basic Info */}
          <div className="flex items-center gap-4">
            <div className="h-20 w-20 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-2xl font-bold">
              {user?.name?.charAt(0) || "U"}
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold">{user?.name}</h3>
              <p className="text-muted-foreground">{userStats.rank}</p>
              <Badge variant="secondary" className="mt-1">
                <Award className="h-3 w-3 mr-1" />
                Member since {userStats.joinDate}
              </Badge>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-primary">{userStats.totalReports}</div>
                <p className="text-sm text-muted-foreground">Reports Filed</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">{userStats.resolvedReports}</div>
                <p className="text-sm text-muted-foreground">Issues Resolved</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">{userStats.totalUpvotes}</div>
                <p className="text-sm text-muted-foreground">Upvotes Received</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {userStats.totalReports > 0
                    ? Math.round((userStats.resolvedReports / userStats.totalReports) * 100)
                    : 0}
                  %
                </div>
                <p className="text-sm text-muted-foreground">Success Rate</p>
              </CardContent>
            </Card>
          </div>

          {/* Profile Details */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-semibold">Profile Details</h4>
              <Button variant="outline" size="sm" onClick={() => setIsEditing(!isEditing)}>
                {isEditing ? "Cancel" : "Edit Profile"}
              </Button>
            </div>

            {isEditing ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    rows={3}
                  />
                </div>
                <Button onClick={handleSave} className="w-full">
                  Save Changes
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{formData.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{formData.phone}</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{formData.address}</span>
                </div>
                <div className="flex items-start gap-3">
                  <User className="h-4 w-4 text-muted-foreground mt-1" />
                  <span>{formData.bio}</span>
                </div>
              </div>
            )}
          </div>

          {/* Recent Activity */}
          <div>
            <h4 className="text-lg font-semibold mb-3">Recent Activity</h4>
            <div className="space-y-2">
              {issues
                .filter((issue) => issue.reportedBy === user?.name)
                .slice(0, 3)
                .map((issue) => (
                  <div key={issue.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div>
                      <p className="font-medium">{issue.title}</p>
                      <p className="text-sm text-muted-foreground">{issue.location}</p>
                    </div>
                    <Badge
                      className={
                        issue.status === "resolved"
                          ? "bg-green-100 text-green-800"
                          : issue.status === "in-progress"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-yellow-100 text-yellow-800"
                      }
                    >
                      {issue.status}
                    </Badge>
                  </div>
                ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
