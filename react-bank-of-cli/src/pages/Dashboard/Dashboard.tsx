import { useAuth } from "@/context/AuthContext";
import { capitalize, isToday, formatAmount, getDirection } from "@/utils/utils";
import styles from "./Dashboard.module.css";
import TransactionTable from "@/components/TransactionTable/TransactionTable";
import { Link } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import AccountSummary from "@/components/AccountSummary/AccountSummary";
import { usePageTitle } from "@/hooks/usePageTitle";

const Dashboard = () => {
  const [isLoading] = useState(false);
  const { transactions, userData, refreshTransactions } = useAuth();

  const pending = useMemo(() => {
    let credits = 0;
    let debits = 0;
    for (const t of transactions ?? []) {
      if (!isToday(t.timestamp)) continue; // same rule as the "Pending" badge
      if (getDirection(t, userData?.email) === 1) credits += t.amountInCents;
      else debits += t.amountInCents;
    }
    return { credits, debits, net: credits - debits };
  }, [transactions, userData?.email]);

  useEffect(() => {
    refreshTransactions();
  }, [refreshTransactions]);

  usePageTitle("Dashboard");

  return (
    <div className={`py-2 px-4 md:py-8 md:px-16 ${styles.container}`}>
      <div className={styles.serif}>Welcome back, {userData && capitalize(userData.firstName)}</div>
      <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-6">
        <AccountSummary userData={userData} isLoading={isLoading} />
        <div className="border-1 border-gray bg-white">
          <div className="border-b-1 border-b-gray flex justify-between px-6 py-4 items-center text-[10px] font-bold opacity-70">
            PENDING SUMMARY
          </div>
          <div className="px-6 py-3">
            <div className="flex gap-[1px] bg-black/10 flex-col">
              <div className="flex justify-between items-center bg-white py-3">
                <div className="text-[12px] opacity-70">Pending credits</div>
                <div className="text-[13px] opacity-70 text-primary">+{formatAmount(pending.credits)}</div>
              </div>
              <div className="flex justify-between items-center bg-white py-3">
                <div className="text-[12px] opacity-70">Pending debits</div>
                <div className="text-[13px] opacity-70 text-primary">−{formatAmount(pending.debits)}</div>
              </div>
              <div className="flex justify-between items-center bg-white pt-3">
                <div className="text-[12px] font-bold">Net Pending</div>
                <div className="text-[13px] opacity-70 font-bold">
                  {pending.net < 0 ? "−" : "+"}
                  {formatAmount(Math.abs(pending.net))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-1 border-gray bg-white">
        <div className="border-b-1 border-b-gray flex justify-between px-6 py-4 items-center text-[10px] font-bold opacity-70">
          <div>RECENT TRANSACTIONS</div>
          <Link to="/history" className="text-[11px] underline text-primary hover:text-primary/70">
            See All →
          </Link>
        </div>
        {transactions && <TransactionTable isLoading={isLoading} transactions={transactions.slice(0, 5)} />}
      </div>
    </div>
  );
};
export default Dashboard;
