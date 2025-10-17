"use client";

import Link from "next/link";
import {ChevronLeft, ChevronRight} from "lucide-react";

type PaginationProps = {
    currentPage: number;
    totalPages: number;
    baseUrl: string;
    query?: string;
};

export default function Pagination({
                                       currentPage,
                                       totalPages,
                                       baseUrl,
                                       query,
                                   }: PaginationProps) {
    const getHref = (page: number) => {
        const params = new URLSearchParams();
        if (query) params.set("query", query);
        if (page > 1) params.set("page", String(page));
        return `${baseUrl}?${params.toString()}`;
    };

    // Define how many page numbers to show
    const maxVisiblePages = 5;
    const pageNumbers: number[] = [];

    const startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
    }

    return (
        <div className="flex items-center justify-center gap-2 mt-10">
            {/* Previous */}
            {currentPage > 1 && (
                <>
                    <Link
                        href={getHref(Math.max(currentPage - 1, 1))}
                        className="px-2 py-1 rounded hover:bg-gray-200"
                        style={{
                            pointerEvents: (currentPage === 1) ? 'none' : 'auto'
                        }}
                        aria-disabled={currentPage === 1}
                        tabIndex={currentPage === 1 ? -1 : undefined}
                    >
                        <ChevronLeft className="w-5 h-5"/>
                    </Link>
                </>
            )}

            {/* First Page (if needed) + Ellipsis */}
            {currentPage > Math.floor(maxVisiblePages / 2) + 1 && (
                <>
                    <Link
                        href={getHref(1)}
                        className="px-3 py-1 rounded hover:bg-gray-200 text-gray-700"
                    >
                        {1}
                    </Link>
                    <span className="px-2 text-gray-500">...</span>
                </>
            )}

            {/* Page Numbers */}
            {pageNumbers.map((page) => (
                <Link
                    key={page}
                    href={getHref(page)}
                    className={`px-3 py-1 rounded ${
                        page === currentPage
                            ? "bg-black text-white"
                            : "hover:bg-gray-200 text-gray-700"
                    }`}
                >
                    {page}
                </Link>
            ))}

            {/* Ellipsis + Last Page (if needed) */}
            {endPage < totalPages && (
                <>
                    <span className="px-2 text-gray-500">...</span>
                    <Link
                        href={getHref(totalPages)}
                        className="px-3 py-1 rounded hover:bg-gray-200 text-gray-700"
                    >
                        {totalPages}
                    </Link>
                </>
            )}

            {/* Next */}
            {currentPage < totalPages && (
                <>
                    <Link
                        href={getHref(Math.min(totalPages, currentPage + 1))}
                        className="px-2 py-1 rounded hover:bg-gray-200"
                        style={{
                            pointerEvents: (currentPage === totalPages) ? 'none' : 'auto'
                        }}
                        aria-disabled={currentPage === totalPages}
                        tabIndex={currentPage === totalPages ? -1 : undefined}
                    >
                        <ChevronRight className="w-5 h-5"/>
                    </Link>
                </>
            )}
        </div>
    );
}
