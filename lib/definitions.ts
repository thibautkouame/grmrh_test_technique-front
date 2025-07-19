export const userType = {
    admin: 'admin',
    user: 'user',
    token: '__grmrh_db_jwt',

    routes: {
        dashboard: '/auth/dashboard',
    },

    userData: {
        _id: String,
        nom: String,
        email: String,
        role: String,
        actif: Boolean,
        createdAt: String,
    }
}