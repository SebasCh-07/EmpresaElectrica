// Sistema avanzado de gestión de viáticos

class ViaticosSystem {
    constructor() {
        this.viaticosRubros = [
            {
                id: 'transporte',
                name: 'Transporte',
                description: 'Gastos de transporte público, combustible, peajes',
                maxAmount: 50000,
                requiresReceipts: true,
                icon: 'fas fa-car'
            },
            {
                id: 'hospedaje',
                name: 'Hospedaje',
                description: 'Alojamiento en hotel, hostería o similar',
                maxAmount: 80000,
                requiresReceipts: true,
                icon: 'fas fa-bed'
            },
            {
                id: 'alimentacion',
                name: 'Alimentación',
                description: 'Desayuno, almuerzo, cena y refrigerios',
                maxAmount: 30000,
                requiresReceipts: false,
                icon: 'fas fa-utensils'
            },
            {
                id: 'comunicaciones',
                name: 'Comunicaciones',
                description: 'Llamadas telefónicas y datos móviles',
                maxAmount: 10000,
                requiresReceipts: true,
                icon: 'fas fa-phone'
            },
            {
                id: 'materiales',
                name: 'Materiales',
                description: 'Compra de materiales específicos para el trabajo',
                maxAmount: 100000,
                requiresReceipts: true,
                icon: 'fas fa-toolbox'
            },
            {
                id: 'otros',
                name: 'Otros Gastos',
                description: 'Gastos varios relacionados con el trabajo',
                maxAmount: 20000,
                requiresReceipts: true,
                icon: 'fas fa-receipt'
            }
        ];
        
        this.viaticosRequests = JSON.parse(localStorage.getItem('viaticosRequests') || '[]');
    }

    // Crear formulario de solicitud de viáticos
    createViaticosRequestForm(ticketId) {
        const ticket = DataManager.getTicketById(ticketId);
        if (!ticket) return '';

        return `
            <div class="viaticos-form-container">
                <div class="viaticos-header">
                    <h3><i class="fas fa-money-bill-wave"></i> Solicitud de Viáticos</h3>
                    <p>Ticket: <strong>${ticket.id}</strong> - ${ticket.title}</p>
                    <p>Destino: <strong>${ticket.clientAddress}</strong></p>
                </div>

                <form id="viaticos-form-${ticketId}" class="viaticos-form" onsubmit="viaticosSystem.submitViaticosRequest(event, '${ticketId}')">
                    <div class="form-section">
                        <h4>Información del Viaje</h4>
                        <div class="form-row">
                            <div class="form-group">
                                <label for="departure-date">Fecha de Salida *</label>
                                <input type="datetime-local" id="departure-date" name="departureDate" required>
                            </div>
                            <div class="form-group">
                                <label for="return-date">Fecha de Regreso *</label>
                                <input type="datetime-local" id="return-date" name="returnDate" required>
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label for="origin">Lugar de Origen *</label>
                                <input type="text" id="origin" name="origin" required placeholder="Ciudad/Dirección de origen">
                            </div>
                            <div class="form-group">
                                <label for="destination">Lugar de Destino *</label>
                                <input type="text" id="destination" name="destination" value="${ticket.clientAddress}" required>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="purpose">Propósito del Viaje *</label>
                            <textarea id="purpose" name="purpose" required placeholder="Describe el propósito específico del viaje">${ticket.description}</textarea>
                        </div>
                    </div>

                    <div class="form-section">
                        <h4>Rubros de Gastos</h4>
                        <div class="rubros-grid">
                            ${this.viaticosRubros.map(rubro => this.renderRubroInput(rubro)).join('')}
                        </div>
                    </div>

                    <div class="form-section">
                        <h4>Información Adicional</h4>
                        <div class="form-group">
                            <label for="special-requirements">Requerimientos Especiales</label>
                            <textarea id="special-requirements" name="specialRequirements" placeholder="Menciona cualquier requerimiento especial (alergias alimentarias, necesidades médicas, etc.)"></textarea>
                        </div>
                        <div class="form-group">
                            <label for="advance-percentage">Porcentaje de Anticipo (%)</label>
                            <input type="number" id="advance-percentage" name="advancePercentage" min="0" max="80" value="50" placeholder="Porcentaje del total a solicitar como anticipo">
                        </div>
                    </div>

                    <div class="viaticos-summary">
                        <h4>Resumen de Solicitud</h4>
                        <div class="summary-content">
                            <div class="summary-item">
                                <span class="summary-label">Total Solicitado:</span>
                                <span class="summary-value" id="total-amount">$0</span>
                            </div>
                            <div class="summary-item">
                                <span class="summary-label">Anticipo Solicitado:</span>
                                <span class="summary-value" id="advance-amount">$0</span>
                            </div>
                            <div class="summary-item">
                                <span class="summary-label">Saldo por Comprobar:</span>
                                <span class="summary-value" id="balance-amount">$0</span>
                            </div>
                        </div>
                    </div>

                    <div class="form-actions">
                        <button type="button" class="btn btn-secondary" onclick="this.closest('.modal').remove()">
                            Cancelar
                        </button>
                        <button type="submit" class="btn btn-primary">
                            <i class="fas fa-paper-plane"></i> Enviar Solicitud
                        </button>
                    </div>
                </form>
            </div>
        `;
    }

