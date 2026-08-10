import { forwardRef, type ButtonHTMLAttributes, type HTMLAttributes, type InputHTMLAttributes, type ReactNode, type SVGProps } from 'react'

type ClassValue = string | false | null | undefined

export function cn(...values: ClassValue[]) {
  return values.filter(Boolean).join(' ')
}

function BaseIcon({ children, ...props }: SVGProps<SVGSVGElement> & { children: ReactNode }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      {children}
    </svg>
  )
}

export function SparkIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <BaseIcon {...props}>
      <path d="M12 2l1.8 5.3L19 9l-5.2 1.7L12 16l-1.8-5.3L5 9l5.2-1.7L12 2Z" />
      <path d="M19 14l.8 2.2L22 17l-2.2.8L19 20l-.8-2.2L16 17l2.2-.8L19 14Z" />
    </BaseIcon>
  )
}

export function ArrowRightIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <BaseIcon {...props}>
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </BaseIcon>
  )
}

export function VideoCameraIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <BaseIcon {...props}>
      <rect x="3" y="7" width="12" height="10" rx="2" />
      <path d="m15 10 6-3v10l-6-3Z" />
    </BaseIcon>
  )
}

export function ScreenShareIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <BaseIcon {...props}>
      <rect x="3" y="4.5" width="18" height="12" rx="2.5" />
      <path d="M8 20h8" />
      <path d="m12 9 3 3-3 3" />
      <path d="M12 12H7" />
    </BaseIcon>
  )
}

export function ChatIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <BaseIcon {...props}>
      <path d="M7 7h10" />
      <path d="M7 11h6" />
      <path d="M5 4h14a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H9l-4 4V6a2 2 0 0 1 2-2Z" />
    </BaseIcon>
  )
}

export function MaximizeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <BaseIcon {...props}>
      <path d="M4 9V5h4" />
      <path d="M20 15v4h-4" />
      <path d="m4 20 6-6" />
      <path d="m20 4-6 6" />
    </BaseIcon>
  )
}

export function MinimizeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <BaseIcon {...props}>
      <path d="M4 15h4v4" />
      <path d="M20 9h-4V5" />
      <path d="m4 20 6-6" />
      <path d="m20 4-6 6" />
    </BaseIcon>
  )
}

export function UploadIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <BaseIcon {...props}>
      <path d="M12 16V4" />
      <path d="m8 8 4-4 4 4" />
      <path d="M5 20h14" />
    </BaseIcon>
  )
}

export function UsersIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <BaseIcon {...props}>
      <path d="M16 20v-1.2A4.8 4.8 0 0 0 11.2 14H6.8A4.8 4.8 0 0 0 2 18.8V20" />
      <path d="M9 10.5A3 3 0 1 0 9 4.5a3 3 0 0 0 0 6Z" />
      <path d="M22 20v-1a4 4 0 0 0-4-4h-1" />
      <path d="M15.5 4.6a3 3 0 0 1 0 5.8" />
    </BaseIcon>
  )
}

export function RecordingIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <BaseIcon {...props}>
      <circle cx="12" cy="12" r="6.5" />
      <circle cx="12" cy="12" r="2" fill="currentColor" stroke="none" />
    </BaseIcon>
  )
}

export function CopyIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <BaseIcon {...props}>
      <rect x="9" y="9" width="10" height="10" rx="2" />
      <path d="M7 15H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v1" />
    </BaseIcon>
  )
}

export function QrIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <BaseIcon {...props}>
      <rect x="4" y="4" width="6" height="6" rx="1.2" />
      <rect x="14" y="4" width="6" height="6" rx="1.2" />
      <rect x="4" y="14" width="6" height="6" rx="1.2" />
      <path d="M14 14h2v2h-2z" />
      <path d="M18 14h2v2h-2z" />
      <path d="M14 18h2v2h-2z" />
    </BaseIcon>
  )
}

export function LinkIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <BaseIcon {...props}>
      <path d="M10 13a4 4 0 0 1 0-6l1.5-1.5a4 4 0 0 1 5.7 5.7L16 12" />
      <path d="M14 11a4 4 0 0 1 0 6L12.5 18.5a4 4 0 1 1-5.7-5.7L8 12" />
    </BaseIcon>
  )
}

export function FolderIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <BaseIcon {...props}>
      <path d="M3.5 7.5A2.5 2.5 0 0 1 6 5h4l2 2h6a2.5 2.5 0 0 1 2.5 2.5v8A2.5 2.5 0 0 1 18 20H6a2.5 2.5 0 0 1-2.5-2.5v-10Z" />
    </BaseIcon>
  )
}

export function ClockIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <BaseIcon {...props}>
      <circle cx="12" cy="12" r="8" />
      <path d="M12 8v4l2.5 1.5" />
    </BaseIcon>
  )
}

export function SignalIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <BaseIcon {...props}>
      <path d="M4 16c2-2 4.3-3 8-3s6 1 8 3" />
      <path d="M7 13.5c1.3-1.2 2.8-1.8 5-1.8s3.7.6 5 1.8" />
      <path d="M10 11c.7-.5 1.5-.7 2-.7.6 0 1.3.2 2 .7" />
      <circle cx="12" cy="18" r="1.2" fill="currentColor" stroke="none" />
    </BaseIcon>
  )
}

export function MoreIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <BaseIcon {...props}>
      <circle cx="6" cy="12" r="1.4" fill="currentColor" stroke="none" />
      <circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none" />
      <circle cx="18" cy="12" r="1.4" fill="currentColor" stroke="none" />
    </BaseIcon>
  )
}

export function LeaveIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <BaseIcon {...props}>
      <path d="M10 17 5 12l5-5" />
      <path d="M5 12h10" />
      <path d="M15 5h4v14h-4" />
    </BaseIcon>
  )
}

