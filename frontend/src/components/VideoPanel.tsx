import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react'
import {
  LayoutContextProvider,
  LiveKitRoom,
  RoomAudioRenderer,
  ControlBar,
  GridLayout,
  ParticipantTile,
  FocusLayout,
  FocusLayoutContainer,
  CarouselLayout,
  useCreateLayoutContext,
  usePinnedTracks,
  useParticipants,
  useSpeakingParticipants,
  useLocalParticipant,
  useRoomInfo,
  useConnectionState,
  useTracks,
} from '@livekit/components-react'
import '@livekit/components-styles'
import { isEqualTrackRef, isTrackReference, type TrackReferenceOrPlaceholder } from '@livekit/components-core'
import { ConnectionQuality, RoomEvent, Track, type Participant } from 'livekit-client'
import { RoomFile } from '../lib/api'
import { DropZone } from './DropZone'
import { Badge, Button, Card, CheckIcon, CopyIcon, MaximizeIcon, MinimizeIcon, MoreIcon, QrIcon, RecordingIcon, ScreenShareIcon, SignalIcon, SparkIcon, UsersIcon, VideoCameraIcon } from './ui'
import { FileList } from './FileList'

interface VideoPanelProps {
  serverUrl: string
  token: string
  onDisconnect: () => void
  roomId: string
  joinUrl: string
  participantId: string
  files: RoomFile[]
  uploading: boolean
  onFilesSelected: (files: File[]) => void
  onDownloaded: () => void
  onCopyLink: () => void
  onOpenShare: () => void
  copied: boolean
  isRecording: boolean
  onToggleRecording: () => void
}

function connectionTone(state: string) {
  if (state === 'connected') return 'success'
  if (state === 'reconnecting' || state === 'connecting') return 'warning'
  return 'neutral'
}

function connectionLabel(state: string) {
  return state.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/^./, (char) => char.toUpperCase())
}

function qualityLabel(quality: ConnectionQuality) {
  switch (quality) {
    case ConnectionQuality.Excellent:
      return 'Excellent'
    case ConnectionQuality.Good:
      return 'Good'
    case ConnectionQuality.Poor:
      return 'Weak'
    case ConnectionQuality.Lost:
      return 'Lost'
    default:
      return 'Unknown'
  }
}

function ParticipantSummary({ participant, isSpeaking }: { participant: Participant; isSpeaking: boolean }) {
  const displayName = participant.name || participant.identity.slice(0, 8)

  return (
    <li className="flex items-center justify-between gap-3 border-b border-white/10 py-3 last:border-b-0">
      <div className="min-w-0 flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-[11px] text-white">
          {displayName.slice(0, 2).toUpperCase()}
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <p className="truncate text-sm text-white">{displayName}</p>
            {participant.isLocal && <span className="text-xs text-slate-500">you</span>}
            {isSpeaking && <span className="text-xs text-slate-300">speaking</span>}
          </div>
          <p className="truncate text-xs text-slate-500">{participant.identity}</p>
        </div>
      </div>
      <div className="text-xs text-slate-500">{qualityLabel(participant.connectionQuality)}</div>
    </li>
  )
}

export function VideoPanel({
  serverUrl,
  token,
  onDisconnect,
  roomId,
  joinUrl,
  participantId,
  files,
  uploading,
  onFilesSelected,
  onDownloaded,
  onCopyLink,
  onOpenShare,
  copied,
  isRecording,
  onToggleRecording,
}: VideoPanelProps) {
  const layoutContext = useCreateLayoutContext()
  return (
    <LiveKitRoom
      serverUrl={serverUrl}
      token={token}
      connect
      video
      audio
      onDisconnected={onDisconnect}
      data-lk-theme="default"
      className="relative"
    >
      <RoomStage
        layoutContext={layoutContext}
        roomId={roomId}
        files={files}
        uploading={uploading}
        onFilesSelected={onFilesSelected}
        onDownloaded={onDownloaded}
        onCopyLink={onCopyLink}
        onOpenShare={onOpenShare}
        copied={copied}
        isRecording={isRecording}
        onToggleRecording={onToggleRecording}
      />
      <RoomAudioRenderer />
    </LiveKitRoom>
  )
}

