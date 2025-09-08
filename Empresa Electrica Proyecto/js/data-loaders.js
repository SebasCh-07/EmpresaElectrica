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
                <table class="table">
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Email</th>
                            <th>Teléfono</th>
                            <th>Empresa</th>
                            <th>Tickets</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${clients.map(client => {
                            const clientTickets = DataManager.getTicketsByClient(client.id);
                            return `
                                <tr>
                                    <td>
                                        <div class="d-flex align-center">
                                            <div class="technician-avatar">${client.avatar}</div>
                                            <span>${client.name}</span>
                                        </div>
                                    </td>
                                    <td>${client.email}</td>
                                    <td>${client.phone}</td>
                                    <td>${client.company || 'N/A'}</td>
                                    <td>
                                        <span class="badge">${clientTickets.length} tickets</span>
                                    </td>
                                    <td>
                                        <div class="action-buttons">
                                            <button class="btn btn-sm btn-primary" onclick="viewClientTickets(${client.id})">
                                                <i class="fas fa-eye"></i>
                                            </button>
                                            <button class="btn btn-sm btn-secondary" onclick="editClient(${client.id})">
                                                <i class="fas fa-edit"></i>
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
            
            <div class="grid-3">
                ${technicians.map(tech => {
                    const techTickets = DataManager.getTicketsByTechnician(tech.id);
                    const activeTickets = techTickets.filter(t => ['asignado', 'en_curso'].includes(t.status));
                    
                    return `
                        <div class="card">
                            <div class="card-body">
                                <div class="d-flex align-center mb-3">
                                    <div class="technician-avatar">${tech.avatar}</div>
                                    <div>
                                        <h4>${tech.name}</h4>
                                        <p class="text-muted">${tech.email}</p>
                                    </div>
                                </div>
                                
                                <div class="technician-details">
                                    <p><strong>Teléfono:</strong> ${tech.phone}</p>
                                    <p><strong>Especializaciones:</strong></p>
                                    <ul>
                                        ${tech.specializations ? tech.specializations.map(spec => `<li>${spec}</li>`).join('') : '<li>Sin especializaciones</li>'}
                                    </ul>
                                    
                                    <div class="technician-stats">
                                        <div class="stat-item">
                                            <span class="stat-label">Tickets Activos:</span>
                                            <span class="stat-value">${activeTickets.length}</span>
                                        </div>
                                        <div class="stat-item">
                                            <span class="stat-label">Total Tickets:</span>
                                            <span class="stat-value">${techTickets.length}</span>
                                        </div>
                                    </div>
                                    
                                    <div class="technician-status mt-3">
                                        <div class="status-indicator ${tech.status}"></div>
                                        <span class="status-badge status-${tech.status}">
                                            ${tech.status === 'disponible' ? 'Disponible' : 
                                              tech.status === 'ocupado' ? 'Ocupado' : 'Desconectado'}
                                        </span>
                                    </div>
                                </div>
                                
                                <div class="action-buttons mt-3">
                                    <button class="btn btn-sm btn-primary" onclick="viewTechnicianTickets(${tech.id})">
                                        <i class="fas fa-eye"></i> Ver Tickets
                                    </button>
                                    <button class="btn btn-sm btn-secondary" onclick="editTechnician(${tech.id})">
                                        <i class="fas fa-edit"></i> Editar
                                    </button>
                                </div>
                            </div>
                        </div>
                    `;
                }).join('')}
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

const loadTeamsView = (container) => {
    container.innerHTML = `
        <div class="page-header">
            <h1><i class="fas fa-users-cog"></i> Equipos</h1>
            <p>Gestión de equipos de trabajo</p>
        </div>
        
        <div class="page-content">
            <div class="card">
                <div class="card-header">
                    <h3>Equipos de Trabajo</h3>
                    <p>Organización de técnicos en equipos especializados</p>
                </div>
                <div class="card-body">
                    <p class="text-center text-muted">Funcionalidad de equipos en desarrollo</p>
                </div>
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

// Exportar funciones
window.loadTicketForm = loadTicketForm;
window.loadClientsView = loadClientsView;
window.loadTechniciansView = loadTechniciansView;
window.loadGeolocationView = loadGeolocationView;
window.loadSurveyView = loadSurveyView;
window.loadTeamsView = loadTeamsView;
window.submitTicket = submitTicket;
window.submitSurvey = submitSurvey;
