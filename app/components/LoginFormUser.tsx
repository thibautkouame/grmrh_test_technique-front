'use client'

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { AnimatePresence, motion } from "framer-motion"
import { backendHelper } from "@/lib/backend-helper"
import { toast } from "sonner"
import { userType } from '@/lib/definitions'
import { useRouter } from 'next/navigation'

// Animation variants
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            duration: 0.8,
            staggerChildren: 0.1
        }
    }
}

const itemVariants = {
    hidden: { 
        opacity: 0, 
        y: 20,
        scale: 0.95
    },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            duration: 0.5
        }
    }
}

const formVariants = {
    hidden: { 
        opacity: 0, 
        x: -40,
        scale: 0.98
    },
    visible: {
        opacity: 1,
        x: 0,
        scale: 1,
        transition: {
            duration: 0.4
        }
    },
    exit: {
        opacity: 0,
        x: 40,
        scale: 0.98,
        transition: {
            duration: 0.3
        }
    }
}

const loginFormVariants = {
    hidden: { 
        opacity: 0, 
        x: 40,
        scale: 0.98
    },
    visible: {
        opacity: 1,
        x: 0,
        scale: 1,
        transition: {
            duration: 0.4
        }
    },
    exit: {
        opacity: 0,
        x: -40,
        scale: 0.98,
        transition: {
            duration: 0.3
        }
    }
}

const tabVariants = {
    inactive: { 
        scale: 1,
        backgroundColor: "rgb(243 244 246)"
    },
    active: { 
        scale: 1.02,
        backgroundColor: "rgb(0 0 0)",
        transition: {
            duration: 0.2
        }
    }
}

const buttonVariants = {
    idle: { scale: 1 },
    hover: { 
        scale: 1.02,
        transition: { duration: 0.2 }
    },
    tap: { 
        scale: 0.98,
        transition: { duration: 0.1 }
    },
    loading: {
        scale: [1, 1.05, 1],
        transition: {
            duration: 1.5,
            repeat: Infinity
        }
    }
}

const inputVariants = {
    idle: { 
        scale: 1,
        borderColor: "rgb(209 213 219)"
    },
    focus: { 
        scale: 1.01,
        borderColor: "rgb(59 130 246)",
        transition: { duration: 0.2 }
    },
    error: { 
        scale: 1.01,
        borderColor: "rgb(239 68 68)",
        transition: { duration: 0.2 }
    }
}

