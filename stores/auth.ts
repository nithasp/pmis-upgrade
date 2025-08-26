// stores/auth.ts

import { defineStore } from 'pinia'
import { ref } from 'vue'
import useAuthService from '~/core/services/authService'

export const useAuthStore = defineStore('auth', () => {
    const { login, logout } = useAuthService()
    const accessToken = ref<string>(localStorage.getItem('access_token') || '')
    const refreshToken = ref<string>(localStorage.getItem('refresh_token') || '')
    const profileJSON = localStorage.getItem('profileUser') || '{}'
    const profileUser = ref(JSON.parse(profileJSON))

    const storedPermissions = localStorage.getItem('permissions');

    const decodedPermissions = storedPermissions ? atob(storedPermissions).split(',') : '';

    const permissions = ref(decodedPermissions || [])
    const isAuthenticated = computed(() => !!accessToken.value)

    const logoutUser = async () => {
        try {
            await logout()
            accessToken.value = '';
            refreshToken.value = '';
            profileUser.value = ''
            permissions.value = []
            localStorage.removeItem('access_token')
            localStorage.removeItem('refresh_token')
            localStorage.removeItem('profileUser')
            localStorage.removeItem('permissions')
        } catch (error) {
            accessToken.value = '';
            refreshToken.value = '';
            permissions.value = []
            console.error('Logout error:', error)
            localStorage.removeItem('access_token')
            localStorage.removeItem('refresh_token')
            localStorage.removeItem('profileUser')
            localStorage.removeItem('permissions')
            throw error
        }
    }

    watch(accessToken, (newToken) => {
        localStorage.setItem('access_token', newToken);
    });

    watch(refreshToken, (newRefreshToken) => {
        localStorage.setItem('refresh_token', newRefreshToken);
    });

    watch(profileUser, (newProfileUser) => {
        localStorage.setItem('profileUser', JSON.stringify(newProfileUser));
    });

    watch(permissions, (newPermissions) => {
        const permissionsString = newPermissions.join(',');
        // Encode the string to Base64
        const base64Permissions = btoa(permissionsString);
        // Store the Base64-encoded string in localStorage
        localStorage.setItem('permissions', base64Permissions);
    });

    return { accessToken, refreshToken, isAuthenticated, profileUser, permissions, logoutUser }
},)
