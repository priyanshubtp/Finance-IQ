"use client"

import React from 'react'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell,
  Legend
} from 'recharts'

interface ChartData {
  name: string
  actual: number
  budget: number
}

interface ExpenseChartProps {
  data?: ChartData[]
}

const defaultData: ChartData[] = [
  { name: 'Jan', actual: 2100, budget: 2500 },
  { name: 'Feb', actual: 2650, budget: 2500 },
  { name: 'Mar', actual: 1800, budget: 2500 },
  { name: 'Apr', actual: 2200, budget: 2500 },
]

export function ExpenseChart({ expenses = [] }: { expenses?: any[] }) {
  // Group by month
  const chartData = (() => {
    if (!expenses.length) return defaultData
    
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const groups: Record<string, number> = {}
    
    expenses.forEach(e => {
      const d = new Date(e.date)
      const m = months[d.getUTCMonth()]
      groups[m] = (groups[m] || 0) + e.amount
    })

    // Take last 4 months that have data
    const last4 = months
      .filter(m => groups[m] !== undefined)
      .slice(-4)
      .map(m => ({
        name: m,
        actual: Math.round(groups[m]),
        budget: 15000 / 12 // Simplified monthly budget
      }))
      
    return last4.length > 0 ? last4 : defaultData
  })()

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h3 className="text-[14px] font-semibold text-text-primary">Spending vs Budget</h3>
        <p className="text-[12px] text-text-tertiary">Monthly comparison · Current period</p>
      </div>

      <div className="h-[320px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
            <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#4A4845', fontSize: 11 }} 
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#4A4845', fontSize: 11 }} 
            />
            <Tooltip 
              cursor={{ fill: 'rgba(255,255,255,0.03)' }}
              contentStyle={{ 
                backgroundColor: '#141413', 
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: '8px',
                color: '#F0EDE8',
                fontSize: '12px',
                fontWeight: 500
              }}
            />
            <Bar dataKey="budget" name="Budget" fill="#5254A3" fillOpacity={0.2} radius={[4, 4, 0, 0]} barSize={32} />
            <Bar dataKey="actual" name="Actual" fill="#5254A3" fillOpacity={1} radius={[4, 4, 0, 0]} barSize={32} />
            <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', paddingTop: '20px', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700 }} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

