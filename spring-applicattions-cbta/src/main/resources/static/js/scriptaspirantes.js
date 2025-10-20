document.addEventListener('DOMContentLoaded', () => {
    // --- LÓGICA DE PRE-REGISTRO ---
    const form = document.getElementById('preregistroForm');
    const messageDiv = document.getElementById('formMessage');

    if (form) {
        form.addEventListener('submit', (event) => {
            // Previene que el formulario se envíe de la forma tradicional
            event.preventDefault();

            // Simulación de envío de datos
            messageDiv.textContent = 'Enviando información...';
            messageDiv.className = 'form-message'; // Limpia clases previas

            setTimeout(() => {
                // Aquí iría la lógica para enviar los datos a un servidor.
                // Como es una simulación aun, solo mostraremos un mensaje de éxito.
                messageDiv.textContent = '¡Pre-registro exitoso! Recibirás un correo con los siguientes pasos.';
                messageDiv.classList.add('success');

                // Opcional o prueba: deshabilitar el formulario después del envío
                form.reset(); // Limpia los campos
                form.querySelector('button').disabled = true;
                form.querySelector('button').textContent = 'Enviado';

            }, 1500); // Simula un retraso de red
        });
    }

    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (event) => {
            event.preventDefault(); 
            window.location.href = '/index'; 
        });
    }
});