function RoomStage({
  layoutContext,
  roomId,
  files,
  uploading,
  onFilesSelected,
  onDownloaded,
  onCopyLink,
  onOpenShare,
  copied,
  isRecording,
  onToggleRecording,
}: {
  layoutContext: ReturnType<typeof useCreateLayoutContext>
  roomId: string
  files: RoomFile[]
  uploading: boolean
  onFilesSelected: (files: File[]) => void
  onDownloaded: () => void
  onCopyLink: () => void
  onOpenShare: () => void
  copied: boolean
  isRecording: boolean
  onToggleRecording: () => void
}) {
  const lastAutoFocusedScreenShareTrack = useRef<TrackReferenceOrPlaceholder | null>(null)
  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
    { updateOnlyOn: [RoomEvent.ActiveSpeakersChanged], onlySubscribed: false },
  )
  const focusTrack = usePinnedTracks(layoutContext)?.[0]
  const screenShareTracks = tracks.filter(isTrackReference).filter((track) => track.publication.source === Track.Source.ScreenShare)
  const participants = useParticipants()
  const speakingParticipants = useSpeakingParticipants()
  const speakingIds = useMemo(() => new Set(speakingParticipants.map((participant) => participant.identity)), [speakingParticipants])
  const connectionState = useConnectionState()
  const { name } = useRoomInfo()
  const { localParticipant } = useLocalParticipant()
  const [isFullscreen, setIsFullscreen] = useState(false)
  const stageRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement))
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

  useEffect(() => {
    if (screenShareTracks.some((track) => track.publication.isSubscribed) && lastAutoFocusedScreenShareTrack.current === null) {
      layoutContext.pin.dispatch?.({ msg: 'set_pin', trackReference: screenShareTracks[0] })
      lastAutoFocusedScreenShareTrack.current = screenShareTracks[0]
    } else if (
      lastAutoFocusedScreenShareTrack.current &&
      !screenShareTracks.some((track) => track.publication.trackSid === lastAutoFocusedScreenShareTrack.current?.publication?.trackSid)
    ) {
      layoutContext.pin.dispatch?.({ msg: 'clear_pin' })
      lastAutoFocusedScreenShareTrack.current = null
    }
  }, [layoutContext, screenShareTracks])

  const activeSpeakerNames = speakingParticipants.slice(0, 3).map((participant) => participant.name || participant.identity)
  const hasScreenShare = screenShareTracks.some((track) => track.publication.isSubscribed)
  const sharedScreenTrack = screenShareTracks[0] ?? null
  const floatingCameraTracks = tracks.filter((track) => {
    if (!track.publication || track.publication.source !== Track.Source.Camera) return false
    if (!sharedScreenTrack) return true
    return !isEqualTrackRef(track, sharedScreenTrack)
  })

  const toggleFullscreen = async () => {
    if (!stageRef.current) return

    if (document.fullscreenElement) {
      await document.exitFullscreen()
      return
    }

    await stageRef.current.requestFullscreen()
  }

  return (
    <LayoutContextProvider value={layoutContext}>
      <div className="grid min-h-[calc(100vh-140px)] gap-4 lg:grid-cols-[minmax(0,1fr)_340px]">
        <section ref={stageRef} className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[#0c0f14] shadow-[0_24px_70px_-36px_rgba(0,0,0,0.8)]">
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-3 text-xs text-slate-400">
            <div className="flex items-center gap-2 text-slate-300">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              <span>{name || roomId}</span>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="secondary" onClick={toggleFullscreen} className="px-3">
                {isFullscreen ? <MinimizeIcon className="h-4 w-4" /> : <MaximizeIcon className="h-4 w-4" />}
                {isFullscreen ? 'Exit full' : 'Full screen'}
              </Button>
              {hasScreenShare && <span className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-medium text-emerald-200">Connected Screen share</span>}
              {isRecording && <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[11px] text-slate-200">Recording</span>}
            </div>
          </div>

          <div className="relative flex min-h-[calc(100vh-205px)]">
            <div className="flex w-14 flex-col items-center justify-between border-r border-white/10 bg-white/[0.01] py-4">
              <div className="flex flex-col items-center gap-3">
                <button className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-slate-300">◌</button>
                <button className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-slate-300">◍</button>
                <button className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-slate-300">⌁</button>
                <button className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-slate-300">◫</button>
              </div>
              <div className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-slate-300">⋯</div>
            </div>

            <div className="relative flex-1 p-3 sm:p-4">
              <div className="pointer-events-none absolute inset-0 omni-surface-grid opacity-[0.045]" />
              <div className="relative flex h-full flex-col gap-3">
                <div className="relative flex-1 overflow-visible rounded-[24px] border border-white/10 bg-black/25 p-2 sm:p-3">
                  {hasScreenShare && sharedScreenTrack ? (
                    <div className="relative h-full min-h-[calc(100vh-245px)] overflow-hidden rounded-[22px] bg-[#111827]">
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.08),transparent_45%)]" />
                      <FocusLayout trackRef={sharedScreenTrack} className="meeting-focus-tile relative z-10 h-full w-full rounded-[22px] border border-white/10 bg-slate-900/90" />
                      <div className="pointer-events-none absolute bottom-4 right-4 z-20 w-[180px] max-w-[28%] rounded-[16px] border border-white/10 bg-black/55 p-1.5 shadow-[0_18px_45px_-28px_rgba(0,0,0,0.8)] backdrop-blur-sm">
                        <CarouselLayout tracks={floatingCameraTracks} className="meeting-carousel h-[110px] w-full">
                          <ParticipantTile className="meeting-participant-tile h-full w-full rounded-[12px] border border-white/10 bg-slate-900/80" />
                        </CarouselLayout>
                      </div>
                    </div>
                  ) : focusTrack ? (
                    <FocusLayoutContainer className="h-full min-h-[calc(100vh-245px)] gap-3">
                      <CarouselLayout tracks={tracks.filter((track) => !isEqualTrackRef(track, focusTrack))} className="meeting-carousel">
                        <ParticipantTile className="meeting-participant-tile aspect-[16/10] rounded-[20px] border border-white/10 bg-slate-900/80" />
                      </CarouselLayout>
                      <FocusLayout trackRef={focusTrack} className="meeting-focus-tile rounded-[22px] border border-white/10 bg-slate-900/90" />
                    </FocusLayoutContainer>
                  ) : (
                    <GridLayout tracks={tracks} className="meeting-grid h-full min-h-[calc(100vh-245px)] gap-3">
                      <ParticipantTile className="meeting-participant-tile aspect-[4/3] rounded-[22px] border border-white/10 bg-slate-900/80" />
                    </GridLayout>
                  )}
                </div>

                <div className="flex flex-wrap items-center justify-center gap-2 rounded-full border border-white/10 bg-black/40 px-3 py-3 backdrop-blur-sm">
                  <ControlBar
                    controls={{ microphone: true, camera: true, screenShare: true, chat: false, settings: false, leave: true }}
                    variation="minimal"
                    className="meeting-control-bar"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <aside className="flex min-h-0 flex-col gap-4 lg:sticky lg:top-4 lg:h-[calc(100vh-2rem)]">
          <div className="rounded-[24px] border border-white/10 bg-white/[0.02] p-4">
            <div className="flex items-center justify-between gap-3 text-sm text-slate-400">
              <div>{participants.length} participants</div>
              <div>{activeSpeakerNames.length ? activeSpeakerNames.join(', ') : 'quiet'}</div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button variant="secondary" onClick={onCopyLink} className="px-3">
                <CopyIcon className="h-4 w-4" />
                {copied ? 'Copied' : 'Invite'}
              </Button>
              <Button variant="secondary" onClick={onOpenShare} className="px-3">
                <QrIcon className="h-4 w-4" />
                QR
              </Button>
              <Button variant={isRecording ? 'danger' : 'secondary'} onClick={onToggleRecording} className="px-3">
                <RecordingIcon className="h-4 w-4" />
                {isRecording ? 'Stop' : 'Rec'}
              </Button>
            </div>
          </div>

          <div className="flex-1 overflow-hidden rounded-[24px] border border-white/10 bg-white/[0.02]">
            <div className="border-b border-white/10 px-4 py-3 text-sm text-white">Participants</div>
            <div className="omni-scrollbar max-h-[36vh] overflow-y-auto px-4">
              {participants.map((participant) => (
                <ParticipantSummary key={participant.sid} participant={participant} isSpeaking={speakingIds.has(participant.identity)} />
              ))}
              {participants.length === 0 && <div className="py-6 text-sm text-slate-500">Waiting for others to join.</div>}
            </div>
          </div>

          <div className="rounded-[24px] border border-white/10 bg-white/[0.02] p-4">
            <div className="text-sm text-white">Files</div>
            <div className="mt-4 space-y-4">
              <DropZone onFilesSelected={onFilesSelected} disabled={uploading} />
              <FileList files={files} roomId={roomId} participantId={localParticipant.identity} onDownloaded={onDownloaded} />
            </div>
          </div>

          <div className="rounded-[24px] border border-white/10 bg-white/[0.02] p-4 text-sm text-slate-400">
            <div className="flex items-center gap-3 text-white">
              <SignalIcon className="h-4 w-4" />
              {connectionLabel(connectionState)}
            </div>
            <div className="mt-3 flex items-center gap-3">
              <UsersIcon className="h-4 w-4" />
              {localParticipant.isCameraEnabled ? 'camera on' : 'camera off'}
            </div>
            <div className="mt-3 flex items-center gap-3">
              <VideoCameraIcon className="h-4 w-4" />
              {localParticipant.isMicrophoneEnabled ? 'mic on' : 'mic off'}
            </div>
            {hasScreenShare && (
              <div className="mt-3 flex items-center gap-3">
                <ScreenShareIcon className="h-4 w-4" />
                screen share active
              </div>
            )}
          </div>
        </aside>
      </div>
    </LayoutContextProvider>
  )
}