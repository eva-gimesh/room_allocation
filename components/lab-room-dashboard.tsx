"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Users, Lock, Plus, Minus } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface LabRoom {
  id: string
  name: string
  maxCapacity: number
  currentTeams: number
  groupCodes: string[]
}

const initialRooms: LabRoom[] = [
  {
    id: "1",
    name: "Computer Lab CB-101",
    maxCapacity: 6,
    currentTeams: 3,
    groupCodes: ["TEAM-A01", "TEAM-B12", "TEAM-C45"],
  },
  {
    id: "2",
    name: "Computer Lab CB-102",
    maxCapacity: 8,
    currentTeams: 6,
    groupCodes: ["TEAM-D22", "TEAM-E33", "TEAM-F44", "TEAM-G55", "TEAM-H66", "TEAM-I77"],
  },
  {
    id: "3",
    name: "Computer Lab CB-103",
    maxCapacity: 5,
    currentTeams: 5,
    groupCodes: ["TEAM-J88", "TEAM-K99", "TEAM-L10", "TEAM-M11", "TEAM-N12"],
  },
  {
    id: "4",
    name: "Computer Lab CB-104",
    maxCapacity: 7,
    currentTeams: 2,
    groupCodes: ["TEAM-O13", "TEAM-P14"],
  },
  {
    id: "5",
    name: "Computer Lab CB-105",
    maxCapacity: 6,
    currentTeams: 0,
    groupCodes: [],
  },
  {
    id: "6",
    name: "Computer Lab CB-106",
    maxCapacity: 8,
    currentTeams: 4,
    groupCodes: ["TEAM-Q15", "TEAM-R16", "TEAM-S17", "TEAM-T18"],
  },
]

export function LabRoomDashboard() {
  const [rooms, setRooms] = useState<LabRoom[]>(initialRooms)
  const [newGroupCode, setNewGroupCode] = useState("")
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null)

  const addTeamToRoom = (roomId: string, groupCode: string) => {
    setRooms((prevRooms) =>
      prevRooms.map((room) => {
        if (room.id === roomId && room.currentTeams < room.maxCapacity && groupCode.trim()) {
          return {
            ...room,
            currentTeams: room.currentTeams + 1,
            groupCodes: [...room.groupCodes, groupCode.trim()],
          }
        }
        return room
      }),
    )
    setNewGroupCode("")
  }

  const removeTeamFromRoom = (roomId: string, groupCode: string) => {
    setRooms((prevRooms) =>
      prevRooms.map((room) => {
        if (room.id === roomId) {
          return {
            ...room,
            currentTeams: Math.max(0, room.currentTeams - 1),
            groupCodes: room.groupCodes.filter((code) => code !== groupCode),
          }
        }
        return room
      }),
    )
  }

  const getCapacityPercentage = (room: LabRoom) => {
    return (room.currentTeams / room.maxCapacity) * 100
  }

  const isRoomFull = (room: LabRoom) => {
    return room.currentTeams >= room.maxCapacity
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-4xl font-bold tracking-tight text-foreground md:text-5xl">Hackathon Lab Booking</h1>
          <p className="text-lg text-muted-foreground">{"Real-time room allocation for Computer Block (CB)"}</p>
        </div>

        {/* Stats Overview */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Card className="border-border/50 bg-card/50 p-6 backdrop-blur-sm transition-all hover:bg-card/70">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-3">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Rooms</p>
                <p className="text-2xl font-bold text-card-foreground">{rooms.length}</p>
              </div>
            </div>
          </Card>
          <Card className="border-border/50 bg-card/50 p-6 backdrop-blur-sm transition-all hover:bg-card/70">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-accent/10 p-3">
                <Users className="h-6 w-6 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Available Rooms</p>
                <p className="text-2xl font-bold text-card-foreground">
                  {rooms.filter((room) => !isRoomFull(room)).length}
                </p>
              </div>
            </div>
          </Card>
          <Card className="border-border/50 bg-card/50 p-6 backdrop-blur-sm transition-all hover:bg-card/70">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-destructive/10 p-3">
                <Lock className="h-6 w-6 text-destructive" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Full Rooms</p>
                <p className="text-2xl font-bold text-card-foreground">
                  {rooms.filter((room) => isRoomFull(room)).length}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Lab Rooms Grid */}
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
                      <Lock className="h-3 w-3" />
                      Lab Full
                    </Badge>
                  </div>
                )}

                <div className="p-6">
                  {/* Room Header */}
                  <div className="mb-4">
                    <h3 className="text-xl font-semibold text-card-foreground">{room.name}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Capacity: {room.currentTeams} / {room.maxCapacity} teams
                    </p>
                  </div>

                  {/* Capacity Progress Bar */}
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

                  {/* Group Codes */}
                  <div className="mb-4">
                    <p className="mb-2 text-sm font-medium text-card-foreground">Assigned Teams:</p>
                    {room.groupCodes.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {room.groupCodes.map((code) => (
                          <Badge
                            key={code}
                            variant="secondary"
                            className="group/badge cursor-pointer transition-all hover:bg-secondary/80"
                            onClick={() => removeTeamFromRoom(room.id, code)}
                          >
                            {code}
                            <Minus className="ml-1 h-3 w-3 opacity-0 transition-opacity group-hover/badge:opacity-100" />
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm italic text-muted-foreground">No teams assigned yet</p>
                    )}
                  </div>

                  {/* Actions */}
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="w-full" disabled={isFull} onClick={() => setSelectedRoom(room.id)}>
                        <Plus className="mr-2 h-4 w-4" />
                        {isFull ? "No Empty Slots" : "Assign Team"}
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-card">
                      <DialogHeader>
                        <DialogTitle className="text-card-foreground">Assign Team to {room.name}</DialogTitle>
                        <DialogDescription className="text-muted-foreground">
                          Enter the group code to assign a team to this lab room.
                        </DialogDescription>
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
                              addTeamToRoom(selectedRoom, newGroupCode)
                            }
                          }}
                        >
                          Confirm Assignment
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                {/* Animated glow effect on hover */}
                {!isFull && (
                  <div className="absolute -inset-px rounded-lg bg-gradient-to-r from-primary/0 via-primary/50 to-primary/0 opacity-0 transition-opacity group-hover:opacity-20" />
                )}
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
