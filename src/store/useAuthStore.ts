// store/useAuthStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";
import type { LoginResponse } from "@/types/response";
import { AxiosError } from "axios";

// Tipe role
export type Role = "Pelayan" | "Kasir";

// Mapping role_id ke nama role
export const getRoleFromId = (roleId: number): Role => {
  return roleId === 1 ? "Pelayan" : "Kasir";
};

// Tipe User
export type User = {
  id: number;
  role_id: number;
  name: string;
  email: string;
  created_at: string;
  updated_at: string;
};

// Interface state
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean; // ✅ Diperbaiki: sebelumnya `false` (harusnya boolean)
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}
const API_BASE_URL = "http://127.0.0.1:8000";
// Set base URL untuk axios
axios.defaults.baseURL = API_BASE_URL;

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: true, // status awal: loading

      login: async (email: string, password: string) => {
        try {
            const response = await axios.post<LoginResponse>("/api/login", { email, password });
            const data = response.data;

            if (!data.token || !data.user) {
            throw new Error("Respons login tidak valid: token atau user tidak ditemukan.");
            }

            const { user, token } = data;
            set({ user, token, isAuthenticated: true });

            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

            localStorage.setItem("token", token);

        } catch (err: any) {
            console.error("Login gagal:", err);

            // ✅ Tangani error dari server (misal: 401, 422)
            if ((err as AxiosError).isAxiosError) {
            const axiosError = err as AxiosError<{ message?: string }>;
            throw new Error(axiosError.response?.data?.message || "Login gagal.");
            }
            throw new Error("Email atau password salah.");
        }
        },

      logout: () => {
        set({ user: null, token: null, isAuthenticated: false, isLoading: false });
        delete axios.defaults.headers.common["Authorization"];
      },
    }),
    {
      name: "auth", // nama key di localStorage
      partialize: (state) => ({
        token: state.token,
        user: state.user,
      }),
      // @ts-ignore
        onRehydrate: () => (state) => {
        state?.set({ isLoading: false });
      },
    }
  )
);

axios.interceptors.request.use(
  (config) => {
    const { token } = useAuthStore.getState();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);