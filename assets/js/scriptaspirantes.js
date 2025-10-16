document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('preregistroForm');
    if (!form) return;

    const messageDiv = document.getElementById('formMessage');

    form.addEventListener('submit', async (event) => {
        event.preventDefault(); // Previene el envío tradicional del formulario

        // Recolecta los datos del formulario
        const formData = {
            fullName: document.getElementById('fullName').value,
            curp: document.getElementById('curp').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
        };

        messageDiv.textContent = 'Enviando información...';
        messageDiv.className = 'form-message'; // Limpia clases previas

        try {
            // Realiza la petición POST a la API del backend
            const response = await fetch('/api/aspirantes/preregistro', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                // Si el backend responde con éxito (ej. código 201 Created)
                messageDiv.textContent = '¡Pre-registro exitoso! Recibirás un correo con los siguientes pasos.';
                messageDiv.classList.add('success');
                form.reset(); // Limpia el formulario
                form.querySelector('button').disabled = true;
                form.querySelector('button').textContent = 'Enviado';
            } else {
                // Si el backend responde con un error (ej. datos inválidos)
                const errorData = await response.json();
                messageDiv.textContent = errorData.message || 'Ocurrió un error. Por favor, verifica tus datos.';
                messageDiv.classList.add('error');
            }
        } catch (error) {
            // Si hay un error de red (ej. el servidor no responde)
            console.error('Error en pre-registro:', error);
            messageDiv.textContent = 'No se pudo conectar con el servidor. Inténtalo más tarde.';
            messageDiv.classList.add('error');
        }
    });
});
