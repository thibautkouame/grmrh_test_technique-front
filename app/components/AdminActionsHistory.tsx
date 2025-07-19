'use client'

import React, { useEffect, useState } from 'react'
import { backendHelper } from '@/lib/backend-helper'
import { AdminActionsHistoryResponse, AdminActionHistoryItem } from '@/app/models/dataDefinition'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuCheckboxItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
    Search,
    Filter,
    User,
    Activity,
    Clock,
    FileText,
    Trash2,
    Edit,
    UserPlus,
    Shield,
    Eye,
    ExternalLink
} from 'lucide-react'

interface AdminActionsHistoryProps {
    adminId: string
    refreshTrigger?: number
    children: React.ReactNode
}

export default function AdminActionsHistory({ adminId, refreshTrigger, children }: AdminActionsHistoryProps) {
    const [history, setHistory] = useState<AdminActionsHistoryResponse | null>(null)
    const [loading, setLoading] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')
    const [actionFilters, setActionFilters] = useState<Set<string>>(new Set())
    const [targetTypeFilters, setTargetTypeFilters] = useState<Set<string>>(new Set())
    const [selectedAction, setSelectedAction] = useState<AdminActionHistoryItem | null>(null)
    const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)
    const [open, setOpen] = useState(false)
    const [allHistory, setAllHistory] = useState<AdminActionHistoryItem[]>([])
    const [hasMore, setHasMore] = useState(true)
    const [loadCount, setLoadCount] = useState(0)

    useEffect(() => {
        if (open && adminId) {
            // Reset pagination when opening
            setAllHistory([])
            setHasMore(true)
            setLoading(false)
            setLoadCount(0)
            fetchHistory()
        } else if (!open) {
            // Reset when closing
            setAllHistory([])
            setHasMore(true)
            setLoading(false)
            setLoadCount(0)
        }
    }, [open, adminId, refreshTrigger])

    const fetchHistory = async () => {
        setLoading(true)
        try {
            const data = await backendHelper.adminActionsHistory(adminId)

            // Simuler l'infinite scroll en ajoutant les données à la liste existante
            const newItems = data.history || []
            setAllHistory(prev => {
                const updatedHistory = [...prev, ...newItems]
                return updatedHistory
            })
            setHistory(data as AdminActionsHistoryResponse)

            // Incrémenter le compteur de chargement
            setLoadCount(prev => {
                const newCount = prev + 1
                // Simuler qu'il n'y a plus de données après 3 chargements
                if (newCount >= 3) {
                    setHasMore(false)
                }
                return newCount
            })
        } catch (error) {
            console.error('Erreur lors de la récupération de l\'historique:', error)
        } finally {
            setLoading(false)
        }
    }

    // Filtrer l'historique selon les critères
    const filteredHistory = allHistory.filter((item: AdminActionHistoryItem) => {
        // Filtre par recherche
        if (searchTerm.trim()) {
            const searchLower = searchTerm.toLowerCase()
            const action = item.action?.toLowerCase() || ''
            const details = item.details?.toLowerCase() || ''
            const adminName = item.adminName?.toLowerCase() || ''

            if (!action.includes(searchLower) && !details.includes(searchLower) && !adminName.includes(searchLower)) {
                return false
            }
        }

        // Filtre par action
        if (actionFilters.size > 0 && !actionFilters.has(item.action)) {
            return false
        }

        // Filtre par type de cible
        if (targetTypeFilters.size > 0 && !targetTypeFilters.has(item.targetType)) {
            return false
        }

        return true
    })

    // Gestion des filtres par action
    const handleActionFilter = (action: string, checked: boolean) => {
        const newActionFilters = new Set(actionFilters)
        if (checked) {
            newActionFilters.add(action)
        } else {
            newActionFilters.delete(action)
        }
        setActionFilters(newActionFilters)
    }

    // Gestion des filtres par type de cible
    const handleTargetTypeFilter = (targetType: string, checked: boolean) => {
        const newTargetTypeFilters = new Set(targetTypeFilters)
        if (checked) {
            newTargetTypeFilters.add(targetType)
        } else {
            newTargetTypeFilters.delete(targetType)
        }
        setTargetTypeFilters(newTargetTypeFilters)
    }

    // Obtenir l'icône selon le type d'action
    const getActionIcon = (action: string) => {
        switch (action.toLowerCase()) {
            case 'create':
            case 'créer':
                return <UserPlus className="h-4 w-4 text-green-600" />
            case 'delete':
            case 'supprimer':
                return <Trash2 className="h-4 w-4 text-red-600" />
            case 'update':
            case 'modifier':
                return <Edit className="h-4 w-4 text-blue-600" />
            case 'view':
            case 'voir':
                return <Eye className="h-4 w-4 text-gray-600" />
            case 'login':
            case 'connexion':
                return <Shield className="h-4 w-4 text-purple-600" />
            default:
                return <Activity className="h-4 w-4 text-gray-600" />
        }
    }

    // Formater la date
    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    // Formater la date complète
    // const formatFullDate = (dateString: string) => {
    //     const date = new Date(dateString)
    //     return date.toLocaleString('fr-FR', {
    //         weekday: 'long',
    //         day: '2-digit',
    //         month: 'long',
    //         year: 'numeric',
    //         hour: '2-digit',
    //         minute: '2-digit',
    //         second: '2-digit'
    //     })
    // }

    // Ouvrir le dialog de détails
    const handleShowDetails = (action: AdminActionHistoryItem) => {
        setSelectedAction(action)
        setIsDetailDialogOpen(true)
    }

    // Gestion du scroll pour charger plus d'éléments
    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const { scrollTop, scrollHeight, clientHeight } = e.currentTarget

        // Éviter les calculs si pas de scroll possible
        if (scrollHeight <= clientHeight) return

        const scrollPercentage = (scrollTop + clientHeight) / scrollHeight

        // Charger plus d'éléments quand on atteint 80% du scroll
        if (scrollPercentage > 0.8 && hasMore && !loading) {
            console.log('Chargement de plus d\'éléments...', { scrollPercentage, hasMore, loading })
            fetchHistory()
        }
    }

    // Obtenir les actions uniques pour les filtres
    const uniqueActions = Array.from(new Set(allHistory.map(item => item.action)))
    const uniqueTargetTypes = Array.from(new Set(allHistory.map(item => item.targetType)))

    return (
        <>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    {children}
                </PopoverTrigger>
                <PopoverContent className="w-[95vw] max-w-[600px] max-h-[80vh] overflow-hidden sm:w-[600px]" align="end">
                    <div className="space-y-3 sm:space-y-4">
                        {/* Header */}
                        <div className="flex items-center gap-2 border-b pb-2 sm:pb-3">
                            <Activity className="h-4 w-4 sm:h-5 sm:w-5" />
                            <h3 className="font-semibold text-sm sm:text-base">Historique des actions</h3>
                        </div>

                        {/* Barre de recherche et filtres */}
                        <div className="flex flex-col gap-2 sm:gap-3">
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Search className="h-4 w-4 text-gray-400" />
                                </div>
                                <Input
                                    type="text"
                                    placeholder="Rechercher dans l'historique..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 text-sm"
                                />
                            </div>

                            <div className="flex flex-col gap-2 sm:flex-row sm:gap-2">
                                {/* Filtre par action */}
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline" size="sm" className="whitespace-nowrap text-xs sm:text-sm">
                                            <Filter className="h-3 w-3 mr-1" />
                                            Actions
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-48">
                                        {uniqueActions.map((action) => (
                                            <DropdownMenuCheckboxItem
                                                key={action}
                                                checked={actionFilters.has(action)}
                                                onCheckedChange={(checked) => handleActionFilter(action, checked)}
                                            >
                                                {action}
                                            </DropdownMenuCheckboxItem>
                                        ))}
                                    </DropdownMenuContent>
                                </DropdownMenu>

                                {/* Filtre par type de cible */}
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline" size="sm" className="whitespace-nowrap text-xs sm:text-sm">
                                            <FileText className="h-3 w-3 mr-1" />
                                            Types
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-48">
                                        {uniqueTargetTypes.map((targetType) => (
                                            <DropdownMenuCheckboxItem
                                                key={targetType}
                                                checked={targetTypeFilters.has(targetType)}
                                                onCheckedChange={(checked) => handleTargetTypeFilter(targetType, checked)}
                                            >
                                                {targetType}
                                            </DropdownMenuCheckboxItem>
                                        ))}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>

                        {/* Résultats de recherche */}
                        {(searchTerm || actionFilters.size > 0 || targetTypeFilters.size > 0) && (
                            <p className="text-xs text-gray-500">
                                {filteredHistory.length} action(s) trouvée(s)
                                {searchTerm && ` pour "${searchTerm}"`}
                                {actionFilters.size > 0 && ` • ${actionFilters.size} action(s) sélectionnée(s)`}
                                {targetTypeFilters.size > 0 && ` • ${targetTypeFilters.size} type(s) sélectionné(s)`}
                            </p>
                        )}

                        {/* Tableau de l'historique - Version mobile avec cartes */}
                        <div
                            className="max-h-[50vh] sm:max-h-[400px] overflow-auto border rounded-lg"
                            onScroll={handleScroll}
                        >
                            {loading && allHistory.length === 0 ? (
                                <div className="flex items-center justify-center h-32">
                                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                                </div>
                            ) : (
                                <>
                                    {/* Version desktop - Tableau */}
                                    <div className="hidden sm:block">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead className="text-xs">Action</TableHead>
                                                    <TableHead className="text-xs">Admin</TableHead>
                                                    <TableHead className="text-xs">Type</TableHead>
                                                    <TableHead className="text-xs">Détails</TableHead>
                                                    <TableHead className="text-xs">Date</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {filteredHistory.length > 0 ? (
                                                    filteredHistory.map((item: AdminActionHistoryItem) => (
                                                        <TableRow key={item._id}>
                                                            <TableCell className="text-xs">
                                                                <div className="flex items-center gap-1">
                                                                    {getActionIcon(item.action)}
                                                                    <span className="font-medium">{item.action}</span>
                                                                </div>
                                                            </TableCell>
                                                            <TableCell className="text-xs">
                                                                <div className="flex items-center gap-1">
                                                                    <User className="h-3 w-3 text-gray-500" />
                                                                    <span>{item.adminName}</span>
                                                                </div>
                                                            </TableCell>
                                                            <TableCell className="text-xs">
                                                                <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                                                    {item.targetType}
                                                                </span>
                                                            </TableCell>
                                                            <TableCell className="text-xs max-w-[150px]">
                                                                <div className="flex items-center justify-between">
                                                                    <span className="truncate">{item.details}</span>
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        className="h-6 w-6 p-0 ml-1"
                                                                        onClick={() => handleShowDetails(item)}
                                                                    >
                                                                        <ExternalLink className="h-3 w-3" />
                                                                    </Button>
                                                                </div>
                                                            </TableCell>
                                                            <TableCell className="text-xs">
                                                                <div className="flex items-center gap-1">
                                                                    <Clock className="h-3 w-3 text-gray-500" />
                                                                    <span>{formatDate(item.timestamp)}</span>
                                                                </div>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))
                                                ) : (
                                                    <TableRow>
                                                        <TableCell colSpan={5} className="text-center py-8 text-gray-500 text-xs">
                                                            Aucune action trouvée
                                                        </TableCell>
                                                    </TableRow>
                                                )}
                                            </TableBody>
                                        </Table>
                                    </div>

                                    {/* Version mobile - Cartes */}
                                    <div className="sm:hidden space-y-2 p-2">
                                        {filteredHistory.length > 0 ? (
                                            filteredHistory.map((item: AdminActionHistoryItem) => (
                                                <div key={item._id} className="border rounded-lg p-3 space-y-2">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-2">
                                                            {getActionIcon(item.action)}
                                                            <span className="font-medium text-sm">{item.action}</span>
                                                        </div>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="h-6 w-6 p-0"
                                                            onClick={() => handleShowDetails(item)}
                                                        >
                                                            <ExternalLink className="h-3 w-3" />
                                                        </Button>
                                                    </div>

                                                    <div className="flex items-center gap-2 text-xs text-gray-600">
                                                        <User className="h-3 w-3" />
                                                        <span>{item.adminName}</span>
                                                    </div>

                                                    <div className="flex items-center gap-2">
                                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                                            {item.targetType}
                                                        </span>
                                                    </div>

                                                    <div className="text-xs text-gray-600">
                                                        <p className="line-clamp-2">{item.details}</p>
                                                    </div>

                                                    <div className="flex items-center gap-1 text-xs text-gray-500">
                                                        <Clock className="h-3 w-3" />
                                                        <span>{formatDate(item.timestamp)}</span>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-center py-8 text-gray-500 text-xs">
                                                Aucune action trouvée
                                            </div>
                                        )}
                                    </div>

                                    {/* Indicateur de chargement pour les pages suivantes */}
                                    {loading && allHistory.length > 0 && (
                                        <div className="flex items-center justify-center py-4 border-t">
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                                            <span className="text-xs text-gray-500">Chargement...</span>
                                        </div>
                                    )}

                                    {/* Message "Plus de données" */}
                                    {!hasMore && allHistory.length > 0 && (
                                        <div className="text-center py-4 border-t">
                                            <span className="text-xs text-gray-500">Toutes les actions ont été chargées</span>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>

                        {/* Statistiques */}
                        {history && (
                            <div className="text-xs text-gray-500 text-center border-t pt-2">
                                Affichage de {filteredHistory.length} action(s) sur {history.pagination.totalItems} total
                            </div>
                        )}
                    </div>
                </PopoverContent>
            </Popover>

            {/* Dialog de détails de l'action */}
            <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
                <DialogContent className="w-[95vw] max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-sm sm:text-base">
                            {selectedAction && getActionIcon(selectedAction.action)}
                            <span>Détails de l&apos;action</span>
                        </DialogTitle>
                    </DialogHeader>

                    {selectedAction && (
                        <div className="space-y-4 sm:space-y-6">
                            {/* Informations générales */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs sm:text-sm font-medium text-gray-500">Action</label>
                                    <div className="flex items-center gap-2">
                                        {getActionIcon(selectedAction.action)}
                                        <span className="font-medium text-sm sm:text-base">{selectedAction.action}</span>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs sm:text-sm font-medium text-gray-500">Type de cible</label>
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                        {selectedAction.targetType}
                                    </span>
                                </div>
                            </div>

                            {/* Administrateur */}
                            <div className="space-y-2">
                                <label className="text-xs sm:text-sm font-medium text-gray-500">Administrateur</label>
                                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                                    <User className="h-4 w-4 text-gray-500" />
                                    <span className="text-sm sm:text-base">{selectedAction.adminName}</span>
                                </div>
                            </div>

                            {/* Détails complets */}
                            <div className="space-y-2">
                                <label className="text-xs sm:text-sm font-medium text-gray-500">Détails complets</label>
                                <div className="p-3 bg-gray-50 rounded-lg">
                                    <p className="text-xs sm:text-sm whitespace-pre-wrap">{selectedAction.details}</p>
                                </div>
                            </div>

                            {/* Informations techniques */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs sm:text-sm font-medium text-gray-500">ID de l&apos;action</label>
                                    <div className="p-2 bg-gray-50 rounded text-xs font-mono break-all">
                                        {selectedAction._id}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </>
    )
} 