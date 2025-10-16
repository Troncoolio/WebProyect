document.addEventListener('DOMContentLoaded', () => {
    AOS.init({ duration: 600, once: true, easing: 'ease-in-out' });

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

    // --- FUNCIONES DE RENDERIZADO (Consumen la API) ---

    async function renderProfile() {
        try {
            const response = await fetchWithAuth('/api/estudiantes/perfil');
            if (!response || !response.ok) throw new Error('Error al cargar perfil');
            const data = await response.json();
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
        }
    }

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

    async function renderWeeklySchedule() {
        const container = document.getElementById('weekly-schedule-container');
        container.innerHTML = '<p>Cargando horario semanal...</p>';
        try {
            const response = await fetchWithAuth('/api/estudiantes/horario/semanal');
            if (!response || !response.ok) throw new Error('Error al cargar horario semanal');
            const weeklySchedule = await response.json();
            container.innerHTML = '';
            for (const day in weeklySchedule) {
                const dayBlock = document.createElement('div');
                dayBlock.className = 'day-block';
                let content = `<h3>${day}</h3>`;
                if (weeklySchedule[day].length > 0) {
                    content += '<ul class="class-list">';
                    weeklySchedule[day].forEach(item => {
                        content += `<li class="class-item" style="border-left-color: ${item.color};"><div class="class-time">${item.time}</div><div class="class-details"><span class="material-symbols-outlined class-icon">${item.icon}</span><span class="class-subject">${item.subject}</span></div></li>`;
                    });
                    content += '</ul>';
                } else {
                    content += `<div class="empty-day"><span class="material-symbols-outlined">weekend</span><span>Día libre</span></div>`;
                }
                dayBlock.innerHTML = content;
                container.appendChild(dayBlock);
            }
        } catch (error) {
            console.error(error);
            container.innerHTML = '<p class="error">No se pudo cargar el horario semanal.</p>';
        }
    }

    async function renderGrades() {
        try {
            const response = await fetchWithAuth('/api/estudiantes/calificaciones');
            if (!response || !response.ok) throw new Error('Error al cargar calificaciones');
            const gradesData = await response.json();
            const tableBody = document.querySelector('.grades-detail tbody');
            tableBody.innerHTML = '';
            gradesData.materias.forEach(materia => {
                const statusClass = materia.estatus === 'Aprobada' ? 'status-aprobada' : 'status-reprobada';
                tableBody.innerHTML += `<tr><td class="subject-name">${materia.nombre}</td><td>${materia.parcial1}</td><td>${materia.parcial2}</td><td>${materia.faltas}</td><td>${materia.final}</td><td><span class="status-badge ${statusClass}">${materia.estatus}</span></td></tr>`;
            });
            document.getElementById('approved-count').textContent = gradesData.resumen.aprobadas;
            document.getElementById('failed-count').textContent = gradesData.resumen.reprobadas;
            document.querySelector('#averageChart').previousElementSibling.textContent = gradesData.resumen.promedioGeneral;
            initCharts(gradesData);
        } catch (error) {
            console.error("Error al cargar calificaciones:", error);
        }
    }
    
    async function renderPayments() {
        const pendingBody = document.getElementById('pending-payments-body');
        const paidBody = document.getElementById('paid-payments-body');
        pendingBody.innerHTML = '<tr><td colspan="4">Cargando...</td></tr>';
        paidBody.innerHTML = '<tr><td colspan="5">Cargando...</td></tr>';
        try {
            const response = await fetchWithAuth('/api/estudiantes/pagos');
            if (!response || !response.ok) throw new Error('Error al cargar pagos');
            const paymentsData = await response.json();
            pendingBody.innerHTML = '';
            paidBody.innerHTML = '';
            paymentsData.pendientes.forEach(p => {
                pendingBody.innerHTML += `<tr><td>${p.concepto}</td><td>${p.fechaLimite}</td><td>$${p.monto.toFixed(2)}</td><td class="action-cell"><button class="btn btn-pay"><span class="material-symbols-outlined">payment</span> Pagar Ahora</button></td></tr>`;
            });
            paymentsData.historial.forEach(p => {
                paidBody.innerHTML += `<tr><td>${p.concepto}</td><td>${p.fechaPago}</td><td>$${p.monto.toFixed(2)}</td><td><span class="status-paid">Pagado</span></td><td class="action-cell"><button class="btn btn-secondary btn-receipt"><span class="material-symbols-outlined">receipt_long</span>Ver Recibo</button></td></tr>`;
            });
            document.getElementById('total-paid').textContent = `$${paymentsData.resumen.totalPagado.toFixed(2)}`;
            document.getElementById('total-due').textContent = `$${paymentsData.resumen.totalPendiente.toFixed(2)}`;
        } catch(error) {
            console.error("Error al cargar pagos:", error);
        }
    }

    // --- LÓGICA PARA ENVIAR DATOS AL BACKEND ---

    async function saveProfileChanges() {
        const profileData = {
            email: document.getElementById('email').value,
            telefono: document.getElementById('telefono').value,
            direccion: document.getElementById('direccion').value,
        };
        try {
            const response = await fetchWithAuth('/api/estudiantes/perfil', { method: 'PUT', body: JSON.stringify(profileData) });
            if (response && response.ok) {
                alert('Perfil actualizado correctamente.');
                return true;
            }
            alert('No se pudo actualizar el perfil.');
            return false;
        } catch (error) {
            console.error('Error al guardar perfil:', error);
            alert('Error de conexión al guardar el perfil.');
            return false;
        }
    }

    // --- LÓGICA DE LA INTERFAZ DE USUARIO (UI) ---

    function setupTheme() {
        if (localStorage.getItem('theme') === 'dark' || (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            document.body.classList.add('dark');
        }
    }

    function toggleDarkMode() {
        document.body.classList.toggle('dark');
        localStorage.setItem('theme', document.body.classList.contains('dark') ? 'dark' : 'light');
        if (document.getElementById('calificaciones').classList.contains('active')) {
            renderGrades();
        }
    }

    function toggleSidebar() {
        document.querySelector('.sidebar').classList.toggle('show');
        document.querySelector('.main').classList.toggle('shift');
        document.querySelector('.toggle-sidebar').classList.toggle('shift');
        document.getElementById('overlay').classList.toggle('show');
    }

    function closeSidebar() {
        document.querySelector('.sidebar').classList.remove('show');
        document.querySelector('.main').classList.remove('shift');
        document.querySelector('.toggle-sidebar').classList.remove('shift');
        document.getElementById('overlay').classList.remove('show');
    }
    
    function toggleSubmenu(e) {
        e.preventDefault();
        const toggle = e.currentTarget;
        toggle.classList.toggle('active');
        const submenu = toggle.nextElementSibling;
        submenu.style.display = submenu.style.display === 'flex' ? 'none' : 'flex';
    }

    function initCharts(gradesData) {
        const createChart = (ctx, config) => { if(ctx) { Chart.getChart(ctx)?.destroy(); new Chart(ctx, config); } };
        const isDark = document.body.classList.contains('dark');
        const gridColor = isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)';
        const labelColor = isDark ? '#e2e8f0' : '#2d3748';
        createChart(document.getElementById('averageChart')?.getContext('2d'), { type: 'doughnut', data: { datasets: [{ data: [gradesData.resumen.promedioGeneral, 100 - gradesData.resumen.promedioGeneral], backgroundColor: ['#63adf2', isDark ? '#4a5568' : '#e2e8f0'], borderWidth: 0 }] }, options: { cutout: '70%', plugins: { legend: { display: false }, tooltip: { enabled: false } } } });
        createChart(document.getElementById('trendChart')?.getContext('2d'), { type: 'line', data: { labels: gradesData.tendencia.labels, datasets: [{ label: 'Promedio', data: gradesData.tendencia.data, borderColor: '#63adf2', backgroundColor: 'rgba(99,173,242,0.2)', fill: true, tension: 0.4 }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: false, ticks: { color: labelColor }, grid: { color: gridColor } }, x: { ticks: { color: labelColor }, grid: { color: 'transparent' } } } } });
        createChart(document.getElementById('radarChart')?.getContext('2d'), { type: 'radar', data: { labels: gradesData.desempeno.labels, datasets: [{ label: 'Calificación', data: gradesData.desempeno.data, backgroundColor: 'rgba(99, 173, 242, 0.2)', borderColor: '#63adf2', borderWidth: 2 }] }, options: { responsive: true, maintainAspectRatio: false, scales: { r: { suggestedMin: 50, suggestedMax: 100, grid: { color: gridColor }, angleLines: { color: gridColor }, pointLabels: { color: labelColor }, ticks: { color: labelColor, backdropColor: 'transparent' } } }, plugins: { legend: { labels: { color: labelColor } } } } });
    }
    
    function setupEventListeners() {
        document.querySelectorAll('nav a[data-section], .quick-access-item a[data-target]').forEach(el => { el.addEventListener('click', e => { e.preventDefault(); openSection(el.dataset.section || el.dataset.target); }); });
        const editBtn = document.getElementById('editProfileBtn');
        const saveBtn = document.getElementById('saveProfileBtn');
        const editableInputs = document.querySelectorAll('#email, #telefono, #direccion');
        editBtn.addEventListener('click', () => { editableInputs.forEach(input => input.disabled = false); editBtn.style.display = 'none'; saveBtn.style.display = 'flex'; });
        document.querySelector('.profile-form').addEventListener('submit', async (e) => { e.preventDefault(); const success = await saveProfileChanges(); if (success) { editableInputs.forEach(input => input.disabled = true); editBtn.style.display = 'flex'; saveBtn.style.display = 'none'; } });
        document.getElementById('avatar-container').addEventListener('click', () => { document.getElementById('file-upload').click(); });
        document.getElementById('file-upload').addEventListener('change', (event) => { const file = event.target.files[0]; if (file) { console.log("Subiendo archivo:", file.name); document.getElementById('profile-pic').src = URL.createObjectURL(file); } });
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) { logoutBtn.addEventListener('click', (e) => { e.preventDefault(); localStorage.removeItem('jwtToken'); window.location.href = 'index.html'; }); }
    }

    function openSection(id, isInitial = false) {
        const loader = document.getElementById('loader');
        if (!isInitial) {
            loader.classList.add('show');
            closeSidebar();
        }
        const currentSection = document.getElementById(id);
        if (currentSection && !currentSection.hasAttribute('data-loaded')) {
            if (id === 'horario') renderWeeklySchedule();
            if (id === 'calificaciones') renderGrades();
            if (id === 'pagos') renderPayments();
            currentSection.setAttribute('data-loaded', 'true');
        }
        setTimeout(() => {
            document.querySelectorAll('.content-section').forEach(sec => sec.classList.remove('active'));
            if (currentSection) currentSection.classList.add('active');
            document.querySelectorAll('nav a[data-section], .quick-access-item a').forEach(link => { link.classList.toggle('active', (link.dataset.section || link.dataset.target) === id); });
            AOS.refresh();
            if (!isInitial) loader.classList.remove('show');
        }, isInitial ? 50 : 400);
    }

    window.toggleDarkMode = toggleDarkMode;
    window.toggleSidebar = toggleSidebar;
    window.closeSidebar = closeSidebar;
    window.toggleSubmenu = toggleSubmenu;
    window.openSection = openSection;

    function initializeApp() {
        setupTheme();
        setupEventListeners();
        renderProfile();
        renderTodaySchedule();
        openSection('inicio', true);
    }
    
    initializeApp();
});
