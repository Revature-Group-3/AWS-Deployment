export const PAGE_SIZE = 5;
 
export type PageNumber = number | "ellipsis";
 
export function getTotalPages(totalItems: number, pageSize = PAGE_SIZE): number {
  return Math.max(1, Math.ceil(totalItems / pageSize));
}
 
export function getPageItems<T>(items: T[], page: number, pageSize = PAGE_SIZE): T[] {
  const start = (page - 1) * pageSize;
  return items.slice(start, start + pageSize);
}
 
export function getPageNumbers(current: number, total: number): PageNumber[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
 
  const pages: PageNumber[] = [1];
 
  if (current > 3) pages.push("ellipsis");
 
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  for (let i = start; i <= end; i++) pages.push(i);
 
  if (current < total - 2) pages.push("ellipsis");
 
  pages.push(total);
  return pages;
}
 
