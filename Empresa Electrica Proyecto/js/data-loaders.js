// Cargadores de vistas específicas

const loadTicketForm = (container) => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    if (currentUser.role !== 'cliente') {
        container.innerHTML = '<div class="error-message"><h3>No tienes permisos para crear tickets</h3></div>';
        return;
    }
    
    container.innerHTML = `
        <div class="page-header">
            <h1><i class="fas fa-plus"></i> Nuevo Ticket</h1>
            <p>Crea una nueva solicitud de servicio</p>
        </div>
        
        <div class="page-content">
            <div class="ticket-form">
                <div class="ticket-form-header">
                    <h2>Solicitud de Servicio</h2>
                    <p>Completa la información para crear tu ticket</p>
                </div>
                
                <form id="ticket-form" onsubmit="submitTicket(event)">
                    <div class="form-section">
                        <h4>Información del Cliente</h4>
                        <div class="form-row">
                            <div class="form-group">
                                <label for="client-name">Nombre Completo *</label>
                                <input type="text" id="client-name" name="clientName" value="${currentUser.name}" required>
                            </div>
                            <div class="form-group">
                                <label for="client-email">Email *</label>
                                <input type="email" id="client-email" name="clientEmail" value="${currentUser.email}" required>
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label for="client-phone">Teléfono *</label>
                                <input type="tel" id="client-phone" name="clientPhone" value="${currentUser.phone}" required>
                            </div>
                            <div class="form-group">
                                <label for="client-company">Empresa</label>
                                <input type="text" id="client-company" name="clientCompany" value="${currentUser.company || ''}">
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="client-address">Dirección del Trabajo *</label>
                            <textarea id="client-address" name="clientAddress" required placeholder="Dirección completa donde se realizará el trabajo"></textarea>
                        </div>
                    </div>
                    
                    <div class="form-section">
                        <h4>Detalles del Trabajo</h4>
                        <div class="form-row">
                            <div class="form-group">
                                <label for="work-title">Título del Trabajo *</label>
                                <input type="text" id="work-title" name="title" required placeholder="Ej: Instalación eléctrica en oficina">
                            </div>
                            <div class="form-group">
                                <label for="work-type">Tipo de Caso/Ticket *</label>
                                <select id="work-type" name="workType" required>
                                    <option value="">Seleccionar tipo</option>
                                    <option value="soporte">Soporte</option>
                                    <option value="inspeccion">Inspección</option>
                                    <option value="responsabilidad">Responsabilidad</option>
                                </select>
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label for="priority">Prioridad *</label>
                                <select id="priority" name="priority" required>
                                    <option value="">Seleccionar prioridad</option>
                                    <option value="baja">Baja</option>
                                    <option value="media">Media</option>
                                    <option value="alta">Alta</option>
                                    <option value="critica">Crítica</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="estimated-duration">Duración Estimada (horas)</label>
                                <input type="number" id="estimated-duration" name="estimatedDuration" min="1" max="48" value="4">
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="work-description">Descripción Detallada *</label>
                            <textarea id="work-description" name="description" required placeholder="Describe detalladamente el trabajo que necesitas realizar"></textarea>
                        </div>
                        <div class="form-group">
                            <label>
                                <input type="checkbox" id="is-interprovincial" name="isInterprovincial">
                                El trabajo es interprovincial (requiere viáticos)
                            </label>
                        </div>
                    </div>
                    
                    <div class="form-section">
                        <h4>Archivos Adjuntos</h4>
                        <div class="file-upload" onclick="document.getElementById('file-input').click()">
                            <i class="fas fa-cloud-upload-alt"></i>
                            <p>Arrastra archivos aquí o haz clic para seleccionar</p>
                            <p class="text-muted">Formatos permitidos: PDF, JPG, PNG, DOC (máx. 10MB)</p>
                            <input type="file" id="file-input" multiple accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" style="display: none;">
                        </div>
                        <div id="uploaded-files" class="uploaded-files"></div>
                    </div>
                    
                    <div class="form-actions">
                        <button type="button" class="btn btn-secondary" onclick="app.navigateTo('tickets')">
                            Cancelar
                        </button>
                        <button type="submit" class="btn btn-primary">
                            <i class="fas fa-paper-plane"></i> Crear Ticket
                        </button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    setupFileUpload();
};

const loadClientsView = (container) => {
    const clients = DataManager.getUsersByRole('cliente');
    
    container.innerHTML = `
        <div class="page-header">
            <h1><i class="fas fa-users"></i> Clientes</h1>
            <p>Gestión de clientes del sistema</p>
        </div>
        
        <div class="page-content">
            <div class="search-filter-bar">
                <div class="search-box">
                    <input type="text" id="client-search" placeholder="Buscar clientes...">
                    <i class="fas fa-search"></i>
                </div>
            </div>
            
            <div class="table-container">
                <table class="modern-table admin-clients-table">
                    <thead>
                        <tr>
                            <th class="table-cell-name">Cliente</th>
                            <th class="table-cell-email">Email</th>
                            <th class="table-cell-phone">Teléfono</th>
                            <th class="table-cell-company">Empresa</th>
                            <th class="table-cell-tickets">Tickets</th>
                            <th class="table-cell-actions">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${clients.map(client => {
                            const clientTickets = DataManager.getTicketsByClient(client.id);
                            return `
                                <tr>
                                    <td class="table-cell-name">
                                        <div class="client-info">
                                            <div class="client-details">
                                                <div class="client-name">${client.name}</div>
                                                <div class="client-id">ID: ${client.id}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td class="table-cell-email">
                                        <div class="email-info">
                                            <i class="fas fa-envelope"></i>
                                            <span>${client.email}</span>
                                        </div>
                                    </td>
                                    <td class="table-cell-phone">
                                        <div class="phone-info">
                                            <i class="fas fa-phone"></i>
                                            <span>${client.phone}</span>
                                        </div>
                                    </td>
                                    <td class="table-cell-company">
                                        <div class="company-info">
                                            <i class="fas fa-building"></i>
                                            <span>${client.company || 'Sin empresa'}</span>
                                        </div>
                                    </td>
                                    <td class="table-cell-tickets">
                                        <div class="tickets-count">
                                            <span class="tickets-badge">${clientTickets.length}</span>
                                            <span class="tickets-label">tickets</span>
                                        </div>
                                    </td>
                                    <td class="table-cell-actions">
                                        <div class="table-actions">
                                            <button class="table-action-btn view-btn" onclick="viewClientTickets(${client.id})" title="Ver tickets">
                                                <i class="fas fa-eye"></i>
                                            </button>
                                            <button class="table-action-btn edit-btn" onclick="editClient(${client.id})" title="Editar cliente">
                                                <i class="fas fa-edit"></i>
                                            </button>
                                            <button class="table-action-btn contact-btn" onclick="contactClient(${client.id})" title="Contactar">
                                                <i class="fas fa-comment"></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            `;
                        }).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;
    
    setupClientSearch();
};