export function HomeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <BaseIcon {...props}>
      <path d="M4 11.5 12 4l8 7.5" />
      <path d="M6 10.5V20h12v-9.5" />
    </BaseIcon>
  )
}

export function ShieldIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <BaseIcon {...props}>
      <path d="M12 3 5 6v5c0 4.5 2.8 7.7 7 10 4.2-2.3 7-5.5 7-10V6l-7-3Z" />
    </BaseIcon>
  )
}

export function CheckIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <BaseIcon {...props}>
      <path d="m5 12 4 4 10-10" />
    </BaseIcon>
  )
}

export function Button({ className, variant = 'primary', type = 'button', ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'ghost' | 'danger' }) {
  return <button type={type} className={cn(variant === 'primary' && 'omni-button-primary', variant === 'secondary' && 'omni-button-secondary', variant === 'ghost' && 'omni-button-ghost', variant === 'danger' && 'omni-button-danger', className)} {...props} />
}

export const IconButton = forwardRef<HTMLButtonElement, ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'ghost' | 'danger' }>(function IconButton({ className, variant = 'secondary', type = 'button', ...props }, ref) {
  return <button ref={ref} type={type} className={cn('inline-flex h-10 w-10 items-center justify-center rounded-full transition', variant === 'primary' && 'bg-cyan-400 text-slate-950 hover:bg-cyan-300', variant === 'secondary' && 'border border-white/10 bg-white/[0.04] text-slate-200 hover:border-white/20 hover:bg-white/[0.08]', variant === 'ghost' && 'text-slate-300 hover:bg-white/[0.05] hover:text-white', variant === 'danger' && 'bg-rose-500 text-white hover:bg-rose-400', className)} {...props} />
})

export const Card = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(function Card({ className, ...props }, ref) {
  return <div ref={ref} className={cn('omni-card', className)} {...props} />
})

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(function Input({ className, ...props }, ref) {
  return <input ref={ref} className={cn('omni-input', className)} {...props} />
})

export function Badge({ className, tone = 'neutral', ...props }: HTMLAttributes<HTMLSpanElement> & { tone?: 'neutral' | 'success' | 'warning' | 'danger' }) {
  return <span className={cn('omni-badge', tone === 'neutral' && 'omni-badge-neutral', tone === 'success' && 'omni-badge-success', tone === 'warning' && 'omni-badge-warning', tone === 'danger' && 'omni-badge-danger', className)} {...props} />
}

export function SectionHeader({ eyebrow, title, description, actions }: { eyebrow?: string; title: string; description?: string; actions?: ReactNode }) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-2xl space-y-2">
        {eyebrow && <p className="omni-label">{eyebrow}</p>}
        <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">{title}</h2>
        {description && <p className="text-sm leading-6 text-slate-400 sm:text-base">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  )
}

export function StatCard({ label, value, detail, icon }: { label: string; value: string; detail?: string; icon?: ReactNode }) {
  return (
    <div className="omni-card-soft p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">{label}</p>
          <p className="mt-2 text-2xl font-semibold tracking-tight text-white">{value}</p>
          {detail && <p className="mt-1 text-sm text-slate-400">{detail}</p>}
        </div>
        {icon && <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-2 text-cyan-300">{icon}</div>}
      </div>
    </div>
  )
}

export function EmptyState({ title, description, action }: { title: string; description: string; action?: ReactNode }) {
  return (
    <div className="rounded-[22px] border border-dashed border-white/10 bg-white/[0.03] p-6 text-center">
      <p className="text-base font-semibold text-white">{title}</p>
      <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-400">{description}</p>
      {action && <div className="mt-4 flex justify-center">{action}</div>}
    </div>
  )
}

export function Modal({ open, title, description, children, footer, onClose }: { open: boolean; title: string; description?: string; children?: ReactNode; footer?: ReactNode; onClose: () => void }) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm" role="presentation" onClick={onClose}>
      <div className="omni-card w-full max-w-lg p-5 sm:p-6" role="dialog" aria-modal="true" aria-labelledby="omni-modal-title" aria-describedby={description ? 'omni-modal-description' : undefined} onClick={(event) => event.stopPropagation()}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 id="omni-modal-title" className="text-xl font-semibold text-white">{title}</h3>
            {description && <p id="omni-modal-description" className="mt-1 text-sm leading-6 text-slate-400">{description}</p>}
          </div>
          <IconButton variant="ghost" aria-label="Close modal" onClick={onClose}>
            <span className="text-xl leading-none">×</span>
          </IconButton>
        </div>
        <div className="mt-5">{children}</div>
        {footer && <div className="mt-6 flex flex-wrap justify-end gap-2">{footer}</div>}
      </div>
    </div>
  )
}

export function Toast({ title, description, tone = 'neutral' }: { title: string; description?: string; tone?: 'neutral' | 'success' | 'warning' | 'danger' }) {
  return (
    <div className={cn('rounded-2xl border px-4 py-3 shadow-[0_18px_60px_-30px_rgba(0,0,0,0.8)]', tone === 'neutral' && 'border-white/10 bg-slate-950/90 text-white', tone === 'success' && 'border-emerald-400/20 bg-emerald-500/10 text-emerald-50', tone === 'warning' && 'border-amber-400/20 bg-amber-500/10 text-amber-50', tone === 'danger' && 'border-rose-400/20 bg-rose-500/10 text-rose-50')}>
      <p className="text-sm font-semibold">{title}</p>
      {description && <p className="mt-1 text-sm text-current/80">{description}</p>}
    </div>
  )
}

export function LoadingSpinner({ className }: { className?: string }) {
  return <div className={cn('h-5 w-5 animate-spin rounded-full border-2 border-white/20 border-t-cyan-300', className)} aria-hidden="true" />
}