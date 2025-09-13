"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useAuth } from "@/components/auth-provider"
import { MapPin, Calendar, User, MessageSquare, ThumbsUp, ThumbsDown, X, Camera, Building, Clock } from "lucide-react"
import { useIssueStore } from "@/lib/issue-store"

interface IssueDetailsModalProps {
  issueId: string // Accept issueId instead of full issue object
  onClose: () => void
  isAdmin?: boolean
}

export function IssueDetailsModal({ issueId, onClose, isAdmin = false }: IssueDetailsModalProps) {
  const { user } = useAuth()
  const issue = useIssueStore((state) => state.getIssueById(issueId)) // Get issue from store
  const voteOnIssue = useIssueStore((state) => state.voteOnIssue)
  const addComment = useIssueStore((state) => state.addComment)
  const updateIssue = useIssueStore((state) => state.updateIssue)

  const [newComment, setNewComment] = useState("")

  if (!issue) {
    return null
  }

  const userVote = issue.userVotes[user?.id || ""] || null // Get user's actual vote from store

  const departments = [
    "Public Works Department",
    "Electricity Board",
    "Municipal Corporation",
    "Water Supply Department",
    "Traffic Police",
    "General Administration",
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "in-progress":
        return "bg-blue-100 text-blue-800"
      case "resolved":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-orange-100 text-orange-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const handleVote = (voteType: "up" | "down") => {
    if (user?.id) {
      voteOnIssue(issue.id, user.id, voteType) // Use store function instead of local state
    }
  }

  const handleAddComment = () => {
    if (!newComment.trim() || !user) return

    addComment(issue.id, {
      author: user.name || "Anonymous",
      content: newComment,
      timestamp: new Date().toISOString(),
      isOfficial: user.role === "administrator",
    })

    setNewComment("")
  }

  const handleStatusUpdate = (newStatus: string) => {
    updateIssue(issue.id, { status: newStatus as "pending" | "in-progress" | "resolved" })
  }

  const handleDepartmentAssignment = (department: string) => {
    updateIssue(issue.id, { assignedDepartment: department })
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-xl">{issue.title}</CardTitle>
              <CardDescription className="mt-2 flex items-center gap-4 text-sm">
                <span className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  Reported by {issue.reportedBy}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {formatDate(issue.reportedAt)}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {issue.location}
                </span>
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center gap-2 mt-4">
            <Badge className={getStatusColor(issue.status)}>{issue.status}</Badge>
            <Badge className={getUrgencyColor(issue.urgency)}>{issue.urgency} priority</Badge>
            <Badge variant="outline">#{issue.category}</Badge>
            {issue.assignedDepartment && ( // Use actual assigned department from issue
              <Badge variant="outline" className="flex items-center gap-1">
                <Building className="h-3 w-3" />
                {issue.assignedDepartment}
              </Badge>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Admin Controls */}
          {isAdmin && (
            <Card className="bg-muted/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Admin Controls</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Status</label>
                    <Select value={issue.status} onValueChange={handleStatusUpdate}>
                      {" "}
                      {/* Use actual issue status */}
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="resolved">Resolved</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Assign Department</label>
                    <Select value={issue.assignedDepartment || ""} onValueChange={handleDepartmentAssignment}>
                      {" "}
                      {/* Use actual assigned department */}
                      <SelectTrigger>
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        {departments.map((dept) => (
                          <SelectItem key={dept} value={dept}>
                            {dept}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Issue Description */}
          <div>
            <h3 className="font-semibold mb-2">Description</h3>
            <p className="text-muted-foreground leading-relaxed">{issue.description}</p>
          </div>

          {/* Photos */}
          {issue.photos && issue.photos.length > 0 && (
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Camera className="h-4 w-4" />
                Photos ({issue.photos.length})
              </h3>
              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                {issue.photos.map((photo, index) => (
                  <div key={index} className="aspect-video bg-muted rounded-lg overflow-hidden">
                    <img
                      src={photo || "/placeholder.svg"}
                      alt={`Issue photo ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Engagement Stats */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Button
                variant={userVote === "up" ? "default" : "outline"}
                size="sm"
                onClick={() => handleVote("up")}
                className="flex items-center gap-1"
              >
                <ThumbsUp className="h-4 w-4" />
                {issue.upvotes} {/* Show actual upvotes from store */}
              </Button>
              <Button
                variant={userVote === "down" ? "destructive" : "outline"}
                size="sm"
                onClick={() => handleVote("down")}
                className="flex items-center gap-1"
              >
                <ThumbsDown className="h-4 w-4" />
                {issue.downvotes} {/* Show actual downvotes from store */}
              </Button>
            </div>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <MessageSquare className="h-4 w-4" />
              {issue.comments.length} comments
            </div>
          </div>

          <Separator />

          {/* Comments Section */}
          <div>
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Comments & Updates
            </h3>

            {/* Add Comment */}
            <div className="mb-6">
              <Textarea
                placeholder={
                  isAdmin ? "Add an official update or response..." : "Share your thoughts or additional information..."
                }
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="mb-3"
                rows={3}
              />
              <Button onClick={handleAddComment} disabled={!newComment.trim()}>
                {isAdmin ? "Post Official Update" : "Add Comment"}
              </Button>
            </div>

            {/* Comments List */}
            <div className="space-y-4">
              {issue.comments.map((comment) => (
                <div key={comment.id} className="flex gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>{comment.author.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm">{comment.author}</span>
                      {comment.isOfficial && (
                        <Badge variant="secondary" className="text-xs">
                          Official
                        </Badge>
                      )}
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatDate(comment.timestamp)}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{comment.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
