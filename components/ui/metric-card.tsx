'use client'

import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { TrendingUp, TrendingDown, Info } from 'lucide-react'

interface MetricCardProps {
    title: string
    value: string
    change: string
    changeType: 'increase' | 'decrease'
    icon: React.ReactNode
    timeframe?: string
    className?: string
}

export function MetricCard({
    title,
    value,
    change,
    changeType,
    icon,
    timeframe,
    className
}: MetricCardProps) {
    return (
            <Card className={`bg-white ${className}`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            {icon}
            <span className="text-sm font-medium text-gray-600">{title}</span>
          </div>
          <Info size={14} className="text-gray-400" />
        </div>
        
        <div className="mb-2">
          <div className="text-xl font-bold text-gray-900">{value}</div>
          {timeframe && (
            <div className="text-xs text-gray-500">{timeframe}</div>
          )}
        </div>
        
        <div className="flex items-center space-x-1">
          {changeType === 'increase' ? (
            <TrendingUp size={14} className="text-green-500" />
          ) : (
            <TrendingDown size={14} className="text-red-500" />
          )}
          <span className={`text-xs font-medium ${changeType === 'increase' ? 'text-green-600' : 'text-red-600'
            }`}>
            {change}
          </span>
        </div>
      </CardContent>
    </Card>
    )
} 