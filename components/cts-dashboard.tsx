"use client"

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Wrench, LogOut, Clock, MapPin, CheckCircle, AlertCircle } from "lucide-react"
import { useDataStore, type CleaningRequest } from "@/lib/data-store"

interface DashboardProps {
  userName: string
  onLogout: () => void
}

export function CTSDashboard({ userName, onLogout }: DashboardProps) {
  const { cleaningRequests, updateCleaningStatus } = useDataStore()

  const handleUpdateStatus = (id: string, status: CleaningRequest["status"]) => {
    updateCleaningStatus(id, status)
  }

  const getPriorityBadge = (type: string) => {
    if (type.toLowerCase().includes("urgent") || type.toLowerCase().includes("high")) {
      return <Badge variant="destructive">High Priority</Badge>
    }
    return <Badge variant="secondary">Normal</Badge>
  }

  const getStatusBadge = (status: CleaningRequest["status"]) => {
    const config = {
      pending: { label: "Pending", variant: "secondary" as const, icon: AlertCircle },
      "in-progress": { label: "In Progress", variant: "default" as const, icon: Clock },
      completed: { label: "Completed", variant: "default" as const, icon: CheckCircle },
    }
    const { label, variant, icon: Icon } = config[status]
    return (
      <Badge variant={variant} className="gap-1.5">
        <Icon className="h-3 w-3" />
        {label}
      </Badge>
    )
  }

  const pendingRequests = cleaningRequests.filter((r) => r.status === "pending")
  const activeRequests = cleaningRequests.filter((r) => r.status === "in-progress")
  const completedRequests = cleaningRequests.filter((r) => r.status === "completed")

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-teal-500/10">
                <Wrench className="h-8 w-8 text-teal-400" />
              </div>
              CTS Dashboard
            </h1>
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
                  <AlertCircle className="h-6 w-6 text-yellow-400" />
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
                <div className="p-3 rounded-lg bg-blue-500/10">
                  <Clock className="h-6 w-6 text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">In Progress</p>
                  <p className="text-2xl font-bold">{activeRequests.length}</p>
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
                  <p className="text-sm text-muted-foreground">Completed Today</p>
                  <p className="text-2xl font-bold">{completedRequests.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pending Tasks */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Pending Tasks</h2>
          <div className="grid gap-4">
            {pendingRequests.length === 0 ? (
              <Card className="bg-card/30 backdrop-blur-sm">
                <CardContent className="py-12 text-center text-muted-foreground">No pending tasks</CardContent>
              </Card>
            ) : (
              pendingRequests.map((request) => (
                <Card key={request.id} className="bg-card/50 backdrop-blur-sm hover:bg-card/70 transition-all">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-xl flex items-center gap-2">
                          <MapPin className="h-5 w-5 text-primary" />
                          {request.roomName}
                        </CardTitle>
                        <CardDescription className="mt-1">Cleaning Request</CardDescription>
                      </div>
                      <div className="flex gap-2">
                        {getPriorityBadge(request.issue)}
                        {getStatusBadge(request.status)}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="p-3 bg-muted/30 rounded-md">
                        <p className="text-sm font-medium mb-1">Description:</p>
                        <p className="text-sm text-muted-foreground">{request.issue}</p>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Requested by: {request.requestedBy}</span>
                        <span className="text-muted-foreground">{request.timestamp}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="gap-3">
                    <Button className="flex-1" onClick={() => handleUpdateStatus(request.id, "in-progress")}>
                      <Clock className="h-4 w-4" />
                      Start Task
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1 bg-transparent"
                      onClick={() => handleUpdateStatus(request.id, "completed")}
                    >
                      <CheckCircle className="h-4 w-4" />
                      Mark Complete
                    </Button>
                  </CardFooter>
                </Card>
              ))
            )}
          </div>
        </div>

        {/* In Progress */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">In Progress</h2>
          <div className="grid gap-4">
            {activeRequests.length === 0 ? (
              <Card className="bg-card/30 backdrop-blur-sm">
                <CardContent className="py-12 text-center text-muted-foreground">No active tasks</CardContent>
              </Card>
            ) : (
              activeRequests.map((request) => (
                <Card key={request.id} className="bg-card/50 backdrop-blur-sm border-primary/30">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-xl flex items-center gap-2">
                          <MapPin className="h-5 w-5 text-primary" />
                          {request.roomName}
                        </CardTitle>
                        <CardDescription className="mt-1">Cleaning Request</CardDescription>
                      </div>
                      {getStatusBadge(request.status)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="p-3 bg-muted/30 rounded-md">
                      <p className="text-sm font-medium mb-1">Description:</p>
                      <p className="text-sm text-muted-foreground">{request.issue}</p>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full" onClick={() => handleUpdateStatus(request.id, "completed")}>
                      <CheckCircle className="h-4 w-4" />
                      Mark as Completed
                    </Button>
                  </CardFooter>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
