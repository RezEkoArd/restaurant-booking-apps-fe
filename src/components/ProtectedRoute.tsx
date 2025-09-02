import { useAuthStore } from "@/store/useAuthStore";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  roles?: ("Pelayan" | "Kasir")[];
}

export function ProtectedRoute({ children, roles }: ProtectedRouteProps) {
  const { user, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if(!isAuthenticated) {
        navigate("/login", {replace: true });
    } else if (roles && user){
        const role = user.role_id === 1? "Pelayan" : "Kasir";
        if(!role.includes(role)) {
            navigate("/", { replace:true });
        }
    }
  }, [isAuthenticated, user, roles, navigate]);

  if (!isAuthenticated) return null;

  if(roles && user) {
    const role = user.role_id === 1 ? "Pelayan" : "Kasir";
        if (!roles.includes(role)) {
            return <div className="flex items-center justify-center h-screen text-red-500">Akses Ditolak</div>;
        }
  }
  return <>{children}</>;
}