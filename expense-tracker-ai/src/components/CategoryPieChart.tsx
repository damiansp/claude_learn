"use client";

import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { CATEGORY_COLORS } from "@/lib/constants";
import { formatCurrency } from "@/lib/format";
import { Category, Expense } from "@/lib/types";
import EmptyState from "./EmptyState";

interface CategoryPieChartProps {
  expenses: Expense[];
}

export default function CategoryPieChart({ expenses }: CategoryPieChartProps) {
  if (expenses.length === 0) {
    return (
      <EmptyState
        title="No spending yet"
        description="Add an expense to see your category breakdown."
      />
    );
  }

  const totals = new Map<Category, number>();
  for (const e of expenses) {
    totals.set(e.category, (totals.get(e.category) ?? 0) + e.amount);
  }
  const data = Array.from(totals.entries()).map(([category, value]) => ({
    category,
    value,
  }));

  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="category"
          innerRadius={60}
          outerRadius={90}
          paddingAngle={2}
        >
          {data.map((entry) => (
            <Cell key={entry.category} fill={CATEGORY_COLORS[entry.category]} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => formatCurrency(Number(value))} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
