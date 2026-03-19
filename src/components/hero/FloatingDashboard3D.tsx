"use client"

import React, { useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { AnimatedNumber } from '@/components/AnimatedNumber'
import { TrendingUp, Wallet, Zap } from 'lucide-react'

interface FloatingDashboard3DProps {
  daysLeft?: number | null
  totalLiquidity?: number
  spending?: number
}

export function FloatingDashboard3D({ 
  daysLeft = 14, 
  totalLiquidity = 28540.20, 
  spending = 1240 
}: FloatingDashboard3DProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const springConfig = { damping: 30, stiffness: 200 }
  const springX = useSpring(mouseX, springConfig)
  const springY = useSpring(mouseY, springConfig)

  // Parallax offsets
  const card1X = useTransform(springX, [-0.5, 0.5], [-15, 15])
  const card1Y = useTransform(springY, [-0.5, 0.5], [-15, 15])
  
  const card2X = useTransform(springX, [-0.5, 0.5], [-25, 25])
  const card2Y = useTransform(springY, [-0.5, 0.5], [-25, 25])
  
  const card3X = useTransform(springX, [-0.5, 0.5], [-35, 35])
  const card3Y = useTransform(springY, [-0.5, 0.5], [-35, 35])

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    mouseX.set(x)
    mouseY.set(y)
  }

  const handleMouseLeave = () => {
    mouseX.set(0)
    mouseY.set(0)
  }

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full h-[260px] flex items-center justify-center perspective-1200 transform-3d select-none mb-0"
    >
      <div className="relative w-[560px] h-[240px] flex items-center justify-center">
        {/* Card 2 — Spending (Left) */}
        <motion.div
          initial={{ rotateX: 30, y: 60, opacity: 0 }}
          animate={{ rotateX: 12, y: 0, opacity: 1 }}
          transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
          style={{ 
            x: card2X, y: card2Y, 
            rotateX: 12, rotateY: -8, translateZ: 40,
            left: '0px',
            top: '20px'
          }}
          className="absolute z-10 w-[200px] h-[120px] rounded-[18px] bg-gradient-to-br from-[#8F3A5D] to-[#2D2E70] border border-white/10 p-5 text-white"
        >
          <div className="flex flex-col h-full justify-between">
             <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-white/50">Spending</span>
             </div>
             <div className="space-y-1">
                <p className="text-xl font-mono font-medium tracking-tight">${spending.toLocaleString()}</p>
                <div className="flex items-center gap-1 text-[9px] font-medium text-white/40">
                   <span className="uppercase">+12% vs last month</span>
                </div>
             </div>
          </div>
        </motion.div>

        {/* Card 1 — Balance (Center) */}
        <motion.div
          initial={{ rotateX: 30, y: 60, opacity: 0 }}
          animate={{ rotateX: 12, y: 0, opacity: 1 }}
          transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
          style={{ 
            x: card1X, y: card1Y, 
            rotateX: 12, rotateY: -8, translateZ: 80,
            left: '140px',
            top: '0px'
          }}
          className="absolute z-20 w-[230px] h-[140px] rounded-[18px] bg-gradient-to-br from-[#3A3B8F] to-[#1C1C1A] border border-white/15 p-6 text-white"
        >
          <div className="flex flex-col h-full justify-between">
             <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-white/50">Total Liquidity</span>
             </div>
             <p className="text-2xl font-mono font-medium tracking-tight">
               $<AnimatedNumber value={totalLiquidity} precision={0} />
             </p>
          </div>
        </motion.div>
 
        {/* Card 3 — Zero-Day (Right) */}
        <motion.div
          initial={{ rotateX: 30, y: 60, opacity: 0 }}
          animate={{ rotateX: 12, y: 0, opacity: 1 }}
          transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1], delay: 0.30 }}
          style={{ 
            x: card3X, y: card3Y, 
            rotateX: 12, rotateY: -8, translateZ: 60,
            left: '360px',
            top: '30px'
          }}
          className="absolute z-10 w-[200px] h-[120px] rounded-[18px] bg-gradient-to-br from-[#2D708F] to-[#2D2E70] border border-white/10 p-5 text-white"
        >
          <div className="flex flex-col h-full justify-between">
             <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-white/50">Forecast</span>
             </div>
             <div>
                <p className="text-3xl font-mono font-medium tracking-tight">
                  {daysLeft !== null ? <AnimatedNumber value={daysLeft} precision={0} /> : '--'}
                </p>
                <p className="text-[9px] font-medium uppercase tracking-widest text-white/40">Days remaining</p>
             </div>
          </div>
        </motion.div>

      </div>
    </div>

  )
}
