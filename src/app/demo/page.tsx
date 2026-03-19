"use client"

import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { API_BASE } from '@/lib/fetchers'
import { Loader2, Sparkles } from 'lucide-react'
import { GlassCard } from '@/components/ui/GlassCard'

export default function DemoPage() {
  const router = useRouter()

  useEffect(() => {
    const seedData = async () => {
      try {
        const res = await fetch(`${API_BASE}/seed-demo/`, { method: 'POST' })
        if (res.ok) {
          setTimeout(() => {
            router.push('/dashboard')
          }, 2000)
        }
      } catch (error) {
        console.error('Seeding error:', error)
      }
    }
    seedData()
  }, [router])

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-8">
      <GlassCard className="max-w-sm w-full p-10 text-center space-y-6">
        <div className="relative mx-auto w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center">
           <Sparkles className="h-8 w-8 text-primary animate-pulse" />
        </div>
        <div className="space-y-2">
           <h2 className="text-xl font-black text-white tracking-tight">Initializing Demo</h2>
           <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest leading-relaxed">
              Synthesizing 30 days of transaction telemetry to calibrate predictive engine...
           </p>
        </div>
        <div className="flex justify-center">
           <Loader2 className="h-6 w-6 text-primary animate-spin" />
        </div>
      </GlassCard>
    </div>
  )
}
