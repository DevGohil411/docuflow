"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { CheckCircle, XCircle, Clock, Eye, MessageSquare } from "lucide-react"
import { useRouter } from "next/navigation"

const initialPendingApprovals = [
  {
    id: "1",
    document: "Q4 Financial Report.pdf",
    requester: "Sarah Johnson",
    requestedAt: "2024-02-15T10:30:00Z",
    priority: "high",
    type: "Financial Review",
    description: "Quarterly financial report requiring CFO approval before board presentation",
  },
  {
    id: "2",
    document: "Employee Contract - John Smith.docx",
    requester: "HR Department",
    requestedAt: "2024-02-15T09:15:00Z",
    priority: "medium",
    type: "Contract Review",
    description: "New employee contract requiring legal and HR approval",
  },
  {
    id: "3",
    document: "Marketing Campaign Proposal.pdf",
    requester: "Marketing Team",
    requestedAt: "2024-02-14T16:45:00Z",
    priority: "low",
    type: "Campaign Approval",
    description: "Q2 marketing campaign proposal for budget approval",
  },
]

const initialCompletedApprovals = [
  {
    id: "4",
    document: "Vendor Agreement - TechCorp.pdf",
    approver: "Legal Team",
    completedAt: "2024-02-14T14:20:00Z",
    status: "approved",
    type: "Legal Review",
  },
  {
    id: "5",
    document: "Budget Allocation Q1.xlsx",
    approver: "Finance Team",
    completedAt: "2024-02-13T11:30:00Z",
    status: "rejected",
    type: "Budget Review",
  },
]

