'use client'

import React, { useEffect, useState } from 'react'
import { getUser, getUsers } from '@/lib/functions'
import { backendHelper } from '@/lib/backend-helper'
import { toast } from 'sonner'
import { User } from '@/lib/types'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { MetricCard } from '@/components/ui/metric-card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import CreateUserDialog from '@/app/components/CreateUserDialog'
import AdminActionsHistory from '@/app/components/AdminActionsHistory'
import UserAvatar from '@/app/components/UserAvatar'
import AuthGuard from '@/app/components/AuthGuard'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
    DropdownMenuCheckboxItem,
    DropdownMenuItem,
    DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Sidebar } from '@/components/ui/sidebar'
import {
    TrendingUp,
    Users,
    Hexagon,
    MoreHorizontal,
    Edit,
    Trash2,
    UserCheck,
    UserX,
    ArrowUp,
    ArrowDown,
    Activity,
    Menu
} from 'lucide-react'

// Animations variants
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            duration: 0.6,
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

const tableRowVariants = {
    hidden: {
        opacity: 0,
        x: -20,
        scale: 0.98
    },
    visible: {
        opacity: 1,
        x: 0,
        scale: 1,
        transition: {
            duration: 0.4
        }
    }
}

const headerVariants = {
    hidden: {
        opacity: 0,
        y: -20
    },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6
        }
    }
}

const searchBarVariants = {
    hidden: {
        opacity: 0,
        y: 10,
        scale: 0.98
    },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            duration: 0.5,
            delay: 0.2
        }
    }
}

