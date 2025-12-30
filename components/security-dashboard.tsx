"use client"

import { useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Camera, Video, QrCode, LogOut, Clock, MapPin, Users, AlertTriangle, CheckCircle } from "lucide-react"
import { useDataStore } from "@/lib/data-store"

interface DashboardProps {
  userName: string
  onLogout: () => void
}

export function SecurityDashboard({ userName, onLogout }: DashboardProps) {
  const { requests, rooms, addInspection, addCleaningRequest } = useDataStore()

  const [inspectionNotes, setInspectionNotes] = useState("")
  const [inspectionStatus, setInspectionStatus] = useState<"clean" | "needs-cleaning" | "technical-issue">("clean")
  const [selectedRoomForInspection, setSelectedRoomForInspection] = useState("")
  const [inspectionDialogOpen, setInspectionDialogOpen] = useState(false)

  const activeRooms = requests
    .filter((r) => r.status === "approved" && r.groupCode)
    .map((r) => ({
      id: r.id,
      roomNumber: r.roomNumber,
      groupCode: r.groupCode!,
      timeSlot: r.time,
      timeRemaining: "Active",
      status: "active" as const,
    }))

  const handleInspection = () => {
    if (!selectedRoomForInspection) return

    const room = activeRooms.find((r) => r.roomNumber === selectedRoomForInspection)
    if (!room) return

    // Add inspection record
    addInspection({
      roomName: `Computer Lab ${room.roomNumber}`,
      inspectedBy: userName,
      timestamp: new Date().toLocaleString(),
      status: inspectionStatus,
      notes: inspectionNotes,
    })

    // If needs cleaning, create cleaning request
    if (inspectionStatus === "needs-cleaning") {
      addCleaningRequest({
        roomName: `Computer Lab ${room.roomNumber}`,
        requestedBy: userName,
        issue: inspectionNotes || "General cleaning required",
      })
    }

    // Reset form
    setInspectionNotes("")
    setInspectionStatus("clean")
    setSelectedRoomForInspection("")
    setInspectionDialogOpen(false)
  }

  const getStatusBadge = (status: "active" | "ending-soon" | "overused") => {
    const config = {
      active: { label: "Active", variant: "default" as const, icon: CheckCircle },
      "ending-soon": { label: "Ending Soon", variant: "secondary" as const, icon: Clock },
      overused: { label: "Overused", variant: "destructive" as const, icon: AlertTriangle },
    }
    const { label, variant, icon: Icon } = config[status]
    return (
      <Badge variant={variant} className="gap-1.5">
        <Icon className="h-3 w-3" />
        {label}
      </Badge>
    )
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-500/10">
                <QrCode className="h-8 w-8 text-green-400" />
              </div>
              Security Dashboard
            </h1>
            <p className="text-muted-foreground">Welcome, {userName}</p>
          </div>
          <Button variant="outline" onClick={onLogout}>
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Dialog>
            <DialogTrigger asChild>
              <Button size="lg" className="h-auto py-6 flex-col gap-2 bg-blue-600 hover:bg-blue-700">
                <QrCode className="h-8 w-8" />
                <span className="text-lg">Scan QR Code</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>QR Code Scanner</DialogTitle>
              </DialogHeader>
              <div className="py-8">
                <div className="aspect-square bg-muted/30 rounded-lg flex items-center justify-center">
                  <QrCode className="h-24 w-24 text-muted-foreground" />
                </div>
                <p className="text-center text-sm text-muted-foreground mt-4">Position QR code within the frame</p>
              </div>
            </DialogContent>
          </Dialog>

          <Button size="lg" className="h-auto py-6 flex-col gap-2 bg-purple-600 hover:bg-purple-700">
            <Camera className="h-8 w-8" />
            <span className="text-lg">Take Photo</span>
          </Button>

          <Button size="lg" className="h-auto py-6 flex-col gap-2 bg-pink-600 hover:bg-pink-700">
            <Video className="h-8 w-8" />
            <span className="text-lg">Record Video</span>
          </Button>
        </div>

        {/* Active Rooms */}
        <div>
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <Users className="h-6 w-6 text-primary" />
            Active Rooms ({activeRooms.length})
          </h2>
          <div className="grid gap-4">
            {activeRooms.length === 0 ? (
              <Card className="bg-card/30 backdrop-blur-sm">
                <CardContent className="py-12 text-center text-muted-foreground">No active rooms</CardContent>
              </Card>
            ) : (
              activeRooms.map((room) => (
                <Card key={room.id} className="bg-card/50 backdrop-blur-sm hover:bg-card/70 transition-all">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-xl flex items-center gap-2">
                          <MapPin className="h-5 w-5 text-primary" />
                          {room.roomNumber}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">Group: {room.groupCode}</p>
                      </div>
                      {getStatusBadge(room.status)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{room.timeSlot}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{room.timeRemaining}</span>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Dialog
                        open={inspectionDialogOpen && selectedRoomForInspection === room.roomNumber}
                        onOpenChange={(open) => {
                          setInspectionDialogOpen(open)
                          if (open) setSelectedRoomForInspection(room.roomNumber)
                        }}
                      >
                        <DialogTrigger asChild>
                          <Button variant="outline" className="flex-1 bg-transparent">
                            <Camera className="h-4 w-4" />
                            Inspect Room
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Room Inspection - {room.roomNumber}</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-6 py-4">
                            {/* Room Status */}
                            <div>
                              <Label className="mb-2 block">Room Status</Label>
                              <Select
                                value={inspectionStatus}
                                onValueChange={(value: any) => setInspectionStatus(value)}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="clean">Clean</SelectItem>
                                  <SelectItem value="needs-cleaning">Needs Cleaning</SelectItem>
                                  <SelectItem value="technical-issue">Technical Issue</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            {/* Notes */}
                            <div>
                              <Label className="mb-2 block">Inspection Notes</Label>
                              <Textarea
                                placeholder="Add any additional notes..."
                                value={inspectionNotes}
                                onChange={(e) => setInspectionNotes(e.target.value)}
                                rows={4}
                              />
                            </div>

                            <Button className="w-full" onClick={handleInspection}>
                              Submit Inspection
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
