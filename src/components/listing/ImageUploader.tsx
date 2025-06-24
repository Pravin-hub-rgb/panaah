"use client"

import { Input } from "../ui/input"
import { FormControl } from "../ui/form"
import Image from "next/image"
import { useRef, useState, useEffect } from "react"

type ImageUploaderProps = {
  files: File[]
  setFiles: React.Dispatch<React.SetStateAction<File[]>>
  onChange?: (files: File[]) => void
  maxFiles?: number
}

export function ImageUploader({ files, setFiles, onChange, maxFiles = 10 }: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [previewUrls, setPreviewUrls] = useState<string[]>([])

  // Create preview URLs when files change
  useEffect(() => {
    const urls = files.map(file => URL.createObjectURL(file))
    setPreviewUrls(urls)

    // Cleanup old URLs to prevent memory leaks
    return () => {
      urls.forEach(url => URL.revokeObjectURL(url))
    }
  }, [files])

  const handleFiles = (incoming: File[]) => {
    // Filter only image files
    const imageFiles = incoming.filter(file => file.type.startsWith("image/"))
    
    // Respect max files limit
    const availableSlots = maxFiles - files.length
    const filesToAdd = imageFiles.slice(0, availableSlots)
    
    if (filesToAdd.length < imageFiles.length) {
      alert(`You can only upload ${maxFiles} images maximum. ${imageFiles.length - filesToAdd.length} files were skipped.`)
    }

    const newFiles = [...files, ...filesToAdd]
    setFiles(newFiles)
    onChange?.(newFiles)
    
    // Reset input value so same file can be selected again if needed
    if (inputRef.current) {
      inputRef.current.value = ''
    }
  }

  const removeFile = (index: number) => {
    const newFiles = [...files]
    newFiles.splice(index, 1)
    setFiles(newFiles)
    onChange?.(newFiles)
  }

  return (
    <FormControl>
      <div className="space-y-4">
        <div className="border border-dashed rounded-xl border-gray-400">
          <div
            className="flex flex-col items-center justify-center gap-2 rounded-md border border-dashed border-muted bg-muted/20 px-6 py-8 text-muted-foreground transition hover:bg-muted/30 cursor-pointer"
            onClick={() => inputRef.current?.click()}
            onDrop={(e) => {
              e.preventDefault()
              const droppedFiles = Array.from(e.dataTransfer.files)
              handleFiles(droppedFiles)
            }}
            onDragOver={(e) => e.preventDefault()}
            onDragEnter={(e) => e.preventDefault()}
          >
            <div className="text-center">
              <p className="text-sm font-medium">Click to select or drag & drop images</p>
              <p className="text-xs text-muted-foreground mt-1">
                PNG, JPG, JPEG up to 10MB each (max {maxFiles} files)
              </p>
              <p className="text-xs text-muted-foreground">
                {files.length}/{maxFiles} files selected
              </p>
            </div>
            <Input
              ref={inputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => {
                const selected = Array.from(e.target.files ?? [])
                handleFiles(selected)
              }}
            />
          </div>
        </div>

        {/* Preview section */}
        {files.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Selected Images ({files.length})</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {files.map((file, i) => (
                <div key={i} className="relative group">
                  <div className="relative h-24 w-full">
                    <Image
                      src={previewUrls[i] ?? ''}
                      alt={`Preview ${i + 1}`}
                      fill
                      className="object-cover rounded border"
                      sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      unoptimized // Since these are local blob URLs
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFile(i)}
                    className="absolute top-1 right-1 rounded-full bg-red-500 text-white text-xs w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition hover:bg-red-600"
                    title="Remove image"
                  >
                    ✕
                  </button>
                  <div className="absolute bottom-1 left-1 bg-black/60 text-white text-xs px-1 rounded">
                    {i + 1}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </FormControl>
  )
}