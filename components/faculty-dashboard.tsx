"use client"

import { useState } from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Clock, MapPin, CheckCircle, XCircle, LogOut, Calendar, User } from "lucide-react"
import { useDataStore } from "@/lib/data-store"

interface DashboardProps {
  userName: string
  onLogout: () => void
}

export function FacultyDashboard({ userName, onLogout }: DashboardProps) {
  const { requests, approveByFaculty, rejectByFaculty } = useDataStore()

  const [rejectionReason, setRejectionReason] = useState("")
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  const handleApprove = (id: string) => {
    console.log("[v0] Faculty approving request:", id)
    approveByFaculty(id)
    console.log("[v0] Request approved, new status should be pending-gawd")
  }

  const handleReject = (id: string, reason: string) => {
    console.log("[v0] Faculty rejecting request:", id, "with reason:", reason)
    rejectByFaculty(id, reason)
    setRejectionReason("")
    setSelectedRequest(null)
    setDialogOpen(false)
  }

  const pendingRequests = requests.filter((r) => r.status === "pending-faculty")
  const processedRequests = requests.filter((r) => r.status !== "pending-faculty")

  console.log("[v0] Faculty Dashboard - Pending requests:", pendingRequests)
  console.log("[v0] Faculty Dashboard - All requests:", requests)

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">Faculty Dashboard</h1>
            <p className="text-muted-foreground">Welcome, {userName}</p>
          </div>
          <Button variant="outline" onClick={onLogout}>
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="bg-card/50 backdrop-blur-sm">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-yellow-500/10">
                  <Clock className="h-6 w-6 text-yellow-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Pending Approval</p>
                  <p className="text-2xl font-bold">{pendingRequests.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card/50 backdrop-blur-sm">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-green-500/10">
                  <CheckCircle className="h-6 w-6 text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Approved</p>
                  <p className="text-2xl font-bold">
                    {requests.filter((r) => r.status === "pending-gawd" || r.status === "approved").length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card/50 backdrop-blur-sm">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-red-500/10">
                  <XCircle className="h-6 w-6 text-red-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Rejected</p>
                  <p className="text-2xl font-bold">{requests.filter((r) => r.status === "rejected-faculty").length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pending Requests */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <Clock className="h-6 w-6 text-yellow-400" />
            Pending Approvals
          </h2>
          <div className="grid gap-4">
            {pendingRequests.length === 0 ? (
              <Card className="bg-card/30 backdrop-blur-sm">
                <CardContent className="py-12 text-center text-muted-foreground">No pending requests</CardContent>
              </Card>
            ) : (
              pendingRequests.map((request) => (
                <Card key={request.id} className="bg-card/50 backdrop-blur-sm hover:bg-card/70 transition-all">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-xl flex items-center gap-2">
                          <MapPin className="h-5 w-5 text-primary" />
                          {request.roomNumber}
                        </CardTitle>
                        <CardDescription className="mt-1 flex items-center gap-2">
                          <User className="h-4 w-4" />
                          {request.studentName}
                        </CardDescription>
                      </div>
                      <Badge variant="secondary">Pending</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>{request.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{request.time}</span>
                      </div>
                    </div>
                    <div className="p-3 bg-muted/30 rounded-md">
                      <p className="text-sm text-muted-foreground font-medium mb-1">Reason:</p>
                      <p className="text-sm">{request.reason}</p>
                    </div>
                  </CardContent>
                  <CardFooter className="gap-3">
                    <Button className="flex-1" onClick={() => handleApprove(request.id)}>
                      <CheckCircle className="h-4 w-4" />
                      Approve
                    </Button>
                    <Dialog
                      open={dialogOpen && selectedRequest === request.id}
                      onOpenChange={(open) => {
                        setDialogOpen(open)
                        if (open) setSelectedRequest(request.id)
                      }}
                    >
                      <DialogTrigger asChild>
                        <Button variant="destructive" className="flex-1">
                          <XCircle className="h-4 w-4" />
                          Reject
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Reject Request</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label>Reason for Rejection</Label>
                            <Textarea
                              placeholder="Provide a reason for rejection"
                              value={rejectionReason}
                              onChange={(e) => setRejectionReason(e.target.value)}
                              rows={4}
                            />
                          </div>
                          <Button
                            variant="destructive"
                            className="w-full"
                            onClick={() => handleReject(request.id, rejectionReason)}
                            disabled={!rejectionReason.trim()}
                          >
                            Confirm Rejection
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </CardFooter>
                </Card>
              ))
            )}
          </div>
        </div>

        {/* Processed Requests */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Processed Requests</h2>
          <div className="grid gap-4">
            {processedRequests.slice(0, 5).map((request) => (
              <Card key={request.id} className="bg-card/30 backdrop-blur-sm opacity-80">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl flex items-center gap-2">
                        <MapPin className="h-5 w-5" />
                        {request.roomNumber}
                      </CardTitle>
                      <CardDescription className="mt-1 flex items-center gap-2">
                        <User className="h-4 w-4" />
                        {request.studentName}
                      </CardDescription>
                    </div>
                    <Badge variant={request.status === "rejected-faculty" ? "destructive" : "default"}>
                      {request.status === "rejected-faculty" ? (
                        <>
                          <XCircle className="h-3 w-3" />
                          Rejected
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-3 w-3" />
                          Approved
                        </>
                      )}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{request.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{request.time}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
