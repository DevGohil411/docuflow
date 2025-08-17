"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Plus, Settings, Zap, Database, Mail, Cloud, Video } from "lucide-react"

const connectedIntegrations = [
  {
    id: "slack",
    name: "Slack",
    description: "Send notifications and updates to Slack channels",
    category: "Communication",
    status: "connected",
    lastSync: "2 hours ago",
    icon: Mail,
    color: "bg-green-500",
  },
  {
    id: "zapier",
    name: "Zapier",
    description: "Automate workflows with 5000+ apps",
    category: "Automation",
    status: "connected",
    lastSync: "1 day ago",
    icon: Zap,
    color: "bg-orange-500",
  },
  {
    id: "dropbox",
    name: "Dropbox",
    description: "Sync documents with Dropbox storage",
    category: "Storage",
    status: "connected",
    lastSync: "30 minutes ago",
    icon: Cloud,
    color: "bg-blue-500",
  },
]

const availableIntegrations = [
  {
    id: "google-drive",
    name: "Google Drive",
    description: "Sync and backup documents to Google Drive",
    category: "Storage",
    icon: Cloud,
    color: "bg-blue-500",
    popular: true,
    available: true,
  },
  {
    id: "google-meet",
    name: "Google Meet",
    description: "Schedule and join meetings directly from DocuFlow",
    category: "Communication",
    icon: Video,
    color: "bg-green-500",
    popular: true,
    available: true,
  },
  {
    id: "salesforce",
    name: "Salesforce",
    description: "Sync customer data and documents with Salesforce CRM",
    category: "CRM",
    icon: Database,
    color: "bg-blue-600",
    popular: true,
    available: false,
  },
  {
    id: "microsoft-teams",
    name: "Microsoft Teams",
    description: "Share documents and collaborate in Teams channels",
    category: "Communication",
    icon: Mail,
    color: "bg-purple-500",
    popular: true,
    available: false,
  },
  {
    id: "hubspot",
    name: "HubSpot",
    description: "Connect customer documents with HubSpot CRM",
    category: "CRM",
    icon: Database,
    color: "bg-orange-600",
    popular: false,
    available: false,
  },
  {
    id: "webhook",
    name: "Custom Webhook",
    description: "Send document events to custom webhook endpoints",
    category: "Developer",
    icon: Zap,
    color: "bg-gray-500",
    popular: false,
    available: false,
  },
]

export function IntegrationsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  const handleConnect = (integration: any) => {
    if (integration.id === "google-drive") {
      alert("Redirecting to Google Drive authentication...")
      // In a real app, this would redirect to Google OAuth
      window.open(
        "https://accounts.google.com/oauth/authorize?client_id=your-client-id&redirect_uri=your-redirect&scope=https://www.googleapis.com/auth/drive",
        "_blank",
      )
    } else if (integration.id === "google-meet") {
      alert("Opening Google Meet...")
      window.open("https://meet.google.com", "_blank")
    } else {
      alert("Coming soon...")
    }
  }

  const filteredIntegrations = availableIntegrations.filter((integration) => {
    const matchesSearch =
      searchQuery === "" ||
      integration.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      integration.description.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategory = selectedCategory === "all" || integration.category.toLowerCase() === selectedCategory

    return matchesSearch && matchesCategory
  })

  const categories = ["all", "communication", "storage", "crm", "automation", "developer"]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Integrations</h1>
        <p className="text-muted-foreground">Connect DocuFlow with your favorite tools and services</p>
      </div>

      <Tabs defaultValue="connected" className="space-y-4">
        <TabsList>
          <TabsTrigger value="connected">Connected ({connectedIntegrations.length})</TabsTrigger>
          <TabsTrigger value="available">Available ({availableIntegrations.length})</TabsTrigger>
          <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
        </TabsList>

        <TabsContent value="connected" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {connectedIntegrations.map((integration) => {
              const Icon = integration.icon
              return (
                <Card key={integration.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${integration.color} text-white`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{integration.name}</CardTitle>
                          <Badge variant="outline">{integration.category}</Badge>
                        </div>
                      </div>
                      <Badge variant="default">Connected</Badge>
                    </div>
                    <CardDescription>{integration.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-sm text-muted-foreground">Last sync: {integration.lastSync}</div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 bg-transparent"
                        onClick={() => alert("Configuration panel opened")}
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        Configure
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => alert("Integration disconnected")}>
                        Disconnect
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="available" className="space-y-4">
          {/* Search and Filter */}
          <Card>
            <CardContent className="p-4">
              <div className="flex gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search integrations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex gap-2">
                  {categories.map((category) => (
                    <Button
                      key={category}
                      variant={selectedCategory === category ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedCategory(category)}
                      className="capitalize"
                    >
                      {category}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Popular Integrations */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Popular Integrations</h3>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredIntegrations
                .filter((integration) => integration.popular)
                .map((integration) => {
                  const Icon = integration.icon
                  return (
                    <Card key={integration.id} className="hover:shadow-md transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${integration.color} text-white`}>
                            <Icon className="h-5 w-5" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">{integration.name}</CardTitle>
                            <Badge variant="outline">{integration.category}</Badge>
                          </div>
                        </div>
                        <CardDescription>{integration.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Button
                          className="w-full"
                          onClick={() => handleConnect(integration)}
                          variant={integration.available ? "default" : "outline"}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          {integration.available ? "Connect" : "Coming Soon"}
                        </Button>
                      </CardContent>
                    </Card>
                  )
                })}
            </div>
          </div>

          {/* All Integrations */}
          <div>
            <h3 className="text-lg font-semibold mb-4">All Integrations</h3>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredIntegrations
                .filter((integration) => !integration.popular)
                .map((integration) => {
                  const Icon = integration.icon
                  return (
                    <Card key={integration.id} className="hover:shadow-md transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${integration.color} text-white`}>
                            <Icon className="h-5 w-5" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">{integration.name}</CardTitle>
                            <Badge variant="outline">{integration.category}</Badge>
                          </div>
                        </div>
                        <CardDescription>{integration.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Button
                          variant="outline"
                          className="w-full bg-transparent"
                          onClick={() => handleConnect(integration)}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          {integration.available ? "Connect" : "Coming Soon"}
                        </Button>
                      </CardContent>
                    </Card>
                  )
                })}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="webhooks" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Webhook Endpoints</CardTitle>
              <CardDescription>Configure custom webhook endpoints to receive document events</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">Document Processing Webhook</h4>
                  <p className="text-sm text-muted-foreground">https://api.example.com/webhooks/documents</p>
                  <p className="text-xs text-muted-foreground">Events: document.processed, document.failed</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => alert("Webhook configuration opened")}>
                    <Settings className="h-4 w-4 mr-2" />
                    Configure
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => alert("Webhook test sent")}>
                    Test
                  </Button>
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full bg-transparent"
                onClick={() => alert("Add webhook endpoint dialog opened")}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Webhook Endpoint
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
