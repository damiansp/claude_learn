import { CATEGORY_COLORS } from "@/lib/constants";
import { formatCurrency, formatDate } from "@/lib/format";
import { Expense } from "@/lib/types";
import EmptyState from "./EmptyState";

interface ExpenseListProps {
  expenses: Expense[];
  onEdit: (expense: Expense) => void;
  onDelete: (expense: Expense) => void;
}

export default function ExpenseList({
  expenses,
  onEdit,
  onDelete,
}: ExpenseListProps) {
  if (expenses.length === 0) {
    return (
      <EmptyState
        title="No expenses match"
        description="Try adjusting your filters, or add a new expense."
      />
    );
  }

  return (
    <ul className="divide-y divide-gray-200 rounded-xl border border-gray-200 bg-white shadow-sm">
      {expenses.map((expense) => (
        <li
          key={expense.id}
          className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 p-4"
        >
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <span
              className="shrink-0 rounded-full px-2.5 py-1 text-xs font-medium text-white"
              style={{ backgroundColor: CATEGORY_COLORS[expense.category] }}
            >
              {expense.category}
            </span>
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {expense.description}
              </p>
              <p className="text-xs text-gray-500">{formatDate(expense.date)}</p>
            </div>
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-4">
            <span className="text-sm font-semibold text-gray-900">
              {formatCurrency(expense.amount)}
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => onEdit(expense)}
                className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(expense)}
                className="text-sm font-medium text-red-600 hover:text-red-800"
              >
                Delete
              </button>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
