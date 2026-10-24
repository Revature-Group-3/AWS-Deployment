import { useCallback, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { AuthContext } from "./AuthContext";
import * as api from "@/api";
import type { Transaction } from "@/api";

// Only used to check whether a usable token exists (not expired / not garbled).
function hasValidToken(): boolean {
  const token = api.getToken();
  if (!token) return false;
  try {
    const payload = JSON.parse(atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")));
    if (payload.exp * 1000 < Date.now()) {
      api.clearToken();
      return false;
    }
    return true;
  } catch {
    api.clearToken();
    return false;
  }
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [userData, setUserData] = useState<api.Account | null>(null);
  const [transactions, setTransactions] = useState<Transaction[] | null>(null);
  const [isInitializing, setIsInitializing] = useState<boolean>(hasValidToken);

  const refreshTransactions = useCallback(async () => {
    const { transactions } = await api.getTransactions();
    setTransactions(transactions);
    return transactions;
  }, []);

  const refreshUserData = useCallback(async () => {
    const account = await api.getMe();
    setUserData(account);
    return account;
  }, []);

  useEffect(() => {
    if (!isInitializing) return;

    let cancelled = false;
    api.getMe().then((account) => {
        if (!cancelled) setUserData(account);
      })
      .catch(() => {
        // TODO: token rejected or request failed; fall through to logged-out state
      })
      .finally(() => {
        if (!cancelled) setIsInitializing(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const login = async (email: string, password: string) => {
    await api.login(email, password);
    try {
      await refreshUserData();
    } catch (err) {
      api.clearToken();
      throw err;
    }
  };

  const logout = () => {
    api.clearToken();
    setUserData(null);
    setTransactions(null);
  };

  const signup = async (email: string, firstName: string, lastName: string, password: string) => {
    await api.register({ firstName, lastName, email, password });
  };

  return (
    <AuthContext.Provider
      value={{ refreshTransactions, userData, transactions, isLoggedIn: !!userData, isInitializing, login, logout, signup, refreshUserData }}
    >
      {children}
    </AuthContext.Provider>
  );
};
