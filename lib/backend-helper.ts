import { routes } from "./route"
import { toast } from "sonner"
import { getToken, removeToken, saveToken } from "./utils"
import { LoginCredentials, ApiResponse, CreateUserData, UpdateUserData } from "./types"

const baseUrl = process.env.NEXT_PUBLIC_API_URL
const createUserAccount = `${baseUrl}${routes.createUserAccount}`
const createAdminAccount = `${baseUrl}${routes.createAdminAccount}`
const userLogin = `${baseUrl}${routes.userLogin}`
const adminLogin = `${baseUrl}${routes.adminLogin}`
const getUser = `${baseUrl}${routes.getUser}`
const getUsers = `${baseUrl}${routes.getUsers}`
const deleteUser = `${baseUrl}${routes.deleteUser}`
const userUpdate = `${baseUrl}${routes.userUpdate}`
const adminCreateUser = `${baseUrl}${routes.adminCreateUser}`
const adminActionsHistory = `${baseUrl}${routes.adminActionsHistory}`
const updateUserAvatar = `${baseUrl}${routes.updateUserAvatar}`
const userLogout = `${baseUrl}${routes.userLogout}`

export const backendHelper = {
    createUser: async (user: CreateUserData) => {
        try {
            const response = await fetch(createUserAccount, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(user),
            });

            const data: ApiResponse = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Erreur lors de la création de l\'utilisateur.');
            }
            if (data.token) {
                saveToken(data.token)
            }
            toast.success(data.message, { icon: '✅' });
            return data;
        } catch (error) {
            if (error instanceof Error && error.message.includes('Failed to execute')) {
                toast.error('Erreur lors de la création du compte. Veuillez réessayer.', { icon: '❌' });
            } else {
                toast.error(error instanceof Error ? error.message : 'Erreur lors de la création du compte', { icon: '❌' });
            }
            throw error;
        }
    },

    createUserOnAdmin: async (user: CreateUserData) => {
        try {
            const response = await fetch(createUserAccount, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getToken()}`
                },
                body: JSON.stringify(user),
            });


            if (response.status === 403) {
                removeToken()
                window.location.href = routes.authAdmin
            } else if (response.status === 401) {
                removeToken()
                window.location.href = routes.authAdmin
            }


            const data: ApiResponse = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Erreur lors de la création de l\'utilisateur.');
            }
            toast.success(data.message, { icon: '✅' });
            return data;
        } catch (error) {
            if (error instanceof Error && error.message.includes('Failed to execute')) {
                toast.error('Erreur lors de la création du compte. Veuillez réessayer.', { icon: '❌' });
            } else {
                toast.error(error instanceof Error ? error.message : 'Erreur lors de la création du compte', { icon: '❌' });
            }
            throw error;
        }
    },

    userLogin: async (user: LoginCredentials) => {
        try {
            const response = await fetch(userLogin, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(user),
            });

            const data: ApiResponse = await response.json();

            if (!response.ok) {
                toast.error(data.message, { icon: '❌' });
                throw new Error(data.message || 'Erreur lors de la connexion.');
            }
            if (data.token) {
                saveToken(data.token)
            }
            toast.success(data.message, { icon: '✅' });
            return data;
        } catch (error) {
            if (error instanceof Error && error.message.includes('Failed to execute')) {
                toast.error('Erreur de connexion. Veuillez réessayer.', { icon: '❌' });
            } else {
                toast.error(error instanceof Error ? error.message : 'Erreur lors de la connexion', { icon: '❌' });
            }
            throw error;
        }
    },

    createAdmin: async (user: CreateUserData) => {
        try {
            const response = await fetch(createAdminAccount, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(user),
            });

            const data: ApiResponse = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Erreur lors de la création de l\'administrateur.');
            }
            if (data.token) {
                saveToken(data.token)
            }
            toast.success(data.message, { icon: '✅' });
            return data;
        } catch (error) {
            if (error instanceof Error && error.message.includes('Failed to execute')) {
                toast.error('Erreur lors de la création du compte. Veuillez réessayer.', { icon: '❌' });
            } else {
                toast.error(error instanceof Error ? error.message : 'Erreur lors de la création du compte', { icon: '❌' });
            }
            throw error;
        }
    },

    createAdminOnAdmin: async (user: CreateUserData) => {
        try {
            const response = await fetch(adminCreateUser, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getToken()}`
                },
                body: JSON.stringify(user),
            });


            if (response.status === 403) {
                removeToken()
                window.location.href = routes.authAdmin
            } else if (response.status === 401) {
                removeToken()
                window.location.href = routes.authAdmin
            }


            const data: ApiResponse = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Erreur lors de la création de l\'administrateur.');
            }
            toast.success(data.message, { icon: '✅' });
            return data;
        } catch (error) {
            if (error instanceof Error && error.message.includes('Failed to execute')) {
                toast.error('Erreur lors de la création du compte. Veuillez réessayer.', { icon: '❌' });
            } else {
                toast.error(error instanceof Error ? error.message : 'Erreur lors de la création du compte', { icon: '❌' });
            }
            throw error;
        }
    },

    adminLogin: async (user: LoginCredentials) => {
        try {
            const response = await fetch(adminLogin, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(user),
            });

            const data: ApiResponse = await response.json();

            if (!response.ok) {
                toast.error(data.message, { icon: '❌' });
                throw new Error(data.message || 'Erreur lors de la connexion.');
            }
            if (data.token) {
                saveToken(data.token)
            }
            toast.success(data.message, { icon: '✅' });
            return data;
        } catch (error) {
            if (error instanceof Error && error.message.includes('Failed to execute')) {
                toast.error('Erreur de connexion. Veuillez réessayer.', { icon: '❌' });
            } else {
                toast.error(error instanceof Error ? error.message : 'Erreur lors de la connexion', { icon: '❌' });
            }
            throw error;
        }
    },

    getUser: async () => {
        try {
            const response = await fetch(getUser, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getToken()}`
                },
            });

            if (response.status === 403) {
                removeToken()
                window.location.href = routes.authUser
            } else if (response.status === 401) {
                removeToken()
                window.location.href = routes.authUser
            }

            const data: ApiResponse = await response.json();
            return data;
        } catch (error: unknown) {
            if (error instanceof Error && error.message.includes('Failed to execute')) {
                toast.error('Erreur lors de la récupération de l\'utilisateur.', { icon: '❌' });
            } else {
                toast.error(error instanceof Error ? error.message : 'Erreur lors de la récupération de l\'utilisateur', { icon: '❌' });
            }
            throw error;
        }
    },

    getUsers: async () => {
        try {
            const response = await fetch(getUsers, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getToken()}`
                },
            });

            if (response.status === 403) {
                removeToken()
                window.location.href = routes.authUser
            } else if (response.status === 401) {
                removeToken()
                window.location.href = routes.authUser
            }

            const data: ApiResponse = await response.json();
            return data;
        } catch (error: unknown) {
            if (error instanceof Error && error.message.includes('Failed to execute')) {
                toast.error('Erreur lors de la récupération des utilisateurs.', { icon: '❌' });
            } else {
                toast.error(error instanceof Error ? error.message : 'Erreur lors de la récupération des utilisateurs', { icon: '❌' });
            }
            throw error;
        }

    },

    deleteUser: async (userId: string) => {
        try {
            const deleteUserUrl = `${deleteUser}/${userId}`;

            const response = await fetch(deleteUserUrl, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getToken()}`
                },
            });

            // Vérifier si la réponse est du JSON
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                throw new Error('Réponse invalide du serveur');
            }

            if (response.status === 403) {
                removeToken()
                window.location.href = routes.authAdmin
            } else if (response.status === 401) {
                removeToken()
                window.location.href = routes.authAdmin
            }


            const data: ApiResponse = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Erreur lors de la suppression de l\'utilisateur.');
            }

            toast.success(data.message || 'Utilisateur supprimé avec succès', { icon: '✅' });
            return data;
        } catch (error: unknown) {
            if (error instanceof Error && (error.message.includes('Failed to execute') || error.message.includes('Unexpected token'))) {
                toast.error('Erreur de connexion au serveur. Veuillez réessayer.', { icon: '❌' });
            } else {
                toast.error(error instanceof Error ? error.message : 'Erreur lors de la suppression de l\'utilisateur', { icon: '❌' });
            }
            throw error;
        }
    },


    userUpdate: async (user: UpdateUserData) => {
        try {

            const updateUserUrl = `${userUpdate}/${user._id}`;
            const response = await fetch(updateUserUrl, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getToken()}`
                },
                body: JSON.stringify(user),
            });

            if (response.status === 403) {
                removeToken()
                window.location.href = routes.authUser
            } else if (response.status === 401) {
                removeToken()
                window.location.href = routes.authUser
            }

            const data: ApiResponse = await response.json();
            toast.success(data.message || 'Modification effectuée avec succès', { icon: '✅' });
            return data;
        } catch (error) {
            if (error instanceof Error && error.message.includes('Failed to execute')) {
                toast.error('Erreur lors de la mise à jour de l\'utilisateur.', { icon: '❌' });
            } else {
                toast.error(error instanceof Error ? error.message : 'Erreur lors de la mise à jour de l\'utilisateur', { icon: '❌' });
            }
            throw error;
        }
    },

    adminActionsHistory: async (userId: string) => {
        try {

            const updateUserUrl = `${adminActionsHistory}/${userId}`;
            const response = await fetch(updateUserUrl, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getToken()}`
                },
            });

            if (response.status === 403) {
                removeToken()
                window.location.href = routes.authAdmin
            } else if (response.status === 401) {
                removeToken()
                window.location.href = routes.authAdmin
            }

            const data: ApiResponse = await response.json();
            return data;
        } catch (error) {
            if (error instanceof Error && error.message.includes('Failed to execute')) {
                toast.error('Erreur lors de la récupération de l\'historique des actions.', { icon: '❌' });
            } else {
                toast.error(error instanceof Error ? error.message : 'Erreur lors de la récupération de l\'historique des actions', { icon: '❌' });
            }
            throw error;
        }
    },

    updateUserAvatar: async (avatarFile: File) => {
        try {
            const formData = new FormData();
            formData.append('avatar', avatarFile);

            const response = await fetch(updateUserAvatar, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${getToken()}`
                },
                body: formData,
            });


            if (response.status === 403) {
                removeToken()
                window.location.href = routes.authUser
            } else if (response.status === 401) {
                removeToken()
                window.location.href = routes.authUser
            }


            const data: ApiResponse = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Erreur lors de la mise à jour de l\'avatar');
            }

            toast.success(data.message || 'Avatar mis à jour avec succès', { icon: '✅' });
            return data;
        } catch (error) {
            if (error instanceof Error && error.message.includes('Failed to execute')) {
                toast.error('Erreur lors de la mise à jour de l\'avatar.', { icon: '❌' });
            } else {
                toast.error(error instanceof Error ? error.message : 'Erreur lors de la mise à jour de l\'avatar', { icon: '❌' });
            }
            throw error;
        }
    },

    userLogout: async () => {
        try {
            const response = await fetch(userLogout, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getToken()}`
                },
            });

            if (response.status === 403) {
                removeToken()
                window.location.href = routes.authUser
            } else if (response.status === 401) {
                removeToken()
                window.location.href = routes.authUser
            }


            const data: ApiResponse = await response.json();
            removeToken()
            toast.success(data.message || 'Déconnexion réussie', { icon: '✅' });
            return data;
        } catch (error) {
            if (error instanceof Error && error.message.includes('Failed to execute')) {
                toast.error('Erreur lors de la déconnexion.', { icon: '❌' });
            } else {
                toast.error(error instanceof Error ? error.message : 'Erreur lors de la déconnexion', { icon: '❌' });
            }
            throw error;
        }
    }


}