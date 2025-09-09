// Aplicación para mostrar tickets de un cliente específico (Admin)

class ClienteTicketsAdmin {
    constructor() {
        this.currentUser = null;
        this.clientId = null;
        this.client = null;
        this.tickets = [];
        this.filteredTickets = [];
        this.init();
    }

    init() {
        // Verificar autenticación
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (!this.currentUser || this.currentUser.role !== 'admin') {
            window.location.href = 'login.html';
            return;
        }

        // Obtener clientId de los parámetros de URL
        const urlParams = new URLSearchParams(window.location.search);
        this.clientId = parseInt(urlParams.get('clientId'));
        
        if (!this.clientId) {
            this.showToast('ID de cliente no válido', 'error');
            this.goBackToClients();
            return;
        }

        // Configurar información del usuario en el navbar
        this.setupUserInfo();

        // Cargar datos del cliente
        this.loadClientData();
        
        // Configurar event listeners
        this.setupEventListeners();
        
        // Cargar tickets
        this.loadClientTickets();
        
        // Ocultar loading
        const loadingElement = document.getElementById('loading');
        if (loadingElement) {
            loadingElement.style.display = 'none';
        }
    }

    setupUserInfo() {
        // Configurar el nombre del usuario en el navbar
        const userNameElement = document.getElementById('user-name');
        if (userNameElement && this.currentUser) {
            userNameElement.textContent = this.currentUser.name || 'Admin';
        }
    }

    loadClientData() {
        this.client = DataManager.getUserById(this.clientId);
        
        if (!this.client) {
            this.showToast('Cliente no encontrado', 'error');
            this.goBackToClients();
            return;
        }

        // Actualizar título de la página
        const clientNameElement = document.getElementById('client-name');
        const clientSubtitleElement = document.getElementById('client-subtitle');
        
        if (clientNameElement) {
            clientNameElement.textContent = this.client.name;
        }
        if (clientSubtitleElement) {
            clientSubtitleElement.textContent = `Tickets asociados a ${this.client.name}`;
        }
        document.title = `Tickets de ${this.client.name} - Empresa Eléctrica`;

        // Mostrar información del cliente
        this.renderClientInfo();
    }

    renderClientInfo() {
        const clientInfoContainer = document.getElementById('client-info-details');
        
        if (!clientInfoContainer) return;
        
        clientInfoContainer.innerHTML = `
            <div class="client-info-grid">
                <div class="client-info-item">
                    <span class="client-info-label">Nombre:</span>
                    <span class="client-info-value">${this.client.name}</span>
                </div>
                <div class="client-info-item">
                    <span class="client-info-label">Email:</span>
                    <span class="client-info-value">${this.client.email}</span>
                </div>
                <div class="client-info-item">
                    <span class="client-info-label">Teléfono:</span>
                    <span class="client-info-value">${this.client.phone || 'No especificado'}</span>
                </div>
                <div class="client-info-item">
                    <span class="client-info-label">Empresa:</span>
                    <span class="client-info-value">${this.client.company || 'Sin empresa'}</span>
                </div>
            </div>
        `;
    }

    loadClientTickets() {
        // Obtener todos los tickets y filtrar por el cliente
        this.tickets = DataManager.getTicketsByClient(this.clientId);
        this.filteredTickets = [...this.tickets];
        
        // Renderizar estadísticas
        this.renderTicketsStats();
        
        // Renderizar tabla de tickets
        this.renderTicketsTable();
    }