const loadTechniciansView = (container) => {
    const technicians = DataManager.getUsersByRole('tecnico');
    
    container.innerHTML = `
        <div class="page-header">
            <h1><i class="fas fa-tools"></i> Técnicos</h1>
            <p>Gestión de técnicos del sistema</p>
        </div>
        
        <div class="page-content">
            <div class="search-filter-bar">
                <div class="search-box">
                    <input type="text" id="technician-search" placeholder="Buscar técnicos...">
                    <i class="fas fa-search"></i>
                </div>
                <div class="filter-group">
                    <select id="status-filter" class="filter-select">
                        <option value="">Todos los estados</option>
                        <option value="disponible">Disponible</option>
                        <option value="ocupado">Ocupado</option>
                        <option value="offline">Desconectado</option>
                    </select>
                </div>
            </div>
            
            <div class="table-container">
                <table class="modern-table admin-technicians-table">
                    <thead>
                        <tr>
                            <th class="table-cell-technician">Técnico</th>
                            <th class="table-cell-contact">Contacto</th>
                            <th class="table-cell-specializations">Especializaciones</th>
                            <th class="table-cell-status">Estado</th>
                            <th class="table-cell-tickets">Tickets</th>
                            <th class="table-cell-actions">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${technicians.map(tech => {
                            const techTickets = DataManager.getTicketsByTechnician(tech.id);
                            const activeTickets = techTickets.filter(t => ['asignado', 'en_curso'].includes(t.status));
                            const completedTickets = techTickets.filter(t => ['finalizado', 'pre_cerrado'].includes(t.status));
                            
                            return `
                                <tr>
                                    <td class="table-cell-technician">
                                        <div class="technician-info">
                                            <div class="technician-avatar">
                                                <i class="fas fa-user-tie"></i>
                                            </div>
                                            <div class="technician-details">
                                                <div class="technician-name">${tech.name}</div>
                                                <div class="technician-id">ID: ${tech.id}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td class="table-cell-contact">
                                        <div class="contact-info">
                                            <div class="email-info">
                                                <i class="fas fa-envelope"></i>
                                                <span class="contact-text">${tech.email}</span>
                                            </div>
                                            <div class="phone-info">
                                                <i class="fas fa-phone"></i>
                                                <span class="contact-text">${tech.phone}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td class="table-cell-specializations">
                                        <div class="specializations-info">
                                            ${tech.specializations && tech.specializations.length > 0 ? 
                                                tech.specializations.map(spec => `
                                                    <span class="specialization-badge">${spec}</span>
                                                `).join('') : 
                                                '<span class="no-specializations">Sin especializaciones</span>'
                                            }
                                        </div>
                                    </td>
                                    <td class="table-cell-status">
                                        <div class="status-info">
                                            <span class="status-badge status-${tech.status}">
                                                <i class="fas fa-circle"></i>
                                                <span class="status-text">${tech.status === 'disponible' ? 'Disponible' : 
                                                  tech.status === 'ocupado' ? 'Ocupado' : 'Desconectado'}</span>
                                            </span>
                                        </div>
                                    </td>
                                    <td class="table-cell-tickets">
                                        <div class="tickets-stats">
                                            <div class="ticket-stat-row">
                                                <div class="ticket-stat">
                                                    <span class="ticket-count active">${activeTickets.length}</span>
                                                    <span class="ticket-label">Activos</span>
                                                </div>
                                                <div class="ticket-stat">
                                                    <span class="ticket-count completed">${completedTickets.length}</span>
                                                    <span class="ticket-label">Completados</span>
                                                </div>
                                            </div>
                                            <div class="ticket-stat total-stat">
                                                <span class="ticket-count total">${techTickets.length}</span>
                                                <span class="ticket-label">Total</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td class="table-cell-actions">
                                        <div class="action-buttons">
                                            <button class="btn view-btn" onclick="viewTechnicianTickets(${tech.id})" title="Ver tickets">
                                                <i class="fas fa-eye"></i>
                                                <span>Ver</span>
                                            </button>
                                            <button class="btn edit-btn" onclick="editTechnician(${tech.id})" title="Editar técnico">
                                                <i class="fas fa-edit"></i>
                                                <span>Editar</span>
                                            </button>
                                            <button class="btn contact-btn" onclick="contactTechnician(${tech.id})" title="Contactar">
                                                <i class="fas fa-comment"></i>
                                                <span>Contactar</span>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            `;
                        }).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;
    
    setupTechnicianSearch();
};

const loadGeolocationView = (container) => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    if (!['admin', 'mesa_ayuda'].includes(currentUser.role)) {
        container.innerHTML = '<div class="error-message"><h3>No tienes permisos para ver la geolocalización</h3></div>';
        return;
    }
    
    const technicians = DataManager.getUsersByRole('tecnico');
    
    container.innerHTML = `
        <div class="page-header">
            <h1><i class="fas fa-map-marker-alt"></i> Geolocalización</h1>
            <p>Seguimiento en tiempo real de técnicos</p>
        </div>
        
        <div class="page-content">
            <div class="grid-2">
                <!-- Mapa -->
                <div class="map-container">
                    <div class="map-header">
                        <h3>Ubicación de Técnicos</h3>
                    </div>
                    <div id="map"></div>
                </div>
                
                <!-- Lista de técnicos -->
                <div class="technician-list">
                    <div class="card-header">
                        <h3>Técnicos en Campo</h3>
                        <p>Estado actual de los técnicos</p>
                    </div>
                    <div class="card-body">
                        ${technicians.map(tech => {
                            const techTickets = DataManager.getTicketsByTechnician(tech.id);
                            const activeTicket = techTickets.find(t => t.status === 'en_curso');
                            
                            return `
                                <div class="technician-item" onclick="centerMapOnTechnician(${tech.id})">
                                    <div class="technician-info">
                                        <div class="technician-avatar">${tech.avatar}</div>
                                        <div class="technician-details">
                                            <h4>${tech.name}</h4>
                                            <p>${activeTicket ? `Trabajando en: ${activeTicket.id}` : 'Sin trabajo activo'}</p>
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
                            `;
                        }).join('')}
                    </div>
                </div>
            </div>
        </div>
    `;
    
    initializeMap();
};

const loadSurveyView = (container) => {
    container.innerHTML = `
        <div class="page-header">
            <h1><i class="fas fa-star"></i> Encuesta de Satisfacción</h1>
            <p>Tu opinión es importante para nosotros</p>
        </div>
        
        <div class="page-content">
            <div class="survey-container">
                <div class="survey-header">
                    <h2>Encuesta de Satisfacción</h2>
                    <p>Por favor completa esta encuesta para finalizar el servicio</p>
                </div>
                
                <form id="survey-form" onsubmit="submitSurvey(event)">
                    ${mockData.config.surveyQuestions.map((question, index) => `
                        <div class="survey-question">
                            <h4>${index + 1}. ${question.question}</h4>
                            ${renderSurveyQuestion(question)}
                        </div>
                    `).join('')}
                    
                    <div class="form-actions">
                        <button type="submit" class="btn btn-primary">
                            <i class="fas fa-star"></i> Enviar Encuesta
                        </button>
                    </div>
                </form>
            </div>
        </div>
    `;
};


// Funciones auxiliares
const setupFileUpload = () => {
    const fileInput = document.getElementById('file-input');
    const uploadedFiles = document.getElementById('uploaded-files');
    
    fileInput.addEventListener('change', (e) => {
        const files = Array.from(e.target.files);
        files.forEach(file => {
            const fileItem = document.createElement('div');
            fileItem.className = 'uploaded-file';
            fileItem.innerHTML = `
                <div class="uploaded-file-info">
                    <i class="fas fa-file"></i>
                    <span class="uploaded-file-name">${file.name}</span>
                    <span class="uploaded-file-size">(${(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                </div>
                <button class="uploaded-file-remove" onclick="this.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            `;
            uploadedFiles.appendChild(fileItem);
        });
    });
};

