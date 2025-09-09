// Sistema de notificaciones por email

class NotificationSystem {
    constructor() {
        this.notificationQueue = [];
        this.sentNotifications = JSON.parse(localStorage.getItem('sentNotifications') || '[]');
        this.emailTemplates = this.initEmailTemplates();
    }

    // Inicializar plantillas de email
    initEmailTemplates() {
        return {
            ticketCreated: {
                subject: 'Nuevo Ticket Creado - #{ticketId}',
                template: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 2rem; text-align: center;">
                            <h1>🎫 Nuevo Ticket de Soporte</h1>
                            <h2>Ticket #{ticketId}</h2>
                        </div>
                        <div style="padding: 2rem; background: #f8f9fa;">
                            <h3>Detalles del Ticket</h3>
                            <p><strong>Título:</strong> {title}</p>
                            <p><strong>Cliente:</strong> {clientName}</p>
                            <p><strong>Prioridad:</strong> {priority}</p>
                            <p><strong>Tipo de Trabajo:</strong> {workType}</p>
                            <p><strong>Descripción:</strong> {description}</p>
                            <p><strong>Dirección:</strong> {clientAddress}</p>
                            <p><strong>Fecha de Creación:</strong> {createdAt}</p>
                        </div>
                        <div style="background: #fff; padding: 1rem; text-align: center; border-top: 1px solid #dee2e6;">
                            <p style="margin: 0; color: #6c757d;">Sistema de Gestión de Tickets - Empresa Eléctrica</p>
                        </div>
                    </div>
                `
            },
            ticketAssigned: {
                subject: 'Ticket Asignado - #{ticketId}',
                template: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <div style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; padding: 2rem; text-align: center;">
                            <h1>👷‍♂️ Ticket Asignado</h1>
                            <h2>Ticket #{ticketId}</h2>
                        </div>
                        <div style="padding: 2rem; background: #f8f9fa;">
                            <h3>Información de Asignación</h3>
                            <p><strong>Técnico Asignado:</strong> {technicianName}</p>
                            <p><strong>Fecha de Visita:</strong> {visitDate}</p>
                            <p><strong>Duración Estimada:</strong> {estimatedDuration} horas</p>
                            <p><strong>Cliente:</strong> {clientName}</p>
                            <p><strong>Dirección:</strong> {clientAddress}</p>
                            <p><strong>Teléfono de Contacto:</strong> {clientPhone}</p>
                            {notes ? '<p><strong>Notas Especiales:</strong> {notes}</p>' : ''}
                        </div>
                        <div style="background: #fff; padding: 1rem; text-align: center; border-top: 1px solid #dee2e6;">
                            <p style="margin: 0; color: #6c757d;">Por favor, confirma tu disponibilidad contactando al cliente.</p>
                        </div>
                    </div>
                `
            },
            ticketCompleted: {
                subject: 'Trabajo Completado - #{ticketId}',
                template: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <div style="background: linear-gradient(135deg, #007bff 0%, #6f42c1 100%); color: white; padding: 2rem; text-align: center;">
                            <h1>✅ Trabajo Completado</h1>
                            <h2>Ticket #{ticketId}</h2>
                        </div>
                        <div style="padding: 2rem; background: #f8f9fa;">
                            <h3>Resumen del Trabajo</h3>
                            <p><strong>Título:</strong> {title}</p>
                            <p><strong>Técnico:</strong> {technicianName}</p>
                            <p><strong>Fecha de Finalización:</strong> {completedAt}</p>
                            <p><strong>Duración Real:</strong> {actualDuration} horas</p>
                            <p><strong>Estado:</strong> {status}</p>
                        </div>
                        <div style="background: #e8f4fd; padding: 1.5rem; margin: 1rem 0;">
                            <h4 style="margin-top: 0; color: #0056b3;">📋 Próximos Pasos</h4>
                            <p>Para finalizar completamente este servicio, por favor complete la encuesta de satisfacción. Esto nos ayuda a mejorar nuestros servicios.</p>
                        </div>
                        <div style="background: #fff; padding: 1rem; text-align: center; border-top: 1px solid #dee2e6;">
                            <p style="margin: 0; color: #6c757d;">Gracias por confiar en nuestros servicios.</p>
                        </div>
                    </div>
                `
            },
            surveyCompleted: {
                subject: 'Gracias por tu Feedback - #{ticketId}',
                template: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <div style="background: linear-gradient(135deg, #ffc107 0%, #fd7e14 100%); color: white; padding: 2rem; text-align: center;">
                            <h1>⭐ Encuesta Completada</h1>
                            <h2>Ticket #{ticketId}</h2>
                        </div>
                        <div style="padding: 2rem; background: #f8f9fa;">
                            <h3>Gracias por tu Feedback</h3>
                            <p>Hemos recibido tu encuesta de satisfacción con una puntuación general de <strong>{score}/5</strong>.</p>
                            <p><strong>¿Recomendarías nuestro servicio?</strong> {wouldRecommend}</p>
                            {comments ? '<div style="background: white; padding: 1rem; border-left: 4px solid #ffc107; margin: 1rem 0;"><p><strong>Tus comentarios:</strong></p><p style="font-style: italic;">"{comments}"</p></div>' : ''}
                        </div>
                        <div style="background: #fff; padding: 1rem; text-align: center; border-top: 1px solid #dee2e6;">
                            <p style="margin: 0; color: #6c757d;">Tu opinión es muy valiosa para nosotros. ¡Gracias!</p>
                        </div>
                    </div>
                `
            },
            viaticosRequested: {
                subject: 'Solicitud de Viáticos - #{ticketId}',
                template: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <div style="background: linear-gradient(135deg, #dc3545 0%, #e83e8c 100%); color: white; padding: 2rem; text-align: center;">
                            <h1>💰 Solicitud de Viáticos</h1>
                            <h2>Ticket #{ticketId}</h2>
                        </div>
                        <div style="padding: 2rem; background: #f8f9fa;">
                            <h3>Detalles de la Solicitud</h3>
                            <p><strong>Técnico:</strong> {technicianName}</p>
                            <p><strong>Monto Solicitado:</strong> {amount}</p>
                            <p><strong>Descripción:</strong> {description}</p>
                            <p><strong>Destino:</strong> {destination}</p>
                            <p><strong>Fecha de Solicitud:</strong> {requestDate}</p>
                        </div>
                        <div style="background: #fff; padding: 1rem; text-align: center; border-top: 1px solid #dee2e6;">
                            <p style="margin: 0; color: #6c757d;">Requiere aprobación administrativa.</p>
                        </div>
                    </div>
                `
            }
        };
    }

    // Enviar notificación
    async sendNotification(type, recipients, data) {
        if (!this.emailTemplates[type]) {
            console.error(`Plantilla de email '${type}' no encontrada`);
            return false;
        }

        const template = this.emailTemplates[type];
        const subject = this.processTemplate(template.subject, data);
        const htmlContent = this.processTemplate(template.template, data);

        for (const recipient of recipients) {
            const notification = {
                id: this.generateNotificationId(),
                type,
                recipient,
                subject,
                htmlContent,
                data,
                sentAt: new Date().toISOString(),
                status: 'enviado' // simulado
            };

            // Simular envío de email
            this.simulateEmailSending(notification);
            
            // Guardar en notificaciones enviadas
            this.sentNotifications.push(notification);
        }

        // Guardar en localStorage
        localStorage.setItem('sentNotifications', JSON.stringify(this.sentNotifications));
        
        return true;
    }

    // Procesar plantilla con datos
    processTemplate(template, data) {
        let processed = template;
        
        Object.keys(data).forEach(key => {
            const regex = new RegExp(`\\{${key}\\}`, 'g');
            processed = processed.replace(regex, data[key] || '');
        });

        // Procesar condicionales simples
        processed = processed.replace(/\{(\w+)\s*\?\s*'([^']*)'([^}]*)\}/g, (match, condition, trueValue, rest) => {
            return data[condition] ? trueValue + rest.replace(/\s*:\s*'[^']*'/, '') : rest.replace(/^[^:]*:\s*'([^']*)'.*/, '$1');
        });

        return processed;
    }

    // Simular envío de email
    simulateEmailSending(notification) {
        // En un entorno real, aquí se conectaría con un servicio de email como SendGrid, Mailgun, etc.
        console.log(`📧 Email simulado enviado a: ${notification.recipient}`);
        console.log(`📋 Asunto: ${notification.subject}`);
        console.log(`⏰ Enviado: ${new Date(notification.sentAt).toLocaleString()}`);
        
        // Mostrar toast de confirmación
        if (typeof Utils !== 'undefined' && Utils.showToast) {
            Utils.showToast(`Email enviado a ${notification.recipient}`, 'success');
        }
    }

    // Notificaciones para eventos específicos
    notifyTicketCreated(ticket) {
        const admins = DataManager.getUsersByRole('admin');
        const mesaAyuda = DataManager.getUsersByRole('mesa_ayuda');
        const recipients = [...admins, ...mesaAyuda].map(user => user.email);

        const data = {
            ticketId: ticket.id,
            title: ticket.title,
            clientName: ticket.clientName,
            priority: ticket.priority?.toUpperCase() || 'MEDIA',
            workType: ticket.workType,
            description: ticket.description,
            clientAddress: ticket.clientAddress,
            createdAt: new Date(ticket.createdAt).toLocaleDateString('es-ES')
        };

        return this.sendNotification('ticketCreated', recipients, data);
    }

    notifyTicketAssigned(ticket, technician, visitDate, estimatedDuration, notes = '') {
        const recipients = [technician.email];
        
        const data = {
            ticketId: ticket.id,
            technicianName: technician.name,
            clientName: ticket.clientName,
            clientAddress: ticket.clientAddress,
            clientPhone: ticket.clientPhone,
            visitDate: new Date(visitDate).toLocaleString('es-ES'),
            estimatedDuration: estimatedDuration,
            notes: notes
        };

        return this.sendNotification('ticketAssigned', recipients, data);
    }

    notifyTicketCompleted(ticket, technician) {
        const recipients = [ticket.clientEmail];
        
        const data = {
            ticketId: ticket.id,
            title: ticket.title,
            technicianName: technician?.name || 'Técnico asignado',
            completedAt: new Date(ticket.completedAt || ticket.updatedAt).toLocaleDateString('es-ES'),
            actualDuration: ticket.actualDuration || ticket.estimatedDuration || 'No especificada',
            status: 'Completado'
        };

        return this.sendNotification('ticketCompleted', recipients, data);
    }

    notifySurveyCompleted(ticket, survey) {
        const admins = DataManager.getUsersByRole('admin');
        const recipients = admins.map(admin => admin.email);
        
        const data = {
            ticketId: ticket.id,
            score: survey.score || 'No calculado',
            wouldRecommend: survey.wouldRecommend === 'true' ? 'Sí' : 'No',
            comments: survey.comments || ''
        };

        return this.sendNotification('surveyCompleted', recipients, data);
    }

    notifyViaticosRequested(ticket, technician, viaticosData) {
        const admins = DataManager.getUsersByRole('admin');
        const recipients = admins.map(admin => admin.email);
        
        const data = {
            ticketId: ticket.id,
            technicianName: technician.name,
            amount: viaticosData.amount,
            description: viaticosData.description,
            destination: viaticosData.destination || 'No especificado',
            requestDate: new Date().toLocaleDateString('es-ES')
        };

        return this.sendNotification('viaticosRequested', recipients, data);
    }

    // Obtener historial de notificaciones
    getNotificationHistory(filter = {}) {
        let notifications = [...this.sentNotifications];
        
        if (filter.type) {
            notifications = notifications.filter(n => n.type === filter.type);
        }
        
        if (filter.recipient) {
            notifications = notifications.filter(n => n.recipient.includes(filter.recipient));
        }
        
        if (filter.dateFrom) {
            notifications = notifications.filter(n => new Date(n.sentAt) >= new Date(filter.dateFrom));
        }
        
        if (filter.dateTo) {
            notifications = notifications.filter(n => new Date(n.sentAt) <= new Date(filter.dateTo));
        }
        
        return notifications.sort((a, b) => new Date(b.sentAt) - new Date(a.sentAt));
    }

    // Mostrar modal con historial de notificaciones
    showNotificationHistory() {
        const notifications = this.getNotificationHistory();
        
        const modal = document.createElement('div');
        modal.className = 'modal show notification-history-modal';
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 900px;">
                <div class="modal-header">
                    <h3><i class="fas fa-bell"></i> Historial de Notificaciones</h3>
                    <button class="modal-close-btn" onclick="this.closest('.modal').remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="notification-filters">
                        <select id="notification-type-filter" onchange="notificationSystem.filterNotifications()">
                            <option value="">Todos los tipos</option>
                            <option value="ticketCreated">Tickets Creados</option>
                            <option value="ticketAssigned">Tickets Asignados</option>
                            <option value="ticketCompleted">Tickets Completados</option>
                            <option value="surveyCompleted">Encuestas Completadas</option>
                            <option value="viaticosRequested">Viáticos Solicitados</option>
                        </select>
                        <input type="email" id="notification-recipient-filter" placeholder="Filtrar por email..." onkeyup="notificationSystem.filterNotifications()">
                    </div>
                    <div id="notifications-list" class="notifications-list">
                        ${this.renderNotificationsList(notifications)}
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Cerrar con ESC
        const closeHandler = (e) => {
            if (e.key === 'Escape') {
                modal.remove();
                document.removeEventListener('keydown', closeHandler);
            }
        };
        document.addEventListener('keydown', closeHandler);
        
        // Cerrar al hacer clic fuera
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
                document.removeEventListener('keydown', closeHandler);
            }
        });
    }

    // Renderizar lista de notificaciones
    renderNotificationsList(notifications) {
        if (notifications.length === 0) {
            return '<div class="no-notifications"><i class="fas fa-inbox"></i><p>No hay notificaciones</p></div>';
        }
        
        return notifications.map(notification => `
            <div class="notification-item" onclick="notificationSystem.showNotificationDetail('${notification.id}')">
                <div class="notification-header">
                    <span class="notification-type">${this.getTypeLabel(notification.type)}</span>
                    <span class="notification-date">${new Date(notification.sentAt).toLocaleDateString('es-ES')}</span>
                </div>
                <div class="notification-subject">${notification.subject}</div>
                <div class="notification-recipient">Para: ${notification.recipient}</div>
            </div>
        `).join('');
    }

    // Filtrar notificaciones en tiempo real
    filterNotifications() {
        const typeFilter = document.getElementById('notification-type-filter')?.value || '';
        const recipientFilter = document.getElementById('notification-recipient-filter')?.value || '';
        
        const filter = {};
        if (typeFilter) filter.type = typeFilter;
        if (recipientFilter) filter.recipient = recipientFilter;
        
        const filteredNotifications = this.getNotificationHistory(filter);
        const listContainer = document.getElementById('notifications-list');
        if (listContainer) {
            listContainer.innerHTML = this.renderNotificationsList(filteredNotifications);
        }
    }

    // Mostrar detalle de notificación
    showNotificationDetail(notificationId) {
        const notification = this.sentNotifications.find(n => n.id === notificationId);
        if (!notification) return;
        
        const modal = document.createElement('div');
        modal.className = 'modal show notification-detail-modal';
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 700px;">
                <div class="modal-header">
                    <h3><i class="fas fa-envelope"></i> Detalle de Notificación</h3>
                    <button class="modal-close-btn" onclick="this.closest('.modal').remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="notification-detail">
                        <div class="notification-meta">
                            <p><strong>Tipo:</strong> ${this.getTypeLabel(notification.type)}</p>
                            <p><strong>Destinatario:</strong> ${notification.recipient}</p>
                            <p><strong>Enviado:</strong> ${new Date(notification.sentAt).toLocaleString('es-ES')}</p>
                            <p><strong>Estado:</strong> <span class="status-badge status-success">${notification.status}</span></p>
                        </div>
                        <div class="notification-content">
                            <h4>Asunto:</h4>
                            <p class="notification-subject-detail">${notification.subject}</p>
                            <h4>Contenido:</h4>
                            <div class="notification-html-content">
                                ${notification.htmlContent}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Cerrar con ESC
        const closeHandler = (e) => {
            if (e.key === 'Escape') {
                modal.remove();
                document.removeEventListener('keydown', closeHandler);
            }
        };
        document.addEventListener('keydown', closeHandler);
        
        // Cerrar al hacer clic fuera
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
                document.removeEventListener('keydown', closeHandler);
            }
        });
    }

    // Obtener etiqueta de tipo
    getTypeLabel(type) {
        const labels = {
            ticketCreated: 'Ticket Creado',
            ticketAssigned: 'Ticket Asignado',
            ticketCompleted: 'Ticket Completado',
            surveyCompleted: 'Encuesta Completada',
            viaticosRequested: 'Viáticos Solicitados'
        };
        return labels[type] || type;
    }

    // Generar ID único para notificación
    generateNotificationId() {
        return 'notification_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    // Obtener estadísticas de notificaciones
    getNotificationStats() {
        const notifications = this.sentNotifications;
        const today = new Date();
        const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        const lastMonth = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
        
        return {
            total: notifications.length,
            today: notifications.filter(n => new Date(n.sentAt).toDateString() === today.toDateString()).length,
            lastWeek: notifications.filter(n => new Date(n.sentAt) >= lastWeek).length,
            lastMonth: notifications.filter(n => new Date(n.sentAt) >= lastMonth).length,
            byType: notifications.reduce((acc, n) => {
                acc[n.type] = (acc[n.type] || 0) + 1;
                return acc;
            }, {})
        };
    }
}

// Instancia global
window.notificationSystem = new NotificationSystem();
