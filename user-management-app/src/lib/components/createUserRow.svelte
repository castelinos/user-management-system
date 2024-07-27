<!-- TableBodyRow.svelte -->
<script>
  import MultiSelect from 'svelte-multiselect';
  import { createEventDispatcher } from 'svelte';
  import { createUserApi, updateUserGroupApi } from '../api/api';

  export let username = '';
  export let email = '';
  export let password = '';
  export let groups = [];
  export let disabled = 0;
  export let availableGroups = [];

  let status = '';
  const dispatch = createEventDispatcher();

  async function createUser() {
    try {
      status = '';
      const user = {
        username: username,
        password: password,
        email: email,
        groups: groups,
        disabled: disabled
      }
      const response = await createUserApi(user);
      console.log(response)
      const userGroupResponse = await updateUserGroupApi(user);
      console.log(userGroupResponse);
      if (response.status === 200 && userGroupResponse.status === 200) {
          dispatch('userCreated', { success: true });
          status = response.data.message;
      } else {
        status = response.data.message;
      }
    } catch(error) {
      status = error.response.data.message
      console.log(error)
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
  <td><input type="text" bind:value={username} /></td>
  <td><input type="text" bind:value={email} /></td>
  <td><input type="password" bind:value={password} /></td>
  <td>
    <MultiSelect
    id="group"
    options={availableGroups.map(group => group.groupname)}
    selected={groups}
    on:add={(event) => {
      handleGroupChange(event)
    }}
    on:remove={(event) => {
      handleGroupRemove(event)
    }}
   />
  </td>
  <td>
    <select bind:value={disabled}>
        <option value="0">Enabled</option>
        <option value="1">Disabled</option>
    </select>
  </td>
  <td><pre>{status}</pre></td>
  <td><button on:click={createUser}>Create User</button></td>
</tr>
