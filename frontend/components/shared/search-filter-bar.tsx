"use client"

import { useState } from "react"
import { Search, Filter, X, SlidersHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface FilterOption {
  label: string
  value: string
}

interface SearchFilterBarProps {
  /** Primary API */
  searchQuery?: string
  onSearchChange: (query: string) => void
  searchPlaceholder?: string
  filterOptions?: FilterOption[]
  activeFilter?: string
  onFilterChange?: (value: string) => void
  onExport?: () => void
  children?: React.ReactNode
  /** Alias API for convenience */
  search?: string
  filters?: string[]
}

export function SearchFilterBar({
  searchQuery,
  search,
  onSearchChange,
  searchPlaceholder = "Search...",
  filterOptions,
  filters,
  activeFilter = "all",
  onFilterChange,
  onExport,
  children,
}: SearchFilterBarProps) {
  const currentSearch = searchQuery ?? search ?? ""
  const [focused, setFocused] = useState(false)

  // Normalise: accept either FilterOption[] or string[]
  const normalisedFilters: FilterOption[] | undefined = filterOptions
    ? filterOptions
    : filters
      ? filters.map((f) => ({ label: f, value: f }))
      : undefined

  return (
    <div className="border-b border-border p-4 sm:p-6 flex flex-col gap-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className={cn(
          "flex-1 relative rounded-xl border transition-all duration-200",
          focused ? "border-accent ring-2 ring-accent/20" : "border-border",
        )}>
          <Search className={cn(
            "absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 transition-colors",
            focused ? "text-accent" : "text-muted-foreground",
          )} />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={currentSearch}
            onChange={(e) => onSearchChange(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            className="h-9 w-full rounded-xl bg-card pl-8 pr-8 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
          {currentSearch && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 h-5 w-5 flex items-center justify-center rounded-full hover:bg-secondary transition-colors"
            >
              <X className="h-3 w-3 text-muted-foreground" />
            </button>
          )}
        </div>
        <div className="flex gap-2">
          {onExport && (
            <Button
              variant="ghost"
              onClick={onExport}
              className="h-9 gap-2 rounded-xl border border-border text-xs text-muted-foreground hover:bg-secondary"
            >
              Export
            </Button>
          )}
          {children}
        </div>
      </div>

      {normalisedFilters && onFilterChange && (
        <div className="flex flex-wrap gap-1.5">
          {normalisedFilters.map((opt) => {
            const isActive = activeFilter === opt.value || activeFilter?.toLowerCase() === opt.value.toLowerCase() || activeFilter === opt.label
            return (
              <button
                key={opt.value}
                onClick={() => onFilterChange(opt.value || opt.label)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all duration-150",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground",
                )}
              >
                {opt.label}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
