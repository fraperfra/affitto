'use client'
import { useEffect } from 'react'
import { X } from 'lucide-react'

interface Props {
  open: boolean
  onClose: () => void
  children: React.ReactNode
  title?: string
}

export function DetailModal({ open, onClose, children, title }: Props) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [open])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  if (!open) return null

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal — bottom sheet su mobile, dialog centrato su desktop */}
      <div
        className="fixed inset-x-0 bottom-0 z-50 max-h-[92vh] overflow-y-auto rounded-t-2xl bg-white shadow-2xl
                   md:inset-0 md:m-auto md:max-w-2xl md:max-h-[90vh] md:rounded-2xl md:h-fit"
      >
        {/* Header con titolo e chiudi */}
        <div className="sticky top-0 z-10 bg-white border-b border-stone-100 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          {/* Handle mobile */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-10 h-1 bg-stone-200 rounded-full md:hidden" />
          <h2 className="font-serif text-lg text-anthracite pt-1 md:pt-0">{title}</h2>
          <button
            onClick={onClose}
            className="ml-auto p-1.5 rounded-full text-stone-400 hover:text-anthracite hover:bg-stone-100 transition-colors"
            aria-label="Chiudi"
          >
            <X size={20} />
          </button>
        </div>

        {/* Contenuto */}
        <div className="pb-safe">
          {children}
        </div>
      </div>
    </>
  )
}
