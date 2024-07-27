<script>
  import UserRow from '../../../src/lib/components/userRow.svelte';
	import CreateUserRow from '../../../src/lib/components/createUserRow.svelte';
  import { onMount } from 'svelte';
  import { createGroupApi, getAllGroupsApi, getAllUsersApi } from '../../lib/api/api';

  let groupName = '';
  let groupCreateStatus = '';
  let availableGroups;
  let showNewUserRow = true;
  let status = '';
  let isAdmin = false;
  let users;

  function handleUserCreated(event) {
    console.log(event)
    if (event.detail.success) {
      console.log('User creation succeeded!');
      showNewUserRow = true;
    } else {
      console.error('User creation failed!');
    }
    getAllGroups();
    getAllUsers();
  }

  async function createGroup() {
     try {
      const response = await createGroupApi(groupName);
      if (response.status === 200) {
        groupCreateStatus = response.data.message;
      }
    } catch (error) {
      console.log(error)
      groupCreateStatus = error.response.data.message;
    }
    await getAllGroups();
    await getAllUsers();
  }

  function handleInput(event) {
    groupName = event.target.value; 
  }

  async function getAllGroups() {
    try {
      console.log('get groups')
      const response = await getAllGroupsApi();
      console.log(response)
      if (response.status === 200) {
        availableGroups = response.data.groups;
        isAdmin = true;
      }
      return;
    } catch(error) {
      console.log(error);
      status = error.response.data.message;
    }
  }

  async function getAllUsers() {
    console.log('get all users')
    status = '';
    try {
      console.log('get users')
      const response = await getAllUsersApi();
      console.log(response)
      if (response.status === 200) {
        isAdmin = true;
        users = response.data.users;
      }
      return
    } catch(error) {
      console.log(error);
      status = error.response.data.message;
    }
  }

  let dataLoaded = false;
  onMount(async () => {
    dataLoaded = false;
    try {
      await getAllGroups();
      if (isAdmin) {
        await getAllUsers();
        dataLoaded = true;
      }
    } catch (error) {
      console.error('Failed to fetch groups:', error);
    }
  });

  async function handleEditUser() {
    await getAllGroups();
    await getAllUsers();
  }

</script>

<div>
  <h1 style="text-align:center;">User Management</h1>

{#if isAdmin}
<div>
  <div>
   <span>Enter Group Name: </span> 
   <input type="text" bind:value={groupName}> 
   <button on:click={createGroup} on:input={handleInput}>+ Create Group</button>
   <pre>{groupCreateStatus}</pre>
  </div>

<table style="border: 1px black solid; margin-top: 20px; text-align: center;">
  <thead>
    <tr>
      <th>Username</th>
      <th>Email</th>
      <th>Password</th>
      <th>Group</th>
      <th>Disabled</th>
      <th>Status</th>
      <th>Edit</th>
    </tr>
  </thead>
  <tbody>
    {#if dataLoaded}
      {#each users as user }
        <UserRow groups={user.groupnames} user={user} availableGroups={availableGroups} on:editUserComplete={handleEditUser}></UserRow>
      {/each}
  
      {#if showNewUserRow}
        <CreateUserRow on:userCreated={handleUserCreated} availableGroups={availableGroups}></CreateUserRow>
      {/if}
  
    {/if}
  </tbody>
</table>
</div>
{:else}
<pre>{status}</pre>
{/if}

</div>
