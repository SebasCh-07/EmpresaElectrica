// Dashboard para cada rol

const loadDashboard = (container) => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const role = currentUser.role;
    
    switch (role) {
        case 'admin':
            loadAdminDashboard(container);
            break;
        case 'mesa_ayuda':
            loadMesaAyudaDashboard(container);
            break;
        case 'tecnico':
            loadTecnicoDashboard(container);
            break;
        case 'cliente':
            loadClienteDashboard(container);
            break;
        default:
            container.innerHTML = '<div class="error-message"><h3>Rol no válido</h3></div>';
    }
};

const loadAdminDashboard = (container) => {
    const stats = DataManager.getStats();
    // Ordenar tickets por fecha de creación (más recientes primero) y tomar los primeros 5
    const allTickets = DataManager.getAllTickets();
    const recentTickets = allTickets
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);
    const technicians = DataManager.getUsersByRole('tecnico');
    
    container.innerHTML = `
        <div class="page-header">
            <h1><i class="fas fa-tachometer-alt"></i> Dashboard Administrador</h1>
            <p>Vista general del sistema y gestión completa</p>
        </div>
        
        <div class="page-content">
            <!-- Estadísticas principales -->
            <div class="stats-grid">
                <div class="stat-card warning">
                    <div class="stat-number">${stats.pendingTickets}</div>
                    <div class="stat-label">Pendientes</div>
                    <i class="fas fa-clock stat-icon"></i>
                </div>
                <div class="stat-card info">
                    <div class="stat-number">${stats.inProgressTickets}</div>
                    <div class="stat-label">En Progreso</div>
                    <i class="fas fa-tools stat-icon"></i>
                </div>
                <div class="stat-card success">
                    <div class="stat-number">${stats.completedTickets}</div>
                    <div class="stat-label">Completados</div>
                    <i class="fas fa-check-circle stat-icon"></i>
                </div>
                <div class="stat-card">
                    <div class="stat-number">${stats.totalClients}</div>
                    <div class="stat-label">Clientes</div>
                    <i class="fas fa-users stat-icon"></i>
                </div>
                <div class="stat-card">
                    <div class="stat-number">${stats.totalTechnicians}</div>
                    <div class="stat-label">Técnicos</div>
                    <i class="fas fa-tools stat-icon"></i>
                </div>
            </div>
            
            <div class="grid-2">
                <!-- Tickets recientes -->
                <div class="card">
                    <div class="card-header">
                        <h3><i class="fas fa-ticket-alt"></i> Tickets Recientes</h3>
                        <p>Últimos tickets creados en el sistema</p>
                    </div>
                    <div class="card-body">
                        <div class="ticket-list">
                            ${recentTickets.map(ticket => `
                                <div class="ticket-card dashboard-ticket-card" onclick="app.navigateTo('ticket-detail'); loadTicketDetailById('${ticket.id}')">
                                    <div class="ticket-header">
                                        <div class="ticket-id-section">
                                            <span class="ticket-id">${ticket.id}</span>
                                            <span class="status-badge status-${ticket.status || 'pendiente'}">
                                                <i class="${Utils.getStatusIcon(ticket.status || 'pendiente')}"></i>
                                                ${(ticket.status || 'pendiente').replace('_', ' ').toUpperCase()}
                                            </span>
                                        </div>
                                        <span class="priority-badge priority-${ticket.priority || 'media'}">
                                            <i class="${Utils.getPriorityIcon(ticket.priority || 'media')}"></i>
                                            ${(ticket.priority || 'media').toUpperCase()}
                                        </span>
                                    </div>
                                    <div class="ticket-body">
                                        <div class="ticket-title">${ticket.title}</div>
                                        <div class="ticket-description">${(ticket.description || '').substring(0, 100)}...</div>
                                        <div class="ticket-meta">
                                            <div class="ticket-client">
                                                <i class="fas fa-user"></i>
                                                ${ticket.clientName}
                                            </div>
                                            <div class="ticket-date">
                                                <i class="fas fa-calendar"></i>
                                                ${Utils.formatRelativeDate(ticket.createdAt)}
                                            </div>
                                            ${ticket.assignedTechnicianName ? `
                                                <div class="ticket-technician">
                                                    <i class="fas fa-tools"></i>
                                                    ${ticket.assignedTechnicianName}
                                                </div>
                                            ` : ''}
                                        </div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    <div class="card-footer">
                        <button class="btn btn-primary" onclick="app.navigateTo('tickets')">
                            Ver Todos los Tickets
                        </button>
                    </div>
                </div>
                
                <!-- Estado de técnicos -->
                <div class="card">
                    <div class="card-header">
                        <h3><i class="fas fa-tools"></i> Estado de Técnicos</h3>
                        <p>Disponibilidad y ubicación de técnicos</p>
                    </div>
                    <div class="card-body">
                        <div class="technician-list">
                            ${technicians.map(tech => `
                                <div class="technician-item">
                                    <div class="technician-info">
                                        <div class="technician-avatar">${tech.avatar}</div>
                                        <div class="technician-details">
                                            <h4>${tech.name}</h4>
                                            <p>${tech.specializations ? tech.specializations.join(', ') : 'Sin especializaciones'}</p>
                                        </div>
                                    </div>
                                    <div class="technician-status">
                                        <div class="status-indicator ${tech.status}"></div>
                                        <span class="status-badge status-${tech.status}">
                                            ${tech.status === 'disponible' ? 'Disponible' : 
                                              tech.status === 'ocupado' ? 'Ocupado' : 'Desconectado'}
                                        </span>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    <div class="card-footer">
                        <button class="btn btn-primary" onclick="app.navigateTo('geolocalizacion')">
                            Ver Mapa
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
};

const loadMesaAyudaDashboard = (container) => {
    const pendingTickets = DataManager.getTicketsByStatus('pendiente');
    const assignedTickets = DataManager.getTicketsByStatus('asignado');
    const availableTechnicians = DataManager.getAvailableTechnicians();
    
    container.innerHTML = `
        <div class="page-header">
            <h1><i class="fas fa-headset"></i> Dashboard Mesa de Ayuda</h1>
            <p>Gestión de tickets y asignación a técnicos</p>
        </div>
        
        <div class="page-content">
            <!-- Estadísticas -->
            <div class="stats-grid">
                <div class="stat-card warning">
                    <div class="stat-number">${pendingTickets.length}</div>
                    <div class="stat-label">Tickets Pendientes</div>
                    <i class="fas fa-clock stat-icon"></i>
                </div>
                <div class="stat-card info">
                    <div class="stat-number">${assignedTickets.length}</div>
                    <div class="stat-label">Tickets Asignados</div>
                    <i class="fas fa-user-check stat-icon"></i>
                </div>
                <div class="stat-card success">
                    <div class="stat-number">${availableTechnicians.length}</div>
                    <div class="stat-label">Técnicos Disponibles</div>
                    <i class="fas fa-tools stat-icon"></i>
                </div>
            </div>
            
            <div class="grid-2">
                <!-- Tickets pendientes de asignación -->
                <div class="card">
                    <div class="card-header">
                        <h3><i class="fas fa-exclamation-triangle"></i> Tickets Pendientes</h3>
                        <p>Tickets que requieren asignación a técnicos</p>
                    </div>
                    <div class="card-body">
                        ${pendingTickets.length === 0 ? 
                            '<p class="text-center text-muted">No hay tickets pendientes</p>' :
                            pendingTickets.map(ticket => `
                                <div class="ticket-card" onclick="showAssignmentModal('${ticket.id}')">
                                    <div class="ticket-header">
                                        <span class="ticket-id">${ticket.id}</span>
                                        <span class="priority-badge priority-${ticket.priority}">
                                            <i class="${Utils.getPriorityIcon(ticket.priority)}"></i>
                                            ${ticket.priority.toUpperCase()}
                                        </span>
                                    </div>
                                    <div class="ticket-body">
                                        <div class="ticket-title">${ticket.title}</div>
                                        <div class="ticket-description">${(ticket.description || '').substring(0, 100)}...</div>
                                        <div class="ticket-meta">
                                            <div class="ticket-client">
                                                <i class="fas fa-user"></i>
                                                ${ticket.clientName}
                                            </div>
                                            <div class="ticket-date">
                                                <i class="fas fa-calendar"></i>
                                                ${Utils.formatRelativeDate(ticket.createdAt)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            `).join('')
                        }
                    </div>
                </div>
                
                <!-- Técnicos disponibles -->
                <div class="card">
                    <div class="card-header">
                        <h3><i class="fas fa-tools"></i> Técnicos Disponibles</h3>
                        <p>Técnicos listos para recibir asignaciones</p>
                    </div>
                    <div class="card-body">
                        ${availableTechnicians.length === 0 ? 
                            '<p class="text-center text-muted">No hay técnicos disponibles</p>' :
                            availableTechnicians.map(tech => `
                                <div class="technician-item">
                                    <div class="technician-info">
                                        <div class="technician-avatar">${tech.avatar}</div>
                                        <div class="technician-details">
                                            <h4>${tech.name}</h4>
                                            <p>${tech.specializations ? tech.specializations.join(', ') : 'Sin especializaciones'}</p>
                                        </div>
                                    </div>
                                    <div class="technician-status">
                                        <div class="status-indicator"></div>
                                        <span class="status-badge status-disponible">Disponible</span>
                                    </div>
                                </div>
                            `).join('')
                        }
                    </div>
                </div>
            </div>
        </div>
    `;
};

const loadTecnicoDashboard = (container) => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const myTickets = DataManager.getTicketsByTechnician(currentUser.id);
    const inProgressTickets = myTickets.filter(t => t.status === 'en_curso');
    const pendingTickets = myTickets.filter(t => t.status === 'asignado');
    
    container.innerHTML = `
        <div class="page-header">
            <h1><i class="fas fa-tools"></i> Dashboard Técnico</h1>
            <p>Gestión de tus asignaciones y trabajos</p>
        </div>
        
        <div class="page-content">
            <!-- Estadísticas -->
            <div class="stats-grid">
                <div class="stat-card warning">
                    <div class="stat-number">${pendingTickets.length}</div>
                    <div class="stat-label">Asignados</div>
                    <i class="fas fa-user-check stat-icon"></i>
                </div>
                <div class="stat-card info">
                    <div class="stat-number">${inProgressTickets.length}</div>
                    <div class="stat-label">En Progreso</div>
                    <i class="fas fa-tools stat-icon"></i>
                </div>
                <div class="stat-card success">
                    <div class="stat-number">${myTickets.filter(t => t.status === 'finalizado').length}</div>
                    <div class="stat-label">Completados</div>
                    <i class="fas fa-check-circle stat-icon"></i>
                </div>
            </div>
            
            <!-- Mis tickets -->
            <div class="card">
                <div class="card-header">
                    <h3><i class="fas fa-ticket-alt"></i> Mis Tickets</h3>
                    <p>Tickets asignados a ti</p>
                </div>
                <div class="card-body">
                    ${myTickets.length === 0 ? 
                        '<p class="text-center text-muted">No tienes tickets asignados</p>' :
                        myTickets.map(ticket => `
                            <div class="ticket-card" onclick="app.navigateTo('ticket-detail'); loadTicketDetailById('${ticket.id}')">
                                <div class="ticket-header">
                                    <span class="ticket-id">${ticket.id}</span>
                                    <span class="status-badge status-${ticket.status}">
                                        <i class="${Utils.getStatusIcon(ticket.status)}"></i>
                                        ${ticket.status.replace('_', ' ').toUpperCase()}
                                    </span>
                                </div>
                                <div class="ticket-body">
                                    <div class="ticket-title">${ticket.title}</div>
                                    <div class="ticket-description">${(ticket.description || '').substring(0, 100)}...</div>
                                    <div class="ticket-meta">
                                        <div class="ticket-client">
                                            <i class="fas fa-user"></i>
                                            ${ticket.clientName}
                                        </div>
                                        <div class="ticket-date">
                                            <i class="fas fa-calendar"></i>
                                            ${Utils.formatRelativeDate(ticket.createdAt)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        `).join('')
                    }
                </div>
            </div>
        </div>
    `;
};

const loadClienteDashboard = (container) => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const myTickets = DataManager.getTicketsByClient(currentUser.id);
    const pendingTickets = myTickets.filter(t => t.status === 'pendiente');
    const inProgressTickets = myTickets.filter(t => t.status === 'en_curso');
    const completedTickets = myTickets.filter(t => t.status === 'finalizado');
    
    container.innerHTML = `
        <div class="page-header">
            <h1><i class="fas fa-user"></i> Dashboard Cliente</h1>
            <p>Gestión de tus solicitudes de servicio</p>
        </div>
        
        <div class="page-content">
            <!-- Estadísticas -->
            <div class="stats-grid">
                <div class="stat-card warning">
                    <div class="stat-number">${pendingTickets.length}</div>
                    <div class="stat-label">Pendientes</div>
                    <i class="fas fa-clock stat-icon"></i>
                </div>
                <div class="stat-card info">
                    <div class="stat-number">${inProgressTickets.length}</div>
                    <div class="stat-label">En Progreso</div>
                    <i class="fas fa-tools stat-icon"></i>
                </div>
                <div class="stat-card success">
                    <div class="stat-number">${completedTickets.length}</div>
                    <div class="stat-label">Completados</div>
                    <i class="fas fa-check-circle stat-icon"></i>
                </div>
            </div>
            
            <!-- Acciones rápidas -->
            <div class="card">
                <div class="card-header">
                    <h3><i class="fas fa-bolt"></i> Acciones Rápidas</h3>
                    <p>Acciones disponibles para ti</p>
                </div>
                <div class="card-body">
                    <div class="action-buttons">
                        <button class="btn btn-primary" onclick="app.navigateTo('ticket-form')">
                            <i class="fas fa-plus"></i> Nuevo Ticket
                        </button>
                        <button class="btn btn-secondary" onclick="app.navigateTo('tickets')">
                            <i class="fas fa-list"></i> Ver Mis Tickets
                        </button>
                    </div>
                </div>
            </div>
            
            <!-- Mis tickets recientes -->
            <div class="card">
                <div class="card-header">
                    <h3><i class="fas fa-ticket-alt"></i> Mis Tickets Recientes</h3>
                    <p>Últimos tickets que has creado</p>
                </div>
                <div class="card-body">
                    ${myTickets.length === 0 ? 
                        '<p class="text-center text-muted">No has creado ningún ticket aún</p>' :
                        myTickets.slice(0, 5).map(ticket => `
                            <div class="ticket-card" onclick="app.navigateTo('ticket-detail'); loadTicketDetailById('${ticket.id}')">
                                <div class="ticket-header">
                                    <span class="ticket-id">${ticket.id}</span>
                                    <span class="status-badge status-${ticket.status}">
                                        <i class="${Utils.getStatusIcon(ticket.status)}"></i>
                                        ${ticket.status.replace('_', ' ').toUpperCase()}
                                    </span>
                                </div>
                                <div class="ticket-body">
                                    <div class="ticket-title">${ticket.title}</div>
                                    <div class="ticket-description">${(ticket.description || '').substring(0, 100)}...</div>
                                    <div class="ticket-meta">
                                        <div class="ticket-date">
                                            <i class="fas fa-calendar"></i>
                                            ${Utils.formatRelativeDate(ticket.createdAt)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        `).join('')
                    }
                </div>
                <div class="card-footer">
                    <button class="btn btn-primary" onclick="app.navigateTo('tickets')">
                        Ver Todos Mis Tickets
                    </button>
                </div>
            </div>
        </div>
    `;
};

