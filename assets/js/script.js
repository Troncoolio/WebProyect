window.addEventListener('load', () => {
    const loginForm = document.getElementById('loginForm');
    if (!loginForm) {
        // Si no se encuentra el formulario, no se ejecuta el resto del script.
        return;
    }

    // --- Configuración inicial de la Interfaz de Usuario (UI) ---
    const loader = document.getElementById('loader');
    const container = document.querySelector('.container');
    setTimeout(() => {
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.style.display = 'none';
            container.classList.add('show');
        }, 500);
    }, 1000);

    const errorMessage = document.getElementById('error');
    const controlInput = document.getElementById('control');
    const passwordInput = document.getElementById('password');
    const tabs = document.querySelectorAll('.tabs button');
    let selectedRole = 'estudiante'; // Rol por defecto (prueba)

    // --- Manejo de Pestañas (Tabs) para cambiar de rol ---
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            selectedRole = tab.dataset.role;

            const controlLabel = document.querySelector('label[for="control"]');
            const passwordLabel = document.querySelector('label[for="password"]');

            // Cambia el texto de las etiquetas según el rol seleccionado
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

    // --- Lógica principal del Formulario de Login ---
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault(); // Previene la recarga de la página
        const control = controlInput.value.trim();
        const password = passwordInput.value.trim();
        errorMessage.style.display = 'none'; // Oculta mensajes de error previos

        // Validación básica para campos vacíos
        if (control === '' || password === '') {
            errorMessage.textContent = 'Por favor, complete todos los campos.';
            errorMessage.style.display = 'block';
            return;
        }

        if (selectedRole === 'aspirante') {
            // --- LÓGICA DE VALIDACIÓN PARA ASPIRANTES ---
            try {
                const response = await fetch('/api/auth/aspirante/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ficha: control, codigoAcceso: password })
                });

                if (response.ok) {
                    errorMessage.textContent = '¡Acceso correcto! Redirigiendo...';
                    errorMessage.style.backgroundColor = '#10b981';
                    errorMessage.style.display = 'block';
                    setTimeout(() => {
                        window.location.href = 'aspirantes.html';
                    }, 1000);
                } else {
                    errorMessage.textContent = 'Número de Ficha o Código de Acceso incorrectos.';
                    errorMessage.style.display = 'block';
                }
            } catch (error) {
                console.error('Error de login de aspirante:', error);
                errorMessage.textContent = 'No se pudo conectar al servidor.';
                errorMessage.style.display = 'block';
            }
        } else {
            // --- LÓGICA DE VALIDACIÓN PARA ESTUDIANTES Y PERSONAL (con JWT) ---
            try {
                const response = await fetch('/api/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username: control, password: password })
                });

                if (response.ok) {
                    const data = await response.json();
                    localStorage.setItem('jwtToken', data.token); // Guarda el token para usarlo en otras páginas

                    errorMessage.textContent = '¡Acceso correcto! Redirigiendo...';
                    errorMessage.style.backgroundColor = '#10b981';
                    errorMessage.style.display = 'block';

                    // Redirige a la página correcta según el rol devuelto por el backend
                    setTimeout(() => {
                        if (data.role === 'ROLE_PERSONAL') {
                            window.location.href = 'personal.html';
                        } else if (data.role === 'ROLE_ESTUDIANTE') {
                            window.location.href = 'estudiantes.html';
                        }
                    }, 1000);
                } else {
                    errorMessage.textContent = 'Número de control/empleado o contraseña incorrectos.';
                    errorMessage.style.display = 'block';
                }
            } catch (error) {
                console.error('Error de login:', error);
                errorMessage.textContent = 'No se pudo conectar al servidor.';
                errorMessage.style.display = 'block';
            }
        }
    });

    // --- Lógica para Ver/Ocultar Contraseña ---
    const togglePassword = document.getElementById('togglePassword');
    if (togglePassword) {
        togglePassword.addEventListener('click', () => {
            const isPassword = passwordInput.getAttribute('type') === 'password';
            passwordInput.setAttribute('type', isPassword ? 'text' : 'password');
            togglePassword.textContent = isPassword ? 'visibility_off' : 'visibility';
        });
    }
});
