'use client'

import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Button } from '~/app/components/ui/button'
import { Card } from '~/app/components/ui/card'
import { Label } from '~/app/components/ui/label'
import { getFileSizeInMB } from '~/app/utils/file.util'
import { cn } from '~/app/lib/utils'

interface FileUploadProps {
  maxFiles?: number
  onFilesChange?: (files: File[]) => void
}

export function FileUpload({ maxFiles, onFilesChange }: FileUploadProps) {
  const [files, setFiles] = useState<File[]>([])

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const newFiles = [...files, ...acceptedFiles].slice(0, maxFiles ?? Infinity)
      setFiles(newFiles)
      onFilesChange?.(newFiles)
    },
    [files, maxFiles, onFilesChange]
  )

  const { getRootProps, getInputProps } = useDropzone({ onDrop })

  const removeFile = (fileName: string) => {
    const newFiles = files.filter((file) => file.name !== fileName)
    setFiles(newFiles)
    onFilesChange?.(newFiles)
  }

  return (
    <Card className="p-4 space-y-4">
      <div
        {...getRootProps()}
        className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-gray-400"
      >
        <input {...getInputProps()} />
        <p>Drop files here or click to upload</p>
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file) => (
            <div
              key={file.name}
              className="flex items-center justify-between p-2 border rounded-md border-gray-200"
            >
              <div className="flex items-center space-x-2">
                <i className="ri-file-text-fill text-gray-500" />
                <div>
                  <div className="font-medium">{file.name}</div>
                  <div className="text-sm text-gray-500">{getFileSizeInMB(file)} MB</div>
                </div>
              </div>
              <Button size="sm" variant="destructive" onClick={() => removeFile(file.name)}>
                Delete
              </Button>
            </div>
          ))}
        </div>
      )}
    </Card>
  )
}
