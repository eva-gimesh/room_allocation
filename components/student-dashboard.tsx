"use client"

import { useState } from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Clock, MapPin, Users, CheckCircle, XCircle, Clock3, LogOut, Plus, AlertCircle } from "lucide-react"
import { useDataStore, type RoomRequest } from "@/lib/data-store"

interface DashboardProps {
  userName: string
  onLogout: () => void
}

export function StudentDashboard({ userName, onLogout }: DashboardProps) {
  const { requests, addRequest } = useDataStore()

  const myRequests = requests.filter((r) => r.studentName === userName)

  console.log("[v0] Student Dashboard - All requests:", requests)
  console.log("[v0] Student Dashboard - My requests:", myRequests)
  console.log("[v0] Student Dashboard - Current user:", userName)

  const [newRequest, setNewRequest] = useState({
    roomNumber: "",
    block: "Computer Block",
    date: "",
    time: "",
    reason: "",
    priority: "individual" as const,
  })
  const [dialogOpen, setDialogOpen] = useState(false)

  const handleSubmitRequest = () => {
    console.log("[v0] Submitting new request:", { studentName: userName, ...newRequest })
    addRequest({
      studentName: userName,
      ...newRequest,
    })
    setNewRequest({ roomNumber: "", block: "Computer Block", date: "", time: "", reason: "", priority: "individual" })
    setDialogOpen(false)
  }

  const getStatusBadge = (status: RoomRequest["status"]) => {
    const statusConfig = {
      "pending-faculty": { label: "Pending Faculty", variant: "secondary" as const, icon: Clock3 },
      "pending-gawd": { label: "Pending Final Approval", variant: "secondary" as const, icon: Clock3 },
      approved: { label: "Approved", variant: "default" as const, icon: CheckCircle },
      "rejected-faculty": { label: "Rejected by Faculty", variant: "destructive" as const, icon: XCircle },
      "rejected-gawd": { label: "Rejected by Room Gawd", variant: "destructive" as const, icon: XCircle },
    }
    const config = statusConfig[status]
    const Icon = config.icon
    return (
      <Badge variant={config.variant} className="gap-1.5">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    )
  }

  const presentRequests = myRequests.filter((r) => ["pending-faculty", "pending-gawd", "approved"].includes(r.status))
  const pastRequests = myRequests.filter((r) => ["rejected-faculty", "rejected-gawd"].includes(r.status))

  console.log("[v0] Present requests:", presentRequests)
  console.log("[v0] Past requests:", pastRequests)

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">Student Portal</h1>
            <p className="text-muted-foreground">Welcome back, {userName}</p>
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
                <div className="p-3 rounded-lg bg-blue-500/10">
                  <Clock3 className="h-6 w-6 text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Pending</p>
                  <p className="text-2xl font-bold">{myRequests.filter((r) => r.status.includes("pending")).length}</p>
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
                  <p className="text-2xl font-bold">{myRequests.filter((r) => r.status === "approved").length}</p>
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
                  <p className="text-2xl font-bold">{myRequests.filter((r) => r.status.includes("rejected")).length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* New Request Dialog */}
        <div className="mb-6">
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button size="lg" className="gap-2">
                <Plus className="h-5 w-5" />
                Request New Room
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>New Room Request</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Room Number</Label>
                  <Input
                    placeholder="e.g., CB-101"
                    value={newRequest.roomNumber}
                    onChange={(e) => setNewRequest({ ...newRequest, roomNumber: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Date</Label>
                  <Input
                    type="date"
                    value={newRequest.date}
                    onChange={(e) => setNewRequest({ ...newRequest, date: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Time Slot</Label>
                  <Input
                    placeholder="e.g., 14:00-16:00"
                    value={newRequest.time}
                    onChange={(e) => setNewRequest({ ...newRequest, time: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Reason</Label>
                  <Textarea
                    placeholder="Describe the purpose of your booking"
                    value={newRequest.reason}
                    onChange={(e) => setNewRequest({ ...newRequest, reason: e.target.value })}
                    rows={3}
                  />
                </div>
                <Button className="w-full" onClick={handleSubmitRequest}>
                  Submit Request
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Requests */}
        <Tabs defaultValue="present" className="w-full">
          <TabsList>
            <TabsTrigger value="present">Present Requests</TabsTrigger>
            <TabsTrigger value="past">Past Requests</TabsTrigger>
          </TabsList>

          <TabsContent value="present" className="mt-6">
            <div className="grid gap-4">
              {presentRequests.length === 0 ? (
                <Card className="bg-card/30 backdrop-blur-sm">
                  <CardContent className="py-12 text-center">
                    <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground">No active requests</p>
                  </CardContent>
                </Card>
              ) : (
                presentRequests.map((request) => (
                  <Card key={request.id} className="bg-card/50 backdrop-blur-sm hover:bg-card/70 transition-all">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-xl flex items-center gap-2">
                            <MapPin className="h-5 w-5 text-primary" />
                            {request.roomNumber}
                          </CardTitle>
                          <CardDescription className="mt-1">{request.block}</CardDescription>
                        </div>
                        {getStatusBadge(request.status)}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>{request.date}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock3 className="h-4 w-4 text-muted-foreground" />
                          <span>{request.time}</span>
                        </div>
                      </div>
                      <div className="mt-3 p-3 bg-muted/30 rounded-md">
                        <p className="text-sm text-muted-foreground font-medium mb-1">Reason:</p>
                        <p className="text-sm">{request.reason}</p>
                      </div>
                      {request.groupCode && (
                        <div className="mt-3 flex items-center gap-2">
                          <Users className="h-4 w-4 text-primary" />
                          <Badge variant="secondary">{request.groupCode}</Badge>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="past" className="mt-6">
            <div className="grid gap-4">
              {pastRequests.length === 0 ? (
                <Card className="bg-card/30 backdrop-blur-sm">
                  <CardContent className="py-12 text-center">
                    <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground">No past requests</p>
                  </CardContent>
                </Card>
              ) : (
                pastRequests.map((request) => (
                  <Card key={request.id} className="bg-card/30 backdrop-blur-sm opacity-80">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-xl flex items-center gap-2">
                            <MapPin className="h-5 w-5" />
                            {request.roomNumber}
                          </CardTitle>
                          <CardDescription className="mt-1">{request.block}</CardDescription>
                        </div>
                        {getStatusBadge(request.status)}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>{request.date}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock3 className="h-4 w-4 text-muted-foreground" />
                          <span>{request.time}</span>
                        </div>
                      </div>
                      {request.rejectionReason && (
                        <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                          <p className="text-sm font-medium text-destructive mb-1">Rejection Reason:</p>
                          <p className="text-sm text-destructive/90">{request.rejectionReason}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
