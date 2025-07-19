'use client'

import React, { useEffect, useState } from 'react'
import { backendHelper } from '@/lib/backend-helper'
import { getUser } from '@/lib/functions'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Image from 'next/image'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
    User,
    LogOut,
    Shield,
    Mail,
    Calendar,
    Loader2,
    Edit,
    Camera,
    X
} from 'lucide-react'
import { toast } from 'sonner'
import { routes } from '@/lib/route'
import { User as UserType, UpdateUserData } from '@/lib/types'

interface UserAvatarProps {
    className?: string
    showDropdown?: boolean
    size?: 'sm' | 'md' | 'lg'
    onDataUpdate?: () => void
}

export default function UserAvatar({ className = '', showDropdown = true, size = 'md', onDataUpdate }: UserAvatarProps) {
    const [user, setUser] = useState<UserType | null>(null)
    const [loading, setLoading] = useState(true)
    const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [editFormData, setEditFormData] = useState({
        nom: '',
        email: '',
        role: '',
        actif: false
    })
    const [editLoading, setEditLoading] = useState(false)
    const [avatarFile, setAvatarFile] = useState<File | null>(null)
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
    const [avatarLoading, setAvatarLoading] = useState(false)
    const [isAvatarPopupOpen, setIsAvatarPopupOpen] = useState(false)

    useEffect(() => {
        fetchUserData()
    }, [])

    const fetchUserData = async () => {
        try {
            setLoading(true)
            const userData = await getUser()
            console.log('UserAvatar - getUser response:', userData)
            setUser(userData as UserType | null)
        } catch (error) {
            console.error('Erreur lors de la récupération des données utilisateur:', error)
            toast.error('Impossible de charger les informations utilisateur')
        } finally {
            setLoading(false)
        }
    }

    const handleLogout = async () => {
        try {
            // Appeler l'API de déconnexion
            await backendHelper.userLogout()

            if (user?.role === 'admin') {
                window.location.href = routes.authAdmin
            } else {
                window.location.href = routes.authUser
            }
        } catch (error) {
            console.error('Erreur lors de la déconnexion:', error)
            // En cas d'erreur, forcer la déconnexion locale
            localStorage.removeItem('token')
            window.location.href = '/auth/admin'
        }
    }

    const handleProfileClick = () => {
        setIsProfileDialogOpen(true)
    }

    const handleEditClick = () => {
        if (user) {
            setEditFormData({
                nom: user.nom,
                email: user.email,
                role: user.role,
                actif: user.actif
            })
        }
        setIsEditDialogOpen(true)
        setIsProfileDialogOpen(false)
    }

    const handleEditFormChange = (field: string, value: string | boolean) => {
        setEditFormData(prev => ({
            ...prev,
            [field]: value
        }))
    }

    const handleEditSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!user) return

        setEditLoading(true)
        try {
            const updatedUser: UpdateUserData = {
                ...user,
                ...editFormData
            }

            await backendHelper.userUpdate(updatedUser)

            // Recharger les données utilisateur
            await fetchUserData()

            // Déclencher le rafraîchissement des données dans le dashboard
            if (onDataUpdate) {
                onDataUpdate()
            }

            setIsEditDialogOpen(false)
        } catch (error) {
            console.error('Erreur lors de la mise à jour:', error)
        } finally {
            setEditLoading(false)
        }
    }

    const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
            // Vérifier le type de fichier
            if (!file.type.startsWith('image/')) {
                toast.error('Veuillez sélectionner une image valide')
                return
            }

            // Vérifier la taille (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                toast.error('L\'image doit faire moins de 5MB')
                return
            }

            setAvatarFile(file)

            // Créer un aperçu
            const reader = new FileReader()
            reader.onload = (e) => {
                setAvatarPreview(e.target?.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    const handleAvatarUpload = async () => {
        if (!avatarFile || !user) return

        setAvatarLoading(true)
        try {
            await backendHelper.updateUserAvatar(avatarFile)

            // Recharger les données utilisateur
            await fetchUserData()

            // Déclencher le rafraîchissement des données dans le dashboard
            if (onDataUpdate) {
                onDataUpdate()
            }

            // Réinitialiser les états
            setAvatarFile(null)
            setAvatarPreview(null)
        } catch (error: unknown) {
            console.error('Erreur lors de la mise à jour de l\'avatar:', error)
        } finally {
            setAvatarLoading(false)
        }
    }

    const handleCancelAvatar = () => {
        setAvatarFile(null)
        setAvatarPreview(null)
    }

    const handleAvatarClick = () => {
        if (user?.avatar) {
            setIsAvatarPopupOpen(true)
        }
    }

    const getInitials = (name: string) => {
        return name

            .split(' ')
            .map(word => word.charAt(0))
            .join('')
            .toUpperCase()
            .slice(0, 2)
    }

    const getSizeClasses = () => {
        switch (size) {
            case 'sm':
                return 'h-8 w-8'
            case 'lg':
                return 'h-12 w-12'
            default:
                return 'h-10 w-10'
        }
    }

    const getRoleIcon = (role: string) => {
        switch (role.toLowerCase()) {
            case 'admin':
                return <Shield className="h-4 w-4 text-purple-600" />
            case 'user':
                return <User className="h-4 w-4 text-blue-600" />
            default:
                return <User className="h-4 w-4 text-gray-600" />
        }
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        })
    }

    const formatFullDate = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleString('fr-FR', {
            weekday: 'long',
            day: '2-digit',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    if (loading) {
        return (
            <div className={`flex items-center justify-center ${getSizeClasses()} ${className}`}>
                <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
            </div>
        )
    }

    if (!user) {
        return (
            <div className={`flex items-center justify-center ${getSizeClasses()} ${className}`}>
                <User className="h-4 w-4 text-gray-400" />
            </div>
        )
    }

    // Debug: Afficher l'URL de l'avatar
    const avatarUrl = user.avatar ? (user.avatar.startsWith('http') ? user.avatar : process.env.NEXT_PUBLIC_API_URL_IMAGE + user.avatar) : undefined

    const avatarComponent = (
        <Avatar
            className={`${getSizeClasses()} ${className} ${user?.avatar ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''}`}
            onClick={handleAvatarClick}
        >
            <AvatarImage
                src={user.avatar ? (user.avatar.startsWith('http') ? user.avatar : process.env.NEXT_PUBLIC_API_URL_IMAGE + user.avatar) : undefined}
                alt={user.nom}
                className="object-cover"
                onError={(e) => {
                    console.error('Erreur de chargement de l\'avatar:', e)
                    console.log('URL tentée:', avatarUrl)
                }}
            />
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-medium">
                {getInitials(user.nom)}
            </AvatarFallback>
        </Avatar>
    )

    if (!showDropdown) {
        return avatarComponent
    }

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-auto w-auto p-0">
                        {avatarComponent}
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-80" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                            <p className="text-sm font-medium leading-none">{user.nom}</p>
                            <p className="text-xs leading-none text-muted-foreground">
                                {user.email}
                            </p>
                        </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />

                    {/* Informations utilisateur */}
                    <div className="px-2 py-1.5">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                            {getRoleIcon(user.role)}
                            <span className="capitalize">{user.role}</span>
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${user.actif
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                                }`}>
                                {user.actif ? 'Actif' : 'Inactif'}
                            </span>
                        </div>

                        {user.createdAt && (
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Calendar className="h-3 w-3" />
                                <span>Membre depuis {formatDate(user.createdAt)}</span>
                            </div>
                        )}
                    </div>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem className="cursor-pointer" onClick={handleProfileClick}>
                        <User className="mr-2 h-4 w-4" />
                        <span>Profil</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />

                    <DropdownMenuItem
                        className="cursor-pointer text-red-600 focus:text-red-600"
                        onClick={handleLogout}
                    >
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Se déconnecter</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            {/* Dialog de profil utilisateur */}
            <Dialog open={isProfileDialogOpen} onOpenChange={setIsProfileDialogOpen}>
                <DialogContent className="w-[95vw] max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-lg">
                            <User className="h-5 w-5" />
                            <span>Profil utilisateur</span>
                        </DialogTitle>
                    </DialogHeader>

                    {user && (
                        <div className="space-y-6">
                            {/* En-tête avec avatar et informations principales */}
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 bg-gray-50 rounded-lg">
                                <div className="relative">
                                    <Avatar
                                        className={`h-20 w-20 ${user?.avatar ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''}`}
                                        onClick={handleAvatarClick}
                                    >
                                        <AvatarImage
                                            src={user.avatar ? (user.avatar.startsWith('http') ? user.avatar : process.env.NEXT_PUBLIC_API_URL_IMAGE + user.avatar) : undefined}
                                            alt={user.nom}
                                            className="object-cover"
                                        />
                                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-medium text-lg">
                                            {getInitials(user.nom)}
                                        </AvatarFallback>
                                    </Avatar>

                                    {/* Bouton pour changer l'avatar */}
                                    <label className="absolute -bottom-1 -right-1 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-1.5 cursor-pointer transition-colors">
                                        <Camera className="h-3 w-3" />
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleAvatarChange}
                                            className="hidden"
                                        />
                                    </label>
                                </div>

                                <div className="flex-1 space-y-2">
                                    <h3 className="text-xl font-semibold text-gray-900">{user.nom}</h3>
                                    <div className="flex items-center gap-2">
                                        {getRoleIcon(user.role)}
                                        <span className="capitalize font-medium">{user.role}</span>
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.actif
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-red-100 text-red-800'
                                            }`}>
                                            {user.actif ? 'Actif' : 'Inactif'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Informations détaillées */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {/* Informations personnelles */}
                                <div className="space-y-4">
                                    <h4 className="text-lg font-medium text-gray-900 border-b pb-2">Informations personnelles</h4>

                                    <div className="space-y-3">
                                        <div>
                                            <label className="text-sm font-medium text-gray-500">Nom complet</label>
                                            <p className="text-sm text-gray-900 mt-1">{user.nom}</p>
                                        </div>

                                        <div>
                                            <label className="text-sm font-medium text-gray-500">Adresse email</label>
                                            <div className="flex items-center gap-2 mt-1">
                                                <Mail className="h-4 w-4 text-gray-400" />
                                                <p className="text-sm text-gray-900">{user.email}</p>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="text-sm font-medium text-gray-500">Rôle</label>
                                            <div className="flex items-center gap-2 mt-1">
                                                {getRoleIcon(user.role)}
                                                <span className="text-sm text-gray-900 capitalize">{user.role}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Informations système */}
                                <div className="space-y-4">
                                    <h4 className="text-lg font-medium text-gray-900 border-b pb-2">Informations système</h4>

                                    <div className="space-y-3">
                                        <div>
                                            <label className="text-sm font-medium text-gray-500">ID utilisateur</label>
                                            <p className="text-sm font-mono text-gray-900 mt-1 break-all">{user._id}</p>
                                        </div>

                                        <div>
                                            <label className="text-sm font-medium text-gray-500">Statut du compte</label>
                                            <div className="mt-1">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.actif
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'
                                                    }`}>
                                                    {user.actif ? 'Compte actif' : 'Compte inactif'}
                                                </span>
                                            </div>
                                        </div>

                                        {user.createdAt && (
                                            <div>
                                                <label className="text-sm font-medium text-gray-500">Membre depuis</label>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <Calendar className="h-4 w-4 text-gray-400" />
                                                    <p className="text-sm text-gray-900">{formatFullDate(user.createdAt)}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Section de changement d'avatar */}
                            {(avatarFile || avatarPreview) && (
                                <div className="space-y-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                                    <h4 className="text-lg font-medium text-gray-900">Nouvelle photo de profil</h4>

                                    <div className="flex items-center gap-4">
                                        {/* Aperçu de l'ancien avatar */}
                                        <div className="text-center">
                                            <p className="text-xs text-gray-500 mb-2">Photo de profil actuelle</p>
                                            <Avatar className="h-16 w-16">
                                                <AvatarImage
                                                    src={user.avatar ? (user.avatar.startsWith('http') ? user.avatar : process.env.NEXT_PUBLIC_API_URL_IMAGE + user.avatar) : undefined}
                                                    alt={user.nom}
                                                    className="object-cover"
                                                />
                                                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-medium">
                                                    {getInitials(user.nom)}
                                                </AvatarFallback>
                                            </Avatar>
                                        </div>

                                        {/* Flèche */}
                                        <div className="text-gray-400">
                                            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                            </svg>
                                        </div>

                                        {/* Aperçu du nouvel avatar */}
                                        <div className="text-center">
                                            <p className="text-xs text-gray-500 mb-2">Nouvelle photo de profil</p>
                                            <Avatar className="h-16 w-16">
                                                <AvatarImage
                                                    src={avatarPreview || undefined}
                                                    alt="Aperçu"
                                                    className="object-cover"
                                                />
                                                <AvatarFallback className="bg-gray-200 text-gray-600">
                                                    <Camera className="h-6 w-6" />
                                                </AvatarFallback>
                                            </Avatar>
                                        </div>
                                    </div>

                                    {/* Actions pour l'avatar */}
                                    <div className="flex flex-col sm:flex-row gap-3">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            className="flex-1"
                                            onClick={handleCancelAvatar}
                                            disabled={avatarLoading}
                                        >
                                            <X className="h-4 w-4 mr-2" />
                                            Annuler
                                        </Button>
                                        <Button
                                            type="button"
                                            className="flex-1 bg-blue-600 hover:bg-blue-700"
                                            onClick={handleAvatarUpload}
                                            disabled={avatarLoading}
                                        >
                                            {avatarLoading ? (
                                                <>
                                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                    Mise à jour...
                                                </>
                                            ) : (
                                                <>
                                                    <Camera className="h-4 w-4 mr-2" />
                                                    Mettre à jour la photo de profil
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {/* Actions */}
                            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
                                <Button
                                    variant="outline"
                                    className="flex-1"
                                    onClick={() => setIsProfileDialogOpen(false)}
                                >
                                    Fermer
                                </Button>
                                <Button
                                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                                    onClick={handleEditClick}
                                >
                                    <Edit className="h-4 w-4 mr-2" />
                                    Modifier le profil
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Dialog d'édition du profil */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="w-[95vw] max-w-md max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-lg">
                            <Edit className="h-5 w-5" />
                            <span>Modifier le profil</span>
                        </DialogTitle>
                    </DialogHeader>

                    <form onSubmit={handleEditSubmit} className="space-y-4">
                        {/* Nom */}
                        <div className="space-y-2">
                            <Label htmlFor="nom">Nom complet</Label>
                            <Input
                                id="nom"
                                type="text"
                                value={editFormData.nom}
                                onChange={(e) => handleEditFormChange('nom', e.target.value)}
                                placeholder="Votre nom complet"
                                required
                            />
                        </div>

                        {/* Email */}
                        <div className="space-y-2">
                            <Label htmlFor="email">Adresse email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={editFormData.email}
                                onChange={(e) => handleEditFormChange('email', e.target.value)}
                                placeholder="votre.email@exemple.com"
                                required
                            />
                        </div>

                        {/* Rôle (lecture seule) */}
                        <div className="space-y-2">
                            <Label htmlFor="role">Rôle</Label>
                            <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-md border">
                                {getRoleIcon(editFormData.role)}
                                <span className="text-sm font-medium capitalize">{editFormData.role}</span>
                            </div>
                            <p className="text-xs text-gray-500">Le rôle ne peut pas être modifié</p>
                        </div>

                        {/* Statut (lecture seule) */}
                        <div className="space-y-2">
                            <Label>Statut du compte</Label>
                            <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-md border">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${editFormData.actif
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-red-100 text-red-800'
                                    }`}>
                                    {editFormData.actif ? 'Actif' : 'Inactif'}
                                </span>
                            </div>
                            <p className="text-xs text-gray-500">Le statut ne peut pas être modifié</p>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
                            <Button
                                type="button"
                                variant="outline"
                                className="flex-1"
                                onClick={() => setIsEditDialogOpen(false)}
                                disabled={editLoading}
                            >
                                Annuler
                            </Button>
                            <Button
                                type="submit"
                                className="flex-1 bg-blue-600 hover:bg-blue-700"
                                disabled={editLoading}
                            >
                                {editLoading ? (
                                    <>
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        Mise à jour...
                                    </>
                                ) : (
                                    <>
                                        <Edit className="h-4 w-4 mr-2" />
                                        Mettre à jour
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Dialog popup pour afficher la photo de profil en grand */}
            <Dialog open={isAvatarPopupOpen} onOpenChange={setIsAvatarPopupOpen}>
                <DialogContent className="w-[95vw] max-w-2xl max-h-[90vh] overflow-hidden p-0">
                    <div className="relative">
                        {/* Image en grand */}
                        <Image
                            width={100}
                            height={100}
                            src={user?.avatar ? (user.avatar.startsWith('http') ? user.avatar : process.env.NEXT_PUBLIC_API_URL_IMAGE + user.avatar) : ''}
                            alt={`Photo de profil de ${user?.nom}`}
                            className="w-full h-auto max-h-[80vh] object-contain"
                        />

                        {/* Bouton fermer */}
                        <Button
                            variant="ghost"
                            size="sm"
                            className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white rounded-full h-8 w-8 p-0"
                            onClick={() => setIsAvatarPopupOpen(false)}
                        >
                            <X className="h-4 w-4" />
                        </Button>

                        {/* Informations en bas */}
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                            <div className="text-white">
                                <h3 className="text-lg font-semibold">{user?.nom}</h3>
                                <p className="text-sm opacity-90">{user?.email}</p>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
} 