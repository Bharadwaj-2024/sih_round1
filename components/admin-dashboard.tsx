"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/components/auth-provider"
import { useIssueStore } from "@/lib/issue-store"
import {
  Shield,
  LogOut,
  Users,
  AlertTriangle,
  CheckCircle,
  Clock,
  Search,
  Filter,
  Eye,
  Edit,
  BarChart3,
  Bell,
} from "lucide-react"
import { IssueMap } from "@/components/issue-map"
import { IssueDetailsModal } from "@/components/issue-details-modal"
import { ProofUploadModal } from "@/components/proof-upload-modal"

const departments = [
  "BBMP Road Infrastructure",
  "BESCOM",
  "BBMP Solid Waste Management",
  "BWSSB",
  "Bangalore Traffic Police",
  "BBMP Infrastructure",
  "BBMP Animal Husbandry",
  "General Administration",
]

export function AdminDashboard() {
  const { user, logout } = useAuth()
  const issues = useIssueStore((state) => state.issues)
  const updateIssue = useIssueStore((state) => state.updateIssue)
  const [activeTab, setActiveTab] = useState("overview")
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterCategory, setFilterCategory] = useState("all")
  const [selectedIssueId, setSelectedIssueId] = useState<string | null>(null)
  const [proofUpload, setProofUpload] = useState<{
    issueId: string
    currentStatus: string
    newStatus: "in-progress" | "resolved"
  } | null>(null)

  const filteredIssues = issues.filter((issue) => {
    const matchesSearch =
      issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      issue.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      issue.reportedBy.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === "all" || issue.status === filterStatus
    const matchesCategory = filterCategory === "all" || issue.category === filterCategory
    return matchesSearch && matchesStatus && matchesCategory
  })

  const stats = {
    total: issues.length,
    pending: issues.filter((i) => i.status === "pending").length,
    inProgress: issues.filter((i) => i.status === "in-progress").length,
    resolved: issues.filter((i) => i.status === "resolved").length,
    highPriority: issues.filter((i) => i.urgency === "high").length,
  }

  const departmentStats = departments.map((dept) => {
    const assigned = issues.filter((i) => i.assignedDepartment === dept).length
    const resolved = issues.filter((i) => i.assignedDepartment === dept && i.status === "resolved").length
    const performance = assigned > 0 ? Math.round((resolved / assigned) * 100) : 0
    return { dept, assigned, resolved, performance }
  })

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
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const updateIssueStatus = (issueId: string, newStatus: string) => {
    const issue = issues.find((i) => i.id === issueId)
    if (!issue) return

    if ((newStatus === "in-progress" || newStatus === "resolved") && issue.status === "pending") {
      setProofUpload({
        issueId,
        currentStatus: issue.status,
        newStatus: newStatus as "in-progress" | "resolved",
      })
    } else if (newStatus === "resolved" && issue.status === "in-progress") {
      setProofUpload({
        issueId,
        currentStatus: issue.status,
        newStatus: "resolved",
      })
    } else {
      updateIssue(issueId, { status: newStatus as "pending" | "in-progress" | "resolved" })
    }
  }

  const assignDepartment = (issueId: string, department: string) => {
    updateIssue(issueId, { assignedDepartment: department })
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary">
                <Shield className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold">CivicConnect Admin</h1>
                <p className="text-sm text-muted-foreground">Welcome, {user?.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {/* Real-time notifications */}
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="h-4 w-4" />
                {stats.pending > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {stats.pending}
                  </span>
                )}
              </Button>
              <Button variant="ghost" size="sm" onClick={logout}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-[600px]">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="issues">Issues</TabsTrigger>
            <TabsTrigger value="map">Map View</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats Overview */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Issues</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.total}</div>
                  <p className="text-xs text-muted-foreground">
                    {stats.total > 0 ? "+12% from last month" : "No issues yet"}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.pending}</div>
                  <p className="text-xs text-muted-foreground">
                    {stats.pending > 0 ? "Requires attention" : "All caught up!"}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">In Progress</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.inProgress}</div>
                  <p className="text-xs text-muted-foreground">Being worked on</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Resolved</CardTitle>
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.resolved}</div>
                  <p className="text-xs text-muted-foreground">
                    {stats.total > 0
                      ? `${Math.round((stats.resolved / stats.total) * 100)}% resolution rate`
                      : "0% resolution rate"}
                  </p>
                </CardContent>
              </Card>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
              <div className="grid gap-4 md:grid-cols-3">
                <Card
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => setActiveTab("issues")}
                >
                  <CardHeader>
                    <CardTitle className="text-base">Review Pending Issues</CardTitle>
                    <CardDescription>{stats.pending} issues awaiting verification</CardDescription>
                  </CardHeader>
                </Card>
                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-base">Assign Departments</CardTitle>
                    <CardDescription>
                      {issues.filter((i) => !i.assignedDepartment).length} verified issues need assignment
                    </CardDescription>
                  </CardHeader>
                </Card>
                <Card
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => setActiveTab("analytics")}
                >
                  <CardHeader>
                    <CardTitle className="text-base">View Analytics</CardTitle>
                    <CardDescription>Check performance metrics</CardDescription>
                  </CardHeader>
                </Card>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
              <Card>
                <CardContent className="p-6">
                  {issues.length > 0 ? (
                    <div className="space-y-4">
                      {issues.slice(0, 5).map((issue) => (
                        <div key={issue.id} className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{issue.title}</p>
                            <p className="text-sm text-muted-foreground">
                              Reported by {issue.reportedBy} • {formatDate(issue.reportedAt)}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Badge className={getStatusColor(issue.status)}>{issue.status}</Badge>
                            <Badge className={getUrgencyColor(issue.urgency)}>{issue.urgency}</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      No issues reported yet. System is ready for citizen reports.
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="issues" className="space-y-6">
            {/* Filters */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search issues, reporters..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-[140px]">
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="roads">Roads</SelectItem>
                    <SelectItem value="electricity">Electricity</SelectItem>
                    <SelectItem value="sanitation">Sanitation</SelectItem>
                    <SelectItem value="water">Water</SelectItem>
                    <SelectItem value="traffic">Traffic</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Issues Table */}
            <Card>
              <CardHeader>
                <CardTitle>Issues Management</CardTitle>
                <CardDescription>Review, verify, and assign issues to departments</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Issue</TableHead>
                      <TableHead>Reporter</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredIssues.map((issue) => (
                      <TableRow key={issue.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{issue.title}</p>
                            <p className="text-sm text-muted-foreground">{issue.location}</p>
                          </div>
                        </TableCell>
                        <TableCell>{issue.reportedBy}</TableCell>
                        <TableCell>
                          <Select value={issue.status} onValueChange={(value) => updateIssueStatus(issue.id, value)}>
                            <SelectTrigger className="w-[120px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="in-progress">In Progress</SelectItem>
                              <SelectItem value="resolved">Resolved</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Badge className={getUrgencyColor(issue.urgency)}>{issue.urgency}</Badge>
                        </TableCell>
                        <TableCell>
                          <Select
                            value={issue.assignedDepartment || ""}
                            onValueChange={(value) => assignDepartment(issue.id, value)}
                          >
                            <SelectTrigger className="w-[160px]">
                              <SelectValue placeholder="Assign dept." />
                            </SelectTrigger>
                            <SelectContent>
                              {departments.map((dept) => (
                                <SelectItem key={dept} value={dept}>
                                  {dept}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell className="text-sm">{formatDate(issue.reportedAt)}</TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="sm" onClick={() => setSelectedIssueId(issue.id)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
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

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Issue Categories
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {["roads", "electricity", "sanitation", "water", "traffic"].map((category) => {
                      const count = issues.filter((i) => i.category === category).length
                      const percentage = issues.length > 0 ? Math.round((count / issues.length) * 100) : 0
                      return (
                        <div key={category} className="flex items-center justify-between">
                          <span className="capitalize">{category}</span>
                          <div className="flex items-center gap-2">
                            <div className="w-20 bg-muted rounded-full h-2">
                              <div className="bg-primary h-2 rounded-full" style={{ width: `${percentage}%` }} />
                            </div>
                            <span className="text-sm text-muted-foreground">{count}</span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Resolution Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600">
                        {stats.total > 0 ? Math.round((stats.resolved / stats.total) * 100) : 0}%
                      </div>
                      <p className="text-sm text-muted-foreground">Overall Resolution Rate</p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Average Resolution Time</span>
                        <span className="font-medium">3.2 days</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Issues This Month</span>
                        <span className="font-medium">+{stats.total}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Citizen Satisfaction</span>
                        <span className="font-medium">4.2/5</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Department Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Department</TableHead>
                      <TableHead>Assigned Issues</TableHead>
                      <TableHead>Resolved</TableHead>
                      <TableHead>Avg. Resolution Time</TableHead>
                      <TableHead>Performance</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {departmentStats.map(({ dept, assigned, resolved, performance }) => (
                      <TableRow key={dept}>
                        <TableCell className="font-medium">{dept}</TableCell>
                        <TableCell>{assigned}</TableCell>
                        <TableCell>{resolved}</TableCell>
                        <TableCell>{Math.floor(Math.random() * 5) + 2} days</TableCell>
                        <TableCell>
                          <Badge
                            className={
                              performance >= 80
                                ? "bg-green-100 text-green-800"
                                : performance >= 60
                                  ? "bg-orange-100 text-orange-800"
                                  : "bg-red-100 text-red-800"
                            }
                          >
                            {performance}%
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Issue Details Modal */}
      {selectedIssueId && (
        <IssueDetailsModal issueId={selectedIssueId} onClose={() => setSelectedIssueId(null)} isAdmin={true} />
      )}

      {/* Proof Upload Modal */}
      {proofUpload && (
        <ProofUploadModal
          issueId={proofUpload.issueId}
          currentStatus={proofUpload.currentStatus}
          newStatus={proofUpload.newStatus}
          onClose={() => setProofUpload(null)}
          onConfirm={() => setProofUpload(null)}
        />
      )}
    </div>
  )
}
