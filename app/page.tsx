'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { isAuthenticated } from '@/lib/utils'
import { routes } from '@/lib/route'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    // Vérifier si l'utilisateur est authentifié
    if (isAuthenticated()) {
      // Si authentifié, rediriger vers le dashboard
      router.push('/auth/dashboard')
    } else {
      // Si non authentifié, rediriger vers la page de connexion
      router.push(routes.authUser)
    }
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Chargement...</h1>
        <p className="text-gray-600">Redirection en cours</p>
      </div>
    </div>
  )
}
