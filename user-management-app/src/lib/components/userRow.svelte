<!-- TableBodyRow.svelte -->
<script>
  import MultiSelect from 'svelte-multiselect';
  import { createEventDispatcher } from 'svelte';
  import { updateUserApi, updateUserGroupApi } from '../api/api';

  let status = '';
  export let user = {};
  let selectedDisabled;
  export let groups = [];
  export let availableGroups = [];
  let password = "";

  const dispatch = createEventDispatcher();

  let isEditing = false;

  function toggleEdit() {
    isEditing = !isEditing;
    status = '';
  }

  async function editUser() {
    try {
      status = '';
      user.disabled = selectedDisabled;
      user.password = password;
      console.log(user)
      const response = await updateUserApi(user);
      if (response.status === 200) {
        const userGroup = {
          username: user.username,
          groups: groups
        }
        const updateUserGroupResponse = await updateUserGroupApi(userGroup);
        console.log(updateUserGroupResponse)
        if (updateUserGroupResponse.status == 202) {
          status = 'User group updated for admin';
        } else {
          status = response.data.message;
        }
        user.groupnames = groups;
        isEditing = false; 
        password = '';
      }
      dispatch('editUserComplete')
    } catch(error) {
      console.log(error)
      status = error.response.data.message
    }
  }

  function handleGroupChange(event) {
    let newGroup = event.detail.option;
    if (!groups.includes(newGroup)) {
      groups.push(newGroup);
    }
  }

  function handleGroupRemove(event) {
    let groupToRemove = event.detail.option;
    groups = groups.filter(item => item !== groupToRemove);
  }


</script>

<tr>
  {#if isEditing}
    <td>{user.username}</td>
    <td><input type="text" bind:value={user.email} /></td>
    <td><input type="text" bind:value={password} /></td>
    <td>
      <MultiSelect
        id="group"
        options={availableGroups.map(group => group.groupname)}
        allowUserOptions="append"
        selected={user.groupnames}
        on:add={(event) => {
          handleGroupChange(event)
        }}
        on:remove={(event) => {
          handleGroupRemove(event)
        }}
    />
    </td>
    <td>
      <select bind:value={selectedDisabled}>
        <option value="0">Enabled</option>
        <option value="1">Disabled</option>
      </select>
    </td>
    <td><pre>{status}</pre></td>
    <td><button on:click={editUser}>Save</button></td>
  {:else}
    <td>{user.username}</td>
    <td>{user.email}</td>
    <td>********</td>
    <td>{user.groupnames}</td>
    <td>{user.disabled === 1 ? 'Disabled' : 'Enabled'}</td>
    <td><pre>{status}</pre></td>
    <td><button on:click={toggleEdit}>Edit</button></td>
  {/if}
</tr>
