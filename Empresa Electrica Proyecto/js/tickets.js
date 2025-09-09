// Sistema de gestión de tickets

let currentTicketId = null;

const loadTicketsView = (container) => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const role = currentUser.role;
    
    switch (role) {
        case 'admin':
            loadAdminTicketsView(container);
            break;
        case 'mesa_ayuda':
            loadMesaAyudaTicketsView(container);
            break;
        case 'tecnico':
            loadTecnicoTicketsView(container);
            break;
        case 'cliente':
            loadClienteTicketsView(container);
            break;
        default:
            container.innerHTML = '<div class="error-message"><h3>Rol no válido</h3></div>';
    }
};

const loadAdminTicketsView = (container) => {
    const allTickets = DataManager.getAllTickets();
    const openTickets = allTickets.filter(t => ['pendiente', 'asignado'].includes(t.status));
    const preClosedTickets = allTickets.filter(t => ['en_curso', 'pre_cerrado'].includes(t.status));
    const closedTickets = allTickets.filter(t => ['finalizado', 'cancelado'].includes(t.status));
    
    container.innerHTML = `
        <div class="page-header">
            <h1><i class="fas fa-ticket-alt"></i> Todos los Tickets</h1>
            <p>Gestión completa de todos los tickets del sistema</p>
        </div>
        
        <div class="page-content">
            <!-- Pestañas de estado -->
            <div class="admin-tabs">
                <button class="admin-tab active" onclick="switchAdminTab('abiertos')" data-tab="abiertos">
                    <i class="fas fa-folder-open"></i>
                    <span>Abiertos</span>
                    <span class="admin-tab-badge">${openTickets.length}</span>
                </button>
                <button class="admin-tab" onclick="switchAdminTab('pre_cerrados')" data-tab="pre_cerrados">
                    <i class="fas fa-clock"></i>
                    <span>Pre Cerrados</span>
                    <span class="admin-tab-badge">${preClosedTickets.length}</span>
                </button>
                <button class="admin-tab" onclick="switchAdminTab('cerrados')" data-tab="cerrados">
                    <i class="fas fa-check-circle"></i>
                    <span>Cerrados</span>
                    <span class="admin-tab-badge">${closedTickets.length}</span>
                </button>
                <button class="admin-tab" onclick="switchAdminTab('todos')" data-tab="todos">
                    <i class="fas fa-list"></i>
                    <span>Todos</span>
                    <span class="admin-tab-badge">${allTickets.length}</span>
                </button>
            </div>

            <!-- Filtros y búsqueda -->
            <div class="search-filter-bar">
                <div class="search-box">
                    <input type="text" id="admin-ticket-search" placeholder="Buscar tickets..." onkeyup="searchAdminTickets(this.value)">
                    <i class="fas fa-search"></i>
                </div>
                <div class="filter-group">
                    <select id="admin-priority-filter" class="filter-select" onchange="filterAdminTickets()">
                        <option value="">Todas las prioridades</option>
                        <option value="baja">Baja</option>
                        <option value="media">Media</option>
                        <option value="alta">Alta</option>
                        <option value="critica">Crítica</option>
                    </select>
                </div>
            </div>
            
            <!-- Lista de tickets -->
            <div class="table-container">
                <table class="modern-table admin-tickets-table">
                    <thead>
                        <tr>
                            <th class="table-cell-id">Ticket</th>
                            <th class="table-cell-title">Título</th>
                            <th class="table-cell-client">Cliente</th>
                            <th class="table-cell-priority">Prioridad</th>
                            <th class="table-cell-status">Estado</th>
                            <th class="table-cell-technician">Técnico</th>
                            <th class="table-cell-date">Fecha</th>
                            <th class="table-cell-actions">Acciones</th>
                        </tr>
                    </thead>
                    <tbody id="admin-tickets-table-body">
                        ${renderAdminTicketsTable(openTickets, 'abiertos')}
                    </tbody>
                </table>
            </div>
        </div>
    `;
    
    // Inicializar variables globales para el administrador
    window.currentAdminTab = 'abiertos';
    window.allAdminTickets = allTickets;
    window.filteredAdminTickets = openTickets;
    
    setupAdminTicketsFilters();
};

