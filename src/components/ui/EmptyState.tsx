"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { PlusCircle } from 'lucide-react'

interface EmptyStateProps {
  title?: string
  description?: string
  action?: () => void
}

export function EmptyState({ 
  title = "Your financial story starts here", 
  description = "Clear. Physical. Tidy. Log your first expenditure.",
  action
}: EmptyStateProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center text-center space-y-8 py-20"
    >
      <div className="relative">
         {/* Floating Coins/Cards SVG Mock */}
         <div className="relative z-10 w-48 h-48 bg-indigo-500/5 rounded-full flex items-center justify-center border border-indigo-500/10">
            <motion.div
              animate={{ 
                y: [0, -20, 0],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="w-24 h-32 bg-gradient-to-br from-indigo-500/20 to-violet-500/20 rounded-2xl border border-white/10 shadow-2xl skew-x-6 flex items-center justify-center"
            >
               <div className="w-12 h-1 bg-white/20 rounded-full" />
            </motion.div>
            <motion.div
              animate={{ 
                y: [0, 15, 0],
                rotate: [0, -8, 8, 0]
              }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute top-10 right-0 w-20 h-28 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-2xl border border-white/10 shadow-2xl -skew-x-12"
            />
         </div>
         <div className="absolute inset-0 bg-indigo-500/20 blur-[100px] opacity-20" />
      </div>

      <div className="space-y-2">
         <h2 className="text-3xl font-display font-[800] tracking-tight bg-gradient-to-br from-white to-slate-400 bg-clip-text text-transparent">
           {title}
         </h2>
         <p className="text-slate-500 font-medium">{description}</p>
      </div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={action}
        className="flex items-center gap-3 bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white px-8 py-4 rounded-2xl font-bold shadow-[0_20px_40px_rgba(99,102,241,0.3)] group"
      >
        <PlusCircle className="h-5 w-5 group-hover:rotate-90 transition-transform" />
        Log First Expense
      </motion.button>
    </motion.div>
  )
}
