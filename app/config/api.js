/**
 * Centralized API configuration
 * All API base URLs should be imported from this file
 */

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.BACKEND_API_URL ||
  "http://127.0.0.1:5173";

