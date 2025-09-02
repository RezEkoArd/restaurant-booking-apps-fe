import type { User } from ".";

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