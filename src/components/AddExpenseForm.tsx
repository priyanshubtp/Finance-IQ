"use client"

import React, { useState } from 'react'
import { Plus } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { API_BASE } from '@/lib/fetchers'
import { mutate } from 'swr'
import { cn } from '@/lib/utils'

export function AddExpenseForm() {
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await fetch(`${API_BASE}/expenses/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ description, amount: parseFloat(amount), category, date }),
    })
    if (res.ok) {
      setDescription('')
      setAmount('')
      setCategory('')
      mutate(`${API_BASE}/expenses/`)
    }
  }

  const inputClasses = "bg-bg-base border border-border rounded-[8px] px-[12px] py-[9px] text-text-primary text-[14px] transition-all duration-150 focus:border-border-focus focus:outline-none w-full placeholder:text-text-tertiary"
  const labelClasses = "block text-[12px] font-medium text-text-secondary mb-[6px]"

  return (
    <div className="bg-bg-surface/40 backdrop-blur-xl border border-white/10 rounded-[20px] p-8 shadow-2xl relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-3xl rounded-full -mr-16 -mt-16 group-hover:bg-indigo-500/10 transition-colors" />
      
      <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
        <div className="space-y-2">
          <label className={labelClasses}>Description</label>
          <Input 
            value={description} 
            onChange={(e) => setDescription(e.target.value)} 
            placeholder="E.g. Apple HQ Coffee" 
            className={cn(inputClasses, "bg-white/5 border-white/10 focus:bg-white/10 focus:border-indigo-500/50 transition-all")}
            required 
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className={labelClasses}>Amount</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-tertiary text-sm">$</span>
              <Input 
                type="number" 
                step="0.01"
                value={amount} 
                onChange={(e) => setAmount(e.target.value)} 
                placeholder="0.00" 
                className={cn(inputClasses, "pl-8 bg-white/5 border-white/10 focus:bg-white/10 focus:border-indigo-500/50 transition-all")}
                required 
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className={labelClasses}>Date</label>
            <Input 
              type="date" 
              value={date} 
              onChange={(e) => setDate(e.target.value)} 
              className={cn(inputClasses, "bg-white/5 border-white/10 focus:bg-white/10 focus:border-indigo-500/50 transition-all")}
              required 
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className={labelClasses}>Category</label>
          <Select value={category} onValueChange={(val) => setCategory(val || '')} required>
            <SelectTrigger className={cn(inputClasses, "h-auto bg-white/5 border-white/10 focus:bg-white/10 focus:border-indigo-500/50 transition-all")}>
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent className="bg-[#141413] border-white/10 text-text-primary rounded-xl backdrop-blur-xl">
              <SelectItem value="Food" className="focus:bg-white/5">Food</SelectItem>
              <SelectItem value="Transport" className="focus:bg-white/5">Transport</SelectItem>
              <SelectItem value="Rent" className="focus:bg-white/5">Rent</SelectItem>
              <SelectItem value="Entertainment" className="focus:bg-white/5">Entertainment</SelectItem>
              <SelectItem value="Other" className="focus:bg-white/5">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <button 
          type="submit" 
          className="w-full rounded-xl py-4 px-6 font-bold text-sm text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:shadow-[0_0_20px_rgba(79,70,229,0.4)] transition-all duration-300 mt-4 active:scale-[0.98] flex items-center justify-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Log Transaction
        </button>
      </form>
    </div>
  )
}

