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
import { useCommunityStore } from "@/lib/community-store"
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
  UserPlus,
  UserMinus,
  CheckCircle,
  XCircle,
} from "lucide-react"

export function CommunityDashboard() {
  const { user } = useAuth()
  const { t } = useLanguage()
  
  // Community store hooks
  const {
    communities,
    userMemberships,
    userJoinRequests,
    joinCommunity,
    leaveCommunity,
    requestToJoinCommunity,
    addCommunity,
    addDiscussion,
    likeDiscussion,
    unlikeDiscussion,
    viewDiscussion,
    getTrendingCommunities,
    searchCommunities,
    getDiscussionsByCommunity
  } = useCommunityStore()
  
  const [activeTab, setActiveTab] = useState("browse")
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState("all")
  const [filterRegion, setFilterRegion] = useState("all")
  const [showCreateTopic, setShowCreateTopic] = useState(false)
  const [showCreateDiscussion, setShowCreateDiscussion] = useState(false)
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null)
  
  // Form states
  const [newTopicTitle, setNewTopicTitle] = useState("")
  const [newTopicDescription, setNewTopicDescription] = useState("")
  const [newTopicCategory, setNewTopicCategory] = useState("")
  const [newTopicRegion, setNewTopicRegion] = useState("")
  
  const [newDiscussionTitle, setNewDiscussionTitle] = useState("")
  const [newDiscussionContent, setNewDiscussionContent] = useState("")
  const [newDiscussionTopic, setNewDiscussionTopic] = useState("")
  const [newDiscussionTags, setNewDiscussionTags] = useState("")

  const filteredCommunities = communities.filter((community) => {
    const matchesSearch =
      community.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      community.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filterCategory === "all" || community.category === filterCategory
    const matchesRegion = filterRegion === "all" || community.region === filterRegion || community.region === "all"
    return matchesSearch && matchesCategory && matchesRegion
  })

  const myCommunitiesData = communities.filter(community => 
    userMemberships.includes(community.id)
  )

  const trendingCommunitiesData = communities.filter(community => community.trending)

  const allDiscussions = communities.flatMap(community => 
    community.posts.map(post => ({ ...post, communityTitle: community.title }))
  )

  const filteredDiscussions = selectedTopic 
    ? getDiscussionsByCommunity(selectedTopic).map(post => ({ 
        ...post, 
        communityTitle: communities.find(c => c.id === selectedTopic)?.title || "" 
      }))
    : allDiscussions.filter((discussion) => {
        const matchesSearch =
          discussion.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          discussion.content.toLowerCase().includes(searchTerm.toLowerCase())
        return matchesSearch
      })

  const handleJoinCommunity = (communityId: string) => {
    if (!user) return
    
    const community = communities.find(c => c.id === communityId)
    if (!community) return
    
    if (community.isPrivate) {
      requestToJoinCommunity(communityId, user.id || user.name)
    } else {
      joinCommunity(communityId, user.id || user.name)
    }
  }

  const handleLeaveCommunity = (communityId: string) => {
    if (!user) return
    leaveCommunity(communityId, user.id || user.name)
  }

  const handleCreateTopic = () => {
    if (!user || !newTopicTitle || !newTopicDescription || !newTopicCategory || !newTopicRegion) return

    addCommunity({
      title: newTopicTitle,
      description: newTopicDescription,
      category: newTopicCategory,
      region: newTopicRegion,
      members: [user.id || user.name],
      lastActivity: "just now",
      trending: false,
      moderator: user.name,
      createdAt: new Date().toISOString(),
      rules: ["Be respectful to all members", "Stay on topic", "No spam or promotional content"],
      tags: [newTopicCategory, newTopicRegion],
      isPrivate: false,
      joinRequests: []
    })

    // Reset form
    setNewTopicTitle("")
    setNewTopicDescription("")
    setNewTopicCategory("")
    setNewTopicRegion("")
    setShowCreateTopic(false)
  }

  const handleCreateDiscussion = () => {
    if (!user || !newDiscussionTitle || !newDiscussionContent || !newDiscussionTopic) return

    addDiscussion({
      communityId: newDiscussionTopic,
      title: newDiscussionTitle,
      content: newDiscussionContent,
      author: user.name,
      authorId: user.id || user.name,
      authorAvatar: "/placeholder.svg?height=32&width=32",
      createdAt: "just now",
      updatedAt: "just now",
      tags: newDiscussionTags.split(",").map(tag => tag.trim()).filter(tag => tag),
      isPinned: false,
      isLocked: false
    })

    // Reset form
    setNewDiscussionTitle("")
    setNewDiscussionContent("")
    setNewDiscussionTopic("")
    setNewDiscussionTags("")
    setShowCreateDiscussion(false)
  }

  const handleLikeDiscussion = (discussionId: string, isLiked: boolean) => {
    if (!user) return
    
    if (isLiked) {
      unlikeDiscussion(discussionId, user.id || user.name)
    } else {
      likeDiscussion(discussionId, user.id || user.name)
      viewDiscussion(discussionId, user.id || user.name)
    }
  }

  const isUserMember = (communityId: string) => {
    return userMemberships.includes(communityId)
  }

  const hasUserRequestedToJoin = (communityId: string) => {
    return userJoinRequests.includes(communityId)
  }

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
            Create Community
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
            <CardTitle className="text-sm font-medium">Total Communities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{communities.length}</div>
            <p className="text-xs text-muted-foreground">Available communities</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">My Communities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{myCommunitiesData.length}</div>
            <p className="text-xs text-muted-foreground">Joined communities</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Members</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {communities.reduce((sum: number, community) => sum + community.memberCount, 0)}
            </div>
            <p className="text-xs text-muted-foreground">Community participants</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Discussions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{allDiscussions.length}</div>
            <p className="text-xs text-muted-foreground">Ongoing conversations</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-[500px]">
          <TabsTrigger value="browse">Browse</TabsTrigger>
          <TabsTrigger value="my-communities">My Communities</TabsTrigger>
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

        <TabsContent value="browse" className="space-y-4">
          <div className="grid gap-4">
            {filteredCommunities.map((community) => (
              <Card
                key={community.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <CardTitle className="text-lg">{community.title}</CardTitle>
                        {community.trending && (
                          <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                            <TrendingUp className="mr-1 h-3 w-3" />
                            Trending
                          </Badge>
                        )}
                        {community.isPrivate && (
                          <Badge variant="outline">Private</Badge>
                        )}
                      </div>
                      <CardDescription>{community.description}</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="capitalize">
                        {community.category}
                      </Badge>
                      {isUserMember(community.id) ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleLeaveCommunity(community.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <UserMinus className="mr-1 h-3 w-3" />
                          Leave
                        </Button>
                      ) : hasUserRequestedToJoin(community.id) ? (
                        <Button variant="outline" size="sm" disabled>
                          <Clock className="mr-1 h-3 w-3" />
                          Pending
                        </Button>
                      ) : (
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => handleJoinCommunity(community.id)}
                        >
                          <UserPlus className="mr-1 h-3 w-3" />
                          Join
                        </Button>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {community.memberCount} members
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="h-3 w-3" />
                        {community.postCount} posts
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {community.region === "all" ? "All Regions" : community.region}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>Moderated by {community.moderator}</span>
                      <span>•</span>
                      <span>{community.lastActivity}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="my-communities" className="space-y-4">
          <div className="grid gap-4">
            {myCommunitiesData.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Users className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No communities joined yet</h3>
                  <p className="text-muted-foreground text-center mb-4">
                    Browse and join communities to start connecting with your neighbors
                  </p>
                  <Button onClick={() => setActiveTab("browse")}>
                    Browse Communities
                  </Button>
                </CardContent>
              </Card>
            ) : (
              myCommunitiesData.map((community) => (
                <Card
                  key={community.id}
                  className="hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => setSelectedTopic(community.id)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <CardTitle className="text-lg">{community.title}</CardTitle>
                          {community.trending && (
                            <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                              <TrendingUp className="mr-1 h-3 w-3" />
                              Trending
                            </Badge>
                          )}
                          <Badge variant="secondary" className="bg-green-100 text-green-800">
                            <CheckCircle className="mr-1 h-3 w-3" />
                            Joined
                          </Badge>
                        </div>
                        <CardDescription>{community.description}</CardDescription>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleLeaveCommunity(community.id)
                        }}
                        className="text-red-600 hover:text-red-700"
                      >
                        <UserMinus className="mr-1 h-3 w-3" />
                        Leave
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {community.memberCount} members
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageSquare className="h-3 w-3" />
                          {community.postCount} posts
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {community.region === "all" ? "All Regions" : community.region}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>Moderated by {community.moderator}</span>
                        <span>•</span>
                        <span>{community.lastActivity}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="discussions" className="space-y-4">
          {selectedTopic && (
            <div className="flex items-center gap-2 mb-4">
              <Button variant="outline" size="sm" onClick={() => setSelectedTopic(null)}>
                ← All Discussions
              </Button>
              <span className="text-sm text-muted-foreground">
                Showing discussions from: {communities.find((c) => c.id === selectedTopic)?.title}
              </span>
            </div>
          )}

          <div className="space-y-4">
            {filteredDiscussions.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No discussions yet</h3>
                  <p className="text-muted-foreground text-center mb-4">
                    Be the first to start a discussion in your community
                  </p>
                  <Button onClick={() => setShowCreateDiscussion(true)}>
                    Start Discussion
                  </Button>
                </CardContent>
              </Card>
            ) : (
              filteredDiscussions.map((discussion) => {
                const isLiked = user ? discussion.likes.includes(user.id || user.name) : false
                return (
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
                          <div className="flex items-center gap-2 mb-1">
                            <CardTitle className="text-base">{discussion.title}</CardTitle>
                            {discussion.isPinned && (
                              <Badge variant="secondary" className="text-xs">Pinned</Badge>
                            )}
                          </div>
                          <CardDescription className="mt-1">{discussion.content}</CardDescription>
                          <div className="flex items-center gap-2 mt-2">
                            {discussion.tags.map((tag) => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                <Hash className="mr-1 h-2 w-2" />
                                {tag}
                              </Badge>
                            ))}
                          </div>
                          {selectedTopic === null && (
                            <div className="mt-2">
                              <Badge variant="outline" className="text-xs">
                                {discussion.communityTitle}
                              </Badge>
                            </div>
                          )}
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
                            {discussion.viewCount}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleLikeDiscussion(discussion.id, isLiked)}
                            className={`flex items-center gap-1 ${
                              isLiked ? 'text-red-600 hover:text-red-700' : ''
                            }`}
                          >
                            <ThumbsUp className="h-3 w-3" />
                            {discussion.likeCount}
                          </Button>
                          <span className="flex items-center gap-1">
                            <MessageSquare className="h-3 w-3" />
                            {discussion.replyCount}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })
            )}
          </div>
        </TabsContent>

        <TabsContent value="trending" className="space-y-4">
          <div className="grid gap-4">
            {trendingCommunitiesData.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <TrendingUp className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No trending communities</h3>
                  <p className="text-muted-foreground text-center">
                    Check back later for trending communities
                  </p>
                </CardContent>
              </Card>
            ) : (
              trendingCommunitiesData.map((community) => (
                <Card key={community.id} className="hover:shadow-md transition-shadow border-orange-200">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <TrendingUp className="h-5 w-5 text-orange-600" />
                          <CardTitle className="text-lg">{community.title}</CardTitle>
                          <Badge className="bg-orange-100 text-orange-800">Hot Topic</Badge>
                        </div>
                        <CardDescription>{community.description}</CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        {isUserMember(community.id) ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleLeaveCommunity(community.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <UserMinus className="mr-1 h-3 w-3" />
                            Leave
                          </Button>
                        ) : hasUserRequestedToJoin(community.id) ? (
                          <Button variant="outline" size="sm" disabled>
                            <Clock className="mr-1 h-3 w-3" />
                            Pending
                          </Button>
                        ) : (
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => handleJoinCommunity(community.id)}
                          >
                            <UserPlus className="mr-1 h-3 w-3" />
                            Join
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {community.memberCount} members
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageSquare className="h-3 w-3" />
                          {community.postCount} posts
                        </span>
                      </div>
                      <span>{community.lastActivity}</span>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Create Topic Modal */}
      {showCreateTopic && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Create New Community</CardTitle>
              <CardDescription>Start a new community for your neighborhood</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input 
                placeholder="Community title" 
                value={newTopicTitle}
                onChange={(e) => setNewTopicTitle(e.target.value)}
              />
              <Textarea 
                placeholder="Community description" 
                value={newTopicDescription}
                onChange={(e) => setNewTopicDescription(e.target.value)}
              />
              <Select value={newTopicCategory} onValueChange={setNewTopicCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="roads">Roads</SelectItem>
                  <SelectItem value="water">Water</SelectItem>
                  <SelectItem value="development">Development</SelectItem>
                  <SelectItem value="community">Community</SelectItem>
                  <SelectItem value="environment">Environment</SelectItem>
                </SelectContent>
              </Select>
              <Select value={newTopicRegion} onValueChange={setNewTopicRegion}>
                <SelectTrigger>
                  <SelectValue placeholder="Select region" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Regions</SelectItem>
                  <SelectItem value="koramangala">Koramangala</SelectItem>
                  <SelectItem value="indiranagar">Indiranagar</SelectItem>
                  <SelectItem value="whitefield">Whitefield</SelectItem>
                  <SelectItem value="jayanagar">Jayanagar</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex gap-2">
                <Button 
                  className="flex-1" 
                  onClick={handleCreateTopic}
                  disabled={!newTopicTitle || !newTopicDescription || !newTopicCategory || !newTopicRegion}
                >
                  Create Community
                </Button>
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
              <Select value={newDiscussionTopic} onValueChange={setNewDiscussionTopic}>
                <SelectTrigger>
                  <SelectValue placeholder="Select community" />
                </SelectTrigger>
                <SelectContent>
                  {myCommunitiesData.map((community) => (
                    <SelectItem key={community.id} value={community.id}>
                      {community.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input 
                placeholder="Discussion title" 
                value={newDiscussionTitle}
                onChange={(e) => setNewDiscussionTitle(e.target.value)}
              />
              <Textarea 
                placeholder="What would you like to discuss?" 
                value={newDiscussionContent}
                onChange={(e) => setNewDiscussionContent(e.target.value)}
              />
              <Input 
                placeholder="Tags (comma separated)" 
                value={newDiscussionTags}
                onChange={(e) => setNewDiscussionTags(e.target.value)}
              />
              <div className="flex gap-2">
                <Button 
                  className="flex-1" 
                  onClick={handleCreateDiscussion}
                  disabled={!newDiscussionTitle || !newDiscussionContent || !newDiscussionTopic}
                >
                  Start Discussion
                </Button>
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
