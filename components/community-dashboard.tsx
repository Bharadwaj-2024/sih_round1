"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/components/auth-provider"
import { useLanguage } from "@/components/language-provider"
import {
  Users,
  MessageSquare,
  Plus,
  Search,
  Filter,
  MapPin,
  Clock,
  ThumbsUp,
  Eye,
  Hash,
  TrendingUp,
} from "lucide-react"

// Mock community data
const mockCommunityData = {
  topics: [
    {
      id: "1",
      title: "Road Safety Initiatives",
      description: "Discuss road safety measures and traffic improvements",
      category: "roads",
      region: "all",
      members: 156,
      posts: 23,
      lastActivity: "2 hours ago",
      trending: true,
      moderator: "Admin Team",
    },
    {
      id: "2",
      title: "Koramangala Development",
      description: "Local development discussions for Koramangala residents",
      category: "development",
      region: "koramangala",
      members: 89,
      posts: 45,
      lastActivity: "1 hour ago",
      trending: false,
      moderator: "Local Council",
    },
    {
      id: "3",
      title: "Water Conservation",
      description: "Share ideas and initiatives for water conservation",
      category: "water",
      region: "all",
      members: 234,
      posts: 67,
      lastActivity: "30 minutes ago",
      trending: true,
      moderator: "Environmental Team",
    },
    {
      id: "4",
      title: "Indiranagar Community",
      description: "Connect with your Indiranagar neighbors",
      category: "community",
      region: "indiranagar",
      members: 178,
      posts: 89,
      lastActivity: "15 minutes ago",
      trending: false,
      moderator: "Residents Association",
    },
  ],
  discussions: [
    {
      id: "1",
      topicId: "1",
      title: "New Speed Bumps on MG Road - Thoughts?",
      content: "The city has installed new speed bumps on MG Road. What are your thoughts on their effectiveness?",
      author: "Priya Sharma",
      authorAvatar: "/placeholder.svg?height=32&width=32",
      createdAt: "2 hours ago",
      replies: 12,
      likes: 8,
      views: 45,
      tags: ["traffic", "mg-road", "safety"],
    },
    {
      id: "2",
      topicId: "2",
      title: "Community Garden Proposal",
      content: "I'd like to propose creating a community garden in the empty lot near Forum Mall. Who's interested?",
      author: "Rajesh Kumar",
      authorAvatar: "/placeholder.svg?height=32&width=32",
      createdAt: "1 hour ago",
      replies: 18,
      likes: 15,
      views: 67,
      tags: ["community", "garden", "koramangala"],
    },
    {
      id: "3",
      topicId: "3",
      title: "Rainwater Harvesting Success Story",
      content: "Our apartment complex successfully implemented rainwater harvesting. Here's what we learned...",
      author: "Meera Nair",
      authorAvatar: "/placeholder.svg?height=32&width=32",
      createdAt: "30 minutes ago",
      replies: 6,
      likes: 22,
      views: 89,
      tags: ["water", "harvesting", "apartment"],
    },
  ],
}

