// Aplicación principal de la Plataforma TAT - Sistema de Gestión de Soporte Técnico

class PlataformaTAT {
    constructor() {
        this.currentUser = null;
        this.currentSection = 'dashboard';
        this.currentTicketId = null;
        this.map = null;
        this.init();
    }

    init() {
        this.bindEvents();
        this.checkAuth();
        this.initializeMap();
    }

    bindEvents() {
        // Login
        document.getElementById('loginForm').addEventListener('submit', (e) => this.handleLogin(e));
        document.getElementById('forgotPassword').addEventListener('click', (e) => this.handleForgotPassword(e));
        
        // Navegación
        document.getElementById('menuToggle').addEventListener('click', () => this.toggleSidebar());
        document.getElementById('logoutBtn').addEventListener('click', () => this.logout());
        
        // Notificaciones
        document.getElementById('notificationsBtn').addEventListener('click', () => this.toggleNotifications());
        document.getElementById('closeNotifications').addEventListener('click', () => this.closeNotifications());
        
        // Modales
        document.getElementById('closeModal').addEventListener('click', () => this.closeModal());
        document.getElementById('modalOverlay').addEventListener('click', (e) => {
            if (e.target.id === 'modalOverlay') this.closeModal();
        });

        // Filtros y acciones
        document.getElementById('filterBtn').addEventListener('click', () => this.filterTickets());
        document.getElementById('clearFiltersBtn').addEventListener('click', () => this.clearFilters());
        document.getElementById('refreshDashboard').addEventListener('click', () => this.loadDashboard());
        document.getElementById('refreshLocationBtn').addEventListener('click', () => this.loadGeolocalizacion());
        
        // Botones de acción principales
        document.getElementById('addTicketBtn').addEventListener('click', () => this.showAddTicketModal());
        document.getElementById('addClienteBtn').addEventListener('click', () => this.showAddClienteModal());
        document.getElementById('addEquipoBtn').addEventListener('click', () => this.showAddEquipoModal());
        document.getElementById('addTecnicoBtn').addEventListener('click', () => this.showAddTecnicoModal());
        document.getElementById('addHerramientaBtn').addEventListener('click', () => this.showAddHerramientaModal());
        document.getElementById('addDestinoBtn').addEventListener('click', () => this.showAddDestinoModal());
        document.getElementById('addSolicitudBtn').addEventListener('click', () => this.showAddSolicitudModal());
        document.getElementById('generateReportBtn').addEventListener('click', () => this.generateReport());
        
        // Navegación entre secciones
        document.getElementById('backToTickets').addEventListener('click', () => this.showSection('tickets'));
        document.getElementById('backToTicketsFromForm').addEventListener('click', () => this.showSection('tickets'));
        document.getElementById('backToTicketsFromSurvey').addEventListener('click', () => this.showSection('tickets'));
        document.getElementById('printTicketBtn').addEventListener('click', () => this.printTicket());
        document.getElementById('saveFormBtn').addEventListener('click', () => this.saveTicketForm());
        document.getElementById('exportTicketsBtn').addEventListener('click', () => this.exportTickets());
    }

    checkAuth() {
        const user = localStorage.getItem('currentUser');
        if (user) {
            this.currentUser = JSON.parse(user);
            this.showMainScreen();
        } else {
            this.showLoginScreen();
        }
    }

    handleLogin(e) {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        const usuarios = getData('usuarios', []);
        const user = usuarios.find(u => u.username === username && u.password === password);
        
        if (user) {
            this.currentUser = user;
            localStorage.setItem('currentUser', JSON.stringify(user));
            this.showMainScreen();
            
            // Crear notificación de login
            createNotification(user.id, 'Sesión Iniciada', `Bienvenido ${user.nombre}`, 'login', 'baja');
        } else {
            this.showAlert('Usuario o contraseña incorrectos', 'error');
        }
    }

    handleForgotPassword(e) {
        e.preventDefault();
        this.showAlert('Funcionalidad de recuperación de contraseña en desarrollo', 'info');
    }

    logout() {
        this.currentUser = null;
        localStorage.removeItem('currentUser');
        this.showLoginScreen();
        this.showAlert('Sesión cerrada exitosamente', 'success');
    }

