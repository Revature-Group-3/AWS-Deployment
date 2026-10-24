import { useParams } from "react-router-dom";
import { useState } from "react";
import { Card, CardHeader, CardContent, CardDescription, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useAuth } from "@/context/AuthContext";
//import { popToast } from "@/lib/popToast";
import { money } from "@/utils/utils";
import { isValidAmount } from "@/utils/validation";
import { usePageTitle } from "@/hooks/usePageTitle";
import styles from "./Transaction.module.css";
import { ApiError, deposit, withdraw, transfer } from "@/api";
import { dollarsToCents } from "@/utils/utils";
import { popToast } from "@/lib/popToast";


const CONFIG = {
  deposit: {
    title: "Deposit Funds",
    accountLabel: "To Account",
    button: "Deposit",
    busy: "Depositing...",
    success: "Deposit successful!",
    failure: "Deposit failed",
    sign: 1,
  },
  withdrawal: {
    title: "Withdraw Funds",
    accountLabel: "From Account",
    button: "Withdraw",
    busy: "Withdrawing...",
    success: "Withdrawal successful!",
    failure: "Withdrawal failed",
    sign: -1,
  },
  transfer: {
    title: "Transfer Funds",
    accountLabel: "From Account",
    button: "Transfer",
    busy: "Transferring...",
    success: "Transfer successful!",
    failure: "Transfer failed",
    sign: -1,
  },
} as const;

type TransactionType = keyof typeof CONFIG;

const isTransactionType = (value?: string): value is TransactionType => !!value && Object.keys(CONFIG).includes(value);

const Transaction = () => {
  usePageTitle("New Transaction");

  const { chosenType } = useParams();

  const [transactionType, setTransactionType] = useState<TransactionType>(
    isTransactionType(chosenType) ? chosenType : "deposit",
  );
  const [amount, setAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { userData, refreshUserData } = useAuth();

  // Form Content
  const cfg = CONFIG[transactionType];
  const n = Number(amount);
  const invalidAmount = !!amount && !isValidAmount(amount);
  const showPreview = n > 0 && Number.isFinite(n);
  const balance = (userData?.balanceInCents ?? 0) / 100;
  const maskedAccount = `•••• •••• •••• 7534`;

  const clearFields = () => {
    setAmount("");
    setRecipient("");
  };

const submit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  if (!isValidAmount(amount)) return;

  setIsLoading(true);
  try {
    const cents = dollarsToCents(n);
    if (transactionType === "deposit") await deposit(cents);
    else if (transactionType === "withdrawal") await withdraw(cents);
    else await transfer(recipient.trim(), cents);

    await refreshUserData().catch(() => {}); // the transaction succeeded even if this refresh fails
    clearFields();
    popToast(true, cfg.success, "");
  } catch (err) {
    popToast(false, "", err instanceof ApiError ? err.message : cfg.failure);
  } finally {
    setIsLoading(false);
  }
};

  return (
    <div className={styles.container}>
      <Card className="min-w-[400px] max-w-[90dvh]">
        <CardHeader className="flex justify-center flex-col items-center">
          <Tabs value={transactionType} onValueChange={(v) => setTransactionType(v as TransactionType)}>
            <TabsList className="gap-1">
              {Object.keys(CONFIG).map((type) => (
                <TabsTrigger key={type} value={type} className="min-w-24">
                  {type[0].toUpperCase() + type.slice(1)}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </CardHeader>

        <CardContent>
          <Card className="w-full">
            <CardHeader>
              <CardTitle>{cfg.title}</CardTitle>
            </CardHeader>

            <CardContent className="min-h-[240px]">
              <form id="transaction-form" onSubmit={submit}>
                <div className="flex flex-col gap-5">
                  <div className="grid gap-2">
                    <Label htmlFor="account">{cfg.accountLabel}</Label>
                    <Input id="account" placeholder={maskedAccount} disabled />
                  </div>

                  {transactionType === "transfer" && (
                    <div className="grid gap-2">
                      <Label htmlFor="recipient">Recipient Email</Label>
                      <Input
                        id="recipient"
                        type="text"
                        value={recipient}
                        disabled={isLoading}
                        onChange={(e) => setRecipient(e.target.value)}
                      />
                    </div>
                  )}

                  <div className="grid gap-2">
                    <Label htmlFor="amount">Amount</Label>
                    <Input
                      id="amount"
                      type="text"
                      value={amount}
                      disabled={isLoading}
                      onChange={(e) => setAmount(e.target.value)}
                      className={invalidAmount ? "border-red-500" : ""}
                    />
                    {invalidAmount && (
                      <Alert className="border-none p-0" variant="destructive">
                        <AlertTitle>Amount must be a positive value</AlertTitle>
                      </Alert>
                    )}
                  </div>

                  <CardDescription>
                    {showPreview
                      ? `Resulting Balance: ${money(balance + cfg.sign * n)}`
                      : `Current Balance: ${money(balance)}`}
                  </CardDescription>
                </div>
              </form>
            </CardContent>

            <CardFooter className="flex-col gap-4">
              <Button type="submit" form="transaction-form" className="w-1/3" disabled={isLoading}>
                {isLoading && <Spinner className="size-6" />}
                {isLoading ? cfg.busy : cfg.button}
              </Button>
            </CardFooter>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
};

export default Transaction;
