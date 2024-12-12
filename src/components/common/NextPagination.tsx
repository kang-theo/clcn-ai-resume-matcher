import React from "react";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface IProps {
  className?: string;
  onPageChange: (page: number) => void;
  currPage: number;
  total?: number;
}

const getPageNumbers = (currentPage: number, totalPages: number) => {
  const delta = 2; // Number of pages to show before and after the current page
  const range = [];
  const rangeWithDots = [];
  let l;

  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 ||
      i === totalPages ||
      (i >= currentPage - delta && i <= currentPage + delta)
    ) {
      range.push(i);
    }
  }

  for (let i of range) {
    if (l) {
      if (i - l === 2) {
        rangeWithDots.push(l + 1);
      } else if (i - l !== 1) {
        rangeWithDots.push("...");
      }
    }
    rangeWithDots.push(i);
    l = i;
  }

  return rangeWithDots;
};

export function NextPagination({
  className,
  onPageChange,
  currPage,
  total,
}: IProps) {
  const pageNumbers = getPageNumbers(currPage, total ?? 1);

  return (
    <Pagination className={`mt-2 ${className}`}>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href='javascript:;'
            onClick={() => onPageChange(Math.max(1, currPage - 1))}
          />
        </PaginationItem>
        {pageNumbers.map((pageNum, index) =>
          pageNum === "..." ? (
            <PaginationItem key={`ellipsis-${index}`}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={pageNum}>
              <PaginationLink
                href='javascript:;'
                onClick={() => onPageChange(Number(pageNum))}
                isActive={Number(pageNum) === currPage}
              >
                {pageNum}
              </PaginationLink>
            </PaginationItem>
          )
        )}
        <PaginationItem>
          <PaginationNext
            href='javascript:;'
            onClick={() => onPageChange(Math.min(total ?? 1, currPage + 1))}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

export default NextPagination;
