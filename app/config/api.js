/**
 * Centralized API configuration
 * All API base URLs should be imported from this file
 */

export const API_BASE_URL =
  typeof window === "undefined"
    ? "http://assista-wiki-backend:5173" // Server-side (Docker internal)
    : (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5173"); // Client-side (Browser)

