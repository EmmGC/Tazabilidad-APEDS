import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const profileBtn  = document.getElementById('profileBtn');
const modal       = document.getElementById('profileModal');

profileBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  modal.classList.toggle('open');
});

// Close when clicking outside the card
modal.addEventListener('click', (e) => {
  if (e.target === modal) modal.classList.remove('open');
});

// Populate with real user data once you have it
function setModalUser(name, email) {
  document.getElementById('modalName').textContent  = name;
  document.getElementById('modalEmail').textContent = email;
}


// Logout
const supabase = createClient(
  'https://sgoumhpsgalrodctpuhd.supabase.co',
  'sb_publishable_ISZDWXJkcR7X7Ha2u179kg_3_WAQhTb'
);
function clearCookies() {
  document.cookie.split(';').forEach(cookie => {
    const name = cookie.split('=')[0].trim();
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
  });
}
async function signOut() {
  await supabase.auth.signOut();
  await fetch('/logout', { method: 'POST' }); 
  clearCookies();
  window.location.href = '/';
}

document.getElementById('btnLogout').addEventListener('click', signOut);