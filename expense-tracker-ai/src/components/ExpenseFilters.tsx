import { CATEGORIES } from "@/lib/types";

export interface Filters {
  from: string;
  to: string;
  category: string;
  search: string;
}

interface ExpenseFiltersProps {
  filters: Filters;
  onChange: (filters: Filters) => void;
}

export default function ExpenseFilters({ filters, onChange }: ExpenseFiltersProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm grid grid-cols-1 sm:grid-cols-4 gap-3">
      <div>
        <label htmlFor="from" className="block text-xs font-medium text-gray-500">
          From
        </label>
        <input
          id="from"
          type="date"
          value={filters.from}
          onChange={(e) => onChange({ ...filters, from: e.target.value })}
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label htmlFor="to" className="block text-xs font-medium text-gray-500">
          To
        </label>
        <input
          id="to"
          type="date"
          value={filters.to}
          onChange={(e) => onChange({ ...filters, to: e.target.value })}
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label htmlFor="category" className="block text-xs font-medium text-gray-500">
          Category
        </label>
        <select
          id="category"
          value={filters.category}
          onChange={(e) => onChange({ ...filters, category: e.target.value })}
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">All categories</option>
          {CATEGORIES.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="search" className="block text-xs font-medium text-gray-500">
          Search
        </label>
        <input
          id="search"
          type="text"
          placeholder="Search descriptions"
          value={filters.search}
          onChange={(e) => onChange({ ...filters, search: e.target.value })}
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>
    </div>
  );
}
