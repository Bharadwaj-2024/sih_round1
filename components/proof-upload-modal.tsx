"use client"
import { useState } from "react"
import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useIssueStore } from "@/lib/issue-store"
import { X, Upload, Camera, FileText, CheckCircle } from "lucide-react"

interface ProofUploadModalProps {
  issueId: string
  currentStatus: string
  newStatus: "in-progress" | "resolved"
  onClose: () => void
  onConfirm: () => void
}

export function ProofUploadModal({ issueId, currentStatus, newStatus, onClose, onConfirm }: ProofUploadModalProps) {
  const updateIssue = useIssueStore((state) => state.updateIssue)
  const addComment = useIssueStore((state) => state.addComment)
  const [proofDescription, setProofDescription] = useState("")
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files) {
      // In a real app, these would be uploaded to a server
      const fileNames = Array.from(files).map((file) => file.name)
      setUploadedFiles((prev) => [...prev, ...fileNames])
    }
  }

  const handleSubmit = async () => {
    if (!proofDescription.trim()) {
      alert("Please provide a description of the work done.")
      return
    }

    setIsSubmitting(true)

    // Simulate upload delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Update issue status
    updateIssue(issueId, {
      status: newStatus,
      // In a real app, we'd store proof photos and description
    })

    // Add official comment with proof details
    addComment(issueId, {
      author: "Department Official",
      content: `Status updated to ${newStatus}. ${proofDescription}${uploadedFiles.length > 0 ? ` Proof documents: ${uploadedFiles.join(", ")}` : ""}`,
      timestamp: new Date().toISOString(),
      isOfficial: true,
    })

    setIsSubmitting(false)
    onConfirm()
  }

  const getStatusText = () => {
    if (newStatus === "in-progress") {
      return {
        title: "Mark as In Progress",
        description: "Provide proof that work has started on this issue",
        actionText: "Start Work",
      }
    } else {
      return {
        title: "Mark as Resolved",
        description: "Provide proof that this issue has been completely resolved",
        actionText: "Mark Resolved",
      }
    }
  }

  const statusInfo = getStatusText()

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              {newStatus === "resolved" ? <CheckCircle className="h-5 w-5" /> : <Camera className="h-5 w-5" />}
              {statusInfo.title}
            </CardTitle>
            <CardDescription>{statusInfo.description}</CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Progress Description */}
          <div>
            <Label htmlFor="proof-description">
              {newStatus === "resolved" ? "Resolution Details" : "Work Progress Details"} *
            </Label>
            <Textarea
              id="proof-description"
              placeholder={
                newStatus === "resolved"
                  ? "Describe how the issue was resolved, what actions were taken, and current status..."
                  : "Describe what work has been started, timeline, and next steps..."
              }
              value={proofDescription}
              onChange={(e) => setProofDescription(e.target.value)}
              rows={4}
              className="mt-2"
            />
          </div>

          {/* File Upload */}
          <div>
            <Label>Upload Proof Photos/Documents</Label>
            <div className="mt-2 border-2 border-dashed border-muted-foreground/25 rounded-lg p-6">
              <div className="text-center">
                <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground mb-2">
                  Upload photos showing {newStatus === "resolved" ? "completed work" : "work in progress"}
                </p>
                <input
                  type="file"
                  multiple
                  accept="image/*,.pdf,.doc,.docx"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />
                <Button variant="outline" size="sm" onClick={() => document.getElementById("file-upload")?.click()}>
                  <Camera className="h-4 w-4 mr-2" />
                  Choose Files
                </Button>
              </div>
            </div>

            {/* Uploaded Files List */}
            {uploadedFiles.length > 0 && (
              <div className="mt-3">
                <p className="text-sm font-medium mb-2">Uploaded Files:</p>
                <div className="space-y-1">
                  {uploadedFiles.map((fileName, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm bg-muted p-2 rounded">
                      <FileText className="h-4 w-4" />
                      <span>{fileName}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setUploadedFiles((prev) => prev.filter((_, i) => i !== index))}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Requirements Notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">Requirements:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Detailed description of work done is mandatory</li>
              <li>• Photo evidence is highly recommended</li>
              <li>• All updates will be visible to citizens</li>
              {newStatus === "resolved" && <li>• Resolved issues cannot be reverted without admin approval</li>}
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1 bg-transparent">
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isSubmitting || !proofDescription.trim()} className="flex-1">
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Updating...
                </>
              ) : (
                statusInfo.actionText
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
