/* ── DATA ── */
let userData = [];
let activeUserId = null;
let modalMode = 'create'; // 'create' | 'edit'
const token = localStorage.getItem('access_token');

/* ── SAMPLE DATA — replace getUsers() with your Supabase call ── */
async function getUsers() {
    const response = await fetch('/api/userAuth/getTelegram', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    const data = await response.json();
    return data;
}

/* ── RENDER TABLE ── */
function renderUsers(users) {
    const tbody = document.getElementById('usersTableBody');

    if (!users.length) {
        tbody.innerHTML = `<tr><td colspan="4" class="empty-state">No hay usuarios registrados.</td></tr>`;
        return;
    }

    tbody.innerHTML = users.map(u => `
      <tr>
        <td class="td-id">${u.telegram_id}</td>
        <td>${u.nombre ?? '<span style="color:var(--muted);font-style:italic">Sin nombre</span>'}</td>
        <td>
          ${u.tabla_asignada
            ? `<span class="tabla-badge">${u.tabla_asignada}</span>`
            : `<span style="color:var(--muted);font-style:italic;font-size:.85rem">Sin asignar</span>`}
        </td>
        <td class="td-action">
          <button class="btn-gear" data-id="${u.telegram_id}" title="Configurar usuario">
            <svg xmlns="http://www.w3.org/2000/svg" height="22px" viewBox="0 -960 960 960" width="22px" fill="currentColor">
              <path d="m370-80-16-128q-13-5-24.5-12T307-235l-119 50L78-375l103-78q-1-7-1-13.5v-27q0-6.5 1-13.5L78-585l110-190 119 50q11-8 23-15t24-12l16-128h220l16 128q13 5 24.5 12t22.5 15l119-50 110 190-103 78q1 7 1 13.5v27q0 6.5-2 13.5l103 78-110 190-118-50q-11 8-23 15t-24 12L590-80H370Zm70-80h79l14-106q31-8 57.5-23.5T639-327l99 41 39-68-86-65q5-14 7-29.5t2-31.5q0-16-2-31.5t-7-29.5l86-65-39-68-99 42q-22-23-48.5-38.5T533-694l-13-106h-79l-14 106q-31 8-57.5 23.5T321-633l-99-41-39 68 86 64q-5 15-7 30t-2 32q0 16 2 31t7 30l-86 65 39 68 99-42q22 23 48.5 38.5T427-266l13 106Zm42-180q58 0 99-41t41-99q0-58-41-99t-99-41q-59 0-99.5 41T342-480q0 58 40.5 99t99.5 41Zm-2-140Z"/>
            </svg>
          </button>
        </td>
      </tr>
    `).join('');
}

/* ── LOAD ── */
getUsers().then(users => {
    userData = users;
    renderUsers(users);
});

/* ── GEAR CLICK via delegation ── */
document.getElementById('usersTableBody').addEventListener('click', (e) => {
    const btn = e.target.closest('.btn-gear');
    if (!btn) return;

    const id = Number(btn.dataset.id);
    const user = userData.find(u => u.telegram_id === id);
    if (!user) return;

    openEditModal(user);
});

/* ── MODAL HELPERS ── */
const editModal = document.getElementById('editModal');

function openEditModal(user) {
    modalMode = 'edit';
    activeUserId = user.telegram_id;

    document.getElementById('editModalTitle').textContent = 'Editar usuario';
    document.getElementById('editTelegramId').value = user.telegram_id;
    document.getElementById('editNombre').value = user.nombre ?? '';
    document.getElementById('editTabla').value = user.tabla_asignada ?? '';
    document.getElementById('btnDeleteUser').style.display = '';

    editModal.classList.add('open');
}

function openCreateModal() {
    modalMode = 'create';
    activeUserId = null;

    document.getElementById('editModalTitle').textContent = 'Nuevo usuario';
    document.getElementById('editTelegramId').value = '';
    document.getElementById('editNombre').value = '';
    document.getElementById('editTabla').value = '';
    document.getElementById('btnDeleteUser').style.display = 'none';

    editModal.classList.add('open');
}

function closeEditModal() {
    editModal.classList.remove('open');
}

document.getElementById('btnNuevoUsuario').addEventListener('click', openCreateModal);
document.getElementById('btnCloseEdit').addEventListener('click', closeEditModal);
editModal.addEventListener('click', (e) => { if (e.target === editModal) closeEditModal(); });

/* ── SAVE ── */
document.getElementById('btnSaveUser').addEventListener('click', async () => {
    const telegramId = Number(document.getElementById('editTelegramId').value.trim());
    const nombre = document.getElementById('editNombre').value.trim();
    const tabla = document.getElementById('editTabla').value;

    if (!telegramId) { alert('Por favor ingresa el Telegram ID.'); return; }
    if (!tabla) { alert('Por favor selecciona una tabla asignada.'); return; }

    if (!tabla) {
        alert('Por favor selecciona una tabla asignada.');
        return;
    }

    if (modalMode === 'create') {
        const telegramId = document.getElementById('editTelegramId').value.trim();
        if (!telegramId) {
            alert('Por favor ingresa el Telegram ID.');
            return;
        }
        const response = await fetch('/api/userAuth/createTelegram', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ telegramId, nombre, tabla })
        });

        return await response.json();
    } else {
        const response = await fetch('/api/userAuth/updateTelegram', {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                original_telegram_id: activeUserId,  // to find the row
                telegram_id: telegramId,             // new value
                nombre, 
                tabla_asignada: tabla 
            })
        });

        const result = await response.json();
        if (!response.ok) {
            alert(result.error || 'Error al actualizar usuario.');
            return;
        }
        alert('Usuario actualizado correctamente.');
    }

    location.reload();
});

/* ── DELETE ── */
document.getElementById('btnDeleteUser').addEventListener('click', async () => {
    if (!confirm(`¿Eliminar el usuario con Telegram ID ${activeUserId}? Esta acción no se puede deshacer.`)) return;
    console.log(activeUserId)
    const response = await fetch('/api/userAuth/deleteTelegram', {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ activeUserId })
    });

    const result = await response.json();
    if (!response.ok) {
        alert(result.error || 'Error al eliminar usuario.');
        return;
    }

    alert('Usuario de telegram eliminado exitosamente');
    location.reload();
});