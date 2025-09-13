"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface Issue {
  id: string
  title: string
  description: string
  status: "pending" | "in-progress" | "resolved"
  urgency: "low" | "medium" | "high"
  category: string
  location: string
  coordinates?: { lat: number; lng: number }
  reportedBy: string
  reportedAt: string
  assignedDepartment?: string
  upvotes: number
  downvotes: number
  comments: Comment[]
  photos?: string[]
  tags: string[]
  userVotes: Record<string, "up" | "down"> // userId -> vote type
}

export interface Comment {
  id: string
  author: string
  content: string
  timestamp: string
  isOfficial?: boolean
}

interface IssueStore {
  issues: Issue[]
  addIssue: (issue: Omit<Issue, "id" | "upvotes" | "downvotes" | "comments" | "userVotes">) => void
  updateIssue: (id: string, updates: Partial<Issue>) => void
  voteOnIssue: (issueId: string, userId: string, voteType: "up" | "down") => void
  addComment: (issueId: string, comment: Omit<Comment, "id">) => void
  getIssueById: (id: string) => Issue | undefined
}

// Initial mock data
const initialIssues: Issue[] = [
  {
    id: "1",
    title: "Large Pothole on Outer Ring Road",
    description:
      "Deep pothole near Marathahalli junction causing vehicle damage and traffic congestion during peak hours",
    status: "pending",
    urgency: "high",
    category: "roads",
    location: "Outer Ring Road, Marathahalli",
    coordinates: { lat: 12.9591, lng: 77.7017 },
    reportedBy: "Rajesh Kumar",
    reportedAt: "2024-01-15T10:30:00Z",
    assignedDepartment: "BBMP Road Infrastructure",
    upvotes: 23,
    downvotes: 2,
    tags: ["Is it a pothole?"],
    photos: ["/street-pothole.png"],
    userVotes: {},
    comments: [
      {
        id: "1",
        author: "Priya Sharma",
        content: "This pothole damaged my car's tire yesterday. Urgent repair needed!",
        timestamp: "2024-01-15T14:20:00Z",
      },
      {
        id: "2",
        author: "BBMP Road Dept",
        content: "Issue registered. Inspection scheduled for January 18th. Temporary barricading will be done.",
        timestamp: "2024-01-16T09:00:00Z",
        isOfficial: true,
      },
    ],
  },
  {
    id: "2",
    title: "Street Light Not Working - Koramangala",
    description: "Street light pole near BDA Complex has been non-functional for over a week, creating safety concerns",
    status: "in-progress",
    urgency: "medium",
    category: "electricity",
    location: "5th Block, Koramangala",
    coordinates: { lat: 12.9352, lng: 77.6245 },
    reportedBy: "Anita Reddy",
    reportedAt: "2024-01-14T14:20:00Z",
    assignedDepartment: "BESCOM",
    upvotes: 15,
    downvotes: 1,
    tags: ["Is it a street light issue?"],
    photos: [],
    userVotes: {},
    comments: [
      {
        id: "3",
        author: "BESCOM Official",
        content: "Technician assigned. Repair work will be completed by January 19th.",
        timestamp: "2024-01-17T11:30:00Z",
        isOfficial: true,
      },
    ],
  },
  {
    id: "3",
    title: "Garbage Overflow at HSR Layout",
    description: "Garbage bins overflowing for 10 days, attracting stray animals and creating unhygienic conditions",
    status: "resolved",
    urgency: "high",
    category: "sanitation",
    location: "Sector 2, HSR Layout",
    coordinates: { lat: 12.9116, lng: 77.6473 },
    reportedBy: "Vikram Singh",
    reportedAt: "2024-01-10T09:15:00Z",
    assignedDepartment: "BBMP Solid Waste Management",
    upvotes: 31,
    downvotes: 0,
    tags: ["Is it garbage collection?"],
    photos: [],
    userVotes: {},
    comments: [
      {
        id: "4",
        author: "BBMP SWM",
        content: "Garbage cleared and additional bins installed. Regular collection schedule restored.",
        timestamp: "2024-01-16T16:00:00Z",
        isOfficial: true,
      },
    ],
  },
  {
    id: "4",
    title: "Water Leakage in Indiranagar",
    description: "Major water pipe burst near Metro Station causing road flooding and water wastage",
    status: "in-progress",
    urgency: "high",
    category: "water",
    location: "100 Feet Road, Indiranagar",
    coordinates: { lat: 12.9716, lng: 77.6412 },
    reportedBy: "Meera Nair",
    reportedAt: "2024-01-16T07:45:00Z",
    assignedDepartment: "BWSSB",
    upvotes: 18,
    downvotes: 0,
    tags: ["Is it water supply?"],
    photos: [],
    userVotes: {},
    comments: [],
  },
  {
    id: "5",
    title: "Traffic Signal Malfunction - Silk Board",
    description: "Traffic lights not working properly causing major traffic jams during office hours",
    status: "pending",
    urgency: "high",
    category: "traffic",
    location: "Silk Board Junction",
    coordinates: { lat: 12.9165, lng: 77.6223 },
    reportedBy: "Arjun Patel",
    reportedAt: "2024-01-17T08:30:00Z",
    assignedDepartment: "Bangalore Traffic Police",
    upvotes: 42,
    downvotes: 1,
    tags: ["Is it traffic management?"],
    photos: [],
    userVotes: {},
    comments: [
      {
        id: "5",
        author: "Commuter123",
        content: "Stuck in traffic for 45 minutes because of this. Please fix urgently!",
        timestamp: "2024-01-17T09:15:00Z",
      },
    ],
  },
  {
    id: "6",
    title: "Broken Footpath - Brigade Road",
    description: "Damaged footpath tiles creating tripping hazards for pedestrians, especially elderly citizens",
    status: "pending",
    urgency: "medium",
    category: "roads",
    location: "Brigade Road, Near Commercial Street",
    coordinates: { lat: 12.9716, lng: 77.6103 },
    reportedBy: "Sunita Joshi",
    reportedAt: "2024-01-16T15:20:00Z",
    assignedDepartment: "BBMP Infrastructure",
    upvotes: 12,
    downvotes: 0,
    tags: ["Is it footpath?"],
    photos: [],
    userVotes: {},
    comments: [],
  },
  {
    id: "7",
    title: "Stray Dog Menace in Jayanagar",
    description: "Pack of aggressive stray dogs in 4th Block area posing threat to morning walkers and children",
    status: "pending",
    urgency: "medium",
    category: "public-safety",
    location: "4th Block, Jayanagar",
    coordinates: { lat: 12.9279, lng: 77.5937 },
    reportedBy: "Ramesh Gupta",
    reportedAt: "2024-01-15T06:30:00Z",
    assignedDepartment: "BBMP Animal Husbandry",
    upvotes: 8,
    downvotes: 3,
    tags: ["Is it animal control?"],
    photos: [],
    userVotes: {},
    comments: [],
  },
  {
    id: "8",
    title: "Illegal Parking on Residency Road",
    description: "Vehicles parked on both sides of road blocking traffic flow and emergency vehicle access",
    status: "resolved",
    urgency: "medium",
    category: "traffic",
    location: "Residency Road, Near UB City Mall",
    coordinates: { lat: 12.9716, lng: 77.6197 },
    reportedBy: "Kavya Krishnan",
    reportedAt: "2024-01-12T11:00:00Z",
    assignedDepartment: "Bangalore Traffic Police",
    upvotes: 25,
    downvotes: 5,
    tags: ["Is it illegal parking?"],
    photos: [],
    userVotes: {},
    comments: [
      {
        id: "6",
        author: "Traffic Police",
        content: "Regular patrolling increased in this area. Towing operations conducted.",
        timestamp: "2024-01-16T14:00:00Z",
        isOfficial: true,
      },
    ],
  },
]

