"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/components/auth-provider"
import { useLanguage } from "@/components/language-provider"
import { LanguageSwitcher } from "@/components/language-switcher"
import { MapPin, Plus, Bell, User, LogOut, Filter, Search, Map, List, Users } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { IssueReportForm } from "@/components/issue-report-form"
import { IssueMap } from "@/components/issue-map"
import { IssueDetailsModal } from "@/components/issue-details-modal"
import { ProfileModal } from "@/components/profile-modal"
import { NotificationsModal } from "@/components/notifications-modal"
import { useIssueStore } from "@/lib/issue-store"
import { CommunityDashboard } from "@/components/community-dashboard"

// Mock data for issues
const mockIssues = [
  {
    id: "1",
    title: "Pothole on Main Street",
    description: "Large pothole causing traffic issues",
    status: "pending" as const,
    urgency: "high" as const,
    category: "roads",
    location: "Main Street, Sector 15",
    upvotes: 12,
    comments: 3,
    createdAt: "2024-01-15",
    reportedBy: "John Doe",
    userVotes: {},
  },
  {
    id: "2",
    title: "Broken Street Light",
    description: "Street light not working for 3 days",
    status: "in-progress" as const,
    urgency: "medium" as const,
    category: "electricity",
    location: "Park Avenue, Block A",
    upvotes: 8,
    comments: 1,
    createdAt: "2024-01-14",
    reportedBy: "Jane Smith",
    userVotes: {},
  },
  {
    id: "3",
    title: "Garbage Collection Missed",
    description: "Garbage not collected for 2 weeks",
    status: "resolved" as const,
    urgency: "high" as const,
    category: "sanitation",
    location: "Green Colony, Phase 2",
    upvotes: 15,
    comments: 5,
    createdAt: "2024-01-10",
    reportedBy: "John Doe",
    userVotes: {},
  },
]

