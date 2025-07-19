'use client'

import React from 'react'
// import { Sidebar } from '@/components/ui/sidebar'
// import { Header } from '@/components/ui/header'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`lg:block`}>
        {/* <Sidebar /> */}
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        {/* <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} /> */}

        {/* Page content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
} 