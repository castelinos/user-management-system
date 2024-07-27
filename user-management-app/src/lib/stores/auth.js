// auth.js

import { writable } from 'svelte/store';

// Initial authentication state
const initialAuthState = {
  isAuthenticated: false,
  user: null,
};

// Create writable store for authentication state
const auth = writable(initialAuthState);

// Action to perform user login
export const login = (userData) => {
  // Perform login logic, e.g., authenticate user
  const user = { /* User data retrieved from login */ };
  auth.set({ isAuthenticated: true, user });
};

// Action to perform user logout
export const logout = () => {
  // Perform logout logic, e.g., clear session
  auth.set({ isAuthenticated: false, user: null });
};

// Export the writable store
export default auth;
