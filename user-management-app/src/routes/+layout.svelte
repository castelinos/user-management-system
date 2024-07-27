<!-- <script>
  import { getContext, setContext } from 'svelte';
  import { isAuthenticated, login, logout } from '../lib/stores/auth';
  setContext('auth', {
    isAuthenticated,
    login,
    logout
  });
</script>

{#if $isAuthenticated}
<nav class="navbar">
    <a href="/application">Home</a>
    <a href="/profile">Profile</a>
    <a href="/usermanagement">User Management</a>
    <a href="/" style="float:right;">Logout</a>
</nav>
{/if}

<slot /> -->

<script>
  import axios from 'axios';

  async function logout() {
    try {
      const url = 'http://localhost:5000/api/auth/logout';
      const response = await axios.post(url, {
          withCredentials: true, 
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          }
      });
      console.log(response);
      if (response.status === 200) {
        console.log(response);
      }
    } catch (error) {
      console.log(error)
    }
  }
</script>

<nav class="navbar">
    <a href="/application">Home</a>
    <a href="/profile">Profile</a>
    <a href="/usermanagement">User Management</a>
    <a href="/" style="float:right;" on:click="{logout}">Logout</a>
</nav>

<slot />