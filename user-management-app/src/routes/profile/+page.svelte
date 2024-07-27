<script>
  import { onMount } from 'svelte';
  import { updateUserEmailApi, updateUserPasswordApi, getUserApi } from '../../lib/api/api';

  let editingEmail = false;
  let editingPassword = false;
  let user = {};
  let dataLoaded = false;
  let password = '';
  let emailStatusMessage = '';
  let passwordStatusMessage = '';
  let isAuthorized = false;
  let authorizedMessage = '';

  function toggleEditEmail() {
    editingEmail = !editingEmail;
    passwordStatusMessage = '';
    emailStatusMessage = '';
  }

  function toggleEditPassword() {
    editingPassword = !editingPassword;
    password = '';
    passwordStatusMessage = '';
    emailStatusMessage = '';
  }

  async function saveEmailChanges() {
    try {
      console.log(user);
      const response = await updateUserEmailApi(user);
      console.log(response);
      if (response.status === 200) {
        toggleEditEmail();
        emailStatusMessage = response.data.message;
      }
    } catch(error) {
      emailStatusMessage = error;
    }
  }

  async function savePasswordChanges() {
    try {
      console.log(user);
      user.password = password;
      const response = await updateUserPasswordApi(user);
      console.log(response)
      if (response.status === 200) {
        toggleEditPassword();
        passwordStatusMessage = response.data.message;
      }
    } catch(error) {
      console.log(error);
      passwordStatusMessage = error.response.data.message;
    }
  }

  async function getUser() {
    try {
      console.log('get user')
      const response = await getUserApi();
      if (response.status === 200) {
        isAuthorized = true;
        user = response.data.user;
      }
    } catch(error) {
      authorizedMessage = error.response.data.message;
    }
  }

  onMount(async () => {
    dataLoaded = false;
    try {
      await getUser();
      dataLoaded = true;
    } catch (error) {
      console.error('Failed to fetch groups:', error);
    }
  });

</script>

<div>
  <h1 style="text-align:center;">Profile</h1>

  {#if dataLoaded && isAuthorized}
    <div>
      <div class="field-container">
        <span style="margin-right:20px">Email: </span>
        {#if editingEmail}
          <input type="email" id="email" bind:value={user.email} />
          <button style="margin-left:20px;" on:click={saveEmailChanges}>Confirm</button>
        {:else}
          <div>{user.email}</div>
          <button style="margin-left:20px;" on:click={toggleEditEmail}>Edit Email</button>
        {/if}
        <p style="margin-left:20px;">{emailStatusMessage}</p>
      </div>
      <div class="field-container">
        <span style="margin-right:20px">Password: </span>
        {#if editingPassword}
          <input type="password" id="password" bind:value={password} />
          <button style="margin-left:20px;" on:click={savePasswordChanges}>Confirm</button>
        {:else}
          <div>********</div>
          <button style="margin-left:20px;" on:click={toggleEditPassword}>Edit Password</button>
        {/if}
        <pre style="margin-left:20px;">{passwordStatusMessage}</pre>
      </div>

    </div>
  {:else}
    <div>{authorizedMessage}</div>
  {/if}

</div>

<style>
  .field-container {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 20px;
  }

  .field-container input {
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 3px;
  }
</style>
