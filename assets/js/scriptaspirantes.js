document.addEventListener('DOMContentLoaded', () => {
    // Selecciona el formulario y el div para mensajes
    const form = document.getElementById('preregistroForm');
    if (!form) return; // Si no encuentra el formulario, no hace nada

    const messageDiv = document.getElementById('formMessage');

    // Escucha el evento 'submit' del formulario
    form.addEventListener('submit', async (event) => {
        // Previene que el formulario se envíe de la forma tradicional y recargue la página
        event.preventDefault();

        // 1. Recolecta los datos ingresados por el aspirante
        const formData = {
            fullName: document.getElementById('fullName').value.trim(),
            curp: document.getElementById('curp').value.trim(),
            email: document.getElementById('email').value.trim(),
            phone: document.getElementById('phone').value.trim(),
        };

        // Muestra un mensaje de carga al usuario
        messageDiv.textContent = 'Enviando información...';
        messageDiv.className = 'form-message'; // Limpia clases de éxito/error previas

        try {
            // 2. Realiza la petición POST a la API del backend
            // El backend deberá tener un endpoint en esta ruta para recibir los datos
            const response = await fetch('/api/aspirantes/preregistro', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                // 3. Si el backend responde con éxito (código 200-299)
                messageDiv.textContent = '¡Pre-registro exitoso! Recibirás un correo con los siguientes pasos.';
                messageDiv.classList.add('success'); // Aplica el estilo de éxito
                form.reset(); // Limpia el formulario
                form.querySelector('button').disabled = true; // Deshabilita el botón para evitar envíos duplicados
                form.querySelector('button').textContent = 'Enviado';
            } else {
                // 4. Si el backend responde con un error (ej. datos inválidos)
                const errorData = await response.json(); // Intenta leer el mensaje de error del backend
                messageDiv.textContent = errorData.message || 'Ocurrió un error. Por favor, verifica tus datos.';
                messageDiv.classList.add('error'); // Aplica el estilo de error
            }
        } catch (error) {
            // 5. Si hay un error de red (ej. el servidor no responde)
            console.error('Error en pre-registro:', error);
            messageDiv.textContent = 'No se pudo conectar con el servidor. Inténtalo más tarde.';
            messageDiv.classList.add('error');
        }
    });
});
