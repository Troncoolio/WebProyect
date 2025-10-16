document.addEventListener('DOMContentLoaded', () => {
    let activeCharts = {};

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

    async function renderClassList() {
        const classListContainer = document.getElementById('class-list-container');
        classListContainer.innerHTML = '<p>Cargando clases...</p>';
        try {
            const response = await fetchWithAuth('/api/personal/clases');
            if (!response || !response.ok) throw new Error('Error al cargar clases');
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

    async function displayClassDetails(classId) {
        const classDetailsContainer = document.getElementById('class-details-container');
        classDetailsContainer.innerHTML = '<p>Cargando detalles...</p>';
        try {
            const response = await fetchWithAuth(`/api/personal/clases/${classId}`);
            if (!response || !response.ok) throw new Error('Error al cargar detalles');
            const clase = await response.json();
            // Llama a las funciones que generan el HTML (estas funciones no cambian)
            // classDetailsContainer.innerHTML = renderGradebookView(clase) ... etc.
            // Para simplicidad, se muestra un placeholder:
            classDetailsContainer.innerHTML = `<h3>Clase: ${clase.nombre} - Grupo ${clase.grupo}</h3><p>Aquí se mostrarían los detalles completos, calificaciones, asistencia y recursos para esta clase.</p>`;
        } catch (error) {
            console.error(error);
            classDetailsContainer.innerHTML = '<p class="error">No se pudieron cargar los detalles.</p>';
        }
    }

    async function renderAnnouncements() {
        const announcementsList = document.getElementById('announcements-list');
        announcementsList.innerHTML = '<p>Cargando anuncios...</p>';
        try {
            const response = await fetchWithAuth('/api/personal/anuncios');
            if (!response || !response.ok) throw new Error('Error al cargar anuncios');
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
            if (response && response.ok) {
                document.getElementById('announcementModal').classList.remove('show');
                e.target.reset();
                renderAnnouncements();
            } else {
                alert('No se pudo crear el anuncio.');
            }
        } catch (error) {
            console.error('Error al crear anuncio:', error);
        }
    });

    document.getElementById('announcements-list').addEventListener('click', async (e) => {
        const deleteButton = e.target.closest('.announcement-delete-btn');
        if (deleteButton) {
            const announcementId = deleteButton.dataset.id;
            if (confirm('¿Estás seguro de que quieres eliminar este anuncio?')) {
                try {
                    const response = await fetchWithAuth(`/api/personal/anuncios/${announcementId}`, {
                        method: 'DELETE',
                    });
                    if (response && response.ok) {
                        renderAnnouncements();
                    } else {
                        alert('No se pudo eliminar el anuncio.');
                    }
                } catch (error) {
                    console.error('Error al eliminar anuncio:', error);
                }
            }
        }
    });

    document.getElementById('class-list-container').addEventListener('click', (e) => {
        const classItem = e.target.closest('.class-item');
        if (classItem) {
            document.querySelectorAll('.class-item.selected').forEach(el => el.classList.remove('selected'));
            classItem.classList.add('selected');
            displayClassDetails(classItem.dataset.classId);
        }
    });

    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('jwtToken');
            window.location.href = 'index.html';
        });
    }

    function initializeApp() {
        renderClassList();
        renderAnnouncements();
    }

    initializeApp();
});
