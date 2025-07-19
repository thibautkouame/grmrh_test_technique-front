interface AdminInfo {
    _id: string
    nom: string
    email: string
}

interface AdminActionHistoryItem {
    _id: string
    adminId: AdminInfo
    adminName: string
    action: string
    targetType: string
    targetId: string | null
    details: string
    timestamp: string
    __v: number
}

interface AdminActionsHistoryPagination {
    currentPage: number
    totalPages: number
    totalItems: number
    itemsPerPage: number
}

interface AdminActionsHistoryResponse {
    history: AdminActionHistoryItem[]
    pagination: AdminActionsHistoryPagination
}

export type {
    AdminInfo,
    AdminActionHistoryItem,
    AdminActionsHistoryPagination,
    AdminActionsHistoryResponse
}