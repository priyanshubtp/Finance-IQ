"use client"

import React from 'react'
import useSWR from 'swr'
import { fetcher, expenseFetcher } from "@/lib/fetchers"
import { motion } from 'framer-motion'
import { GlassCard } from '@/components/ui/Cards'
import { AddExpenseForm } from '@/components/AddExpenseForm'
import { ExpenseList } from '@/components/ExpenseList'
import { Skeleton } from '@/components/ui/skeleton'
import { ExpenseListSkeleton } from '@/components/ui/Skeletons'
import { FloatingCoin } from '@/components/3d/FloatingCoin'
import { EmptyState } from '@/components/ui/EmptyState'

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="section-label">
      {children}
    </span>
  )
}


export default function ExpensesPage() {
  const { data: expenses } = useSWR(expenseFetcher, fetcher)

  if (!expenses) {
    return (
      <div className="container mx-auto px-6 pt-24 pb-20 space-y-12">
        <header className="page-header">
           <Skeleton className="h-10 w-48 bg-white/10" />
           <Skeleton className="h-4 w-32 mt-2 bg-white/5" />
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-4">
             <Skeleton className="h-[400px] w-full rounded-[20px] bg-white/[0.02]" />
          </div>
          <div className="lg:col-span-8">
             <ExpenseListSkeleton />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-6 pt-24 pb-20 space-y-12">
      <header className="page-header">
        <motion.h1 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="page-title"
        >
          Transactions
        </motion.h1>
        <p className="page-subtitle">{expenses.length} records · last updated today</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-4 space-y-4">
           <SectionLabel>Log Transaction</SectionLabel>
           <AddExpenseForm />
        </div>


        <div className="lg:col-span-8 space-y-4">
           <SectionLabel>Transaction History</SectionLabel>
           {expenses.length === 0 ? (
             <EmptyState 
               title="No transactions found" 
               description="Your financial ledger is currently empty. Start by logging your first expense to calibrate the engine."
             />
           ) : (
             <GlassCard className="p-0">
                <ExpenseList expenses={expenses} />
             </GlassCard>
           )}
        </div>
      </div>
    </div>
  )
}
