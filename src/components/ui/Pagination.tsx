'use client';

import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  itemsPerPage: number;
  onItemsPerPageChange: (size: number) => void;
  totalItems: number;
  itemsPerPageOptions?: number[];
  className?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage,
  onItemsPerPageChange,
  totalItems,
  itemsPerPageOptions = [10, 20, 30, 40, 50],
  className
}: PaginationProps) {
  // Generate page links logic
  const getPageNumbers = () => {
    // If total pages is small, show all
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages: (number | string)[] = [1];
    if (currentPage > 3) {
      pages.push('...');
    }

    // middle pages
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (currentPage < totalPages - 2) {
      pages.push('...');
    }

    if (totalPages > 1) {
      pages.push(totalPages);
    }
    
    return pages;
  };

  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className={cn("flex flex-col sm:flex-row items-center justify-between gap-4 py-2", className)}>
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-brand-muted">Rows per page:</span>
          <div className="w-20">
            <Select 
              value={itemsPerPage.toString()}
              onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
              options={itemsPerPageOptions.map(o => ({ label: o.toString(), value: o.toString() }))}
            />
          </div>
        </div>
        
        <span className="text-sm text-brand-muted">
          Showing <span className="font-semibold text-brand-dark">{startItem}–{endItem}</span> of <span className="font-semibold text-brand-dark">{totalItems}</span>
        </span>
      </div>

      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
        >
          <ChevronsLeft className="h-4 w-4 text-brand-muted" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="h-4 w-4 text-brand-muted" />
        </Button>

        <div className="flex items-center gap-1 mx-2">
          {getPageNumbers().map((page, i) => (
            page === '...' ? (
              <div key={`ellipsis-${i}`} className="w-8 flex items-center justify-center">
                <MoreHorizontal className="h-4 w-4 text-brand-muted" />
              </div>
            ) : (
              <Button
                key={page}
                variant={currentPage === page ? 'primary' : 'ghost'}
                size="sm"
                className={cn(
                  "h-8 w-8 p-0 rounded-full",
                  currentPage === page ? "bg-[#701a75] text-white hover:bg-[#861f8c] border-none" : "text-brand-dark hover:bg-slate-100 border-none"
                )}
                onClick={() => onPageChange(page as number)}
              >
                {page}
              </Button>
            )
          ))}
        </div>

        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages || totalPages === 0}
        >
          <ChevronRight className="h-4 w-4 text-brand-muted" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage >= totalPages || totalPages === 0}
        >
          <ChevronsRight className="h-4 w-4 text-brand-muted" />
        </Button>
      </div>
    </div>
  );
}