const loadMesaAyudaTicketsView = (container) => {
    const pendingTickets = DataManager.getTicketsByStatus('pendiente');
    const assignedTickets = DataManager.getTicketsByStatus('asignado');
    const completedTickets = DataManager.getTicketsByStatus('finalizado');
    
    container.innerHTML = `
        <div class="page-header">
            <h1><i class="fas fa-ticket-alt"></i> Gestión de Tickets</h1>
            <p>Asignación y seguimiento de tickets</p>
        </div>
        
        <div class="page-content">
            <div class="mesa-tickets-container">
                <div class="mesa-tickets-header">
                    <div>
                        <h2 class="mesa-tickets-title">Todos los Tickets</h2>
                        <p class="mesa-tickets-subtitle">Gestiona y asigna tickets a técnicos</p>
                    </div>
                    <div class="mesa-search-container">
                        <div class="search-bar">
                            <i class="fas fa-search"></i>
                            <input type="text" id="mesa-search-input" placeholder="Buscar tickets..." onkeyup="searchMesaTickets(this.value)">
                        </div>
                    </div>
                </div>
                
                <div class="mesa-tabs">
                    <button class="mesa-tab active" onclick="switchMesaTab('pendientes')">
                        <span>Pendientes</span>
                        <span class="mesa-tab-badge" id="pendientes-count">${pendingTickets.length}</span>
                    </button>
                    <button class="mesa-tab" onclick="switchMesaTab('asignados')">
                        <span>Asignados</span>
                        <span class="mesa-tab-badge" id="asignados-count">${assignedTickets.length}</span>
                    </button>
                    <button class="mesa-tab" onclick="switchMesaTab('completados')">
                        <span>Completados</span>
                        <span class="mesa-tab-badge" id="completados-count">${completedTickets.length}</span>
                    </button>
                </div>
                
                <div class="mesa-tab-content">
                    <div id="mesa-technician-filter" class="mesa-technician-filter" style="display: none;">
                        <div class="filter-group">
                            <label for="technician-select">Filtrar por técnico:</label>
                            <select id="technician-select" onchange="filterByTechnician(this.value)">
                                <option value="">Todos los técnicos</option>
                            </select>
                        </div>
                    </div>
                    <div id="mesa-tickets-list" class="ticket-list">
                        ${renderMesaTicketsByStatus([...pendingTickets, ...assignedTickets, ...completedTickets], 'pendientes')}
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Inicializar variables globales para Mesa de Ayuda
    window.currentMesaTab = 'pendientes';
    window.allMesaTickets = [...pendingTickets, ...assignedTickets, ...completedTickets];
    // Listener en tiempo real
    if (!window._mesaTicketsListener) {
        window._mesaTicketsListener = () => {
            const p = DataManager.getTicketsByStatus('pendiente');
            const a = DataManager.getTicketsByStatus('asignado');
            const c = DataManager.getTicketsByStatus('finalizado');
            window.allMesaTickets = [...p, ...a, ...c];
            const pc = document.getElementById('pendientes-count');
            const ac = document.getElementById('asignados-count');
            const cc = document.getElementById('completados-count');
            if (pc) pc.textContent = p.length;
            if (ac) ac.textContent = a.length;
            if (cc) cc.textContent = c.length;
            const list = document.getElementById('mesa-tickets-list');
            if (list) list.innerHTML = renderMesaTicketsByStatus(window.allMesaTickets, window.currentMesaTab);
        };
        window.addEventListener('tickets:updated', window._mesaTicketsListener);
    }
};

const loadTecnicoTicketsView = (container) => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const myTickets = DataManager.getTicketsByTechnician(currentUser.id);
    
    container.innerHTML = `
        <div class="page-header">
            <h1><i class="fas fa-ticket-alt"></i> Mis Tickets</h1>
            <p>Tickets asignados a ti</p>
        </div>
        
        <div class="page-content">
            <!-- Filtros de estado -->
            <div class="ticket-filters">
                <div class="ticket-filter active" data-status="">Todos</div>
                <div class="ticket-filter" data-status="asignado">Asignados</div>
                <div class="ticket-filter" data-status="en_curso">En Curso</div>
                <div class="ticket-filter" data-status="semi_finalizado">Semi Finalizados</div>
            </div>
            
            <!-- Lista de tickets -->
            <div class="ticket-list" id="tickets-list">
                ${renderTicketsCards(myTickets)}
            </div>
        </div>
    `;
    
    setupTecnicoFilters();
};

const loadClienteTicketsView = (container) => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const myTickets = DataManager.getTicketsByClient(currentUser.id);
    
    container.innerHTML = `
        <div class="page-header">
            <h1><i class="fas fa-ticket-alt"></i> Mis Tickets</h1>
            <p>Tus solicitudes de servicio</p>
        </div>
        
        <div class="page-content">
            <!-- Filtros de estado -->
            <div class="ticket-filters">
                <div class="ticket-filter active" data-status="">Todos</div>
                <div class="ticket-filter" data-status="pendiente">Pendientes</div>
                <div class="ticket-filter" data-status="en_curso">En Progreso</div>
                <div class="ticket-filter" data-status="semi_finalizado">Semi Finalizados</div>
                <div class="ticket-filter" data-status="finalizado">Finalizados</div>
            </div>
            
            <!-- Lista de tickets -->
            <div class="ticket-list" id="tickets-list">
                ${renderTicketsCards(myTickets)}
            </div>
        </div>
    `;
    
    setupClienteFilters();
};

const renderTicketsTable = (tickets) => {
    return tickets.map(ticket => `
        <tr>
            <td><strong>${ticket.id}</strong></td>
            <td>${ticket.title}</td>
            <td>${ticket.clientName}</td>
            <td>
                <span class="priority-badge priority-${ticket.priority}">
                    <i class="${Utils.getPriorityIcon(ticket.priority)}"></i>
                    ${ticket.priority.toUpperCase()}
                </span>
            </td>
            <td>
                <span class="status-badge status-${ticket.status}">
                    <i class="${Utils.getStatusIcon(ticket.status)}"></i>
                    ${ticket.status.replace('_', ' ').toUpperCase()}
                </span>
            </td>
            <td>${ticket.assignedTechnicianName || 'Sin asignar'}</td>
            <td>${Utils.formatDate(ticket.createdAt)}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-sm btn-primary" onclick="loadTicketDetailById('${ticket.id}')">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-sm btn-secondary" onclick="editTicket('${ticket.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
};

