"use client"

import React from 'react'
import useSWR from 'swr'
import { fetcher, expenseFetcher, predictionFetcher } from "@/lib/fetchers"
import { motion } from 'framer-motion'
import { FloatingDashboard3D } from '@/components/hero/FloatingDashboard3D'
import { GlassCard, ElevatedCard, GradientCard } from '@/components/ui/Cards'
import { Receipt, Wallet, TrendingUp, Zap, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { cn, formatCurrency } from '@/lib/utils'
import { ExpenseChart } from '@/components/ExpenseChart'
import { AnimatedNumber } from '@/components/AnimatedNumber'
import { Skeleton } from '@/components/ui/skeleton'
import { ChartSkeleton, StatCardSkeleton, ExpenseListSkeleton } from '@/components/ui/Skeletons'

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="section-label">
      {children}
    </span>
  )
}


export default function DashboardPage() {
  const budget = 15000 
  const { data: expenses } = useSWR(expenseFetcher, fetcher, { revalidateOnFocus: false })
  const { data: prediction } = useSWR(predictionFetcher(budget), fetcher)

  if (!expenses || !prediction) {
    return (
      <div className="container mx-auto px-6 pt-24 pb-20 space-y-12">
        <div className="h-[260px] w-full flex items-center justify-center bg-white/[0.02] rounded-[24px] border border-white/5 animate-pulse">
          <Skeleton className="h-24 w-80 bg-white/10" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ChartSkeleton />
          <div className="space-y-4">
             <Skeleton className="h-6 w-32 bg-white/5" />
             <div className="bg-bg-surface border border-border rounded-[20px] p-6">
                <ExpenseListSkeleton />
             </div>
          </div>
        </div>
      </div>
    )
  }

  const totalSpent = expenses.reduce((sum: number, e: any) => sum + e.amount, 0)
  
  // Dynamic liquidity: Base balance (e.g. 40k) minus total spent
  const baseLiquidity = 40000
  const totalLiquidity = baseLiquidity - totalSpent

  const currentMonthYear = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

  return (
    <div className="container mx-auto px-6 pt-24 pb-20 space-y-12">
      <header className="page-header">
        <motion.h1 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="page-title"
        >
          Overview
        </motion.h1>
        <p className="page-subtitle">Your financial snapshot for {currentMonthYear}</p>
      </header>

      <SectionLabel>Overview</SectionLabel>
      <FloatingDashboard3D 
        daysLeft={prediction.days_until_zero}
        spending={totalSpent}
        totalLiquidity={totalLiquidity}
      />

      <div className="mt-8">
        <SectionLabel>Analytics</SectionLabel>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div 
          initial={{ opacity: 0, y: 40, scale: 0.97 }}
          whileInView={{ opacity:1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
        >
          <GlassCard className="p-8 h-full">
            <ExpenseChart expenses={expenses} />
          </GlassCard>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 40, scale: 0.97 }}
          whileInView={{ opacity:1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.08 }}
          viewport={{ once: true }}
        >
           <GlassCard className="p-8 h-full">
              <div className="flex flex-col h-full justify-between">
                 <h3 className="text-lg font-semibold mb-6 text-white">Category Split</h3>
                 <div className="grid grid-cols-1 gap-5">
                    {(() => {
                      const categoryTotals = expenses.reduce((acc: any, e: any) => {
                        const cat = e.category.toUpperCase()
                        acc[cat] = (acc[cat] || 0) + e.amount
                        return acc
                      }, {})
                      const totalSpending = Object.values(categoryTotals).reduce((a: any, b: any) => a + b, 0) as number
                      
                      const categoryConfig: Record<string, { color: string, badge: string }> = {
                        FOOD: { color: '#FCD34D', badge: 'bg-[#FCD34D]' },
                        TRANSPORT: { color: '#67E8F9', badge: 'bg-[#67E8F9]' },
                        RENT: { color: '#C4B5FD', badge: 'bg-[#C4B5FD]' },
                        ENTERTAINMENT: { color: '#F9A8D4', badge: 'bg-[#F9A8D4]' },
                        OTHER: { color: '#94A3B8', badge: 'bg-[#94A3B8]' },
                      }

                      return Object.entries(categoryTotals).map(([cat, amount]: [string, any]) => {
                        const config = categoryConfig[cat] || categoryConfig.OTHER
                        const percent = totalSpending > 0 ? (amount / totalSpending) * 100 : 0
                        return (
                          <div key={cat} className="space-y-2">
                             <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                   <div className={cn("w-2 h-2 rounded-full", config.badge)} />
                                   <span className="text-[10px] font-[800] uppercase tracking-widest text-slate-400">{cat}</span>
                                </div>
                                <span className="font-mono text-sm text-white font-medium">{formatCurrency(amount)}</span>
                             </div>
                             <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                <motion.div 
                                  initial={{ width: 0 }}
                                  whileInView={{ width: `${percent}%` }}
                                  className={cn("h-full transition-all duration-1000", config.badge)}
                                />
                             </div>
                          </div>
                        )
                      })
                    })()}
                 </div>
                 <div className="mt-10 pt-6 border-t border-white/5 flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Allocation Density</span>
                    <div className="text-[10px] font-mono text-indigo-400">CALIBRATED</div>
                 </div>
              </div>
           </GlassCard>
        </motion.div>
      </div>

      <SectionLabel>Recent Activity</SectionLabel>
      <div className="space-y-4">
        {[...expenses]
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .slice(0, 5)
          .map((expense: any) => (
          <motion.div
            key={expense.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <ElevatedCard className="p-5 flex items-center justify-between group">
               <div className="flex items-center gap-6">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 group-hover:bg-indigo-500/20 transition-all group-hover:scale-105">
                     <Receipt className="h-5 w-5 text-indigo-400" />
                  </div>
                  <div>
                     <p className="text-sm font-semibold text-white">{expense.description}</p>
                     <span 
                        style={{
                          FOOD: { background: 'rgba(251,191,36,0.12)', color: '#FCD34D', border: '1px solid rgba(251,191,36,0.25)' },
                          TRANSPORT: { background: 'rgba(34,211,238,0.12)', color: '#67E8F9', border: '1px solid rgba(34,211,238,0.25)' },
                          RENT: { background: 'rgba(167,139,250,0.12)', color: '#C4B5FD', border: '1px solid rgba(167,139,250,0.25)' },
                          ENTERTAINMENT: { background: 'rgba(244,114,182,0.12)', color: '#F9A8D4', border: '1px solid rgba(244,114,182,0.25)' },
                          OTHER: { background: 'rgba(148,163,184,0.10)', color: '#94A3B8', border: '1px solid rgba(148,163,184,0.2)' }
                        }[expense.category.toUpperCase() as "FOOD" | "TRANSPORT" | "RENT" | "ENTERTAINMENT" | "OTHER"] || { background: 'rgba(148,163,184,0.10)', color: '#94A3B8', border: '1px solid rgba(148,163,184,0.2)' }}
                        className="text-[10px] font-bold tracking-widest uppercase px-[9px] py-[3px] rounded-[6px] inline-block mt-1"
                     >
                        {expense.category}
                     </span>
                  </div>
               </div>
               <div className="text-right">
                  <p className="text-base font-mono font-medium text-[#A5B4FC]">{formatCurrency(expense.amount)}</p>
                  <p className="text-[10px] text-slate-500 font-medium">{new Date(expense.date).toLocaleDateString()}</p>
               </div>
            </ElevatedCard>
          </motion.div>
        ))}
        <div className="flex justify-end pt-2">
           <Link href="/expenses" className="text-[11px] font-black uppercase tracking-[0.2em] text-indigo-500 hover:text-indigo-400 transition-all flex items-center gap-3">
              View Ledger <ArrowRight className="h-3 w-3" />
           </Link>
        </div>
      </div>

      <SectionLabel>Executive Stats</SectionLabel>
      {(() => {
        // Daily Velocity: total spending / unique active days
        const totalSpent = expenses.reduce((sum: number, e: any) => sum + e.amount, 0)
        const uniqueDays = new Set(expenses.map((e: any) => e.date)).size
        const dailyVelocity = uniqueDays > 0 ? totalSpent / uniqueDays : 0

        // Top Outflow: single largest expense
        const topExpense = expenses.reduce((max: any, e: any) => (!max || e.amount > max.amount) ? e : max, null)
        const topAmount = topExpense?.amount ?? 0
        const topLabel = topExpense ? `${topExpense.category} · ${topExpense.description.split(' ').slice(0, 3).join(' ')}` : 'N/A'

        // Runway Health: days_until_zero from prediction API
        const daysLeft = prediction?.days_until_zero ?? null

        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-12">
            <GradientCard colorPair="indigo">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50 mb-2">DAILY VELOCITY</p>
              <p className="text-3xl font-mono font-medium tracking-tighter text-white">
                <AnimatedNumber value={dailyVelocity} prefix="$" />
              </p>
              <p className="text-[12px] text-white/60 mt-1">avg spend per day</p>
            </GradientCard>

            <GradientCard colorPair="pink">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50 mb-2">TOP OUTFLOW</p>
              <p className="text-3xl font-mono font-medium tracking-tighter text-white">
                <AnimatedNumber value={topAmount} prefix="$" />
              </p>
              <p className="text-[12px] text-white/60 mt-1 truncate">{topLabel}</p>
            </GradientCard>

            <GradientCard colorPair="cyan">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50 mb-2">RUNWAY HEALTH</p>
              <p className="text-3xl font-mono font-medium tracking-tighter text-white">
                {daysLeft !== null ? <><AnimatedNumber value={daysLeft} /> Days</> : 'N/A'}
              </p>
              <p className="text-[12px] text-white/60 mt-1">until balance hits zero</p>
            </GradientCard>
          </div>
        )
      })()}
    </div>
  )
}
