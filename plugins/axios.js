import axios from 'axios';

export default defineNuxtPlugin((nuxtApp) => {
    const config = useRuntimeConfig();
    const api = axios.create({
        baseURL: config.public.apiBaseUrl,
        // baseURL: 'https://pmis-api-dev-1097426262171.asia-southeast1.run.app/api/v1',
        withCredentials: true,
        headers: { 'Content-Type': 'application/json' }
    });

    api.interceptors.request.use((config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    });

    api.interceptors.response.use(
        (response) => response,
        async (error) => {
            const status = error.response ? error.response.status : null;
            const loginUrl = "/auth/login"
            const logoutUrl = "/auth/logout"
            if (status === 401 && (![loginUrl, logoutUrl].includes(error.config.url))) {
                const accessToken = localStorage.getItem('access_token') || '';
                // Split the JWT into its parts
                const base64Url = accessToken.split('.')[1];
                const base64 = base64Url ? base64Url.replace(/-/g, '+').replace(/_/g, '/') : '';

                // Decode the base64 string to get the JSON payload
                const jsonPayload = base64 ? decodeURIComponent(atob(base64).split('').map(function (c) {
                    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                }).join('')) : '{}';
                const data = JSON.parse(jsonPayload) || {};
                const isExpired = data.exp * 1000 < Date.now();
                if (isExpired) {
                    const refreshToken = localStorage.getItem('refresh_token');
                    if (refreshToken) {
                        try {
                            const newToken = await refreshAccessToken(config.public.apiBaseUrl, refreshToken);
                            error.config.headers.Authorization = `Bearer ${newToken}`;
                            return api.request(error.config);
                        } catch (refreshError) {
                            // Redirect to login page or handle error
                            nuxtApp.$router.push('/login');
                            return Promise.reject(refreshError);
                        }
                    }
                }
            }
            return Promise.reject(error);
        }
    );

    return {
        provide: {
            api,
        },
    };

});

async function refreshAccessToken(baseURL, refreshToken) {
    try {
        const response = await axios.post(baseURL + '/auth/refresh', { refresh_token: refreshToken });
        localStorage.setItem('access_token', response.data.data.token.access_token);
        localStorage.setItem('refresh_token', response.data.data.token.refresh_token);
        localStorage.setItem('profileUser', JSON.stringify(response.data.data.user));
        return response.data.data.token.access_token;
    } catch (error) {
        throw error;
    }
}
