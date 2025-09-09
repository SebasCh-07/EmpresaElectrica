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
        // Refrescar en tiempo real cuando se actualicen tickets
        window.addEventListener('tickets:updated', () => {
            const active = document.querySelector('.nav-link.active');
            if (!active) return;
            const view = active.getAttribute('data-view');
            if (view === 'dashboard') this.loadTecnicoDashboard();
            if (view === 'tickets') this.loadTecnicoTickets();
        });
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
                        <div class="tecnico-actions">
                            <button class="btn btn-primary" onclick="app.showToolRequestModal()">
                                <i class="fas fa-tools"></i>
                                Solicitar Herramientas
                            </button>
                        </div>
                    </div>
                    <div id="tecnico-tickets-list">
                        ${this.renderTecnicoTickets(userTickets.filter(t => t.status === 'asignado').slice(0, 5))}
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
                        <div class="tecnico-header-actions">
                            <div class="tecnico-search-container">
                                <div class="search-bar">
                                    <i class="fas fa-search"></i>
                                    <input type="text" id="tecnico-search-input" placeholder="Buscar asignaciones..." onkeyup="app.searchTecnicoTickets(this.value)">
                                </div>
                            </div>
                            <div class="tecnico-actions">
                                <button class="btn btn-primary" onclick="app.showToolRequestModal()">
                                    <i class="fas fa-tools"></i>
                                    Solicitar Herramientas
                                </button>
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
        // Como solo hay un usuario técnico en el login, mostrar todas las asignaciones del sistema
        const all = DataManager.getAllTickets();
        return all.filter(t => ['asignado', 'en_curso', 'pre_cerrado', 'finalizado'].includes(t.status));
    }

    getUserViaticos() {
        const allViaticos = JSON.parse(localStorage.getItem('viaticos') || '[]');
        return allViaticos.filter(viatico => viatico.tecnico === this.currentUser.name);
    }

    calculateTecnicoStats(tickets) {
        return {
            asignados: tickets.filter(t => t.status === 'asignado').length,
            enCurso: tickets.filter(t => t.status === 'en_curso').length,
            completados: tickets.filter(t => t.status === 'finalizado' || t.status === 'pre_cerrado').length,
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
                    <div class="tecnico-ticket-fecha">${Utils.formatDate(ticket.createdAt)}</div>
                </div>
                
                <div class="tecnico-client-info">
                    <h4><i class="fas fa-user"></i> Información del Cliente</h4>
                    <div class="tecnico-client-details">
                        <span><i class="fas fa-user"></i> ${ticket.clientName}</span>
                        <span><i class="fas fa-map-marker-alt"></i> ${ticket.clientAddress || 'No especificada'}</span>
                        <span><i class="fas fa-phone"></i> ${ticket.clientPhone || 'No especificado'}</span>
                        <span><i class="fas fa-tag"></i> ${Utils.getPriorityLabel(ticket.priority)}</span>
                    </div>
                </div>
                
                <div class="tecnico-ticket-titulo">${ticket.title}</div>
                <div class="tecnico-ticket-descripcion">${ticket.description}</div>
                
                <div class="tecnico-ticket-meta">
                    <div class="tecnico-ticket-info">
                        <span class="status-badge status-${ticket.status}">${Utils.getStatusLabel(ticket.status)}</span>
                        <span class="priority-badge priority-${ticket.priority}">${Utils.getPriorityLabel(ticket.priority)}</span>
                    </div>
                    
                    <div class="tecnico-ticket-actions">
                        <button class="tecnico-action-btn" onclick="app.viewTicket('${ticket.id}')">
                            <i class="fas fa-eye"></i>
                            Ver
                        </button>
                        ${ticket.status === 'asignado' ? `
                            <button class="tecnico-action-btn primary" onclick="app.startWork('${ticket.id}')">
                                <i class="fas fa-play"></i>
                                Iniciar
                            </button>
                        ` : ''}
                        ${ticket.status === 'en_curso' ? `
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
        DataManager.updateTicket(ticketId, { status: 'en_curso', startedAt: new Date().toISOString() });
        Utils.showToast('Trabajo iniciado', 'success');
        this.loadTecnicoTickets();
    }

    completeWork(ticketId) {
        // Abrir la rúbrica de finalización en lugar de completar directamente
        this.showRubricModal(ticketId);
    }

    requestViatico(ticketId) {
        // Implementar solicitud de viático
        Utils.showToast('Función de viático en desarrollo', 'info');
    }

    showRubricModal(ticketId) {
        const ticket = DataManager.getTicketById(ticketId);
        if (!ticket) {
            Utils.showToast('Ticket no encontrado', 'error');
            return;
        }

        const modal = document.createElement('div');
        modal.className = 'rubric-modal';
        modal.innerHTML = `
            <div class="rubric-container">
                <button class="rubric-close" onclick="this.parentElement.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
                
                <div class="rubric-header">
                    <h2>RÚBRICA DE FINALIZACIÓN</h2>
                    <div class="rubric-ticket-info">Ticket: ${ticket.id}</div>
                </div>
                
                <form id="rubric-form" onsubmit="app.submitRubric(event, '${ticketId}')">
                    <!-- CABECERA -->
                    <div class="rubric-section">
                        <h3>CABECERA</h3>
                        <div class="rubric-header-grid">
                            <div class="rubric-field">
                                <label>Nro Ticket:</label>
                                <input type="text" value="${ticket.id}" readonly>
                            </div>
                            <div class="rubric-field">
                                <label>Fecha Creación:</label>
                                <input type="text" value="${Utils.formatDate(ticket.createdAt)}" readonly>
                            </div>
                            <div class="rubric-field">
                                <label>Fecha Visita:</label>
                                <input type="date" name="fechaVisita" required>
                            </div>
                            <div class="rubric-field">
                                <label>Cliente:</label>
                                <input type="text" value="${ticket.clientName}" readonly>
                            </div>
                            <div class="rubric-field">
                                <label>Modelo Equipo:</label>
                                <input type="text" name="modeloEquipo" placeholder="Debe llenar el técnico" required>
                            </div>
                            <div class="rubric-field">
                                <label>Nro Serie:</label>
                                <input type="text" name="numeroSerie" placeholder="Debe llenar el técnico" required>
                            </div>
                            <div class="rubric-field">
                                <label>Prioridad:</label>
                                <input type="text" value="${Utils.getPriorityLabel(ticket.priority)}" readonly>
                            </div>
                            <div class="rubric-field">
                                <label>Técnicos:</label>
                                <input type="text" name="tecnicos" placeholder="Lista de técnicos (más de 2)" required>
                            </div>
                            <div class="rubric-field">
                                <label>Tipo:</label>
                                <select name="tipoTrabajo" required>
                                    <option value="">Seleccionar tipo</option>
                                    <option value="inspeccion" ${ticket.workType === 'inspeccion' ? 'selected' : ''}>Inspección</option>
                                    <option value="soporte" ${ticket.workType === 'soporte' ? 'selected' : ''}>Soporte Técnico</option>
                                    <option value="responsabilidad" ${ticket.workType === 'responsabilidad' ? 'selected' : ''}>Responsabilidad</option>
                                    <option value="mantenimiento">Mantenimiento</option>
                                    <option value="instalacion">Instalación</option>
                                </select>
                            </div>
                            <div class="rubric-field">
                                <label>InterProvincial:</label>
                                <select name="interprovincial" required>
                                    <option value="no" ${!ticket.isInterprovincial ? 'selected' : ''}>NO</option>
                                    <option value="si" ${ticket.isInterprovincial ? 'selected' : ''}>SÍ</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <!-- DETALLE / CUERPO DE LA RÚBRICA -->
                    <div class="rubric-section">
                        <h3>DETALLE / CUERPO DE LA RÚBRICA</h3>
                        <div class="phases-container">
                            <div class="add-phase-controls">
                                <label>Agregar Fase:</label>
                                <select id="phase-type-select">
                                    <option value="revision_inicial">Revisión Inicial</option>
                                    <option value="despiece">Despiece</option>
                                    <option value="accidente">Accidente</option>
                                </select>
                                <button type="button" class="btn-add-phase" onclick="app.addPhase()">
                                    <i class="fas fa-plus"></i> Agregar Fase
                                </button>
                            </div>
                            <div id="phases-list" class="phases-list">
                                <!-- Las fases se agregarán dinámicamente aquí -->
                            </div>
                        </div>
                    </div>

                    <!-- TABLA DE VALORES -->
                    <div class="rubric-section">
                        <h3>TABLA DE VALORES (La tabla debe ser llenada por el técnico)</h3>
                        <div class="measurements-table-container">
                            <table class="measurements-table">
                                <thead>
                                    <tr>
                                        <th rowspan="2">FASE</th>
                                        <th colspan="3">TENSIÓN</th>
                                        <th colspan="3">CORRIENTE</th>
                                        <th rowspan="2">VDC</th>
                                    </tr>
                                    <tr>
                                        <th>V.ENTR</th>
                                        <th>V.SALI</th>
                                        <th>TENSIÓN</th>
                                        <th>I ENTR</th>
                                        <th>I SALI</th>
                                        <th>CORRIENT</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td class="phase-label">FASE A-B</td>
                                        <td><input type="number" name="mediciones[ab][v_entr]" step="0.1" placeholder="0.0"></td>
                                        <td><input type="number" name="mediciones[ab][v_sali]" step="0.1" placeholder="0.0"></td>
                                        <td><input type="number" name="mediciones[ab][tension]" step="0.1" placeholder="0.0"></td>
                                        <td><input type="number" name="mediciones[ab][i_entr]" step="0.1" placeholder="0.0"></td>
                                        <td><input type="number" name="mediciones[ab][i_sali]" step="0.1" placeholder="0.0"></td>
                                        <td><input type="number" name="mediciones[ab][corriente]" step="0.1" placeholder="0.0"></td>
                                        <td><input type="number" name="mediciones[ab][vdc]" step="0.1" placeholder="0.0"></td>
                                    </tr>
                                    <tr>
                                        <td class="phase-label">FASE C-B</td>
                                        <td><input type="number" name="mediciones[cb][v_entr]" step="0.1" placeholder="0.0"></td>
                                        <td><input type="number" name="mediciones[cb][v_sali]" step="0.1" placeholder="0.0"></td>
                                        <td><input type="number" name="mediciones[cb][tension]" step="0.1" placeholder="0.0"></td>
                                        <td><input type="number" name="mediciones[cb][i_entr]" step="0.1" placeholder="0.0"></td>
                                        <td><input type="number" name="mediciones[cb][i_sali]" step="0.1" placeholder="0.0"></td>
                                        <td><input type="number" name="mediciones[cb][corriente]" step="0.1" placeholder="0.0"></td>
                                        <td><input type="number" name="mediciones[cb][vdc]" step="0.1" placeholder="0.0"></td>
                                    </tr>
                                    <tr>
                                        <td class="phase-label">FASE A-C</td>
                                        <td><input type="number" name="mediciones[ac][v_entr]" step="0.1" placeholder="0.0"></td>
                                        <td><input type="number" name="mediciones[ac][v_sali]" step="0.1" placeholder="0.0"></td>
                                        <td><input type="number" name="mediciones[ac][tension]" step="0.1" placeholder="0.0"></td>
                                        <td><input type="number" name="mediciones[ac][i_entr]" step="0.1" placeholder="0.0"></td>
                                        <td><input type="number" name="mediciones[ac][i_sali]" step="0.1" placeholder="0.0"></td>
                                        <td><input type="number" name="mediciones[ac][corriente]" step="0.1" placeholder="0.0"></td>
                                        <td><input type="number" name="mediciones[ac][vdc]" step="0.1" placeholder="0.0"></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <!-- PIE RÚBRICA -->
                    <div class="rubric-section">
                        <h3>PIE RÚBRICA</h3>
                        <div class="rubric-footer-grid">
                            <div class="rubric-field full-width">
                                <label>Conclusión:</label>
                                <textarea name="conclusion" placeholder="Escriba la conclusión del trabajo realizado..." required></textarea>
                            </div>
                            <div class="rubric-field full-width">
                                <label>Recomendaciones:</label>
                                <textarea name="recomendaciones" placeholder="Escriba las recomendaciones..." required></textarea>
                            </div>
                        </div>
                    </div>

                    <!-- BOTONES DE ACCIÓN -->
                    <div class="rubric-actions">
                        <button type="button" class="rubric-btn secondary" onclick="this.closest('.rubric-modal').remove()">
                            <i class="fas fa-times"></i>
                            Cancelar
                        </button>
                        <button type="submit" class="rubric-btn primary">
                            <i class="fas fa-check"></i>
                            Finalizar Trabajo
                        </button>
                    </div>
                </form>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Establecer fecha de hoy por defecto
        const today = new Date().toISOString().split('T')[0];
        modal.querySelector('input[name="fechaVisita"]').value = today;
    }

    addPhase() {
        const phaseTypeSelect = document.getElementById('phase-type-select');
        const phasesList = document.getElementById('phases-list');
        const phaseType = phaseTypeSelect.value;
        
        if (!phaseType) {
            Utils.showToast('Seleccione un tipo de fase', 'warning');
            return;
        }

        const phaseId = Date.now().toString();
        const phaseLabels = {
            'revision_inicial': 'Revisión Inicial',
            'despiece': 'Despiece',
            'accidente': 'Accidente'
        };

        const phaseElement = document.createElement('div');
        phaseElement.className = 'phase-item';
        phaseElement.innerHTML = `
            <div class="phase-header">
                <h4>${phaseLabels[phaseType]}</h4>
                <button type="button" class="btn-remove-phase" onclick="app.removePhase('${phaseId}')">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
            <div class="phase-content">
                <div class="phase-field">
                    <label>Descripción:</label>
                    <textarea name="fases[${phaseId}][descripcion]" placeholder="Describe detalladamente esta fase del trabajo..." required></textarea>
                </div>
                <div class="phase-field">
                    <label>Fotos:</label>
                    <div class="photo-upload-container">
                        <input type="file" name="fases[${phaseId}][fotos]" multiple accept="image/*" class="photo-input" id="photos-${phaseId}">
                        <label for="photos-${phaseId}" class="photo-upload-btn">
                            <i class="fas fa-camera"></i>
                            Seleccionar Fotos
                        </label>
                        <div class="photo-preview" id="preview-${phaseId}"></div>
                    </div>
                </div>
            </div>
        `;

        phasesList.appendChild(phaseElement);
        
        // Configurar preview de fotos
        const photoInput = phaseElement.querySelector('.photo-input');
        const photoPreview = phaseElement.querySelector('.photo-preview');
        
        photoInput.addEventListener('change', function(e) {
            const files = Array.from(e.target.files);
            photoPreview.innerHTML = '';
            
            files.forEach((file, index) => {
                if (file.type.startsWith('image/')) {
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        const img = document.createElement('img');
                        img.src = e.target.result;
                        img.className = 'photo-thumbnail';
                        img.title = file.name;
                        photoPreview.appendChild(img);
                    };
                    reader.readAsDataURL(file);
                }
            });
        });
    }

    removePhase(phaseId) {
        const phaseElement = document.querySelector(`[onclick="app.removePhase('${phaseId}')"]`).closest('.phase-item');
        if (phaseElement) {
            phaseElement.remove();
        }
    }

    submitRubric(event, ticketId) {
        event.preventDefault();
        
        const formData = new FormData(event.target);
        const rubricData = {
            ticketId: ticketId,
            fechaVisita: formData.get('fechaVisita'),
            modeloEquipo: formData.get('modeloEquipo'),
            numeroSerie: formData.get('numeroSerie'),
            tecnicos: formData.get('tecnicos'),
            tipoTrabajo: formData.get('tipoTrabajo'),
            interprovincial: formData.get('interprovincial'),
            conclusion: formData.get('conclusion'),
            recomendaciones: formData.get('recomendaciones'),
            fecha: new Date().toISOString(),
            tecnico: this.currentUser.name
        };

        // Recopilar mediciones
        const mediciones = {};
        ['ab', 'cb', 'ac'].forEach(phase => {
            mediciones[phase] = {
                v_entr: formData.get(`mediciones[${phase}][v_entr]`) || 0,
                v_sali: formData.get(`mediciones[${phase}][v_sali]`) || 0,
                tension: formData.get(`mediciones[${phase}][tension]`) || 0,
                i_entr: formData.get(`mediciones[${phase}][i_entr]`) || 0,
                i_sali: formData.get(`mediciones[${phase}][i_sali]`) || 0,
                corriente: formData.get(`mediciones[${phase}][corriente]`) || 0,
                vdc: formData.get(`mediciones[${phase}][vdc]`) || 0
            };
        });
        rubricData.mediciones = mediciones;

        // Recopilar fases
        const fases = [];
        const phaseElements = document.querySelectorAll('.phase-item');
        phaseElements.forEach((phaseElement, index) => {
            const descripcion = phaseElement.querySelector('textarea[name*="descripcion"]').value;
            const fotos = phaseElement.querySelector('input[type="file"]').files;
            
            const fase = {
                id: `fase_${index}`,
                descripcion: descripcion,
                fotos: Array.from(fotos).map(file => ({
                    name: file.name,
                    size: file.size,
                    type: file.type
                }))
            };
            fases.push(fase);
        });
        rubricData.fases = fases;

        // Guardar rúbrica
        const rubricas = JSON.parse(localStorage.getItem('rubricas') || '[]');
        rubricas.push(rubricData);
        localStorage.setItem('rubricas', JSON.stringify(rubricas));

        // Actualizar ticket
        const ticket = DataManager.getTicketById(ticketId);
        DataManager.updateTicket(ticketId, { 
            status: 'pre_cerrado', 
            completedAt: new Date().toISOString(),
            rubric: rubricData
        });

        // Liberar técnico
        if (ticket && ticket.assignedTechnicianId) {
            DataManager.updateTechnicianStatus(ticket.assignedTechnicianId, 'disponible');
        }

        // Cerrar modal
        event.target.closest('.rubric-modal').remove();

        // Mostrar mensaje de éxito
        Utils.showToast('Rúbrica completada y trabajo finalizado exitosamente', 'success');

        // Actualizar vista
        setTimeout(() => {
            this.loadTecnicoTickets();
        }, 1000);
    }

    viewTicket(ticketId) {
        const ticket = DataManager.getTicketById(ticketId);
        if (!ticket) {
            Utils.showToast('Ticket no encontrado', 'error');
            return;
        }

        // Obtener visitas relacionadas si existen
        const visitas = JSON.parse(localStorage.getItem('visitas') || '[]');
        const visitasTicket = visitas.filter(v => v.ticketId === ticketId);

        const modal = document.createElement('div');
        modal.className = 'tecnico-details-modal';
        modal.innerHTML = `
            <div class="tecnico-details-container">
                <button class="tecnico-details-close" onclick="this.parentElement.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
                
                <div class="tecnico-details-header">
                    <h2>Detalles de la Asignación</h2>
                    <div class="tecnico-details-ticket-id">Ticket: ${ticket.id}</div>
                </div>
                
                <div class="tecnico-details-content">
                    <!-- Información General -->
                    <div class="tecnico-details-section">
                        <h3><i class="fas fa-info-circle"></i> Información General</h3>
                        <div class="tecnico-details-grid">
                            <div class="tecnico-details-item">
                                <label>Título:</label>
                                <span>${ticket.title}</span>
                            </div>
                            <div class="tecnico-details-item">
                                <label>Estado:</label>
                                <span class="status-badge status-${ticket.status}">${Utils.getStatusLabel(ticket.status)}</span>
                            </div>
                            <div class="tecnico-details-item">
                                <label>Prioridad:</label>
                                <span class="priority-badge priority-${ticket.priority}">${Utils.getPriorityLabel(ticket.priority)}</span>
                            </div>
                            <div class="tecnico-details-item">
                                <label>Tipo de Trabajo:</label>
                                <span>${Utils.getWorkTypeLabel(ticket.workType)}</span>
                            </div>
                            <div class="tecnico-details-item">
                                <label>Fecha de Creación:</label>
                                <span>${Utils.formatDate(ticket.createdAt)}</span>
                            </div>
                            <div class="tecnico-details-item">
                                <label>Última Actualización:</label>
                                <span>${Utils.formatDate(ticket.updatedAt || ticket.createdAt)}</span>
                            </div>
                        </div>
                    </div>

                    <!-- Descripción -->
                    <div class="tecnico-details-section">
                        <h3><i class="fas fa-align-left"></i> Descripción del Trabajo</h3>
                        <div class="tecnico-details-description">
                            ${ticket.description}
                        </div>
                    </div>

                    <!-- Información del Cliente -->
                    <div class="tecnico-details-section">
                        <h3><i class="fas fa-user"></i> Información del Cliente</h3>
                        <div class="tecnico-details-grid">
                            <div class="tecnico-details-item">
                                <label>Nombre:</label>
                                <span>${ticket.clientName}</span>
                            </div>
                            <div class="tecnico-details-item">
                                <label>Email:</label>
                                <span>${ticket.clientEmail || 'No especificado'}</span>
                            </div>
                            <div class="tecnico-details-item">
                                <label>Teléfono:</label>
                                <span>${ticket.clientPhone || 'No especificado'}</span>
                            </div>
                            <div class="tecnico-details-item full-width">
                                <label>Dirección:</label>
                                <span>${ticket.clientAddress || 'No especificada'}</span>
                            </div>
                        </div>
                    </div>

                    <!-- Información Técnica -->
                    <div class="tecnico-details-section">
                        <h3><i class="fas fa-tools"></i> Información Técnica</h3>
                        <div class="tecnico-details-grid">
                            <div class="tecnico-details-item">
                                <label>Interprovincial:</label>
                                <span>${ticket.isInterprovincial ? 'Sí' : 'No'}</span>
                            </div>
                            <div class="tecnico-details-item">
                                <label>Técnico Asignado:</label>
                                <span>${ticket.assignedTechnicianName || 'Pendiente de asignación'}</span>
                            </div>
                            ${ticket.startedAt ? `
                                <div class="tecnico-details-item">
                                    <label>Iniciado:</label>
                                    <span>${Utils.formatDate(ticket.startedAt)}</span>
                                </div>
                            ` : ''}
                            ${ticket.completedAt ? `
                                <div class="tecnico-details-item">
                                    <label>Completado:</label>
                                    <span>${Utils.formatDate(ticket.completedAt)}</span>
                                </div>
                            ` : ''}
                        </div>
                    </div>

                    <!-- Historial de Visitas -->
                    ${visitasTicket.length > 0 ? `
                        <div class="tecnico-details-section">
                            <h3><i class="fas fa-history"></i> Historial de Visitas</h3>
                            <div class="tecnico-visitas-list">
                                ${visitasTicket.map(visita => `
                                    <div class="tecnico-visita-item">
                                        <div class="tecnico-visita-header">
                                            <span class="tecnico-visita-fecha">${Utils.formatDate(visita.fechaVisita)}</span>
                                            <span class="tecnico-visita-estado status-badge status-${visita.estado}">${Utils.getStatusLabel(visita.estado)}</span>
                                        </div>
                                        <div class="tecnico-visita-content">
                                            <div class="tecnico-visita-trabajo">
                                                <strong>Trabajo Realizado:</strong>
                                                <p>${visita.trabajoRealizado}</p>
                                            </div>
                                            ${visita.observaciones ? `
                                                <div class="tecnico-visita-observaciones">
                                                    <strong>Observaciones:</strong>
                                                    <p>${visita.observaciones}</p>
                                                </div>
                                            ` : ''}
                                            <div class="tecnico-visita-meta">
                                                <span><i class="fas fa-clock"></i> ${visita.tiempoTrabajado} horas</span>
                                                <span><i class="fas fa-user"></i> ${visita.tecnico}</span>
                                            </div>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    ` : ''}

                    <!-- Acciones -->
                    <div class="tecnico-details-actions">
                        ${ticket.status === 'asignado' ? `
                            <button class="tecnico-action-btn primary" onclick="app.startWork('${ticket.id}'); this.closest('.tecnico-details-modal').remove();">
                                <i class="fas fa-play"></i>
                                Iniciar Trabajo
                            </button>
                        ` : ''}
                        ${ticket.status === 'en_curso' ? `
                            <button class="tecnico-action-btn success" onclick="app.completeWork('${ticket.id}'); this.closest('.tecnico-details-modal').remove();">
                                <i class="fas fa-check"></i>
                                Completar Trabajo
                            </button>
                        ` : ''}
                        <button class="tecnico-action-btn warning" onclick="app.requestViatico('${ticket.id}'); this.closest('.tecnico-details-modal').remove();">
                            <i class="fas fa-car"></i>
                            Solicitar Viático
                        </button>
                        <button class="tecnico-action-btn" onclick="this.closest('.tecnico-details-modal').remove();">
                            <i class="fas fa-times"></i>
                            Cerrar
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
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
            filteredTickets = tickets.filter(t => t.status === 'asignado');
        } else if (status === 'en_curso') {
            filteredTickets = tickets.filter(t => t.status === 'en_curso');
        } else if (status === 'completado') {
            filteredTickets = tickets.filter(t => t.status === 'finalizado' || t.status === 'pre_cerrado');
        }
        
        const ticketsList = document.getElementById('tecnico-tickets-list');
        if (ticketsList) {
            ticketsList.innerHTML = this.renderTecnicoTickets(filteredTickets);
        }
        
        return this.renderTecnicoTickets(filteredTickets);
    }

    updateTecnicoTabCounts(tickets) {
        const asignadoCount = tickets.filter(t => t.status === 'asignado').length;
        const enCursoCount = tickets.filter(t => t.status === 'en_curso').length;
        const completadoCount = tickets.filter(t => t.status === 'finalizado' || t.status === 'pre_cerrado').length;
        
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
                (ticket.title||'').toLowerCase().includes(searchTerm.toLowerCase()) ||
                (ticket.description||'').toLowerCase().includes(searchTerm.toLowerCase()) ||
                (ticket.clientName||'').toLowerCase().includes(searchTerm.toLowerCase()) ||
                ticket.id.toString().includes(searchTerm)
            );
        }
        
        this.renderTecnicoTicketsByStatus(filteredTickets, this.currentTecnicoTab);
    }

    // Función para mostrar modal de solicitud de herramientas
    showToolRequestModal() {
        console.log('Abriendo modal de solicitud de herramientas...');
        
        // Obtener herramientas disponibles
        const availableTools = DataManager.getAllTools ? DataManager.getAllTools().filter(tool => tool.status === 'disponible') : [];
        console.log('Herramientas disponibles:', availableTools.length);
        
        const modal = document.createElement('div');
        modal.className = 'modal tool-request-modal';
        modal.style.display = 'flex';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3><i class="fas fa-tools"></i> Solicitar Herramientas</h3>
                    <button class="modal-close" onclick="this.closest('.modal').remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <form id="tool-request-form" onsubmit="app.submitToolRequest(event)">
                        <div class="form-group">
                            <label for="request-ticket">Ticket asociado:</label>
                            <select id="request-ticket" required>
                                <option value="">Seleccionar ticket...</option>
                                ${this.getUserTickets().filter(t => ['asignado', 'en_curso'].includes(t.status)).map(ticket => `
                                    <option value="${ticket.id}">#${ticket.id} - ${ticket.title}</option>
                                `).join('')}
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label for="tools-selection">Herramientas solicitadas:</label>
                            <div id="tools-selection" class="tools-selection">
                                ${availableTools.length > 0 ? availableTools.map(tool => `
                                    <div class="tool-option">
                                        <input type="checkbox" id="tool-${tool.id}" name="tools" value="${tool.id}">
                                        <label for="tool-${tool.id}">
                                            <span class="tool-name">${tool.name}</span>
                                            <span class="tool-code">${tool.code}</span>
                                            <span class="tool-category">${tool.category}</span>
                                        </label>
                                    </div>
                                `).join('') : '<p class="no-tools">No hay herramientas disponibles en este momento</p>'}
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label for="request-reason">Justificación de la solicitud:</label>
                            <textarea id="request-reason" rows="4" placeholder="Describe por qué necesitas estas herramientas para completar el trabajo..." required></textarea>
                        </div>
                        
                        <div class="form-group">
                            <label for="request-duration">Duración estimada (días):</label>
                            <input type="number" id="request-duration" min="1" max="30" value="1" required>
                        </div>
                        
                        <div class="form-actions">
                            <button type="button" class="btn btn-secondary" onclick="this.closest('.modal').remove()">
                                Cancelar
                            </button>
                            <button type="submit" class="btn btn-primary">
                                <i class="fas fa-paper-plane"></i>
                                Enviar Solicitud
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        console.log('Modal agregado al DOM');
        
        // Cerrar modal al hacer click fuera de él
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
        
        // Cerrar modal con ESC
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && modal.parentElement) {
                modal.remove();
            }
        });
        
        console.log('Modal de solicitud de herramientas configurado completamente');
    }
    
    // Función para enviar solicitud de herramientas
    submitToolRequest(event) {
        event.preventDefault();
        
        const form = event.target;
        const ticketId = form.querySelector('#request-ticket').value;
        const selectedTools = Array.from(form.querySelectorAll('input[name="tools"]:checked')).map(cb => cb.value);
        const reason = form.querySelector('#request-reason').value;
        const duration = parseInt(form.querySelector('#request-duration').value);
        
        if (selectedTools.length === 0) {
            alert('Debes seleccionar al menos una herramienta');
            return;
        }
        
        // Crear solicitud
        const request = {
            id: Date.now().toString(),
            technicianId: this.currentUser.id,
            technicianName: this.currentUser.name,
            ticketId: ticketId,
            tools: selectedTools,
            reason: reason,
            duration: duration,
            status: 'pendiente',
            requestedAt: new Date().toISOString(),
            approvedAt: null,
            approvedBy: null,
            rejectedAt: null,
            rejectedBy: null,
            comments: []
        };
        
        // Guardar solicitud
        this.saveToolRequest(request);
        
        // Cerrar modal
        form.closest('.modal').remove();
        
        // Mostrar confirmación
        this.showNotification('Solicitud enviada exitosamente', 'success');
    }
    
    // Función para guardar solicitud en localStorage
    saveToolRequest(request) {
        const requests = JSON.parse(localStorage.getItem('toolRequests') || '[]');
        requests.push(request);
        localStorage.setItem('toolRequests', JSON.stringify(requests));
        
        // Emitir evento para notificar cambios
        window.dispatchEvent(new CustomEvent('toolRequests:updated'));
    }
    
    // Función para mostrar notificaciones
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check' : 'info'}-circle"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
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
    // Hacer app disponible globalmente después de inicializar
    window.app = app;
});

// Funciones globales de respaldo
window.showToolRequestModal = () => {
    if (window.app && window.app.showToolRequestModal) {
        window.app.showToolRequestModal();
    } else {
        console.error('App no está inicializada o función no disponible');
    }
};

window.submitToolRequest = (event) => {
    if (window.app && window.app.submitToolRequest) {
        window.app.submitToolRequest(event);
    } else {
        console.error('App no está inicializada o función no disponible');
    }
};

// Función para toggle del menú móvil
window.toggleMobileMenu = () => {
    const sidebar = document.querySelector('.sidebar');
    sidebar.classList.toggle('mobile-open');
};
