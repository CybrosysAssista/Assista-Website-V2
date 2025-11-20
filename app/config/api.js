/**
 * Centralized API configuration
 * All API base URLs should be imported from this file
 */

// All API calls go to assista-wiki backend on port 5173
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.BACKEND_API_URL ||
  "http://localhost:5173";

export const AUTH_API_URL = API_BASE_URL;
export const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;



