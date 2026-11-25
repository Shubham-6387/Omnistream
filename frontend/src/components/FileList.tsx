import { RoomFile, downloadFileUrl } from '../lib/api'
import { Badge, ClockIcon, EmptyState, FolderIcon } from './ui'

interface FileListProps {
  files: RoomFile[]
  roomId: string
  participantId: string
  onDownloaded: () => void
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

export function FileList({ files, roomId, participantId, onDownloaded }: FileListProps) {
  if (files.length === 0) {
    return (
      <EmptyState
        title="No files waiting"
        description="Dropped files will appear here as soon as they are ready to download."
      />
    )
  }

  return (
    <ul className="space-y-3">
      {files.map((f) => {
        const isAiNotes = f.FileName === 'AI_Meeting_Notes.md' || f.FileName === 'AI_Lecture_Notes.md'
        return (
        <li
          key={f.ID}
          className="flex items-start justify-between gap-4 rounded-[20px] border border-white/10 bg-white/[0.03] px-4 py-4 text-sm"
        >
          <div className="min-w-0 flex items-start gap-3">
            <div className="mt-0.5 rounded-2xl border border-white/10 bg-white/[0.04] p-2 text-cyan-300">
              <FolderIcon className="h-4 w-4" />
            </div>
            <div className="min-w-0 space-y-1">
              <div className="flex items-center gap-2">
                <p className="truncate font-medium text-white">{f.FileName}</p>
                {isAiNotes && <Badge tone="success">AI notes</Badge>}
              </div>
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
                <span>{formatBytes(f.FileSize)}</span>
                <span className="h-1 w-1 rounded-full bg-white/30" />
                <span className="inline-flex items-center gap-1">
                  <ClockIcon className="h-3.5 w-3.5" />
                  {new Date(f.CreatedAt).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
                </span>
                <Badge tone={f.Status === 'ready' ? 'success' : 'neutral'}>{f.Status}</Badge>
              </div>
            </div>
          </div>
          <a
            href={downloadFileUrl(roomId, f.ID, participantId)}
            download={f.FileName}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setTimeout(onDownloaded, 1500)}
            className="omni-button-secondary shrink-0 px-3 py-2 text-xs"
          >
            {isAiNotes ? 'Download notes' : 'Download'}
          </a>
        </li>
        )
      })}
    </ul>
  )
}
