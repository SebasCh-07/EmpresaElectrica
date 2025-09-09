// Archivo principal de la aplicación

// Inicialización de la aplicación
document.addEventListener('DOMContentLoaded', () => {
    console.log('Sistema de Gestión de Empresa Eléctrica iniciado');
    
    // Configurar eventos globales
    setupGlobalEvents();
    
    // Inicializar funcionalidades específicas
    initializeFeatures();
});

const setupGlobalEvents = () => {
    // Prevenir envío de formularios por defecto
    document.addEventListener('submit', (e) => {
        if (e.target.tagName === 'FORM' && !e.target.hasAttribute('data-no-prevent')) {
            e.preventDefault();
        }
    });
    
    // Manejar clics en enlaces de navegación
    document.addEventListener('click', (e) => {
        if (e.target.matches('.nav-link')) {
            e.preventDefault();
            const view = e.target.dataset.view;
            if (view && window.app) {
                window.app.navigateTo(view);
            }
        }
    });
    
    // Manejar teclas de acceso rápido
    document.addEventListener('keydown', (e) => {
        // Ctrl + K para búsqueda rápida
        if (e.ctrlKey && e.key === 'k') {
            e.preventDefault();
            const searchInput = document.querySelector('input[type="text"]');
            if (searchInput) {
                searchInput.focus();
            }
        }
        
        // Escape para cerrar modales
        if (e.key === 'Escape') {
            const modals = document.querySelectorAll('.modal.show');
            modals.forEach(modal => {
                modal.classList.remove('show');
                modal.style.display = 'none';
            });
        }
    });
};

const initializeFeatures = () => {
    // Inicializar tooltips si es necesario
    initializeTooltips();
    
    // Configurar notificaciones
    setupNotifications();
    
    // Inicializar funcionalidades de mapa
    setupMapFeatures();
};

const initializeTooltips = () => {
    // Agregar tooltips a elementos con data-tooltip
    document.querySelectorAll('[data-tooltip]').forEach(element => {
        element.addEventListener('mouseenter', showTooltip);
        element.addEventListener('mouseleave', hideTooltip);
    });
};

const showTooltip = (e) => {
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.textContent = e.target.dataset.tooltip;
    document.body.appendChild(tooltip);
    
    const rect = e.target.getBoundingClientRect();
    tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
    tooltip.style.top = rect.top - tooltip.offsetHeight - 5 + 'px';
    
    setTimeout(() => tooltip.classList.add('show'), 10);
};

const hideTooltip = () => {
    const tooltip = document.querySelector('.tooltip');
    if (tooltip) {
        tooltip.remove();
    }
};

const setupNotifications = () => {
    // Configurar notificaciones push si está disponible
    if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
    }
    
    // Simular notificaciones en tiempo real
    setInterval(() => {
        if (Math.random() < 0.1) { // 10% de probabilidad cada 30 segundos
            showRandomNotification();
        }
    }, 30000);
};

const showRandomNotification = () => {
    const notifications = [
        { message: 'Nuevo ticket creado', type: 'info' },
        { message: 'Ticket asignado a técnico', type: 'success' },
        { message: 'Trabajo completado', type: 'success' },
        { message: 'Técnico desconectado', type: 'warning' }
    ];
    
    const notification = notifications[Math.floor(Math.random() * notifications.length)];
    Utils.showToast(notification.message, notification.type);
};

const setupMapFeatures = () => {
    // Configurar actualización de ubicación de técnicos
    setInterval(updateTechnicianLocations, 60000); // Cada minuto
};

const updateTechnicianLocations = () => {
    const technicians = DataManager.getUsersByRole('tecnico');
    
    technicians.forEach(tech => {
        if (tech.status === 'ocupado' && Math.random() < 0.3) {
            // Simular movimiento del técnico
            const currentLocation = tech.location;
            const newLocation = {
                lat: currentLocation.lat + (Math.random() - 0.5) * 0.01,
                lng: currentLocation.lng + (Math.random() - 0.5) * 0.01
            };
            
            DataManager.updateTechnicianLocation(tech.id, newLocation);
            
            // Actualizar mapa si está visible
            if (window.technicianMap) {
                updateMapMarkers();
            }
        }
    });
};

const updateMapMarkers = () => {
    // Esta función actualizaría los marcadores del mapa
    // Se implementaría cuando el mapa esté visible
};

