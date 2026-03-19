"use client"

import React, { useEffect } from 'react'
import { motion, useSpring, useTransform, useMotionValue } from 'framer-motion'

interface AnimatedNumberProps {
  value: number
  precision?: number
  prefix?: string
}

export function AnimatedNumber({ value, precision = 2, prefix }: AnimatedNumberProps) {
  const motionValue = useMotionValue(0)
  const springValue = useSpring(motionValue, {
    damping: 30,
    stiffness: 100,
  })

  useEffect(() => {
    motionValue.set(value)
  }, [value, motionValue])

  const displayValue = useTransform(springValue, (latest) =>
    latest.toLocaleString(undefined, {
      minimumFractionDigits: precision,
      maximumFractionDigits: precision,
    })
  )

  return <>{prefix && <span>{prefix}</span>}<motion.span>{displayValue}</motion.span></>
}
