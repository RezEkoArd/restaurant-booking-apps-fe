import { type AuthState, type User, type LoginResponse } from '../types';

const AUTH_KEY = 'auth_data';
export const authStorage = {
    get: (): AuthState | null => {
        try {
            const data = localStorage.getItem(AUTH_KEY); // Perbaikan: gunakan konstanta AUTH_KEY
            return data ? JSON.parse(data) : null;
        } catch (err) {
            return null;
        }
    },
    set: (data: AuthState): void => {
        localStorage.setItem(AUTH_KEY, JSON.stringify(data)); // Perbaikan: gunakan konstanta AUTH_KEY
    },
    clear: (): void => {
        localStorage.removeItem(AUTH_KEY);
    }
};

export const getToken = () =>  {
    const authData = authStorage.get();
    return authData?.token || null;
}

export const getUser = () : User | null => {
    const authData = authStorage.get();
    return authData?.user || null;
}

export const isAuthenticated = (): boolean => {
  const authData = authStorage.get();
  return !!authData?.isAuthenticated;
};

export const hasRole = (requiredRole: 'Pelayan' | 'Kasir' | ('Pelayan' | 'Kasir')[]): boolean => 
{
    const user = getUser();
    if (!user) return false;

    const userRole : 'Pelayan' | 'Kasir' = user.role_id === 1 ? 'Pelayan' : 'Kasir';

     if (Array.isArray(requiredRole)) {
        return requiredRole.includes(userRole);
    }
    
    return userRole === requiredRole;
};

export const login = (response: LoginResponse): void => {
  const authData: AuthState = {
    user: response.user,
    token: response.token,
    isAuthenticated: true
  };
  authStorage.set(authData);
};

export const logout = (): void => {
  authStorage.clear();
};