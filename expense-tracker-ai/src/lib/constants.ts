import { Category } from "./types";

export const STORAGE_KEY = "expense-tracker:expenses";

export const CATEGORY_COLORS: Record<Category, string> = {
  Food: "#f97316", // orange-500
  Transportation: "#3b82f6", // blue-500
  Entertainment: "#a855f7", // purple-500
  Shopping: "#ec4899", // pink-500
  Bills: "#ef4444", // red-500
  Other: "#6b7280", // gray-500
};
