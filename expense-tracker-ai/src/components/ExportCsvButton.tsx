import { downloadCsv, expensesToCsv } from "@/lib/csv";
import { Expense } from "@/lib/types";

interface ExportCsvButtonProps {
  expenses: Expense[];
  onError: (message: string) => void;
}

export default function ExportCsvButton({
  expenses,
  onError,
}: ExportCsvButtonProps) {
  function handleExport() {
    try {
      downloadCsv(expensesToCsv(expenses));
    } catch {
      onError("Could not export CSV. Please try again.");
    }
  }

  return (
    <button
      onClick={handleExport}
      disabled={expenses.length === 0}
      className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      Export CSV
    </button>
  );
}