export default function LoginFormUser() {
    const [activeTab, setActiveTab] = useState<'inscription' | 'connexion'>('inscription')
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const router = useRouter()
    // states pour les formulaires
    const [formData, setFormData] = useState({
        nom: '',
        email: '',
        password: '',
        confirmPassword: ''
    })

    // states pour la gestion des erreurs et du chargement
    const [errors, setErrors] = useState<{ [key: string]: string }>({})
    const [isLoading, setIsLoading] = useState(false)

    // gestion des changements dans les champs
    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }))
        // Effacer l'erreur du champ modifié
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }))
        }
    }

    // validation du formulaire d'inscription
    const validateSignupForm = () => {
        const newErrors: { [key: string]: string } = {}

        if (!formData.nom.trim()) {
            newErrors.nom = 'Le nom est requis'
        }

        if (!formData.email.trim()) {
            newErrors.email = 'L\'email est requis'
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Format d\'email invalide'
        }

        if (!formData.password) {
            newErrors.password = 'Le mot de passe est requis'
        } else if (formData.password.length < 6) {
            newErrors.password = 'Le mot de passe doit contenir au moins 6 caractères'
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Les mots de passe ne correspondent pas'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    // validation du formulaire de connexion
    const validateLoginForm = () => {
        const newErrors: { [key: string]: string } = {}

        if (!formData.email.trim()) {
            newErrors.email = 'L\'email est requis'
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Format d\'email invalide'
        }

        if (!formData.password) {
            newErrors.password = 'Le mot de passe est requis'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    // gestion de la soumission du formulaire d'inscription
    const handleSignupSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validateSignupForm()) {
            return
        }

        setIsLoading(true)

        try {
            const userData = {
                nom: formData.nom,
                email: formData.email,
                password: formData.password
            }

            const response = await backendHelper.createUser(userData)
            console.log('Utilisateur créé avec succès:', response)

            // redirection vers la page de connexion
            setActiveTab('connexion')
            setFormData({ nom: '', email: '', password: '', confirmPassword: '' })

        } catch (error) {
            console.error('Erreur lors de la création du compte:', error)
        } finally {
            setIsLoading(false)
        }
    }

    // gestion de la soumission du formulaire de connexion
    const handleLoginSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validateLoginForm()) {
            return
        }

        setIsLoading(true)

        try {
            const loginData = {
                email: formData.email,
                password: formData.password
            }

            await backendHelper.userLogin(loginData)

            // toast.success('Connexion réussie ! Redirection vers le dashboard')
            setTimeout(() => {
                toast.success('Connexion réussie ! Redirection vers le dashboard', {
                    icon: (
                        <svg className="animate-spin mr-2 h-5 w-5 text-green-500 inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                        </svg>
                    )
                });
            }, 2000)

            setTimeout(() => {
                router.push(userType.routes.dashboard);
            }, 4000)

        } catch (error) {
            console.error('Erreur lors de la connexion:', error)
            setErrors({ login: error instanceof Error ? error.message : 'Une erreur est survenue' })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex min-h-screen bg-background flex-col lg:flex-row">
            {/* Section gauche - Hero */}
            <div className="hidden lg:flex lg:w-1/2 text-white p-8 lg:p-32 flex-col justify-center">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="max-w-lg"
                >
                    {/* Tag */}
                    <motion.div 
                        variants={itemVariants}
                        className="inline-flex text-black items-center px-3 py-1 rounded-full bg-transparent border border-black/10 text-sm mb-6"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.2 }}
                    >
                        <div className="w-2 h-2 bg-black rounded-full mr-2"></div>
                        <span>grmrh</span>
                    </motion.div>

                    {/* Titre principal */}
                    <motion.h1 
                        variants={itemVariants}
                        className="text-4xl lg:text-5xl text-black/90 font-bold leading-tight mb-6"
                    >
                        Test technique
                        <br />
                        Entretien développeur
                    </motion.h1>

                    {/* Description */}
                    <motion.p 
                        variants={itemVariants}
                        className="text-black text-base lg:text-lg mb-8 leading-relaxed"
                    >
                        mini-application web de gestion des utilisateurs avec authentification, rôles et
                        gestion d&apos;un tableau de données.
                    </motion.p>

                    {/* Boutons d'action */}
                    <motion.div 
                        variants={itemVariants}
                        className="flex items-center space-x-6"
                    >
                        <motion.div
                            variants={buttonVariants}
                            whileHover="hover"
                            whileTap="tap"
                        >
                            <Button className="bg-black hover:bg-gray-800 text-white px-6 py-3 rounded-lg flex items-center space-x-2">
                                <span>Commencer</span>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </Button>
                        </motion.div>
                    </motion.div>
                </motion.div>
            </div>

            {/* Section mobile - Header avec titre */}
            <div className="lg:hidden p-6 text-center">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {/* Tag */}
                    <motion.div 
                        variants={itemVariants}
                        className="inline-flex text-black items-center px-3 py-1 rounded-full bg-transparent border border-black/10 text-sm mb-4"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.2 }}
                    >
                        <div className="w-2 h-2 bg-black rounded-full mr-2"></div>
                        <span>grmrh</span>
                    </motion.div>

                    {/* Titre principal */}
                    <motion.h1 
                        variants={itemVariants}
                        className="text-2xl sm:text-3xl text-black/90 font-bold leading-tight mb-3"
                    >
                        Test technique
                        <br />
                        Entretien développeur
                    </motion.h1>

                    {/* Description */}
                    <motion.p 
                        variants={itemVariants}
                        className="text-black text-sm sm:text-base mb-6 leading-relaxed max-w-md mx-auto"
                    >
                        mini-application web de gestion des utilisateurs avec authentification, rôles et
                        gestion d&apos;un tableau de données.
                    </motion.p>
                </motion.div>
            </div>

            {/* Section droite - Formulaire */}
            <div className="flex-1 flex items-center justify-center p-4 sm:p-8 lg:p-32">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    <Card className="w-full max-w-md border-none shadow-none min-h-[500px] sm:min-h-[600px] flex flex-col">
                        <CardHeader className="pb-4 sm:pb-6">
                            <motion.div 
                                className="flex bg-gray-100 rounded-lg p-1"
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.3 }}
                            >
                                <motion.button
                                    onClick={() => setActiveTab('inscription')}
                                    className={`flex-1 py-2 px-3 sm:px-4 rounded-md text-xs sm:text-sm font-medium transition-colors ${activeTab === 'inscription'
                                        ? 'text-white shadow-sm'
                                        : 'text-gray-600 hover:text-gray-800'
                                        }`}
                                    variants={tabVariants}
                                    animate={activeTab === 'inscription' ? 'active' : 'inactive'}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    Inscription
                                </motion.button>
                                <motion.button
                                    onClick={() => setActiveTab('connexion')}
                                    className={`flex-1 py-2 px-3 sm:px-4 rounded-md text-xs sm:text-sm font-medium transition-colors ${activeTab === 'connexion'
                                        ? 'text-white shadow-sm'
                                        : 'text-gray-600 hover:text-gray-800'
                                        }`}
                                    variants={tabVariants}
                                    animate={activeTab === 'connexion' ? 'active' : 'inactive'}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    Connexion
                                </motion.button>
                            </motion.div>
                        </CardHeader>

                        <CardContent className="space-y-3 sm:space-y-4 flex-1 flex flex-col justify-center">
                            <AnimatePresence mode="wait" initial={false}>
                                {activeTab === 'inscription' ? (
                                    // formulaire d'inscription
                                    <motion.form
                                        key="inscription"
                                        className="space-y-3 sm:space-y-4"
                                        variants={formVariants}
                                        initial="hidden"
                                        animate="visible"
                                        exit="exit"
                                        onSubmit={handleSignupSubmit}
                                    >
                                        <motion.div 
                                            className="space-y-1 sm:space-y-2"
                                            variants={itemVariants}
                                        >
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <svg className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                    </svg>
                                                </div>
                                                <motion.div
                                                    variants={inputVariants}
                                                    whileFocus="focus"
                                                    animate={errors.nom ? "error" : "idle"}
                                                >
                                                    <Input
                                                        id="name"
                                                        type="text"
                                                        placeholder="Nom complet"
                                                        className={`pl-10 text-sm w-80 ${errors.nom ? 'border-red-500' : ''}`}
                                                        value={formData.nom}
                                                        onChange={(e) => handleInputChange('nom', e.target.value)}
                                                        required
                                                    />
                                                </motion.div>
                                            </div>
                                            <AnimatePresence>
                                                {errors.nom && (
                                                    <motion.p 
                                                        className="text-red-500 text-xs sm:text-sm"
                                                        initial={{ opacity: 0, y: -10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        exit={{ opacity: 0, y: -10 }}
                                                        transition={{ duration: 0.2 }}
                                                    >
                                                        {errors.nom}
                                                    </motion.p>
                                                )}
                                            </AnimatePresence>
                                        </motion.div>

                                        <motion.div 
                                            className="space-y-1 sm:space-y-2"
                                            variants={itemVariants}
                                        >
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <svg className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                                    </svg>
                                                </div>
                                                <motion.div
                                                    variants={inputVariants}
                                                    whileFocus="focus"
                                                    animate={errors.email ? "error" : "idle"}
                                                >
                                                    <Input
                                                        id="email-signup"
                                                        type="email"
                                                        placeholder="Email"
                                                        className={`pl-10 text-sm h-10 ${errors.email ? 'border-red-500' : ''}`}
                                                        value={formData.email}
                                                        onChange={(e) => handleInputChange('email', e.target.value)}
                                                        required
                                                    />
                                                </motion.div>
                                            </div>
                                            <AnimatePresence>
                                                {errors.email && (
                                                    <motion.p 
                                                        className="text-red-500 text-xs sm:text-sm"
                                                        initial={{ opacity: 0, y: -10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        exit={{ opacity: 0, y: -10 }}
                                                        transition={{ duration: 0.2 }}
                                                    >
                                                        {errors.email}
                                                    </motion.p>
                                                )}
                                            </AnimatePresence>
                                        </motion.div>

                                        <motion.div 
                                            className="space-y-1 sm:space-y-2"
                                            variants={itemVariants}
                                        >
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <svg className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                                                    </svg>
                                                </div>
                                                <motion.div
                                                    variants={inputVariants}
                                                    whileFocus="focus"
                                                    animate={errors.password ? "error" : "idle"}
                                                >
                                                    <Input
                                                        id="password-signup"
                                                        type={showPassword ? "text" : "password"}
                                                        placeholder="Mot de passe"
                                                        className={`pl-10 pr-10 text-sm h-10 ${errors.password ? 'border-red-500' : ''}`}
                                                        value={formData.password}
                                                        onChange={(e) => handleInputChange('password', e.target.value)}
                                                        required
                                                    />
                                                </motion.div>
                                                <motion.button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.9 }}
                                                >
                                                    {showPassword ? (
                                                        <svg className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                                                        </svg>
                                                    ) : (
                                                        <svg className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                        </svg>
                                                    )}
                                                </motion.button>
                                            </div>
                                            <AnimatePresence>
                                                {errors.password && (
                                                    <motion.p 
                                                        className="text-red-500 text-xs sm:text-sm"
                                                        initial={{ opacity: 0, y: -10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        exit={{ opacity: 0, y: -10 }}
                                                        transition={{ duration: 0.2 }}
                                                    >
                                                        {errors.password}
                                                    </motion.p>
                                                )}
                                            </AnimatePresence>
                                        </motion.div>

                                        <motion.div 
                                            className="space-y-1 sm:space-y-2"
                                            variants={itemVariants}
                                        >
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <svg className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                                                    </svg>
                                                </div>
                                                <motion.div
                                                    variants={inputVariants}
                                                    whileFocus="focus"
                                                    animate={errors.confirmPassword ? "error" : "idle"}
                                                >
                                                    <Input
                                                        id="confirm-password"
                                                        type={showConfirmPassword ? "text" : "password"}
                                                        placeholder="Confirmer le mot de passe"
                                                        className={`pl-10 pr-10 text-sm h-10 ${errors.confirmPassword ? 'border-red-500' : ''}`}
                                                        value={formData.confirmPassword}
                                                        onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                                                        required
                                                    />
                                                </motion.div>
                                                <motion.button
                                                    type="button"
                                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.9 }}
                                                >
                                                    {showConfirmPassword ? (
                                                        <svg className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                                                        </svg>
                                                    ) : (
                                                        <svg className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                        </svg>
                                                    )}
                                                </motion.button>
                                            </div>
                                            <AnimatePresence>
                                                {errors.confirmPassword && (
                                                    <motion.p 
                                                        className="text-red-500 text-xs sm:text-sm"
                                                        initial={{ opacity: 0, y: -10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        exit={{ opacity: 0, y: -10 }}
                                                        transition={{ duration: 0.2 }}
                                                    >
                                                        {errors.confirmPassword}
                                                    </motion.p>
                                                )}
                                            </AnimatePresence>
                                        </motion.div>

                                        <motion.div
                                            variants={buttonVariants}
                                            animate={isLoading ? "loading" : "idle"}
                                            whileHover={!isLoading ? "hover" : undefined}
                                            whileTap={!isLoading ? "tap" : undefined}
                                        >
                                            <Button
                                                type="submit"
                                                className="w-full bg-black hover:bg-gray-800 text-white text-sm sm:text-base py-2 sm:py-3"
                                                disabled={isLoading}
                                            >
                                                {isLoading ? 'Création en cours...' : 'S\'inscrire'}
                                            </Button>
                                        </motion.div>
                                    </motion.form>
                                ) : (
                                    // formulaire de connexion
                                    <motion.form
                                        key="connexion"
                                        className="space-y-3 sm:space-y-4"
                                        variants={loginFormVariants}
                                        initial="hidden"
                                        animate="visible"
                                        exit="exit"
                                        onSubmit={handleLoginSubmit}
                                    >
                                        <AnimatePresence>
                                            {errors.login && (
                                                <motion.div 
                                                    className="p-3 bg-red-50 border border-red-200 rounded-md"
                                                    initial={{ opacity: 0, y: -20, scale: 0.95 }}
                                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                                    exit={{ opacity: 0, y: -20, scale: 0.95 }}
                                                    transition={{ duration: 0.3 }}
                                                >
                                                    <p className="text-red-600 text-xs sm:text-sm">{errors.login}</p>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>

                                        <motion.div 
                                            className="space-y-1 sm:space-y-2"
                                            variants={itemVariants}
                                        >
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <svg className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                                    </svg>
                                                </div>
                                                <motion.div
                                                    variants={inputVariants}
                                                    whileFocus="focus"
                                                    animate={errors.email ? "error" : "idle"}
                                                >
                                                    <Input
                                                        id="email"
                                                        type="email"
                                                        placeholder="Email"
                                                        className={`pl-10 text-sm w-80 h-10 ${errors.email ? 'border-red-500' : ''}`}
                                                        value={formData.email}
                                                        onChange={(e) => handleInputChange('email', e.target.value)}
                                                        required
                                                    />
                                                </motion.div>
                                            </div>
                                            <AnimatePresence>
                                                {errors.email && (
                                                    <motion.p 
                                                        className="text-red-500 text-xs sm:text-sm"
                                                        initial={{ opacity: 0, y: -10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        exit={{ opacity: 0, y: -10 }}
                                                        transition={{ duration: 0.2 }}
                                                    >
                                                        {errors.email}
                                                    </motion.p>
                                                )}
                                            </AnimatePresence>
                                        </motion.div>

                                        <motion.div 
                                            className="space-y-1 sm:space-y-2"
                                            variants={itemVariants}
                                        >
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <svg className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                                                    </svg>
                                                </div>
                                                <motion.div
                                                    variants={inputVariants}
                                                    whileFocus="focus"
                                                    animate={errors.password ? "error" : "idle"}
                                                >
                                                    <Input
                                                        id="password"
                                                        type={showPassword ? "text" : "password"}
                                                        placeholder="Mot de passe"
                                                        className={`pl-10 pr-10 text-sm h-10 ${errors.password ? 'border-red-500' : ''}`}
                                                        value={formData.password}
                                                        onChange={(e) => handleInputChange('password', e.target.value)}
                                                        required
                                                    />
                                                </motion.div>
                                                <motion.button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.9 }}
                                                >
                                                    {showPassword ? (
                                                        <svg className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                                                        </svg>
                                                    ) : (
                                                        <svg className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                        </svg>
                                                    )}
                                                </motion.button>
                                            </div>
                                            <AnimatePresence>
                                                {errors.password && (
                                                    <motion.p 
                                                        className="text-red-500 text-xs sm:text-sm"
                                                        initial={{ opacity: 0, y: -10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        exit={{ opacity: 0, y: -10 }}
                                                        transition={{ duration: 0.2 }}
                                                    >
                                                        {errors.password}
                                                    </motion.p>
                                                )}
                                            </AnimatePresence>
                                        </motion.div>

                                        <motion.div
                                            variants={buttonVariants}
                                            animate={isLoading ? "loading" : "idle"}
                                            whileHover={!isLoading ? "hover" : undefined}
                                            whileTap={!isLoading ? "tap" : undefined}
                                        >
                                            <Button
                                                type="submit"
                                                className="w-full bg-black hover:bg-gray-800 text-white text-sm sm:text-base py-2 sm:py-3"
                                                disabled={isLoading}
                                            >
                                                {isLoading ? 'Connexion en cours...' : 'Se connecter'}
                                            </Button>
                                        </motion.div>
                                    </motion.form>
                                )}
                            </AnimatePresence>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </div>
    )
}
