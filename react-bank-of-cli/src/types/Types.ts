export type User = {
  firstName: string;
  lastName: string;
  email: string;
  balance: number;
};

export interface Transaction {
  id: number;
  type: "deposit" | "withdrawal" | "transfer";  
  amount: number;
  from: number | null;
  to: number | null;
  date: string;
}

export interface DatabaseSchema {
  users: User[];
  transactions: Transaction[];
}

export type Email = `${string}@${string}.${string}`;

//todo: make transaction type work correctly
