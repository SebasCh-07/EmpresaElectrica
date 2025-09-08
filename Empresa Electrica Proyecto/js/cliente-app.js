// Aplicación específica para clientes

class ClienteApp {
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
        
        // Verificar que sea cliente
        if (this.currentUser.role !== 'cliente') {
            window.location.href = 'login.html';
            return;
        }

        this.setupEventListeners();
        // Listener de tiempo real para actualizar vistas cuando cambien los tickets
        window.addEventListener('tickets:updated', () => {
            const active = document.querySelector('.nav-link.active');
            if (!active) return;
            const view = active.getAttribute('data-view');
            if (view === 'dashboard') {
                this.loadClienteDashboard();
            } else if (view === 'tickets') {
                this.loadClienteTickets();
            }
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
        document.getElementById('user-role').textContent = 'Cliente';
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
        
        // Cargar contenido con estilos específicos de cliente
        this.loadClienteView(view);
    }

    loadClienteView(view) {
        const contentArea = document.getElementById('content-area');
        
        switch(view) {
            case 'dashboard':
                this.loadClienteDashboard();
                break;
            case 'tickets':
                this.loadClienteTickets();
                break;
            case 'ticket-form':
                this.loadClienteTicketForm();
                break;
            default:
                Utils.loadViewContent(view, 'content-area');
        }
    }

    loadClienteDashboard() {
        const contentArea = document.getElementById('content-area');
        const userTickets = this.getUserTickets();
        
        const stats = this.calculateClienteStats(userTickets);
        
        contentArea.innerHTML = `
            <div class="cliente-dashboard">
                <div class="cliente-welcome">
                    <h1>¡Bienvenido, ${this.currentUser.name}!</h1>
                    <p>Gestiona tus tickets de servicio eléctrico de manera fácil y rápida</p>
                </div>
                
                <div class="cliente-stats">
                    <div class="cliente-stat-card">
                        <div class="cliente-stat-header">
                            <div class="cliente-stat-icon pendientes">
                                <i class="fas fa-clock"></i>
                            </div>
                        </div>
                        <div class="cliente-stat-number">${stats.pendientes}</div>
                        <div class="cliente-stat-label">Tickets Pendientes</div>
                    </div>
                    
                    <div class="cliente-stat-card">
                        <div class="cliente-stat-header">
                            <div class="cliente-stat-icon en-curso">
                                <i class="fas fa-tools"></i>
                            </div>
                        </div>
                        <div class="cliente-stat-number">${stats.enCurso}</div>
                        <div class="cliente-stat-label">En Proceso</div>
                    </div>
                    
                    <div class="cliente-stat-card">
                        <div class="cliente-stat-header">
                            <div class="cliente-stat-icon finalizados">
                                <i class="fas fa-check-circle"></i>
                            </div>
                        </div>
                        <div class="cliente-stat-number">${stats.finalizados}</div>
                        <div class="cliente-stat-label">Completados</div>
                    </div>
                    
                    <div class="cliente-stat-card">
                        <div class="cliente-stat-header">
                            <div class="cliente-stat-icon total">
                                <i class="fas fa-ticket-alt"></i>
                            </div>
                        </div>
                        <div class="cliente-stat-number">${stats.total}</div>
                        <div class="cliente-stat-label">Total Tickets</div>
                    </div>
                </div>
                
                <div class="cliente-tickets-container">
                    <div class="cliente-tickets-header">
                        <h2 class="cliente-tickets-title">Tickets Recientes</h2>
                        <div class="cliente-tickets-filter">
                            <button class="cliente-filter-btn active" onclick="app.filterTickets('all')">Todos</button>
                            <button class="cliente-filter-btn" onclick="app.filterTickets('pendiente')">Pendientes</button>
                            <button class="cliente-filter-btn" onclick="app.filterTickets('en_curso')">En Curso</button>
                            <button class="cliente-filter-btn" onclick="app.filterTickets('finalizado')">Finalizados</button>
                        </div>
                    </div>
                    <div id="cliente-tickets-list">
                        ${this.renderClienteTickets(userTickets.slice(0, 5))}
                    </div>
                </div>
            </div>
        `;
        
        // Verificar si hay tickets finalizados sin encuesta al cargar el dashboard
        this.checkForCompletedTickets();
    }

    loadClienteTickets() {
        const contentArea = document.getElementById('content-area');
        const userTickets = this.getUserTickets();
        
        const stats = this.calculateClienteStats(userTickets);
        
        contentArea.innerHTML = `
            <div class="cliente-dashboard">
                <div class="cliente-welcome">
                    <h1>Mis Tickets</h1>
                    <p>Gestiona y da seguimiento a todos tus tickets de servicio</p>
                </div>
                
                <div class="cliente-tickets-container">
                    <div class="cliente-tabs">
                        <button class="cliente-tab active" onclick="app.switchTab('solicitado')" data-tab="solicitado">
                            <i class="fas fa-clock"></i>
                            Solicitado
                            <span class="cliente-tab-badge">${stats.pendientes}</span>
                        </button>
                        <button class="cliente-tab" onclick="app.switchTab('en-curso')" data-tab="en-curso">
                            <i class="fas fa-tools"></i>
                            En Curso
                            <span class="cliente-tab-badge">${stats.enCurso}</span>
                        </button>
                        <button class="cliente-tab" onclick="app.switchTab('finalizado')" data-tab="finalizado">
                            <i class="fas fa-check-circle"></i>
                            Finalizado
                            <span class="cliente-tab-badge">${stats.finalizados}</span>
                        </button>
                    </div>
                    
                    <div class="cliente-tab-content active" id="tab-solicitado">
                        <div class="cliente-tickets-header">
                            <h2 class="cliente-tickets-title">Tickets Solicitados</h2>
                            <p class="cliente-tickets-subtitle">Tickets recién creados, esperando asignación</p>
                        </div>
                        <div id="cliente-tickets-solicitado">
                            ${this.renderClienteTicketsByStatus(userTickets, 'pendiente')}
                        </div>
                    </div>
                    
                    <div class="cliente-tab-content" id="tab-en-curso">
                        <div class="cliente-tickets-header">
                            <h2 class="cliente-tickets-title">Tickets en Curso</h2>
                            <p class="cliente-tickets-subtitle">Tickets asignados a técnicos, trabajo en progreso</p>
                        </div>
                        <div id="cliente-tickets-en-curso">
                            ${this.renderClienteTicketsByStatus(userTickets, 'en_curso')}
                        </div>
                    </div>
                    
                    <div class="cliente-tab-content" id="tab-finalizado">
                        <div class="cliente-tickets-header">
                            <h2 class="cliente-tickets-title">Tickets Finalizados</h2>
                            <p class="cliente-tickets-subtitle">Tickets completados, listos para encuesta y reporte</p>
                        </div>
                        <div id="cliente-tickets-finalizado">
                            ${this.renderClienteTicketsByStatus(userTickets, 'finalizado')}
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Verificar si hay tickets finalizados sin encuesta
        this.checkForCompletedTickets();
    }

    loadClienteTicketForm() {
        const contentArea = document.getElementById('content-area');
        
        contentArea.innerHTML = `
            <div class="cliente-dashboard">
                <div class="cliente-form-container">
                    <div class="cliente-form-header">
                        <h2>Nuevo Ticket de Servicio</h2>
                        <p>Describe el problema o servicio que necesitas y te contactaremos pronto</p>
                    </div>
                    
                    <form id="cliente-ticket-form" onsubmit="app.submitTicket(event)">
                        <div class="cliente-form-grid">
                            <div class="cliente-form-group">
                                <label class="cliente-form-label" for="ticket-tipo">Tipo de Servicio</label>
                                <select class="cliente-form-select" id="ticket-tipo" name="tipo" required>
                                    <option value="">Selecciona el tipo</option>
                                    <option value="soporte">Soporte Técnico</option>
                                    <option value="inspeccion">Inspección</option>
                                    <option value="responsabilidad">Responsabilidad</option>
                                </select>
                            </div>
                            
                            <div class="cliente-form-group full-width">
                                <label class="cliente-form-label" for="ticket-titulo">Título del Ticket</label>
                                <input type="text" class="cliente-form-input" id="ticket-titulo" name="titulo" 
                                       placeholder="Describe brevemente el problema o servicio" required>
                            </div>
                            
                            <div class="cliente-form-group full-width">
                                <label class="cliente-form-label" for="ticket-descripcion">Descripción Detallada</label>
                                <textarea class="cliente-form-textarea" id="ticket-descripcion" name="descripcion" 
                                          placeholder="Proporciona todos los detalles relevantes sobre el problema o servicio que necesitas" required></textarea>
                            </div>
                            
                            <div class="cliente-form-group">
                                <label class="cliente-form-label" for="ticket-direccion">Dirección</label>
                                <input type="text" class="cliente-form-input" id="ticket-direccion" name="direccion" 
                                       placeholder="Dirección donde se realizará el servicio" required>
                            </div>
                            
                            <div class="cliente-form-group">
                                <label class="cliente-form-label" for="ticket-telefono">Teléfono de Contacto</label>
                                <input type="tel" class="cliente-form-input" id="ticket-telefono" name="telefono" 
                                       placeholder="Número de contacto" required>
                            </div>
                        </div>
                        
                        <button type="submit" class="cliente-form-submit">
                            <i class="fas fa-paper-plane"></i>
                            Enviar Ticket
                        </button>
                    </form>
                </div>
            </div>
        `;
    }

    getUserTickets() {
        return DataManager.getTicketsByClient(this.currentUser.id);
    }

    calculateClienteStats(tickets) {
        return {
            pendientes: tickets.filter(t => t.status === 'pendiente').length,
            enCurso: tickets.filter(t => t.status === 'en_curso' || t.status === 'asignado').length,
            finalizados: tickets.filter(t => t.status === 'finalizado' || t.status === 'pre_cerrado').length,
            total: tickets.length
        };
    }

    renderClienteTickets(tickets) {
        if (tickets.length === 0) {
            return `
                <div class="cliente-empty-state">
                    <i class="fas fa-ticket-alt"></i>
                    <h3>No hay tickets</h3>
                    <p>Aún no tienes tickets de servicio</p>
                    <button class="cliente-action-btn primary" onclick="app.navigateTo('ticket-form')">
                        <i class="fas fa-plus"></i>
                        Crear Primer Ticket
                    </button>
                </div>
            `;
        }

        return tickets.map(ticket => `
            <div class="cliente-ticket-card">
                <div class="cliente-ticket-header">
                    <div class="cliente-ticket-id">${ticket.id}</div>
                    <div class="cliente-ticket-fecha">${Utils.formatDate(ticket.createdAt)}</div>
                </div>
                
                <div class="cliente-ticket-titulo">${ticket.title}</div>
                <div class="cliente-ticket-descripcion">${ticket.description}</div>
                
                <div class="cliente-ticket-meta">
                    <div class="cliente-ticket-info">
                        <span class="status-badge status-${ticket.status}">${Utils.getStatusLabel(ticket.status)}</span>
                        <span class="priority-badge priority-${ticket.priority}">${Utils.getPriorityLabel(ticket.priority)}</span>
                    </div>
                    
                    <div class="cliente-ticket-actions">
                        ${ticket.status === 'finalizado' || ticket.status === 'pre_cerrado' ? `
                            ${ticket.encuestaCompletada ? `
                                <button class="cliente-action-btn primary" onclick="app.viewTicket('${ticket.id}')">
                                    <i class="fas fa-file-alt"></i>
                                    Ver Informe
                                </button>
                                <button class="cliente-action-btn" onclick="app.downloadReport('${ticket.id}')">
                                    <i class="fas fa-download"></i>
                                    Descargar
                                </button>
                            ` : `
                                <button class="cliente-action-btn disabled" disabled>
                                    <i class="fas fa-file-alt"></i>
                                    Ver Informe
                                </button>
                                <button class="cliente-action-btn primary" onclick="app.showSurvey('${ticket.id}')">
                                    <i class="fas fa-star"></i>
                                    Encuesta
                                </button>
                            `}
                        ` : `
                            <button class="cliente-action-btn" onclick="app.viewTicket('${ticket.id}')">
                                <i class="fas fa-eye"></i>
                                Ver
                            </button>
                        `}
                    </div>
                </div>
            </div>
        `).join('');
    }

    renderClienteTicketsByStatus(tickets, status) {
        let filteredTickets;
        if (status === 'pendiente') {
            filteredTickets = tickets.filter(ticket => ticket.status === 'pendiente');
        } else if (status === 'en_curso') {
            filteredTickets = tickets.filter(ticket => ticket.status === 'en_curso' || ticket.status === 'asignado');
        } else if (status === 'finalizado') {
            filteredTickets = tickets.filter(ticket => ticket.status === 'finalizado' || ticket.status === 'pre_cerrado');
        } else {
            filteredTickets = tickets.filter(ticket => ticket.status === status);
        }
        return this.renderClienteTickets(filteredTickets);
    }

    switchTab(tabName) {
        // Actualizar pestañas activas
        document.querySelectorAll('.cliente-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
        
        // Actualizar contenido activo
        document.querySelectorAll('.cliente-tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(`tab-${tabName}`).classList.add('active');
    }

    filterTickets(filter) {
        // Actualizar botones activos
        document.querySelectorAll('.cliente-filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        event.target.classList.add('active');
        
        // Filtrar tickets
        const userTickets = this.getUserTickets();
        let filteredTickets = userTickets;
        
        if (filter !== 'all') {
            if (filter === 'en_curso') {
                filteredTickets = userTickets.filter(ticket => ticket.status === 'en_curso' || ticket.status === 'asignado');
            } else if (filter === 'finalizado') {
                filteredTickets = userTickets.filter(ticket => ticket.status === 'finalizado' || ticket.status === 'pre_cerrado');
            } else {
                filteredTickets = userTickets.filter(ticket => ticket.status === filter);
            }
        }
        
        // Actualizar lista
        const ticketsList = document.getElementById('cliente-tickets-list');
        ticketsList.innerHTML = this.renderClienteTickets(filteredTickets);
    }

    submitTicket(event) {
        event.preventDefault();
        
        try {
            const formData = new FormData(event.target);
            const ticketData = {
                title: formData.get('titulo'),
                description: formData.get('descripcion'),
                workType: formData.get('tipo'),
                priority: 'media',
                clientId: this.currentUser.id,
                clientName: this.currentUser.name,
                clientEmail: this.currentUser.email,
                clientPhone: formData.get('telefono'),
                clientAddress: formData.get('direccion'),
                isInterprovincial: false
            };
            
            const created = DataManager.createTicket(ticketData);
            
            // Mostrar mensaje de éxito
            Utils.showToast('Ticket creado exitosamente', 'success');
            
            // Limpiar formulario
            event.target.reset();
            
            // Redirigir a tickets después de un breve delay
            setTimeout(() => {
                this.navigateTo('tickets');
            }, 1000);
            
        } catch (error) {
            console.error('Error al crear ticket:', error);
            Utils.showToast('Error al crear el ticket. Inténtalo de nuevo.', 'error');
        }
    }

    viewTicket(ticketId) {
        window.location.href = `cliente-ticket.html?id=${encodeURIComponent(ticketId)}`;
    }

    downloadReport(ticketId) {
        // Implementar descarga de reporte
        Utils.showToast('Función de descarga de reporte en desarrollo', 'info');
    }

    checkForCompletedTickets() {
        const userTickets = this.getUserTickets();
        const completedTickets = userTickets.filter(ticket => 
            (ticket.status === 'finalizado' || ticket.status === 'pre_cerrado') && !ticket.encuestaCompletada
        );
        
        if (completedTickets.length > 0) {
            // Verificar si ya se mostró la notificación en esta sesión
            const notificationShown = sessionStorage.getItem('completionNotificationShown');
            if (!notificationShown) {
                this.showCompletionNotification(completedTickets[0]);
                // Marcar que ya se mostró la notificación en esta sesión
                sessionStorage.setItem('completionNotificationShown', 'true');
            }
        }
    }

    showCompletionNotification(ticket) {
        const notification = document.createElement('div');
        notification.className = 'cliente-notification';
        notification.innerHTML = `
            <button class="cliente-notification-close" onclick="this.parentElement.remove(); sessionStorage.removeItem('completionNotificationShown');">
                <i class="fas fa-times"></i>
            </button>
            <div class="cliente-notification-header">
                <i class="cliente-notification-icon fas fa-check-circle"></i>
                <div class="cliente-notification-title">¡Trabajo Completado!</div>
            </div>
            <div class="cliente-notification-message">
                Tu ticket ${ticket.id} ha sido finalizado. Completa la encuesta de satisfacción para descargar el reporte.
            </div>
            <div class="cliente-notification-actions">
                <button class="cliente-notification-btn" onclick="app.showSurvey('${ticket.id}'); this.parentElement.parentElement.remove(); sessionStorage.removeItem('completionNotificationShown');">
                    <i class="fas fa-star"></i>
                    Completar Encuesta
                </button>
                <button class="cliente-notification-btn" onclick="this.parentElement.parentElement.remove(); sessionStorage.removeItem('completionNotificationShown');">
                    <i class="fas fa-times"></i>
                    Cerrar
                </button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Auto-remove después de 10 segundos
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
                // Limpiar el flag cuando se auto-elimina
                sessionStorage.removeItem('completionNotificationShown');
            }
        }, 10000);
    }

    showSurvey(ticketId) {
        const ticket = this.getUserTickets().find(t => t.id === ticketId);
        if (!ticket) return;

        const surveyModal = document.createElement('div');
        surveyModal.className = 'cliente-survey-modal';
        surveyModal.innerHTML = `
            <div class="cliente-survey-container">
                <button class="cliente-survey-close" onclick="this.parentElement.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
                
                <div class="cliente-survey-header">
                    <h2>Encuesta de Satisfacción</h2>
                    <p>Ticket: ${ticket.id} - ${ticket.titulo}</p>
                </div>
                
                <form id="survey-form" onsubmit="app.submitSurvey(event, '${ticketId}')">
                    <div class="cliente-survey-questions">
                        <div class="cliente-survey-question">
                            <h4>¿Cómo calificarías el servicio recibido?</h4>
                            <div class="cliente-star-rating" id="star-rating">
                                <span class="cliente-star" data-rating="1">★</span>
                                <span class="cliente-star" data-rating="2">★</span>
                                <span class="cliente-star" data-rating="3">★</span>
                                <span class="cliente-star" data-rating="4">★</span>
                                <span class="cliente-star" data-rating="5">★</span>
                            </div>
                            <div class="cliente-rating-text" id="rating-text"></div>
                        </div>
                        
                        <div class="cliente-survey-question">
                            <h4>¿El técnico llegó a tiempo?</h4>
                            <div class="cliente-survey-options">
                                <button type="button" class="cliente-survey-option" data-answer="puntualidad" data-value="si">Sí, puntual</button>
                                <button type="button" class="cliente-survey-option" data-answer="puntualidad" data-value="tarde">Llegó tarde</button>
                                <button type="button" class="cliente-survey-option" data-answer="puntualidad" data-value="muy-tarde">Muy tarde</button>
                            </div>
                        </div>
                        
                        <div class="cliente-survey-question">
                            <h4>¿El técnico fue profesional y cortés?</h4>
                            <div class="cliente-survey-options">
                                <button type="button" class="cliente-survey-option" data-answer="profesionalismo" data-value="excelente">Excelente</button>
                                <button type="button" class="cliente-survey-option" data-answer="profesionalismo" data-value="bueno">Bueno</button>
                                <button type="button" class="cliente-survey-option" data-answer="profesionalismo" data-value="regular">Regular</button>
                                <button type="button" class="cliente-survey-option" data-answer="profesionalismo" data-value="malo">Malo</button>
                            </div>
                        </div>
                        
                        <div class="cliente-survey-question">
                            <h4>¿El problema fue resuelto completamente?</h4>
                            <div class="cliente-survey-options">
                                <button type="button" class="cliente-survey-option" data-answer="resolucion" data-value="completamente">Completamente</button>
                                <button type="button" class="cliente-survey-option" data-answer="resolucion" data-value="parcialmente">Parcialmente</button>
                                <button type="button" class="cliente-survey-option" data-answer="resolucion" data-value="no">No se resolvió</button>
                            </div>
                        </div>
                        
                        <div class="cliente-survey-question">
                            <h4>¿Recomendarías nuestro servicio?</h4>
                            <div class="cliente-survey-options">
                                <button type="button" class="cliente-survey-option" data-answer="recomendacion" data-value="definitivamente">Definitivamente</button>
                                <button type="button" class="cliente-survey-option" data-answer="recomendacion" data-value="probablemente">Probablemente</button>
                                <button type="button" class="cliente-survey-option" data-answer="recomendacion" data-value="no">No</button>
                            </div>
                        </div>
                    </div>
                    
                    <div class="cliente-survey-comments">
                        <h4>Comentarios adicionales (opcional)</h4>
                        <textarea name="comentarios" placeholder="Comparte cualquier comentario adicional sobre el servicio recibido..."></textarea>
                    </div>
                    
                    <div class="cliente-survey-actions">
                        <button type="button" class="cliente-survey-btn secondary" onclick="this.closest('.cliente-survey-modal').remove()">
                            Cancelar
                        </button>
                        <button type="submit" class="cliente-survey-btn primary">
                            <i class="fas fa-paper-plane"></i>
                            Enviar Encuesta
                        </button>
                    </div>
                </form>
            </div>
        `;
        
        document.body.appendChild(surveyModal);
        this.setupSurveyInteractions();
    }

    setupSurveyInteractions() {
        // Sistema de estrellas
        const stars = document.querySelectorAll('.cliente-star');
        const ratingText = document.getElementById('rating-text');
        const ratingTexts = {
            1: 'Muy malo',
            2: 'Malo',
            3: 'Regular',
            4: 'Bueno',
            5: 'Excelente'
        };
        
        let currentRating = 0;
        
        stars.forEach((star, index) => {
            star.addEventListener('click', () => {
                currentRating = index + 1;
                stars.forEach((s, i) => {
                    s.classList.toggle('rated', i < currentRating);
                });
                ratingText.textContent = ratingTexts[currentRating];
            });
            
            star.addEventListener('mouseenter', () => {
                stars.forEach((s, i) => {
                    s.classList.toggle('active', i <= index);
                });
            });
        });
        
        document.getElementById('star-rating').addEventListener('mouseleave', () => {
            stars.forEach((s, i) => {
                s.classList.remove('active');
                s.classList.toggle('rated', i < currentRating);
            });
        });
        
        // Opciones de encuesta
        document.querySelectorAll('.cliente-survey-option').forEach(option => {
            option.addEventListener('click', () => {
                const question = option.dataset.answer;
                const value = option.dataset.value;
                
                // Remover selección anterior en la misma pregunta
                document.querySelectorAll(`[data-answer="${question}"]`).forEach(opt => {
                    opt.classList.remove('selected');
                });
                
                // Seleccionar nueva opción
                option.classList.add('selected');
            });
        });
    }

    submitSurvey(event, ticketId) {
        event.preventDefault();
        
        // Recopilar datos de la encuesta
        const formData = new FormData(event.target);
        const rating = document.querySelectorAll('.cliente-star.rated').length;
        const answers = {};
        
        document.querySelectorAll('.cliente-survey-option.selected').forEach(option => {
            answers[option.dataset.answer] = option.dataset.value;
        });
        
        const surveyData = {
            ticketId: ticketId,
            rating: rating,
            answers: answers,
            comentarios: formData.get('comentarios') || '',
            fecha: new Date().toISOString()
        };
        
        // Validar que se haya completado la encuesta
        if (rating === 0) {
            Utils.showToast('Por favor califica el servicio con estrellas', 'warning');
            return;
        }
        
        if (Object.keys(answers).length < 4) {
            Utils.showToast('Por favor responde todas las preguntas', 'warning');
            return;
        }
        
        // Guardar encuesta en el ticket y marcar finalizado (simulación)
        DataManager.updateTicket(ticketId, {
            survey: surveyData,
            status: 'finalizado',
            completedAt: new Date().toISOString()
        });
        
        // Cerrar modal
        event.target.closest('.cliente-survey-modal').remove();
        
        // Mostrar mensaje de éxito
        Utils.showToast('¡Encuesta completada! Ahora puedes descargar el reporte.', 'success');
        
        // Actualizar la vista de tickets
        setTimeout(() => {
            this.loadClienteTickets();
        }, 1000);
    }

    logout() {
        localStorage.removeItem('currentUser');
        window.location.href = 'login.html';
    }
}

// Inicializar aplicación
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new ClienteApp();
});

// Funciones globales
window.app = app;

// Función para toggle del menú móvil
window.toggleMobileMenu = () => {
    const sidebar = document.querySelector('.sidebar');
    sidebar.classList.toggle('mobile-open');
};
