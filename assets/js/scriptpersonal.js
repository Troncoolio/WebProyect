document.addEventListener('DOMContentLoaded', () => {

    // --- DATOS DE SIMULACIÓN PARA EL PERSONAL ---
    const personalData = {
        clases: [
            { id: 'calc', nombre: 'Cálculo', grupo: '7X-A', alumnos: [ { id: '1', nombre: 'Ana García', p1: 90, p2: 85, final: 88 }, { id: '2', nombre: 'Luis Martínez', p1: 75, p2: 80, final: 78 }, { id: '3', nombre: 'Sofía Rodríguez', p1: 100, p2: 95, final: 98 } ] },
            { id: 'db', nombre: 'Bases de Datos', grupo: '7X-B', alumnos: [ { id: '4', nombre: 'Carlos Sánchez', p1: 88, p2: 92, final: 90 }, { id: '5', nombre: 'Laura González', p1: 95, p2: 98, final: 97 }, { id: '6', nombre: 'Lucas Ramón Lopez Navia', p1: 82, p2: 88, final: 85 } ] }
        ]
    };

    let mockAnnouncements = [
        { id: 1, title: 'Recordatorio Examen Parcial 2', content: 'El examen del segundo parcial será la próxima semana. Favor de estudiar los temas vistos en clase.', audience: 'Todos', date: 'Hace 2 días' },
        { id: 2, title: 'Entrega de Proyecto Final', content: 'La fecha límite para la entrega del proyecto de Bases de Datos es el 15 de Octubre.', audience: '7X-B', date: 'Hace 5 días' }
    ];

    const personalSchedule = {
        'Lunes': [{ time: '07:00 - 09:00', subject: 'Cálculo', group: '7X-A' }],
        'Martes': [{ time: '09:00 - 11:00', subject: 'Bases de Datos', group: '7X-B' }],
        'Miércoles': [{ time: '07:00 - 09:00', subject: 'Cálculo', group: '7X-A' }],
        'Jueves': [{ time: '09:00 - 11:00', subject: 'Bases de Datos', group: '7X-B' }],
        'Viernes': []
    };

    // --- SELECTORES DE ELEMENTOS ---
    const classListContainer = document.getElementById('class-list-container');
    const classDetailsContainer = document.getElementById('class-details-container');
    const scheduleContainer = document.getElementById('personal-schedule-container');
    const announcementsList = document.getElementById('announcements-list');
    const modal = document.getElementById('announcementModal');
    const addAnnouncementBtn = document.getElementById('add-announcement-btn');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const announcementForm = document.getElementById('announcementForm');

    // --- LÓGICA DE "MIS CLASES" ---
    function displayClassDetails(classId)
    function renderClassList()

    // --- LÓGICA DE HORARIO ---
    function renderSchedule() {
        if (!scheduleContainer) return;
        scheduleContainer.innerHTML = '';
        for (const day in personalSchedule) {
            const dayBlock = document.createElement('div');
            dayBlock.className = 'day-block';
            let content = `<h3>${day}</h3>`;
            if (personalSchedule[day].length > 0) {
                content += '<ul class="class-list">';
                personalSchedule[day].forEach(item => {
                    content += `<li class="class-item-horario"><div class="class-time">${item.time}</div><div class="class-details"><strong>${item.subject}</strong><br><small>Grupo: ${item.group}</small></div></li>`;
                });
                content += '</ul>';
            } else {
                content += `<p>No hay clases programadas.</p>`;
            }
            dayBlock.innerHTML = content;
            scheduleContainer.appendChild(dayBlock);
        }
    }

    // --- LÓGICA DE ANUNCIOS ---
    function renderAnnouncements() {
        if (!announcementsList) return;
        announcementsList.innerHTML = '';
        if (mockAnnouncements.length === 0) {
            announcementsList.innerHTML = '<p class="placeholder">No hay anuncios publicados.</p>';
            return;
        }
        mockAnnouncements.forEach(ann => {
            const card = document.createElement('div');
            card.className = 'announcement-card';
            card.innerHTML = `
                <button class="announcement-delete-btn" data-id="${ann.id}">&times;</button>
                <h3>${ann.title}</h3>
                <p>${ann.content}</p>
                <div class="announcement-meta">
                    <strong>Dirigido a:</strong> ${ann.audience} | <strong>Publicado:</strong> ${ann.date}
                </div>
            `;
            announcementsList.appendChild(card);
        });
    }

    // --- MANEJO DEL MODAL ---
    function openModal() { modal.classList.add('show'); }
    function closeModal() { modal.classList.remove('show'); announcementForm.reset(); }

    addAnnouncementBtn.addEventListener('click', openModal);
    closeModalBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

    announcementForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const newAnnouncement = {
            id: Date.now(), // ID único
            title: document.getElementById('announcementTitle').value,
            content: document.getElementById('announcementContent').value,
            audience: document.getElementById('announcementAudience').value,
            date: 'Justo ahora'
        };
        mockAnnouncements.unshift(newAnnouncement); // Añade al principio de la lista
        renderAnnouncements();
        closeModal();
    });

    announcementsList.addEventListener('click', (e) => {
        if (e.target.classList.contains('announcement-delete-btn')) {
            const idToDelete = parseInt(e.target.dataset.id);
            mockAnnouncements = mockAnnouncements.filter(ann => ann.id !== idToDelete);
            renderAnnouncements();
        }
    });

    // --- NAVEGACIÓN Y FUNCIONES INICIALES ---
    displayClassDetails = function(classId) {
        const clase = personalData.clases.find(c => c.id === classId);
        if (!clase) return;
        let tableHTML = `<h3>${clase.nombre} - Grupo ${clase.grupo}</h3><table class="student-grades-table"><thead><tr><th>Nombre</th><th>P1</th><th>P2</th><th>Final</th></tr></thead><tbody>`;
        clase.alumnos.forEach(a => { tableHTML += `<tr><td>${a.nombre}</td><td><input type="number" value="${a.p1}"></td><td><input type="number" value="${a.p2}"></td><td><strong>${a.final}</strong></td></tr>`; });
        tableHTML += `</tbody></table><button class="btn" style="margin-top: 20px;" onclick="alert('Cambios guardados (simulación)')">Guardar Cambios</button>`;
        classDetailsContainer.innerHTML = tableHTML;
    };
    renderClassList = function() {
        if (!classListContainer) return;
        classListContainer.innerHTML = '';
        personalData.clases.forEach(clase => {
            const classDiv = document.createElement('div');
            classDiv.className = 'class-item';
            classDiv.dataset.classId = clase.id;
            classDiv.innerHTML = `<strong>${clase.nombre}</strong><br><small>Grupo: ${clase.grupo}</small>`;
            classListContainer.appendChild(classDiv);
        });
        document.querySelectorAll('.class-item').forEach(item => {
            item.addEventListener('click', () => {
                document.querySelectorAll('.class-item').forEach(i => i.classList.remove('selected'));
                item.classList.add('selected');
                displayClassDetails(item.dataset.classId);
            });
        });
    };

    // --- NAVEGACIÓN PRINCIPAL ---
    document.querySelectorAll('nav a[data-section], .quick-links a[data-section]').forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            const sectionId = link.dataset.section;
            document.querySelectorAll('.content-section').forEach(sec => sec.classList.remove('active'));
            document.getElementById(sectionId).classList.add('active');
            document.querySelectorAll('nav a').forEach(a => a.classList.remove('active'));
            document.querySelector(`nav a[data-section="${sectionId}"]`)?.classList.add('active');
        });
    });

    // Cierre de sesión
    const logoutBtn = document.getElementById('logoutBtn');
    if(logoutBtn) {
        logoutBtn.addEventListener('click', e => { e.preventDefault(); window.location.href = 'index.html'; });
    }
    
    // --- LLAMADAS INICIALES AL CARGAR LA PÁGINA ---
    renderClassList();
    renderSchedule();
    renderAnnouncements();
});