    showLoginScreen() {
        document.getElementById('loginScreen').classList.add('active');
        document.getElementById('mainScreen').classList.remove('active');
        document.getElementById('username').value = '';
        document.getElementById('password').value = '';
    }

    showMainScreen() {
        document.getElementById('loginScreen').classList.remove('active');
        document.getElementById('mainScreen').classList.add('active');
        this.updateUserInfo();
        this.generateNavigation();
        this.loadNotifications();
        this.showSection('dashboard');
    }

    updateUserInfo() {
        const userInfo = document.getElementById('userInfo');
        userInfo.textContent = `${this.currentUser.nombre} (${this.currentUser.rol})`;
    }

    generateNavigation() {
        const navMenu = document.getElementById('navMenu');
        const menuItems = this.getMenuItems();
        
        navMenu.innerHTML = '';
        menuItems.forEach(item => {
            const li = document.createElement('li');
            li.innerHTML = `<a href="#" data-section="${item.section}">${item.icon} ${item.text}</a>`;
            li.addEventListener('click', (e) => {
                e.preventDefault();
                this.showSection(item.section);
            });
            navMenu.appendChild(li);
        });
    }

    getMenuItems() {
        const baseMenu = [
            { section: 'dashboard', text: 'Dashboard', icon: '<i class="fas fa-tachometer-alt"></i>' }
        ];

        switch (this.currentUser.rol) {
            case 'Administrador':
                return [
                    ...baseMenu,
                    { section: 'tickets', text: 'Tickets', icon: '<i class="fas fa-ticket-alt"></i>' },
                    { section: 'clientes', text: 'Clientes', icon: '<i class="fas fa-building"></i>' },
                    { section: 'equipos', text: 'Equipos', icon: '<i class="fas fa-cogs"></i>' },
                    { section: 'tecnicos', text: 'Técnicos', icon: '<i class="fas fa-user-tie"></i>' },
                    { section: 'herramientas', text: 'Herramientas', icon: '<i class="fas fa-tools"></i>' },
                    { section: 'destinos', text: 'Destinos', icon: '<i class="fas fa-map-marker-alt"></i>' },
                    { section: 'solicitudes', text: 'Solicitudes', icon: '<i class="fas fa-clipboard-list"></i>' },
                    { section: 'geolocalizacion', text: 'Ubicación Técnicos', icon: '<i class="fas fa-map"></i>' },
                    { section: 'reportes', text: 'Reportes', icon: '<i class="fas fa-chart-bar"></i>' },
                    { section: 'configuracion', text: 'Configuración', icon: '<i class="fas fa-cog"></i>' }
                ];
            case 'Mesa de Ayuda':
                return [
                    ...baseMenu,
                    { section: 'tickets', text: 'Tickets', icon: '<i class="fas fa-ticket-alt"></i>' },
                    { section: 'clientes', text: 'Clientes', icon: '<i class="fas fa-building"></i>' },
                    { section: 'equipos', text: 'Equipos', icon: '<i class="fas fa-cogs"></i>' },
                    { section: 'tecnicos', text: 'Técnicos', icon: '<i class="fas fa-user-tie"></i>' },
                    { section: 'solicitudes', text: 'Solicitudes', icon: '<i class="fas fa-clipboard-list"></i>' },
                    { section: 'geolocalizacion', text: 'Ubicación Técnicos', icon: '<i class="fas fa-map"></i>' },
                    { section: 'reportes', text: 'Reportes', icon: '<i class="fas fa-chart-bar"></i>' }
                ];
            case 'Técnico':
                return [
                    ...baseMenu,
                    { section: 'tickets', text: 'Mis Tickets', icon: '<i class="fas fa-ticket-alt"></i>' },
                    { section: 'solicitudes', text: 'Mis Solicitudes', icon: '<i class="fas fa-clipboard-list"></i>' },
                    { section: 'geolocalizacion', text: 'Mi Ubicación', icon: '<i class="fas fa-map"></i>' }
                ];
            case 'Cliente':
                return [
                    ...baseMenu,
                    { section: 'tickets', text: 'Mis Tickets', icon: '<i class="fas fa-ticket-alt"></i>' },
                    { section: 'encuesta', text: 'Encuesta Satisfacción', icon: '<i class="fas fa-star"></i>' }
                ];
            default:
                return baseMenu;
        }
    }