export function ApprovalsPage() {
  const [selectedTab, setSelectedTab] = useState("pending")
  const [pendingApprovals, setPendingApprovals] = useState(initialPendingApprovals)
  const [completedApprovals, setCompletedApprovals] = useState(initialCompletedApprovals)
  const [showApprovalDialog, setShowApprovalDialog] = useState(false)
  const [showRejectionDialog, setShowRejectionDialog] = useState(false)
  const [showCommentDialog, setShowCommentDialog] = useState(false)
  const [showDetailsDialog, setShowDetailsDialog] = useState(false)
  const [selectedApproval, setSelectedApproval] = useState<any>(null)
  const [comment, setComment] = useState("")
  const [rejectionReason, setRejectionReason] = useState("")
  const router = useRouter()

  const handleView = (approval: any) => {
    // Navigate to document viewer
    router.push(`/app/documents/doc-${approval.id}`)
  }

  const handleComment = (approval: any) => {
    setSelectedApproval(approval)
    setComment("")
    setShowCommentDialog(true)
  }

  const handleApprove = (approval: any) => {
    setSelectedApproval(approval)
    setShowApprovalDialog(true)
  }

  const handleReject = (approval: any) => {
    setSelectedApproval(approval)
    setRejectionReason("")
    setShowRejectionDialog(true)
  }

  const handleViewDetails = (approval: any) => {
    setSelectedApproval(approval)
    setShowDetailsDialog(true)
  }

  const confirmApproval = () => {
    if (selectedApproval) {
      // Remove from pending and add to completed
      setPendingApprovals((prev) => prev.filter((a) => a.id !== selectedApproval.id))
      setCompletedApprovals((prev) => [
        ...prev,
        {
          id: selectedApproval.id,
          document: selectedApproval.document,
          approver: "You",
          completedAt: new Date().toISOString(),
          status: "approved",
          type: selectedApproval.type,
        },
      ])
      setShowApprovalDialog(false)
      setSelectedApproval(null)
      alert("Document approved successfully!")
    }
  }

  const confirmRejection = () => {
    if (selectedApproval && rejectionReason.trim()) {
      // Remove from pending and add to completed
      setPendingApprovals((prev) => prev.filter((a) => a.id !== selectedApproval.id))
      setCompletedApprovals((prev) => [
        ...prev,
        {
          id: selectedApproval.id,
          document: selectedApproval.document,
          approver: "You",
          completedAt: new Date().toISOString(),
          status: "rejected",
          type: selectedApproval.type,
          rejectionReason,
        },
      ])
      setShowRejectionDialog(false)
      setSelectedApproval(null)
      setRejectionReason("")
      alert("Document rejected successfully!")
    }
  }

  const submitComment = () => {
    if (comment.trim()) {
      alert(`Comment added: "${comment}"`)
      setShowCommentDialog(false)
      setSelectedApproval(null)
      setComment("")
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Approvals</h1>
        <p className="text-muted-foreground">Manage document approvals and review requests</p>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList>
          <TabsTrigger value="pending">Pending ({pendingApprovals.length})</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="my-requests">My Requests</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          {pendingApprovals.length === 0 ? (
            <Card>
              <CardContent className="flex items-center justify-center py-12">
                <div className="text-center">
                  <h3 className="text-lg font-medium mb-2">No pending approvals</h3>
                  <p className="text-muted-foreground">All approval requests have been processed.</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            pendingApprovals.map((approval) => (
              <Card key={approval.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Badge
                        variant={
                          approval.priority === "high"
                            ? "destructive"
                            : approval.priority === "medium"
                              ? "default"
                              : "secondary"
                        }
                      >
                        {approval.priority}
                      </Badge>
                      <Badge variant="outline">{approval.type}</Badge>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      {new Date(approval.requestedAt).toLocaleDateString()}
                    </div>
                  </div>
                  <CardTitle className="text-lg">{approval.document}</CardTitle>
                  <CardDescription>{approval.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>
                          {approval.requester
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm">Requested by {approval.requester}</span>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleView(approval)}>
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleComment(approval)}>
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Comment
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleReject(approval)}>
                        <XCircle className="h-4 w-4 mr-2" />
                        Reject
                      </Button>
                      <Button size="sm" onClick={() => handleApprove(approval)}>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Approve
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {completedApprovals.map((approval) => (
            <Card key={approval.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Badge variant={approval.status === "approved" ? "default" : "destructive"}>
                      {approval.status}
                    </Badge>
                    <Badge variant="outline">{approval.type}</Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    {new Date(approval.completedAt).toLocaleDateString()}
                  </div>
                </div>
                <CardTitle className="text-lg">{approval.document}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>
                        {approval.approver
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm">
                      {approval.status === "approved" ? "Approved" : "Rejected"} by {approval.approver}
                    </span>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => handleViewDetails(approval)}>
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="my-requests" className="space-y-4">
          <Card>
            <CardContent className="flex items-center justify-center py-12">
              <div className="text-center">
                <h3 className="text-lg font-medium mb-2">No requests found</h3>
                <p className="text-muted-foreground">You haven't submitted any approval requests yet.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={showApprovalDialog} onOpenChange={setShowApprovalDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve Document</DialogTitle>
            <DialogDescription>Are you sure you want to approve "{selectedApproval?.document}"?</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowApprovalDialog(false)}>
              Cancel
            </Button>
            <Button onClick={confirmApproval}>
              <CheckCircle className="h-4 w-4 mr-2" />
              Approve
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showRejectionDialog} onOpenChange={setShowRejectionDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Document</DialogTitle>
            <DialogDescription>Please provide a reason for rejecting "{selectedApproval?.document}".</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="rejection-reason">Rejection Reason</Label>
              <Textarea
                id="rejection-reason"
                placeholder="Enter reason for rejection..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRejectionDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmRejection} disabled={!rejectionReason.trim()}>
              <XCircle className="h-4 w-4 mr-2" />
              Reject
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showCommentDialog} onOpenChange={setShowCommentDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Comment</DialogTitle>
            <DialogDescription>Add a comment for "{selectedApproval?.document}".</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="comment">Comment</Label>
              <Textarea
                id="comment"
                placeholder="Enter your comment..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCommentDialog(false)}>
              Cancel
            </Button>
            <Button onClick={submitComment} disabled={!comment.trim()}>
              <MessageSquare className="h-4 w-4 mr-2" />
              Add Comment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approval Details</DialogTitle>
            <DialogDescription>Details for "{selectedApproval?.document}"</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Status</Label>
              <p className="text-sm text-muted-foreground">
                {selectedApproval?.status === "approved" ? "Approved" : "Rejected"}
              </p>
            </div>
            <div>
              <Label>Processed By</Label>
              <p className="text-sm text-muted-foreground">{selectedApproval?.approver}</p>
            </div>
            <div>
              <Label>Date</Label>
              <p className="text-sm text-muted-foreground">
                {selectedApproval?.completedAt && new Date(selectedApproval.completedAt).toLocaleString()}
              </p>
            </div>
            {selectedApproval?.rejectionReason && (
              <div>
                <Label>Rejection Reason</Label>
                <p className="text-sm text-muted-foreground">{selectedApproval.rejectionReason}</p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button onClick={() => setShowDetailsDialog(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
