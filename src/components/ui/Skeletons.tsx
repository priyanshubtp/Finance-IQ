"use client"

import React from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { GlassCard } from '@/components/ui/Cards'

export function StatCardSkeleton() {
  return (
    <GlassCard className="p-6 space-y-4">
      <Skeleton className="h-4 w-24 bg-white/5" />
      <Skeleton className="h-10 w-32 bg-white/10" />
    </GlassCard>
  )
}

export function ChartSkeleton() {
  return (
    <GlassCard className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <Skeleton className="h-5 w-40 bg-white/10" />
          <Skeleton className="h-4 w-24 bg-white/5" />
        </div>
        <Skeleton className="h-8 w-32 bg-white/5" />
      </div>
      <Skeleton className="h-[250px] w-full bg-white/[0.03]" />
    </GlassCard>
  )
}

export function ExpenseListSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="flex items-center justify-between p-5 rounded-[14px] bg-white/[0.02] border border-white/5">
          <div className="flex items-center gap-4">
            <Skeleton className="h-10 w-10 rounded-xl bg-white/10" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-32 bg-white/10" />
              <Skeleton className="h-3 w-20 bg-white/5" />
            </div>
          </div>
          <div className="space-y-2 text-right">
            <Skeleton className="h-5 w-24 bg-white/10" />
            <Skeleton className="h-3 w-16 bg-white/5" />
          </div>
        </div>
      ))}
    </div>
  )
}
