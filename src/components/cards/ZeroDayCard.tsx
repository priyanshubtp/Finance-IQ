"use client"

import React from 'react'
import { GlassCard } from '@/components/ui/GlassCard'
import { AnimatedNumber } from '@/components/ui/AnimatedNumber'
import { Area, AreaChart, ResponsiveContainer } from 'recharts'
import { Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ZeroDayCardProps {
  days: number
  date: string
  confidence: number
  sparklineData: any[]
}

export function ZeroDayCard({ days, date }: ZeroDayCardProps) {
  return (
    <div className="surface-card space-y-8">
      <div>
        <span className="section-label">Zero-Day Forecast</span>
        <div className="text-7xl font-mono font-medium tracking-tighter text-text-primary mt-4">
          <AnimatedNumber value={days} />
        </div>
        <p className="text-[12px] font-medium text-text-tertiary uppercase tracking-widest mt-2">
          Estimated days remaining
        </p>
      </div>

      <div className="space-y-4 pt-6 border-t border-border">
        <p className="text-sm text-text-secondary leading-relaxed font-normal">
          Projected date of zero balance if current spending velocity continues: 
          <span className="text-text-primary font-medium ml-1">{date}</span>
        </p>
      </div>
    </div>
  )
}