    showSection(sectionName) {
        // Ocultar todas las secciones
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
        });

        // Mostrar la sección seleccionada
        const section = document.getElementById(sectionName);
        if (section) {
            section.classList.add('active');
            this.currentSection = sectionName;
            this.loadSectionContent(sectionName);
        }

        // Actualizar menú activo
        document.querySelectorAll('.nav-menu a').forEach(link => {
            link.classList.remove('active');
        });
        const activeLink = document.querySelector(`[data-section="${sectionName}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }

        // Cerrar sidebar en móvil
        if (window.innerWidth <= 768) {
            document.getElementById('sidebar').classList.remove('open');
        }
    }

    loadSectionContent(sectionName) {
        switch (sectionName) {
            case 'dashboard':
                this.loadDashboard();
                break;
            case 'tickets':
                this.loadTickets();
                break;
            case 'clientes':
                this.loadClientes();
                break;
            case 'equipos':
                this.loadEquipos();
                break;
            case 'tecnicos':
                this.loadTecnicos();
                break;
            case 'herramientas':
                this.loadHerramientas();
                break;
            case 'destinos':
                this.loadDestinos();
                break;
            case 'solicitudes':
                this.loadSolicitudes();
                break;
            case 'geolocalizacion':
                this.loadGeolocalizacion();
                break;
            case 'encuesta':
                this.loadEncuesta();
                break;
            case 'reportes':
                this.loadReportes();
                break;
            case 'configuracion':
                this.loadConfiguracion();
                break;
        }
    }

    loadDashboard() {
        const dashboardContent = document.getElementById('dashboardContent');
        const tickets = getData('tickets', []);
        const clientes = getData('clientes', []);
        const tecnicos = getData('tecnicos', []);
        const solicitudes = getData('solicitudes', []);

        let content = '';

        if (this.currentUser.rol === 'Administrador') {
            const ticketsAbiertos = tickets.filter(t => t.estado === 'Abierto').length;
            const ticketsEnProceso = tickets.filter(t => t.estado === 'En Proceso').length;
            const ticketsPreCerrados = tickets.filter(t => t.estado === 'Pre-cerrado').length;
            const ticketsCerrados = tickets.filter(t => t.estado === 'Cerrado').length;
            const totalClientes = clientes.length;
            const tecnicosDisponibles = tecnicos.filter(t => t.estado === 'Disponible').length;
            const solicitudesPendientes = solicitudes.filter(s => s.estado === 'Pendiente').length;

            content = `
                <div class="dashboard-grid">
                    <div class="dashboard-card">
                        <h3>Tickets Abiertos</h3>
                        <div class="number">${ticketsAbiertos}</div>
                        <div class="label">Requieren atención</div>
                    </div>
                    <div class="dashboard-card">
                        <h3>Tickets En Proceso</h3>
                        <div class="number">${ticketsEnProceso}</div>
                        <div class="label">En trabajo</div>
                    </div>
                    <div class="dashboard-card">
                        <h3>Tickets Pre-cerrados</h3>
                        <div class="number">${ticketsPreCerrados}</div>
                        <div class="label">Esperando encuesta</div>
                    </div>
                    <div class="dashboard-card">
                        <h3>Tickets Cerrados</h3>
                        <div class="number">${ticketsCerrados}</div>
                        <div class="label">Completados</div>
                    </div>
                    <div class="dashboard-card">
                        <h3>Total Clientes</h3>
                        <div class="number">${totalClientes}</div>
                        <div class="label">Registrados</div>
                    </div>
                    <div class="dashboard-card">
                        <h3>Técnicos Disponibles</h3>
                        <div class="number">${tecnicosDisponibles}</div>
                        <div class="label">Listos para asignar</div>
                    </div>
                    <div class="dashboard-card">
                        <h3>Solicitudes Pendientes</h3>
                        <div class="number">${solicitudesPendientes}</div>
                        <div class="label">Por aprobar</div>
                    </div>
                </div>
            `;
        } else if (this.currentUser.rol === 'Mesa de Ayuda') {
            const ticketsPendientes = tickets.filter(t => t.estado === 'Abierto').length;
            const tecnicosDisponibles = tecnicos.filter(t => t.estado === 'Disponible').length;
            const solicitudesPendientes = solicitudes.filter(s => s.estado === 'Pendiente').length;

            content = `
                <div class="dashboard-grid">
                    <div class="dashboard-card">
                        <h3>Tickets Pendientes</h3>
                        <div class="number">${ticketsPendientes}</div>
                        <div class="label">Sin asignar</div>
                    </div>
                    <div class="dashboard-card">
                        <h3>Técnicos Disponibles</h3>
                        <div class="number">${tecnicosDisponibles}</div>
                        <div class="label">Listos para asignar</div>
                    </div>
                    <div class="dashboard-card">
                        <h3>Solicitudes Pendientes</h3>
                        <div class="number">${solicitudesPendientes}</div>
                        <div class="label">Por aprobar</div>
                    </div>
                </div>
            `;
        } else if (this.currentUser.rol === 'Técnico') {
            const misTickets = tickets.filter(t => t.tecnicoId === this.currentUser.id);
            const ticketsAsignados = misTickets.length;
            const ticketsEnProceso = misTickets.filter(t => t.estado === 'En Proceso').length;
            const misSolicitudes = solicitudes.filter(s => s.tecnicoId === this.currentUser.id);

            content = `
                <div class="dashboard-grid">
                    <div class="dashboard-card">
                        <h3>Mis Tickets</h3>
                        <div class="number">${ticketsAsignados}</div>
                        <div class="label">Asignados a mí</div>
                    </div>
                    <div class="dashboard-card">
                        <h3>En Proceso</h3>
                        <div class="number">${ticketsEnProceso}</div>
                        <div class="label">Trabajando actualmente</div>
                    </div>
                    <div class="dashboard-card">
                        <h3>Mis Solicitudes</h3>
                        <div class="number">${misSolicitudes.length}</div>
                        <div class="label">Herramientas y viáticos</div>
                    </div>
                </div>
            `;
        } else if (this.currentUser.rol === 'Cliente') {
            const misTickets = tickets.filter(t => t.clienteId === this.currentUser.id);
            const ticketsAbiertos = misTickets.filter(t => t.estado === 'Abierto' || t.estado === 'En Proceso').length;
            const ticketsCerrados = misTickets.filter(t => t.estado === 'Cerrado').length;
            const ticketsPreCerrados = misTickets.filter(t => t.estado === 'Pre-cerrado').length;

            content = `
                <div class="dashboard-grid">
                    <div class="dashboard-card">
                        <h3>Mis Tickets Activos</h3>
                        <div class="number">${ticketsAbiertos}</div>
                        <div class="label">En proceso</div>
                    </div>
                    <div class="dashboard-card">
                        <h3>Tickets Pre-cerrados</h3>
                        <div class="number">${ticketsPreCerrados}</div>
                        <div class="label">Esperando encuesta</div>
                    </div>
                    <div class="dashboard-card">
                        <h3>Tickets Cerrados</h3>
                        <div class="number">${ticketsCerrados}</div>
                        <div class="label">Completados</div>
                    </div>
                </div>
            `;
        }

        dashboardContent.innerHTML = content;
    }

    // Métodos auxiliares
    toggleSidebar() {
        document.getElementById('sidebar').classList.toggle('open');
    }

    toggleNotifications() {
        document.getElementById('notificationsPanel').classList.toggle('open');
    }

    closeNotifications() {
        document.getElementById('notificationsPanel').classList.remove('open');
    }

    showModal(title, body, footer = '') {
        document.getElementById('modalTitle').textContent = title;
        document.getElementById('modalBody').innerHTML = body;
        document.getElementById('modalFooter').innerHTML = footer;
        document.getElementById('modalOverlay').classList.add('active');
    }

    closeModal() {
        document.getElementById('modalOverlay').classList.remove('active');
    }

    showAlert(message, type = 'info') {
        // Crear alerta temporal
        const alert = document.createElement('div');
        alert.className = `alert alert-${type}`;
        alert.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 2rem;
            border-radius: 8px;
            color: white;
            font-weight: 600;
            z-index: 10000;
            animation: slideIn 0.3s ease;
        `;
        
        const colors = {
            success: '#28a745',
            error: '#dc3545',
            warning: '#ffc107',
            info: '#17a2b8'
        };
        
        alert.style.backgroundColor = colors[type] || colors.info;
        alert.textContent = message;
        
        document.body.appendChild(alert);
        
        setTimeout(() => {
            alert.remove();
        }, 3000);
    }

    loadNotifications() {
        const notifications = getData('notificaciones', []);
        const userNotifications = notifications.filter(n => n.usuarioId === this.currentUser.id);
        const unreadCount = userNotifications.filter(n => !n.leida).length;
        
        document.getElementById('notificationCount').textContent = unreadCount;
        
        const notificationsList = document.getElementById('notificationsList');
        notificationsList.innerHTML = '';
        
        if (userNotifications.length === 0) {
            notificationsList.innerHTML = '<p class="text-center text-muted">No hay notificaciones</p>';
            return;
        }
        
        userNotifications.forEach(notification => {
            const item = document.createElement('div');
            item.className = `notification-item ${notification.leida ? '' : 'unread'}`;
            item.innerHTML = `
                <h4>${notification.titulo}</h4>
                <p>${notification.mensaje}</p>
                <small>${formatDate(notification.fecha)}</small>
            `;
            item.addEventListener('click', () => {
                notification.leida = true;
                saveData('notificaciones', notifications);
                this.loadNotifications();
            });
            notificationsList.appendChild(item);
        });
    }

    // Los métodos de carga se implementan en data-loaders.js
    // Estos placeholders se mantienen para compatibilidad
    loadTickets() { 
        // Este método se sobrescribe en tickets.js
        console.log('loadTickets llamado desde app.js');
    }
    loadClientes() { this.showAlert('Cargando clientes...', 'info'); }
    loadEquipos() { this.showAlert('Cargando equipos...', 'info'); }
    loadTecnicos() { this.showAlert('Cargando técnicos...', 'info'); }
    loadHerramientas() { this.showAlert('Cargando herramientas...', 'info'); }
    loadDestinos() { this.showAlert('Cargando destinos...', 'info'); }
    loadSolicitudes() { this.showAlert('Cargando solicitudes...', 'info'); }
    loadGeolocalizacion() { this.showAlert('Cargando geolocalización...', 'info'); }
    loadEncuesta() { this.showAlert('Cargando encuesta...', 'info'); }
    loadReportes() { this.showAlert('Cargando reportes...', 'info'); }
    loadConfiguracion() { this.showAlert('Cargando configuración...', 'info'); }
    
    filterTickets() { this.showAlert('Filtrando tickets...', 'info'); }
    clearFilters() { this.showAlert('Limpiando filtros...', 'info'); }
    showAddTicketModal() { this.showAlert('Agregando ticket...', 'info'); }
    showAddClienteModal() { this.showAlert('Agregando cliente...', 'info'); }
    showAddEquipoModal() { this.showAlert('Agregando equipo...', 'info'); }
    showAddTecnicoModal() { this.showAlert('Agregando técnico...', 'info'); }
    showAddHerramientaModal() { this.showAlert('Agregando herramienta...', 'info'); }
    showAddDestinoModal() { this.showAlert('Agregando destino...', 'info'); }
    showAddSolicitudModal() { this.showAlert('Agregando solicitud...', 'info'); }
    generateReport() { this.showAlert('Generando reporte...', 'info'); }
    printTicket() { this.showAlert('Imprimiendo ticket...', 'info'); }
    saveTicketForm() { this.showAlert('Guardando formulario...', 'info'); }
    exportTickets() { this.showAlert('Exportando tickets...', 'info'); }

    initializeMap() {
        // Inicializar mapa Leaflet cuando se necesite
        console.log('Mapa inicializado');
    }
}

// Inicializar la aplicación
const app = new PlataformaTAT();