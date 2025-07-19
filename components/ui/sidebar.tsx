'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
    ChevronRight,
    UserIcon,
    LogOut,
    ChevronLeft,
    X
} from 'lucide-react'
import { backendHelper } from '@/lib/backend-helper'
import { routes } from '@/lib/route'
import { toast } from 'sonner'

interface SidebarProps {
    className?: string
    onClose?: () => void
    isMobile?: boolean
}

export function Sidebar({ className, onClose, isMobile = false }: SidebarProps) {
    const [isCollapsed, setIsCollapsed] = useState(false)
    const pathname = usePathname()

    const menuItems = [
        {
            id: 'dashboard',
            label: 'Dashboard',
            icon: UserIcon,
            href: '/auth/dashboard',
        }
    ]

    const handleLogout = async () => {
        try {
            await backendHelper.userLogout()
            window.location.href = routes.authUser
        } catch (error) {
            console.error('Erreur lors de la déconnexion:', error)
            // En cas d'erreur, forcer la déconnexion locale
            localStorage.removeItem('token')
            window.location.href = '/auth/admin'
        }
    }

    const handleItemClick = () => {
        // Fermer le sidebar sur mobile après avoir cliqué sur un élément
        if (isMobile && onClose) {
            onClose()
        }
    }

    return (
        <div className={cn(
            "flex flex-col h-screen bg-white border-r border-gray-200 transition-all duration-300",
            isMobile ? "w-64" : (isCollapsed ? "w-16" : "w-64"),
            className
        )}>
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
                {(!isCollapsed || isMobile) && (
                    <div className="flex flex-col">
                        <h1 className="text-lg font-bold text-gray-900">Bienvenue</h1>
                    </div>
                )}
                <div className="flex items-center gap-2">
                    {isMobile && onClose && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onClose}
                            className="md:hidden"
                        >
                            <X size={16} />
                        </Button>
                    )}
                    {!isMobile && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setIsCollapsed(!isCollapsed)}
                            className="ml-auto"
                        >
                            {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
                        </Button>
                    )}
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2">
                {menuItems.map((item) => {
                    const Icon = item.icon
                    const isActive = pathname === item.href

                    return (
                        <Link
                            key={item.id}
                            href={item.href}
                            onClick={handleItemClick}
                            className={cn(
                                "flex items-center space-x-2 p-2 rounded-lg transition-colors",
                                isActive
                                    ? "bg-blue-50 text-blue-700"
                                    : "hover:bg-gray-50 text-gray-700"
                            )}
                        >
                            <Icon size={16} />
                            {(!isCollapsed || isMobile) && <span className="text-sm font-medium">{item.label}</span>}
                        </Link>
                    )
                })}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-gray-200">
                <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start bg-red-100 h-10 text-red-600 transition-all duration-300 cursor-pointer"
                    onClick={handleLogout}
                >
                    <LogOut size={16} />
                    {(!isCollapsed || isMobile) && <span className="ml-2 text-sm">Déconnexion</span>}
                </Button>
            </div>
        </div>
    )
} 