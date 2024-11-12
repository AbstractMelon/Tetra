import { defineStore } from 'pinia';
import axios from 'axios';
import jwtDecode from 'jwt-decode';

interface AuthState {
    token: string | null;
    user: any | null;
}

export const useAuthStore = defineStore('auth', {
    state: (): AuthState => ({
        token: localStorage.getItem('token'),
        user: null,
    }),

    actions: {
        async login(email: string, password: string) {
            try {
                const response = await axios.post(
                    'http://localhost:3000/api/auth/login',
                    {
                        email,
                        password,
                    },
                );
                const { token } = response.data;
                this.token = token;
                localStorage.setItem('token', token);
                this.user = jwtDecode(token);
                return true;
            } catch (error) {
                console.error('Login failed:', error);
                return false;
            }
        },

        async signup(username: string, email: string, password: string) {
            try {
                const response = await axios.post(
                    'http://localhost:3000/api/auth/signup',
                    {
                        username,
                        email,
                        password,
                    },
                );
                const { token } = response.data;
                this.token = token;
                localStorage.setItem('token', token);
                this.user = jwtDecode(token);
                return true;
            } catch (error) {
                console.error('Signup failed:', error);
                return false;
            }
        },

        logout() {
            this.token = null;
            this.user = null;
            localStorage.removeItem('token');
        },
    },
});
