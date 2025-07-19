'use client'

import React, { useState } from 'react'
import { backendHelper } from '@/lib/backend-helper'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog'

interface CreateUserDialogProps {
    isOpen: boolean
    onClose: () => void
    onUserCreated: () => void
}

export default function CreateUserDialog({ isOpen, onClose, onUserCreated }: CreateUserDialogProps) {
    const [formData, setFormData] = useState({
        nom: '',
        email: '',
        password: '',
        role: ''
    })
    const [isLoading, setIsLoading] = useState(false)

    const handleFormChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            // Validation basique
            if (!formData.nom.trim() || !formData.email.trim() || !formData.password.trim() || !formData.role) {
                toast.error('Veuillez remplir tous les champs', { icon: '❌' })
                return
            }

            // Validation email basique
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            if (!emailRegex.test(formData.email)) {
                toast.error('Veuillez entrer une adresse email valide', { icon: '❌' })
                return
            }

            // Validation mot de passe (minimum 6 caractères)
            if (formData.password.length < 6) {
                toast.error('Le mot de passe doit contenir au moins 6 caractères', { icon: '❌' })
                return
            }

            // Appel à l'API selon le rôle
            if (formData.role === 'admin') {
                await backendHelper.createAdminOnAdmin(formData)
            } else {
                await backendHelper.createUserOnAdmin(formData)
            }

            // Réinitialiser le formulaire
            setFormData({
                nom: '',
                email: '',
                password: '',
                role: ''
            })

            // Fermer le dialog et notifier le parent
            onClose()
            onUserCreated()

        } catch (error) {
            console.error('Erreur lors de la création:', error)
            // L'erreur est déjà gérée par le backendHelper avec toast
        } finally {
            setIsLoading(false)
        }
    }

    const handleClose = () => {
        if (!isLoading) {
            setFormData({
                nom: '',
                email: '',
                password: '',
                role: ''
            })
            onClose()
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Créer un nouvel utilisateur</DialogTitle>
                    <p className="text-sm text-muted-foreground">
                        Remplissez les informations pour créer un nouvel utilisateur
                    </p>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="nom">Nom</Label>
                        <Input
                            id="nom"
                            value={formData.nom}
                            onChange={(e) => handleFormChange('nom', e.target.value)}
                            placeholder="Nom de l'utilisateur"
                            disabled={isLoading}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleFormChange('email', e.target.value)}
                            placeholder="email@exemple.com"
                            disabled={isLoading}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password">Mot de passe</Label>
                        <Input
                            id="password"
                            type="password"
                            value={formData.password}
                            onChange={(e) => handleFormChange('password', e.target.value)}
                            placeholder="Mot de passe"
                            disabled={isLoading}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="role">Rôle</Label>
                        <select
                            id="role"
                            value={formData.role}
                            onChange={(e) => handleFormChange('role', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                            disabled={isLoading}
                        >
                            <option value="">Sélectionner un rôle</option>
                            <option value="user">Utilisateur</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleClose}
                            disabled={isLoading}
                        >
                            Annuler
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? 'Création...' : 'Créer'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
} 