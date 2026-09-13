"use client";

import { useCallback, useEffect, useState } from "react";
import { STORAGE_KEY } from "@/lib/constants";
import { parseExpenses, safeGetItem, safeSetItem } from "@/lib/storage";
import { Expense, ExpenseInput } from "@/lib/types";

export function useExpenses() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setExpenses(parseExpenses(safeGetItem(STORAGE_KEY)));
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (isLoading) return;
    const ok = safeSetItem(STORAGE_KEY, JSON.stringify(expenses));
    if (!ok) {
      setError("Changes may not be saved — storage is full or unavailable.");
    }
  }, [expenses, isLoading]);

  const addExpense = useCallback((input: ExpenseInput) => {
    const expense: Expense = {
      ...input,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    setExpenses((prev) => [expense, ...prev]);
  }, []);

  const updateExpense = useCallback(
    (id: string, patch: Partial<Omit<Expense, "id">>) => {
      setExpenses((prev) =>
        prev.map((e) => (e.id === id ? { ...e, ...patch } : e))
      );
    },
    []
  );

  const deleteExpense = useCallback((id: string) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  }, []);

  const clearError = useCallback(() => setError(null), []);

  return {
    expenses,
    isLoading,
    error,
    addExpense,
    updateExpense,
    deleteExpense,
    clearError,
  };
}
