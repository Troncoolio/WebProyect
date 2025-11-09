// --- Credenciales Válidas (Simulación) ---
const VALID_STUDENT_USER = 'ISC22290836';
const VALID_STUDENT_PASS = 'lucas123';
const VALID_ASPIRANTE_FICHA = '20250187';
const VALID_ASPIRANTE_CODE = 'ASP25-XYZ';
// --- Credenciales para Personal ---
const VALID_PERSONAL_USER = 'D-1024';
const VALID_PERSONAL_PASS = 'profe123';


window.addEventListener('load', () => {
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

        const controlInput = document.getElementById('control');
        const passwordInput = document.getElementById('password');
        const tabs = document.querySelectorAll('.tabs button');
        let selectedRole = 'estudiante';

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
                    controlInput.placeholder = " "; 
                } else if (selectedRole === 'personal') {
                    controlLabel.textContent = "Número de empleado";
                    passwordLabel.textContent = "Contraseña";
                    controlInput.placeholder = " ";
                } else if (selectedRole === 'aspirante') {
                    controlLabel.textContent = "Número de Ficha";
                    passwordLabel.textContent = "Código de Acceso";
                    controlInput.placeholder = " ";
                }
            });
        });


        const togglePassword = document.getElementById('togglePassword');
        if (togglePassword) {
            togglePassword.addEventListener('click', () => {
                const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
                passwordInput.setAttribute('type', type);
                togglePassword.textContent = type === 'password' ? 'lock' : 'lock_open'; 
            });
        }
    }
});


