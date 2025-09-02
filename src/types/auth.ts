import type { User } from ".";

export interface AuthContextType {
    user: User| null;
    login: (userData: User) => void;
    logout: () => void;
    hasRole: (requiredRole: string | string[]) => boolean;
    isLoading: boolean;
}


export interface ProtectedRouteProps{
    children: React.ReactNode;
    requiredRole?: string | string[];
    redirectTo?: string;
    unauthorizedRedirect?: string;
}