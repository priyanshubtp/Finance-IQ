"use client"

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { GlassCard } from '@/components/ui/GlassCard'
import { cn } from '@/lib/utils'

interface BudgetHealthBarProps {
  category: string
  spent: number
  budget: number
}

export function CategoryCard({ category, spent, budget }: BudgetHealthBarProps) {
  const pct = Math.min(100, Math.round((spent / budget) * 100))
  const colorClass = pct < 70 ? "bg-[#22C55E]" : pct < 90 ? "bg-[#F59E0B]" : "bg-[#EF4444]"

  return (
    <GlassCard className="p-4 space-y-4">
      <div className="flex justify-between items-end">
        <div>
          <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">{category}</h4>
          <span className="text-lg font-bold text-[#A5B4FC] font-mono">${spent.toLocaleString()}</span>
        </div>
        <span className="text-[10px] font-bold text-slate-400">Target ${budget}</span>
      </div>

      <div className="space-y-1.5">
        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: '0%' }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            className={cn("h-full rounded-full shadow-[0_0_10px_rgba(0,0,0,0.5)]", colorClass)}
          />
        </div>
        <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest">
           <span className="text-slate-500">{pct}% of budget</span>
           <span className={cn(pct > 90 ? "text-red-500" : "text-slate-600")}>
              {pct > 100 ? "OVER LIMIT" : "STABLE"}
           </span>
        </div>
      </div>
    </GlassCard>
  )
}
