import { Link } from "react-router-dom";
import styles from "./AccountSummary.module.css";
import { money } from "@/utils/utils";
import type { Account } from "@/api";

interface AccountSummaryProps {
  userData: Account | null;
  isLoading: boolean;
}

const AccountSummary = ({ userData }: AccountSummaryProps) => {
  return (
    <div className="border-1 border-gray bg-white">
      <div className="border-b-1 border-b-gray flex justify-between px-6 py-4 items-center">
        <div className="text-[10px] font-bold opacity-70">YOUR ACCOUNT</div>
        <div className="text-[10px] opacity-60">
          Personal Checking • ending in 7534
        </div>
      </div>
      <div className="p-6">
        <div className=" text-[10px] opacity-70">Available balance</div>
        <div className={styles.cash}>
          {userData && money(userData.balanceInCents / 100.0)}
        </div>
      </div>
      <div className="flex w-full">
        <Link className="w-full" to="/transaction/deposit">
          <button className="w-full p-3 text-sm text-white bg-primary cursor-pointer hover:opacity-70">
            Deposit
          </button>
        </Link>

        <Link className="w-full" to="/transaction/withdrawal">
          <button className="w-full p-3 text-sm border-r-1 border-t-1 border-gray text-primary cursor-pointer hover:bg-secondary">
            Withdrawal
          </button>
        </Link>

        <Link className="w-full" to="/transaction/transfer">
          {" "}
          <button className="w-full p-3 text-sm border-t-1 border-gray text-primary cursor-pointer hover:bg-secondary">
            Transfer
          </button>
        </Link>
      </div>
    </div>
  );
};
export default AccountSummary;
