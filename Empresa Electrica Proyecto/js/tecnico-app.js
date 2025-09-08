// Aplicación específica para técnicos

class TecnicoApp {
    constructor() {
        this.currentUser = null;
        this.init();
    }

    init() {
        // Verificar autenticación
        const savedUser = localStorage.getItem('currentUser');
        if (!savedUser) {
            window.location.href = 'login.html';
            return;
        }

        this.currentUser = JSON.parse(savedUser);
        
        // Verificar que sea técnico
        if (this.currentUser.role !== 'tecnico') {
            window.location.href = 'login.html';
            return;
        }

        this.setupEventListeners();
        this.loadUserInfo();
        this.loadDefaultView();
    }

    setupEventListeners() {
        // Logout button
        document.getElementById('logout-btn').addEventListener('click', () => {
            this.logout();
        });
    }

    loadUserInfo() {
        document.getElementById('user-name').textContent = this.currentUser.name;
        document.getElementById('user-role').textContent = 'Técnico';
    }

    loadDefaultView() {
        this.navigateTo('dashboard');
    }

    navigateTo(view) {
        // Actualizar menú activo
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        document.querySelector(`[data-view="${view}"]`).classList.add('active');
        
        // Cargar contenido con estilos específicos de técnico
        this.loadTecnicoView(view);
    }

    loadTecnicoView(view) {
        const contentArea = document.getElementById('content-area');
        
        switch(view) {
            case 'dashboard':
                this.loadTecnicoDashboard();
                break;
            case 'tickets':
                this.loadTecnicoTickets();
                break;
            case 'visita-form':
                this.loadTecnicoVisitaForm();
                break;
            case 'viaticos':
                this.loadTecnicoViaticos();
                break;
            default:
                Utils.loadViewContent(view, 'content-area');
        }
    }

    loadTecnicoDashboard() {
        const contentArea = document.getElementById('content-area');
        const userTickets = this.getUserTickets();
        
        const stats = this.calculateTecnicoStats(userTickets);
        
        contentArea.innerHTML = `
            <div class="tecnico-dashboard">
                <div class="tecnico-welcome">
                    <h1>Panel de Trabajo - ${this.currentUser.name}</h1>
                    <p>Gestiona tus asignaciones y completa tus trabajos de manera eficiente</p>
                </div>
                
                <div class="tecnico-stats">
                    <div class="tecnico-stat-card">
                        <div class="tecnico-stat-header">
                            <div class="tecnico-stat-icon asignados">
                                <i class="fas fa-ticket-alt"></i>
                            </div>
                        </div>
                        <div class="tecnico-stat-number">${stats.asignados}</div>
                        <div class="tecnico-stat-label">Tickets Asignados</div>
                    </div>
                    
                    <div class="tecnico-stat-card">
                        <div class="tecnico-stat-header">
                            <div class="tecnico-stat-icon en-curso">
                                <i class="fas fa-tools"></i>
                            </div>
                        </div>
                        <div class="tecnico-stat-number">${stats.enCurso}</div>
                        <div class="tecnico-stat-label">En Progreso</div>
                    </div>
                    
                    <div class="tecnico-stat-card">
                        <div class="tecnico-stat-header">
                            <div class="tecnico-stat-icon completados">
                                <i class="fas fa-check-circle"></i>
                            </div>
                        </div>
                        <div class="tecnico-stat-number">${stats.completados}</div>
                        <div class="tecnico-stat-label">Completados</div>
                    </div>
                    
                    <div class="tecnico-stat-card">
                        <div class="tecnico-stat-header">
                            <div class="tecnico-stat-icon viaticos">
                                <i class="fas fa-car"></i>
                            </div>
                        </div>
                        <div class="tecnico-stat-number">${stats.viaticos}</div>
                        <div class="tecnico-stat-label">Viáticos Solicitados</div>
                    </div>
                </div>
                
                <div class="tecnico-tickets-container">
                    <div class="tecnico-tickets-header">
                        <div>
                            <h2 class="tecnico-tickets-title">Asignaciones Recientes</h2>
                            <p class="tecnico-tickets-subtitle">Trabajos pendientes y en progreso</p>
                        </div>
                    </div>
                    <div id="tecnico-tickets-list">
                        ${this.renderTecnicoTickets(userTickets.filter(t => t.estado === 'asignado' || t.estado === 'en_curso').slice(0, 5))}
                    </div>
                </div>
            </div>
        `;
    }

