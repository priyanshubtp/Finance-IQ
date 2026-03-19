'use client'

import React from 'react'
import { motion } from 'framer-motion'

export function FloatingCoin() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.3 }}
      className="hidden md:block absolute top-[60px] right-[40px] z-10"
    >
      <div className="coin-stack w-[120px] h-[120px]">
        {/* Disc 1 */}
        <div className="coin-disc top-0" />
        {/* Disc 2 */}
        <div className="coin-disc top-[12px]" />
        {/* Disc 3 */}
        <div className="coin-disc top-[24px]" />
      </div>

      <style jsx>{`
        .coin-stack {
          position: relative;
          transform-style: preserve-3d;
          animation: coinSpin 8s linear infinite;
        }

        .coin-disc {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          position: absolute;
          left: 20px;
          border: 2px solid rgba(99, 102, 241, 0.6);
          background: radial-gradient(circle at 35% 35%, rgba(99, 102, 241, 0.3), rgba(139, 92, 246, 0.1));
          box-shadow: 0 20px 60px rgba(99, 102, 241, 0.25);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .coin-disc::after {
          content: '$';
          color: rgba(165, 180, 252, 0.8);
          font-size: 24px;
          font-weight: 700;
          font-family: var(--font-geist-mono);
        }

        @keyframes coinSpin {
          from { transform: rotateY(0deg) rotateX(15deg); }
          to   { transform: rotateY(360deg) rotateX(15deg); }
        }
      `}</style>
    </motion.div>
  )
}
