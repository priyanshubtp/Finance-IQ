import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface SummaryCardProps {
  title: string
  value: string | number
  icon: React.ReactNode
  trend?: string
}

export const SummaryCard: React.FC<SummaryCardProps> = ({ title, value, icon, trend }) => {
  const isPositive = trend?.startsWith('+')
  
  return (
    <div className="surface-card flex flex-col gap-1 hover:border-border-hover transition-colors duration-150">
      <div className="flex items-center justify-between mb-1">
        <span className="text-[11px] font-bold text-text-tertiary uppercase tracking-wider">
          {title}
        </span>
        <div className="text-text-tertiary opacity-50">
          {icon}
        </div>
      </div>
      
      <div className="text-2xl font-mono font-medium text-text-primary tracking-tight">
        {value}
      </div>
      
      {trend && (
        <div className={`text-[12px] font-medium mt-1 ${isPositive ? 'text-[#3E8E5D]' : 'text-[#A24848]'}`}>
          {trend} <span className="text-text-tertiary font-normal">vs prev</span>
        </div>
      )}
    </div>
  )
}
