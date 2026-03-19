"use client"

import { useMotionValue, useSpring, useTransform, motion } from 'framer-motion'
import { useEffect, useRef } from 'react'

export function AnimatedNumber({ value, prefix = '', decimals = 0 }: { value: number; prefix?: string; decimals?: number }) {
  const motionVal = useMotionValue(0)
  const spring = useSpring(motionVal, { stiffness: 60, damping: 20 })
  const display = useTransform(spring, (v) =>
    `${prefix}${v.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`
  )

  useEffect(() => {
    motionVal.set(value)
  }, [value, motionVal])

  return <motion.span className="font-mono">{display}</motion.span>
}
