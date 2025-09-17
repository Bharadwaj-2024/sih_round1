"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface Community {
  id: string
  title: string
  description: string
  category: string
  region: string
  members: string[] // Array of user IDs
  memberCount: number
  posts: Discussion[]
  postCount: number
  lastActivity: string
  trending: boolean
  moderator: string
  createdAt: string
  rules?: string[]
  tags: string[]
  isPrivate: boolean
  joinRequests: string[] // Array of user IDs with pending requests
}

export interface Discussion {
  id: string
  communityId: string
  title: string
  content: string
  author: string
  authorId: string
  authorAvatar?: string
  createdAt: string
  updatedAt: string
  replies: Reply[]
  replyCount: number
  likes: string[] // Array of user IDs who liked
  likeCount: number
  views: string[] // Array of user IDs who viewed
  viewCount: number
  tags: string[]
  isPinned: boolean
  isLocked: boolean
}

export interface Reply {
  id: string
  discussionId: string
  content: string
  author: string
  authorId: string
  authorAvatar?: string
  createdAt: string
  likes: string[] // Array of user IDs who liked
  likeCount: number
  parentReplyId?: string // For nested replies
}

interface CommunityStore {
  communities: Community[]
  userMemberships: string[] // Community IDs the current user is a member of
  userJoinRequests: string[] // Community IDs the current user has requested to join
  
  // Community management
  addCommunity: (community: Omit<Community, "id" | "memberCount" | "postCount" | "posts">) => void
  updateCommunity: (id: string, updates: Partial<Community>) => void
  deleteCommunity: (id: string) => void
  
  // Membership management
  joinCommunity: (communityId: string, userId: string) => void
  leaveCommunity: (communityId: string, userId: string) => void
  requestToJoinCommunity: (communityId: string, userId: string) => void
  approveJoinRequest: (communityId: string, userId: string) => void
  rejectJoinRequest: (communityId: string, userId: string) => void
  
  // Discussion management
  addDiscussion: (discussion: Omit<Discussion, "id" | "replies" | "replyCount" | "likes" | "likeCount" | "views" | "viewCount">) => void
  updateDiscussion: (id: string, updates: Partial<Discussion>) => void
  deleteDiscussion: (id: string) => void
  
  // Reply management
  addReply: (reply: Omit<Reply, "id" | "likes" | "likeCount">) => void
  updateReply: (id: string, updates: Partial<Reply>) => void
  deleteReply: (id: string) => void
  
  // Interaction management
  likeDiscussion: (discussionId: string, userId: string) => void
  unlikeDiscussion: (discussionId: string, userId: string) => void
  likeReply: (replyId: string, userId: string) => void
  unlikeReply: (replyId: string, userId: string) => void
  viewDiscussion: (discussionId: string, userId: string) => void
  
  // Getters
  getCommunityById: (id: string) => Community | undefined
  getDiscussionById: (id: string) => Discussion | undefined
  getDiscussionsByCommunity: (communityId: string) => Discussion[]
  getUserMemberships: () => Community[]
  getTrendingCommunities: () => Community[]
  searchCommunities: (query: string) => Community[]
}

