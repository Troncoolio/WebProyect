// Ocultar loader después de 5 segundos y mostrar container
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  const container = document.querySelector('.container');

  setTimeout(() => {
    loader.style.opacity = '0';
    setTimeout(() => {
      loader.style.display = 'none';
      container.classList.add('show');
    }, 500); // Suaviza transición
  }, 5000); // Duración total del loader: 5 segundos
});

// Validación del formulario
const loginForm = document.getElementById('loginForm');
const errorMessage = document.getElementById('error');

let selectedRole = 'estudiante'; // Valor inicial

loginForm.addEventListener('submit', function(e) {
  const control = document.getElementById('control').value.trim();
  const password = document.getElementById('password').value.trim();

  if (control === '' || password === '') {
    e.preventDefault(); 
    errorMessage.style.display = 'block';
  } else {
    errorMessage.style.display = 'none';
    alert('Formulario enviado correctamente como ' + selectedRole);
  }
});

// Manejo de tabs
const tabs = document.querySelectorAll('.tabs button');
tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    selectedRole = tab.dataset.role; // Actualiza el rol seleccionado
  });
});
