'use client'
import { Trash2 } from 'lucide-react'

interface Props {
  deleteCandidatura: () => Promise<void>
}

export function DeleteCandidaturaButton({ deleteCandidatura }: Props) {
  return (
    <form
      action={deleteCandidatura}
      onSubmit={e => {
        if (!confirm('Eliminare questa candidatura definitivamente?')) e.preventDefault()
      }}
    >
      <button
        type="submit"
        className="flex items-center gap-2 text-sm font-sans text-red-500 hover:text-red-700 border border-red-200 hover:border-red-300 rounded-lg px-4 py-2 transition-colors"
      >
        <Trash2 size={15} /> Elimina candidatura
      </button>
    </form>
  )
}
