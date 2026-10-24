import type { Transaction } from "@/api";


export const generateCardNumber = (): string => {
  let result = "";
  for (let i = 0; i < 16; i++) {
    result += Math.floor(Math.random() * 10); // generates integer from 1-9
  }
  return result;
};

export const getDate = () => {
  const formatted: string = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  return formatted;
};

export const getStringFromDate = (date: Date) => {
  const string = new Intl.DateTimeFormat("fr-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
  return string;
};

export const getDateFromString = (s: string) => new Date(s);

export const capitalize = (s: string) => {
  s = s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
  return s;
};

export const money = (amount: string | number) => { 
  return `$${Number(amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`; 
};



export const isToday = (s: string) =>
  new Date(s).toDateString() === new Date().toDateString();

export const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

export const dollarsToCents = (amount: number) : number => {
  return amount * 100;
}

export const formatAmount = (cents: number) =>
  (cents / 100).toLocaleString("en-US", { style: "currency", currency: "USD" });

export const getDirection = (t: Transaction, currentUserEmail?: string): 1 | -1 => {
  if (t.type === "DEPOSIT") return 1;
  if (t.type === "WITHDRAWAL") return -1;
  return t.senderAccountEmail === currentUserEmail ? -1: 1;
};