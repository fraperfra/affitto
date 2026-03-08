'use client'
import { useEffect } from 'react'

export function PhotoProtection() {
  useEffect(() => {
    // --- Blocca window.print() (stampa via JS) ---
    window.print = () => {}

    // --- Blocca beforeprint (stampa da menu browser) ---
    const blockPrint = () => {
      document.body.style.setProperty('display', 'none', 'important')
      setTimeout(() => document.body.style.removeProperty('display'), 1000)
    }
    window.addEventListener('beforeprint', blockPrint)

    // --- Blocca tasto destro sull'intera pagina ---
    const blockContextMenu = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (
        target.tagName === 'IMG' ||
        target.closest('[data-protected]') ||
        target.closest('.yarl__slide')
      ) {
        e.preventDefault()
      }
    }

    // --- Blocca drag delle immagini ---
    const blockDrag = (e: DragEvent) => {
      const target = e.target as HTMLElement
      if (target.tagName === 'IMG' || target.closest('[data-protected]')) {
        e.preventDefault()
      }
    }

    // --- Blocca scorciatoie da tastiera ---
    const blockShortcuts = (e: KeyboardEvent) => {
      const ctrl = e.ctrlKey || e.metaKey

      if (
        (ctrl && ['s', 'u', 'p', 'a'].includes(e.key.toLowerCase())) ||
        (ctrl && e.shiftKey && ['i', 'j', 'c'].includes(e.key.toLowerCase())) ||
        e.key === 'F12' ||
        e.key === 'PrintScreen'
      ) {
        e.preventDefault()
      }
    }

    // --- Blocca selezione testo/immagini ---
    const blockSelectStart = (e: Event) => {
      const target = e.target as HTMLElement
      if (target.closest('[data-protected]')) {
        e.preventDefault()
      }
    }

    document.addEventListener('contextmenu', blockContextMenu)
    document.addEventListener('dragstart', blockDrag)
    document.addEventListener('keydown', blockShortcuts)
    document.addEventListener('selectstart', blockSelectStart)

    return () => {
      document.removeEventListener('contextmenu', blockContextMenu)
      document.removeEventListener('dragstart', blockDrag)
      document.removeEventListener('keydown', blockShortcuts)
      document.removeEventListener('selectstart', blockSelectStart)
      window.removeEventListener('beforeprint', blockPrint)
    }
  }, [])

  return null
}