// Funciones de utilidad global
window.showAssignmentModal = (ticketId) => {
    const ticket = DataManager.getTicketById(ticketId);
    if (!ticket) return;
    
    const availableTechnicians = DataManager.getAvailableTechnicians();
    
    const modal = document.createElement('div');
    modal.className = 'modal show';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Asignar Técnico - ${ticket.id}</h3>
                <button class="modal-close" onclick="this.closest('.modal').remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <div class="assignment-modal">
                    <form onsubmit="submitAssignment(event, '${ticketId}')">
                        <div class="form-group">
                            <label for="visit-date">Fecha de Visita *</label>
                            <input type="datetime-local" id="visit-date" name="visitDate" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="priority-assignment">Prioridad *</label>
                            <select id="priority-assignment" name="priority" required>
                                <option value="baja">Baja</option>
                                <option value="media">Media</option>
                                <option value="alta" selected>Alta</option>
                                <option value="critica">Crítica</option>
                            </select>
                        </div>
                        
                        <h4>Selecciona un técnico disponible:</h4>
                        <div class="technician-select">
                            ${availableTechnicians.map(tech => `
                                <div class="technician-option" onclick="selectTechnicianOption(${tech.id})">
                                    <input type="radio" name="technicianId" value="${tech.id}" id="tech-${tech.id}" required>
                                    <div class="technician-option-info">
                                        <div class="technician-avatar">${tech.avatar}</div>
                                        <div>
                                            <h5>${tech.name}</h5>
                                            <p>${tech.specializations ? tech.specializations.join(', ') : 'Sin especializaciones'}</p>
                                        </div>
                                    </div>
                                    <div class="technician-option-status">
                                        <div class="status-indicator"></div>
                                        <span>Disponible</span>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                        
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" onclick="this.closest('.modal').remove()">
                                Cancelar
                            </button>
                            <button type="submit" class="btn btn-primary">
                                Asignar Técnico
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Establecer fecha mínima como mañana
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    document.getElementById('visit-date').min = tomorrow.toISOString().slice(0, 16);
};

window.selectTechnicianOption = (technicianId) => {
    // Deseleccionar todas las opciones
    document.querySelectorAll('.technician-option').forEach(option => {
        option.classList.remove('selected');
    });
    
    // Seleccionar la opción actual
    const selectedOption = document.querySelector(`input[value="${technicianId}"]`).closest('.technician-option');
    selectedOption.classList.add('selected');
    
    // Marcar el radio button
    document.getElementById(`tech-${technicianId}`).checked = true;
};

window.submitAssignment = (event, ticketId) => {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const technicianId = parseInt(formData.get('technicianId'));
    const visitDate = formData.get('visitDate');
    const priority = formData.get('priority');
    
    const technician = DataManager.getUserById(technicianId);
    const ticket = DataManager.getTicketById(ticketId);
    
    if (technician && ticket) {
        // Actualizar ticket
        DataManager.updateTicket(ticketId, {
            status: 'asignado',
            assignedTechnicianId: technicianId,
            assignedTechnicianName: technician.name,
            assignedAt: new Date().toISOString(),
            visitDate: visitDate,
            priority: priority
        });
        
        // Actualizar estado del técnico
        DataManager.updateTechnicianLocation(technicianId, {
            ...technician.location,
            status: 'ocupado'
        });
        
        // Agregar comentario
        DataManager.addCommentToTicket(ticketId, {
            author: 'Sistema',
            authorRole: 'sistema',
            content: `Ticket asignado a ${technician.name}. Visita programada para ${Utils.formatDate(visitDate)}`
        });
        
        Utils.showToast(`Ticket asignado a ${technician.name}`, 'success');
        
        // Cerrar modal
        document.querySelector('.modal').remove();
        
        // Recargar vista actual
        if (window.app) {
            window.app.navigateTo('tickets');
        }
    }
};

window.showViaticosModal = (ticketId) => {
    const modal = document.createElement('div');
    modal.className = 'modal show';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Solicitar Viáticos - ${ticketId}</h3>
                <button class="modal-close" onclick="this.closest('.modal').remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <form onsubmit="submitViaticosRequest(event, '${ticketId}')">
                    <div class="form-group">
                        <label for="viaticos-amount">Monto Solicitado (MXN)</label>
                        <input type="number" id="viaticos-amount" name="amount" required min="0" step="0.01">
                    </div>
                    <div class="form-group">
                        <label for="viaticos-description">Descripción de Gastos</label>
                        <textarea id="viaticos-description" name="description" required placeholder="Describe los gastos que necesitas cubrir (transporte, hospedaje, alimentación, etc.)"></textarea>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" onclick="this.closest('.modal').remove()">
                            Cancelar
                        </button>
                        <button type="submit" class="btn btn-primary">
                            Solicitar Viáticos
                        </button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
};

window.submitViaticosRequest = (event, ticketId) => {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const viaticosData = {
        requested: true,
        approved: false,
        amount: parseFloat(formData.get('amount')),
        description: formData.get('description'),
        requestedAt: new Date().toISOString()
    };
    
    DataManager.updateTicket(ticketId, { viaticos: viaticosData });
    
    Utils.showToast('Solicitud de viáticos enviada', 'success');
    document.querySelector('.modal').remove();
    
    // Recargar vista del ticket
    if (currentTicketId === ticketId) {
        loadTicketDetailById(ticketId);
    }
};

window.showVisitFormModal = (ticketId) => {
    const ticket = DataManager.getTicketById(ticketId);
    if (!ticket) return;
    
    const modal = document.createElement('div');
    modal.className = 'modal show';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 800px;">
            <div class="modal-header">
                <h3>Formulario de Visita - ${ticketId}</h3>
                <button class="modal-close" onclick="this.closest('.modal').remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <form onsubmit="submitVisitForm(event, '${ticketId}')">
                    <div class="form-section">
                        <h4>Información de la Visita</h4>
                        <div class="form-row">
                            <div class="form-group">
                                <label for="visit-start-time">Hora de Inicio</label>
                                <input type="datetime-local" id="visit-start-time" name="startTime" required>
                            </div>
                            <div class="form-group">
                                <label for="visit-end-time">Hora de Finalización</label>
                                <input type="datetime-local" id="visit-end-time" name="endTime" required>
                            </div>
                        </div>
                    </div>
                    
                    <div class="form-section">
                        <h4>Formulario de Trabajo</h4>
                        ${mockData.config.visitFormQuestions.map(question => `
                            <div class="rubric-item">
                                <div class="rubric-question">${question.question}</div>
                                ${renderVisitFormQuestion(question)}
                            </div>
                        `).join('')}
                    </div>
                    
                    <div class="form-section">
                        <h4>Archivos Adjuntos</h4>
                        <div class="file-upload" onclick="document.getElementById('visit-photos').click()">
                            <i class="fas fa-camera"></i>
                            <p>Subir fotos de la visita</p>
                            <input type="file" id="visit-photos" multiple accept="image/*" style="display: none;">
                        </div>
                        <div id="visit-photos-list" class="uploaded-files"></div>
                    </div>
                    
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" onclick="this.closest('.modal').remove()">
                            Cancelar
                        </button>
                        <button type="submit" class="btn btn-primary">
                            Completar Visita
                        </button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Establecer hora de inicio como ahora
    const now = new Date();
    document.getElementById('visit-start-time').value = now.toISOString().slice(0, 16);
    
    setupVisitPhotoUpload();
};

const renderVisitFormQuestion = (question) => {
    switch (question.type) {
        case 'radio':
            return `
                <div class="rubric-options">
                    ${question.options.map(option => `
                        <div class="rubric-option">
                            <input type="radio" name="${question.id}" value="${option.value}" required>
                            <label>${option.label}</label>
                        </div>
                    `).join('')}
                </div>
            `;
        case 'checkbox':
            return `
                <div class="rubric-options">
                    ${question.options.map(option => `
                        <div class="rubric-option">
                            <input type="checkbox" name="${question.id}" value="${option.value}">
                            <label>${option.label}</label>
                        </div>
                    `).join('')}
                </div>
            `;
        case 'textarea':
            return `
                <textarea name="${question.id}" required placeholder="Escribe tu respuesta aquí..."></textarea>
            `;
        default:
            return '';
    }
};

const setupVisitPhotoUpload = () => {
    const fileInput = document.getElementById('visit-photos');
    const photosList = document.getElementById('visit-photos-list');
    
    fileInput.addEventListener('change', (e) => {
        const files = Array.from(e.target.files);
        files.forEach(file => {
            const fileItem = document.createElement('div');
            fileItem.className = 'uploaded-file';
            fileItem.innerHTML = `
                <div class="uploaded-file-info">
                    <i class="fas fa-image"></i>
                    <span class="uploaded-file-name">${file.name}</span>
                    <span class="uploaded-file-size">(${(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                </div>
                <button class="uploaded-file-remove" onclick="this.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            `;
            photosList.appendChild(fileItem);
        });
    });
};

window.submitVisitForm = (event, ticketId) => {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const visitFormData = {};
    const photos = [];
    
    // Recopilar datos del formulario
    for (const [key, value] of formData.entries()) {
        if (visitFormData[key]) {
            if (Array.isArray(visitFormData[key])) {
                visitFormData[key].push(value);
            } else {
                visitFormData[key] = [visitFormData[key], value];
            }
        } else {
            visitFormData[key] = value;
        }
    }
    
    // Recopilar fotos
    const photoFiles = document.getElementById('visit-photos').files;
    for (let i = 0; i < photoFiles.length; i++) {
        photos.push(photoFiles[i].name);
    }
    
    visitFormData.photos = photos;
    
    // Actualizar ticket con formulario de visita completado
    DataManager.updateTicket(ticketId, {
        status: 'pre_cerrado',
        visitForm: visitFormData,
        preClosedAt: new Date().toISOString()
    });
    
    // Agregar comentario
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    DataManager.addCommentToTicket(ticketId, {
        author: currentUser.name,
        authorRole: currentUser.role,
        content: 'Formulario de visita completado. Caso marcado como pre-cerrado. Esperando encuesta del cliente.'
    });
    
    Utils.showToast('Formulario de visita completado exitosamente', 'success');
    document.querySelector('.modal').remove();
    
    // Recargar vista del ticket
    if (currentTicketId === ticketId) {
        loadTicketDetailById(ticketId);
    }
};

window.submitRubric = (event, ticketId) => {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const rubricData = {};
    
    for (const [key, value] of formData.entries()) {
        if (rubricData[key]) {
            if (Array.isArray(rubricData[key])) {
                rubricData[key].push(value);
            } else {
                rubricData[key] = [rubricData[key], value];
            }
        } else {
            rubricData[key] = value;
        }
    }
    
    // Actualizar ticket con rúbrica completada
    DataManager.updateTicket(ticketId, {
        status: 'semi_finalizado',
        rubric: rubricData,
        completedAt: new Date().toISOString()
    });
    
    // Agregar comentario
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    DataManager.addCommentToTicket(ticketId, {
        author: currentUser.name,
        authorRole: currentUser.role,
        content: 'Rúbrica completada. Trabajo listo para encuesta del cliente.'
    });
    
    Utils.showToast('Rúbrica completada exitosamente', 'success');
    document.querySelector('.modal').remove();
    
    // Recargar vista del ticket
    if (currentTicketId === ticketId) {
        loadTicketDetailById(ticketId);
    }
};

window.showSurveyModal = (ticketId) => {
    const modal = document.createElement('div');
    modal.className = 'modal show';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 800px;">
            <div class="modal-header">
                <h3>Encuesta de Satisfacción - ${ticketId}</h3>
                <button class="modal-close" onclick="this.closest('.modal').remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <form onsubmit="submitSurvey(event, '${ticketId}')">
                    ${mockData.config.surveyQuestions.map((question, index) => `
                        <div class="survey-question">
                            <h4>${index + 1}. ${question.question}</h4>
                            ${renderSurveyQuestion(question)}
                        </div>
                    `).join('')}
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" onclick="this.closest('.modal').remove()">
                            Cancelar
                        </button>
                        <button type="submit" class="btn btn-primary">
                            Enviar Encuesta
                        </button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
};

window.submitSurvey = (event, ticketId) => {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const surveyData = {};
    
    for (const [key, value] of formData.entries()) {
        surveyData[key] = value;
    }
    
    // Actualizar ticket con encuesta completada
    DataManager.updateTicket(ticketId, {
        status: 'finalizado',
        survey: surveyData,
        finalCompletedAt: new Date().toISOString(),
        reportGenerated: true
    });
    
    // Agregar comentario
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    DataManager.addCommentToTicket(ticketId, {
        author: currentUser.name,
        authorRole: currentUser.role,
        content: 'Encuesta de satisfacción completada. Servicio finalizado. Informe disponible para descarga.'
    });
    
    Utils.showToast('Encuesta enviada exitosamente. Informe generado y disponible para descarga.', 'success');
    document.querySelector('.modal').remove();
    
    // Recargar vista del ticket
    if (currentTicketId === ticketId) {
        loadTicketDetailById(ticketId);
    }
};

window.downloadReport = (ticketId) => {
    const ticket = DataManager.getTicketById(ticketId);
    if (!ticket) return;
    
    if (!ticket.survey) {
        Utils.showToast('Debe completar la encuesta de satisfacción antes de descargar el informe', 'warning');
        return;
    }
    
    // Generar contenido del informe
    const reportContent = generateReportContent(ticket);
    
    // Crear y descargar el archivo
    const blob = new Blob([reportContent], { type: 'text/html' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Informe_${ticket.id}_${new Date().toISOString().split('T')[0]}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    Utils.showToast('Informe descargado exitosamente', 'success');
};

const generateReportContent = (ticket) => {
    const client = DataManager.getUserById(ticket.clientId);
    const technician = DataManager.getUserById(ticket.assignedTechnicianId);
    
    return `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Informe de Servicio - ${ticket.id}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.6; }
        .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px; }
        .section { margin-bottom: 25px; }
        .section h3 { color: #333; border-bottom: 1px solid #ccc; padding-bottom: 5px; }
        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .info-item { margin-bottom: 10px; }
        .label { font-weight: bold; color: #555; }
        .value { margin-left: 10px; }
        .survey-results { background: #f9f9f9; padding: 15px; border-radius: 5px; }
        .footer { margin-top: 40px; text-align: center; font-size: 12px; color: #666; }
    </style>
</head>
<body>
    <div class="header">
        <h1>INFORME DE SERVICIO TÉCNICO</h1>
        <h2>Ticket: ${ticket.id}</h2>
        <p>Fecha de Generación: ${new Date().toLocaleDateString('es-ES')}</p>
    </div>
    
    <div class="section">
        <h3>Información del Cliente</h3>
        <div class="info-grid">
            <div class="info-item">
                <span class="label">Nombre:</span>
                <span class="value">${client.name}</span>
            </div>
            <div class="info-item">
                <span class="label">Email:</span>
                <span class="value">${client.email}</span>
            </div>
            <div class="info-item">
                <span class="label">Teléfono:</span>
                <span class="value">${client.phone}</span>
            </div>
            <div class="info-item">
                <span class="label">Empresa:</span>
                <span class="value">${client.company || 'N/A'}</span>
            </div>
        </div>
    </div>
    
    <div class="section">
        <h3>Detalles del Servicio</h3>
        <div class="info-grid">
            <div class="info-item">
                <span class="label">Título:</span>
                <span class="value">${ticket.title}</span>
            </div>
            <div class="info-item">
                <span class="label">Tipo:</span>
                <span class="value">${ticket.workType}</span>
            </div>
            <div class="info-item">
                <span class="label">Prioridad:</span>
                <span class="value">${ticket.priority}</span>
            </div>
            <div class="info-item">
                <span class="label">Estado:</span>
                <span class="value">${ticket.status}</span>
            </div>
            <div class="info-item">
                <span class="label">Fecha de Creación:</span>
                <span class="value">${Utils.formatDate(ticket.createdAt)}</span>
            </div>
            <div class="info-item">
                <span class="label">Fecha de Visita:</span>
                <span class="value">${ticket.visitDate ? Utils.formatDate(ticket.visitDate) : 'N/A'}</span>
            </div>
        </div>
        <div class="info-item">
            <span class="label">Descripción:</span>
            <span class="value">${ticket.description}</span>
        </div>
        <div class="info-item">
            <span class="label">Dirección:</span>
            <span class="value">${ticket.clientAddress}</span>
        </div>
    </div>
    
    <div class="section">
        <h3>Información del Técnico</h3>
        <div class="info-grid">
            <div class="info-item">
                <span class="label">Técnico Asignado:</span>
                <span class="value">${technician ? technician.name : 'N/A'}</span>
            </div>
            <div class="info-item">
                <span class="label">Email:</span>
                <span class="value">${technician ? technician.email : 'N/A'}</span>
            </div>
            <div class="info-item">
                <span class="label">Teléfono:</span>
                <span class="value">${technician ? technician.phone : 'N/A'}</span>
            </div>
            <div class="info-item">
                <span class="label">Especializaciones:</span>
                <span class="value">${technician && technician.specializations ? technician.specializations.join(', ') : 'N/A'}</span>
            </div>
        </div>
    </div>
    
    ${ticket.visitForm ? `
    <div class="section">
        <h3>Formulario de Visita</h3>
        <div class="info-item">
            <span class="label">Verificación de Seguridad:</span>
            <span class="value">${ticket.visitForm.safetyCheck}</span>
        </div>
        <div class="info-item">
            <span class="label">Herramientas Utilizadas:</span>
            <span class="value">${Array.isArray(ticket.visitForm.toolsUsed) ? ticket.visitForm.toolsUsed.join(', ') : ticket.visitForm.toolsUsed}</span>
        </div>
        <div class="info-item">
            <span class="label">Estado del Trabajo:</span>
            <span class="value">${ticket.visitForm.workCompleted}</span>
        </div>
        <div class="info-item">
            <span class="label">Problemas Encontrados:</span>
            <span class="value">${ticket.visitForm.issuesFound || 'Ninguno'}</span>
        </div>
        <div class="info-item">
            <span class="label">Próximos Pasos:</span>
            <span class="value">${ticket.visitForm.nextSteps || 'N/A'}</span>
        </div>
        <div class="info-item">
            <span class="label">Observaciones:</span>
            <span class="value">${ticket.visitForm.observations || 'N/A'}</span>
        </div>
        ${ticket.visitForm.photos && ticket.visitForm.photos.length > 0 ? `
        <div class="info-item">
            <span class="label">Fotos Adjuntas:</span>
            <span class="value">${ticket.visitForm.photos.join(', ')}</span>
        </div>
        ` : ''}
    </div>
    ` : ''}
    
    ${ticket.survey ? `
    <div class="section">
        <h3>Encuesta de Satisfacción</h3>
        <div class="survey-results">
            <div class="info-item">
                <span class="label">Satisfacción General:</span>
                <span class="value">${ticket.survey.satisfaction}/5</span>
            </div>
            <div class="info-item">
                <span class="label">Calidad del Trabajo:</span>
                <span class="value">${ticket.survey.quality}/5</span>
            </div>
            <div class="info-item">
                <span class="label">Puntualidad:</span>
                <span class="value">${ticket.survey.punctuality}/5</span>
            </div>
            <div class="info-item">
                <span class="label">Comunicación:</span>
                <span class="value">${ticket.survey.communication}/5</span>
            </div>
            <div class="info-item">
                <span class="label">Recomendación:</span>
                <span class="value">${ticket.survey.recommendation}</span>
            </div>
            ${ticket.survey.comments ? `
            <div class="info-item">
                <span class="label">Comentarios:</span>
                <span class="value">${ticket.survey.comments}</span>
            </div>
            ` : ''}
        </div>
    </div>
    ` : ''}
    
    <div class="footer">
        <p>Este informe fue generado automáticamente por el Sistema de Gestión de Empresa Eléctrica</p>
        <p>Fecha de generación: ${new Date().toLocaleString('es-ES')}</p>
    </div>
</body>
</html>
    `;
};

// Funciones adicionales para el sistema
window.editTicket = (ticketId) => {
    Utils.showToast('Funcionalidad de edición en desarrollo', 'info');
};

window.changeTicketStatus = (ticketId) => {
    Utils.showToast('Funcionalidad de cambio de estado en desarrollo', 'info');
};

window.cancelTicket = (ticketId) => {
    if (confirm('¿Estás seguro de que quieres cancelar este ticket?')) {
        DataManager.updateTicket(ticketId, { status: 'cancelado' });
        Utils.showToast('Ticket cancelado', 'success');
        app.navigateTo('tickets');
    }
};

window.viewClientTickets = (clientId) => {
    const client = DataManager.getUserById(clientId);
    
    if (!client) {
        Utils.showToast('Cliente no encontrado', 'error');
        return;
    }
    
    // Navegar a la página específica de tickets del cliente
    window.location.href = `cliente-tickets-admin.html?clientId=${clientId}`;
};

window.editClient = (clientId) => {
    Utils.showToast('Funcionalidad de edición de cliente en desarrollo', 'info');
};

window.viewTechnicianTickets = (technicianId) => {
    Utils.showToast('Funcionalidad en desarrollo', 'info');
};

window.editTechnician = (technicianId) => {
    Utils.showToast('Funcionalidad de edición de técnico en desarrollo', 'info');
};

window.centerMapOnTechnician = (technicianId) => {
    if (window.technicianMap) {
        const technician = DataManager.getUserById(technicianId);
        if (technician && technician.location) {
            window.technicianMap.setView([technician.location.lat, technician.location.lng], 15);
        }
    }
};
