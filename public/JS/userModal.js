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