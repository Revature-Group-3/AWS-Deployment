const TOKEN_KEY = "token";

export const getToken = (): string | null => localStorage.getItem(TOKEN_KEY);
export const setToken = (token: string): void => localStorage.setItem(TOKEN_KEY, token);
export const clearToken = (): void => localStorage.removeItem(TOKEN_KEY);

export type TransactionType = "DEPOSIT" | "WITHDRAWAL" | "TRANSFER";

export interface RegisterRequest {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
}

export interface Account {
  email: string;
  firstName: string;
  lastName: string;
  balanceInCents: number;
}

export interface Transaction {
  id: number;
  type: TransactionType;
  amountInCents: number;
  timestamp: string;
  accountEmail?: string; // DEPOSIT / WITHDRAWAL
  senderAccountEmail?: string; // TRANSFER
  recipientAccountEmail?: string; // TRANSFER
}

export interface SuccessfulTransaction {
  id: number;
  amountInCents: number;
  newBalanceInCents: number;
  timestamp: string;
  accountEmail: string;
}

export interface TransactionHistory {
  transactions: Transaction[];
}

interface ApiErrorBody {
  status: number;
  message: string;
  timestamp: string;
}

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: unknown;
}

export async function api<T>(path: string, { method = "GET", body }: RequestOptions = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {};
  if (body !== undefined) headers["Content-Type"] = "application/json";
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`/api${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  // redirects to login if user has an expired token
  if (res.status === 401 && token) {
    clearToken();
    window.location.href = "/login";
  }

  const data: unknown = await res.json().catch(() => null);

  if (!res.ok) {
    const message = (data as ApiErrorBody | null)?.message ?? res.statusText ?? "Request failed";
    throw new ApiError(res.status, message);
  }
  return data as T;
}

// Endpoints

export const register = (body: RegisterRequest) => api<Account>("/auth/register", { method: "POST", body });

export async function login(email: string, password: string): Promise<void> {
  const { token } = await api<{ token: string }>("/auth/login", {
    method: "POST",
    body: { email, password },
  });
  setToken(token);
}

export const logout = clearToken;

export const getMe = () => api<Account>("/accounts/me");

export const getTransactions = () => api<TransactionHistory>("/account/transactions");

export const deposit = (amountInCents: number) =>
  api<SuccessfulTransaction>("/account/deposit", { method: "POST", body: { amountInCents } });

export const withdraw = (amountInCents: number) =>
  api<SuccessfulTransaction>("/account/withdraw", { method: "POST", body: { amountInCents } });

export const transfer = (recipientAccountEmail: string, amountInCents: number) =>
  api<SuccessfulTransaction>("/account/transfer", { method: "POST", body: { recipientAccountEmail, amountInCents } });