const setupClientSearch = () => {
    const searchInput = document.getElementById('client-search');
    searchInput.addEventListener('input', Utils.debounce((e) => {
        const searchTerm = e.target.value.toLowerCase();
        const rows = document.querySelectorAll('tbody tr');
        
        rows.forEach(row => {
            const text = row.textContent.toLowerCase();
            row.style.display = text.includes(searchTerm) ? '' : 'none';
        });
    }, 300));
};

const setupTechnicianSearch = () => {
    const searchInput = document.getElementById('technician-search');
    const statusFilter = document.getElementById('status-filter');
    
    const filterTechnicians = () => {
        const searchTerm = searchInput.value.toLowerCase();
        const statusValue = statusFilter.value;
        const cards = document.querySelectorAll('.grid-3 .card');
        
        cards.forEach(card => {
            const text = card.textContent.toLowerCase();
            const statusMatch = !statusValue || card.querySelector(`.status-${statusValue}`);
            const searchMatch = text.includes(searchTerm);
            
            card.style.display = (searchMatch && statusMatch) ? '' : 'none';
        });
    };
    
    searchInput.addEventListener('input', Utils.debounce(filterTechnicians, 300));
    statusFilter.addEventListener('change', filterTechnicians);
};

const renderSurveyQuestion = (question) => {
    switch (question.type) {
        case 'rating':
            return `
                <div class="rating-scale">
                    ${Array.from({length: question.scale}, (_, i) => `
                        <div class="rating-option">
                            <input type="radio" name="${question.id}" value="${i + 1}" required>
                            <label>${i + 1}</label>
                        </div>
                    `).join('')}
                </div>
            `;
        case 'radio':
            return `
                <div class="form-group">
                    ${question.options.map(option => `
                        <div class="form-check">
                            <input type="radio" name="${question.id}" value="${option.value}" required>
                            <label>${option.label}</label>
                        </div>
                    `).join('')}
                </div>
            `;
        case 'textarea':
            return `
                <div class="form-group">
                    <textarea name="${question.id}" placeholder="Escribe tu respuesta aquí..."></textarea>
                </div>
            `;
        default:
            return '';
    }
};