// Initial mock data
const initialCommunities: Community[] = [
  {
    id: "1",
    title: "Road Safety Initiatives",
    description: "Discuss road safety measures and traffic improvements",
    category: "roads",
    region: "all",
    members: ["user1", "user2", "user3"],
    memberCount: 156,
    posts: [],
    postCount: 23,
    lastActivity: "2 hours ago",
    trending: true,
    moderator: "Admin Team",
    createdAt: "2024-01-01",
    rules: [
      "Be respectful to all members",
      "Stay on topic",
      "No spam or promotional content",
      "Report unsafe road conditions responsibly"
    ],
    tags: ["safety", "roads", "traffic"],
    isPrivate: false,
    joinRequests: []
  },
  {
    id: "2",
    title: "Koramangala Development",
    description: "Local development discussions for Koramangala residents",
    category: "development",
    region: "koramangala",
    members: ["user1", "user4", "user5"],
    memberCount: 89,
    posts: [],
    postCount: 45,
    lastActivity: "1 hour ago",
    trending: false,
    moderator: "Local Council",
    createdAt: "2024-01-05",
    rules: [
      "Must be a Koramangala resident",
      "Discuss local issues only",
      "Provide constructive feedback"
    ],
    tags: ["koramangala", "development", "local"],
    isPrivate: false,
    joinRequests: []
  },
  {
    id: "3",
    title: "Water Conservation",
    description: "Share ideas and initiatives for water conservation",
    category: "water",
    region: "all",
    members: ["user2", "user3", "user6"],
    memberCount: 234,
    posts: [],
    postCount: 67,
    lastActivity: "30 minutes ago",
    trending: true,
    moderator: "Environmental Team",
    createdAt: "2024-01-03",
    rules: [
      "Share practical conservation tips",
      "Support evidence-based solutions",
      "Encourage community participation"
    ],
    tags: ["water", "conservation", "environment"],
    isPrivate: false,
    joinRequests: []
  },
  {
    id: "4",
    title: "Indiranagar Community",
    description: "Connect with your Indiranagar neighbors",
    category: "community",
    region: "indiranagar",
    members: ["user3", "user7", "user8"],
    memberCount: 178,
    posts: [],
    postCount: 89,
    lastActivity: "15 minutes ago",
    trending: false,
    moderator: "Residents Association",
    createdAt: "2024-01-02",
    rules: [
      "Residents and workers in Indiranagar welcome",
      "Help build a stronger community",
      "Share local events and news"
    ],
    tags: ["indiranagar", "community", "neighbors"],
    isPrivate: false,
    joinRequests: []
  }
]

const initialDiscussions: Discussion[] = [
  {
    id: "1",
    communityId: "1",
    title: "New Speed Bumps on MG Road - Thoughts?",
    content: "The city has installed new speed bumps on MG Road. What are your thoughts on their effectiveness?",
    author: "Priya Sharma",
    authorId: "user1",
    authorAvatar: "/placeholder.svg?height=32&width=32",
    createdAt: "2 hours ago",
    updatedAt: "2 hours ago",
    replies: [],
    replyCount: 12,
    likes: ["user2", "user3"],
    likeCount: 8,
    views: ["user1", "user2", "user3", "user4"],
    viewCount: 45,
    tags: ["traffic", "mg-road", "safety"],
    isPinned: false,
    isLocked: false
  },
  {
    id: "2",
    communityId: "2",
    title: "Community Garden Proposal",
    content: "I'd like to propose creating a community garden in the empty lot near Forum Mall. Who's interested?",
    author: "Rajesh Kumar",
    authorId: "user4",
    authorAvatar: "/placeholder.svg?height=32&width=32",
    createdAt: "1 hour ago",
    updatedAt: "1 hour ago",
    replies: [],
    replyCount: 18,
    likes: ["user1", "user5", "user6"],
    likeCount: 15,
    views: ["user1", "user4", "user5", "user6", "user7"],
    viewCount: 67,
    tags: ["community", "garden", "koramangala"],
    isPinned: true,
    isLocked: false
  },
  {
    id: "3",
    communityId: "3",
    title: "Rainwater Harvesting Success Story",
    content: "Our apartment complex successfully implemented rainwater harvesting. Here's what we learned...",
    author: "Meera Nair",
    authorId: "user2",
    authorAvatar: "/placeholder.svg?height=32&width=32",
    createdAt: "30 minutes ago",
    updatedAt: "30 minutes ago",
    replies: [],
    replyCount: 6,
    likes: ["user3", "user6", "user8"],
    likeCount: 22,
    views: ["user2", "user3", "user6", "user8", "user9"],
    viewCount: 89,
    tags: ["water", "harvesting", "apartment"],
    isPinned: false,
    isLocked: false
  }
]

