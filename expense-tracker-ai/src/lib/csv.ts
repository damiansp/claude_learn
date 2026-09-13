import { Expense } from "./types";

function escapeCsvField(value: string): string {
  return `"${value.replace(/"/g, '""')}"`;
}

export function expensesToCsv(expenses: Expense[]): string {
  const header = ["Date", "Amount", "Category", "Description"];
  const rows = expenses.map((e) =>
    [e.date, e.amount.toFixed(2), e.category, escapeCsvField(e.description)].join(",")
  );
  return [header.join(","), ...rows].join("\n");
}

export function downloadCsv(csv: string, filename = "expenses.csv"): void {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
