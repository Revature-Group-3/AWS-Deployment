import { createContext, useContext } from "react";
import type { Account } from "@/api";
import type { Transaction } from "@/api";

interface AuthContextType {
  userData: Account | null;
  transactions: Transaction[] | null;
  isLoggedIn: boolean;
  isInitializing: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  signup: (email: string, firstName: string, lastName: string, password: string) => Promise<void>;
  refreshUserData: () => Promise<Account>;
  refreshTransactions: () => Promise<Transaction[]>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};