export const useCommunityStore = create<CommunityStore>()(
  persist(
    (set, get) => ({
      communities: initialCommunities,
      userMemberships: ["1", "3"], // Default user is member of communities 1 and 3
      userJoinRequests: [],

      // Community management
      addCommunity: (communityData) => {
        const newCommunity: Community = {
          ...communityData,
          id: Date.now().toString(),
          memberCount: communityData.members.length,
          postCount: 0,
          posts: []
        }
        set((state) => ({
          communities: [...state.communities, newCommunity]
        }))
      },

      updateCommunity: (id, updates) => {
        set((state) => ({
          communities: state.communities.map((community) =>
            community.id === id ? { ...community, ...updates } : community
          )
        }))
      },

      deleteCommunity: (id) => {
        set((state) => ({
          communities: state.communities.filter((community) => community.id !== id)
        }))
      },

      // Membership management
      joinCommunity: (communityId, userId) => {
        set((state) => ({
          communities: state.communities.map((community) =>
            community.id === communityId
              ? {
                  ...community,
                  members: [...community.members, userId],
                  memberCount: community.memberCount + 1,
                  joinRequests: community.joinRequests.filter(req => req !== userId)
                }
              : community
          ),
          userMemberships: [...state.userMemberships, communityId],
          userJoinRequests: state.userJoinRequests.filter(req => req !== communityId)
        }))
      },

      leaveCommunity: (communityId, userId) => {
        set((state) => ({
          communities: state.communities.map((community) =>
            community.id === communityId
              ? {
                  ...community,
                  members: community.members.filter(member => member !== userId),
                  memberCount: Math.max(0, community.memberCount - 1)
                }
              : community
          ),
          userMemberships: state.userMemberships.filter(membership => membership !== communityId)
        }))
      },

      requestToJoinCommunity: (communityId, userId) => {
        set((state) => ({
          communities: state.communities.map((community) =>
            community.id === communityId
              ? {
                  ...community,
                  joinRequests: [...community.joinRequests, userId]
                }
              : community
          ),
          userJoinRequests: [...state.userJoinRequests, communityId]
        }))
      },

      approveJoinRequest: (communityId, userId) => {
        get().joinCommunity(communityId, userId)
      },

      rejectJoinRequest: (communityId, userId) => {
        set((state) => ({
          communities: state.communities.map((community) =>
            community.id === communityId
              ? {
                  ...community,
                  joinRequests: community.joinRequests.filter(req => req !== userId)
                }
              : community
          )
        }))
      },

      // Discussion management
      addDiscussion: (discussionData) => {
        const newDiscussion: Discussion = {
          ...discussionData,
          id: Date.now().toString(),
          replies: [],
          replyCount: 0,
          likes: [],
          likeCount: 0,
          views: [],
          viewCount: 0
        }
        
        set((state) => ({
          communities: state.communities.map((community) =>
            community.id === discussionData.communityId
              ? {
                  ...community,
                  posts: [...community.posts, newDiscussion],
                  postCount: community.postCount + 1,
                  lastActivity: "just now"
                }
              : community
          )
        }))
      },

      updateDiscussion: (id, updates) => {
        set((state) => ({
          communities: state.communities.map((community) => ({
            ...community,
            posts: community.posts.map((discussion) =>
              discussion.id === id ? { ...discussion, ...updates } : discussion
            )
          }))
        }))
      },

      deleteDiscussion: (id) => {
        set((state) => ({
          communities: state.communities.map((community) => ({
            ...community,
            posts: community.posts.filter((discussion) => discussion.id !== id),
            postCount: Math.max(0, community.postCount - 1)
          }))
        }))
      },

      // Reply management
      addReply: (replyData) => {
        const newReply: Reply = {
          ...replyData,
          id: Date.now().toString(),
          likes: [],
          likeCount: 0
        }
        
        set((state) => ({
          communities: state.communities.map((community) => ({
            ...community,
            posts: community.posts.map((discussion) =>
              discussion.id === replyData.discussionId
                ? {
                    ...discussion,
                    replies: [...discussion.replies, newReply],
                    replyCount: discussion.replyCount + 1
                  }
                : discussion
            )
          }))
        }))
      },

      updateReply: (id, updates) => {
        set((state) => ({
          communities: state.communities.map((community) => ({
            ...community,
            posts: community.posts.map((discussion) => ({
              ...discussion,
              replies: discussion.replies.map((reply) =>
                reply.id === id ? { ...reply, ...updates } : reply
              )
            }))
          }))
        }))
      },

      deleteReply: (id) => {
        set((state) => ({
          communities: state.communities.map((community) => ({
            ...community,
            posts: community.posts.map((discussion) => ({
              ...discussion,
              replies: discussion.replies.filter((reply) => reply.id !== id),
              replyCount: Math.max(0, discussion.replyCount - 1)
            }))
          }))
        }))
      },

      // Interaction management
      likeDiscussion: (discussionId, userId) => {
        set((state) => ({
          communities: state.communities.map((community) => ({
            ...community,
            posts: community.posts.map((discussion) =>
              discussion.id === discussionId
                ? {
                    ...discussion,
                    likes: [...discussion.likes, userId],
                    likeCount: discussion.likeCount + 1
                  }
                : discussion
            )
          }))
        }))
      },

      unlikeDiscussion: (discussionId, userId) => {
        set((state) => ({
          communities: state.communities.map((community) => ({
            ...community,
            posts: community.posts.map((discussion) =>
              discussion.id === discussionId
                ? {
                    ...discussion,
                    likes: discussion.likes.filter(like => like !== userId),
                    likeCount: Math.max(0, discussion.likeCount - 1)
                  }
                : discussion
            )
          }))
        }))
      },

      likeReply: (replyId, userId) => {
        set((state) => ({
          communities: state.communities.map((community) => ({
            ...community,
            posts: community.posts.map((discussion) => ({
              ...discussion,
              replies: discussion.replies.map((reply) =>
                reply.id === replyId
                  ? {
                      ...reply,
                      likes: [...reply.likes, userId],
                      likeCount: reply.likeCount + 1
                    }
                  : reply
              )
            }))
          }))
        }))
      },

      unlikeReply: (replyId, userId) => {
        set((state) => ({
          communities: state.communities.map((community) => ({
            ...community,
            posts: community.posts.map((discussion) => ({
              ...discussion,
              replies: discussion.replies.map((reply) =>
                reply.id === replyId
                  ? {
                      ...reply,
                      likes: reply.likes.filter(like => like !== userId),
                      likeCount: Math.max(0, reply.likeCount - 1)
                    }
                  : reply
              )
            }))
          }))
        }))
      },

      viewDiscussion: (discussionId, userId) => {
        set((state) => ({
          communities: state.communities.map((community) => ({
            ...community,
            posts: community.posts.map((discussion) =>
              discussion.id === discussionId && !discussion.views.includes(userId)
                ? {
                    ...discussion,
                    views: [...discussion.views, userId],
                    viewCount: discussion.viewCount + 1
                  }
                : discussion
            )
          }))
        }))
      },

      // Getters
      getCommunityById: (id) => {
        return get().communities.find((community) => community.id === id)
      },

      getDiscussionById: (id) => {
        const communities = get().communities
        for (const community of communities) {
          const discussion = community.posts.find((post) => post.id === id)
          if (discussion) return discussion
        }
        return undefined
      },

      getDiscussionsByCommunity: (communityId) => {
        const community = get().getCommunityById(communityId)
        return community ? community.posts : []
      },

      getUserMemberships: () => {
        const { communities, userMemberships } = get()
        return communities.filter((community) => userMemberships.includes(community.id))
      },

      getTrendingCommunities: () => {
        return get().communities.filter((community) => community.trending)
      },

      searchCommunities: (query) => {
        const lowerQuery = query.toLowerCase()
        return get().communities.filter(
          (community) =>
            community.title.toLowerCase().includes(lowerQuery) ||
            community.description.toLowerCase().includes(lowerQuery) ||
            community.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
        )
      }
    }),
    {
      name: "community-store"
    }
  )
)

// Add initial discussions to communities
const addInitialDiscussions = () => {
  const store = useCommunityStore.getState()
  const updatedCommunities = store.communities.map(community => {
    const communityDiscussions = initialDiscussions.filter(d => d.communityId === community.id)
    return {
      ...community,
      posts: communityDiscussions,
      postCount: communityDiscussions.length
    }
  })
  
  useCommunityStore.setState({ communities: updatedCommunities })
}

// Initialize with discussions
if (typeof window !== 'undefined') {
  addInitialDiscussions()
}