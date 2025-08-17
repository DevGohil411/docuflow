"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload, GitBranch, UserPlus, BarChart3 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

const actions = [
  {
    title: "Upload Document",
    description: "Add new documents to process",
    icon: Upload,
    href: "/app/documents",
    color: "bg-[#2563eb] hover:bg-[#1d4ed8]",
    action: "upload",
  },
  {
    title: "Create Workflow",
    description: "Build automated processes",
    icon: GitBranch,
    href: "/app/workflows/builder",
    color: "bg-green-600 hover:bg-green-700",
    action: "navigate",
  },
  {
    title: "Invite User",
    description: "Add team members",
    icon: UserPlus,
    href: "/app/team",
    color: "bg-purple-600 hover:bg-purple-700",
    action: "invite",
  },
  {
    title: "View Analytics",
    description: "Check performance metrics",
    icon: BarChart3,
    href: "/app/analytics",
    color: "bg-orange-600 hover:bg-orange-700",
    action: "navigate",
  },
]

export function QuickActions() {
  const router = useRouter()
  const [isInviting, setIsInviting] = useState(false)

  const handleAction = (action: any) => {
    if (action.action === "upload") {
      const input = document.createElement("input")
      input.type = "file"
      input.multiple = true
      input.accept = ".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
      input.onchange = (e) => {
        const files = (e.target as HTMLInputElement).files
        if (files && files.length > 0) {
          // Simulate upload process
          alert(`Uploading ${files.length} file(s)...`)
          // Navigate to documents page after upload
          router.push("/app/documents")
        }
      }
      input.click()
    } else if (action.action === "invite") {
      setIsInviting(true)
      const email = prompt("Enter email address to invite:")
      if (email) {
        alert(`Invitation sent to ${email}`)
      }
      setIsInviting(false)
    } else {
      router.push(action.href)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {actions.map((action) => (
            <Button
              key={action.title}
              onClick={() => handleAction(action)}
              className={`w-full justify-start h-auto p-4 ${action.color}`}
              disabled={action.action === "invite" && isInviting}
            >
              <div className="flex items-center space-x-3">
                <action.icon className="h-5 w-5" />
                <div className="text-left">
                  <div className="font-medium">{action.title}</div>
                  <div className="text-xs opacity-90">{action.description}</div>
                </div>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