    renderTicketsStats() {
        const statsContainer = document.getElementById('tickets-stats');
        
        if (!statsContainer) return;
        
        const stats = {
            total: this.tickets.length,
            pendiente: this.tickets.filter(t => t.status === 'pendiente').length,
            en_progreso: this.tickets.filter(t => t.status === 'en_progreso').length,
            finalizado: this.tickets.filter(t => t.status === 'finalizado').length,
            cancelado: this.tickets.filter(t => t.status === 'cancelado').length
        };

        statsContainer.innerHTML = `
            <div class="stat-card">
                <div class="stat-icon">
                    <i class="fas fa-ticket-alt"></i>
                </div>
                <div class="stat-info">
                    <div class="stat-number">${stats.total}</div>
                    <div class="stat-label">Total Tickets</div>
                </div>
            </div>
            
            <div class="stat-card">
                <div class="stat-icon pending">
                    <i class="fas fa-clock"></i>
                </div>
                <div class="stat-info">
                    <div class="stat-number">${stats.pendiente}</div>
                    <div class="stat-label">Pendientes</div>
                </div>
            </div>
            
            <div class="stat-card">
                <div class="stat-icon progress">
                    <i class="fas fa-cog"></i>
                </div>
                <div class="stat-info">
                    <div class="stat-number">${stats.en_progreso}</div>
                    <div class="stat-label">En Progreso</div>
                </div>
            </div>
            
            <div class="stat-card">
                <div class="stat-icon completed">
                    <i class="fas fa-check-circle"></i>
                </div>
                <div class="stat-info">
                    <div class="stat-number">${stats.finalizado}</div>
                    <div class="stat-label">Finalizados</div>
                </div>
            </div>
        `;
    }

