export interface User {
  id: number;
  role_id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface roles {
  id: number;
  name: 'Pelayan' | 'Kasir';
}

export interface LoginResponse {
  message: string;
  user: User;
  token: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}


export interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'Pelayan' | 'Kasir' | ('Pelayan' | 'Kasir')[];
  redirectTo?: string;
}


export interface Table {
  id: number;
  table_no : string;
  status: string;
}

export interface Menu {
  id: number,
  price: string,
  category: string,
}

export interface OrderItem {
  id: number;
  order_id: number;
  menu_id: number;
  quantity: number;
  price: string;
  subtotal: string;
}

export interface Order {
  id: number;
  table_id: number;
  status: string;
  total_price: string;
  opened_at: Date;
  closed_at: Date;
}

export interface TableItem {
  id: number;
  table_no: string;
  status: "available" | "occupied" | "reserved" | "maintenance";
}
