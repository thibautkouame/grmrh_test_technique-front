'use client'

import React from 'react'
import { Button } from '@/components/ui/button'

interface Tab {
  id: string
  label: string
  icon: React.ReactNode
}

interface TabsProps {
  tabs: Tab[]
  activeTab: string
  onTabChange: (tabId: string) => void
  className?: string
}

export function Tabs({ tabs, activeTab, onTabChange, className }: TabsProps) {
  return (
    <div className={`flex space-x-1 bg-gray-100 p-1 rounded-lg ${className}`}>
      {tabs.map((tab) => (
        <Button
          key={tab.id}
          variant={activeTab === tab.id ? "default" : "ghost"}
          size="sm"
          onClick={() => onTabChange(tab.id)}
          className={`flex items-center space-x-2 ${
            activeTab === tab.id 
              ? "bg-white text-gray-900 shadow-sm" 
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          {tab.icon}
          <span className="text-sm font-medium">{tab.label}</span>
        </Button>
      ))}
    </div>
  )
} 