export function CommunityDashboard() {
  const { user } = useAuth()
  const { t } = useLanguage()
  const [activeTab, setActiveTab] = useState("topics")
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState("all")
  const [filterRegion, setFilterRegion] = useState("all")
  const [showCreateTopic, setShowCreateTopic] = useState(false)
  const [showCreateDiscussion, setShowCreateDiscussion] = useState(false)
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null)

  const filteredTopics = mockCommunityData.topics.filter((topic) => {
    const matchesSearch =
      topic.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      topic.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filterCategory === "all" || topic.category === filterCategory
    const matchesRegion = filterRegion === "all" || topic.region === filterRegion || topic.region === "all"
    return matchesSearch && matchesCategory && matchesRegion
  })

  const filteredDiscussions = mockCommunityData.discussions.filter((discussion) => {
    const matchesSearch =
      discussion.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      discussion.content.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesTopic = selectedTopic ? discussion.topicId === selectedTopic : true
    return matchesSearch && matchesTopic
  })

  return (
    <div className="space-y-6">
      {/* Community Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Users className="h-6 w-6" />
            Community Hub
          </h1>
          <p className="text-muted-foreground">Connect, discuss, and collaborate with your neighbors</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setShowCreateTopic(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create Topic
          </Button>
          <Button variant="outline" onClick={() => setShowCreateDiscussion(true)}>
            <MessageSquare className="mr-2 h-4 w-4" />
            Start Discussion
          </Button>
        </div>
      </div>

      {/* Community Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Topics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockCommunityData.topics.length}</div>
            <p className="text-xs text-muted-foreground">Discussion groups</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Members</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockCommunityData.topics.reduce((sum, topic) => sum + topic.members, 0)}
            </div>
            <p className="text-xs text-muted-foreground">Community participants</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Discussions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockCommunityData.discussions.length}</div>
            <p className="text-xs text-muted-foreground">Active conversations</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Your Contributions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">Posts and replies</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
          <TabsTrigger value="topics">Topics</TabsTrigger>
          <TabsTrigger value="discussions">Discussions</TabsTrigger>
          <TabsTrigger value="trending">Trending</TabsTrigger>
        </TabsList>

        {/* Search and Filters */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search topics and discussions..."
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
                <SelectItem value="roads">Roads</SelectItem>
                <SelectItem value="water">Water</SelectItem>
                <SelectItem value="development">Development</SelectItem>
                <SelectItem value="community">Community</SelectItem>
                <SelectItem value="environment">Environment</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterRegion} onValueChange={setFilterRegion}>
              <SelectTrigger className="w-[140px]">
                <MapPin className="mr-2 h-4 w-4" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Regions</SelectItem>
                <SelectItem value="koramangala">Koramangala</SelectItem>
                <SelectItem value="indiranagar">Indiranagar</SelectItem>
                <SelectItem value="whitefield">Whitefield</SelectItem>
                <SelectItem value="jayanagar">Jayanagar</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <TabsContent value="topics" className="space-y-4">
          <div className="grid gap-4">
            {filteredTopics.map((topic) => (
              <Card
                key={topic.id}
                className="hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => setSelectedTopic(topic.id)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <CardTitle className="text-lg">{topic.title}</CardTitle>
                        {topic.trending && (
                          <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                            <TrendingUp className="mr-1 h-3 w-3" />
                            Trending
                          </Badge>
                        )}
                      </div>
                      <CardDescription>{topic.description}</CardDescription>
                    </div>
                    <Badge variant="outline" className="capitalize">
                      {topic.category}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {topic.members} members
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="h-3 w-3" />
                        {topic.posts} posts
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {topic.region === "all" ? "All Regions" : topic.region}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>Moderated by {topic.moderator}</span>
                      <span>•</span>
                      <span>{topic.lastActivity}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="discussions" className="space-y-4">
          {selectedTopic && (
            <div className="flex items-center gap-2 mb-4">
              <Button variant="outline" size="sm" onClick={() => setSelectedTopic(null)}>
                ← All Discussions
              </Button>
              <span className="text-sm text-muted-foreground">
                Showing discussions from: {mockCommunityData.topics.find((t) => t.id === selectedTopic)?.title}
              </span>
            </div>
          )}

          <div className="space-y-4">
            {filteredDiscussions.map((discussion) => (
              <Card key={discussion.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={discussion.authorAvatar || "/placeholder.svg"} />
                      <AvatarFallback>
                        {discussion.author
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <CardTitle className="text-base">{discussion.title}</CardTitle>
                      <CardDescription className="mt-1">{discussion.content}</CardDescription>
                      <div className="flex items-center gap-2 mt-2">
                        {discussion.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            <Hash className="mr-1 h-2 w-2" />
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-4">
                      <span>by {discussion.author}</span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {discussion.createdAt}
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {discussion.views}
                      </span>
                      <span className="flex items-center gap-1">
                        <ThumbsUp className="h-3 w-3" />
                        {discussion.likes}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="h-3 w-3" />
                        {discussion.replies}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="trending" className="space-y-4">
          <div className="grid gap-4">
            {mockCommunityData.topics
              .filter((topic) => topic.trending)
              .map((topic) => (
                <Card key={topic.id} className="hover:shadow-md transition-shadow border-orange-200">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <TrendingUp className="h-5 w-5 text-orange-600" />
                          <CardTitle className="text-lg">{topic.title}</CardTitle>
                          <Badge className="bg-orange-100 text-orange-800">Hot Topic</Badge>
                        </div>
                        <CardDescription>{topic.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {topic.members} members
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageSquare className="h-3 w-3" />
                          {topic.posts} posts
                        </span>
                      </div>
                      <span>{topic.lastActivity}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Create Topic Modal */}
      {showCreateTopic && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Create New Topic</CardTitle>
              <CardDescription>Start a new discussion topic for your community</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input placeholder="Topic title" />
              <Textarea placeholder="Topic description" />
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="roads">Roads</SelectItem>
                  <SelectItem value="water">Water</SelectItem>
                  <SelectItem value="development">Development</SelectItem>
                  <SelectItem value="community">Community</SelectItem>
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select region" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Regions</SelectItem>
                  <SelectItem value="koramangala">Koramangala</SelectItem>
                  <SelectItem value="indiranagar">Indiranagar</SelectItem>
                  <SelectItem value="whitefield">Whitefield</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex gap-2">
                <Button className="flex-1">Create Topic</Button>
                <Button variant="outline" onClick={() => setShowCreateTopic(false)}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Create Discussion Modal */}
      {showCreateDiscussion && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Start New Discussion</CardTitle>
              <CardDescription>Share your thoughts with the community</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select topic" />
                </SelectTrigger>
                <SelectContent>
                  {mockCommunityData.topics.map((topic) => (
                    <SelectItem key={topic.id} value={topic.id}>
                      {topic.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input placeholder="Discussion title" />
              <Textarea placeholder="What would you like to discuss?" />
              <Input placeholder="Tags (comma separated)" />
              <div className="flex gap-2">
                <Button className="flex-1">Start Discussion</Button>
                <Button variant="outline" onClick={() => setShowCreateDiscussion(false)}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
