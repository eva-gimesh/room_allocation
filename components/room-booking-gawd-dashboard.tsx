"use client"

import { useState } from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Clock, MapPin, CheckCircle, XCircle, LogOut, Plus, Crown, User, Calendar } from "lucide-react"
import { useDataStore, type LabRoom } from "@/lib/data-store"

interface DashboardProps {
  userName: string
  onLogout: () => void
}

export function RoomBookingGawdDashboard({ userName, onLogout }: DashboardProps) {
  const { requests, approveByGawd, rejectByGawd, rooms, addTeamToRoom, removeTeamFromRoom } = useDataStore()

  const [newGroupCode, setNewGroupCode] = useState("")
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null)
  const [rejectionReason, setRejectionReason] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [addTeamDialogOpen, setAddTeamDialogOpen] = useState(false)

  const handleApprove = (id: string) => {
    const groupCode = `TEAM-${Math.random().toString(36).substr(2, 3).toUpperCase()}${Math.floor(Math.random() * 100)}`
    approveByGawd(id, groupCode)
  }

  const handleReject = (id: string, reason: string) => {
    rejectByGawd(id, reason)
    setRejectionReason("")
    setDialogOpen(false)
  }

  const handleAddTeamToRoom = (roomId: string, groupCode: string) => {
    addTeamToRoom(roomId, groupCode)
    setNewGroupCode("")
    setAddTeamDialogOpen(false)
  }

  const handleRemoveTeamFromRoom = (roomId: string, groupCode: string) => {
    removeTeamFromRoom(roomId, groupCode)
  }

  const getCapacityPercentage = (room: LabRoom) => (room.currentTeams / room.maxCapacity) * 100
  const isRoomFull = (room: LabRoom) => room.currentTeams >= room.maxCapacity

  const getPriorityBadge = (priority: "hackathon" | "club" | "individual") => {
    const config = {
      hackathon: { label: "Hackathon", variant: "default" as const },
      club: { label: "Club", variant: "secondary" as const },
      individual: { label: "Individual", variant: "outline" as const },
    }
    return <Badge variant={config[priority].variant}>{config[priority].label}</Badge>
  }

  const pendingRequests = requests.filter((r) => r.status === "pending-gawd")

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2 flex items-center gap-3">
              <Crown className="h-10 w-10 text-amber-400" />
              Room Booking Gawd
            </h1>
            <p className="text-muted-foreground">Welcome, {userName}</p>
          </div>
          <Button variant="outline" onClick={onLogout}>
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>

        <Tabs defaultValue="requests" className="w-full">
          <TabsList>
            <TabsTrigger value="requests">Approval Requests</TabsTrigger>
            <TabsTrigger value="rooms">Room Management</TabsTrigger>
          </TabsList>

          <TabsContent value="requests" className="mt-6">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <Card className="bg-card/50 backdrop-blur-sm">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-lg bg-yellow-500/10">
                      <Clock className="h-6 w-6 text-yellow-400" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Pending</p>
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
                      <p className="text-2xl font-bold">{requests.filter((r) => r.status === "approved").length}</p>
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
                      <p className="text-2xl font-bold">
                        {requests.filter((r) => r.status === "rejected-gawd").length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Pending Requests */}
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
                        <div className="flex gap-2">
                          {getPriorityBadge(request.priority)}
                          <Badge variant="secondary">Faculty Approved</Badge>
                        </div>
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
                        Final Approve
                      </Button>
                      <Dialog
                        open={dialogOpen && selectedRoom === request.id}
                        onOpenChange={(open) => {
                          setDialogOpen(open)
                          if (open) setSelectedRoom(request.id)
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
          </TabsContent>

          <TabsContent value="rooms" className="mt-6">
            {/* Room Management */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {rooms.map((room) => {
                const isFull = isRoomFull(room)
                const capacityPercentage = getCapacityPercentage(room)

                return (
                  <Card
                    key={room.id}
                    className={`group relative overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm transition-all hover:scale-[1.02] hover:shadow-xl ${
                      isFull ? "opacity-70" : ""
                    }`}
                  >
                    {isFull && (
                      <div className="absolute right-4 top-4 z-10">
                        <Badge variant="destructive" className="gap-1">
                          Lab Full
                        </Badge>
                      </div>
                    )}

                    <div className="p-6">
                      <div className="mb-4">
                        <h3 className="text-xl font-semibold text-card-foreground">{room.name}</h3>
                        <p className="mt-1 text-sm text-muted-foreground">
                          Capacity: {room.currentTeams} / {room.maxCapacity} teams
                        </p>
                      </div>

                      <div className="mb-4">
                        <Progress
                          value={capacityPercentage}
                          className="h-2"
                          indicatorClassName={
                            capacityPercentage === 100
                              ? "bg-destructive"
                              : capacityPercentage >= 80
                                ? "bg-yellow-500"
                                : "bg-primary"
                          }
                        />
                        <div className="mt-2 flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">
                            {room.maxCapacity - room.currentTeams} slots remaining
                          </span>
                          <span className="font-medium text-card-foreground">{capacityPercentage.toFixed(0)}%</span>
                        </div>
                      </div>

                      <div className="mb-4">
                        <p className="mb-2 text-sm font-medium text-card-foreground">Assigned Teams:</p>
                        {room.groupCodes.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {room.groupCodes.map((code) => (
                              <Badge
                                key={code}
                                variant="secondary"
                                className="group/badge cursor-pointer transition-all hover:bg-secondary/80"
                                onClick={() => handleRemoveTeamFromRoom(room.id, code)}
                              >
                                {code}
                                <XCircle className="ml-1 h-3 w-3 opacity-0 transition-opacity group-hover/badge:opacity-100" />
                              </Badge>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm italic text-muted-foreground">No teams assigned yet</p>
                        )}
                      </div>

                      <Dialog
                        open={addTeamDialogOpen && selectedRoom === room.id}
                        onOpenChange={(open) => {
                          setAddTeamDialogOpen(open)
                          if (open) setSelectedRoom(room.id)
                        }}
                      >
                        <DialogTrigger asChild>
                          <Button className="w-full" disabled={isFull}>
                            <Plus className="h-4 w-4" />
                            {isFull ? "No Empty Slots" : "Assign Team"}
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-card">
                          <DialogHeader>
                            <DialogTitle className="text-card-foreground">Assign Team to {room.name}</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <div className="space-y-2">
                              <Label htmlFor="groupCode" className="text-card-foreground">
                                Group Code
                              </Label>
                              <Input
                                id="groupCode"
                                placeholder="e.g., TEAM-A01"
                                value={newGroupCode}
                                onChange={(e) => setNewGroupCode(e.target.value)}
                                className="bg-background/50"
                              />
                            </div>
                            <Button
                              className="w-full"
                              onClick={() => {
                                if (selectedRoom && newGroupCode.trim()) {
                                  handleAddTeamToRoom(selectedRoom, newGroupCode)
                                }
                              }}
                            >
                              Confirm Assignment
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>

                    {!isFull && (
                      <div className="absolute -inset-px rounded-lg bg-gradient-to-r from-primary/0 via-primary/50 to-primary/0 opacity-0 transition-opacity group-hover:opacity-20" />
                    )}
                  </Card>
                )
              })}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
