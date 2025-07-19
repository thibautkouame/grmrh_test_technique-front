import { backendHelper } from "./backend-helper";
import { toast } from "sonner";

export const getUser = async () => {
    try {
        const response = await backendHelper.getUser();
        // Extraire les données utilisateur de la réponse
        if (response && response.user) {
            return response.user;
        } else if (response && typeof response === 'object' && 'nom' in response && 'email' in response) {
            return response;
        } else {
            return null;
        }
    } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
        toast.error(errorMessage);
        return null;
    }
}

export const getUsers = async () => {
    try {
        const response = await backendHelper.getUsers();
        // Extraire les données utilisateurs de la réponse
        if (response && response.users) {
            return response.users;
        } else if (response && Array.isArray(response)) {
            return response;
        } else {
            return [];
        }
    } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
        toast.error(errorMessage);
        return [];
    }
}

