"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/components/auth-provider"
import { useIssueStore } from "@/lib/issue-store"
import { X, Bell, CheckCircle, AlertCircle, MessageSquare, ThumbsUp } from "lucide-react"

interface NotificationsModalProps {
  onClose: () => void
}

interface Notification {
  id: string
  type: "status_update" | "comment" | "upvote" | "system"
  title: string
  message: string
  timestamp: string
  read: boolean
  issueId?: string
}

export function NotificationsModal({ onClose }: NotificationsModalProps) {
  const { user } = useAuth()
  const issues = useIssueStore((state) => state.issues)

  // Generate mock notifications based on user's issues
  const generateNotifications = (): Notification[] => {
    const userIssues = issues.filter((issue) => issue.reportedBy === user?.name)
    const notifications: Notification[] = []

    // Status update notifications
    userIssues.forEach((issue) => {
      if (issue.status === "resolved") {
        notifications.push({
          id: `status-${issue.id}`,
          type: "status_update",
          title: "Issue Resolved!",
          message: `Your report "${issue.title}" has been marked as resolved.`,
          timestamp: "2 hours ago",
          read: false,
          issueId: issue.id,
        })
      } else if (issue.status === "in-progress") {
        notifications.push({
          id: `progress-${issue.id}`,
          type: "status_update",
          title: "Issue In Progress",
          message: `Work has started on your report "${issue.title}".`,
          timestamp: "1 day ago",
          read: true,
          issueId: issue.id,
        })
      }
    })

    // Comment notifications
    userIssues.forEach((issue) => {
      if (issue.comments.length > 0) {
        const latestComment = issue.comments[issue.comments.length - 1]
        if (latestComment.isOfficial) {
          notifications.push({
            id: `comment-${issue.id}`,
            type: "comment",
            title: "Official Response",
            message: `${latestComment.author} commented on "${issue.title}": ${latestComment.content.substring(0, 50)}...`,
            timestamp: "3 hours ago",
            read: false,
            issueId: issue.id,
          })
        }
      }
    })

    // Upvote notifications
    userIssues.forEach((issue) => {
      if (issue.upvotes > 5) {
        notifications.push({
          id: `upvote-${issue.id}`,
          type: "upvote",
          title: "Popular Report",
          message: `Your report "${issue.title}" has received ${issue.upvotes} upvotes from the community!`,
          timestamp: "1 day ago",
          read: true,
          issueId: issue.id,
        })
      }
    })

    // System notifications
    notifications.push({
      id: "welcome",
      type: "system",
      title: "Welcome to CivicConnect!",
      message: "Thank you for joining our community. Start reporting issues to make your city better.",
      timestamp: "1 week ago",
      read: true,
    })

    return notifications.sort((a, b) => {
      const timeA = a.timestamp.includes("hour") ? 1 : a.timestamp.includes("day") ? 2 : 3
      const timeB = b.timestamp.includes("hour") ? 1 : b.timestamp.includes("day") ? 2 : 3
      return timeA - timeB
    })
  }

  const [notifications, setNotifications] = useState<Notification[]>(generateNotifications())
  const unreadCount = notifications.filter((n) => !n.read).length

  const markAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "status_update":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "comment":
        return <MessageSquare className="h-4 w-4 text-blue-600" />
      case "upvote":
        return <ThumbsUp className="h-4 w-4 text-orange-600" />
      case "system":
        return <AlertCircle className="h-4 w-4 text-purple-600" />
      default:
        return <Bell className="h-4 w-4" />
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
              {unreadCount > 0 && (
                <Badge variant="destructive" className="ml-2">
                  {unreadCount}
                </Badge>
              )}
            </CardTitle>
            <CardDescription>Stay updated on your civic reports and community activity</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <Button variant="outline" size="sm" onClick={markAllAsRead}>
                Mark all read
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {notifications.length === 0 ? (
            <div className="text-center py-8">
              <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No notifications yet</p>
              <p className="text-sm text-muted-foreground mt-1">
                You'll receive updates about your reports and community activity here
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {notifications.map((notification) => (
                <Card
                  key={notification.id}
                  className={`cursor-pointer transition-colors ${
                    !notification.read ? "bg-blue-50 border-blue-200" : "hover:bg-muted/50"
                  }`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="mt-1">{getNotificationIcon(notification.type)}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-sm">{notification.title}</h4>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">{notification.timestamp}</span>
                            {!notification.read && <div className="h-2 w-2 bg-blue-600 rounded-full"></div>}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
