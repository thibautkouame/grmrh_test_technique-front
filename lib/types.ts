// Shared type definitions for the application

export interface User {
    _id: string;
    nom: string;
    email: string;
    role: string;
    actif: boolean;
    createdAt: string;
    avatar?: string;
}

export interface UpdateUserData {
    _id: string;
    nom: string;
    email: string;
    role: string;
    actif: boolean;
    createdAt?: string;
    avatar?: string;
}

export interface CreateUserData {
    nom: string;
    email: string;
    password: string;
    role?: string;
    actif?: boolean;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface AdminActionHistoryItem {
    _id: string;
    adminId: {
        _id: string;
        nom: string;
        email: string;
    };
    adminName: string;
    action: string;
    targetType: string;
    targetId: string | null;
    details: string;
    timestamp: string;
    __v: number;
}

export interface AdminActionsHistoryPagination {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
}

export interface AdminActionsHistoryResponse {
    history: AdminActionHistoryItem[];
    pagination: AdminActionsHistoryPagination;
}

export interface ApiResponse {
    message: string;
    token?: string;
    user?: User;
    users?: User[];
    history?: AdminActionHistoryItem[];
    pagination?: AdminActionsHistoryPagination;
} 