const renderAdminTicketsTable = (tickets, currentTab = 'todos') => {
    // Si no hay tickets, mostrar mensaje personalizado según la pestaña
    if (tickets.length === 0) {
        const emptyMessages = {
            'abiertos': {
                icon: 'fas fa-folder-open',
                title: 'No hay tickets abiertos',
                message: 'Todos los tickets han sido procesados o no hay tickets pendientes por asignar en este momento.'
            },
            'pre_cerrados': {
                icon: 'fas fa-clock',
                title: 'No hay tickets pre-cerrados',
                message: 'No hay tickets en proceso de finalización. Los tickets aparecerán aquí cuando estén siendo trabajados o esperando confirmación del cliente.'
            },
            'cerrados': {
                icon: 'fas fa-check-circle',
                title: 'No hay tickets cerrados',
                message: 'No se han finalizado tickets aún. Los tickets completados aparecerán aquí cuando el proceso esté terminado.'
            },
            'todos': {
                icon: 'fas fa-list',
                title: 'No hay tickets en el sistema',
                message: 'No se han creado tickets aún. Los tickets aparecerán aquí cuando los clientes generen solicitudes de servicio.'
            }
        };

        const emptyState = emptyMessages[currentTab] || emptyMessages['todos'];
        
        return `
            <tr>
                <td colspan="8" class="empty-state-cell">
                    <div class="empty-state-container">
                        <div class="empty-state-icon">
                            <i class="${emptyState.icon}"></i>
                        </div>
                        <div class="empty-state-content">
                            <h3 class="empty-state-title">${emptyState.title}</h3>
                            <p class="empty-state-message">${emptyState.message}</p>
                        </div>
                    </div>
                </td>
            </tr>
        `;
    }

    return tickets.map(ticket => `
        <tr>
            <td class="table-cell-id">
                <div class="ticket-id-info">
                    <div class="ticket-id-badge">#${ticket.id}</div>
                    <div class="ticket-type">${ticket.workType || 'Soporte'}</div>
                </div>
            </td>
            <td class="table-cell-title">
                <div class="ticket-title-info">
                    <div class="ticket-title">${ticket.title}</div>
                    <div class="ticket-description">${(ticket.description || '').substring(0, 60)}...</div>
                </div>
            </td>
            <td class="table-cell-client">
                <div class="client-info">
                    <div class="client-details">
                        <div class="client-name">${ticket.clientName}</div>
                        <div class="client-email">${ticket.clientEmail || 'Sin email'}</div>
                    </div>
                </div>
            </td>
            <td class="table-cell-priority">
                <div class="priority-info">
                    <span class="priority-badge priority-${ticket.priority || 'media'}">
                        <i class="${Utils.getPriorityIcon(ticket.priority || 'media')}"></i>
                        ${(ticket.priority || 'media').toUpperCase()}
                    </span>
                </div>
            </td>
            <td class="table-cell-status">
                <div class="status-info">
                    <span class="status-badge status-${ticket.status || 'pendiente'}">
                        <i class="${Utils.getStatusIcon(ticket.status || 'pendiente')}"></i>
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
                        <span>${Utils.formatDate(ticket.createdAt)}</span>
                    </div>
                    ${ticket.updatedAt && ticket.updatedAt !== ticket.createdAt ? `
                        <div class="date-updated">
                            <i class="fas fa-calendar-edit"></i>
                            <span>${Utils.formatDate(ticket.updatedAt)}</span>
                        </div>
                    ` : ''}
                </div>
            </td>
            <td class="table-cell-actions">
                <div class="table-actions">
                    <button class="table-action-btn view-btn" onclick="loadTicketDetailById('${ticket.id}')" title="Ver detalles">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="table-action-btn edit-btn" onclick="editTicket('${ticket.id}')" title="Editar ticket">
                        <i class="fas fa-edit"></i>
                    </button>
                    ${ticket.status === 'pendiente' ? `
                        <button class="table-action-btn assign-btn" onclick="showAssignTechnicianModal('${ticket.id}')" title="Asignar técnico">
                            <i class="fas fa-user-plus"></i>
                        </button>
                    ` : `
                        <button class="table-action-btn assign-btn disabled" disabled title="Solo disponible para tickets pendientes">
                            <i class="fas fa-user-plus"></i>
                        </button>
                    `}
                </div>
            </td>
        </tr>
    `).join('');
};

const renderTicketsCards = (tickets) => {
    if (tickets.length === 0) {
        return '<p class="text-center text-muted">No hay tickets para mostrar</p>';
    }
    
    return tickets.map(ticket => `
        <div class="ticket-card" onclick="loadTicketDetailById('${ticket.id}')">
            <div class="ticket-header">
                <span class="ticket-id">${ticket.id}</span>
                <div class="ticket-priority">
                    <span class="priority-badge priority-${ticket.priority}">
                        <i class="${Utils.getPriorityIcon(ticket.priority)}"></i>
                        ${ticket.priority.toUpperCase()}
                    </span>
                    <span class="status-badge status-${ticket.status || 'pendiente'}">
                        <i class="${Utils.getStatusIcon(ticket.status || 'pendiente')}"></i>
                        ${(ticket.status || 'pendiente').replace('_', ' ').toUpperCase()}
                    </span>
                </div>
            </div>
            <div class="ticket-body">
                <div class="ticket-title">${ticket.title}</div>
                <div class="ticket-description">${(ticket.description || '').substring(0, 150)}...</div>
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
                ${ticket.assignedTechnicianName ? `
                    <div class="ticket-technician">
                        <i class="fas fa-tools"></i>
                        ${(ticket.status === 'finalizado' || ticket.status === 'pre_cerrado') ? 'Completado por:' : 'Asignado a:'} ${ticket.assignedTechnicianName}
                    </div>
                ` : ''}
                ${(ticket.status === 'finalizado' || ticket.status === 'pre_cerrado') && ticket.completedAt ? `
                    <div class="ticket-completion-date">
                        <i class="fas fa-check-circle"></i>
                        Completado: ${Utils.formatRelativeDate(ticket.completedAt)}
                    </div>
                ` : ''}
            </div>
        </div>
    `).join('');
};

const loadTicketDetail = (container) => {
    if (!currentTicketId) {
        container.innerHTML = '<div class="error-message"><h3>No se ha seleccionado ningún ticket</h3></div>';
        return;
    }
    
    loadTicketDetailById(currentTicketId, container);
};

