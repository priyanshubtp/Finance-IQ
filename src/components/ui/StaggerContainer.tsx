"use client"

import { motion } from 'framer-motion'

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } }
}

const itemVariants = {
  hidden: { opacity: 0, y: 22, rotateX: 8 },
  show: {
    opacity: 1, y: 0, rotateX: 0,
    transition: { duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] as any }
  }
}

export function StaggerContainer({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div 
      variants={containerVariants} 
      initial="hidden" 
      animate="show"
      style={{ transformPerspective: 1000 }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function StaggerItem({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div variants={itemVariants} className={className}>
      {children}
    </motion.div>
  )
}
