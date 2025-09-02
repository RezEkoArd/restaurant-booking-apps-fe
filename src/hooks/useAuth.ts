import type { AuthState, User } from "@/types"
import { authStorage } from "@/utils/auth";
import { useEffect, useState } from "react"


export const useAuth = () => {
    const [authState, setAuthState] = useState<AuthState>({
        user: null,
        token: null,
        isAuthenticated: false,
    });

    const [loading, setLoading] = useState(true);

    useEffect(()=> {
        const loadAuthData = () => {
            const storedAuth = authStorage.get();
            if (storedAuth) {
                setAuthState(storedAuth);
            }
            setLoading(false);
        }

        loadAuthData();
    },[]);

    const login = (user: User, token: string) => {
        const newAuthState: AuthState = {
        user,
        token,
        isAuthenticated: true
        };
        setAuthState(newAuthState);
        authStorage.set(newAuthState);
    };

    const logout = () => {
        setAuthState({
        user: null,
        token: null,
        isAuthenticated: false
        });
        authStorage.clear();
    };

    const hasRole = (requiredRole: 'Pelayan' | 'Kasir' | ('Pelayan' | 'Kasir')[]): boolean => {
    if (!authState.user) return false;

    const userRole: 'Pelayan' | 'Kasir' = authState.user.role_id === 1 ? 'Pelayan' : 'Kasir';
    
    if (Array.isArray(requiredRole)) {
      return requiredRole.includes(userRole);
    }
    
    return userRole === requiredRole;
  };

  return {
    ...authState,
    loading,
    login,
    logout,
    hasRole,
    getToken: () => authState.token,
    getUser: () => authState.user
  };

}