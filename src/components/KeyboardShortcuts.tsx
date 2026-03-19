"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export function KeyboardShortcuts() {
  const router = useRouter()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'n' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        router.push('/expenses')
      }
      if (e.key === 'Escape') {
        // Handle closing sidebars/modals if any
        console.log('Escape pressed')
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [router])

  return null
}
