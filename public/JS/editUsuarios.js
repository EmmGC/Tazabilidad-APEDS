/* ── SAMPLE DATA (replace with your API call) ── */
// id, nombre, correo, puesto
  const sampleUsers = [
    { id: 1, nombre: 'Santiago Martínez López',   correo: 'test.usuario02@example.org',     puesto: 'Unidad de producción' },
    { id: 2, nombre: 'Mateo Rodríguez García',    correo: 'usuario.prueba01@example.com',   puesto: 'Cosecha de vegetales' },
    { id: 3, nombre: 'Valentina Hernández Pérez', correo: 'demo.cuenta03@example.net',      puesto: 'Empacado de vegetales' },
    { id: 4, nombre: 'Sebastián Torres Díaz',     correo: 'prueba.mail04@example.com',      puesto: 'Transporte de vegetales' },
    { id: 5, nombre: 'Isabella Morales Sánchez',  correo: 'usuario.fake05@example.org',     puesto: 'Comercialización de vegetales' },
    { id: 6, nombre: 'Camila González Ramírez',   correo: 'testing.correos06@example.net',  puesto: 'Cosecha de vegetales' },
    { id: 7, nombre: 'Diego Castillo Vargas',     correo: 'demo.usuario07@example.com',     puesto: 'Transporte de vegetales' },
  ];

  /* ── RENDER TABLE ── */
  function renderUsers(users) {
    const tbody = document.getElementById('usersTableBody');
    tbody.innerHTML = users.map(u => `
      <tr>
        <td>${u.id}</td>
        <td>${u.nombre}</td>
        <td class="td-correo">${u.correo}</td>
        <td>${u.puesto}</td>
        <td class="td-action">
          <button class="btn-gear" title="Configurar usuario" onclick="handleEditUser(${u.id})">
            <!-- gear SVG -->
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="Black"><path d="m370-80-16-128q-13-5-24.5-12T307-235l-119 50L78-375l103-78q-1-7-1-13.5v-27q0-6.5 1-13.5L78-585l110-190 119 50q11-8 23-15t24-12l16-128h220l16 128q13 5 24.5 12t22.5 15l119-50 110 190-103 78q1 7 1 13.5v27q0 6.5-2 13.5l103 78-110 190-118-50q-11 8-23 15t-24 12L590-80H370Zm70-80h79l14-106q31-8 57.5-23.5T639-327l99 41 39-68-86-65q5-14 7-29.5t2-31.5q0-16-2-31.5t-7-29.5l86-65-39-68-99 42q-22-23-48.5-38.5T533-694l-13-106h-79l-14 106q-31 8-57.5 23.5T321-633l-99-41-39 68 86 64q-5 15-7 30t-2 32q0 16 2 31t7 30l-86 65 39 68 99-42q22 23 48.5 38.5T427-266l13 106Zm42-180q58 0 99-41t41-99q0-58-41-99t-99-41q-59 0-99.5 41T342-480q0 58 40.5 99t99.5 41Zm-2-140Z"/></svg>
          </button>
        </td>
      </tr>
    `).join('');
  }

  renderUsers(sampleUsers);

  /* ── HOOKS ── */
  function handleEditUser(id) {
    // TODO: open edit modal or navigate to user detail page
    console.log('Editar usuario ID:', id);
  }

  function handleNewUser() {
    // TODO: open new-user modal or navigate to creation page
    console.log('Nuevo usuario');
  }

const token = localStorage.getItem('access_token');
async function getUsers() {
    const response = await fetch('/api/userAuth/getUsuarios', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.json();
}

getUsers().then(data => console.log(data));