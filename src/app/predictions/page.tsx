"use client"

import React, { useState } from 'react'
import useSWR from 'swr'
import { fetcher, predictionFetcher, expenseFetcher } from "@/lib/fetchers"
import { motion, AnimatePresence } from 'framer-motion'
import { GradientCard } from '@/components/ui/Cards'
import { ChevronDown, AlertCircle, AlertTriangle, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { AreaChart, Area, ResponsiveContainer, Tooltip } from 'recharts'
import { Skeleton } from '@/components/ui/skeleton'
import { ChartSkeleton } from '@/components/ui/Skeletons'
import { useRouter } from 'next/navigation'

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="section-label">
      {children}
    </span>
  )
}


export default function PredictionsPage() {
  const router = useRouter()
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState(false)
  const budget = 15000 
  const { data: prediction } = useSWR(predictionFetcher(budget), fetcher)
  const { data: expenses } = useSWR(expenseFetcher, fetcher)

  if (!prediction || !expenses) {
    return (
      <div className="container mx-auto px-6 pt-24 pb-20 space-y-12">
        <header className="page-header">
           <Skeleton className="h-10 w-48 bg-white/10" />
           <Skeleton className="h-4 w-32 mt-2 bg-white/5" />
        </header>
        <div className="h-64 w-full bg-white/[0.02] rounded-[32px] border border-white/5 animate-pulse flex items-center justify-center">
           <Skeleton className="h-10 w-64 bg-white/10" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
           <ChartSkeleton />
           <ChartSkeleton />
        </div>
      </div>
    )
  }

  const r2 = prediction.r2_score || 0
  const confidencePercent = Math.round(r2 * 100)
  const daysLeft = prediction.days_until_zero || 0
  
  const isDataInsufficient = daysLeft === 0 || r2 < 0.1
  const isUrgent = daysLeft > 0 && daysLeft <= 7

  const projectedDateStr = prediction.predicted_zero_date 
    ? new Date(prediction.predicted_zero_date).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      })
    : 'N/A'
  
  const sparklineData = Array.from({ length: 12 }, (_, i) => ({ val: 100 - (i * 8.3) }))

  // Compute real weekly comparison: last 4 weeks (current) vs prior 4 weeks (previous)
  const comparisonData = (() => {
    if (!expenses || expenses.length === 0) {
      return [
        { name: 'W1', current: 0, previous: 0 },
        { name: 'W2', current: 0, previous: 0 },
        { name: 'W3', current: 0, previous: 0 },
        { name: 'W4', current: 0, previous: 0 },
      ]
    }
    const now = new Date()
    const buckets: { current: number; previous: number }[] = Array.from({ length: 4 }, () => ({ current: 0, previous: 0 }))
    expenses.forEach((e: any) => {
      const expDate = new Date(e.date)
      const daysAgo = Math.floor((now.getTime() - expDate.getTime()) / (1000 * 60 * 60 * 24))
      const weekIndex = Math.floor(daysAgo / 7)
      if (weekIndex >= 0 && weekIndex < 4) {
        buckets[weekIndex].current += e.amount
      } else if (weekIndex >= 4 && weekIndex < 8) {
        buckets[weekIndex - 4].previous += e.amount
      }
    })
    return buckets.reverse().map((b, i) => ({
      name: `W${i + 1}`,
      current: Math.round(b.current),
      previous: Math.round(b.previous),
    }))
  })()

  return (
    <div className="container mx-auto px-6 pt-24 pb-20 space-y-12">
      <header className="page-header">
        <div>
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="page-title text-text-primary"
          >
            Forecast
          </motion.h1>
          <p className="page-subtitle text-text-tertiary">Statistical regression analysis</p>
        </div>
      </header>

      <div className="space-y-4">
        <SectionLabel>Predictive Engine</SectionLabel>
        
        <div className={cn(
          "relative rounded-[20px] p-[1px] transition-all duration-700",
          isDataInsufficient 
            ? "bg-border" 
            : "bg-border",
          isUrgent && "bg-[#A24848]/30"
        )}>
          <div className={cn(
            "rounded-[19px] p-10 transition-all duration-500 overflow-hidden relative bg-bg-surface",
          )}>
            {isDataInsufficient ? (
              <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                 <div className="space-y-4">
                    <div className="flex items-center gap-3 text-text-tertiary">
                       <AlertTriangle size={32} />
                       <h2 className="text-xl font-semibold text-text-primary">Data density too low</h2>
                    </div>
                    <p className="text-text-secondary text-sm max-w-md">
                      Provide at least 7 days of spending history to calibrate the forecasting model.
                    </p>
                 </div>
                 <button 
                  onClick={() => router.push('/expenses')}
                  className="px-5 py-2 rounded-[8px] border border-border text-text-primary font-medium text-[13px] hover:bg-bg-subtle transition-all flex items-center gap-2"
                 >
                   Add history <Plus size={14} />
                 </button>
              </div>
            ) : (
              <div className="flex flex-col md:flex-row items-center justify-between gap-12">
                 <div className="space-y-2">
                    <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-text-tertiary">
                       <AlertCircle className="h-4 w-4" />
                       Zero-Day Forecast
                    </div>
                    <div className="flex items-baseline gap-4">
                       <span className={cn(
                         "text-8xl font-mono font-medium tracking-tighter transition-colors",
                         isUrgent ? "text-[#A24848]" : "text-text-primary"
                       )}>
                         {daysLeft}
                       </span>
                       <span className="text-xl font-medium text-text-tertiary uppercase tracking-widest">Days</span>
                    </div>
                    <p className="text-text-secondary font-normal text-sm">Estimated liquidity duration at current velocity</p>
                 </div>

                 <div className="w-full md:w-80 h-32 flex flex-col justify-end gap-6">
                    <div className="text-right">
                       <span className="text-[10px] font-bold uppercase tracking-widest text-text-tertiary">Projected Date</span>
                       <p suppressHydrationWarning className="text-2xl font-bold text-text-primary">{projectedDateStr}</p>
                    </div>
                    <div className="h-16 w-full opacity-30">
                       <ResponsiveContainer width="100%" height="100%">
                         <AreaChart data={sparklineData}>
                            <Area 
                              type="monotone" 
                              dataKey="val" 
                              stroke="#A24848" 
                              strokeWidth={1} 
                              fill="transparent" 
                            />
                         </AreaChart>
                       </ResponsiveContainer>
                    </div>
                 </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mt-12">
        <div className="space-y-4">
           <SectionLabel>Velocity comparison</SectionLabel>
           <div className="surface-card p-8">
              <div className="h-[200px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={comparisonData}>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#141413', 
                        border: '1px solid rgba(255,255,255,0.07)', 
                        borderRadius: '8px',
                        fontSize: '12px',
                        color: '#F0EDE8'
                      }}
                    />
                    <Area type="monotone" dataKey="current" stroke="#5254A3" strokeWidth={2} fill="transparent" />
                    <Area type="monotone" dataKey="previous" stroke="rgba(82, 84, 163, 0.3)" strokeWidth={1} fill="transparent" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="flex items-center gap-6 mt-6">
                 <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#5254A3]" />
                    <span className="text-[11px] font-bold text-text-tertiary uppercase tracking-wider">Current Period</span>
                 </div>
                 <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-text-tertiary/20" />
                    <span className="text-[11px] font-bold text-text-tertiary uppercase tracking-wider">Previous</span>
                 </div>
              </div>
           </div>
        </div>

        <div className="space-y-4">
           <SectionLabel>Statistical significance</SectionLabel>
           <div className="surface-card p-8 space-y-8">
              <div className="flex items-center justify-between">
                 <div className="space-y-1">
                    <h3 className="text-sm font-semibold text-text-primary">Correlation Model</h3>
                    <p className={cn(
                      "text-[11px] font-bold uppercase tracking-widest",
                      r2 > 0.7 ? "text-[#3E8E5D]" : r2 < 0.3 ? "text-[#A24848]" : "text-[#5254A3]"
                    )}>
                      {r2 > 0.7 ? "High Confidence" : r2 < 0.3 ? "Variable Signal" : "Standard Fit"}
                    </p>
                 </div>
                 <div className="relative w-14 h-14 flex items-center justify-center">
                    <svg className="w-full h-full -rotate-90 text-text-tertiary/10">
                       <circle cx="28" cy="28" r="24" fill="none" stroke="currentColor" strokeWidth="2" />
                       <motion.circle 
                          cx="28" cy="28" r="24" fill="none" 
                          stroke="#5254A3" strokeWidth="2"
                          strokeDasharray="150.8"
                          initial={{ strokeDashoffset: 150.8 }}
                          animate={{ strokeDashoffset: 150.8 - (150.8 * r2) }}
                          transition={{ duration: 1.5, ease: "easeOut" }}
                       />
                    </svg>
                    <span className="absolute text-[11px] font-mono font-bold text-text-primary">{confidencePercent}%</span>
                 </div>
              </div>
              
              <div className="p-4 bg-bg-base border border-border rounded-[8px] font-mono text-sm text-text-secondary">
                 y = {r2.toFixed(3)}x + 12.4
              </div>

              <div className="pt-2">
                 <button 
                  onClick={() => setIsHowItWorksOpen(!isHowItWorksOpen)}
                  className="flex items-center justify-between w-full group py-1 border-t border-border mt-2 pt-4"
                 >
                    <span className="text-[11px] font-bold text-text-tertiary group-hover:text-text-secondary transition-colors uppercase tracking-widest">Model analysis</span>
                    <ChevronDown className={cn("h-4 w-4 text-text-tertiary transition-transform", isHowItWorksOpen && "rotate-180")} />
                 </button>
                 <AnimatePresence>
                    {isHowItWorksOpen && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <p className="text-xs text-text-tertiary mt-4 leading-relaxed font-normal">
                           Logarithmic regression mapping 30-day transactional deltas to identify the average daily spending gradient. 
                           The algorithm minimizes least-squares residuals to project the intersection with your zero-balance threshold.
                        </p>
                      </motion.div>
                    )}
                 </AnimatePresence>
              </div>
           </div>
        </div>
      </div>

      <div className="space-y-4">
        <SectionLabel>Sector utilization</SectionLabel>
         <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {(() => {
              if (!expenses) return null;
              
              const categoryTotals = expenses.reduce((acc: any, e: any) => {
                const cat = e.category.toLowerCase();
                acc[cat] = (acc[cat] || 0) + e.amount;
                return acc;
              }, {});
              
              const totalSpending = Object.values(categoryTotals).reduce((a: any, b: any) => a + b, 0) as number;
              
              const sectors = [
                { name: 'Food', color: '#FCD34D' },
                { name: 'Rent', color: '#C4B5FD' },
                { name: 'Transport', color: '#67E8F9' },
                { name: 'Other', color: '#94A3B8' }
              ];

              return sectors.map((sector) => {
                const amount = categoryTotals[sector.name.toLowerCase()] || 0;
                const percent = totalSpending > 0 ? Math.round((amount / totalSpending) * 100) : 0;
                
                return (
                  <div key={sector.name} className="surface-card h-40 flex flex-col justify-between">
                     <span className="text-[10px] font-bold uppercase tracking-widest text-text-tertiary">{sector.name} Utilization</span>
                     <div className="space-y-2">
                        <div className="h-1 w-full bg-border rounded-full overflow-hidden">
                           <motion.div 
                             initial={{ width: 0 }}
                             whileInView={{ width: `${percent}%` }}
                             style={{ backgroundColor: sector.color }}
                             className="h-full opacity-60" 
                           />
                        </div>
                        <p className="text-[10px] font-medium text-text-tertiary uppercase tracking-widest">{percent}% utilized</p>
                     </div>
                  </div>
                );
              });
            })()}
         </div>
      </div>
    </div>
  )
}