    // Renderizar input para un rubro específico
    renderRubroInput(rubro) {
        return `
            <div class="rubro-card">
                <div class="rubro-header">
                    <div class="rubro-icon">
                        <i class="${rubro.icon}"></i>
                    </div>
                    <div class="rubro-info">
                        <h5>${rubro.name}</h5>
                        <p>${rubro.description}</p>
                        <small>Máximo: $${this.formatCurrency(rubro.maxAmount)}</small>
                    </div>
                </div>
                <div class="rubro-input">
                    <div class="input-group">
                        <span class="input-prefix">$</span>
                        <input type="number" 
                               name="rubro_${rubro.id}" 
                               id="rubro_${rubro.id}"
                               min="0" 
                               max="${rubro.maxAmount}"
                               placeholder="0"
                               onchange="viaticosSystem.updateSummary('${rubro.id}')"
                               oninput="viaticosSystem.updateSummary('${rubro.id}')">
                    </div>
                    ${rubro.requiresReceipts ? `
                        <div class="receipt-requirement">
                            <i class="fas fa-receipt"></i>
                            <span>Requiere comprobantes</span>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    }

    // Actualizar resumen de montos
    updateSummary(changedRubroId = null) {
        let total = 0;
        
        this.viaticosRubros.forEach(rubro => {
            const input = document.getElementById(`rubro_${rubro.id}`);
            if (input) {
                const amount = parseFloat(input.value) || 0;
                
                // Validar límite del rubro
                if (amount > rubro.maxAmount) {
                    input.value = rubro.maxAmount;
                    Utils.showToast(`El monto para ${rubro.name} excede el límite máximo de $${this.formatCurrency(rubro.maxAmount)}`, 'warning');
                }
                
                total += parseFloat(input.value) || 0;
            }
        });

        const advancePercentage = parseFloat(document.getElementById('advance-percentage')?.value) || 50;
        const advanceAmount = (total * advancePercentage) / 100;
        const balanceAmount = total - advanceAmount;

        // Actualizar elementos del resumen
        const totalElement = document.getElementById('total-amount');
        const advanceElement = document.getElementById('advance-amount');
        const balanceElement = document.getElementById('balance-amount');

        if (totalElement) totalElement.textContent = `$${this.formatCurrency(total)}`;
        if (advanceElement) advanceElement.textContent = `$${this.formatCurrency(advanceAmount)}`;
        if (balanceElement) balanceElement.textContent = `$${this.formatCurrency(balanceAmount)}`;
    }

