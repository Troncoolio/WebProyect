document.addEventListener('DOMContentLoaded', () => {
    let activeCharts = {}; // Para gestionar los gráficos de Chart.js

    // --- FUNCIÓN AUXILIAR PARA PETICIONES CON TOKEN ---
    async function fetchWithAuth(url, options = {}) {
        const token = localStorage.getItem('jwtToken');
        if (!token) {
            window.location.href = 'index.html';
            return;
        }
        const headers = {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            ...options.headers,
        };
        const response = await fetch(url, { ...options, headers });
        if (response.status === 401 || response.status === 403) {
            localStorage.removeItem('jwtToken');
            window.location.href = 'index.html';
            return;
        }
        return response;
    }

    // --- FUNCIONES DE RENDERIZADO Y LÓGICA DE API ---

    // Carga la lista de clases del profesor
    async function renderClassList() {
        const classListContainer = document.getElementById('class-list-container');
        classListContainer.innerHTML = '<p>Cargando clases...</p>';
        try {
            const response = await fetchWithAuth('/api/personal/clases');
            if (!response.ok) throw new Error('Error al cargar clases');
            const clases = await response.json();

            classListContainer.innerHTML = '';
            clases.forEach(clase => {
                const div = document.createElement('div');
                div.className = 'class-item';
                div.dataset.classId = clase.id;
                div.innerHTML = `<strong>${clase.nombre}</strong><br><small>Grupo: ${clase.grupo}</small>`;
                classListContainer.appendChild(div);
            });
        } catch (error) {
            console.error(error);
            classListContainer.innerHTML = '<p class="error">No se pudieron cargar las clases.</p>';
        }
    }

    // Carga los anuncios
    async function renderAnnouncements() {
        const announcementsList = document.getElementById('announcements-list');
        announcementsList.innerHTML = '<p>Cargando anuncios...</p>';
        try {
            const response = await fetchWithAuth('/api/personal/anuncios');
            if (!response.ok) throw new Error('Error al cargar anuncios');
            const anuncios = await response.json();

            announcementsList.innerHTML = '';
            if (anuncios.length === 0) {
                announcementsList.innerHTML = '<p class="placeholder">No hay anuncios publicados.</p>';
            } else {
                anuncios.forEach(ann => {
                    const card = document.createElement('div');
                    card.className = 'announcement-card';
                    card.innerHTML = `<button class="announcement-delete-btn" data-id="${ann.id}" title="Eliminar"><span class="material-symbols-outlined">delete</span></button><h3>${ann.title}</h3><p>${ann.content}</p><div class="announcement-meta"><strong>Dirigido a:</strong> ${ann.audience} | <strong>Publicado:</strong> ${ann.date}</div>`;
                    announcementsList.appendChild(card);
                });
            }
        } catch (error) {
            console.error(error);
            announcementsList.innerHTML = '<p class="error">No se pudieron cargar los anuncios.</p>';
        }
    }

    // --- MANEJADORES DE EVENTOS PARA INTERACTUAR CON LA API ---

    // Crear un nuevo anuncio
    document.getElementById('announcementForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const announcementData = {
            title: document.getElementById('announcementTitle').value,
            content: document.getElementById('announcementContent').value,
            audience: document.getElementById('announcementAudience').value,
        };
        try {
            const response = await fetchWithAuth('/api/personal/anuncios', {
                method: 'POST',
                body: JSON.stringify(announcementData),
            });
            if (response.ok) {
                document.getElementById('announcementModal').classList.remove('show');
                document.getElementById('announcementForm').reset();
                renderAnnouncements(); // Recarga la lista para mostrar el nuevo anuncio
            } else {
                alert('No se pudo crear el anuncio.');
            }
        } catch (error) {
            console.error('Error al crear anuncio:', error);
            alert('Error de conexión al crear el anuncio.');
        }
    });

    // Borrar un anuncio
    document.getElementById('announcements-list').addEventListener('click', async (e) => {
        const deleteButton = e.target.closest('.announcement-delete-btn');
        if (deleteButton) {
            const announcementId = deleteButton.dataset.id;
            if (confirm('¿Estás seguro de que quieres eliminar este anuncio?')) {
                try {
                    const response = await fetchWithAuth(`/api/personal/anuncios/${announcementId}`, {
                        method: 'DELETE',
                    });
                    if (response.ok) {
                        renderAnnouncements(); // Recarga la lista para quitar el anuncio eliminado
                    } else {
                        alert('No se pudo eliminar el anuncio.');
                    }
                } catch (error) {
                    console.error('Error al eliminar anuncio:', error);
                    alert('Error de conexión al eliminar el anuncio.');
                }
            }
        }
    });

    // --- INICIALIZACIÓN ---
    function initializeApp() {
        setupEventListeners(); // Mantiene tus listeners de UI
        renderClassList();
        renderAnnouncements();
        // renderSchedule(); // También debería ser una llamada a la API
    }
    
    initializeApp();
});
