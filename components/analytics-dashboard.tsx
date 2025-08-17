"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Download, FileText, Clock, Users, CheckCircle } from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts"

const documentProcessingData = [
  { month: "Jan", processed: 1200, failed: 45, success_rate: 96.3 },
  { month: "Feb", processed: 1350, failed: 32, success_rate: 97.6 },
  { month: "Mar", processed: 1580, failed: 28, success_rate: 98.2 },
  { month: "Apr", processed: 1420, failed: 35, success_rate: 97.5 },
  { month: "May", processed: 1680, failed: 22, success_rate: 98.7 },
  { month: "Jun", processed: 1890, failed: 18, success_rate: 99.0 },
]

const workflowPerformanceData = [
  { name: "Invoice Processing", executions: 450, avg_time: 2.3, success_rate: 98.5 },
  { name: "Contract Review", executions: 280, avg_time: 5.7, success_rate: 96.8 },
  { name: "Document Classification", executions: 620, avg_time: 1.2, success_rate: 99.2 },
  { name: "Data Extraction", executions: 380, avg_time: 3.1, success_rate: 97.9 },
]

const documentTypesData = [
  { name: "Invoices", value: 35, color: "#2563eb" },
  { name: "Contracts", value: 25, color: "#7c3aed" },
  { name: "Reports", value: 20, color: "#059669" },
  { name: "Forms", value: 15, color: "#dc2626" },
  { name: "Other", value: 5, color: "#9ca3af" },
]

const userActivityData = [
  { day: "Mon", uploads: 45, views: 120, downloads: 32 },
  { day: "Tue", uploads: 52, views: 135, downloads: 28 },
  { day: "Wed", uploads: 38, views: 98, downloads: 35 },
  { day: "Thu", uploads: 61, views: 142, downloads: 41 },
  { day: "Fri", uploads: 48, views: 118, downloads: 29 },
  { day: "Sat", uploads: 23, views: 67, downloads: 18 },
  { day: "Sun", uploads: 19, views: 52, downloads: 12 },
]

export function AnalyticsDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground">Detailed insights into your document processing performance</p>
        </div>
        <div className="flex items-center gap-2">
          <Select defaultValue="30d">
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Documents</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">9,120</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+12.5%</span> from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">98.7%</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+0.3%</span> from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Processing Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.4s</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">-0.2s</span> from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+8.2%</span> from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Tabs defaultValue="processing" className="space-y-4">
        <TabsList>
          <TabsTrigger value="processing">Document Processing</TabsTrigger>
          <TabsTrigger value="workflows">Workflow Performance</TabsTrigger>
          <TabsTrigger value="types">Document Types</TabsTrigger>
          <TabsTrigger value="activity">User Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="processing" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Documents Processed</CardTitle>
                <CardDescription>Monthly document processing volume</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={documentProcessingData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="processed" fill="#2563eb" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Success Rate Trend</CardTitle>
                <CardDescription>Processing success rate over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={documentProcessingData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis domain={[95, 100]} />
                    <Tooltip />
                    <Line type="monotone" dataKey="success_rate" stroke="#059669" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="workflows" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Workflow Performance</CardTitle>
              <CardDescription>Performance metrics for each workflow</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {workflowPerformanceData.map((workflow) => (
                  <div key={workflow.name} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{workflow.name}</h4>
                      <p className="text-sm text-muted-foreground">{workflow.executions} executions</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{workflow.avg_time}s avg time</p>
                      <p className="text-sm text-green-600">{workflow.success_rate}% success</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="types" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Document Types Distribution</CardTitle>
                <CardDescription>Breakdown of processed document types</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={documentTypesData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}%`}
                    >
                      {documentTypesData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Document Types Legend</CardTitle>
                <CardDescription>Color coding for document types</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {documentTypesData.map((type) => (
                    <div key={type.name} className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded" style={{ backgroundColor: type.color }} />
                      <span className="text-sm">{type.name}</span>
                      <span className="text-sm text-muted-foreground ml-auto">{type.value}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Activity</CardTitle>
              <CardDescription>Daily user activity patterns</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={userActivityData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="uploads" stackId="1" stroke="#2563eb" fill="#2563eb" />
                  <Area type="monotone" dataKey="views" stackId="1" stroke="#7c3aed" fill="#7c3aed" />
                  <Area type="monotone" dataKey="downloads" stackId="1" stroke="#059669" fill="#059669" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