const initializeMap = () => {
    // Inicializar mapa de Leaflet
    const map = L.map('map').setView([19.4326, -99.1332], 10);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);
    
    // Agregar marcadores de técnicos
    const technicians = DataManager.getUsersByRole('tecnico');
    technicians.forEach(tech => {
        if (tech.location) {
            const marker = L.marker([tech.location.lat, tech.location.lng])
                .addTo(map)
                .bindPopup(`
                    <div>
                        <h4>${tech.name}</h4>
                        <p>Estado: ${tech.status}</p>
                        <p>Especializaciones: ${tech.specializations ? tech.specializations.join(', ') : 'N/A'}</p>
                    </div>
                `);
        }
    });
    
    // Guardar referencia del mapa
    window.technicianMap = map;
};

// Funciones globales
const submitTicket = (event) => {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const ticketData = {
        title: formData.get('title'),
        description: formData.get('description'),
        clientId: JSON.parse(localStorage.getItem('currentUser')).id,
        clientName: formData.get('clientName'),
        clientEmail: formData.get('clientEmail'),
        clientPhone: formData.get('clientPhone'),
        clientAddress: formData.get('clientAddress'),
        priority: formData.get('priority'),
        workType: formData.get('workType'),
        estimatedDuration: parseInt(formData.get('estimatedDuration')),
        isInterprovincial: formData.has('isInterprovincial')
    };
    
    const newTicket = DataManager.createTicket(ticketData);
    
    // Agregar comentario inicial
    DataManager.addCommentToTicket(newTicket.id, {
        author: ticketData.clientName,
        authorRole: 'cliente',
        content: 'Ticket creado por el cliente'
    });
    
    Utils.showToast('Ticket creado exitosamente', 'success');
    app.navigateTo('tickets');
};

