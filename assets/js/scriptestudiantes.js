document.addEventListener('DOMContentLoaded', () => {
    // Inicializa la librería de animaciones
    AOS.init({ duration: 600, once: true, easing: 'ease-in-out' });

    // --- FUNCIÓN AUXILIAR PARA PETICIONES CON TOKEN ---
    // Esta función es el núcleo de la comunicación segura con el backend.
    async function fetchWithAuth(url, options = {}) {
        const token = localStorage.getItem('jwtToken');
        // Si no hay token, el usuario no ha iniciado sesión. Redirigir a la página de login.
        if (!token) {
            window.location.href = 'index.html';
            return; // Detiene la ejecución
        }

        // Añade el token JWT a la cabecera 'Authorization' de cada petición.
        const headers = {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            ...options.headers,
        };

        const response = await fetch(url, { ...options, headers });

        // Si el token es inválido o ha expirado, el backend devolverá un error 401 o 403.
        // En ese caso, se limpia el token guardado y se redirige al login para una nueva autenticación.
        if (response.status === 401 || response.status === 403) {
            localStorage.removeItem('jwtToken');
            window.location.href = 'index.html';
            return;
        }
        return response;
    }

    // --- FUNCIONES DE RENDERIZADO (Consumen la API) ---

    // Carga los datos principales del perfil y saluda al usuario.
    async function renderProfile() {
        try {
            const response = await fetchWithAuth('/api/estudiantes/perfil');
            if (!response || !response.ok) throw new Error('Error al cargar perfil');
            const data = await response.json();

            // Rellena la UI con los datos del perfil
            document.querySelector('#inicio .greeting h2').textContent = `Hola, ${data.nombre} 👋`;
            document.querySelector('#perfil .profile-header h2').textContent = data.nombreCompleto;
            document.querySelector('#perfil .profile-header p').textContent = `Matrícula: ${data.matricula}`;
            document.getElementById('profile-pic').src = data.fotoUrl || 'https://i.ibb.co/615DoWp/user-placeholder.png';
            document.getElementById('email').value = data.email;
            document.getElementById('telefono').value = data.telefono;
            document.getElementById('direccion').value = data.direccion;
            document.getElementById('carrera').value = data.carrera;
            document.getElementById('semestre').value = data.semestre;
            document.getElementById('grupo').value = data.grupo;
            document.getElementById('tutor').value = data.tutor;
        } catch (error) {
            console.error('Error al cargar perfil:', error);
            // Puedo mostrar un mensaje de error en la UI aquí
        }
    }

    // Carga el horario de hoy para la sección de inicio.
    async function renderTodaySchedule() {
        const scheduleBody = document.getElementById('today-schedule-body');
        scheduleBody.innerHTML = '<tr><td colspan="2">Cargando horario...</td></tr>';
        try {
            const response = await fetchWithAuth('/api/estudiantes/horario/hoy');
            if (!response || !response.ok) throw new Error('Error al cargar horario');
            const clases = await response.json();

            scheduleBody.innerHTML = '';
            if (clases.length === 0) {
                scheduleBody.innerHTML = '<tr><td colspan="2" style="text-align: center;">No tienes clases programadas para hoy.</td></tr>';
            } else {
                clases.forEach(cls => {
                    scheduleBody.innerHTML += `<tr><td>${cls.time}</td><td>${cls.subject}</td></tr>`;
                });
            }
        } catch (error) {
            console.error(error);
            scheduleBody.innerHTML = '<tr><td colspan="2" class="error">No se pudo cargar el horario.</td></tr>';
        }
    }

    // Carga las calificaciones y actualiza los gráficos.
    async function renderGrades() {
        try {
            const response = await fetchWithAuth('/api/estudiantes/calificaciones');
            if (!response || !response.ok) throw new Error('Error al cargar calificaciones');
            const gradesData = await response.json();

            // Lógica para rellenar la tabla de calificaciones
            const tableBody = document.querySelector('.grades-detail tbody');
            tableBody.innerHTML = '';
            gradesData.materias.forEach(materia => {
                const statusClass = materia.estatus === 'Aprobada' ? 'status-aprobada' : 'status-reprobada';
                tableBody.innerHTML += `
                    <tr>
                        <td class="subject-name">${materia.nombre}</td>
                        <td>${materia.parcial1}</td>
                        <td>${materia.parcial2}</td>
                        <td>${materia.faltas}</td>
                        <td>${materia.final}</td>
                        <td><span class="status-badge ${statusClass}">${materia.estatus}</span></td>
                    </tr>
                `;
            });

            // Lógica para actualizar los resúmenes y gráficos
            document.getElementById('approved-count').textContent = gradesData.resumen.aprobadas;
            document.getElementById('failed-count').textContent = gradesData.resumen.reprobadas;
            document.querySelector('#averageChart').previousElementSibling.textContent = gradesData.resumen.promedioGeneral;

            // Vuelve a inicializar los gráficos con los nuevos datos.
            // La función `initCharts` debe ser adaptada para recibir `gradesData`.
            initCharts(gradesData);
        } catch(error) {
            console.error("Error al cargar calificaciones:", error);
        }
    }

    // --- LÓGICA PARA ENVIAR DATOS AL BACKEND ---

    // Actualiza los datos de contacto del perfil.
    async function saveProfileChanges() {
        const profileData = {
            email: document.getElementById('email').value,
            telefono: document.getElementById('telefono').value,
            direccion: document.getElementById('direccion').value,
        };

        try {
            const response = await fetchWithAuth('/api/estudiantes/perfil', {
                method: 'PUT',
                body: JSON.stringify(profileData),
            });

            if (response && response.ok) {
                alert('Perfil actualizado correctamente.');
            } else {
                alert('No se pudo actualizar el perfil.');
            }
        } catch (error) {
            console.error('Error al guardar perfil:', error);
            alert('Error de conexión al guardar el perfil.');
        }
    }


    // --- INICIALIZACIÓN DE LA APLICACIÓN ---
    function initializeApp() {
        // La mayoría de tus funciones de UI (toggleDarkMode, toggleSidebar, etc.) no necesitan cambiar.
        setupTheme();
        // setupEventListeners() necesita ser ajustada para llamar a `saveProfileChanges`
        // en lugar de solo cambiar el estado de los inputs.
        setupEventListeners();

        // Llamamos a las funciones que cargan los datos iniciales desde el backend
        renderProfile();
        renderTodaySchedule();
        // Las demás funciones de carga se pueden llamar cuando el usuario entra a la sección
        // por ejemplo, dentro de la función `openSection`.
        
        const originalOpenSection = window.openSection;
        window.openSection = function(id, isInitial = false) {
            if (id === 'calificaciones') {
                renderGrades(); // Carga las calificaciones solo cuando se visita la sección
            }
            // Puedes añadir más casos para otras secciones (pagos, horario, etc.)
            
            originalOpenSection(id, isInitial);
        };

        // Abre la sección de inicio por defecto
        openSection('inicio', true);
    }
    
    initializeApp();
});