export function CitizenDashboard() {
  const { user, logout } = useAuth()
  const { t } = useLanguage()
  const issues = useIssueStore((state) => state.issues) // Get issues from store instead of mock data
  const voteOnIssue = useIssueStore((state) => state.voteOnIssue)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [showReportForm, setShowReportForm] = useState(false)
  const [activeTab, setActiveTab] = useState("dashboard")
  const [selectedIssueId, setSelectedIssueId] = useState<string | null>(null)
  const [showProfile, setShowProfile] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)

  const filteredIssues = issues.filter((issue) => {
    const matchesSearch =
      issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      issue.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filterCategory === "all" || issue.category === filterCategory
    const matchesStatus = filterStatus === "all" || issue.status === filterStatus
    return matchesSearch && matchesCategory && matchesStatus
  })

  const userStats = {
    myReports: issues.filter((i) => i.reportedBy === user?.name).length,
    myResolved: issues.filter((i) => i.reportedBy === user?.name && i.status === "resolved").length,
    totalUpvotes: issues.filter((i) => i.reportedBy === user?.name).reduce((sum, issue) => sum + issue.upvotes, 0),
    communityImpact: issues
      .filter((i) => i.reportedBy === user?.name)
      .reduce((sum, issue) => sum + issue.upvotes + issue.comments.length, 0),
  }

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

  const handleVote = (issueId: string, voteType: "up" | "down") => {
    if (user?.id) {
      voteOnIssue(issueId, user.id, voteType)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary">
                <MapPin className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold">CivicConnect</h1>
                <p className="text-sm text-muted-foreground">
                  {t.welcomeMessage}, {user?.name}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <LanguageSwitcher />
              <Button variant="ghost" size="sm" onClick={() => setShowNotifications(true)} className="relative">
                <Bell className="h-4 w-4" />
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full text-xs flex items-center justify-center text-white">
                  3
                </span>
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setShowProfile(true)}>
                <User className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={logout}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Quick Actions */}
        <div className="mb-6">
          <Button size="lg" className="w-full sm:w-auto" onClick={() => setShowReportForm(true)}>
            <Plus className="mr-2 h-5 w-5" />
            {t.reportNewIssue}
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-[600px]">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="list" className="flex items-center gap-2">
              <List className="h-4 w-4" />
              List View
            </TabsTrigger>
            <TabsTrigger value="map" className="flex items-center gap-2">
              <Map className="h-4 w-4" />
              {t.mapView}
            </TabsTrigger>
            <TabsTrigger value="community" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Community
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            {/* Personal Stats */}
            <div>
              <h2 className="text-lg font-semibold mb-4">Your Impact</h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">{t.myReports}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{userStats.myReports}</div>
                    <p className="text-xs text-muted-foreground">Issues reported</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">{t.resolved}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{userStats.myResolved}</div>
                    <p className="text-xs text-muted-foreground">
                      {userStats.myReports > 0
                        ? `${Math.round((userStats.myResolved / userStats.myReports) * 100)}% ${t.resolutionRate}`
                        : "0% resolution rate"}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Upvotes Received</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{userStats.totalUpvotes}</div>
                    <p className="text-xs text-muted-foreground">Community support</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">{t.communityImpact}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{userStats.communityImpact}</div>
                    <p className="text-xs text-muted-foreground">Total engagement</p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* My Recent Reports */}
            <div>
              <h2 className="text-lg font-semibold mb-4">My Recent Reports</h2>
              <div className="space-y-4">
                {issues
                  .filter((issue) => issue.reportedBy === user?.name)
                  .slice(0, 3)
                  .map((issue) => (
                    <Card key={issue.id} className="hover:shadow-md transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-base">{issue.title}</CardTitle>
                            <CardDescription className="mt-1">{issue.description}</CardDescription>
                          </div>
                          <Badge className={getStatusColor(issue.status)}>
                            {issue.status === "pending"
                              ? t.pending
                              : issue.status === "in-progress"
                                ? t.inProgress
                                : t.resolved}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {issue.location}
                          </span>
                          <div className="flex items-center gap-4">
                            <span>{issue.upvotes} upvotes</span>
                            <span>{issue.comments.length} comments</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                {issues.filter((issue) => issue.reportedBy === user?.name).length === 0 && (
                  <Card>
                    <CardContent className="text-center py-8">
                      <p className="text-muted-foreground">You haven't reported any issues yet.</p>
                      <Button className="mt-4" onClick={() => setShowReportForm(true)}>
                        Report Your First Issue
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>

            {/* Community Overview */}
            <div>
              <h2 className="text-lg font-semibold mb-4">Community Overview</h2>
              <div className="grid gap-4 md:grid-cols-3">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Total Issues</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{issues.length}</div>
                    <p className="text-xs text-muted-foreground">In your area</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Resolved This Month</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{issues.filter((i) => i.status === "resolved").length}</div>
                    <p className="text-xs text-muted-foreground">
                      {issues.length > 0
                        ? `${Math.round((issues.filter((i) => i.status === "resolved").length / issues.length) * 100)}% success rate`
                        : "0% success rate"}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Active Citizens</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{new Set(issues.map((i) => i.reportedBy)).size}</div>
                    <p className="text-xs text-muted-foreground">Contributing to change</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="list" className="space-y-4">
            {/* Filters and Search */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder={`${t.search} ${t.issues.toLowerCase()}...`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger className="w-[140px]">
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="roads">{t.roads}</SelectItem>
                    <SelectItem value="electricity">{t.electricity}</SelectItem>
                    <SelectItem value="sanitation">{t.sanitation}</SelectItem>
                    <SelectItem value="water">{t.water}</SelectItem>
                    <SelectItem value="traffic">{t.traffic}</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-[120px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All {t.status}</SelectItem>
                    <SelectItem value="pending">{t.pending}</SelectItem>
                    <SelectItem value="in-progress">{t.inProgress}</SelectItem>
                    <SelectItem value="resolved">{t.resolved}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <h2 className="text-lg font-semibold">Recent {t.issues} in Your Area</h2>
            {filteredIssues.map((issue) => (
              <Card key={issue.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-base">{issue.title}</CardTitle>
                      <CardDescription className="mt-1">{issue.description}</CardDescription>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Badge className={getStatusColor(issue.status)}>
                        {issue.status === "pending"
                          ? t.pending
                          : issue.status === "in-progress"
                            ? t.inProgress
                            : t.resolved}
                      </Badge>
                      <Badge className={getUrgencyColor(issue.urgency)}>
                        {issue.urgency === "high" ? t.high : issue.urgency === "medium" ? t.medium : t.low}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {issue.location}
                      </span>
                      <span>#{issue.category}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span>{issue.upvotes} upvotes</span>
                      <span>{issue.comments.length} comments</span>
                      <span>{issue.createdAt}</span>
                    </div>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleVote(issue.id, "up")}
                      className={issue.userVotes[user?.id || ""] === "up" ? "bg-primary text-primary-foreground" : ""}
                    >
                      {t.upvote} ({issue.upvotes})
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setSelectedIssueId(issue.id)}>
                      {t.comment} ({issue.comments.length})
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setSelectedIssueId(issue.id)}>
                      {t.viewDetails}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}

            {filteredIssues.length === 0 && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">{t.noIssuesFound}</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="map">
            <IssueMap
              selectedCategory={filterCategory}
              selectedStatus={filterStatus}
              onIssueSelect={(issueId) => {
                setSelectedIssueId(issueId)
              }}
            />
          </TabsContent>

          <TabsContent value="community">
            <CommunityDashboard />
          </TabsContent>
        </Tabs>
      </div>

      {/* Issue Report Form Modal */}
      {showReportForm && <IssueReportForm onClose={() => setShowReportForm(false)} />}

      {/* Issue Details Modal */}
      {selectedIssueId && (
        <IssueDetailsModal issueId={selectedIssueId} onClose={() => setSelectedIssueId(null)} isAdmin={false} />
      )}

      {/* Profile and Notifications modals */}
      {showProfile && <ProfileModal onClose={() => setShowProfile(false)} />}
      {showNotifications && <NotificationsModal onClose={() => setShowNotifications(false)} />}
    </div>
  )
}
