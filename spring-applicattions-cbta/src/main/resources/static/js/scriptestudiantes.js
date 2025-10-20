document.addEventListener('DOMContentLoaded', () => {
    AOS.init({ duration: 600, once: true, easing: 'ease-in-out' });

    // --- DATOS DE SIMULACIÓN ---
    let currentMonthDate = new Date();
    let notifications = [
        { id: 1, read: false, icon: 'school', color: 'var(--argentinian-blue)', title: 'Nueva calificación en Química.', text: 'Tu nota final es 74.', time: 'Hace 30m' },
        { id: 2, read: false, icon: 'event_upcoming', color: 'var(--danger)', title: 'Recordatorio: Entrega de Proyecto.', text: 'El proyecto de Física es para mañana.', time: 'Hace 2h' },
        { id: 3, read: false, icon: 'payments', color: 'var(--warning)', title: 'Pago de colegiatura pendiente.', text: 'La fecha límite es en 3 días.', time: 'Ayer' }
    ];

    let payments = [
        { id: 1, concept: 'Colegiatura Septiembre', dueDate: '2025-09-10', amount: 1500.00, status: 'pending' },
        { id: 2, concept: 'Colegiatura Agosto', paidDate: '2025-08-05', amount: 1500.00, status: 'paid', method: 'Tarjeta de Crédito' },
        { id: 3, concept: 'Inscripción Semestral', paidDate: '2025-07-15', amount: 3000.00, status: 'paid', method: 'Transferencia' }
    ];

    const weeklySchedule = {
        'Lunes': [
            { time: '07:00', subject: 'Cálculo', icon: 'calculate', color: '#3b82f6' },
            { time: '09:00', subject: 'Estructura de Datos', icon: 'data_object', color: '#8b5cf6' }
        ],
        'Martes': [
            { time: '09:00', subject: 'Bases de Datos', icon: 'database', color: '#f59e0b' },
            { time: '11:00', subject: 'Taller de Ética', icon: 'gavel', color: '#10b981' }
        ],
        'Miércoles': [
            { time: '07:00', subject: 'Cálculo', icon: 'calculate', color: '#3b82f6' },
            { time: '09:00', subject: 'Estructura de Datos', icon: 'data_object', color: '#8b5cf6' }
        ],
        'Jueves': [
            { time: '09:00', subject: 'Bases de Datos', icon: 'database', color: '#f59e0b' },
            { time: '11:00', subject: 'Investigación', icon: 'history_edu', color: '#ef4444' }
        ],
        'Viernes': [
             { time: '08:00', subject: 'Tutoría', icon: 'groups', color: '#63adf2' }
        ],
        'Sábado': [],
        'Domingo': []
    };

    const calendarTooltip = document.createElement('div');
    calendarTooltip.id = 'calendar-tooltip';
    document.body.appendChild(calendarTooltip);
    const loader = document.getElementById('loader');

    // --- INICIALIZACIÓN ---
    function initializeApp() {
        setupTheme();
        setupEventListeners();
        renderNotifications();
        renderCalendar(currentMonthDate.getFullYear(), currentMonthDate.getMonth());
        renderTodaySchedule();
        openSection('inicio', true);
    }

    // --- FUNCIONES GLOBALES ---
    function setupTheme() {
        if (localStorage.getItem('theme') === 'dark' || (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            document.body.classList.add('dark');
        }
    }
    window.toggleDarkMode = () => {
        document.body.classList.toggle('dark');
        localStorage.setItem('theme', document.body.classList.contains('dark') ? 'dark' : 'light');
        if (document.getElementById('calificaciones').classList.contains('active')) initCharts();
    };

    window.toggleSidebar = () => {
        document.querySelector('.sidebar').classList.toggle('show');
        document.querySelector('.main').classList.toggle('shift');
        document.querySelector('.toggle-sidebar').classList.toggle('shift');
        document.querySelector('#overlay').classList.toggle('show');
    };
    window.closeSidebar = () => {
        document.querySelector('.sidebar').classList.remove('show');
        document.querySelector('.main').classList.remove('shift');
        document.querySelector('.toggle-sidebar').classList.remove('shift');
        document.querySelector('#overlay').classList.remove('show');
    };

    window.toggleSubmenu = e => {
        e.preventDefault();
        const toggle = e.currentTarget;
        toggle.classList.toggle('active');
        toggle.nextElementSibling.style.display = toggle.classList.contains('active') ? 'flex' : 'none';
    };

    window.openSection = function(id, isInitial = false) {
        if (!isInitial) loader.classList.add('show');
        closeSidebar();

        setTimeout(() => {
            document.querySelectorAll('.content-section').forEach(sec => sec.classList.remove('active'));
            document.getElementById(id)?.classList.add('active');
            document.querySelectorAll('nav a[data-section], .quick-access-item a').forEach(link => {
                link.classList.toggle('active', (link.dataset.section || link.dataset.target) === id);
            });

            if (id === 'inicio') {
                setTimeout(() => document.querySelectorAll('#inicio .fill').forEach(bar => bar.style.width = bar.dataset.fill), 100);
            }
            if (id === 'calificaciones') initCharts();
            if (id === 'horario') renderWeeklySchedule();
            if (id === 'pagos') renderPaymentsPage();

            AOS.refresh();
            if (!isInitial) loader.classList.remove('show');
        }, isInitial ? 50 : 400);
    }
    
    window.showModal = (modalId, title, body) => {
        const modal = document.getElementById(modalId);
        if (title) modal.querySelector('.modal-header h3').textContent = title;
        if (body) modal.querySelector('.modal-content > div:last-child').innerHTML = body;
        modal.classList.add('show');
    };
    window.closeModal = (modalId) => document.getElementById(modalId).classList.remove('show');

    // --- LÓGICA DE PAGOS ---
    function renderPaymentsPage() { /* ... */ }
    function handlePayment(paymentId) { /* ... */ }
    function showReceipt(paymentId) { /* ... */ }

    // --- MANEJO DE EVENTOS (Event Listeners) ---
    function setupEventListeners() {
        document.querySelectorAll('nav a[data-section], .quick-access-item a[data-target]').forEach(el => el.addEventListener('click', e => { e.preventDefault(); openSection(el.dataset.section || el.dataset.target); }));
        const editBtn = document.getElementById('editProfileBtn');
        const saveBtn = document.getElementById('saveProfileBtn');
        const editableInputs = document.querySelectorAll('#email, #telefono, #direccion');
        editBtn.addEventListener('click', () => { editableInputs.forEach(input => input.disabled = false); editBtn.style.display = 'none'; saveBtn.style.display = 'flex'; });
        
        // --- LÓGICA PARA EL BOTÓN DE CERRAR SESIÓN ---
        const logoutBtn = document.getElementById('logoutBtn');
        if(logoutBtn) {
            logoutBtn.addEventListener('click', (event) => {
                event.preventDefault(); // Previene que el enlace '#' recargue la página
                
                window.location.href = '/index'; 
            });
        }
        
        document.querySelector('.profile-form').addEventListener('submit', e => { e.preventDefault(); editableInputs.forEach(input => input.disabled = true); editBtn.style.display = 'flex'; saveBtn.style.display = 'none'; alert('Perfil guardado.'); });
        document.getElementById('avatar-container').addEventListener('click', () => document.getElementById('file-upload').click());
        document.getElementById('file-upload').addEventListener('change', (e) => {
            if (e.target.files[0]) document.getElementById('profile-pic').src = URL.createObjectURL(e.target.files[0]);
        });
        document.getElementById('passwordChangeForm').addEventListener('submit', e => { e.preventDefault(); alert('Contraseña actualizada (simulación).'); e.target.reset(); });
        document.querySelectorAll('.accordion-header').forEach(h => h.addEventListener('click', () => { const c = h.nextElementSibling; h.classList.toggle('active'); c.style.maxHeight = c.style.maxHeight ? null : c.scrollHeight + "px"; }));
        document.getElementById('notifications-list').addEventListener('click', e => { if (e.target.classList.contains('notification-dismiss')) { const id = parseInt(e.target.closest('.notification-item').dataset.id); notifications = notifications.filter(n => n.id !== id); renderNotifications(); } });
        document.getElementById('clear-notifications-btn').addEventListener('click', () => { notifications = []; renderNotifications(); });
        const calendarEl = document.getElementById('calendar');
        document.getElementById('prevMonthBtn')?.addEventListener('click', () => { currentMonthDate.setMonth(currentMonthDate.getMonth() - 1); renderCalendar(currentMonthDate.getFullYear(), currentMonthDate.getMonth()); });
        document.getElementById('nextMonthBtn')?.addEventListener('click', () => { currentMonthDate.setMonth(currentMonthDate.getMonth() + 1); renderCalendar(currentMonthDate.getFullYear(), currentMonthDate.getMonth()); });
        calendarEl?.addEventListener('mouseover', e => { if (e.target.tagName === 'TD' && e.target.dataset.title) { calendarTooltip.textContent = e.target.dataset.title; calendarTooltip.style.opacity = '1'; } });
        calendarEl?.addEventListener('mouseout', () => { calendarTooltip.style.opacity = '0'; });
        calendarEl?.addEventListener('mousemove', e => { calendarTooltip.style.left = e.pageX + 15 + 'px'; calendarTooltip.style.top = e.pageY + 15 + 'px'; });
        calendarEl?.addEventListener('click', e => { if (e.target.dataset.title) { showModal('eventModal', `Evento del ${e.target.textContent} de ${document.getElementById('monthYear').textContent.split(' ')[0]}`, `<p>${e.target.dataset.title}</p>`); } });
        document.querySelectorAll('.modal').forEach(m => m.addEventListener('click', e => { if (e.target === m) closeModal(m.id); }));
        document.getElementById('pagos').addEventListener('click', e => {
            if (e.target.closest('.btn-pay')) {
                const paymentId = parseInt(e.target.closest('tr').dataset.id);
                handlePayment(paymentId);
            }
            if (e.target.closest('.btn-receipt')) {
                const paymentId = parseInt(e.target.closest('tr').dataset.id);
                showReceipt(paymentId);
            }
        });

        // ===== MANEJO DE CARGA DE ARCHIVOS =====
        function handleFileUpload(inputId, statusId) {
            const input = document.getElementById(inputId);
            const statusDiv = document.getElementById(statusId);
            if(input && statusDiv) {
                input.addEventListener('change', () => {
                    if (input.files.length > 0) {
                        statusDiv.textContent = input.files[0].name;
                        statusDiv.style.fontStyle = 'normal';
                        statusDiv.style.color = 'var(--success)';
                    }
                });
            }
        }
        handleFileUpload('doc-ficha', 'doc-ficha-status');
        handleFileUpload('doc-pago', 'doc-pago-status');
    }

    // --- FUNCIONES DE RENDERIZADO ---
    function renderTodaySchedule() {
        const scheduleBody = document.getElementById('today-schedule-body');
        if (!scheduleBody) return;
        const dayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
        const todayIndex = new Date().getDay();
        const todayName = dayNames[todayIndex];
        const todayClasses = weeklySchedule[todayName] || [];
        scheduleBody.innerHTML = '';
        if (todayClasses.length > 0) {
            todayClasses.forEach(cls => {
                const row = document.createElement('tr');
                row.innerHTML = `<td>${cls.time}</td><td>${cls.subject}</td>`;
                scheduleBody.appendChild(row);
            });
        } else {
            const row = document.createElement('tr');
            row.innerHTML = `<td colspan="2" style="text-align: center;">No tienes clases programadas para hoy.</td>`;
            scheduleBody.appendChild(row);
        }
    }
    
    function renderWeeklySchedule() {
        const container = document.getElementById('weekly-schedule-container');
        if (!container) return;
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
    };
    
    // ===== FUNCIÓN DE CALENDARIO =====
    function renderCalendar(year, month) {
        const calendarEl = document.getElementById('calendar');
        if (!calendarEl) return;
        
        const monthYearEl = document.getElementById('monthYear');
        const today = new Date();
        const firstDay = (new Date(year, month)).getDay();
        const daysInMonth = 32 - new Date(year, month, 32).getDate();
        const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
        monthYearEl.textContent = `${monthNames[month]} ${year}`;
        const events = { 5: {type: 'exam', title: 'Examen de Química'}, 12: {type: 'project', title: 'Entrega Proyecto de Física'}, 20: {type: 'extra', title: 'Conferencia de IA'}};

        // Construir el cuerpo del calendario (tbody)
        let tbl = document.createElement('tbody');
        let date = 1;
        for (let i = 0; i < 6; i++) {
            let row = document.createElement('tr');
            for (let j = 0; j < 7; j++) {
                if (i === 0 && j < firstDay) {
                    row.appendChild(document.createElement('td'));
                } else if (date > daysInMonth) {
                    break;
                } else {
                    let cell = document.createElement('td');
                    cell.textContent = date;
                    if (date === today.getDate() && year === today.getFullYear() && month === today.getMonth()) cell.classList.add('today');
                    if (events[date]) { cell.classList.add(`event-${events[date].type}`); cell.dataset.title = events[date].title; }
                    row.appendChild(cell);
                    date++;
                }
            }
            tbl.appendChild(row);
            if (date > daysInMonth) break;
        }
        
        // Limpiar calendario y volver a construirlo
        calendarEl.innerHTML = ''; 
        
        const thead = document.createElement('thead');
        thead.innerHTML = '<tr>' + ['D', 'L', 'M', 'M', 'J', 'V', 'S'].map(d => `<th>${d}</th>`).join('') + '</tr>';
        calendarEl.appendChild(thead);
        calendarEl.appendChild(tbl);
    };

    // --- Resto de funciones ---
    renderPaymentsPage = function() { /* ... */ }
    handlePayment = function(paymentId) { /* ... */ }
    showReceipt = function(paymentId) { /* ... */ }
    initCharts = function() { /* ... */ }
    renderNotifications = function() { /* ... */ }
   
    renderPaymentsPage = function() {
        const pendingBody = document.getElementById('pending-payments-body');
        const paidBody = document.getElementById('paid-payments-body');
        pendingBody.innerHTML = ''; paidBody.innerHTML = ''; let totalPaid = 0, totalDue = 0;
        payments.forEach(p => { if (p.status === 'pending') { totalDue += p.amount; const row = document.createElement('tr'); row.dataset.id = p.id; row.innerHTML = `<td>${p.concept}</td><td>${p.dueDate}</td><td>$${p.amount.toFixed(2)}</td><td class="action-cell"><button class="btn btn-pay"><span class="material-symbols-outlined">payment</span> Pagar Ahora</button></td>`; pendingBody.appendChild(row); } else { totalPaid += p.amount; const row = document.createElement('tr'); row.dataset.id = p.id; row.innerHTML = `<td>${p.concept}</td><td>${p.paidDate}</td><td>$${p.amount.toFixed(2)}</td><td><span class="status-paid">Pagado</span></td><td class="action-cell"><button class="btn btn-secondary btn-receipt"><span class="material-symbols-outlined">receipt_long</span>Ver Recibo</button></td>`; paidBody.appendChild(row); } });
        document.getElementById('total-paid').textContent = `$${totalPaid.toFixed(2)}`; document.getElementById('total-due').textContent = `$${totalDue.toFixed(2)}`;
    };
    handlePayment = function(paymentId) {
        const payment = payments.find(p => p.id === paymentId);
        const body = `<p>Estás a punto de pagar:</p><h3>${payment.concept}</h3><h2>$${payment.amount.toFixed(2)}</h2><p>Selecciona tu método de pago:</p><div class="payment-methods"><div class="payment-method selected"><span class="material-symbols-outlined">credit_card</span>Tarjeta</div><div class="payment-method"><span class="material-symbols-outlined">account_balance</span>Transferencia</div></div><button class="btn btn-success" id="confirm-payment-btn" style="width: 100%;"><span class="material-symbols-outlined">lock</span>Pagar de forma segura</button>`;
        showModal('paymentModal', null, body);
        document.getElementById('confirm-payment-btn').onclick = () => { loader.classList.add('show'); setTimeout(() => { payment.status = 'paid'; payment.paidDate = new Date().toISOString().slice(0, 10); payment.method = 'Tarjeta de Crédito'; closeModal('paymentModal'); renderPaymentsPage(); loader.classList.remove('show'); }, 1500); };
    };
    showReceipt = function(paymentId) {
        const payment = payments.find(p => p.id === paymentId);
        const body = `<div class="receipt-details"><p><strong>ID de Transacción:</strong> <span>TXN${payment.id}2025</span></p><p><strong>Concepto:</strong> <span>${payment.concept}</span></p><p><strong>Monto Pagado:</strong> <span>$${payment.amount.toFixed(2)}</span></p><p><strong>Fecha de Pago:</strong> <span>${payment.paidDate}</span></p><p><strong>Método de Pago:</strong> <span>${payment.method}</span></p><p><strong>Estatus:</strong> <span><span class="status-paid">Completado</span></span></p></div>`;
        showModal('receiptModal', null, body);
    };
    renderNotifications = function() {
        const listEl = document.getElementById('notifications-list'); listEl.innerHTML = '';
        if (notifications.length === 0) { listEl.classList.add('empty'); listEl.innerHTML = '<p>No tienes notificaciones nuevas.</p>'; } else { listEl.classList.remove('empty'); notifications.forEach(n => { const item = document.createElement('div'); item.className = 'notification-item'; item.dataset.id = n.id; item.style.borderColor = n.color; item.innerHTML = `<span class="material-symbols-outlined icon" style="color:${n.color}">${n.icon}</span><div><strong>${n.title}</strong><br>${n.text}</div><button class="notification-dismiss" aria-label="Descartar">&times;</button>`; listEl.appendChild(item); }); }
        updateNotificationBadge();
    };
    function updateNotificationBadge() { const badge = document.getElementById('notification-badge'); const unreadCount = notifications.filter(n => !n.read).length; badge.textContent = unreadCount; badge.style.display = unreadCount > 0 ? 'flex' : 'none'; }
    initCharts = function() {
        const statusBadges = document.querySelectorAll('.grades-detail tbody .status-badge'); let approved = 0, failed = 0; statusBadges.forEach(badge => badge.classList.contains('status-aprobada') ? approved++ : failed++); document.getElementById('approved-count').textContent = approved; document.getElementById('failed-count').textContent = failed;
        const createChart = (ctx, config) => { if(ctx) { Chart.getChart(ctx)?.destroy(); new Chart(ctx, config); } }; const isDark = document.body.classList.contains('dark'); const gridColor = isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)'; const labelColor = isDark ? '#e2e8f0' : '#2d3748';
        createChart(document.getElementById('averageChart')?.getContext('2d'), { type: 'doughnut', data: { datasets: [{ data: [87, 13], backgroundColor: ['#63adf2', isDark ? '#4a5568' : '#e2e8f0'], borderWidth: 0 }] }, options: { cutout: '70%', plugins: { legend: { display: false }, tooltip: { enabled: false } } } });
        createChart(document.getElementById('trendChart')?.getContext('2d'), { type: 'line', data: { labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May'], datasets: [{ label: 'Promedio', data: [78, 82, 85, 87, 90], borderColor: '#63adf2', backgroundColor: 'rgba(99,173,242,0.2)', fill: true, tension: 0.4 }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: false, ticks: { color: labelColor }, grid: { color: gridColor } }, x: { ticks: { color: labelColor }, grid: { color: 'transparent' } } } } });
        createChart(document.getElementById('radarChart')?.getContext('2d'), { type: 'radar', data: { labels: ['Matemáticas', 'Ciencias', 'Historia', 'Programación', 'Inglés'], datasets: [{ label: 'Calificación', data: [88, 87, 92, 90, 85], backgroundColor: 'rgba(99, 173, 242, 0.2)', borderColor: '#63adf2', borderWidth: 2 }] }, options: { responsive: true, maintainAspectRatio: false, scales: { r: { suggestedMin: 50, suggestedMax: 100, grid: { color: gridColor }, angleLines: { color: gridColor }, pointLabels: { color: labelColor }, ticks: { color: labelColor, backdropColor: 'transparent' } } }, plugins: { legend: { labels: { color: labelColor } } } } });
    };

    initializeApp();
});
