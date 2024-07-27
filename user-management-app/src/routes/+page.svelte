<script>
  import { goto } from '$app/navigation';
  import { getContext } from 'svelte';
  import { onMount } from 'svelte';
  import { login } from '../lib/stores/auth';
  import { loginApi } from '../lib/api/api';

  let username = '';
  let password = '';
  let status = '';

  async function handleClick() {
    try {
      status = '';
      console.log(username);
      console.log(password);
      const loginCred = {
        username: username,
        password: password
      }
      const response = await loginApi(loginCred);
      console.log(response);
      if (response.status === 200) {
        console.log(response);
        status = response.data.message;
        goto('/application');
        login();
      }
    } catch (error) {
      console.log(error)
      status = error.response.data.message;
    }
  }
  
</script>

<div class="login-container">
  <div class="login-box">
    <h2>Login</h2>
    <div class="form-control">
      <label for="username">Username:</label>
      <input type="text" bind:value={username} id="username" name="username" placeholder="Enter your username">
    </div>
    <div class="form-control">
    <label for="password">Password:</label>
      <input type="password" bind:value={password} id="password" name="password" placeholder="Enter your password">
    </div>
    <div class="form-control">
      <button on:click={handleClick}>Login</button>
    </div>
    <p>{status}</p>
  </div>
</div>

<style>
  .login-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh; 
  }

  .login-box {
    width: 300px;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 5px;
    background-color: #f9f9f9;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  }

  .form-control {
    margin-bottom: 10px;
  }

   .form-control button {
    padding: 8px;
    background-color: #007bff;
    color: #fff;
    border: none;
    border-radius: 3px;
    cursor: pointer;
  }

  .form-control button:hover {
    background-color: #0056b3;
  }
</style>