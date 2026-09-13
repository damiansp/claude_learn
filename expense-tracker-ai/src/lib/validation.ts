import { CATEGORIES } from "./types";

export interface ExpenseFormValues {
  date: string;
  amount: string;
  category: string;
  description: string;
}

export interface ExpenseFormErrors {
  date?: string;
  amount?: string;
  category?: string;
  description?: string;
}

export function validateExpenseInput(
  input: ExpenseFormValues
): ExpenseFormErrors {
  const errors: ExpenseFormErrors = {};

  if (!input.date || isNaN(Date.parse(input.date))) {
    errors.date = "A valid date is required";
  }

  const amount = Number(input.amount);
  if (!input.amount || isNaN(amount) || amount <= 0) {
    errors.amount = "Amount must be greater than 0";
  }

  if (!(CATEGORIES as readonly string[]).includes(input.category)) {
    errors.category = "Category is required";
  }

  if (!input.description.trim()) {
    errors.description = "Description is required";
  }

  return errors;
}
