import type React from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { AppHeader } from "@/components/app-header"
import { Breadcrumbs } from "@/components/breadcrumbs"
import AuthGuard from "@/components/auth-guard"

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthGuard>
      <div className="flex h-screen bg-background">
        <AppSidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <AppHeader />
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="px-6 py-4 border-b">
              <Breadcrumbs />
            </div>
            <main className="flex-1 overflow-auto p-6">{children}</main>
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}
