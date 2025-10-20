// --- Credenciales Válidas (Simulación) ---
const VALID_STUDENT_USER = 'ISC22290836';
const VALID_STUDENT_PASS = 'lucas123';
const VALID_ASPIRANTE_FICHA = '20250187';
const VALID_ASPIRANTE_CODE = 'ASP25-XYZ';
// --- Credenciales para Personal ---
const VALID_PERSONAL_USER = 'D-1024';
const VALID_PERSONAL_PASS = 'profe123';


// Espera a que la página se cargue completamente
window.addEventListener('load', () => {
    
    // --- LÓGICA PARA LA PÁGINA DE LOGIN ---
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        const loader = document.getElementById('loader');
        const container = document.querySelector('.container');
        setTimeout(() => {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.style.display = 'none';
                container.classList.add('show');
            }, 500);
        }, 1500);

        const errorMessage = document.getElementById('error');
        const controlInput = document.getElementById('control');
        const passwordInput = document.getElementById('password');
        const tabs = document.querySelectorAll('.tabs button');
        let selectedRole = 'estudiante';

        // --- Manejo de Pestañas (Tabs) ---
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                selectedRole = tab.dataset.role;
                
                const controlLabel = document.querySelector('label[for="control"]');
                const passwordLabel = document.querySelector('label[for="password"]');

                if (selectedRole === 'estudiante') {
                    controlLabel.textContent = "Número de control";
                    passwordLabel.textContent = "Contraseña";
                } else if (selectedRole === 'personal') {
                    controlLabel.textContent = "Número de empleado";
                    passwordLabel.textContent = "Contraseña";
                } else if (selectedRole === 'aspirante') {
                    controlLabel.textContent = "Número de Ficha";
                    passwordLabel.textContent = "Código de Acceso";
                }
            });
        });

        // --- Lógica del Formulario de Login ---
        loginForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const control = controlInput.value.trim();
            const password = passwordInput.value.trim();
            errorMessage.style.backgroundColor = '';

            if (control === '' || password === '') {
                errorMessage.textContent = 'Por favor, complete todos los campos.';
                errorMessage.style.display = 'block';
            } else {
                errorMessage.style.display = 'none';
                
                if (selectedRole === 'estudiante') {
                    if (control === VALID_STUDENT_USER && password === VALID_STUDENT_PASS) {
                        errorMessage.textContent = '¡Acceso correcto! Redirigiendo...';
                        errorMessage.style.backgroundColor = '#10b981';
                        errorMessage.style.display = 'block';
                        setTimeout(() => { window.location.href = 'estudiantes.html'; }, 1000);
                    } else {
                        errorMessage.textContent = 'Número de control o contraseña incorrectos.';
                        errorMessage.style.display = 'block';
                    }
                } else if (selectedRole === 'aspirante') {
                    if (control === VALID_ASPIRANTE_FICHA && password === VALID_ASPIRANTE_CODE) {
                        errorMessage.textContent = '¡Acceso correcto! Redirigiendo al portal de aspirantes...';
                        errorMessage.style.backgroundColor = '#10b981';
                        errorMessage.style.display = 'block';
                        setTimeout(() => { window.location.href = 'aspirantes.html'; }, 1000);
                    } else {
                        errorMessage.textContent = 'Número de Ficha o Código de Acceso incorrectos.';
                        errorMessage.style.display = 'block';
                    }
                // --- Bloque de validación para Personal ---
                } else if (selectedRole === 'personal') {
                    if (control === VALID_PERSONAL_USER && password === VALID_PERSONAL_PASS) {
                        errorMessage.textContent = '¡Acceso correcto! Redirigiendo al portal del personal...';
                        errorMessage.style.backgroundColor = '#10b981';
                        errorMessage.style.display = 'block';
                        setTimeout(() => { window.location.href = 'personal.html'; }, 1000);
                    } else {
                        errorMessage.textContent = 'Número de empleado o contraseña incorrectos.';
                        errorMessage.style.display = 'block';
                    }
                }
            }
        });

        // --- Lógica para Ver/Ocultar Contraseña ---
        const togglePassword = document.getElementById('togglePassword');
        if (togglePassword) {
            togglePassword.addEventListener('click', () => {
                const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
                passwordInput.setAttribute('type', type);
                togglePassword.textContent = type === 'password' ? 'visibility' : 'visibility_off';
            });
        }
    }

    // --- Lógica para la Página de Estudiantes ---
    const studentSidebar = document.querySelector('.sidebar');
    if (studentSidebar) {
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (event) => {
                event.preventDefault();
                window.location.href = 'index.html'; 
            });
        }
    }
});