export const useIssueStore = create<IssueStore>()(
  persist(
    (set, get) => ({
      issues: initialIssues,

      addIssue: (issueData) => {
        const newIssue: Issue = {
          ...issueData,
          id: Date.now().toString(),
          upvotes: 0,
          downvotes: 0,
          comments: [],
          userVotes: {},
        }

        set((state) => ({
          issues: [newIssue, ...state.issues],
        }))
      },

      updateIssue: (id, updates) => {
        set((state) => ({
          issues: state.issues.map((issue) => (issue.id === id ? { ...issue, ...updates } : issue)),
        }))
      },

      voteOnIssue: (issueId, userId, voteType) => {
        set((state) => ({
          issues: state.issues.map((issue) => {
            if (issue.id !== issueId) return issue

            const currentVote = issue.userVotes[userId]
            const newUserVotes = { ...issue.userVotes }
            let newUpvotes = issue.upvotes
            let newDownvotes = issue.downvotes

            // Remove previous vote if exists
            if (currentVote === "up") newUpvotes--
            if (currentVote === "down") newDownvotes--

            // Add new vote if different from current
            if (currentVote !== voteType) {
              newUserVotes[userId] = voteType
              if (voteType === "up") newUpvotes++
              if (voteType === "down") newDownvotes++
            } else {
              // Remove vote if clicking same button
              delete newUserVotes[userId]
            }

            return {
              ...issue,
              upvotes: newUpvotes,
              downvotes: newDownvotes,
              userVotes: newUserVotes,
            }
          }),
        }))
      },

      addComment: (issueId, commentData) => {
        const newComment: Comment = {
          ...commentData,
          id: Date.now().toString(),
        }

        set((state) => ({
          issues: state.issues.map((issue) =>
            issue.id === issueId ? { ...issue, comments: [...issue.comments, newComment] } : issue,
          ),
        }))
      },

      getIssueById: (id) => {
        return get().issues.find((issue) => issue.id === id)
      },
    }),
    {
      name: "civic-connect-issues",
    },
  ),
)