export default function Page() {
    const [user, setUser] = useState<User | null>(null);
    const [users, setUsers] = useState<User[]>([]);
    const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
    const [selectAll, setSelectAll] = useState(false);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [roleFilters, setRoleFilters] = useState<Set<string>>(new Set(['admin', 'user']));
    const [statusFilters, setStatusFilters] = useState<Set<string>>(new Set(['actif', 'inactif']));
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [editFormData, setEditFormData] = useState({
        nom: '',
        email: '',
        role: '',
        actif: false
    });
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [historyRefreshTrigger, setHistoryRefreshTrigger] = useState(0);
    const [dataRefreshTrigger, setDataRefreshTrigger] = useState(0);
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc'); // desc = plus récent en premier
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isPageLoaded, setIsPageLoaded] = useState(false);

    useEffect(() => {
        getUser()
            .then((res) => {
                setUser(res as User | null);
            })
            .catch((err) => {
                toast.error(err.message);
                setUser(null);
            });

        getUsers()
            .then((res) => {
                setUsers(res || []);
                setIsPageLoaded(true);
            })
            .catch((err) => {
                toast.error(err.message);
                setUsers([]);
                setIsPageLoaded(true);
            });
    }, [dataRefreshTrigger]);

    // Gestion de la sélection individuelle d'un utilisateur
    const handleUserSelect = (userId: string) => {
        const newSelectedUsers = new Set(selectedUsers);
        if (newSelectedUsers.has(userId)) {
            newSelectedUsers.delete(userId);
        } else {
            newSelectedUsers.add(userId);
        }
        setSelectedUsers(newSelectedUsers);

        // Mettre à jour l'état "sélectionner tout"
        if (filteredUsers && newSelectedUsers.size === filteredUsers.length) {
            setSelectAll(true);
        } else {
            setSelectAll(false);
        }
    };

    // Gestion de la sélection de tous les utilisateurs
    const handleSelectAll = (checked: boolean) => {
        setSelectAll(checked);
        if (checked && filteredUsers) {
            const allUserIds = filteredUsers.map((u: User) => u._id);
            setSelectedUsers(new Set(allUserIds));
        } else {
            setSelectedUsers(new Set());
        }
    };

    // Vérifier si un utilisateur est sélectionné
    const isUserSelected = (userId: string) => {
        return selectedUsers.has(userId);
    };

    // Filtrer les utilisateurs selon le terme de recherche, rôle et statut
    const filteredUsers = users && users.length > 0 ? users.filter((u: User) => {
        // Filtre par recherche
        if (searchTerm.trim()) {
            const searchLower = searchTerm.toLowerCase();
            const nom = u.nom ? u.nom.toLowerCase() : '';
            const email = u.email ? u.email.toLowerCase() : '';

            if (!nom.includes(searchLower) && !email.includes(searchLower)) {
                return false;
            }
        }

        // Filtre par rôle
        if (!roleFilters.has(u.role)) {
            return false;
        }

        // Filtre par statut
        const status = u.actif ? 'actif' : 'inactif';
        if (!statusFilters.has(status)) {
            return false;
        }

        return true;
    }).sort((a: User, b: User) => {
        // Tri par date de création (du plus récent au plus ancien par défaut)
        const dateA = new Date(a.createdAt || 0);
        const dateB = new Date(b.createdAt || 0);

        if (sortOrder === 'desc') {
            return dateB.getTime() - dateA.getTime(); // Plus récent en premier
        } else {
            return dateA.getTime() - dateB.getTime(); // Plus ancien en premier
        }
    }) : [];

    // Gestion des filtres par rôle
    const handleRoleFilter = (role: string, checked: boolean) => {
        const newRoleFilters = new Set(roleFilters);
        if (checked) {
            newRoleFilters.add(role);
        } else {
            newRoleFilters.delete(role);
        }
        setRoleFilters(newRoleFilters);
    };

    // Gestion des filtres par statut
    const handleStatusFilter = (status: string, checked: boolean) => {
        const newStatusFilters = new Set(statusFilters);
        if (checked) {
            newStatusFilters.add(status);
        } else {
            newStatusFilters.delete(status);
        }
        setStatusFilters(newStatusFilters);
    };

    // Gestion du tri
    const handleSortToggle = () => {
        setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    };

    // Fonction pour obtenir l'icône de tri
    const getSortIcon = () => {
        if (sortOrder === 'asc') {
            return <ArrowUp className="h-4 w-4" />;
        } else {
            return <ArrowDown className="h-4 w-4" />;
        }
    };

    // Logique de pagination
    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

    // Réinitialiser la page courante quand les filtres changent
    React.useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, roleFilters, statusFilters, sortOrder]);

    // Générer les numéros de page à afficher
    const getPageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5;

        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            if (currentPage <= 3) {
                for (let i = 1; i <= 4; i++) {
                    pages.push(i);
                }
                pages.push('ellipsis');
                pages.push(totalPages);
            } else if (currentPage >= totalPages - 2) {
                pages.push(1);
                pages.push('ellipsis');
                for (let i = totalPages - 3; i <= totalPages; i++) {
                    pages.push(i);
                }
            } else {
                pages.push(1);
                pages.push('ellipsis');
                for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                    pages.push(i);
                }
                pages.push('ellipsis');
                pages.push(totalPages);
            }
        }

        return pages;
    };

    // Fonctions pour les actions sur les utilisateurs
    const handleEditUser = (user: User) => {
        setEditingUser(user);
        setEditFormData({
            nom: user.nom || '',
            email: user.email || '',
            role: user.role || '',
            actif: user.actif || false
        });
        setIsEditDialogOpen(true);
    };

    const handleDeleteUser = async (user: User) => {
        if (confirm(`Êtes-vous sûr de vouloir supprimer l'utilisateur ${user.nom} ?`)) {
            try {
                // Vérifier que l'userId existe
                if (!user._id) {
                    toast.error('ID utilisateur manquant', { icon: '❌' });
                    return;
                }

                await backendHelper.deleteUser(user._id);
                const updatedUsers = await getUsers();
                setUsers(updatedUsers || []);
                // Rafraîchir l'historique des actions
                setHistoryRefreshTrigger(prev => prev + 1);
            } catch (error: unknown) {
                console.error('Erreur lors de la suppression:', error);
            }
        }
    };

    const handleToggleStatus = async (user: User) => {
        try {
            // Vérifier que l'userId existe
            if (!user._id) {
                toast.error('ID utilisateur manquant', { icon: '❌' });
                return;
            }

            const updatedUser = {
                ...user,
                actif: !user.actif
            };

            await backendHelper.userUpdate(updatedUser);

            // Recharger la liste des utilisateurs après mise à jour
            const updatedUsers = await getUsers();
            setUsers(updatedUsers || []);
            // Rafraîchir l'historique des actions
            setHistoryRefreshTrigger(prev => prev + 1);
        } catch (error: unknown) {
            console.error('Erreur lors du changement de statut:', error);
        }
    };

    // Gestion des changements dans le formulaire de modification
    const handleEditFormChange = (field: string, value: string | boolean) => {
        setEditFormData(prev => ({ ...prev, [field]: value }));
    };

    // Soumission du formulaire de modification
    const handleEditSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            if (!editingUser?._id) {
                toast.error('ID utilisateur manquant', { icon: '❌' });
                return;
            }

            // Vérifier s'il y a des changements de rôle
            const roleChanged = editingUser.role !== editFormData.role;
            const isCurrentUser = editingUser._id === user?._id;

            // Message de confirmation personnalisé
            let confirmMessage = `Êtes-vous sûr de vouloir modifier l'utilisateur ${editingUser.nom} ?`;

            if (isCurrentUser && roleChanged) {
                const newRole = editFormData.role === 'admin' ? 'administrateur' : 'utilisateur';
                confirmMessage = `Vous êtes sur le point de changer votre rôle en ${newRole}. Cela modifiera vos permissions. Êtes-vous sûr de vouloir continuer ?`;
            } else if (roleChanged) {
                const newRole = editFormData.role === 'admin' ? 'administrateur' : 'utilisateur';
                confirmMessage = `Vous êtes sur le point de changer le rôle de ${editingUser.nom} en ${newRole}. Êtes-vous sûr de vouloir continuer ?`;
            }

            // Demander confirmation
            if (!confirm(confirmMessage)) {
                return;
            }

            // Créer l'objet utilisateur mis à jour
            const updatedUser = {
                ...editingUser,
                ...editFormData
            };

            await backendHelper.userUpdate(updatedUser);

            // Recharger la liste des utilisateurs après mise à jour
            const updatedUsers = await getUsers();
            setUsers(updatedUsers || []);

            // Si l'utilisateur modifié est l'utilisateur connecté, recharger ses informations
            if (editingUser._id === user?._id) {
                const updatedCurrentUser = await getUser();
                setUser(updatedCurrentUser as User | null);
            }

            // Fermer le dialog
            setIsEditDialogOpen(false);
            setEditingUser(null);
            // Rafraîchir l'historique des actions
            setHistoryRefreshTrigger(prev => prev + 1);

        } catch (error: unknown) {
            console.error('Erreur lors de la modification:', error);
            // L'erreur est déjà gérée par le backendHelper avec toast
        }
    };

    // Gestion de la création d'utilisateur
    const handleUserCreated = async () => {
        setIsCreateDialogOpen(false);
        setHistoryRefreshTrigger(prev => prev + 1);
        setDataRefreshTrigger(prev => prev + 1);
    };

    // Fonction pour déclencher le rafraîchissement des données
    const triggerDataRefresh = () => {
        setDataRefreshTrigger(prev => prev + 1);
    };

    // const tabs = [
    //     { id: 'overview', label: 'Overview', icon: <Hexagon size={16} /> },
    //     { id: 'analytics', label: 'Analytics', icon: <Eye size={16} /> },
    //     { id: 'reports', label: 'Reports', icon: <FileText size={16} /> },
    //     { id: 'notifications', label: 'Notifications', icon: <Bell size={16} /> },
    // ];

    const metrics = [
        {
            title: "Total utilisateurs",
            value: Array.isArray(users) ? users.length.toString() : "0",
            change: `${filteredUsers.length} actifs`,
            changeType: "increase" as const,
            icon: <Users size={16} className="text-blue-500" />,
            timeframe: "Tous les utilisateurs"
        },
        {
            title: "Utilisateurs actifs",
            value: Array.isArray(users) ? users.filter((u: User) => u.actif).length.toString() : "0",
            change: Array.isArray(users) ? `${users.filter((u: User) => !u.actif).length} inactifs` : "0 inactifs",
            changeType: "increase" as const,
            icon: <UserCheck size={16} className="text-green-500" />,
            timeframe: "Utilisateurs actifs"
        },
        {
            title: "Administrateurs",
            value: Array.isArray(users) ? users.filter((u: User) => u.role === 'admin').length.toString() : "0",
            change: Array.isArray(users) ? `${users.filter((u: User) => u.role === 'user').length} utilisateurs` : "0 utilisateurs",
            changeType: "increase" as const,
            icon: <Hexagon size={16} className="text-purple-500" />,
            timeframe: "Administrateurs"
        },
        {
            title: "Nouveaux utilisateurs",
            value: Array.isArray(users) ? users.filter((u: User) => {
                const createdAt = new Date(u.createdAt);
                const oneWeekAgo = new Date();
                oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
                return createdAt >= oneWeekAgo;
            }).length.toString() : "0",
            change: "Cette semaine",
            changeType: "increase" as const,
            icon: <TrendingUp size={16} className="text-green-500" />
        }
    ];

    return (
        <AuthGuard>
            <div className="flex h-screen bg-gray-50">
                {/* Sidebar Desktop */}
                <div className="hidden md:block">
                    <Sidebar />
                </div>

                {/* Mobile sidebar with animation */}
                <AnimatePresence>
                    {sidebarOpen && (
                        <motion.div
                            initial={{ x: -256 }}
                            animate={{ x: 0 }}
                            exit={{ x: -256 }}
                            transition={{
                                type: "spring",
                                damping: 25,
                                stiffness: 200,
                                duration: 0.3
                            }}
                            className="fixed left-0 top-0 h-full w-64 z-50 md:hidden"
                        >
                            <Sidebar
                                isMobile={true}
                                onClose={() => setSidebarOpen(false)}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Main content */}
                <div className="flex-1 flex flex-col overflow-hidden">
                    {/* Header */}
                    <motion.header
                        className="bg-white border-b border-gray-200 px-4 py-3"
                        variants={headerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setSidebarOpen(true)}
                                    className="md:hidden"
                                >
                                    <Menu size={20} />
                                </Button>
                                <h1 className="text-xl md:text-3xl font-bold text-gray-900">
                                    Tableau de bord - {user?.nom}
                                </h1>
                            </div>
                            <div className="flex items-center space-x-2 md:space-x-3">
                                {user?.role === 'admin' && (
                                    <AdminActionsHistory
                                        adminId={user?._id || ''}
                                        refreshTrigger={historyRefreshTrigger}
                                    >
                                        <Button className="bg-blue-600 hover:bg-blue-700 text-xs md:text-sm">
                                            <Activity size={16} className="mr-1 md:mr-2" />
                                            <span className="hidden sm:inline">Historique des actions</span>
                                            <span className="sm:hidden">Historique</span>
                                        </Button>
                                    </AdminActionsHistory>
                                )}
                                <UserAvatar size="md" onDataUpdate={triggerDataRefresh} />
                            </div>
                        </div>
                    </motion.header>

                    {/* Main content area */}
                    <main className="flex-1 overflow-auto p-4 md:p-6 space-y-6">
                        {/* Metrics Cards */}
                        <motion.div
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
                            variants={containerVariants}
                            initial="hidden"
                            animate={isPageLoaded ? "visible" : "hidden"}
                        >
                            {metrics.map((metric, index) => (
                                <motion.div
                                    key={index}
                                    variants={itemVariants}
                                    whileHover={{
                                        scale: 1.02,
                                        transition: { duration: 0.2 }
                                    }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <MetricCard
                                        title={metric.title}
                                        value={metric.value}
                                        change={metric.change}
                                        changeType={metric.changeType}
                                        icon={metric.icon}
                                        timeframe={metric.timeframe}
                                    />
                                </motion.div>
                            ))}
                        </motion.div>

                        {/* Users Table */}
                        <motion.div
                            className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
                            variants={itemVariants}
                            initial="hidden"
                            animate={isPageLoaded ? "visible" : "hidden"}
                            transition={{ delay: 0.3 }}
                        >
                            <div className="p-6 border-b border-gray-200">
                                <motion.div
                                    className="flex items-center justify-between"
                                    variants={headerVariants}
                                    initial="hidden"
                                    animate="visible"
                                >
                                    <div>
                                        <h2 className="text-xl font-semibold text-gray-900">Liste des utilisateurs</h2>
                                        <p className="text-sm text-gray-500 mt-1">Gérez tous les utilisateurs de votre plateforme</p>
                                    </div>
                                    {selectedUsers.size > 0 && (
                                        <motion.div
                                            className="text-sm text-gray-600"
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            {selectedUsers.size} utilisateur(s) sélectionné(s)
                                        </motion.div>
                                    )}
                                </motion.div>

                                {/* Barre de recherche et filtres */}
                                <motion.div
                                    className="mt-4 space-y-4"
                                    variants={searchBarVariants}
                                    initial="hidden"
                                    animate="visible"
                                >
                                    <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                                        <div className="relative flex-1 max-w-md w-full sm:w-auto">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                                </svg>
                                            </div>
                                            <Input
                                                type="text"
                                                placeholder="Rechercher par nom ou email..."
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                className="pl-10 w-full"
                                            />
                                        </div>

                                        <div className="flex flex-wrap gap-2">
                                            {/* Bouton créer un utilisateur */}
                                            {user?.role === 'admin' && (
                                                <motion.div
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                >
                                                    <Button
                                                        onClick={() => setIsCreateDialogOpen(true)}
                                                        className="bg-green-600 hover:bg-green-700 whitespace-nowrap"
                                                    >
                                                        <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                                        </svg>
                                                        Créer un utilisateur
                                                    </Button>
                                                </motion.div>
                                            )}

                                            {/* Filtre par rôle */}
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="outline" className="whitespace-nowrap">
                                                        <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                                                        </svg>
                                                        Rôles
                                                        <svg className="h-4 w-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                        </svg>
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-48">
                                                    <DropdownMenuCheckboxItem
                                                        checked={roleFilters.has('admin')}
                                                        onCheckedChange={(checked) => handleRoleFilter('admin', checked)}
                                                    >
                                                        Admin
                                                    </DropdownMenuCheckboxItem>
                                                    <DropdownMenuCheckboxItem
                                                        checked={roleFilters.has('user')}
                                                        onCheckedChange={(checked) => handleRoleFilter('user', checked)}
                                                    >
                                                        Utilisateur
                                                    </DropdownMenuCheckboxItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>

                                            {/* Filtre par statut */}
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="outline" className="whitespace-nowrap">
                                                        <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                        Statut
                                                        <svg className="h-4 w-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                        </svg>
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-48">
                                                    <DropdownMenuCheckboxItem
                                                        checked={statusFilters.has('actif')}
                                                        onCheckedChange={(checked) => handleStatusFilter('actif', checked)}
                                                    >
                                                        Actif
                                                    </DropdownMenuCheckboxItem>
                                                    <DropdownMenuCheckboxItem
                                                        checked={statusFilters.has('inactif')}
                                                        onCheckedChange={(checked) => handleStatusFilter('inactif', checked)}
                                                    >
                                                        Inactif
                                                    </DropdownMenuCheckboxItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </div>

                                    {(searchTerm || roleFilters.size < 2 || statusFilters.size < 2) && (
                                        <motion.p
                                            className="text-sm text-gray-500"
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            {filteredUsers.length} résultat(s) trouvé(s)
                                            {searchTerm && ` pour "${searchTerm}"`}
                                            {roleFilters.size < 2 && ` • ${roleFilters.size} rôle(s) sélectionné(s)`}
                                            {statusFilters.size < 2 && ` • ${statusFilters.size} statut sélectionné(s)`}
                                        </motion.p>
                                    )}
                                </motion.div>
                            </div>
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-12">
                                                <Checkbox
                                                    checked={selectAll}
                                                    onCheckedChange={handleSelectAll}
                                                    aria-label="Sélectionner tous les utilisateurs"
                                                />
                                            </TableHead>
                                            <TableHead>
                                                <div className="flex items-center">
                                                    ID
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={handleSortToggle}
                                                        className="ml-2"
                                                    >
                                                        {getSortIcon()}
                                                    </Button>
                                                </div>
                                            </TableHead>
                                            <TableHead>Nom</TableHead>
                                            <TableHead>Email</TableHead>
                                            <TableHead>Rôle</TableHead>
                                            <TableHead>Date de création</TableHead>
                                            <TableHead>Statut</TableHead>
                                            {/* <TableHead className="w-12">Actions</TableHead> */}

                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        <AnimatePresence mode="wait">
                                            {paginatedUsers && paginatedUsers.length > 0 ? (
                                                paginatedUsers.map((u: User, index: number) => {
                                                    const userId = u._id;
                                                    return (
                                                        <motion.tr
                                                            key={userId}
                                                            variants={tableRowVariants}
                                                            initial="hidden"
                                                            animate="visible"
                                                            exit="hidden"
                                                            transition={{
                                                                duration: 0.4,
                                                                delay: index * 0.05,
                                                                ease: "easeOut"
                                                            }}
                                                            whileHover={{
                                                                backgroundColor: "rgba(0, 0, 0, 0.02)",
                                                                transition: { duration: 0.2 }
                                                            }}
                                                            className="border-b"
                                                        >
                                                            <TableCell>
                                                                <Checkbox
                                                                    checked={isUserSelected(userId)}
                                                                    onCheckedChange={() => handleUserSelect(userId)}
                                                                    aria-label={`Sélectionner ${u.nom}`}
                                                                />
                                                            </TableCell>
                                                            <TableCell className="font-mono text-sm">{u._id}</TableCell>
                                                            <TableCell className="font-medium">{u.nom}</TableCell>
                                                            <TableCell>{u.email}</TableCell>
                                                            <TableCell>
                                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${u.role === 'admin'
                                                                    ? 'bg-yellow-100 text-yellow-800'
                                                                    : 'bg-blue-100 text-blue-800'
                                                                    }`}>
                                                                    {u.role}
                                                                </span>
                                                            </TableCell>
                                                            <TableCell>
                                                                {u.createdAt ? new Date(u.createdAt).toLocaleDateString('fr-FR') : '-'}
                                                            </TableCell>
                                                            <TableCell>
                                                                {u.actif ? (
                                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                                        actif
                                                                    </span>
                                                                ) : (
                                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                                        inactif
                                                                    </span>
                                                                )}
                                                            </TableCell>
                                                            <TableCell>
                                                                {user?.role === 'admin' && (
                                                                    <DropdownMenu>
                                                                        <DropdownMenuTrigger asChild>
                                                                            <Button variant="ghost" className="h-8 w-8 p-0">
                                                                                <span className="sr-only">Ouvrir le menu</span>
                                                                                <MoreHorizontal className="h-4 w-4" />
                                                                            </Button>
                                                                        </DropdownMenuTrigger>
                                                                        <DropdownMenuContent align="end">
                                                                            <DropdownMenuItem onClick={() => handleEditUser(u)}>
                                                                                <Edit className="mr-2 h-4 w-4" />
                                                                                Modifier
                                                                            </DropdownMenuItem>
                                                                            <DropdownMenuSeparator />
                                                                            <DropdownMenuItem onClick={() => handleToggleStatus(u)}>
                                                                                {u.actif ? (
                                                                                    <>
                                                                                        <UserX className="mr-2 h-4 w-4" />
                                                                                        Désactiver
                                                                                    </>
                                                                                ) : (
                                                                                    <>
                                                                                        <UserCheck className="mr-2 h-4 w-4" />
                                                                                        Activer
                                                                                    </>
                                                                                )}
                                                                            </DropdownMenuItem>
                                                                            <DropdownMenuItem
                                                                                onClick={() => handleDeleteUser(u)}
                                                                                className="text-red-600 bg-red-100 focus:text-red-600"
                                                                            >
                                                                                <Trash2 className="mr-2 text-red-600 h-4 w-4" />
                                                                                Supprimer
                                                                            </DropdownMenuItem>
                                                                        </DropdownMenuContent>
                                                                    </DropdownMenu>
                                                                )}
                                                            </TableCell>
                                                        </motion.tr>
                                                    );
                                                })
                                            ) : (
                                                <motion.tr
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ duration: 0.5 }}
                                                >
                                                    <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                                                        Aucun utilisateur trouvé.
                                                    </TableCell>
                                                </motion.tr>
                                            )}
                                        </AnimatePresence>
                                    </TableBody>
                                </Table>
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <motion.div
                                    className="px-6 py-4 border-t border-gray-200"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: 0.2 }}
                                >
                                    <div className="flex items-center justify-end">
                                        <div className="flex items-center gap-4">
                                            <div className="text-sm justify-center items-center flex w-30 h-10 text-gray-500">
                                                {startIndex + 1} à {Math.min(endIndex, filteredUsers.length)} / {filteredUsers.length}
                                            </div>
                                            <Pagination>
                                                <PaginationContent>
                                                    <PaginationItem>
                                                        <PaginationPrevious
                                                            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                                            className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                                                        />
                                                    </PaginationItem>

                                                    {getPageNumbers().map((page, index) => (
                                                        <PaginationItem key={index}>
                                                            {page === 'ellipsis' ? (
                                                                <PaginationEllipsis />
                                                            ) : (
                                                                <PaginationLink
                                                                    isActive={currentPage === page}
                                                                    onClick={() => setCurrentPage(page as number)}
                                                                    className="cursor-pointer"
                                                                >
                                                                    {page}
                                                                </PaginationLink>
                                                            )}
                                                        </PaginationItem>
                                                    ))}

                                                    <PaginationItem>
                                                        <PaginationNext
                                                            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                                            className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                                                        />
                                                    </PaginationItem>
                                                </PaginationContent>
                                            </Pagination>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </motion.div>

                        {/* Dialog de modification d'utilisateur */}
                        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                            <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                    <DialogTitle>Modifier l&apos;utilisateur</DialogTitle>
                                    <p className="text-sm text-muted-foreground">
                                        Modifiez les informations de {editingUser?.nom}
                                    </p>
                                </DialogHeader>
                                <form onSubmit={handleEditSubmit} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="nom">Nom</Label>
                                        <Input
                                            id="nom"
                                            value={editFormData.nom}
                                            onChange={(e) => handleEditFormChange('nom', e.target.value)}
                                            placeholder="Nom de l'utilisateur"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={editFormData.email}
                                            onChange={(e) => handleEditFormChange('email', e.target.value)}
                                            placeholder="email@exemple.com"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="role">Rôle</Label>
                                        <select
                                            id="role"
                                            value={editFormData.role}
                                            onChange={(e) => handleEditFormChange('role', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="">Sélectionner un rôle</option>
                                            <option value="user">Utilisateur</option>
                                            <option value="admin">Admin</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="actif">Statut</Label>
                                        <select
                                            id="actif"
                                            value={editFormData.actif ? 'actif' : 'inactif'}
                                            onChange={(e) => handleEditFormChange('actif', e.target.value === 'actif')}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="actif">Actif</option>
                                            <option value="inactif">Inactif</option>
                                        </select>
                                    </div>
                                    <DialogFooter>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => setIsEditDialogOpen(false)}
                                        >
                                            Annuler
                                        </Button>
                                        <Button type="submit">
                                            Enregistrer
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>

                        {/* Dialog de création d'utilisateur */}
                        <CreateUserDialog
                            isOpen={isCreateDialogOpen}
                            onClose={() => setIsCreateDialogOpen(false)}
                            onUserCreated={handleUserCreated}
                        />
                    </main>
                </div>
            </div>
        </AuthGuard>
    )
}