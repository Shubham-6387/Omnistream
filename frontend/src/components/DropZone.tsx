import { useRef, useState } from 'react'
import { Button, UploadIcon } from './ui'

interface DropZoneProps {
  onFilesSelected: (files: File[]) => void
  disabled?: boolean
}

export function DropZone({ onFilesSelected, disabled }: DropZoneProps) {
  const [isDragging, setIsDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement | null>(null)

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault()
        setIsDragging(true)
      }}
      onDragLeave={(e) => {
        e.preventDefault()
        setIsDragging(false)
      }}
      onDrop={(e) => {
        e.preventDefault()
        setIsDragging(false)
        if (disabled) return
        const files = Array.from(e.dataTransfer.files)
        if (files.length) onFilesSelected(files)
      }}
      onClick={() => {
        if (disabled) return
        inputRef.current?.click()
      }}
      onKeyDown={(event) => {
        if (disabled) return
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          inputRef.current?.click()
        }
      }}
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-label="Upload files"
      className={`flex min-h-40 w-full flex-col items-center justify-center rounded-[22px] border border-dashed text-center transition duration-150 ease-out ${
        isDragging ? 'border-cyan-400/70 bg-cyan-400/10' : 'border-white/10 bg-white/[0.03]'
      } ${disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer hover:border-white/20 hover:bg-white/[0.05]'}`}
    >
      <div className="mb-3 rounded-2xl border border-white/10 bg-white/[0.04] p-3 text-cyan-300">
        <UploadIcon className="h-6 w-6" />
      </div>
      <p className="text-sm font-semibold text-white">{disabled ? 'Uploading files' : 'Drop files here'}</p>
      <p className="mt-1 text-xs text-slate-400">or click to browse from your device</p>
      <input
        ref={inputRef}
        type="file"
        multiple
        className="hidden"
        onChange={(e) => {
          if (e.target.files) onFilesSelected(Array.from(e.target.files))
          e.target.value = '' // allow re-selecting the same file later
        }}
      />
      <div className="mt-4">
        <Button
          variant="secondary"
          type="button"
          disabled={disabled}
          onClick={(event) => {
            event.stopPropagation()
            inputRef.current?.click()
          }}
        >
          Browse files
        </Button>
      </div>
    </div>
  )
}
