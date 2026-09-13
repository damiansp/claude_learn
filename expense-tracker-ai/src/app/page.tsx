"use client";

import { useMemo, useState } from "react";
import CategoryPieChart from "@/components/CategoryPieChart";
import ExpenseFilters, { Filters } from "@/components/ExpenseFilters";
import ExpenseForm from "@/components/ExpenseForm";
import ExpenseList from "@/components/ExpenseList";
import ExportCsvButton from "@/components/ExportCsvButton";
import MonthlyTrendChart from "@/components/MonthlyTrendChart";
import SummaryCards from "@/components/SummaryCards";
import Toast, { ToastState } from "@/components/Toast";
import { useExpenses } from "@/hooks/useExpenses";
import { ExpenseFormValues } from "@/lib/validation";
import { Expense } from "@/lib/types";

const emptyFilters: Filters = { from: "", to: "", category: "", search: "" };

type FormMode = { type: "add" } | { type: "edit"; expense: Expense } | null;

export default function Home() {
  const {
    expenses,
    isLoading,
    error,
    addExpense,
    updateExpense,
    deleteExpense,
    clearError,
  } = useExpenses();

  const [filters, setFilters] = useState<Filters>(emptyFilters);
  const [formMode, setFormMode] = useState<FormMode>(null);
  const [toast, setToast] = useState<ToastState | null>(null);

  const filteredExpenses = useMemo(() => {
    return expenses
      .filter((e) => (filters.from ? e.date >= filters.from : true))
      .filter((e) => (filters.to ? e.date <= filters.to : true))
      .filter((e) => (filters.category ? e.category === filters.category : true))
      .filter((e) =>
        filters.search
          ? e.description.toLowerCase().includes(filters.search.toLowerCase())
          : true
      )
      .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
  }, [expenses, filters]);

  function showToast(message: string, type: ToastState["type"]) {
    setToast({ message, type });
  }

  function handleFormSubmit(values: ExpenseFormValues) {
    const input = {
      date: values.date,
      amount: Number(values.amount),
      category: values.category as Expense["category"],
      description: values.description.trim(),
    };

    if (formMode?.type === "edit") {
      updateExpense(formMode.expense.id, input);
      showToast("Expense updated.", "success");
    } else {
      addExpense(input);
      showToast("Expense added.", "success");
    }
    setFormMode(null);
  }

  function handleDelete(expense: Expense) {
    if (!window.confirm(`Delete "${expense.description}"?`)) return;
    deleteExpense(expense.id);
    showToast("Expense deleted.", "success");
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 space-y-8">
      <Toast toast={toast} onDismiss={() => setToast(null)} />

      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Expense Tracker</h1>
          <p className="text-sm text-gray-500">Track and understand your spending.</p>
        </div>
        {!formMode && (
          <button
            onClick={() => setFormMode({ type: "add" })}
            className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          >
            Add Expense
          </button>
        )}
      </header>

      {error && (
        <div className="rounded-md bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800 flex justify-between items-center">
          <span>{error}</span>
          <button onClick={clearError} className="font-medium underline">
            Dismiss
          </button>
        </div>
      )}

      {formMode && (
        <ExpenseForm
          submitLabel={formMode.type === "edit" ? "Save Changes" : "Add Expense"}
          initialValues={
            formMode.type === "edit"
              ? {
                  date: formMode.expense.date,
                  amount: String(formMode.expense.amount),
                  category: formMode.expense.category,
                  description: formMode.expense.description,
                }
              : undefined
          }
          onSubmit={handleFormSubmit}
          onCancel={() => setFormMode(null)}
        />
      )}

      {isLoading ? (
        <p className="text-sm text-gray-500">Loading your expenses…</p>
      ) : (
        <>
          <section className="space-y-4">
            <h2 className="text-lg font-medium text-gray-900">Overview</h2>
            <SummaryCards expenses={expenses} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  Spending by Category
                </h3>
                <CategoryPieChart expenses={expenses} />
              </div>
              <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  Monthly Trend
                </h3>
                <MonthlyTrendChart expenses={expenses} />
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-gray-900">
                Browse &amp; Filter Expenses
              </h2>
              <ExportCsvButton
                expenses={filteredExpenses}
                onError={(message) => showToast(message, "error")}
              />
            </div>
            <ExpenseFilters filters={filters} onChange={setFilters} />
            <ExpenseList
              expenses={filteredExpenses}
              onEdit={(expense) => setFormMode({ type: "edit", expense })}
              onDelete={handleDelete}
            />
          </section>
        </>
      )}
    </main>
  );
}
