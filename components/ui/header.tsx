'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Menu, Search, Command, Sun } from 'lucide-react'

interface HeaderProps {
  onMenuToggle?: () => void
  className?: string
}

export function Header({ onMenuToggle, className }: HeaderProps) {
  return (
    <header className={`flex items-center justify-between p-4 bg-white border-b border-gray-200 ${className}`}>
      {/* Left side - Menu toggle */}
      <Button
        variant="ghost"
        size="sm"
        onClick={onMenuToggle}
        className="lg:hidden"
      >
        <Menu size={20} />
      </Button>

      {/* Center - Search bar */}
      <div className="flex-1 max-w-md mx-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <Input
            placeholder="Search"
            className="pl-10 pr-4"
          />
        </div>
      </div>

      {/* Right side - Controls */}
      <div className="flex items-center space-x-2">
        <Button variant="outline" size="sm">
          <Command size={16} />
          <span className="ml-2 hidden sm:inline">⌘K</span>
        </Button>
        
        <Button variant="ghost" size="sm">
          <Sun size={20} />
        </Button>
      </div>
    </header>
  )
} 