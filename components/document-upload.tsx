"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Upload, File, X } from "lucide-react"
import { useDocumentStore } from "@/stores/document-store"
import { uploadDocument } from "@/lib/mocks"
import { useToast } from "@/hooks/use-toast"

interface UploadFile {
  file: File
  progress: number
  status: "uploading" | "processing" | "complete" | "error"
}

export function DocumentUpload() {
  const [isOpen, setIsOpen] = useState(false)
  const [uploadFiles, setUploadFiles] = useState<UploadFile[]>([])
  const { addDocument } = useDocumentStore()
  const { toast } = useToast()

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const newFiles = acceptedFiles.map((file) => ({
        file,
        progress: 0,
        status: "uploading" as const,
      }))

      setUploadFiles((prev) => [...prev, ...newFiles])

      for (const uploadFile of newFiles) {
        try {
          // Simulate upload progress
          const progressInterval = setInterval(() => {
            setUploadFiles((prev) =>
              prev.map((f) =>
                f.file === uploadFile.file && f.progress < 90 ? { ...f, progress: f.progress + 10 } : f,
              ),
            )
          }, 200)

          const document = await uploadDocument(uploadFile.file)

          clearInterval(progressInterval)

          setUploadFiles((prev) =>
            prev.map((f) => (f.file === uploadFile.file ? { ...f, progress: 100, status: "processing" } : f)),
          )

          // Simulate processing
          setTimeout(() => {
            setUploadFiles((prev) => prev.map((f) => (f.file === uploadFile.file ? { ...f, status: "complete" } : f)))
            addDocument(document)
            toast({
              title: "Document uploaded",
              description: `${uploadFile.file.name} has been uploaded successfully.`,
            })
          }, 2000)
        } catch (error) {
          setUploadFiles((prev) => prev.map((f) => (f.file === uploadFile.file ? { ...f, status: "error" } : f)))
          toast({
            title: "Upload failed",
            description: `Failed to upload ${uploadFile.file.name}`,
            variant: "destructive",
          })
        }
      }
    },
    [addDocument, toast],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "image/*": [".png", ".jpg", ".jpeg"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
    },
  })

  const removeFile = (fileToRemove: File) => {
    setUploadFiles((prev) => prev.filter((f) => f.file !== fileToRemove))
  }

  if (!isOpen) {
    return (
      <Button onClick={() => setIsOpen(true)} className="bg-[#2563eb] hover:bg-[#1d4ed8]">
        <Upload className="mr-2 h-4 w-4" />
        Upload Documents
      </Button>
    )
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Upload Documents</h3>
          <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragActive ? "border-[#2563eb] bg-[#2563eb]/5" : "border-muted-foreground/25 hover:border-[#2563eb]/50"
          }`}
        >
          <input {...getInputProps()} />
          <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          {isDragActive ? (
            <p className="text-lg">Drop the files here...</p>
          ) : (
            <div>
              <p className="text-lg mb-2">Drag & drop files here, or click to select</p>
              <p className="text-sm text-muted-foreground">Supports PDF, Images, and Word documents</p>
            </div>
          )}
        </div>

        {uploadFiles.length > 0 && (
          <div className="mt-6 space-y-3">
            <h4 className="font-medium">Uploading Files</h4>
            {uploadFiles.map((uploadFile, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 border rounded-lg">
                <File className="h-8 w-8 text-muted-foreground" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{uploadFile.file.name}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <Progress value={uploadFile.progress} className="flex-1" />
                    <span className="text-xs text-muted-foreground capitalize">{uploadFile.status}</span>
                  </div>
                </div>
                {uploadFile.status === "error" && (
                  <Button variant="ghost" size="sm" onClick={() => removeFile(uploadFile.file)}>
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
