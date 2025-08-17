"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AnnotationsTab } from "@/components/annotations-tab"
import { MetadataTab } from "@/components/metadata-tab"
import { VersionsTab } from "@/components/versions-tab"
import { ActivityTab } from "@/components/activity-tab"

interface DocumentSidebarProps {
  documentId: string
}

export function DocumentSidebar({ documentId }: DocumentSidebarProps) {
  return (
    <div className="h-full flex flex-col">
      <Tabs defaultValue="annotations" className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-4 m-4">
          <TabsTrigger value="annotations" className="text-xs">
            Notes
          </TabsTrigger>
          <TabsTrigger value="metadata" className="text-xs">
            Info
          </TabsTrigger>
          <TabsTrigger value="versions" className="text-xs">
            Versions
          </TabsTrigger>
          <TabsTrigger value="activity" className="text-xs">
            Activity
          </TabsTrigger>
        </TabsList>

        <div className="flex-1 overflow-auto">
          <TabsContent value="annotations" className="m-0 p-4">
            <AnnotationsTab documentId={documentId} />
          </TabsContent>
          <TabsContent value="metadata" className="m-0 p-4">
            <MetadataTab documentId={documentId} />
          </TabsContent>
          <TabsContent value="versions" className="m-0 p-4">
            <VersionsTab documentId={documentId} />
          </TabsContent>
          <TabsContent value="activity" className="m-0 p-4">
            <ActivityTab documentId={documentId} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}
