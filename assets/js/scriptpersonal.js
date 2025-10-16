document.addEventListener('DOMContentLoaded', () => {
    let activeCharts = {}; // Objeto para gestionar los gráficos y evitar duplicados

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

    // --- FUNCIONES QUE GENERAN HTML (NO NECESITAN CAMBIOS) ---
    // Estas funciones toman un objeto de datos (ahora desde la API) y devuelven HTML.
    
    function calculateAverage(gradesArray) {
        if (!gradesArray || gradesArray.length === 0) return 0;
        const total = gradesArray.reduce((sum, item) => sum + Number(item.calif), 0);
        return Math.round(total / gradesArray.length);
    }
    
    function renderGradebookView(clase) {
        let tableHTML = `<div style="overflow-x:auto;"><table class="gradebook-table"><thead><tr><th style="width: 25%;">Nombre del Alumno</th><th>Parcial 1</th><th style="width: 10%;">Prom. P1</th><th>Parcial 2</th><th style="width: 10%;">Prom. P2</th><th style="width: 10%;">Final</th></tr></thead><tbody>`;
        clase.alumnos.forEach(alumno => {
            const prom1 = calculateAverage(alumno.parcial1);
            const prom2 = calculateAverage(alumno.parcial2);
            const finalGrade = Math.round((prom1 + prom2) / 2);
            tableHTML += `<tr data-student-id="${alumno.id}"><td><a href="#" class="student-name-link" data-student-id="${alumno.id}" data-class-id="${clase.id}">${alumno.nombre}</a></td>
                          <td class="gradebook-activities">${alumno.parcial1.map((act, index) => `<div class="activity-item"><span>${act.actividad}</span><input class="grade-input" type="number" min="0" max="100" value="${act.calif}" data-student-id="${alumno.id}" data-partial="parcial1" data-activity-index="${index}"></div>`).join('')}</td>
                          <td class="promedio-cell">${prom1}</td>
                          <td class="gradebook-activities">${alumno.parcial2.map((act, index) => `<div class="activity-item"><span>${act.actividad}</span><input class="grade-input" type="number" min="0" max="100" value="${act.calif}" data-student-id="${alumno.id}" data-partial="parcial2" data-activity-index="${index}"></div>`).join('')}</td>
                          <td class="promedio-cell">${prom2}</td><td class="final-grade-cell">${finalGrade}</td></tr>`;
        });
        tableHTML += `</tbody></table></div><button class="btn btn-save-grades" style="margin-top: 20px;">Guardar Cambios</button>`;
        let chartsHTML = `<div class="charts-container"><div class="chart-card"><h4>Aprobación del Grupo</h4><canvas id="pieChart"></canvas></div><div class="chart-card"><h4>Distribución de Calificaciones</h4><canvas id="barChart"></canvas></div></div>`;
        return tableHTML + chartsHTML;
    }

    function renderAttendanceView(clase) {
        // ... Esta función se mantiene igual, ya que solo genera HTML a partir del objeto 'clase'
        return `<h3>Registro de Asistencia</h3><p>Contenido de asistencia para la clase ${clase.nombre}.</p><button class="btn">Guardar Asistencia</button>`;
    }

    function renderResourcesView(clase) {
        // ... Esta función se mantiene igual, ya que solo genera HTML a partir del objeto 'clase'
        return `<h3>Recursos y Tareas</h3><p>Contenido de recursos para la clase ${clase.nombre}.</p><button class="btn">Añadir Recurso</button>`;
    }

    function renderClassCharts(clase) {
        if (activeCharts.pie) activeCharts.pie.destroy();
        if (activeCharts.bar) activeCharts.bar.destroy();
        let aprobados = 0, reprobados = 0;
        clase.alumnos.forEach(alumno => {
            const prom1 = calculateAverage(alumno.parcial1);
            const prom2 = calculateAverage(alumno.parcial2);
            const finalGrade = Math.round((prom1 + prom2) / 2);
            if (finalGrade >= 70) aprobados++; else reprobados++;
        });
        const ctxPie = document.getElementById('pieChart')?.getContext('2d');
        if(ctxPie) activeCharts.pie = new Chart(ctxPie, { type: 'doughnut', data: { labels: ['Aprobados', 'Reprobados'], datasets: [{ data: [aprobados, reprobados], backgroundColor: ['#28a745', '#dc3545'] }] } });
    }

    // --- FUNCIONES DE RENDERIZADO (Consumen la API) ---

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
            classDetailsContainer.innerHTML = `
                <h3><span>${clase.nombre} - Grupo ${clase.grupo}</span></h3>
                <div class="view-tabs">
                    <button class="tab-button active" data-view="grades">Calificaciones</button>
                    <button class="tab-button" data-view="attendance">Asistencia</button>
                    <button class="tab-button" data-view="resources">Recursos</button>
                </div>
                <div id="grades-view" class="tab-view active" data-class-id="${clase.id}">${renderGradebookView(clase)}</div>
                <div id="attendance-view" class="tab-view">${renderAttendanceView(clase)}</div>
                <div id="resources-view" class="tab-view">${renderResourcesView(clase)}</div>`;
            renderClassCharts(clase);
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
    
    // --- MANEJADORES DE EVENTOS PARA INTERACTUAR CON LA API ---

    function setupEventListeners() {
        document.querySelectorAll('nav a[data-section]').forEach(link => {
            link.addEventListener('click', e => {
                e.preventDefault();
                document.querySelectorAll('.content-section').forEach(sec => sec.classList.remove('active'));
                document.getElementById(link.dataset.section)?.classList.add('active');
                document.querySelectorAll('nav a').forEach(a => a.classList.remove('active'));
                link.classList.add('active');
            });
        });
        
        document.getElementById('add-announcement-btn').addEventListener('click', () => {
            document.getElementById('announcementModal').classList.add('show');
        });
        
        document.getElementById('closeModalBtn').addEventListener('click', () => {
            document.getElementById('announcementModal').classList.remove('show');
        });

        document.getElementById('announcementForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const announcementData = { title: e.target.announcementTitle.value, content: e.target.announcementContent.value, audience: e.target.announcementAudience.value };
            try {
                const response = await fetchWithAuth('/api/personal/anuncios', { method: 'POST', body: JSON.stringify(announcementData) });
                if (response && response.ok) {
                    document.getElementById('announcementModal').classList.remove('show');
                    e.target.reset();
                    renderAnnouncements();
                } else { alert('No se pudo crear el anuncio.'); }
            } catch (error) { console.error('Error al crear anuncio:', error); }
        });

        document.getElementById('announcements-list').addEventListener('click', async (e) => {
            const deleteButton = e.target.closest('.announcement-delete-btn');
            if (deleteButton) {
                const id = deleteButton.dataset.id;
                if (confirm('¿Estás seguro de que quieres eliminar este anuncio?')) {
                    try {
                        const response = await fetchWithAuth(`/api/personal/anuncios/${id}`, { method: 'DELETE' });
                        if (response && response.ok) {
                            renderAnnouncements();
                        } else { alert('No se pudo eliminar el anuncio.'); }
                    } catch (error) { console.error('Error al eliminar anuncio:', error); }
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
        
        document.getElementById('class-details-container').addEventListener('click', async e => {
            if(e.target.classList.contains('btn-save-grades')) {
                const classId = document.querySelector('#grades-view').dataset.classId;
                const updates = Array.from(document.querySelectorAll('.grade-input')).map(input => ({
                    studentId: input.dataset.studentId,
                    partial: input.dataset.partial,
                    activityIndex: parseInt(input.dataset.activityIndex),
                    newGrade: parseInt(input.value)
                }));
                try {
                    const response = await fetchWithAuth(`/api/personal/clases/${classId}/calificaciones`, { method: 'PUT', body: JSON.stringify(updates) });
                    if(response && response.ok) {
                        alert('Calificaciones guardadas con éxito.');
                        displayClassDetails(classId); // Recargar vista
                    } else { alert('Error al guardar calificaciones.'); }
                } catch(error) { console.error('Error al guardar:', error); }
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
    }

    // --- INICIALIZACIÓN DE LA APLICACIÓN ---
    function initializeApp() {
        setupEventListeners();
        renderClassList();
        renderAnnouncements();
    }
    
    initializeApp();
});
