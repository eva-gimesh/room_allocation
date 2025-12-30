"use client"

import type React from "react"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { UserRole } from "./landing-page"
import { Users, Shield, Crown, Lock, Wrench, GraduationCap } from "lucide-react"

interface LoginScreenProps {
  onLogin: (role: UserRole, name: string) => void
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [selectedRole, setSelectedRole] = useState<UserRole>(null)
  const [name, setName] = useState("")

  const roles = [
    {
      id: "student" as UserRole,
      title: "Student",
      description: "View and request lab rooms",
      icon: GraduationCap,
      color: "from-blue-500/20 to-cyan-500/20",
      iconColor: "text-blue-400",
    },
    {
      id: "faculty" as UserRole,
      title: "Faculty / Mentor",
      description: "Approve student requests",
      icon: Users,
      color: "from-purple-500/20 to-pink-500/20",
      iconColor: "text-purple-400",
    },
    {
      id: "room-gawd" as UserRole,
      title: "Room Booking Gawd",
      description: "Final approval & room management",
      icon: Crown,
      color: "from-amber-500/20 to-orange-500/20",
      iconColor: "text-amber-400",
    },
    {
      id: "security" as UserRole,
      title: "Security Guard",
      description: "QR scanning & room inspection",
      icon: Shield,
      color: "from-green-500/20 to-emerald-500/20",
      iconColor: "text-green-400",
    },
    {
      id: "cts" as UserRole,
      title: "CTS / Cleaning Staff",
      description: "Handle maintenance requests",
      icon: Wrench,
      color: "from-teal-500/20 to-cyan-500/20",
      iconColor: "text-teal-400",
    },
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedRole && name.trim()) {
      onLogin(selectedRole, name.trim())
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Lock className="h-12 w-12 text-primary" />
          </div>
          <h1 className="text-5xl font-bold text-balance mb-3 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Lab Room Management System
          </h1>
          <p className="text-lg text-muted-foreground">Smart Room Access & Accountability System</p>
        </div>

        {/* Role Selection */}
        {!selectedRole ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {roles.map((role) => {
              const Icon = role.icon
              return (
                <Card
                  key={role.id}
                  className="group relative overflow-hidden border-border/50 bg-card/30 backdrop-blur-sm cursor-pointer transition-all hover:scale-105 hover:shadow-2xl hover:bg-card/50"
                  onClick={() => setSelectedRole(role.id)}
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${role.color} opacity-0 group-hover:opacity-100 transition-opacity`}
                  />

                  <div className="relative p-8 text-center">
                    <div className="flex justify-center mb-4">
                      <div className="p-4 rounded-xl bg-background/50">
                        <Icon className={`h-10 w-10 ${role.iconColor}`} />
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold mb-2 text-card-foreground">{role.title}</h3>
                    <p className="text-sm text-muted-foreground">{role.description}</p>
                  </div>
                </Card>
              )
            })}
          </div>
        ) : (
          <Card className="max-w-md mx-auto border-border/50 bg-card/30 backdrop-blur-sm">
            <form onSubmit={handleSubmit} className="p-8">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-card-foreground mb-2">
                  Login as {roles.find((r) => r.id === selectedRole)?.title}
                </h2>
                <p className="text-sm text-muted-foreground">Enter your name to continue</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-background/50"
                    autoFocus
                  />
                </div>

                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1 bg-transparent"
                    onClick={() => setSelectedRole(null)}
                  >
                    Back
                  </Button>
                  <Button type="submit" className="flex-1" disabled={!name.trim()}>
                    Continue
                  </Button>
                </div>
              </div>
            </form>
          </Card>
        )}
      </div>
    </div>
  )
}