const loadTicketDetailById = (ticketId, container = null) => {
    const ticket = DataManager.getTicketById(ticketId);
    if (!ticket) {
        if (container) {
            container.innerHTML = '<div class="error-message"><h3>Ticket no encontrado</h3></div>';
        }
        return;
    }
    
    currentTicketId = ticketId;
    
    const targetContainer = container || document.getElementById('content-area');
    if (!targetContainer) return;
    
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    // Actualizar el menú activo para mostrar que estamos en la vista de tickets
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    const ticketsLink = document.querySelector('[data-view="tickets"]');
    if (ticketsLink) {
        ticketsLink.classList.add('active');
    }
    
    targetContainer.innerHTML = `
        <div class="page-header">
            <div class="d-flex justify-between align-center">
                <div>
                    <h1><i class="fas fa-ticket-alt"></i> ${ticket.id}</h1>
                    <p>${ticket.title}</p>
                </div>
                <div class="action-buttons">
                    <button class="btn btn-secondary" onclick="app ? app.navigateTo('tickets') : loadTicketsView(document.getElementById('content-area'))">
                        <i class="fas fa-arrow-left"></i> Volver
                    </button>
                </div>
            </div>
        </div>
        
        <div class="page-content">
            <div class="grid-2">
                <!-- Información del ticket -->
                <div class="ticket-detail">
                    <div class="ticket-detail-header">
                        <div class="ticket-detail-title">${ticket.title}</div>
                        <div class="ticket-detail-meta">
                            <span><i class="fas fa-user"></i> ${ticket.clientName}</span>
                            <span><i class="fas fa-calendar"></i> ${Utils.formatDate(ticket.createdAt)}</span>
                            <span><i class="fas fa-clock"></i> ${Utils.formatDuration(ticket.estimatedDuration)}</span>
                        </div>
                    </div>
                    
                    <div class="ticket-detail-body">
                        <div class="ticket-detail-section">
                            <h4>Descripción del Trabajo</h4>
                            <p>${ticket.description}</p>
                        </div>
                        
                        <div class="ticket-info-grid">
                            <div class="ticket-info-item">
                                <span class="ticket-info-label">Prioridad:</span>
                                <span class="priority-badge priority-${ticket.priority}">
                                    <i class="${Utils.getPriorityIcon(ticket.priority)}"></i>
                                    ${ticket.priority.toUpperCase()}
                                </span>
                            </div>
                            <div class="ticket-info-item">
                                <span class="ticket-info-label">Estado:</span>
                                <span class="status-badge status-${ticket.status}">
                                    <i class="${Utils.getStatusIcon(ticket.status)}"></i>
                                    ${ticket.status.replace('_', ' ').toUpperCase()}
                                </span>
                            </div>
                            <div class="ticket-info-item">
                                <span class="ticket-info-label">Tipo de Trabajo:</span>
                                <span>${ticket.workType}</span>
                            </div>
                            <div class="ticket-info-item">
                                <span class="ticket-info-label">Técnico Asignado:</span>
                                <span>${ticket.assignedTechnicianName || 'Sin asignar'}</span>
                            </div>
                            <div class="ticket-info-item">
                                <span class="ticket-info-label">Cliente:</span>
                                <span>${ticket.clientName}</span>
                            </div>
                            <div class="ticket-info-item">
                                <span class="ticket-info-label">Teléfono:</span>
                                <span>${ticket.clientPhone}</span>
                            </div>
                            <div class="ticket-info-item">
                                <span class="ticket-info-label">Dirección:</span>
                                <span>${ticket.clientAddress}</span>
                            </div>
                            <div class="ticket-info-item">
                                <span class="ticket-info-label">Interprovincial:</span>
                                <span>${ticket.isInterprovincial ? 'Sí' : 'No'}</span>
                            </div>
                        </div>
                        
                        ${ticket.viaticos ? `
                            <div class="ticket-detail-section">
                                <h4>Viáticos</h4>
                                <div class="viaticos-info">
                                    <p><strong>Estado:</strong> ${ticket.viaticos.approved ? 'Aprobado' : 'Pendiente'}</p>
                                    <p><strong>Monto:</strong> ${Utils.formatCurrency(ticket.viaticos.amount)}</p>
                                    <p><strong>Descripción:</strong> ${ticket.viaticos.description}</p>
                                    <p><strong>Aprobado por:</strong> ${ticket.viaticos.approvedBy}</p>
                                </div>
                            </div>
                        ` : ''}
                        
                        ${ticket.rubric ? `
                            <div class="ticket-detail-section">
                                <h4>Rúbrica de Trabajo</h4>
                                <div class="rubric-info">
                                    <p><strong>Verificación de Seguridad:</strong> ${ticket.rubric.safetyCheck}</p>
                                    <p><strong>Herramientas Utilizadas:</strong> ${(ticket.rubric.toolsUsed || []).join(', ')}</p>
                                    <p><strong>Trabajo Completado:</strong> ${ticket.rubric.workCompleted}</p>
                                    <p><strong>Problemas Encontrados:</strong> ${ticket.rubric.issuesFound}</p>
                                    <p><strong>Próximos Pasos:</strong> ${ticket.rubric.nextSteps}</p>
                                </div>
                            </div>
                        ` : ''}
                        
                        ${(ticket.status === 'finalizado' && ticket.survey && currentUser.role === 'admin') ? `
                            <div class="ticket-detail-section">
                                <h4>Encuesta de Satisfacción del Cliente</h4>
                                <div class="survey-results-admin">
                                    <div class="survey-ratings">
                                        <div class="survey-rating-item">
                                            <span class="survey-label">Satisfacción General:</span>
                                            <div class="rating-display">
                                                <span class="rating-stars">${'★'.repeat(parseInt(ticket.survey.satisfaction || 0))}${'☆'.repeat(5 - parseInt(ticket.survey.satisfaction || 0))}</span>
                                                <span class="rating-number">${ticket.survey.satisfaction || 0}/5</span>
                                            </div>
                                        </div>
                                        <div class="survey-rating-item">
                                            <span class="survey-label">Calidad del Trabajo:</span>
                                            <div class="rating-display">
                                                <span class="rating-stars">${'★'.repeat(parseInt(ticket.survey.quality || 0))}${'☆'.repeat(5 - parseInt(ticket.survey.quality || 0))}</span>
                                                <span class="rating-number">${ticket.survey.quality || 0}/5</span>
                                            </div>
                                        </div>
                                        <div class="survey-rating-item">
                                            <span class="survey-label">Puntualidad:</span>
                                            <div class="rating-display">
                                                <span class="rating-stars">${'★'.repeat(parseInt(ticket.survey.punctuality || 0))}${'☆'.repeat(5 - parseInt(ticket.survey.punctuality || 0))}</span>
                                                <span class="rating-number">${ticket.survey.punctuality || 0}/5</span>
                                            </div>
                                        </div>
                                        <div class="survey-rating-item">
                                            <span class="survey-label">Comunicación del Técnico:</span>
                                            <div class="rating-display">
                                                <span class="rating-stars">${'★'.repeat(parseInt(ticket.survey.communication || 0))}${'☆'.repeat(5 - parseInt(ticket.survey.communication || 0))}</span>
                                                <span class="rating-number">${ticket.survey.communication || 0}/5</span>
                                            </div>
                                        </div>
                                        <div class="survey-rating-item">
                                            <span class="survey-label">¿Recomendaría nuestros servicios?</span>
                                            <div class="recommendation-display">
                                                <span class="recommendation-badge recommendation-${ticket.survey.recommendation}">${Utils.formatRecommendation(ticket.survey.recommendation)}</span>
                                            </div>
                                        </div>
                                        ${ticket.survey.comments ? `
                                            <div class="survey-rating-item">
                                                <span class="survey-label">Comentarios Adicionales:</span>
                                                <div class="survey-comments">
                                                    <p>"${ticket.survey.comments}"</p>
                                                </div>
                                            </div>
                                        ` : ''}
                                    </div>
                                    <div class="survey-summary">
                                        <div class="survey-summary-item">
                                            <span class="summary-label">Promedio General:</span>
                                            <span class="summary-value">${Utils.calculateSurveyAverage(ticket.survey)}/5</span>
                                        </div>
                                        <div class="survey-summary-item">
                                            <span class="summary-label">Fecha de Encuesta:</span>
                                            <span class="summary-value">${Utils.formatDate(ticket.finalCompletedAt || ticket.completedAt)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ` : ''}
                    </div>
                </div>
                
                <!-- Panel de acciones y comentarios -->
                <div>
                    ${renderTicketActions(ticket, currentUser)}
                    ${renderTicketComments(ticket)}
                </div>
            </div>
        </div>
    `;
};

const renderTicketActions = (ticket, currentUser) => {
    let actions = '';
    
    switch (currentUser.role) {
        case 'admin':
            actions = `
                <div class="card">
                    <div class="card-header">
                        <h3>Acciones Administrativas</h3>
                    </div>
                    <div class="card-body">
                        <div class="action-buttons">
                            <button class="btn btn-primary" onclick="editTicket('${ticket.id}')">
                                <i class="fas fa-edit"></i> Editar
                            </button>
                            <button class="btn btn-warning" onclick="changeTicketStatus('${ticket.id}')">
                                <i class="fas fa-exchange-alt"></i> Cambiar Estado
                            </button>
                            <button class="btn btn-danger" onclick="cancelTicket('${ticket.id}')">
                                <i class="fas fa-times"></i> Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            `;
            break;
            
        case 'mesa_ayuda':
            actions = `
                <div class="card">
                    <div class="card-header">
                        <h3>Gestión de Ticket</h3>
                    </div>
                    <div class="card-body">
                        <div class="action-buttons">
                            ${ticket.status === 'pendiente' ? `
                                <button class="btn btn-primary" onclick="showAssignmentModal('${ticket.id}')">
                                    <i class="fas fa-user-plus"></i> Asignar Técnico
                                </button>
                            ` : `
                                <button class="btn btn-warning" onclick="showAssignmentModal('${ticket.id}')">
                                    <i class="fas fa-user-edit"></i> Reasignar Técnico
                                </button>
                            `}
                            <button class="btn btn-info" onclick="changeTicketStatus('${ticket.id}')">
                                <i class="fas fa-exchange-alt"></i> Cambiar Estado
                            </button>
                            <button class="btn btn-secondary" onclick="editTicket('${ticket.id}')">
                                <i class="fas fa-edit"></i> Editar Ticket
                            </button>
                        </div>
                    </div>
                </div>
            `;
            break;
            
        case 'tecnico':
            if (ticket.assignedTechnicianId === currentUser.id) {
                if (ticket.status === 'asignado') {
                    actions = `
                        <div class="card">
                            <div class="card-header">
                                <h3>Iniciar Trabajo</h3>
                            </div>
                            <div class="card-body">
                                <button class="btn btn-primary" onclick="startTicket('${ticket.id}')">
                                    <i class="fas fa-play"></i> Iniciar Trabajo
                                </button>
                            </div>
                        </div>
                    `;
                } else if (ticket.status === 'en_curso') {
                    actions = `
                        <div class="card">
                            <div class="card-header">
                                <h3>Gestionar Trabajo</h3>
                            </div>
                            <div class="card-body">
                                <button class="btn btn-warning" onclick="showViaticosModal('${ticket.id}')">
                                    <i class="fas fa-money-bill"></i> Solicitar Viáticos
                                </button>
                                <button class="btn btn-success" onclick="showVisitFormModal('${ticket.id}')">
                                    <i class="fas fa-clipboard-check"></i> Completar Formulario de Visita
                                </button>
                            </div>
                        </div>
                    `;
                }
            }
            break;
            
        case 'cliente':
            if (ticket.status === 'pre_cerrado') {
                actions = `
                    <div class="card">
                        <div class="card-header">
                            <h3>Finalizar Servicio</h3>
                        </div>
                        <div class="card-body">
                            <p class="mb-3">El técnico ha completado el trabajo. Para finalizar el servicio y descargar el informe, debe completar la encuesta de satisfacción.</p>
                            <button class="btn btn-primary" onclick="showSurveyModal('${ticket.id}')">
                                <i class="fas fa-star"></i> Completar Encuesta de Satisfacción
                            </button>
                        </div>
                    </div>
                `;
            } else if (ticket.status === 'finalizado') {
                actions = `
                    <div class="card">
                        <div class="card-header">
                            <h3>Descargar Informe</h3>
                        </div>
                        <div class="card-body">
                            <p class="mb-3">Servicio completado. Puede descargar el informe detallado del trabajo realizado.</p>
                            <button class="btn btn-success" onclick="downloadReport('${ticket.id}')">
                                <i class="fas fa-download"></i> Descargar Informe PDF
                            </button>
                        </div>
                    </div>
                `;
            }
            break;
    }
    
    return actions;
};

const renderTicketComments = (ticket) => {
    return `
        <div class="card">
            <div class="card-header">
                <h3>Comentarios</h3>
            </div>
            <div class="card-body">
                <div class="comment-form">
                    <textarea id="new-comment" placeholder="Agregar comentario..."></textarea>
                    <button class="btn btn-primary" onclick="addComment('${ticket.id}')">
                        <i class="fas fa-comment"></i> Agregar Comentario
                    </button>
                </div>
                <div class="comments-list">
                    ${(ticket.comments || []).map(comment => `
                        <div class="comment-item">
                            <div class="comment-header">
                                <span class="comment-author">${comment.author}</span>
                                <span class="comment-date">${Utils.formatRelativeDate(comment.createdAt)}</span>
                            </div>
                            <div class="comment-content">${comment.content}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
};

// Funciones para el manejo de pestañas del administrador
const switchAdminTab = (tabName) => {
    // Actualizar pestañas activas
    document.querySelectorAll('.admin-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    
    // Obtener tickets según la pestaña
    const allTickets = window.allAdminTickets || DataManager.getAllTickets();
    let filteredTickets = [];
    
    switch(tabName) {
        case 'abiertos':
            filteredTickets = allTickets.filter(t => ['pendiente', 'asignado'].includes(t.status));
            break;
        case 'pre_cerrados':
            filteredTickets = allTickets.filter(t => ['en_curso', 'pre_cerrado'].includes(t.status));
            break;
        case 'cerrados':
            filteredTickets = allTickets.filter(t => ['finalizado', 'cancelado'].includes(t.status));
            break;
        case 'todos':
        default:
            filteredTickets = allTickets;
            break;
    }
    
    window.currentAdminTab = tabName;
    window.filteredAdminTickets = filteredTickets;
    
    // Aplicar filtros actuales si existen
    filterAdminTickets();
};

const searchAdminTickets = (searchTerm) => {
    const filteredTickets = window.filteredAdminTickets || [];
    let searchResults = filteredTickets;
    
    if (searchTerm.trim() !== '') {
        searchResults = filteredTickets.filter(ticket => 
            (ticket.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (ticket.description || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (ticket.clientName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (ticket.id || '').toString().includes(searchTerm)
        );
    }
    
    const tableBody = document.getElementById('admin-tickets-table-body');
    if (tableBody) {
        tableBody.innerHTML = renderAdminTicketsTable(searchResults, window.currentAdminTab);
    }
};

const filterAdminTickets = () => {
    const priorityFilter = document.getElementById('admin-priority-filter');
    const searchInput = document.getElementById('admin-ticket-search');
    
    if (!priorityFilter || !searchInput) return;
    
    const priorityValue = priorityFilter.value;
    const searchTerm = searchInput.value.toLowerCase();
    
    let filteredTickets = window.filteredAdminTickets || [];
    
    // Aplicar filtro de prioridad
    if (priorityValue) {
        filteredTickets = filteredTickets.filter(ticket => ticket.priority === priorityValue);
    }
    
    // Aplicar filtro de búsqueda
    if (searchTerm.trim() !== '') {
        filteredTickets = filteredTickets.filter(ticket => 
            (ticket.title || '').toLowerCase().includes(searchTerm) ||
            (ticket.description || '').toLowerCase().includes(searchTerm) ||
            (ticket.clientName || '').toLowerCase().includes(searchTerm) ||
            (ticket.id || '').toString().includes(searchTerm)
        );
    }
    
    const tableBody = document.getElementById('admin-tickets-table-body');
    if (tableBody) {
        tableBody.innerHTML = renderAdminTicketsTable(filteredTickets, window.currentAdminTab);
    }
};

// Función de configuración para los filtros del administrador
const setupAdminTicketsFilters = () => {
    const priorityFilter = document.getElementById('admin-priority-filter');
    const searchInput = document.getElementById('admin-ticket-search');
    
    if (priorityFilter) {
        priorityFilter.addEventListener('change', filterAdminTickets);
    }
    
    if (searchInput) {
        searchInput.addEventListener('input', Utils.debounce(filterAdminTickets, 300));
    }
};

const setupMesaAyudaFilters = () => {
    const filters = document.querySelectorAll('.ticket-filter');
    filters.forEach(filter => {
        filter.addEventListener('click', () => {
            filters.forEach(f => f.classList.remove('active'));
            filter.classList.add('active');
            
            const status = filter.dataset.status;
            const allTickets = DataManager.getAllTickets();
            const filteredTickets = status ? 
                allTickets.filter(t => t.status === status) : 
                allTickets.filter(t => ['pendiente', 'asignado'].includes(t.status));
            
            document.getElementById('tickets-list').innerHTML = renderTicketsCards(filteredTickets);
        });
    });
};

const setupTecnicoFilters = () => {
    const filters = document.querySelectorAll('.ticket-filter');
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    filters.forEach(filter => {
        filter.addEventListener('click', () => {
            filters.forEach(f => f.classList.remove('active'));
            filter.classList.add('active');
            
            const status = filter.dataset.status;
            const myTickets = DataManager.getTicketsByTechnician(currentUser.id);
            const filteredTickets = status ? 
                myTickets.filter(t => t.status === status) : 
                myTickets;
            
            document.getElementById('tickets-list').innerHTML = renderTicketsCards(filteredTickets);
        });
    });
};

const setupClienteFilters = () => {
    const filters = document.querySelectorAll('.ticket-filter');
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    filters.forEach(filter => {
        filter.addEventListener('click', () => {
            filters.forEach(f => f.classList.remove('active'));
            filter.classList.add('active');
            
            const status = filter.dataset.status;
            const myTickets = DataManager.getTicketsByClient(currentUser.id);
            const filteredTickets = status ? 
                myTickets.filter(t => t.status === status) : 
                myTickets;
            
            document.getElementById('tickets-list').innerHTML = renderTicketsCards(filteredTickets);
        });
    });
};

// Funciones de acciones
const addComment = (ticketId) => {
    const commentText = document.getElementById('new-comment').value.trim();
    if (!commentText) {
        Utils.showToast('Por favor ingresa un comentario', 'warning');
        return;
    }
    
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const comment = {
        author: currentUser.name,
        authorRole: currentUser.role,
        content: commentText
    };
    
    DataManager.addCommentToTicket(ticketId, comment);
    document.getElementById('new-comment').value = '';
    loadTicketDetailById(ticketId);
    Utils.showToast('Comentario agregado', 'success');
};

const startTicket = (ticketId) => {
    DataManager.updateTicket(ticketId, {
        status: 'en_curso',
        startedAt: new Date().toISOString()
    });
    
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    DataManager.addCommentToTicket(ticketId, {
        author: currentUser.name,
        authorRole: currentUser.role,
        content: 'Trabajo iniciado'
    });
    
    loadTicketDetailById(ticketId);
    Utils.showToast('Trabajo iniciado', 'success');
};

// Funciones para Mesa de Ayuda - Pestañas y búsqueda
const renderMesaTicketsByStatus = (tickets, status) => {
    let filteredTickets = tickets;
    
    if (status === 'pendientes') {
        filteredTickets = tickets.filter(t => t.status === 'pendiente');
    } else if (status === 'asignados') {
        filteredTickets = tickets.filter(t => t.status === 'asignado');
    } else if (status === 'completados') {
        filteredTickets = tickets.filter(t => t.status === 'finalizado' || t.status === 'pre_cerrado');
    }
    
    return renderTicketsCards(filteredTickets);
};

const switchMesaTab = (tabName) => {
    // Actualizar pestañas activas
    document.querySelectorAll('.mesa-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelector(`[onclick="switchMesaTab('${tabName}')"]`).classList.add('active');
    
    // Mostrar/ocultar filtro de técnico
    const technicianFilter = document.getElementById('mesa-technician-filter');
    if (technicianFilter) {
        if (tabName === 'completados') {
            technicianFilter.style.display = 'block';
            populateTechnicianFilter();
        } else {
            technicianFilter.style.display = 'none';
        }
    }
    
    window.currentMesaTab = tabName;
    const ticketsList = document.getElementById('mesa-tickets-list');
    if (ticketsList) {
        ticketsList.innerHTML = renderMesaTicketsByStatus(window.allMesaTickets, tabName);
    }
};

const searchMesaTickets = (searchTerm) => {
    const allTickets = window.allMesaTickets || [];
    let filteredTickets = allTickets;
    
    if (searchTerm.trim() !== '') {
        filteredTickets = allTickets.filter(ticket => 
            ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ticket.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ticket.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ticket.id.toString().includes(searchTerm)
        );
    }
    
    const ticketsList = document.getElementById('mesa-tickets-list');
    if (ticketsList) {
        ticketsList.innerHTML = renderMesaTicketsByStatus(filteredTickets, window.currentMesaTab);
    }
};

const populateTechnicianFilter = () => {
    const completedTickets = window.allMesaTickets.filter(t => t.status === 'finalizado' || t.status === 'pre_cerrado');
    const technicians = [...new Set(completedTickets.map(ticket => ticket.assignedTo).filter(Boolean))];
    
    const technicianSelect = document.getElementById('technician-select');
    if (technicianSelect) {
        // Limpiar opciones existentes excepto "Todos los técnicos"
        technicianSelect.innerHTML = '<option value="">Todos los técnicos</option>';
        
        // Agregar técnicos únicos
        technicians.forEach(technicianId => {
            const technician = DataManager.getUserById(technicianId);
            if (technician) {
                const option = document.createElement('option');
                option.value = technicianId;
                option.textContent = technician.name;
                technicianSelect.appendChild(option);
            }
        });
    }
};

const filterByTechnician = (technicianId) => {
    const allTickets = window.allMesaTickets || [];
    let filteredTickets = allTickets;
    
    if (technicianId && window.currentMesaTab === 'completados') {
        filteredTickets = allTickets.filter(ticket => 
            (ticket.status === 'finalizado' || ticket.status === 'pre_cerrado') &&
            ticket.assignedTo === technicianId
        );
    }
    
    const ticketsList = document.getElementById('mesa-tickets-list');
    if (ticketsList) {
        ticketsList.innerHTML = renderMesaTicketsByStatus(filteredTickets, window.currentMesaTab);
    }
};

// Función para mostrar modal de asignación de técnico
const showAssignTechnicianModal = (ticketId) => {
    const ticket = DataManager.getTicketById(ticketId);
    if (!ticket) {
        Utils.showToast('Ticket no encontrado', 'error');
        return;
    }
    
    if (ticket.status !== 'pendiente') {
        Utils.showToast('Solo se pueden asignar técnicos a tickets pendientes', 'warning');
        return;
    }
    
    const availableTechnicians = DataManager.getUsersByRole('tecnico');
    
    const modal = document.createElement('div');
    modal.className = 'modal assign-technician-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3><i class="fas fa-user-plus"></i> Asignar Técnico</h3>
                <button class="modal-close" onclick="this.closest('.modal').remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <div class="ticket-info-summary">
                    <h4>Ticket: ${ticket.id}</h4>
                    <p><strong>Título:</strong> ${ticket.title}</p>
                    <p><strong>Cliente:</strong> ${ticket.clientName}</p>
                    <p><strong>Prioridad:</strong> <span class="priority-badge priority-${ticket.priority}">${ticket.priority.toUpperCase()}</span></p>
                    <p><strong>Dirección:</strong> ${ticket.clientAddress}</p>
                </div>
                
                <form id="assign-technician-form" onsubmit="assignTechnicianToTicket(event, '${ticketId}')">
                    <div class="form-group">
                        <label for="technician-select">Seleccionar Técnico:</label>
                        <select id="technician-select" name="technicianId" required class="form-select">
                            <option value="">-- Selecciona un técnico --</option>
                            ${availableTechnicians.map(tech => `
                                <option value="${tech.id}" data-status="${tech.status}">
                                    ${tech.name} - ${tech.status === 'disponible' ? '✅ Disponible' : '⏰ Ocupado'}
                                    ${tech.specializations ? ` (${tech.specializations.join(', ')})` : ''}
                                </option>
                            `).join('')}
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label for="visit-date">Fecha de Visita:</label>
                        <input type="datetime-local" id="visit-date" name="visitDate" required class="form-input">
                    </div>
                    
                    <div class="form-group">
                        <label for="estimated-duration">Duración Estimada (horas):</label>
                        <input type="number" id="estimated-duration" name="estimatedDuration" min="1" max="24" value="2" required class="form-input">
                    </div>
                    
                    <div class="form-group">
                        <label for="assignment-notes">Notas para el Técnico:</label>
                        <textarea id="assignment-notes" name="notes" placeholder="Instrucciones especiales, detalles importantes..." class="form-textarea"></textarea>
                    </div>
                    
                    <div class="modal-actions">
                        <button type="button" class="btn btn-secondary" onclick="this.closest('.modal').remove()">
                            Cancelar
                        </button>
                        <button type="submit" class="btn btn-primary">
                            <i class="fas fa-user-plus"></i> Asignar Técnico
                        </button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Establecer fecha mínima como ahora
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    document.getElementById('visit-date').min = now.toISOString().slice(0, 16);
};

// Función para procesar la asignación del técnico
const assignTechnicianToTicket = (event, ticketId) => {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const technicianId = parseInt(formData.get('technicianId'));
    const visitDate = formData.get('visitDate');
    const estimatedDuration = parseInt(formData.get('estimatedDuration'));
    const notes = formData.get('notes');
    
    const technician = DataManager.getUserById(technicianId);
    if (!technician) {
        Utils.showToast('Técnico no encontrado', 'error');
        return;
    }
    
    // Actualizar el ticket
    const updatedTicket = DataManager.updateTicket(ticketId, {
        status: 'asignado',
        assignedTechnicianId: technicianId,
        assignedTechnicianName: technician.name,
        assignedAt: new Date().toISOString(),
        visitDate: new Date(visitDate).toISOString(),
        estimatedDuration: estimatedDuration
    });
    
    // Agregar comentario sobre la asignación
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    DataManager.addCommentToTicket(ticketId, {
        author: currentUser.name,
        authorRole: currentUser.role,
        content: `Ticket asignado a ${technician.name}. Visita programada para ${new Date(visitDate).toLocaleString('es-ES')}. Duración estimada: ${estimatedDuration} horas.${notes ? ` Notas: ${notes}` : ''}`
    });
    
    // Actualizar estado del técnico a ocupado si estaba disponible
    if (technician.status === 'disponible') {
        DataManager.updateTechnicianStatus(technicianId, 'ocupado');
    }
    
    // Cerrar modal
    document.querySelector('.assign-technician-modal').remove();
    
    // Mostrar mensaje de éxito
    Utils.showToast(`Técnico ${technician.name} asignado exitosamente al ticket ${ticketId}`, 'success');
    
    // Recargar la vista de tickets para mostrar los cambios
    loadAdminTicketsView(document.getElementById('content-area'));
};

// Funciones para gestión de tickets del admin
const editTicket = (ticketId) => {
    Utils.showToast(`Editando ticket #${ticketId}`, 'info');
    // Aquí se podría abrir un modal de edición
};

const assignTicket = (ticketId) => {
    showAssignTechnicianModal(ticketId);
};

// Funciones globales
window.loadTicketDetailById = loadTicketDetailById;
window.addComment = addComment;
window.startTicket = startTicket;
window.switchMesaTab = switchMesaTab;
window.searchMesaTickets = searchMesaTickets;
window.filterByTechnician = filterByTechnician;
window.editTicket = editTicket;
window.assignTicket = assignTicket;
window.switchAdminTab = switchAdminTab;
window.searchAdminTickets = searchAdminTickets;
window.filterAdminTickets = filterAdminTickets;
window.showAssignTechnicianModal = showAssignTechnicianModal;
window.assignTechnicianToTicket = assignTechnicianToTicket;

