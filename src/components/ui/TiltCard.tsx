"use client"

import { useSpring, animated } from '@react-spring/web'
import { useRef } from 'react'

export function TiltCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [spring, api] = useSpring(() => ({
    rotateX: 0, rotateY: 0, scale: 1,
    config: { mass: 1, tension: 260, friction: 36 }
  }))

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    api.start({ rotateX: -y * 14, rotateY: x * 14, scale: 1.025 })
  }

  const handleLeave = () =>
    api.start({ rotateX: 0, rotateY: 0, scale: 1 })

  return (
    <animated.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{
        transformStyle: 'preserve-3d',
        transform: spring.rotateX.to((rx) => 
          `perspective(800px) rotateX(${rx}deg) rotateY(${spring.rotateY.get()}deg) scale(${spring.scale.get()})`
        )
      }}
      className={className}
    >
      {children}
    </animated.div>
  )
}