    loadTecnicoTickets() {
        const contentArea = document.getElementById('content-area');
        const userTickets = this.getUserTickets();
        
        contentArea.innerHTML = `
            <div class="tecnico-dashboard">
                <div class="tecnico-welcome">
                    <h1>Mis Asignaciones</h1>
                    <p>Gestiona todos tus tickets asignados y en progreso</p>
                </div>
                
                <div class="tecnico-tickets-container">
                    <div class="tecnico-tickets-header">
                        <div>
                            <h2 class="tecnico-tickets-title">Todas mis Asignaciones</h2>
                            <p class="tecnico-tickets-subtitle">Trabajos asignados y en progreso</p>
                        </div>
                        <div class="tecnico-search-container">
                            <div class="search-bar">
                                <i class="fas fa-search"></i>
                                <input type="text" id="tecnico-search-input" placeholder="Buscar asignaciones..." onkeyup="app.searchTecnicoTickets(this.value)">
                            </div>
                        </div>
                    </div>
                    
                    <div class="tecnico-tabs">
                        <button class="tecnico-tab active" onclick="app.switchTecnicoTab('asignado')">
                            <span>Asignado</span>
                            <span class="tecnico-tab-badge" id="asignado-count">0</span>
                        </button>
                        <button class="tecnico-tab" onclick="app.switchTecnicoTab('en_curso')">
                            <span>En Curso</span>
                            <span class="tecnico-tab-badge" id="en-curso-count">0</span>
                        </button>
                        <button class="tecnico-tab" onclick="app.switchTecnicoTab('completado')">
                            <span>Completado</span>
                            <span class="tecnico-tab-badge" id="completado-count">0</span>
                        </button>
                    </div>
                    
                    <div class="tecnico-tab-content">
                        <div id="tecnico-tickets-list" class="tecnico-tickets-list">
                            ${this.renderTecnicoTicketsByStatus(userTickets, 'asignado')}
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        this.updateTecnicoTabCounts(userTickets);
        this.currentTecnicoTab = 'asignado';
    }

    loadTecnicoVisitaForm() {
        const contentArea = document.getElementById('content-area');
        
        contentArea.innerHTML = `
            <div class="tecnico-dashboard">
                <div class="tecnico-form-container">
                    <div class="tecnico-form-header">
                        <h2>Formulario de Visita Técnica</h2>
                        <p>Registra los detalles de tu visita y el trabajo realizado</p>
                    </div>
                    
                    <form id="tecnico-visita-form" onsubmit="app.submitVisitaForm(event)">
                        <div class="tecnico-form-grid">
                            <div class="tecnico-form-group">
                                <label class="tecnico-form-label" for="visita-ticket">Ticket</label>
                                <select class="tecnico-form-select" id="visita-ticket" name="ticketId" required>
                                    <option value="">Selecciona un ticket</option>
                                    ${this.getUserTickets().filter(t => t.estado === 'asignado' || t.estado === 'en_curso').map(ticket => `
                                        <option value="${ticket.id}">${ticket.id} - ${ticket.titulo}</option>
                                    `).join('')}
                                </select>
                            </div>
                            
                            <div class="tecnico-form-group">
                                <label class="tecnico-form-label" for="visita-fecha">Fecha de Visita</label>
                                <input type="datetime-local" class="tecnico-form-input" id="visita-fecha" name="fechaVisita" required>
                            </div>
                            
                            <div class="tecnico-form-group full-width">
                                <label class="tecnico-form-label" for="visita-trabajo">Trabajo Realizado</label>
                                <textarea class="tecnico-form-textarea" id="visita-trabajo" name="trabajoRealizado" 
                                          placeholder="Describe detalladamente el trabajo realizado..." required></textarea>
                            </div>
                            
                            <div class="tecnico-form-group full-width">
                                <label class="tecnico-form-label" for="visita-observaciones">Observaciones</label>
                                <textarea class="tecnico-form-textarea" id="visita-observaciones" name="observaciones" 
                                          placeholder="Observaciones adicionales, problemas encontrados, recomendaciones..."></textarea>
                            </div>
                            
                            <div class="tecnico-form-group">
                                <label class="tecnico-form-label" for="visita-estado">Estado del Trabajo</label>
                                <select class="tecnico-form-select" id="visita-estado" name="estado" required>
                                    <option value="">Selecciona el estado</option>
                                    <option value="en_curso">En Curso</option>
                                    <option value="pre_cerrado">Pre-Cerrado</option>
                                    <option value="finalizado">Finalizado</option>
                                </select>
                            </div>
                            
                            <div class="tecnico-form-group">
                                <label class="tecnico-form-label" for="visita-tiempo">Tiempo Trabajado (horas)</label>
                                <input type="number" class="tecnico-form-input" id="visita-tiempo" name="tiempoTrabajado" 
                                       placeholder="Ej: 2.5" step="0.5" min="0" required>
                            </div>
                        </div>
                        
                        <button type="submit" class="tecnico-form-submit">
                            <i class="fas fa-save"></i>
                            Guardar Visita
                        </button>
                    </form>
                </div>
            </div>
        `;
    }

    loadTecnicoViaticos() {
        const contentArea = document.getElementById('content-area');
        const userViaticos = this.getUserViaticos();
        
        contentArea.innerHTML = `
            <div class="tecnico-dashboard">
                <div class="tecnico-welcome">
                    <h1>Viáticos</h1>
                    <p>Gestiona tus solicitudes de viáticos para trabajos interprovinciales</p>
                </div>
                
                <div class="tecnico-viaticos-section">
                    <div class="tecnico-viaticos-header">
                        <h2 class="tecnico-viaticos-title">Mis Viáticos</h2>
                        <button class="tecnico-viaticos-btn" onclick="app.showViaticoForm()">
                            <i class="fas fa-plus"></i>
                            Solicitar Viático
                        </button>
                    </div>
                    
                    <div class="tecnico-viaticos-list">
                        ${this.renderTecnicoViaticos(userViaticos)}
                    </div>
                </div>
            </div>
        `;
    }

    getUserTickets() {
        const allTickets = JSON.parse(localStorage.getItem('tickets') || '[]');
        return allTickets.filter(ticket => ticket.tecnico === this.currentUser.name);
    }

    getUserViaticos() {
        const allViaticos = JSON.parse(localStorage.getItem('viaticos') || '[]');
        return allViaticos.filter(viatico => viatico.tecnico === this.currentUser.name);
    }

    calculateTecnicoStats(tickets) {
        return {
            asignados: tickets.filter(t => t.estado === 'asignado').length,
            enCurso: tickets.filter(t => t.estado === 'en_curso').length,
            completados: tickets.filter(t => t.estado === 'finalizado').length,
            viaticos: this.getUserViaticos().length
        };
    }

    renderTecnicoTickets(tickets) {
        if (tickets.length === 0) {
            return `
                <div class="tecnico-empty-state">
                    <i class="fas fa-tools"></i>
                    <h3>No hay tickets asignados</h3>
                    <p>Aún no tienes tickets asignados</p>
                </div>
            `;
        }

        return tickets.map(ticket => `
            <div class="tecnico-ticket-card">
                <div class="tecnico-ticket-header">
                    <div class="tecnico-ticket-id">${ticket.id}</div>
                    <div class="tecnico-ticket-fecha">${Utils.formatDate(ticket.fecha)}</div>
                </div>
                
                <div class="tecnico-client-info">
                    <h4><i class="fas fa-user"></i> Información del Cliente</h4>
                    <div class="tecnico-client-details">
                        <span><i class="fas fa-user"></i> ${ticket.cliente}</span>
                        <span><i class="fas fa-map-marker-alt"></i> ${ticket.direccion || 'No especificada'}</span>
                        <span><i class="fas fa-phone"></i> ${ticket.telefono || 'No especificado'}</span>
                        <span><i class="fas fa-tag"></i> ${Utils.getPriorityLabel(ticket.prioridad)}</span>
                    </div>
                </div>
                
                <div class="tecnico-ticket-titulo">${ticket.titulo}</div>
                <div class="tecnico-ticket-descripcion">${ticket.descripcion}</div>
                
                <div class="tecnico-ticket-meta">
                    <div class="tecnico-ticket-info">
                        <span class="status-badge status-${ticket.estado}">${Utils.getStatusLabel(ticket.estado)}</span>
                        <span class="priority-badge priority-${ticket.prioridad}">${Utils.getPriorityLabel(ticket.prioridad)}</span>
                    </div>
                    
                    <div class="tecnico-ticket-actions">
                        <button class="tecnico-action-btn" onclick="app.viewTicket('${ticket.id}')">
                            <i class="fas fa-eye"></i>
                            Ver
                        </button>
                        ${ticket.estado === 'asignado' ? `
                            <button class="tecnico-action-btn primary" onclick="app.startWork('${ticket.id}')">
                                <i class="fas fa-play"></i>
                                Iniciar
                            </button>
                        ` : ''}
                        ${ticket.estado === 'en_curso' ? `
                            <button class="tecnico-action-btn success" onclick="app.completeWork('${ticket.id}')">
                                <i class="fas fa-check"></i>
                                Completar
                            </button>
                        ` : ''}
                        <button class="tecnico-action-btn warning" onclick="app.requestViatico('${ticket.id}')">
                            <i class="fas fa-car"></i>
                            Viático
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    renderTecnicoViaticos(viaticos) {
        if (viaticos.length === 0) {
            return `
                <div class="tecnico-empty-state">
                    <i class="fas fa-car"></i>
                    <h3>No hay viáticos</h3>
                    <p>Aún no has solicitado viáticos</p>
                    <button class="tecnico-action-btn primary" onclick="app.showViaticoForm()">
                        <i class="fas fa-plus"></i>
                        Solicitar Primer Viático
                    </button>
                </div>
            `;
        }

        return viaticos.map(viatico => `
            <div class="tecnico-viatico-item">
                <div class="tecnico-viatico-header">
                    <div class="tecnico-viatico-tipo">${viatico.tipo}</div>
                    <div class="tecnico-viatico-monto">$${viatico.monto}</div>
                </div>
                
                <div class="tecnico-viatico-descripcion">${viatico.descripcion}</div>
                
                <div class="tecnico-viatico-meta">
                    <span>Ticket: ${viatico.ticketId}</span>
                    <span>Estado: ${viatico.estado}</span>
                    <span>Fecha: ${Utils.formatDate(viatico.fecha)}</span>
                </div>
            </div>
        `).join('');
    }

    submitVisitaForm(event) {
        event.preventDefault();
        
        const formData = new FormData(event.target);
        const visitaData = {
            ticketId: formData.get('ticketId'),
            fechaVisita: formData.get('fechaVisita'),
            trabajoRealizado: formData.get('trabajoRealizado'),
            observaciones: formData.get('observaciones'),
            estado: formData.get('estado'),
            tiempoTrabajado: parseFloat(formData.get('tiempoTrabajado')),
            tecnico: this.currentUser.name,
            fecha: new Date().toISOString()
        };
        
        // Guardar visita
        const visitas = JSON.parse(localStorage.getItem('visitas') || '[]');
        visitas.push(visitaData);
        localStorage.setItem('visitas', JSON.stringify(visitas));
        
        // Actualizar estado del ticket
        const tickets = JSON.parse(localStorage.getItem('tickets') || '[]');
        const ticketIndex = tickets.findIndex(t => t.id === visitaData.ticketId);
        if (ticketIndex !== -1) {
            tickets[ticketIndex].estado = visitaData.estado;
            tickets[ticketIndex].fechaActualizacion = new Date().toISOString();
            localStorage.setItem('tickets', JSON.stringify(tickets));
        }
        
        // Mostrar mensaje de éxito
        Utils.showToast('Visita registrada exitosamente', 'success');
        
        // Limpiar formulario
        event.target.reset();
        
        // Redirigir a tickets
        setTimeout(() => {
            this.navigateTo('tickets');
        }, 1500);
    }

    showViaticoForm() {
        // Implementar formulario de viático
        Utils.showToast('Función de viático en desarrollo', 'info');
    }

    startWork(ticketId) {
        // Cambiar estado a en_curso
        const tickets = JSON.parse(localStorage.getItem('tickets') || '[]');
        const ticketIndex = tickets.findIndex(t => t.id === ticketId);
        if (ticketIndex !== -1) {
            tickets[ticketIndex].estado = 'en_curso';
            tickets[ticketIndex].fechaInicio = new Date().toISOString();
            localStorage.setItem('tickets', JSON.stringify(tickets));
            Utils.showToast('Trabajo iniciado', 'success');
            this.loadTecnicoTickets();
        }
    }

    completeWork(ticketId) {
        // Cambiar estado a finalizado
        const tickets = JSON.parse(localStorage.getItem('tickets') || '[]');
        const ticketIndex = tickets.findIndex(t => t.id === ticketId);
        if (ticketIndex !== -1) {
            tickets[ticketIndex].estado = 'finalizado';
            tickets[ticketIndex].fechaFinalizacion = new Date().toISOString();
            localStorage.setItem('tickets', JSON.stringify(tickets));
            Utils.showToast('Trabajo completado', 'success');
            this.loadTecnicoTickets();
        }
    }

    requestViatico(ticketId) {
        // Implementar solicitud de viático
        Utils.showToast('Función de viático en desarrollo', 'info');
    }

    viewTicket(ticketId) {
        // Implementar vista de ticket individual
        Utils.showToast('Función de vista de ticket en desarrollo', 'info');
    }

    // Funciones para pestañas y búsqueda
    switchTecnicoTab(tabName) {
        // Actualizar pestañas activas
        document.querySelectorAll('.tecnico-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelector(`[onclick="app.switchTecnicoTab('${tabName}')"]`).classList.add('active');
        
        this.currentTecnicoTab = tabName;
        this.renderTecnicoTicketsByStatus(this.getUserTickets(), tabName);
    }

    renderTecnicoTicketsByStatus(tickets, status) {
        let filteredTickets = tickets;
        
        if (status === 'asignado') {
            filteredTickets = tickets.filter(t => t.estado === 'asignado');
        } else if (status === 'en_curso') {
            filteredTickets = tickets.filter(t => t.estado === 'en_curso');
        } else if (status === 'completado') {
            filteredTickets = tickets.filter(t => t.estado === 'finalizado' || t.estado === 'pre_cerrado');
        }
        
        const ticketsList = document.getElementById('tecnico-tickets-list');
        if (ticketsList) {
            ticketsList.innerHTML = this.renderTecnicoTickets(filteredTickets);
        }
        
        return this.renderTecnicoTickets(filteredTickets);
    }

    updateTecnicoTabCounts(tickets) {
        const asignadoCount = tickets.filter(t => t.estado === 'asignado').length;
        const enCursoCount = tickets.filter(t => t.estado === 'en_curso').length;
        const completadoCount = tickets.filter(t => t.estado === 'finalizado' || t.estado === 'pre_cerrado').length;
        
        const asignadoBadge = document.getElementById('asignado-count');
        const enCursoBadge = document.getElementById('en-curso-count');
        const completadoBadge = document.getElementById('completado-count');
        
        if (asignadoBadge) asignadoBadge.textContent = asignadoCount;
        if (enCursoBadge) enCursoBadge.textContent = enCursoCount;
        if (completadoBadge) completadoBadge.textContent = completadoCount;
    }

    searchTecnicoTickets(searchTerm) {
        const allTickets = this.getUserTickets();
        let filteredTickets = allTickets;
        
        if (searchTerm.trim() !== '') {
            filteredTickets = allTickets.filter(ticket => 
                ticket.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                ticket.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
                ticket.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
                ticket.id.toString().includes(searchTerm)
            );
        }
        
        this.renderTecnicoTicketsByStatus(filteredTickets, this.currentTecnicoTab);
    }

    logout() {
        localStorage.removeItem('currentUser');
        window.location.href = 'login.html';
    }
}

// Inicializar aplicación
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new TecnicoApp();
});

// Funciones globales
window.app = app;

// Función para toggle del menú móvil
window.toggleMobileMenu = () => {
    const sidebar = document.querySelector('.sidebar');
    sidebar.classList.toggle('mobile-open');
};
