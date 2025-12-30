"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"

// Types
export type RequestStatus = "pending-faculty" | "pending-gawd" | "approved" | "rejected-faculty" | "rejected-gawd"

export interface RoomRequest {
  id: string
  studentName: string
  roomNumber: string
  block: string
  date: string
  time: string
  reason: string
  priority: "hackathon" | "club" | "individual"
  status: RequestStatus
  rejectionReason?: string
  groupCode?: string
  createdAt: number
}

export interface LabRoom {
  id: string
  name: string
  maxCapacity: number
  currentTeams: number
  groupCodes: string[]
}

export interface RoomInspection {
  id: string
  roomName: string
  inspectedBy: string
  timestamp: string
  status: "clean" | "needs-cleaning" | "technical-issue"
  notes: string
}

export interface CleaningRequest {
  id: string
  roomName: string
  requestedBy: string
  timestamp: string
  status: "pending" | "in-progress" | "completed"
  issue: string
}

interface DataStoreContextType {
  // Requests
  requests: RoomRequest[]
  addRequest: (request: Omit<RoomRequest, "id" | "status" | "createdAt">) => void
  approveByFaculty: (id: string) => void
  rejectByFaculty: (id: string, reason: string) => void
  approveByGawd: (id: string, groupCode: string) => void
  rejectByGawd: (id: string, reason: string) => void

  // Rooms
  rooms: LabRoom[]
  addTeamToRoom: (roomId: string, groupCode: string) => void
  removeTeamFromRoom: (roomId: string, groupCode: string) => void

  // Inspections
  inspections: RoomInspection[]
  addInspection: (inspection: Omit<RoomInspection, "id">) => void

  // Cleaning Requests
  cleaningRequests: CleaningRequest[]
  addCleaningRequest: (request: Omit<CleaningRequest, "id" | "status" | "timestamp">) => void
  updateCleaningStatus: (id: string, status: CleaningRequest["status"]) => void
}

const DataStoreContext = createContext<DataStoreContextType | undefined>(undefined)

export function DataStoreProvider({ children }: { children: ReactNode }) {
  const [requests, setRequests] = useState<RoomRequest[]>([
    {
      id: "1",
      studentName: "Rahul Kumar",
      roomNumber: "CB-103",
      block: "Computer Block",
      date: "2025-01-10",
      time: "10:00-12:00",
      reason: "Project work for AI hackathon",
      priority: "hackathon",
      status: "pending-faculty",
      createdAt: Date.now() - 3600000,
    },
    {
      id: "2",
      studentName: "Amit Patel",
      roomNumber: "CB-101",
      block: "Computer Block",
      date: "2025-01-05",
      time: "14:00-16:00",
      reason: "Hackathon preparation",
      priority: "hackathon",
      status: "approved",
      groupCode: "TEAM-A01",
      createdAt: Date.now() - 7200000,
    },
  ])

  const [rooms, setRooms] = useState<LabRoom[]>([
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
  ])

  const [inspections, setInspections] = useState<RoomInspection[]>([
    {
      id: "1",
      roomName: "Computer Lab CB-101",
      inspectedBy: "Security Guard 1",
      timestamp: new Date(Date.now() - 3600000).toLocaleString(),
      status: "clean",
      notes: "All systems operational",
    },
  ])

  const [cleaningRequests, setCleaningRequests] = useState<CleaningRequest[]>([
    {
      id: "1",
      roomName: "Computer Lab CB-102",
      requestedBy: "Security Guard 1",
      timestamp: new Date(Date.now() - 1800000).toLocaleString(),
      status: "pending",
      issue: "Spilled water needs cleanup",
    },
  ])

  const addRequest = useCallback((request: Omit<RoomRequest, "id" | "status" | "createdAt">) => {
    const newRequest: RoomRequest = {
      ...request,
      id: String(Date.now()),
      status: "pending-faculty",
      createdAt: Date.now(),
    }
    setRequests((prev) => [newRequest, ...prev])
  }, [])

  const approveByFaculty = useCallback((id: string) => {
    setRequests((prev) =>
      prev.map((req) => (req.id === id ? { ...req, status: "pending-gawd" as RequestStatus } : req)),
    )
  }, [])

  const rejectByFaculty = useCallback((id: string, reason: string) => {
    setRequests((prev) =>
      prev.map((req) =>
        req.id === id ? { ...req, status: "rejected-faculty" as RequestStatus, rejectionReason: reason } : req,
      ),
    )
  }, [])

  const approveByGawd = useCallback((id: string, groupCode: string) => {
    setRequests((prev) =>
      prev.map((req) => (req.id === id ? { ...req, status: "approved" as RequestStatus, groupCode } : req)),
    )
  }, [])

  const rejectByGawd = useCallback((id: string, reason: string) => {
    setRequests((prev) =>
      prev.map((req) =>
        req.id === id ? { ...req, status: "rejected-gawd" as RequestStatus, rejectionReason: reason } : req,
      ),
    )
  }, [])

  const addTeamToRoom = useCallback((roomId: string, groupCode: string) => {
    setRooms((prev) =>
      prev.map((room) => {
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
  }, [])

  const removeTeamFromRoom = useCallback((roomId: string, groupCode: string) => {
    setRooms((prev) =>
      prev.map((room) => {
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
  }, [])

  const addInspection = useCallback((inspection: Omit<RoomInspection, "id">) => {
    const newInspection: RoomInspection = {
      ...inspection,
      id: String(Date.now()),
    }
    setInspections((prev) => [newInspection, ...prev])
  }, [])

  const addCleaningRequest = useCallback((request: Omit<CleaningRequest, "id" | "status" | "timestamp">) => {
    const newRequest: CleaningRequest = {
      ...request,
      id: String(Date.now()),
      status: "pending",
      timestamp: new Date().toLocaleString(),
    }
    setCleaningRequests((prev) => [newRequest, ...prev])
  }, [])

  const updateCleaningStatus = useCallback((id: string, status: CleaningRequest["status"]) => {
    setCleaningRequests((prev) => prev.map((req) => (req.id === id ? { ...req, status } : req)))
  }, [])

  const value: DataStoreContextType = {
    requests,
    addRequest,
    approveByFaculty,
    rejectByFaculty,
    approveByGawd,
    rejectByGawd,
    rooms,
    addTeamToRoom,
    removeTeamFromRoom,
    inspections,
    addInspection,
    cleaningRequests,
    addCleaningRequest,
    updateCleaningStatus,
  }

  return <DataStoreContext.Provider value={value}>{children}</DataStoreContext.Provider>
}

export function useDataStore() {
  const context = useContext(DataStoreContext)
  if (context === undefined) {
    throw new Error("useDataStore must be used within a DataStoreProvider")
  }
  return context
}
