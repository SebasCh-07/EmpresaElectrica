/* ========================================
   DASHBOARD - Plataforma TAT
   Funcionalidades del dashboard
   ======================================== */

// Extender la clase principal con métodos del dashboard
Object.assign(PlataformaTAT.prototype, {
    
    loadDashboard() {
        const dashboardContent = document.getElementById('dashboardContent');
        const tickets = getData('tickets', []);
        const clientes = getData('clientes', []);
        const tecnicos = getData('tecnicos', []);
        const solicitudes = getData('solicitudes', []);

        let content = '';

        if (this.currentUser.rol === 'Administrador') {
            content = this.renderAdminDashboard(tickets, clientes, tecnicos, solicitudes);
        } else if (this.currentUser.rol === 'Mesa de Ayuda') {
            content = this.renderMesaDashboard(tickets, tecnicos, solicitudes);
        } else if (this.currentUser.rol === 'Técnico') {
            content = this.renderTecnicoDashboard(tickets, solicitudes);
        } else if (this.currentUser.rol === 'Cliente') {
            content = this.renderClienteDashboard(tickets);
        }

        dashboardContent.innerHTML = content;
    },

    renderAdminDashboard(tickets, clientes, tecnicos, solicitudes) {
        const ticketsAbiertos = tickets.filter(t => t.estado === 'Abierto').length;
        const ticketsEnProceso = tickets.filter(t => t.estado === 'En Proceso').length;
        const ticketsPreCerrados = tickets.filter(t => t.estado === 'Pre-cerrado').length;
        const ticketsCerrados = tickets.filter(t => t.estado === 'Cerrado').length;
        const totalClientes = clientes.length;
        const tecnicosDisponibles = tecnicos.filter(t => t.estado === 'Disponible').length;
        const solicitudesPendientes = solicitudes.filter(s => s.estado === 'Pendiente').length;
        const ticketsRecientes = this.getTicketsRecientes(tickets, 5);
        const ticketsUrgentes = this.getTicketsUrgentes(tickets, 5);

        return `
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
            
            <div class="dashboard-details">
                <div class="dashboard-section">
                    <h3>Tickets Recientes</h3>
                    <div class="tickets-list">
                        ${ticketsRecientes.map(ticket => `
                            <div class="ticket-item">
                                <div class="ticket-info">
                                    <span class="ticket-id">#${ticket.id}</span>
                                    <span class="ticket-cliente">${ticket.cliente}</span>
                                    <span class="ticket-equipo">${ticket.equipo}</span>
                                </div>
                                <div class="ticket-status">
                                    <span class="status-badge status-${ticket.estado.toLowerCase().replace(' ', '')}">${ticket.estado}</span>
                                    <span class="priority-${ticket.prioridad.toLowerCase()}">${ticket.prioridad}</span>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <div class="dashboard-section">
                    <h3>Tickets Urgentes</h3>
                    <div class="tickets-list">
                        ${ticketsUrgentes.map(ticket => `
                            <div class="ticket-item urgent">
                                <div class="ticket-info">
                                    <span class="ticket-id">#${ticket.id}</span>
                                    <span class="ticket-cliente">${ticket.cliente}</span>
                                    <span class="ticket-equipo">${ticket.equipo}</span>
                                </div>
                                <div class="ticket-status">
                                    <span class="status-badge status-${ticket.estado.toLowerCase().replace(' ', '')}">${ticket.estado}</span>
                                    <span class="priority-${ticket.prioridad.toLowerCase()}">${ticket.prioridad}</span>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    },

    renderMesaDashboard(tickets, tecnicos, solicitudes) {
        const ticketsPendientes = tickets.filter(t => t.estado === 'Abierto').length;
        const tecnicosDisponibles = tecnicos.filter(t => t.estado === 'Disponible').length;
        const solicitudesPendientes = solicitudes.filter(s => s.estado === 'Pendiente').length;
        const ticketsSinAsignar = tickets.filter(t => t.estado === 'Abierto' && !t.tecnicoId).length;

        return `
            <div class="dashboard-grid">
                <div class="dashboard-card">
                    <h3>Tickets Pendientes</h3>
                    <div class="number">${ticketsPendientes}</div>
                    <div class="label">Sin asignar</div>
                </div>
                <div class="dashboard-card">
                    <h3>Tickets Sin Asignar</h3>
                    <div class="number">${ticketsSinAsignar}</div>
                    <div class="label">Requieren técnico</div>
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
            
            <div class="dashboard-details">
                <div class="dashboard-section">
                    <h3>Acciones Rápidas</h3>
                    <div class="quick-actions">
                        <button class="btn btn-primary" onclick="app.showAddTicketModal()">
                            <i class="fas fa-plus"></i> Nuevo Ticket
                        </button>
                        <button class="btn btn-success" onclick="app.showSection('tickets')">
                            <i class="fas fa-ticket-alt"></i> Ver Tickets
                        </button>
                        <button class="btn btn-info" onclick="app.showSection('solicitudes')">
                            <i class="fas fa-clipboard-list"></i> Ver Solicitudes
                        </button>
                        <button class="btn btn-warning" onclick="app.showSection('geolocalizacion')">
                            <i class="fas fa-map"></i> Ver Ubicaciones
                        </button>
                    </div>
                </div>
            </div>
        `;
    },

    renderTecnicoDashboard(tickets, solicitudes) {
        const misTickets = tickets.filter(t => t.tecnicoId === this.currentUser.id);
        const ticketsAsignados = misTickets.length;
        const ticketsEnProceso = misTickets.filter(t => t.estado === 'En Proceso').length;
        const misSolicitudes = solicitudes.filter(s => s.tecnicoId === this.currentUser.id);
        const ticketsCompletados = misTickets.filter(t => t.estado === 'Cerrado').length;

        return `
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
                    <h3>Completados</h3>
                    <div class="number">${ticketsCompletados}</div>
                    <div class="label">Este mes</div>
                </div>
                <div class="dashboard-card">
                    <h3>Mis Solicitudes</h3>
                    <div class="number">${misSolicitudes.length}</div>
                    <div class="label">Herramientas y viáticos</div>
                </div>
            </div>
            
            <div class="dashboard-details">
                <div class="dashboard-section">
                    <h3>Mis Tickets Activos</h3>
                    <div class="tickets-list">
                        ${misTickets.filter(t => t.estado !== 'Cerrado').map(ticket => `
                            <div class="ticket-item">
                                <div class="ticket-info">
                                    <span class="ticket-id">#${ticket.id}</span>
                                    <span class="ticket-cliente">${ticket.cliente}</span>
                                    <span class="ticket-equipo">${ticket.equipo}</span>
                                </div>
                                <div class="ticket-status">
                                    <span class="status-badge status-${ticket.estado.toLowerCase().replace(' ', '')}">${ticket.estado}</span>
                                    <span class="priority-${ticket.prioridad.toLowerCase()}">${ticket.prioridad}</span>
                                </div>
                                <div class="ticket-actions">
                                    <button class="btn btn-sm btn-primary" onclick="app.viewTicket(${ticket.id})">
                                        <i class="fas fa-eye"></i>
                                    </button>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    },

    renderClienteDashboard(tickets) {
        const misTickets = tickets.filter(t => t.clienteId === this.currentUser.id);
        const ticketsAbiertos = misTickets.filter(t => t.estado === 'Abierto' || t.estado === 'En Proceso').length;
        const ticketsCerrados = misTickets.filter(t => t.estado === 'Cerrado').length;
        const ticketsPreCerrados = misTickets.filter(t => t.estado === 'Pre-cerrado').length;

        return `
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
            
            <div class="dashboard-details">
                <div class="dashboard-section">
                    <h3>Mis Tickets Recientes</h3>
                    <div class="tickets-list">
                        ${misTickets.slice(0, 5).map(ticket => `
                            <div class="ticket-item">
                                <div class="ticket-info">
                                    <span class="ticket-id">#${ticket.id}</span>
                                    <span class="ticket-equipo">${ticket.equipo}</span>
                                    <span class="ticket-fecha">${formatDate(ticket.fechaCreacion)}</span>
                                </div>
                                <div class="ticket-status">
                                    <span class="status-badge status-${ticket.estado.toLowerCase().replace(' ', '')}">${ticket.estado}</span>
                                    <span class="priority-${ticket.prioridad.toLowerCase()}">${ticket.prioridad}</span>
                                </div>
                                <div class="ticket-actions">
                                    <button class="btn btn-sm btn-primary" onclick="app.viewTicket(${ticket.id})">
                                        <i class="fas fa-eye"></i>
                                    </button>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <div class="dashboard-section">
                    <h3>Acciones Rápidas</h3>
                    <div class="quick-actions">
                        <button class="btn btn-primary" onclick="app.showAddTicketModal()">
                            <i class="fas fa-plus"></i> Nuevo Ticket
                        </button>
                        <button class="btn btn-success" onclick="app.showSection('tickets')">
                            <i class="fas fa-ticket-alt"></i> Ver Mis Tickets
                        </button>
                        <button class="btn btn-warning" onclick="app.showSection('encuesta')">
                            <i class="fas fa-star"></i> Encuestas Pendientes
                        </button>
                    </div>
                </div>
            </div>
        `;
    },

    getTicketsRecientes(tickets, limit = 5) {
        return tickets
            .sort((a, b) => new Date(b.fechaCreacion) - new Date(a.fechaCreacion))
            .slice(0, limit);
    },

    getTicketsUrgentes(tickets, limit = 5) {
        return tickets
            .filter(t => t.prioridad === 'Alta' && t.estado !== 'Cerrado')
            .sort((a, b) => new Date(a.fechaCreacion) - new Date(b.fechaCreacion))
            .slice(0, limit);
    },

    refreshDashboard() {
        this.loadDashboard();
        this.showAlert('Dashboard actualizado', 'success');
    }
});

// Estilos adicionales para el dashboard
const dashboardStyles = `
    .dashboard-details {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
        gap: var(--spacing-lg);
        margin-top: var(--spacing-xl);
    }
    
    .dashboard-section {
        background-color: var(--bg-primary);
        padding: var(--spacing-lg);
        border-radius: var(--border-radius-lg);
        box-shadow: var(--shadow-sm);
    }
    
    .dashboard-section h3 {
        color: var(--primary-color);
        margin-bottom: var(--spacing-md);
        font-size: var(--font-size-lg);
        border-bottom: 2px solid var(--border-light);
        padding-bottom: var(--spacing-sm);
    }
    
    .tickets-list {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-sm);
    }
    
    .ticket-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: var(--spacing-md);
        background-color: var(--bg-light);
        border-radius: var(--border-radius);
        border: 1px solid var(--border-light);
        transition: all var(--transition-fast);
    }
    
    .ticket-item:hover {
        background-color: var(--bg-primary);
        box-shadow: var(--shadow-sm);
    }
    
    .ticket-item.urgent {
        border-left: 4px solid var(--danger-color);
        background-color: #fff5f5;
    }
    
    .ticket-info {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-xs);
        flex: 1;
    }
    
    .ticket-id {
        font-weight: 600;
        color: var(--primary-color);
        font-size: var(--font-size-sm);
    }
    
    .ticket-cliente {
        color: var(--text-primary);
        font-size: var(--font-size-sm);
    }
    
    .ticket-equipo {
        color: var(--text-secondary);
        font-size: var(--font-size-xs);
    }
    
    .ticket-fecha {
        color: var(--text-muted);
        font-size: var(--font-size-xs);
    }
    
    .ticket-status {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-xs);
        align-items: flex-end;
    }
    
    .ticket-actions {
        margin-left: var(--spacing-sm);
    }
    
    .quick-actions {
        display: flex;
        flex-wrap: wrap;
        gap: var(--spacing-sm);
    }
    
    .quick-actions .btn {
        flex: 1;
        min-width: 150px;
        justify-content: center;
    }
    
    @media (max-width: 768px) {
        .dashboard-details {
            grid-template-columns: 1fr;
        }
        
        .ticket-item {
            flex-direction: column;
            align-items: flex-start;
            gap: var(--spacing-sm);
        }
        
        .ticket-status {
            align-items: flex-start;
            flex-direction: row;
            gap: var(--spacing-sm);
        }
        
        .quick-actions {
            flex-direction: column;
        }
        
        .quick-actions .btn {
            min-width: auto;
        }
    }
`;

// Agregar estilos al documento
const styleSheet = document.createElement('style');
styleSheet.textContent = dashboardStyles;
document.head.appendChild(styleSheet);
