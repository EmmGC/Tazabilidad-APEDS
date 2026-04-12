const token = localStorage.getItem('access_token');
let userData = {}
/* ── RENDER TABLE ── */
async function renderUsers(users) {
  const tbody = document.getElementById('usersTableBody');
  tbody.innerHTML = users.map(u => `
      <tr>
        <td>${u.id}</td>
        <td class="td-correo">${u.email}</td>
        <td class="td-crete-date">${u.created_at}</td>
        <td class="td-action">
          <button class="btn-gear" title="Configurar usuario" data-id="${u.id}">
            <!-- gear SVG -->
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="Black"><path d="m370-80-16-128q-13-5-24.5-12T307-235l-119 50L78-375l103-78q-1-7-1-13.5v-27q0-6.5 1-13.5L78-585l110-190 119 50q11-8 23-15t24-12l16-128h220l16 128q13 5 24.5 12t22.5 15l119-50 110 190-103 78q1 7 1 13.5v27q0 6.5-2 13.5l103 78-110 190-118-50q-11 8-23 15t-24 12L590-80H370Zm70-80h79l14-106q31-8 57.5-23.5T639-327l99 41 39-68-86-65q5-14 7-29.5t2-31.5q0-16-2-31.5t-7-29.5l86-65-39-68-99 42q-22-23-48.5-38.5T533-694l-13-106h-79l-14 106q-31 8-57.5 23.5T321-633l-99-41-39 68 86 64q-5 15-7 30t-2 32q0 16 2 31t7 30l-86 65 39 68 99-42q22 23 48.5 38.5T427-266l13 106Zm42-180q58 0 99-41t41-99q0-58-41-99t-99-41q-59 0-99.5 41T342-480q0 58 40.5 99t99.5 41Zm-2-140Z"/></svg>
          </button>
        </td>
      </tr>
    `).join('');
}

getUsers().then(users => {
  userData = users;
  renderUsers(users);
});

/* ── HOOKS ── */
const editModal = document.getElementById('editModal');
const btnCloseEdit = document.getElementById('btnCloseEdit');
let activeUserId = null;

document.getElementById('usersTableBody').addEventListener('click', (e) => {
  const btn = e.target.closest('.btn-gear');
  if (!btn) return;

  const id   = btn.dataset.id;
  const user = userData.find(u => u.id === id);
  if (!user) return;

  activeUserId = id;
  const el = document.getElementById('editUserId');
  el.textContent = `ID: ${id.slice(0, 8)}…`;
  el.title = id;
  document.getElementById('editEmail').value    = user.email;
  document.getElementById('editPassword').value = '';
  editModal.classList.add('open');
});

function handleEditUser(id) {
  const user = userData.find(u => u.id === id);
  if (!user) return;

  activeUserId = id;
  const el = document.getElementById('editUserId');
  el.textContent = `ID: ${id.slice(0, 8)}…`;
  el.title = id;
  document.getElementById('editEmail').value = user.correo;
  document.getElementById('editPassword').value = '';

  editModal.classList.add('open');
}

// close buttons
btnCloseEdit.addEventListener('click', () => editModal.classList.remove('open'));
editModal.addEventListener('click', (e) => {
  if (e.target === editModal) editModal.classList.remove('open');
});

// save
document.getElementById('btnSaveUser').addEventListener('click', () => {
  const email = document.getElementById('editEmail').value.trim();
  const password = document.getElementById('editPassword').value;

  if (!email) return;

  // TODO: call your API to update the user
  console.log('Guardar cambios → ID:', activeUserId, { email, password: password || '(sin cambios)' });
  editModal.classList.remove('open');
});

// delete
document.getElementById('btnDeleteUser').addEventListener('click', () => {
  if (!confirm(`¿Eliminar usuario ID ${activeUserId}? Esta acción no se puede deshacer.`)) return;

  // TODO: call your API to delete the user, then re-render the table
  console.log('Eliminar usuario → ID:', activeUserId);
  editModal.classList.remove('open');
});

function handleNewUser() {
  // TODO: open new-user modal or navigate to creation page
  console.log('Nuevo usuario');
}


async function getUsers() {
  const response = await fetch('/api/userAuth/getUsuarios', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  const data = await response.json();

  const users = data.users.map(u => ({
    id: u.id,
    email: u.email,
    created_at: new Date(u.created_at).toLocaleDateString("en-GB"),
  }));

  return users;
}

// Edit User Modal

