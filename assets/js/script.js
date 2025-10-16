window.addEventListener('load', () => {
    const loginForm = document.getElementById('loginForm');
    if (!loginForm) return;

    // --- Configuración inicial de la UI ---
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
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const control = controlInput.value.trim();
        const password = passwordInput.value.trim();
        errorMessage.style.display = 'none';

        if (control === '' || password === '') {
            errorMessage.textContent = 'Por favor, complete todos los campos.';
            errorMessage.style.display = 'block';
            return;
        }

        // Si es aspirante, redirige directamente. No necesita login seguro.
        if (selectedRole === 'aspirante') {
            window.location.href = 'aspirantes.html';
            return;
        }

        try {
            // 1. Envía las credenciales al backend
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: control, password: password })
            });

            if (response.ok) {
                // 2. Si la respuesta es exitosa, obtiene el token y el rol
                const data = await response.json(); // Espera recibir { "token": "...", "role": "..." }

                // 3. Guarda el token en el navegador para usarlo en futuras peticiones
                localStorage.setItem('jwtToken', data.token);

                errorMessage.textContent = '¡Acceso correcto! Redirigiendo...';
                errorMessage.style.backgroundColor = '#10b981';
                errorMessage.style.display = 'block';

                // 4. Redirige al portal correspondiente según el rol recibido
                setTimeout(() => {
                    if (data.role === 'ROLE_PERSONAL') {
                        window.location.href = 'personal.html';
                    } else if (data.role === 'ROLE_ESTUDIANTE') {
                        window.location.href = 'estudiantes.html';
                    } else {
                        errorMessage.textContent = 'Rol de usuario no reconocido.';
                        errorMessage.style.display = 'block';
                    }
                }, 1000);

            } else {
                // Si las credenciales son incorrectas, el backend devuelve un error
                errorMessage.textContent = 'Número de control/empleado o contraseña incorrectos.';
                errorMessage.style.display = 'block';
            }
        } catch (error) {
            console.error('Error de login:', error);
            errorMessage.textContent = 'No se pudo conectar al servidor. Inténtelo más tarde.';
            errorMessage.style.display = 'block';
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
});
