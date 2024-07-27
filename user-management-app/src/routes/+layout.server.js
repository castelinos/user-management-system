import { getContext, setContext } from 'svelte';
import { isAuthenticated, login, logout } from '../lib/stores/auth';
  
  
export async function load() {
  console.log('async function load')  
  // logout();
}



