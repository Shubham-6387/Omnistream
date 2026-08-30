import { FormEvent, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createRoom } from '../lib/api'
import {
  ArrowRightIcon,
  Badge,
  Button,
  Card,
  HomeIcon,
  Input,
  LinkIcon,
  LoadingSpinner,
  ScreenShareIcon,
  SparkIcon,
  VideoCameraIcon,
} from '../components/ui'

function Logo() {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-white">
        <SparkIcon className="h-4 w-4" />
      </div>
      <span className="text-[15px] font-medium tracking-tight text-white">OmniStream</span>
    </div>
  )
}

function ProductVisual() {
  return (
    <div className="overflow-hidden rounded-[28px] border border-white/10 bg-[#0e1012] shadow-[0_24px_70px_-36px_rgba(0,0,0,0.8)]">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-3 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-white/70" />
          Room 8241
        </div>
        <div>Recording on</div>
      </div>

      <div className="grid gap-0 lg:grid-cols-[minmax(0,1fr)_260px]">
        <div className="relative min-h-[520px] border-b border-white/10 lg:border-b-0 lg:border-r lg:border-white/10">
          <div className="absolute inset-0 omni-surface-grid opacity-[0.05]" />
          <div className="relative flex h-full flex-col p-3 sm:p-4">
            <div className="grid flex-1 gap-3 sm:grid-cols-2">
              <div className="relative overflow-hidden rounded-[24px] bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.01))]">
                <div className="absolute left-4 top-4 rounded-full border border-white/10 bg-black/50 px-2.5 py-1 text-[11px] text-white">You</div>
                <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between text-sm text-white/90">
                  <div>Hariom</div>
                  <div className="rounded-full border border-white/10 bg-black/50 px-2 py-1 text-[11px]">mic on</div>
                </div>
              </div>

              <div className="relative overflow-hidden rounded-[24px] bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.01))]">
                <div className="absolute left-4 top-4 rounded-full border border-white/10 bg-black/50 px-2.5 py-1 text-[11px] text-white">Maya</div>
                <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between text-sm text-white/90">
                  <div>Maya</div>
                  <div className="rounded-full border border-white/10 bg-black/50 px-2 py-1 text-[11px]">speaking</div>
                </div>
              </div>

              <div className="relative overflow-hidden rounded-[24px] bg-[linear-gradient(180deg,rgba(255,255,255,0.025),rgba(255,255,255,0.01))] sm:col-span-2">
                <div className="absolute left-4 top-4 rounded-full border border-white/10 bg-black/50 px-2.5 py-1 text-[11px] text-white">Screen share</div>
                <div className="absolute inset-x-4 bottom-4 flex items-center justify-between text-sm text-white/90">
                  <div>Design review</div>
                  <div className="rounded-full border border-white/10 bg-black/50 px-2 py-1 text-[11px]">active</div>
                </div>
              </div>
            </div>

            <div className="mt-3 rounded-[20px] border border-white/10 bg-black/40 px-3 py-3 backdrop-blur-sm">
              <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5">
                <button className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white">M</button>
                <button className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white">C</button>
                <button className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white">S</button>
                <button className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white">P</button>
                <button className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white">T</button>
                <button className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white">⋯</button>
                <button className="ml-1 inline-flex h-10 items-center justify-center rounded-full bg-white px-4 text-sm font-medium text-slate-950">Leave</button>
              </div>
            </div>
          </div>
        </div>

        <div className="hidden border-t border-white/10 p-4 lg:block">
          <div className="space-y-3">
            <div className="rounded-[22px] border border-white/10 bg-white/[0.03] p-3">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-white/10" />
                <div>
                  <div className="text-sm text-white">Participants</div>
                  <div className="text-xs text-slate-400">3 online</div>
                </div>
              </div>
            </div>
            <div className="rounded-[22px] border border-white/10 bg-white/[0.03] p-3">
              <div className="text-sm text-white">Files</div>
              <div className="mt-2 text-xs text-slate-400">2 ready for download</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function Home() {
  const navigate = useNavigate()
  const joinInputRef = useRef<HTMLInputElement | null>(null)
  const [joinId, setJoinId] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [creating, setCreating] = useState(false)

  const handleCreate = async () => {
    setCreating(true)
    setError(null)
    try {
      const room = await createRoom('')
      navigate(`/room/${room.room_id}`)
    } catch {
      setError('Could not create a room. Is the backend running?')
    } finally {
      setCreating(false)
    }
  }

  const handleJoin = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const nextRoomId = joinId.trim()
    if (nextRoomId) navigate(`/room/${nextRoomId}`)
  }

  return (
    <main className="omni-shell space-y-16 pb-12">
      <header className="flex items-center justify-between gap-4 py-2">
        <Logo />

        <nav className="hidden items-center gap-8 text-sm text-slate-400 md:flex">
          <a href="#product" className="transition hover:text-white">Product</a>
          <a href="#developers" className="transition hover:text-white">Developers</a>
          <a href="#pricing" className="transition hover:text-white">Pricing</a>
        </nav>

        <div className="flex items-center gap-2">
          <Button onClick={handleCreate} disabled={creating}>
            {creating ? <LoadingSpinner /> : 'Get started'}
          </Button>
        </div>
      </header>

      <section className="grid items-center gap-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
        <div className="space-y-8">
          <div className="space-y-5">
            <h1 className="max-w-2xl text-5xl font-semibold tracking-tight text-white sm:text-6xl lg:text-7xl">
              Meet without the friction.
            </h1>
            <p className="max-w-xl text-base leading-7 text-slate-400 sm:text-lg">
              Video meetings, screen sharing, files and recording all in one workspace.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button onClick={handleCreate} disabled={creating}>
              {creating ? <LoadingSpinner /> : <HomeIcon className="h-4 w-4" />}
              Start a meeting
            </Button>
            <Button variant="secondary" onClick={() => joinInputRef.current?.focus()}>
              <LinkIcon className="h-4 w-4" />
              Join a meeting
            </Button>
          </div>

          {error && <p className="text-sm text-slate-300">{error}</p>}
        </div>

        <div id="product" className="relative lg:pl-6">
          <ProductVisual />
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-start">
        <div className="space-y-5">
          <h2 className="text-3xl font-semibold tracking-tight text-white">Conversations, without distractions.</h2>
          <p className="max-w-xl text-sm leading-6 text-slate-400">
            Video and audio stay primary. Speaking state, screen sharing and recording sit quietly in the room chrome.
          </p>
          <div className="overflow-hidden rounded-[28px] border border-white/10 bg-[#0e1012]">
            <div className="aspect-[16/10] bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.01))] p-4">
              <div className="grid h-full gap-3 sm:grid-cols-2">
                <div className="rounded-[24px] bg-white/[0.03]" />
                <div className="rounded-[24px] bg-white/[0.02]" />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <h2 className="text-3xl font-semibold tracking-tight text-white">Put the work in focus.</h2>
          <p className="max-w-sm text-sm leading-6 text-slate-400">
            Screen sharing takes over the stage when it matters.
          </p>
          <div className="overflow-hidden rounded-[28px] border border-white/10 bg-[#0e1012]">
            <div className="aspect-[5/6] p-4">
              <div className="flex h-full flex-col gap-3 rounded-[24px] bg-white/[0.03] p-4">
                <div className="h-8 w-36 rounded-full bg-white/10" />
                <div className="flex-1 rounded-[20px] bg-white/[0.06]" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div className="space-y-4">
          <h2 className="text-3xl font-semibold tracking-tight text-white">Everything around the meeting.</h2>
          <div className="overflow-hidden rounded-[28px] border border-white/10 bg-[#0e1012]">
            <div className="aspect-[16/9] p-4">
              <div className="flex h-full items-center justify-center rounded-[24px] border border-white/10 bg-white/[0.03] text-sm text-slate-300">
                Files ready for download
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-3xl font-semibold tracking-tight text-white">Recording, when needed.</h2>
          <div className="overflow-hidden rounded-[28px] border border-white/10 bg-[#0e1012]">
            <div className="aspect-[16/9] p-4">
              <div className="flex h-full items-center justify-center rounded-[24px] border border-white/10 bg-white/[0.03] text-sm text-slate-300">
                Recording indicator and meeting controls
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="join" className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)] lg:items-start">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight text-white">Join your meeting</h2>
          <p className="mt-2 text-sm leading-6 text-slate-400">No account required.</p>
        </div>

        <form onSubmit={handleJoin} className="space-y-3">
          <Input
            ref={joinInputRef}
            id="join-room-id"
            value={joinId}
            onChange={(event) => setJoinId(event.target.value)}
            placeholder="Enter meeting code"
            autoComplete="off"
          />
          <Button type="submit" className="w-full">
            Join meeting
            <ArrowRightIcon className="h-4 w-4" />
          </Button>
        </form>
      </section>
    </main>
  )
}