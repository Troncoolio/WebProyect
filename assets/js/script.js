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

    if (selectedRole === 'aspirante') {
        // --- LÓGICA DE VALIDACIÓN PARA ASPIRANTES ---
        try {
            const response = await fetch('/api/auth/aspirante/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ficha: control, codigoAcceso: password })
            });

            if (response.ok) {
                // Si el backend da el visto bueno (200 OK), entonces redirigimos
                errorMessage.textContent = '¡Acceso correcto! Redirigiendo...';
                errorMessage.style.backgroundColor = '#10b981';
                errorMessage.style.display = 'block';
                setTimeout(() => {
                    window.location.href = 'aspirantes.html';
                }, 1000);
            } else {
                // Si el backend responde con un error (401), mostramos el mensaje
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
                localStorage.setItem('jwtToken', data.token);

                errorMessage.textContent = '¡Acceso correcto! Redirigiendo...';
                errorMessage.style.backgroundColor = '#10b981';
                errorMessage.style.display = 'block';

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