    // Enviar solicitud de viáticos
    submitViaticosRequest(event, ticketId) {
        event.preventDefault();
        
        const formData = new FormData(event.target);
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        const ticket = DataManager.getTicketById(ticketId);
        
        // Recopilar datos de rubros
        const rubros = {};
        let totalAmount = 0;
        
        this.viaticosRubros.forEach(rubro => {
            const amount = parseFloat(formData.get(`rubro_${rubro.id}`)) || 0;
            if (amount > 0) {
                rubros[rubro.id] = {
                    name: rubro.name,
                    amount: amount,
                    maxAmount: rubro.maxAmount,
                    requiresReceipts: rubro.requiresReceipts
                };
                totalAmount += amount;
            }
        });

        if (totalAmount === 0) {
            Utils.showToast('Debe especificar al menos un monto en los rubros', 'warning');
            return;
        }

        const advancePercentage = parseFloat(formData.get('advancePercentage')) || 50;
        const advanceAmount = (totalAmount * advancePercentage) / 100;

        const viaticosRequest = {
            id: this.generateRequestId(),
            ticketId: ticketId,
            requesterId: currentUser.id,
            requesterName: currentUser.name,
            ticketTitle: ticket.title,
            departureDate: formData.get('departureDate'),
            returnDate: formData.get('returnDate'),
            origin: formData.get('origin'),
            destination: formData.get('destination'),
            purpose: formData.get('purpose'),
            specialRequirements: formData.get('specialRequirements'),
            rubros: rubros,
            totalAmount: totalAmount,
            advancePercentage: advancePercentage,
            advanceAmount: advanceAmount,
            balanceAmount: totalAmount - advanceAmount,
            status: 'pendiente',
            requestDate: new Date().toISOString(),
            approvedBy: null,
            approvedAt: null,
            comments: null
        };

        // Guardar solicitud
        this.viaticosRequests.push(viaticosRequest);
        localStorage.setItem('viaticosRequests', JSON.stringify(this.viaticosRequests));

        // Actualizar ticket con información de viáticos
        DataManager.updateTicket(ticketId, {
            viaticos: {
                requested: true,
                requestId: viaticosRequest.id,
                approved: false,
                amount: totalAmount,
                description: formData.get('purpose')
            }
        });

        // Enviar notificación
        if (typeof notificationSystem !== 'undefined') {
            const technician = DataManager.getUserById(currentUser.id);
            notificationSystem.notifyViaticosRequested(ticket, technician, viaticosRequest);
        }

        // Cerrar modal
        const modal = event.target.closest('.modal');
        if (modal) {
            modal.remove();
        }

        Utils.showToast('Solicitud de viáticos enviada exitosamente', 'success');
        
        // Recargar vista si es necesario
        if (typeof loadTicketDetailById === 'function') {
            loadTicketDetailById(ticketId);
        }
    }

