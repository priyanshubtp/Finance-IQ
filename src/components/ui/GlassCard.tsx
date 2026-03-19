"use client"

import React from 'react'

interface GlassCardProps {
  children: React.ReactNode
  className?: string
  urgent?: boolean
}

export function GlassCard({ children, className = '', urgent = false }: GlassCardProps) {
  return (
    <div className={`glass-card ${urgent ? 'urgent' : ''} ${className}`}>
      {children}
    </div>
  )
}