    renderTicketsTable() {
        const tableBody = document.getElementById('tickets-table-body');
        const noTicketsMessage = document.getElementById('no-tickets-message');
        
        if (!tableBody) return;
        
        if (this.filteredTickets.length === 0) {
            tableBody.innerHTML = '';
            if (noTicketsMessage) {
                noTicketsMessage.style.display = 'block';
            }
            return;
        }
        
        if (noTicketsMessage) {
            noTicketsMessage.style.display = 'none';
        }
        
        tableBody.innerHTML = this.filteredTickets.map(ticket => `
            <tr>
                <td class="table-cell-id">
                    <div class="ticket-id-info">
                        <div class="ticket-id-badge">#${ticket.id}</div>
                    </div>
                </td>
                <td class="table-cell-title">
                    <div class="ticket-title-info">
                        <div class="ticket-title">${ticket.title}</div>
                        <div class="ticket-description">${this.truncateText(ticket.description, 50)}</div>
                    </div>
                </td>
                <td class="table-cell-worktype">
                    <div class="worktype-info">
                        <i class="fas fa-tools"></i>
                        <span>${ticket.workType}</span>
                    </div>
                </td>
                <td class="table-cell-priority">
                    <div class="priority-info">
                        <span class="priority-badge priority-${ticket.priority}">
                            <i class="${this.getPriorityIcon(ticket.priority)}"></i>
                            ${(ticket.priority || 'media').toUpperCase()}
                        </span>
                    </div>
                </td>
                <td class="table-cell-status">
                    <div class="status-info">
                        <span class="status-badge status-${ticket.status || 'pendiente'}">
                            <i class="${this.getStatusIcon(ticket.status || 'pendiente')}"></i>
                            ${(ticket.status || 'pendiente').replace('_', ' ').toUpperCase()}
                        </span>
                    </div>
                </td>
                <td class="table-cell-technician">
                    <div class="technician-info">
                        ${ticket.assignedTechnicianName ? `
                            <div class="technician-details">
                                <div class="technician-name">${ticket.assignedTechnicianName}</div>
                                <div class="technician-status">Asignado</div>
                            </div>
                        ` : `
                            <div class="no-technician">
                                <i class="fas fa-user-times"></i>
                                <span>Sin asignar</span>
                            </div>
                        `}
                    </div>
                </td>
                <td class="table-cell-date">
                    <div class="date-info">
                        <div class="date-created">
                            <i class="fas fa-calendar-plus"></i>
                            <span>${this.formatDate(ticket.createdAt)}</span>
                        </div>
                        ${ticket.updatedAt && ticket.updatedAt !== ticket.createdAt ? `
                            <div class="date-updated">
                                <i class="fas fa-calendar-edit"></i>
                                <span>${this.formatDate(ticket.updatedAt)}</span>
                            </div>
                        ` : ''}
                    </div>
                </td>
                <td class="table-cell-actions">
                    <div class="table-actions">
                        <button class="table-action-btn view-btn" onclick="app.showTicketModal('${ticket.id}')" title="Ver detalles">
                            <i class="fas fa-eye"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    setupEventListeners() {
        // Búsqueda en tiempo real
        const searchInput = document.getElementById('tickets-search');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.filterTickets();
            });
        }

        // Filtro por estado
        const statusFilter = document.getElementById('status-filter');
        if (statusFilter) {
            statusFilter.addEventListener('change', (e) => {
                this.filterTickets();
            });
        }
    }

    filterTickets() {
        const searchInput = document.getElementById('tickets-search');
        const statusFilterSelect = document.getElementById('status-filter');
        
        const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
        const statusFilter = statusFilterSelect ? statusFilterSelect.value : '';

        this.filteredTickets = this.tickets.filter(ticket => {
            const matchesSearch = !searchTerm || 
                ticket.title.toLowerCase().includes(searchTerm) ||
                ticket.description.toLowerCase().includes(searchTerm) ||
                ticket.id.toString().includes(searchTerm) ||
                (ticket.assignedTechnicianName && ticket.assignedTechnicianName.toLowerCase().includes(searchTerm));

            const matchesStatus = !statusFilter || ticket.status === statusFilter;

            return matchesSearch && matchesStatus;
        });

        this.renderTicketsTable();
    }

    truncateText(text, maxLength) {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    }

    // Funciones helper para evitar dependencias de Utils
    getPriorityIcon(priority) {
        const icons = {
            'baja': 'fas fa-arrow-down',
            'media': 'fas fa-minus',
            'alta': 'fas fa-arrow-up',
            'critica': 'fas fa-exclamation-triangle'
        };
        return icons[priority] || 'fas fa-minus';
    }

    getStatusIcon(status) {
        const icons = {
            'pendiente': 'fas fa-clock',
            'en_progreso': 'fas fa-cog',
            'finalizado': 'fas fa-check-circle',
            'cancelado': 'fas fa-times-circle'
        };
        return icons[status] || 'fas fa-clock';
    }

    formatDate(dateString) {
        if (!dateString) return '';
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('es-ES', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (e) {
            return dateString;
        }
    }

    showToast(message, type = 'info') {
        // Fallback simple si Utils no está disponible
        if (typeof Utils !== 'undefined' && Utils.showToast) {
            Utils.showToast(message, type);
        } else {
            alert(message);
        }
    }

    goBackToClients() {
        // Navegar directamente a la sección de clientes en admin usando el hash
        window.location.href = 'admin.html#clientes';
    }

    // Mostrar modal con detalles del ticket
    showTicketModal(ticketId) {
        const ticket = DataManager.getTicketById(ticketId);
        if (!ticket) {
            this.showToast('Ticket no encontrado', 'error');
            return;
        }

        // Crear modal
        const modal = document.createElement('div');
        modal.className = 'ticket-modal-overlay';
        modal.innerHTML = `
            <div class="ticket-modal">
                <div class="ticket-modal-header">
                    <h2><i class="fas fa-ticket-alt"></i> Ticket #${ticket.id}</h2>
                    <button class="modal-close-btn" onclick="this.closest('.ticket-modal-overlay').remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                
                <div class="ticket-modal-content">
                    <div class="ticket-modal-section">
                        <h3>Información General</h3>
                        <div class="ticket-info-grid">
                            <div class="ticket-info-item">
                                <span class="ticket-info-label">Título:</span>
                                <span class="ticket-info-value">${ticket.title}</span>
                            </div>
                            <div class="ticket-info-item">
                                <span class="ticket-info-label">Estado:</span>
                                <span class="status-badge status-${ticket.status}">
                                    <i class="${this.getStatusIcon(ticket.status)}"></i>
                                    ${(ticket.status || 'pendiente').replace('_', ' ').toUpperCase()}
                                </span>
                            </div>
                            <div class="ticket-info-item">
                                <span class="ticket-info-label">Prioridad:</span>
                                <span class="priority-badge priority-${ticket.priority}">
                                    <i class="${this.getPriorityIcon(ticket.priority)}"></i>
                                    ${(ticket.priority || 'media').toUpperCase()}
                                </span>
                            </div>
                            <div class="ticket-info-item">
                                <span class="ticket-info-label">Tipo de Trabajo:</span>
                                <span class="ticket-info-value">${ticket.workType}</span>
                            </div>
                            <div class="ticket-info-item">
                                <span class="ticket-info-label">Cliente:</span>
                                <span class="ticket-info-value">${ticket.clientName}</span>
                            </div>
                            <div class="ticket-info-item">
                                <span class="ticket-info-label">Teléfono:</span>
                                <span class="ticket-info-value">${ticket.clientPhone || 'No especificado'}</span>
                            </div>
                            <div class="ticket-info-item">
                                <span class="ticket-info-label">Dirección:</span>
                                <span class="ticket-info-value">${ticket.clientAddress || 'No especificada'}</span>
                            </div>
                            <div class="ticket-info-item">
                                <span class="ticket-info-label">Técnico Asignado:</span>
                                <span class="ticket-info-value">${ticket.assignedTechnicianName || 'Sin asignar'}</span>
                            </div>
                            <div class="ticket-info-item">
                                <span class="ticket-info-label">Fecha de Creación:</span>
                                <span class="ticket-info-value">${this.formatDate(ticket.createdAt)}</span>
                            </div>
                            ${ticket.updatedAt && ticket.updatedAt !== ticket.createdAt ? `
                                <div class="ticket-info-item">
                                    <span class="ticket-info-label">Última Actualización:</span>
                                    <span class="ticket-info-value">${this.formatDate(ticket.updatedAt)}</span>
                                </div>
                            ` : ''}
                        </div>
                    </div>
                    
                    <div class="ticket-modal-section">
                        <h3>Descripción del Trabajo</h3>
                        <p class="ticket-description">${ticket.description}</p>
                    </div>

                    ${ticket.viaticos ? `
                        <div class="ticket-modal-section">
                            <h3>Viáticos</h3>
                            <div class="viaticos-info">
                                <p><strong>Estado:</strong> ${ticket.viaticos.approved ? 'Aprobado' : 'Pendiente'}</p>
                                <p><strong>Monto:</strong> ${ticket.viaticos.amount ? '$' + ticket.viaticos.amount : 'No especificado'}</p>
                                <p><strong>Descripción:</strong> ${ticket.viaticos.description || 'Sin descripción'}</p>
                                ${ticket.viaticos.approvedBy ? `<p><strong>Aprobado por:</strong> ${ticket.viaticos.approvedBy}</p>` : ''}
                            </div>
                        </div>
                    ` : ''}

                    ${ticket.comments && ticket.comments.length > 0 ? `
                        <div class="ticket-modal-section">
                            <h3>Comentarios</h3>
                            <div class="comments-list">
                                ${ticket.comments.map(comment => `
                                    <div class="comment-item">
                                        <div class="comment-header">
                                            <strong>${comment.author}</strong>
                                            <span class="comment-date">${this.formatDate(comment.createdAt)}</span>
                                        </div>
                                        <div class="comment-content">${comment.content}</div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    ` : ''}
                </div>
                
                <div class="ticket-modal-footer">
                    <button class="btn btn-secondary" onclick="this.closest('.ticket-modal-overlay').remove()">
                        Cerrar
                    </button>
                </div>
            </div>
        `;

        // Agregar modal al DOM
        document.body.appendChild(modal);

        // Cerrar con ESC
        const closeHandler = (e) => {
            if (e.key === 'Escape') {
                modal.remove();
                document.removeEventListener('keydown', closeHandler);
            }
        };
        document.addEventListener('keydown', closeHandler);

        // Cerrar al hacer clic fuera del modal
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
                document.removeEventListener('keydown', closeHandler);
            }
        });
    }
}

// Funciones globales para compatibilidad
window.goBackToClients = () => {
    // Navegar directamente a la sección de clientes en admin usando el hash
    window.location.href = 'admin.html#clientes';
};

window.logout = () => {
    localStorage.removeItem('currentUser');
    window.location.href = 'login.html';
};

// Inicializar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    const app = new ClienteTicketsAdmin();
    window.app = app; // Hacer la instancia accesible globalmente
});