    // Mostrar modal de solicitud de viáticos
    showViaticosRequestModal(ticketId) {
        const ticket = DataManager.getTicketById(ticketId);
        if (!ticket) {
            Utils.showToast('Ticket no encontrado', 'error');
            return;
        }

        // Verificar si ya existe una solicitud
        const existingRequest = this.viaticosRequests.find(req => req.ticketId === ticketId);
        if (existingRequest) {
            Utils.showToast('Ya existe una solicitud de viáticos para este ticket', 'warning');
            this.showViaticosDetailModal(existingRequest.id);
            return;
        }

        const modal = document.createElement('div');
        modal.className = 'modal show viaticos-modal';
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 900px;">
                <div class="modal-header">
                    <h3><i class="fas fa-money-bill-wave"></i> Solicitud de Viáticos</h3>
                    <button class="modal-close-btn" onclick="this.closest('.modal').remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    ${this.createViaticosRequestForm(ticketId)}
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Configurar fecha mínima como hoy
        const departureInput = modal.querySelector('#departure-date');
        const returnInput = modal.querySelector('#return-date');
        if (departureInput && returnInput) {
            const now = new Date();
            const minDate = now.toISOString().slice(0, 16);
            departureInput.min = minDate;
            returnInput.min = minDate;
            
            // Actualizar fecha mínima de regreso cuando cambie la salida
            departureInput.addEventListener('change', () => {
                returnInput.min = departureInput.value;
                if (returnInput.value && returnInput.value < departureInput.value) {
                    returnInput.value = departureInput.value;
                }
            });
        }

        // Configurar listener para el porcentaje de anticipo
        const advanceInput = modal.querySelector('#advance-percentage');
        if (advanceInput) {
            advanceInput.addEventListener('input', () => this.updateSummary());
        }

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

    // Mostrar detalles de solicitud de viáticos
    showViaticosDetailModal(requestId) {
        const request = this.viaticosRequests.find(req => req.id === requestId);
        if (!request) {
            Utils.showToast('Solicitud no encontrada', 'error');
            return;
        }

        const modal = document.createElement('div');
        modal.className = 'modal show viaticos-detail-modal';
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 800px;">
                <div class="modal-header">
                    <h3><i class="fas fa-money-bill-wave"></i> Detalle de Solicitud de Viáticos</h3>
                    <button class="modal-close-btn" onclick="this.closest('.modal').remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    ${this.renderViaticosDetail(request)}
                </div>
                <div class="modal-footer">
                    ${request.status === 'pendiente' ? `
                        <button class="btn btn-success" onclick="viaticosSystem.approveViaticos('${request.id}'); this.closest('.modal').remove();">
                            <i class="fas fa-check"></i> Aprobar
                        </button>
                        <button class="btn btn-danger" onclick="viaticosSystem.rejectViaticos('${request.id}'); this.closest('.modal').remove();">
                            <i class="fas fa-times"></i> Rechazar
                        </button>
                    ` : ''}
                    <button class="btn btn-secondary" onclick="this.closest('.modal').remove()">
                        Cerrar
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
    }

    // Renderizar detalle de viáticos
    renderViaticosDetail(request) {
        return `
            <div class="viaticos-detail">
                <div class="detail-header">
                    <div class="detail-status">
                        <span class="status-badge status-${request.status}">
                            <i class="${this.getStatusIcon(request.status)}"></i>
                            ${this.getStatusLabel(request.status)}
                        </span>
                    </div>
                    <div class="detail-dates">
                        <p><strong>Solicitado:</strong> ${this.formatDate(request.requestDate)}</p>
                        ${request.approvedAt ? `<p><strong>Aprobado:</strong> ${this.formatDate(request.approvedAt)}</p>` : ''}
                    </div>
                </div>

                <div class="detail-sections">
                    <div class="detail-section">
                        <h4><i class="fas fa-ticket-alt"></i> Información del Ticket</h4>
                        <p><strong>ID:</strong> ${request.ticketId}</p>
                        <p><strong>Título:</strong> ${request.ticketTitle}</p>
                        <p><strong>Solicitante:</strong> ${request.requesterName}</p>
                    </div>

                    <div class="detail-section">
                        <h4><i class="fas fa-route"></i> Información del Viaje</h4>
                        <div class="trip-info">
                            <div class="trip-item">
                                <strong>Origen:</strong> ${request.origin}
                            </div>
                            <div class="trip-item">
                                <strong>Destino:</strong> ${request.destination}
                            </div>
                            <div class="trip-item">
                                <strong>Salida:</strong> ${this.formatDateTime(request.departureDate)}
                            </div>
                            <div class="trip-item">
                                <strong>Regreso:</strong> ${this.formatDateTime(request.returnDate)}
                            </div>
                        </div>
                        <div class="trip-purpose">
                            <strong>Propósito:</strong>
                            <p>${request.purpose}</p>
                        </div>
                        ${request.specialRequirements ? `
                            <div class="special-requirements">
                                <strong>Requerimientos Especiales:</strong>
                                <p>${request.specialRequirements}</p>
                            </div>
                        ` : ''}
                    </div>

                    <div class="detail-section">
                        <h4><i class="fas fa-receipt"></i> Rubros Solicitados</h4>
                        <div class="rubros-detail">
                            ${Object.entries(request.rubros).map(([rubroId, rubroData]) => `
                                <div class="rubro-detail-item">
                                    <div class="rubro-detail-header">
                                        <span class="rubro-name">${rubroData.name}</span>
                                        <span class="rubro-amount">$${this.formatCurrency(rubroData.amount)}</span>
                                    </div>
                                    ${rubroData.requiresReceipts ? `
                                        <div class="receipt-note">
                                            <i class="fas fa-receipt"></i>
                                            Requiere comprobantes
                                        </div>
                                    ` : ''}
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <div class="detail-section">
                        <h4><i class="fas fa-calculator"></i> Resumen Financiero</h4>
                        <div class="financial-summary">
                            <div class="summary-row">
                                <span class="summary-label">Total Solicitado:</span>
                                <span class="summary-amount total">$${this.formatCurrency(request.totalAmount)}</span>
                            </div>
                            <div class="summary-row">
                                <span class="summary-label">Anticipo (${request.advancePercentage}%):</span>
                                <span class="summary-amount advance">$${this.formatCurrency(request.advanceAmount)}</span>
                            </div>
                            <div class="summary-row">
                                <span class="summary-label">Saldo por Comprobar:</span>
                                <span class="summary-amount balance">$${this.formatCurrency(request.balanceAmount)}</span>
                            </div>
                        </div>
                    </div>

                    ${request.comments ? `
                        <div class="detail-section">
                            <h4><i class="fas fa-comments"></i> Comentarios</h4>
                            <div class="comments-content">
                                <p>${request.comments}</p>
                                ${request.approvedBy ? `<p><strong>Por:</strong> ${request.approvedBy}</p>` : ''}
                            </div>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    }

    // Aprobar viáticos
    approveViaticos(requestId) {
        const request = this.viaticosRequests.find(req => req.id === requestId);
        if (!request) return;

        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        
        request.status = 'aprobado';
        request.approvedBy = currentUser.name;
        request.approvedAt = new Date().toISOString();
        
        // Actualizar ticket
        DataManager.updateTicket(request.ticketId, {
            viaticos: {
                requested: true,
                requestId: request.id,
                approved: true,
                amount: request.totalAmount,
                description: request.purpose,
                approvedBy: currentUser.name,
                approvedAt: request.approvedAt
            }
        });

        localStorage.setItem('viaticosRequests', JSON.stringify(this.viaticosRequests));
        Utils.showToast('Solicitud de viáticos aprobada', 'success');
    }

    // Rechazar viáticos
    rejectViaticos(requestId) {
        const request = this.viaticosRequests.find(req => req.id === requestId);
        if (!request) return;

        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        const comments = prompt('Ingrese el motivo del rechazo:');
        
        if (comments === null) return; // Usuario canceló
        
        request.status = 'rechazado';
        request.approvedBy = currentUser.name;
        request.approvedAt = new Date().toISOString();
        request.comments = comments;
        
        // Actualizar ticket
        DataManager.updateTicket(request.ticketId, {
            viaticos: {
                requested: true,
                requestId: request.id,
                approved: false,
                amount: 0,
                description: request.purpose,
                approvedBy: currentUser.name,
                rejectedAt: request.approvedAt,
                rejectionReason: comments
            }
        });

        localStorage.setItem('viaticosRequests', JSON.stringify(this.viaticosRequests));
        Utils.showToast('Solicitud de viáticos rechazada', 'success');
    }

    // Métodos auxiliares
    generateRequestId() {
        return 'viaticos_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    getStatusIcon(status) {
        const icons = {
            'pendiente': 'fas fa-clock',
            'aprobado': 'fas fa-check',
            'rechazado': 'fas fa-times'
        };
        return icons[status] || 'fas fa-question';
    }

    getStatusLabel(status) {
        const labels = {
            'pendiente': 'Pendiente',
            'aprobado': 'Aprobado',
            'rechazado': 'Rechazado'
        };
        return labels[status] || status;
    }

    formatCurrency(amount) {
        return new Intl.NumberFormat('es-CL').format(amount);
    }

    formatDate(dateString) {
        return new Date(dateString).toLocaleDateString('es-ES');
    }

    formatDateTime(dateString) {
        return new Date(dateString).toLocaleString('es-ES');
    }

    // Obtener solicitudes de viáticos
    getViaticosRequests(filters = {}) {
        let requests = [...this.viaticosRequests];
        
        if (filters.status) {
            requests = requests.filter(req => req.status === filters.status);
        }
        
        if (filters.requesterId) {
            requests = requests.filter(req => req.requesterId === filters.requesterId);
        }
        
        return requests.sort((a, b) => new Date(b.requestDate) - new Date(a.requestDate));
    }
}

// Instancia global
window.viaticosSystem = new ViaticosSystem();


