"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  LayoutDashboard,
  FileText,
  GitBranch,
  CheckSquare,
  Search,
  BarChart3,
  Puzzle,
  Settings,
  Shield,
} from "lucide-react"

const navigation = [
  { name: "Dashboard", href: "/app/dashboard", icon: LayoutDashboard },
  { name: "Documents", href: "/app/documents", icon: FileText },
  { name: "Workflows", href: "/app/workflows", icon: GitBranch },
  { name: "Approvals", href: "/app/approvals", icon: CheckSquare },
  { name: "Search", href: "/app/search", icon: Search },
  { name: "Audit", href: "/app/audit", icon: Shield },
  { name: "Analytics", href: "/app/analytics", icon: BarChart3 },
  { name: "Integrations", href: "/app/integrations", icon: Puzzle },
  { name: "Settings", href: "/app/settings", icon: Settings },
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <div className="w-64 bg-card border-r border-border flex flex-col">
      <div className="p-6 border-b border-border">
        <Link href="/app/dashboard" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-[#2563eb] rounded-lg flex items-center justify-center">
            <FileText className="w-4 h-4 text-white" />
          </div>
          <span className="text-xl font-bold text-[#2563eb]">DocuFlow</span>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Button
              key={item.name}
              asChild
              variant={isActive ? "secondary" : "ghost"}
              className={cn("w-full justify-start", isActive && "bg-[#2563eb]/10 text-[#2563eb] hover:bg-[#2563eb]/20")}
            >
              <Link href={item.href}>
                <item.icon className="mr-3 h-4 w-4" />
                {item.name}
              </Link>
            </Button>
          )
        })}
      </nav>
    </div>
  )
}
