"use client"

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { format } from 'date-fns'
import { cn, formatCurrency } from '@/lib/utils'
import { UtensilsCrossed, Car, Home, Tv, MoreHorizontal, Trash2 } from 'lucide-react'
import { ElevatedCard } from './ui/Cards'
import { API_BASE } from '@/lib/fetchers'
import { mutate } from 'swr'

interface Expense {
  id: number
  description: string
  amount: number
  category: string
  date: string
}

interface ExpenseListProps {
  expenses: Expense[]
}

const badgeStyles: Record<string, { background: string, color: string, border: string }> = {
  FOOD: {
    background: 'rgba(251,191,36,0.12)',
    color: '#FCD34D',
    border: '1px solid rgba(251,191,36,0.25)'
  },
  TRANSPORT: {
    background: 'rgba(34,211,238,0.12)',
    color: '#67E8F9',
    border: '1px solid rgba(34,211,238,0.25)'
  },
  RENT: {
    background: 'rgba(167,139,250,0.12)',
    color: '#C4B5FD',
    border: '1px solid rgba(167,139,250,0.25)'
  },
  ENTERTAINMENT: {
    background: 'rgba(244,114,182,0.12)',
    color: '#F9A8D4',
    border: '1px solid rgba(244,114,182,0.25)'
  },
  OTHER: {
    background: 'rgba(148,163,184,0.10)',
    color: '#94A3B8',
    border: '1px solid rgba(148,163,184,0.2)'
  }
}

const categoryIcon = {
  FOOD:          { icon: UtensilsCrossed, color: '#F59E0B', bg: 'rgba(245,158,11,0.12)' },
  TRANSPORT:     { icon: Car,             color: '#06B6D4', bg: 'rgba(6,182,212,0.12)'  },
  RENT:          { icon: Home,            color: '#8B5CF6', bg: 'rgba(139,92,246,0.12)' },
  ENTERTAINMENT: { icon: Tv,              color: '#EC4899', bg: 'rgba(236,72,153,0.12)' },
  OTHER:         { icon: MoreHorizontal,  color: '#64748B', bg: 'rgba(100,116,139,0.12)'},
}

export function ExpenseList({ expenses }: ExpenseListProps) {
  return (
    <div className="p-0">
      <div className="px-6 py-4 border-b border-border flex items-center justify-between">
         <div className="flex items-center gap-3">
            <h3 className="text-sm font-semibold text-text-primary">Transactions</h3>
            <span className="text-[11px] text-text-tertiary font-medium">
                {expenses.length} total
            </span>
         </div>
      </div>
      
      <div className="p-0 max-h-[600px] overflow-y-auto px-6">
        <AnimatePresence initial={false}>
          {expenses.map((expense, idx) => {
            const cat = expense.category.toUpperCase()
            const Icon = (categoryIcon[cat as keyof typeof categoryIcon] || categoryIcon.OTHER).icon

            return (
              <motion.div
                key={expense.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ delay: idx * 0.02 }}
                className="list-item group flex items-center justify-between hover:bg-white/[0.02] pr-6"
              >
                <div className="flex items-center gap-4">
                  <div className="w-[36px] h-[36px] rounded-[8px] flex items-center justify-center bg-[rgba(99,102,241,0.12)] border border-[rgba(99,102,241,0.25)]">
                    <Icon className="h-[16px] w-[16px] text-[#9D9AF0]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-text-primary">
                      {expense.description}
                    </p>
                    <span 
                      style={badgeStyles[cat as keyof typeof badgeStyles] || badgeStyles.OTHER}
                      className="text-[10px] font-bold tracking-widest uppercase px-[9px] py-[3px] rounded-[6px] inline-block mt-1"
                    >
                      {expense.category}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-sm font-mono font-medium text-text-accent">
                      {formatCurrency(expense.amount)}
                    </p>
                    <p className="text-[12px] text-text-tertiary">
                      {format(new Date(expense.date), 'MMM dd, yyyy')}
                    </p>
                  </div>
                  <button 
                    onClick={async () => {
                      if (confirm('Delete transaction?')) {
                        const res = await fetch(`${API_BASE}/expenses/${expense.id}`, { method: 'DELETE' })
                        if (res.ok) mutate(`${API_BASE}/expenses/`)
                      }
                    }}
                    className="opacity-0 group-hover:opacity-100 p-2 hover:bg-red-500/10 hover:text-red-400 rounded-lg transition-all text-text-tertiary"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </div>
  )
}

