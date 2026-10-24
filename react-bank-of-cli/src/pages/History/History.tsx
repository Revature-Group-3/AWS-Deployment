import styles from "./History.module.css";
import TransactionTable from "@/components/TransactionTable/TransactionTable";
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import PaginationControls from "@/components/PaginationControls/PaginationControls";
import { getPageItems, getTotalPages } from "@/utils/pagination";
import { usePageTitle } from "@/hooks/usePageTitle";

const History = () => {
  const [page, setPage] = useState(1);
  const [loadFailed, setLoadFailed] = useState(false);
  const { transactions, userData, refreshTransactions } = useAuth();

  usePageTitle("Transaction History");

  useEffect(() => {
    refreshTransactions()
      .then(() => setLoadFailed(false))
      .catch(() => setLoadFailed(true));
  }, [refreshTransactions]);

  const items = transactions ?? [];
  const totalPages = getTotalPages(items.length);
  const currentPage = Math.min(page, totalPages);
  const isLoading = transactions === null && !loadFailed;

  return (
    <div className={styles.container}>
      <div className="border-1 border-gray bg-white">
        <div className="border-b-1 border-b-gray flex justify-between px-6 py-4 items-center text-[10px] font-bold opacity-70">
          <div>RECENT TRANSACTIONS</div>
        </div>
        {loadFailed ? (
          <p>Couldn't load your transactions. Please try again.</p>
        ) : (
          <TransactionTable
            isLoading={isLoading}
            transactions={getPageItems(items, currentPage)}
            currentUserEmail={userData?.email}
          />
        )}
        <div className="p-3 border-t-1 border-gray">
        <PaginationControls page={currentPage} totalPages={totalPages} onPageChange={setPage} />
        </div>

      </div>
    </div>
  );
};

export default History;
