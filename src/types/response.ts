import type { TableItem, User } from ".";

export interface LoginResponse {
  message: string;
  user: User;
  token: string;
}

export interface ErrorLoginResponse {
  message: string;
  errors?: {
    [key: string]: string[];
  };
}

export interface TableAllResponse {
  success: boolean;
  message: string;
  data: {
    all_tables: TableItem[];
    by_status: {
      available: TableItem[];
      occupied: TableItem[];
      reserved: TableItem[];
      maintenance: TableItem[];
    };
    summary: {
      total_table: number;
      available: number;
      occupied: number;
      reserved: number;
      maintenance: number;
    };
  };

}