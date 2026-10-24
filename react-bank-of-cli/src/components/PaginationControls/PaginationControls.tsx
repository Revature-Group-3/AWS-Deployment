import type { MouseEvent } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { getPageNumbers } from "@/utils/pagination";

type PaginationControlsProps = {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

const DISABLED_CLASS = "pointer-events-none opacity-50";

const PaginationControls = ({ page, totalPages, onPageChange }: PaginationControlsProps) => {
  const isFirst = page <= 1;
  const isLast = page >= totalPages;

  const goTo = (target: number) => (e: MouseEvent) => {
    e.preventDefault();
    onPageChange(Math.min(totalPages, Math.max(1, target)));
  };

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={goTo(page - 1)}
            aria-disabled={isFirst}
            className={isFirst ? DISABLED_CLASS : ""}
          />
        </PaginationItem>

        {getPageNumbers(page, totalPages).map((p, i) =>
          p === "ellipsis" ? (
            <PaginationItem key={i === 1 ? "ellipsis-start" : "ellipsis-end"}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={p}>
              <PaginationLink href="#" isActive={p === page} onClick={goTo(p)}>
                {p}
              </PaginationLink>
            </PaginationItem>
          ),
        )}

        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={goTo(page + 1)}
            aria-disabled={isLast}
            className={isLast ? DISABLED_CLASS : ""}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default PaginationControls;