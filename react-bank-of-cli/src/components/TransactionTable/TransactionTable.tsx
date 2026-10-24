import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Transaction } from "@/api";
import { getDateFromString, isToday } from "@/utils/utils";
import { Badge } from "../ui/badge";
import styles from "./TransactionTable.module.css";
import { capitalize } from "@/utils/utils";
import Loadable from "../Loadable/Loadable";
import { formatAmount, getDirection } from "@/utils/utils";
import { useAuth } from "@/context/AuthContext";

interface TransactionTableProps {
  transactions: Transaction[];
  isLoading?: boolean;
  currentUserEmail?: string;
}

const placeholderRows: Transaction[] = Array.from({ length: 5 }, (_, i) => ({
  id: -(i + 1),
  type: "DEPOSIT",
  amountInCents: 0,
  timestamp: new Date().toISOString(),
}));

const TransactionTable = ({
  transactions,
  isLoading,
}: TransactionTableProps) => {
  const showPlaceholders = isLoading && transactions.length === 0;
  const rows = showPlaceholders ? placeholderRows : transactions;

  const {userData} = useAuth();
  
  return (
    <div className="min-h-[296px]">
      
      <Table>
        <TableHeader>
          <TableRow className="bg-secondary">
            <TableHead className="px-6 w-1/2 opacity-80 text-[10px]">TRANSACTION</TableHead>
            <TableHead  className="w-1/3 opacity-80 text-[10px]">DATE</TableHead>
            <TableHead className={`${styles.notMobile} pl-6 opacity-80 text-[10px]`}>STATUS</TableHead>
            <TableHead className="text-right md:min-w-[180px] opacity-80 text-[10px] px-6">AMOUNT</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {!isLoading && rows.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} className="text-center opacity-70">
                No transactions yet
              </TableCell>
            </TableRow>
          )}

          {rows.map((t) => {
            const direction = getDirection(t, userData?.email);
            const subtitle =
              t.type === "TRANSFER"
                ? direction === 1
                  ? `From ${t.senderAccountEmail}`
                  : `To ${t.recipientAccountEmail}`
                : "Checking";

            return (
              <TableRow
                className={!isLoading && isToday(t.timestamp) ? "opacity-70" : ""}
                key={`${t.type}-${t.id}`}
              >
                <TableCell className="font-medium flex gap-4 items-center px-6">
                  <div>
                    <Loadable
                      loading={isLoading}
                      skeleton="w-[72px] h-[12px] my-[4px]"
                    >
                      <div className="text-xs font-bold">{capitalize(t.type)}</div>
                    </Loadable>
                    <Loadable
                      loading={isLoading}
                      skeleton="w-[64px] h-[9px] my-[2px]"
                    >
                      <div className="text-[10px] opacity-60">{subtitle}</div>
                    </Loadable>
                  </div>
                </TableCell>

                <TableCell className={styles.notMobile}>
                  <Loadable loading={isLoading} skeleton="w-[155px] h-[14px]">
                    <span>
                      {getDateFromString(t.timestamp).toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </Loadable>
                </TableCell>

                <TableCell className={styles.mobile}>
                  <Loadable loading={isLoading} skeleton="w-[60px] h-[14px]">
                    <span>
                      {getDateFromString(t.timestamp).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </Loadable>
                </TableCell>

                <TableCell className={styles.notMobile}>
                  <Loadable loading={isLoading} skeleton="w-[85px] h-[34px]">
                    <span>
                      {isToday(t.timestamp) ? (
                        <Badge className="p-4" variant="ghost">
                          Pending
                        </Badge>
                      ) : (
                        <Badge className="p-4" variant="outline">
                          Complete
                        </Badge>
                      )}
                    </span>
                  </Loadable>
                </TableCell>

                <TableCell className="text-right px-6">
                  <Loadable
                    loading={isLoading}
                    skeleton="h-[14px] w-[48px] ml-auto"
                  >
                    <span
                      className={direction === -1 ? "text-red-800" : "text-green-800"}
                    >
                      {direction === -1 ? "-" : "+"}
                      {formatAmount(t.amountInCents)}
                    </span>
                  </Loadable>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default TransactionTable;