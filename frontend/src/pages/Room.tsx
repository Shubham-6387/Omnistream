import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { QRCodeSVG } from 'qrcode.react'
import { getParticipantId } from '../lib/participant'
import {
  joinRoom,
  listWaitingFiles,
  uploadFile,
  getVideoToken,
  startRecording,
  RoomFile,
  stopRecording,
} from '../lib/api'
import { useRoomEvents, FileReadyPayload } from '../hooks/useRoomEvents'
import { VideoPanel } from '../components/VideoPanel'
import { DropZone } from '../components/DropZone'
import { FileList } from '../components/FileList'
import {
  ArrowRightIcon,
  Badge,
  Button,
  Card,
  CheckIcon,
  HomeIcon,
  Input,
  LinkIcon,
  LoadingSpinner,
  Modal,
  QrIcon,
  SparkIcon,
  Toast,
} from '../components/ui'

type ToastState = {
  title: string
  description?: string
  tone?: 'neutral' | 'success' | 'warning' | 'danger'
}

type SavedRoomSession = {
  roomId: string
  displayName: string
}

const ROOM_SESSION_KEY = 'omnistream_room_session'

function readRoomSession(): SavedRoomSession | null {
  try {
    const raw = sessionStorage.getItem(ROOM_SESSION_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as Partial<SavedRoomSession>
    if (!parsed.roomId || !parsed.displayName) return null
    return { roomId: parsed.roomId, displayName: parsed.displayName }
  } catch {
    return null
  }
}

function saveRoomSession(roomId: string, displayName: string) {
  sessionStorage.setItem(ROOM_SESSION_KEY, JSON.stringify({ roomId, displayName }))
}

function clearRoomSession() {
  sessionStorage.removeItem(ROOM_SESSION_KEY)
}

export function Room() {
  const { roomId = '' } = useParams()
  const participantId = useRef(getParticipantId()).current
  const joinUrl = `${window.location.origin}/room/${roomId}`

  const [showQR, setShowQR] = useState(false)
  const [copied, setCopied] = useState(false)
  const [displayName, setDisplayName] = useState(() => {
    const savedSession = readRoomSession()
    return savedSession?.roomId === roomId ? savedSession.displayName : ''
  })
  const [showJoinMeetPrompt, setShowJoinMeetPrompt] = useState(false)
  const [joined, setJoined] = useState(false)
  const [joiningRoom, setJoiningRoom] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [files, setFiles] = useState<RoomFile[]>([])
  const [uploading, setUploading] = useState(false)
  const [videoToken, setVideoToken] = useState<string | null>(null)
  const [livekitUrl, setLivekitUrl] = useState<string | null>(null)
  const [isRecording, setIsRecording] = useState(false)
  const [isProcessingNotes, setIsProcessingNotes] = useState(false)
  const [recordingStorageKey, setRecordingStorageKey] = useState<string | null>(null)
  const [toast, setToast] = useState<ToastState | null>(null)

  const refreshFiles = useCallback(async () => {
    try {
      const list = await listWaitingFiles(roomId, participantId)
      setFiles(list)
      if (list.some((file) => (file.FileName === 'AI_Meeting_Notes.md' || file.FileName === 'AI_Lecture_Notes.md') && file.Status === 'ready')) {
        setIsProcessingNotes(false)
      }
    } catch (err) {
      console.error('Failed to refresh file list:', err)
    }
  }, [roomId, participantId])

  useEffect(() => {
    let cancelled = false
    setJoiningRoom(true)
    setError(null)

    ;(async () => {
      try {
        await joinRoom(roomId, participantId)
        if (cancelled) return
        setJoined(true)
        await refreshFiles()

        const savedSession = readRoomSession()
        if (savedSession && savedSession.roomId === roomId && savedSession.displayName) {
          setDisplayName(savedSession.displayName)
          try {
            const { token, livekit_url } = await getVideoToken(roomId, participantId, savedSession.displayName)
            if (!cancelled) {
              setVideoToken(token)
              setLivekitUrl(livekit_url)
            }
          } catch {
            if (!cancelled) {
              setError('Your meeting session expired. Please join again.')
            }
          }
        }

        setToast({
          title: 'Room joined',
          description: 'Your file queue and video token flow are ready.',
          tone: 'success',
        })
      } catch {
        if (!cancelled) {
          setError('Could not join this room. Check the room ID and try again.')
          setToast({
            title: 'Join failed',
            description: 'The room could not be reached from the frontend.',
            tone: 'danger',
          })
        }
      } finally {
        if (!cancelled) setJoiningRoom(false)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [roomId, participantId, refreshFiles])

  useEffect(() => {
    if (!isProcessingNotes) return
    const interval = window.setInterval(() => void refreshFiles(), 4000)
    return () => window.clearInterval(interval)
  }, [isProcessingNotes, refreshFiles])

  useEffect(() => {
    if (!toast) return
    const timeout = window.setTimeout(() => setToast(null), 2600)
    return () => window.clearTimeout(timeout)
  }, [toast])

  const handleFileReady = useCallback(
    (payload: FileReadyPayload) => {
      refreshFiles()
      if (payload.file_name === 'AI_Meeting_Notes.md' || payload.file_name === 'AI_Lecture_Notes.md') {
        setIsProcessingNotes(false)
        setToast({
          title: 'AI notes ready',
          description: 'Download the notes from the Files panel.',
          tone: 'success',
        })
      } else {
        setToast({
          title: 'File ready',
          description: 'A room file finished processing and is available for download.',
          tone: 'success',
        })
      }
    },
    [refreshFiles],
  )

  const { connected } = useRoomEvents(roomId, handleFileReady)

  const handleFilesSelected = async (selected: File[]) => {
    setUploading(true)
    setError(null)
    try {
      for (const file of selected) {
        await uploadFile(roomId, file)
      }
      setToast({
        title: 'Upload sent',
        description: 'Files were handed off to the ingestion service.',
        tone: 'success',
      })
    } catch {
      setError('Upload failed. Check that the ingestion service is reachable.')
      setToast({
        title: 'Upload failed',
        description: 'The ingestion service could not accept the file transfer.',
        tone: 'danger',
      })
    } finally {
      setUploading(false)
    }
  }

  const handleJoinVideo = async () => {
    const nextName = displayName.trim()
    if (!nextName) return
    setError(null)
    setShowJoinMeetPrompt(false)
    saveRoomSession(roomId, nextName)
    try {
      const { token, livekit_url } = await getVideoToken(roomId, participantId, nextName)
      setVideoToken(token)
      setLivekitUrl(livekit_url)
      setToast({
        title: 'Video room ready',
        description: 'LiveKit has issued a token for the meeting session.',
        tone: 'success',
      })
    } catch {
      clearRoomSession()
      setError('Could not start the video call.')
      setToast({
        title: 'Video call failed',
        description: 'Token creation could not complete for this room.',
        tone: 'danger',
      })
    }
  }

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(joinUrl)
      setCopied(true)
      setToast({
        title: 'Invite copied',
        description: 'Share the room link with another participant.',
        tone: 'success',
      })
      window.setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy link', err)
      setToast({
        title: 'Copy failed',
        description: 'The browser did not allow clipboard access.',
        tone: 'warning',
      })
    }
  }

  const toggleRecording = async () => {
    try {
      if (!isRecording) {
        const result = await startRecording(roomId)
        setIsRecording(true)
        setIsProcessingNotes(false)
        setRecordingStorageKey(typeof result?.storage_key === 'string' ? result.storage_key : null)
        setToast({
          title: 'Recording started',
          description: 'Room audio is being recorded. Stop the recording to start AI notes.',
          tone: 'success',
        })
      } else {
        await stopRecording(roomId)
        setIsRecording(false)
        setIsProcessingNotes(true)
        setToast({
          title: 'Recording stopped',
          description: 'Audio is saved. AI notes will appear in the Files panel when ready.',
          tone: 'neutral',
        })
      }
    } catch (err) {
      console.error('Failed to toggle recording state', err)
      setToast({
        title: 'Recording update failed',
        description: 'The backend rejected the recording request.',
        tone: 'danger',
      })
    }
  }

  if (error && !joined && !joiningRoom) {
    return (
      <main className="omni-shell flex min-h-screen items-center justify-center p-6">
        <Card className="w-full max-w-lg p-6 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-rose-400/20 bg-rose-500/10 text-rose-200">
            <SparkIcon className="h-6 w-6" />
          </div>
          <h1 className="mt-5 text-2xl font-semibold text-white">Room unavailable</h1>
          <p className="mt-3 text-sm leading-6 text-slate-400">{error}</p>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <Button variant="secondary" onClick={() => window.location.reload()}>
              Retry
            </Button>
            <Link to="/" className="omni-button-secondary px-4 py-2.5">
              <HomeIcon className="h-4 w-4" />
              Return home
            </Link>
          </div>
        </Card>
      </main>
    )
  }

  return (
    <main className="omni-shell omni-room-shell space-y-5 pb-8">
      <header className="flex flex-col gap-4 rounded-[28px] border border-white/10 bg-white/[0.03] px-4 py-4 backdrop-blur-xl sm:px-5 lg:flex-row lg:items-center lg:justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-cyan-400/15 text-cyan-300">
            <SparkIcon className="h-5 w-5" />
          </div>
          <div>
            <p className="text-lg font-semibold tracking-tight text-white">OmniStream</p>
            <p className="text-sm text-slate-400">Meeting room shell</p>
          </div>
        </Link>

        <div className="flex flex-wrap items-center gap-2">
          <Badge tone={connected ? 'success' : 'warning'}>{connected ? 'Events live' : 'Connecting'}</Badge>
          <Badge tone={joiningRoom ? 'warning' : 'neutral'}>{joiningRoom ? 'Joining room' : 'Room ready'}</Badge>
          <Button variant="secondary" onClick={handleCopyLink}>
            <LinkIcon className="h-4 w-4" />
            {copied ? 'Copied' : 'Copy invite'}
          </Button>
          <Button variant="secondary" onClick={() => setShowQR(true)}>
            <QrIcon className="h-4 w-4" />
            Share QR
          </Button>
        </div>
      </header>

      {!videoToken ? (
        <section className="mx-auto w-full max-w-6xl">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,0.6fr)]">
            <div className="omni-room-light-card rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_24px_70px_-36px_rgba(30,41,59,0.18)]">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Room files</h1>
                  <p className="mt-2 text-sm leading-6 text-slate-600">Upload what you need here. Join the meeting whenever you’re ready.</p>
                </div>
                <Badge tone={files.length ? 'success' : 'neutral'}>{files.length} file{files.length === 1 ? '' : 's'}</Badge>
              </div>

              {joiningRoom ? (
                <div className="mt-6 space-y-4">
                  <div className="h-14 animate-pulse rounded-[22px] bg-white/10" />
                  <div className="h-32 animate-pulse rounded-[22px] bg-white/10" />
                </div>
              ) : (
                <div className="mt-6 space-y-5">
                  <DropZone onFilesSelected={handleFilesSelected} disabled={uploading} />
                  <FileList files={files} roomId={roomId} participantId={participantId} onDownloaded={refreshFiles} />
                </div>
              )}
            </div>

            <div className="omni-room-light-card rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_24px_70px_-36px_rgba(30,41,59,0.18)]">
              <h2 className="text-2xl font-semibold tracking-tight text-slate-900">Join the meet</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">Video is optional. Upload files first and start the call when needed.</p>

              {!showJoinMeetPrompt ? (
                <div className="mt-6 space-y-3">
                  <Button onClick={() => setShowJoinMeetPrompt(true)} className="w-full">
                    Join meet
                    <ArrowRightIcon className="h-4 w-4" />
                  </Button>
                  <Button variant="secondary" onClick={handleCopyLink} className="w-full">
                    <LinkIcon className="h-4 w-4" />
                    Copy invite link
                  </Button>
                </div>
              ) : (
                <div className="mt-6 space-y-4">
                  <label className="block text-sm font-medium text-slate-700" htmlFor="display-name">
                    Display name
                  </label>
                  <Input
                    id="display-name"
                    type="text"
                    placeholder="Enter your name"
                    value={displayName}
                    onChange={(event) => setDisplayName(event.target.value)}
                    onKeyDown={(event) => event.key === 'Enter' && handleJoinVideo()}
                    maxLength={32}
                  />
                  <Button onClick={handleJoinVideo} disabled={!displayName.trim()} className="w-full">
                    Start meeting
                    <ArrowRightIcon className="h-4 w-4" />
                  </Button>
                  <button
                    type="button"
                    onClick={() => setShowJoinMeetPrompt(false)}
                    className="text-sm text-slate-600 transition hover:text-slate-900"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>
      ) : (
        <VideoPanel
          serverUrl={livekitUrl!}
          token={videoToken}
          onDisconnect={() => {
            setVideoToken(null)
            clearRoomSession()
          }}
          roomId={roomId}
          joinUrl={joinUrl}
          participantId={participantId}
          files={files}
          uploading={uploading}
          onFilesSelected={handleFilesSelected}
          onDownloaded={refreshFiles}
          onCopyLink={handleCopyLink}
          onOpenShare={() => setShowQR(true)}
          copied={copied}
          isRecording={isRecording}
          isProcessingNotes={isProcessingNotes}
          recordingStorageKey={recordingStorageKey}
          onToggleRecording={toggleRecording}
        />
      )}

      {error && joined && (
        <div className="rounded-[20px] border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
          {error}
        </div>
      )}

      {toast && (
        <div className="fixed right-4 top-4 z-[60] w-[min(100vw-2rem,22rem)]">
          <Toast title={toast.title} description={toast.description} tone={toast.tone} />
        </div>
      )}

      <Modal
        open={showQR}
        onClose={() => setShowQR(false)}
        title="Join this room"
        description="Scan the QR code or copy the room link to open this session on another device."
        footer={
          <>
            <Button variant="secondary" onClick={handleCopyLink}>
              <LinkIcon className="h-4 w-4" />
              {copied ? 'Copied' : 'Copy link'}
            </Button>
            <Button onClick={() => setShowQR(false)}>Close</Button>
          </>
        }
      >
        <div className="mx-auto flex justify-center rounded-[24px] border border-white/10 bg-white p-4">
          <QRCodeSVG value={joinUrl} size={220} bgColor="#ffffff" fgColor="#0f172a" level="L" />
        </div>
        <div className="mt-4 rounded-[18px] border border-white/10 bg-white/[0.03] px-4 py-3 font-mono text-xs leading-5 text-slate-300">
          {joinUrl}
        </div>
      </Modal>
    </main>
  )
}
