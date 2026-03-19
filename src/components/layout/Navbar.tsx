"use client"

import React from 'react'
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { LayoutDashboard, Receipt, BrainCircuit, BarChart3, Star } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/expenses", label: "Transactions", icon: Receipt },
  { href: "/predictions", label: "Forecast", icon: BrainCircuit },
]


export function Navbar() {
  const pathname = usePathname()

  return (
    <nav className="fixed top-0 z-50 w-full h-[52px] border-b border-white/[0.07] bg-[#0C0C0B]/85 backdrop-blur-[12px] px-8 flex items-center justify-between">
      <div className="flex items-center gap-10">
        <Link href="/dashboard" className="flex items-center gap-2 group">
          <span className="text-[16px] font-display font-bold tracking-[-0.02em] text-[#F0EDE8]">
             FinanceIQ
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-1 h-full">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link 
                key={item.href} 
                href={item.href}
                className={cn(
                  "text-[14px] transition-colors duration-150 px-3 py-1 flex items-center h-[52px]",
                  isActive 
                    ? "text-[#F0EDE8] font-medium border-b border-[#6366F1]" 
                    : "text-[#8A8680] font-normal hover:text-[#F0EDE8]"
                )}
              >
                {item.label}
              </Link>
            )
          })}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden sm:flex items-center bg-[rgba(99,102,241,0.12)] border border-[rgba(99,102,241,0.25)] px-2.5 py-0.5 rounded-[6px]">
           <span className="text-[11px] font-semibold text-[#9D9AF0] uppercase tracking-wider">Pro</span>
        </div>
        <div className="w-8 h-8 rounded-full bg-[#1C1C1A] border border-white/10 flex items-center justify-center cursor-pointer hover:border-white/20 transition-colors" />
      </div>
    </nav>
  )
}