const submitSurvey = (event) => {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const surveyData = {};
    
    for (const [key, value] of formData.entries()) {
        surveyData[key] = value;
    }
    
    // Aquí se procesaría la encuesta
    Utils.showToast('Encuesta enviada exitosamente', 'success');
    app.navigateTo('dashboard');
};

// Funciones para gestión de clientes
const viewClientTickets = (clientId) => {
    const client = DataManager.getUserById(clientId);
    
    if (!client) {
        Utils.showToast('Cliente no encontrado', 'error');
        return;
    }
    
    // Navegar a la página específica de tickets del cliente
    window.location.href = `cliente-tickets-admin.html?clientId=${clientId}`;
};

const editClient = (clientId) => {
    const client = DataManager.getUserById(clientId);
    Utils.showToast(`Editando información de ${client.name}`, 'info');
    // Aquí se podría abrir un modal de edición
};

const contactClient = (clientId) => {
    const client = DataManager.getUserById(clientId);
    Utils.showToast(`Iniciando contacto con ${client.name}`, 'info');
    // Aquí se podría abrir un modal de contacto o redirigir a email/teléfono
};

// Exportar funciones
window.loadTicketForm = loadTicketForm;
window.loadClientsView = loadClientsView;
window.loadTechniciansView = loadTechniciansView;
window.loadGeolocationView = loadGeolocationView;
window.loadSurveyView = loadSurveyView;
window.submitTicket = submitTicket;
window.submitSurvey = submitSurvey;
window.viewClientTickets = viewClientTickets;
window.editClient = editClient;
window.contactClient = contactClient;
