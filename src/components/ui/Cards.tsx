"use client"

import React from 'react'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

interface CardProps {
  children: React.ReactNode
  className?: string
  urgent?: boolean
}

// VARIANT A — GradientCard (for hero stats)
export function GradientCard({ children, className = '', colorPair = 'indigo' }: CardProps & { colorPair?: 'indigo' | 'pink' | 'cyan' | 'emerald' }) {
  // We'll keep the color names but use desaturated, flatter gradients as per Step 8 rules
  const gradients = {
    indigo: 'from-[#3A3B8F] to-[#2D2E70]',
    pink: 'from-[#8F3A5D] to-[#2D2E70]',
    cyan: 'from-[#2D708F] to-[#2D2E70]',
    emerald: 'from-[#2D8F70] to-[#2D708F]',
  }

  return (
    <div className={cn(
      "relative overflow-hidden rounded-[18px] border border-white/10 bg-gradient-to-br",
      gradients[colorPair],
      className
    )}>
      <div className="relative z-10 p-5">
        {children}
      </div>
    </div>
  )
}

export function GlassCard({ children, className = '' }: CardProps) {
  return (
    <div className={cn(
      "surface-card",
      className
    )}>
      {children}
    </div>
  )
}

export function ElevatedCard({ children, className = '' }: CardProps) {
  return (
    <div className={cn(
      "bg-bg-elevated border border-border rounded-[12px] p-4 transition-all duration-150 hover:border-border-hover",
      className
    )}>
      {children}
    </div>
  )
}

