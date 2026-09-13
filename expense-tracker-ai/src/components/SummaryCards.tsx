import { formatCurrency } from "@/lib/format";
import { Expense } from "@/lib/types";

interface SummaryCardsProps {
  expenses: Expense[];
}

function isThisMonth(dateStr: string): boolean {
  const date = new Date(`${dateStr}T00:00:00Z`);
  const now = new Date();
  return (
    date.getUTCFullYear() === now.getUTCFullYear() &&
    date.getUTCMonth() === now.getUTCMonth()
  );
}

export default function SummaryCards({ expenses }: SummaryCardsProps) {
  const total = expenses.reduce((sum, e) => sum + e.amount, 0);
  const monthTotal = expenses
    .filter((e) => isThisMonth(e.date))
    .reduce((sum, e) => sum + e.amount, 0);

  const byCategory = new Map<string, number>();
  for (const e of expenses) {
    byCategory.set(e.category, (byCategory.get(e.category) ?? 0) + e.amount);
  }
  let topCategory: string | null = null;
  let topAmount = 0;
  byCategory.forEach((amount, category) => {
    if (amount > topAmount) {
      topCategory = category;
      topAmount = amount;
    }
  });

  const cards = [
    { label: "Total Spending", value: formatCurrency(total) },
    { label: "This Month", value: formatCurrency(monthTotal) },
    {
      label: "Top Category",
      value: topCategory ? `${topCategory} · ${formatCurrency(topAmount)}` : "—",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
        >
          <p className="text-sm text-gray-500">{card.label}</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900">
            {card.value}
          </p>
        </div>
      ))}
    </div>
  );
}
