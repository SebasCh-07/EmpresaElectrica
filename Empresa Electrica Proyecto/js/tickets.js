/* ========================================
   TICKETS - Plataforma TAT
   Funcionalidades específicas de tickets
   ======================================== */

// Extender la clase principal con métodos de tickets
Object.assign(PlataformaTAT.prototype, {
    
    loadTickets() {
        const tickets = getData('tickets', []);
        let filteredTickets = tickets;

        // Filtrar por rol
        if (this.currentUser.rol === 'Técnico') {
            filteredTickets = tickets.filter(t => t.tecnicoId === this.currentUser.id);
        } else if (this.currentUser.rol === 'Cliente') {
            filteredTickets = tickets.filter(t => t.clienteId === this.currentUser.id);
        }

        const tbody = document.getElementById('ticketsTableBody');
        tbody.innerHTML = '';
        
        filteredTickets.forEach(ticket => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>#${ticket.id}</td>
                <td>${ticket.cliente}</td>
                <td>${ticket.equipo}</td>
                <td><span class="badge badge-${ticket.tipo.toLowerCase()}">${ticket.tipo}</span></td>
                <td><span class="priority-${ticket.prioridad.toLowerCase()}">${ticket.prioridad}</span></td>
                <td><span class="status-badge status-${ticket.estado.toLowerCase().replace(' ', '')}">${ticket.estado}</span></td>
                <td>${ticket.tecnico}</td>
                <td>${ticket.fechaVisita || 'Sin programar'}</td>
                <td>
                    <button class="btn btn-primary btn-sm" onclick="app.viewTicket(${ticket.id})" title="Ver detalles">
                        <i class="fas fa-eye"></i>
                    </button>
                    ${this.canEditTicket(ticket) ? 
                        `<button class="btn btn-warning btn-sm" onclick="app.editTicket(${ticket.id})" title="Editar">
                            <i class="fas fa-edit"></i>
                        </button>` : ''
                    }
                    ${this.canCreateSolicitud(ticket) ? 
                        `<button class="btn btn-info btn-sm" onclick="app.createSolicitud(${ticket.id})" title="Crear solicitud">
                            <i class="fas fa-clipboard-list"></i>
                        </button>` : ''
                    }
                </td>
            `;
            tbody.appendChild(row);
        });
    },

    canEditTicket(ticket) {
        if (this.currentUser.rol === 'Administrador' || this.currentUser.rol === 'Mesa de Ayuda') {
            return true;
        }
        if (this.currentUser.rol === 'Técnico' && ticket.tecnicoId === this.currentUser.id) {
            return ticket.estado !== 'Cerrado';
        }
        return false;
    },

    canCreateSolicitud(ticket) {
        return this.currentUser.rol === 'Técnico' && 
               ticket.tecnicoId === this.currentUser.id && 
               ticket.estado !== 'Cerrado' &&
               !ticket.solicitudHerramientas;
    },

    viewTicket(ticketId) {
        const tickets = getData('tickets', []);
        const ticket = tickets.find(t => t.id === ticketId);
        
        if (!ticket) return;

        this.currentTicketId = ticketId;
        const content = document.getElementById('ticketDetailContent');
        
        content.innerHTML = `
            <div class="form-container">
                <div class="ticket-header">
                    <h3>Ticket #${ticket.id} - ${ticket.equipo}</h3>
                    <div class="ticket-status">
                        <span class="status-badge status-${ticket.estado.toLowerCase().replace(' ', '')}">${ticket.estado}</span>
                        <span class="priority-${ticket.prioridad.toLowerCase()}">${ticket.prioridad}</span>
                    </div>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label>Cliente:</label>
                        <input type="text" value="${ticket.cliente}" readonly>
                    </div>
                    <div class="form-group">
                        <label>Equipo:</label>
                        <input type="text" value="${ticket.equipo}" readonly>
                    </div>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label>Tipo de Caso:</label>
                        <input type="text" value="${ticket.tipo}" readonly>
                    </div>
                    <div class="form-group">
                        <label>Técnico Asignado:</label>
                        <input type="text" value="${ticket.tecnico}" readonly>
                    </div>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label>Fecha de Creación:</label>
                        <input type="text" value="${formatDate(ticket.fechaCreacion)}" readonly>
                    </div>
                    <div class="form-group">
                        <label>Fecha de Visita:</label>
                        <input type="text" value="${ticket.fechaVisita || 'Sin programar'}" readonly>
                    </div>
                </div>
                
                <div class="form-group">
                    <label>Descripción del Problema:</label>
                    <textarea readonly>${ticket.descripcion}</textarea>
                </div>
                
                <div class="form-group">
                    <label>Observaciones:</label>
                    <textarea readonly>${ticket.observaciones || 'Sin observaciones'}</textarea>
                </div>
                
                ${ticket.fases && ticket.fases.length > 0 ? this.renderFases(ticket.fases) : ''}
                
                ${ticket.evidencias && ticket.evidencias.length > 0 ? this.renderEvidencias(ticket.evidencias) : ''}
                
                ${ticket.solicitudHerramientas ? this.renderSolicitud(ticket.solicitudHerramientas, 'herramientas') : ''}
                
                ${ticket.solicitudViaticos ? this.renderSolicitud(ticket.solicitudViaticos, 'viaticos') : ''}
                
                <div class="form-actions">
                    ${this.canEditTicket(ticket) ? 
                        `<button class="btn btn-warning" onclick="app.editTicket(${ticketId})">
                            <i class="fas fa-edit"></i> Editar Ticket
                        </button>` : ''
                    }
                    ${this.canCreateSolicitud(ticket) ? 
                        `<button class="btn btn-info" onclick="app.createSolicitud(${ticketId})">
                            <i class="fas fa-clipboard-list"></i> Crear Solicitud
                        </button>` : ''
                    }
                    ${ticket.estado === 'Pre-cerrado' && this.currentUser.rol === 'Cliente' ? 
                        `<button class="btn btn-success" onclick="app.showEncuesta(${ticketId})">
                            <i class="fas fa-star"></i> Llenar Encuesta
                        </button>` : ''
                    }
                    ${ticket.informeGenerado ? 
                        `<button class="btn btn-primary" onclick="app.downloadInforme(${ticketId})">
                            <i class="fas fa-download"></i> Descargar Informe
                        </button>` : ''
                    }
                </div>
            </div>
        `;

        this.showSection('ticketDetail');
    },

    renderFases(fases) {
        return `
            <div class="form-group">
                <label>Fases de Mantenimiento:</label>
                <div class="phases-list">
                    ${fases.map(fase => `
                        <div class="phase-item ${fase.completada ? 'completed' : ''}">
                            <i class="fas fa-${fase.completada ? 'check-circle' : 'circle'}"></i>
                            <div class="phase-content">
                                <span class="phase-name">${fase.nombre}</span>
                                ${fase.fecha ? `<small class="phase-date">(${formatDate(fase.fecha)})</small>` : ''}
                                ${fase.observaciones ? `<p class="phase-observations">${fase.observaciones}</p>` : ''}
                                ${fase.valores && fase.valores.length > 0 ? this.renderValores(fase.valores) : ''}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    },

    renderValores(valores) {
        return `
            <div class="valores-table">
                <table class="table table-sm">
                    <thead>
                        <tr>
                            <th>Parámetro</th>
                            <th>Valor</th>
                            <th>Unidad</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${valores.map(valor => `
                            <tr>
                                <td>${valor.parametro}</td>
                                <td>${valor.valor}</td>
                                <td>${valor.unidad}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    },

    renderEvidencias(evidencias) {
        return `
            <div class="form-group">
                <label>Evidencias:</label>
                <div class="evidencias-list">
                    ${evidencias.map(evidencia => `
                        <div class="evidencia-item">
                            <i class="fas fa-image"></i>
                            <span>${evidencia}</span>
                            <button class="btn btn-sm btn-outline" onclick="app.viewEvidencia('${evidencia}')">
                                <i class="fas fa-eye"></i>
                            </button>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    },

    renderSolicitud(solicitud, tipo) {
        const tipoTexto = tipo === 'herramientas' ? 'Herramientas' : 'Viáticos';
        return `
            <div class="form-group">
                <label>Solicitud de ${tipoTexto}:</label>
                <div class="solicitud-info">
                    <p><strong>Estado:</strong> ${solicitud.estado}</p>
                    ${tipo === 'viaticos' ? `
                        <p><strong>Destino:</strong> ${solicitud.destino}</p>
                        <p><strong>Técnicos:</strong> ${solicitud.cantidadTecnicos}</p>
                        <p><strong>Total:</strong> ${formatCurrency(solicitud.total)}</p>
                    ` : ''}
                    <p><strong>Fecha Solicitud:</strong> ${formatDate(solicitud.fechaSolicitud)}</p>
                </div>
            </div>
        `;
    },

    editTicket(ticketId) {
        const tickets = getData('tickets', []);
        const ticket = tickets.find(t => t.id === ticketId);
        
        if (!ticket) return;

        this.currentTicketId = ticketId;
        const content = document.getElementById('formularioTecnicoContent');
        
        content.innerHTML = `
            <div class="form-container">
                <h3>Formulario Técnico - Ticket #${ticket.id}</h3>
                
                <div class="form-row">
                    <div class="form-group">
                        <label>Cliente:</label>
                        <input type="text" value="${ticket.cliente}" readonly>
                    </div>
                    <div class="form-group">
                        <label>Equipo:</label>
                        <input type="text" value="${ticket.equipo}" readonly>
                    </div>
                </div>
                
                <div class="form-group">
                    <label>Fases de Mantenimiento:</label>
                    <div class="phases-form" id="phasesForm">
                        ${this.renderFasesForm(ticket)}
                    </div>
                </div>
                
                <div class="form-group">
                    <label>Observaciones:</label>
                    <textarea id="observaciones" placeholder="Ingrese observaciones del trabajo realizado...">${ticket.observaciones || ''}</textarea>
                </div>
                
                <div class="form-group">
                    <label>Evidencias (Imágenes):</label>
                    <input type="file" id="evidencias" multiple accept="image/*" onchange="app.handleFileUpload(this)">
                    <div id="evidenciasPreview" class="evidencias-preview">
                        ${ticket.evidencias ? ticket.evidencias.map(evidencia => `
                            <div class="evidencia-preview">
                                <i class="fas fa-image"></i>
                                <span>${evidencia}</span>
                                <button type="button" onclick="app.removeEvidencia('${evidencia}')">
                                    <i class="fas fa-times"></i>
                                </button>
                            </div>
                        `).join('') : ''}
                    </div>
                </div>
                
                <div class="form-group">
                    <label>Cambiar Estado:</label>
                    <select id="nuevoEstado">
                        <option value="Abierto" ${ticket.estado === 'Abierto' ? 'selected' : ''}>Abierto</option>
                        <option value="En Proceso" ${ticket.estado === 'En Proceso' ? 'selected' : ''}>En Proceso</option>
                        <option value="Pre-cerrado" ${ticket.estado === 'Pre-cerrado' ? 'selected' : ''}>Pre-cerrado</option>
                        <option value="Cerrado" ${ticket.estado === 'Cerrado' ? 'selected' : ''}>Cerrado</option>
                    </select>
                </div>
                
                <div class="form-actions">
                    <button class="btn btn-primary" onclick="app.saveTicketForm()">
                        <i class="fas fa-save"></i> Guardar Cambios
                    </button>
                    <button class="btn btn-secondary" onclick="app.showSection('tickets')">
                        <i class="fas fa-arrow-left"></i> Volver
                    </button>
                </div>
            </div>
        `;

        this.showSection('formularioTecnico');
    },

    renderFasesForm(ticket) {
        const fases = getData('fasesMantenimiento', []);
        
        return fases.map(fase => {
            const ticketFase = ticket.fases ? ticket.fases.find(f => f.id === fase.id) : null;
            return `
                <div class="phase-form-item">
                    <label>
                        <input type="checkbox" ${ticketFase && ticketFase.completada ? 'checked' : ''} 
                               onchange="app.toggleFase(${ticket.id}, ${fase.id}, this.checked)">
                        ${fase.nombre}
                    </label>
                    <small>${fase.descripcion}</small>
                    ${ticketFase && ticketFase.completada ? `
                        <div class="phase-details">
                            <textarea placeholder="Observaciones de esta fase..." 
                                      onchange="app.updateFaseObservations(${ticket.id}, ${fase.id}, this.value)">${ticketFase.observaciones || ''}</textarea>
                            <button type="button" class="btn btn-sm btn-outline" onclick="app.addValores(${ticket.id}, ${fase.id})">
                                <i class="fas fa-plus"></i> Agregar Valores
                            </button>
                        </div>
                    ` : ''}
                </div>
            `;
        }).join('');
    },

    toggleFase(ticketId, faseId, completada) {
        const tickets = getData('tickets', []);
        const ticket = tickets.find(t => t.id === ticketId);
        
        if (!ticket) return;
        
        if (!ticket.fases) ticket.fases = [];
        
        let fase = ticket.fases.find(f => f.id === faseId);
        if (!fase) {
            fase = {
                id: faseId,
                nombre: this.getFaseName(faseId),
                completada: false,
                fecha: null,
                observaciones: '',
                evidencias: [],
                valores: []
            };
            ticket.fases.push(fase);
        }
        
        fase.completada = completada;
        if (completada) {
            fase.fecha = new Date().toISOString().split('T')[0];
        }
        
        saveData('tickets', tickets);
        this.showAlert(`Fase ${completada ? 'completada' : 'desmarcada'}`, 'success');
    },

    getFaseName(faseId) {
        const fases = getData('fasesMantenimiento', []);
        const fase = fases.find(f => f.id === faseId);
        return fase ? fase.nombre : 'Fase desconocida';
    },

    handleFileUpload(input) {
        const files = Array.from(input.files);
        const evidenciasPreview = document.getElementById('evidenciasPreview');
        
        files.forEach(file => {
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const evidenciaDiv = document.createElement('div');
                    evidenciaDiv.className = 'evidencia-preview';
                    evidenciaDiv.innerHTML = `
                        <i class="fas fa-image"></i>
                        <span>${file.name}</span>
                        <button type="button" onclick="this.parentElement.remove()">
                            <i class="fas fa-times"></i>
                        </button>
                    `;
                    evidenciasPreview.appendChild(evidenciaDiv);
                };
                reader.readAsDataURL(file);
            }
        });
    },

    saveTicketForm() {
        const tickets = getData('tickets', []);
        const ticket = tickets.find(t => t.id === this.currentTicketId);
        
        if (!ticket) return;
        
        const observaciones = document.getElementById('observaciones').value;
        const nuevoEstado = document.getElementById('nuevoEstado').value;
        
        ticket.observaciones = observaciones;
        ticket.estado = nuevoEstado;
        
        if (nuevoEstado === 'Pre-cerrado') {
            // Notificar al cliente para que llene la encuesta
            createNotification(ticket.clienteId, 'Ticket Pre-cerrado', 
                `El ticket #${ticket.id} ha sido marcado como pre-cerrado. Por favor complete la encuesta de satisfacción.`, 
                'encuesta', 'alta');
        }
        
        if (nuevoEstado === 'Cerrado') {
            ticket.informeGenerado = true;
            // Generar informe PDF
            this.generateTicketInforme(ticket);
        }
        
        saveData('tickets', tickets);
        this.showAlert('Formulario guardado exitosamente', 'success');
        this.showSection('tickets');
    },

    generateTicketInforme(ticket) {
        // Simular generación de informe PDF
        const informe = {
            id: generateId(),
            nombre: `Informe Técnico - Ticket #${ticket.id} - ${ticket.equipo}`,
            tipo: 'Técnico',
            clienteId: ticket.clienteId,
            cliente: ticket.cliente,
            ticketId: ticket.id,
            fechaGeneracion: new Date().toISOString().split('T')[0],
            estado: 'Completado',
            archivo: `informe_ticket_${ticket.id}_${Date.now()}.pdf`,
            tamaño: '2.5 MB'
        };
        
        const reportes = getData('reportes', []);
        reportes.push(informe);
        saveData('reportes', reportes);
        
        this.showAlert('Informe PDF generado exitosamente', 'success');
    },

    showAddTicketModal() {
        const clientes = getData('clientes', []);
        const equipos = getData('equipos', []);
        
        // Si es cliente, solo mostrar sus equipos
        let clientesOptions = '';
        if (this.currentUser.rol === 'Cliente') {
            clientesOptions = `<option value="${this.currentUser.id}" selected>${this.currentUser.nombre}</option>`;
        } else {
            clientesOptions = `
                <option value="">Seleccione un cliente</option>
                ${clientes.map(cliente => `
                    <option value="${cliente.id}">${cliente.nombre}</option>
                `).join('')}
            `;
        }
        
        // Si es cliente, no mostrar fecha de visita (la gestiona la mesa)
        const fechaVisitaField = this.currentUser.rol === 'Cliente' ? '' : `
            <div class="form-group">
                <label>Fecha de Visita:</label>
                <input type="date" id="nuevoTicketFechaVisita" required>
            </div>
        `;
        
        this.showModal(
            'Nuevo Ticket',
            `
                <div class="form-group">
                    <label>Cliente:</label>
                    <select id="nuevoTicketCliente" required ${this.currentUser.rol === 'Cliente' ? 'disabled' : ''}>
                        ${clientesOptions}
                    </select>
                </div>
                <div class="form-group">
                    <label>Equipo:</label>
                    <select id="nuevoTicketEquipo" required>
                        <option value="">Seleccione un equipo</option>
                    </select>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Tipo de Caso:</label>
                        <select id="nuevoTicketTipo" required>
                            <option value="">Seleccione tipo</option>
                            <option value="Soporte">Soporte</option>
                            <option value="Inspección">Inspección</option>
                            <option value="Responsabilidad">Responsabilidad</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Prioridad:</label>
                        <select id="nuevoTicketPrioridad" required>
                            <option value="">Seleccione prioridad</option>
                            <option value="Alta">Alta</option>
                            <option value="Media">Media</option>
                            <option value="Baja">Baja</option>
                        </select>
                    </div>
                </div>
                ${fechaVisitaField}
                <div class="form-group">
                    <label>Descripción del Problema:</label>
                    <textarea id="nuevoTicketDescripcion" placeholder="Describa el problema..." required></textarea>
                </div>
            `,
            `
                <button class="btn btn-primary" onclick="app.addTicket()">Crear Ticket</button>
                <button class="btn btn-secondary" onclick="app.closeModal()">Cancelar</button>
            `
        );
        
        // Cargar equipos cuando se seleccione cliente
        const cargarEquipos = (clienteId) => {
            const equiposSelect = document.getElementById('nuevoTicketEquipo');
            const equiposDelCliente = equipos.filter(eq => eq.clienteId == clienteId);
            
            equiposSelect.innerHTML = '<option value="">Seleccione un equipo</option>';
            equiposDelCliente.forEach(equipo => {
                const option = document.createElement('option');
                option.value = equipo.id;
                option.textContent = equipo.equipo;
                equiposSelect.appendChild(option);
            });
        };
        
        // Si es cliente, cargar sus equipos inmediatamente
        if (this.currentUser.rol === 'Cliente') {
            cargarEquipos(this.currentUser.id);
        } else {
            // Si no es cliente, cargar equipos cuando se seleccione cliente
            document.getElementById('nuevoTicketCliente').addEventListener('change', (e) => {
                cargarEquipos(e.target.value);
            });
        }
    },

    addTicket() {
        const clienteId = document.getElementById('nuevoTicketCliente').value;
        const equipoId = document.getElementById('nuevoTicketEquipo').value;
        const tipo = document.getElementById('nuevoTicketTipo').value;
        const prioridad = document.getElementById('nuevoTicketPrioridad').value;
        const fechaVisita = document.getElementById('nuevoTicketFechaVisita') ? document.getElementById('nuevoTicketFechaVisita').value : null;
        const descripcion = document.getElementById('nuevoTicketDescripcion').value;
        
        // Validar campos requeridos
        if (!clienteId || !equipoId || !tipo || !prioridad || !descripcion) {
            this.showAlert('Por favor complete todos los campos', 'error');
            return;
        }
        
        // Si no es cliente, la fecha de visita es requerida
        if (this.currentUser.rol !== 'Cliente' && !fechaVisita) {
            this.showAlert('Por favor seleccione una fecha de visita', 'error');
            return;
        }
        
        const clientes = getData('clientes', []);
        const equipos = getData('equipos', []);
        const tickets = getData('tickets', []);
        
        const cliente = clientes.find(c => c.id == clienteId);
        const equipo = equipos.find(e => e.id == equipoId);
        
        if (!cliente || !equipo) {
            this.showAlert('Error: Cliente o equipo no encontrado', 'error');
            return;
        }
        
        const nuevoTicket = {
            id: tickets.length > 0 ? Math.max(...tickets.map(t => t.id)) + 1 : 1,
            clienteId: parseInt(clienteId),
            cliente: cliente.nombre,
            equipoId: parseInt(equipoId),
            equipo: equipo.equipo,
            tipo,
            prioridad,
            estado: 'Abierto',
            tecnicoId: null,
            tecnico: 'Sin asignar',
            fechaCreacion: new Date().toISOString().split('T')[0],
            fechaAsignacion: null,
            fechaVisita: fechaVisita || null, // Si es cliente, la fecha será asignada por la mesa
            descripcion,
            observaciones: '',
            fases: [],
            evidencias: [],
            solicitudHerramientas: null,
            solicitudViaticos: null,
            encuestaCompletada: false,
            informeGenerado: false,
            tiempoEstimado: this.getTiempoEstimado(tipo),
            costoEstimado: this.getCostoEstimado(tipo, prioridad)
        };
        
        tickets.push(nuevoTicket);
        saveData('tickets', tickets);
        
        // Notificar a mesa de ayuda
        createNotification(2, 'Nuevo Ticket Creado', 
            `Se ha creado el ticket #${nuevoTicket.id} - ${nuevoTicket.equipo} por ${cliente.nombre}`, 
            'nuevo_ticket', 'alta');
        
        this.closeModal();
        this.loadTickets();
        this.showAlert('Ticket creado exitosamente', 'success');
    },

    getTiempoEstimado(tipo) {
        const tiempos = {
            'Soporte': '4 horas',
            'Inspección': '2 horas',
            'Responsabilidad': '3 horas'
        };
        return tiempos[tipo] || '3 horas';
    },

    getCostoEstimado(tipo, prioridad) {
        const costosBase = {
            'Soporte': 200,
            'Inspección': 150,
            'Responsabilidad': 120
        };
        
        const multiplicadores = {
            'Alta': 1.5,
            'Media': 1.0,
            'Baja': 0.8
        };
        
        const costoBase = costosBase[tipo] || 150;
        const multiplicador = multiplicadores[prioridad] || 1.0;
        
        return Math.round(costoBase * multiplicador);
    },

    filterTickets() {
        const estado = document.getElementById('estadoFilter').value;
        const prioridad = document.getElementById('prioridadFilter').value;
        const tipo = document.getElementById('tipoFilter').value;
        
        const tickets = getData('tickets', []);
        let filteredTickets = tickets;
        
        // Aplicar filtros
        if (estado) {
            filteredTickets = filteredTickets.filter(t => t.estado === estado);
        }
        if (prioridad) {
            filteredTickets = filteredTickets.filter(t => t.prioridad === prioridad);
        }
        if (tipo) {
            filteredTickets = filteredTickets.filter(t => t.tipo === tipo);
        }
        
        // Filtrar por rol
        if (this.currentUser.rol === 'Técnico') {
            filteredTickets = filteredTickets.filter(t => t.tecnicoId === this.currentUser.id);
        } else if (this.currentUser.rol === 'Cliente') {
            filteredTickets = filteredTickets.filter(t => t.clienteId === this.currentUser.id);
        }
        
        // Actualizar tabla
        const tbody = document.getElementById('ticketsTableBody');
        tbody.innerHTML = '';
        
        filteredTickets.forEach(ticket => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>#${ticket.id}</td>
                <td>${ticket.cliente}</td>
                <td>${ticket.equipo}</td>
                <td><span class="badge badge-${ticket.tipo.toLowerCase()}">${ticket.tipo}</span></td>
                <td><span class="priority-${ticket.prioridad.toLowerCase()}">${ticket.prioridad}</span></td>
                <td><span class="status-badge status-${ticket.estado.toLowerCase().replace(' ', '')}">${ticket.estado}</span></td>
                <td>${ticket.tecnico}</td>
                <td>${ticket.fechaVisita || 'Sin programar'}</td>
                <td>
                    <button class="btn btn-primary btn-sm" onclick="app.viewTicket(${ticket.id})" title="Ver detalles">
                        <i class="fas fa-eye"></i>
                    </button>
                    ${this.canEditTicket(ticket) ? 
                        `<button class="btn btn-warning btn-sm" onclick="app.editTicket(${ticket.id})" title="Editar">
                            <i class="fas fa-edit"></i>
                        </button>` : ''
                    }
                </td>
            `;
            tbody.appendChild(row);
        });
        
        this.showAlert(`Mostrando ${filteredTickets.length} tickets`, 'info');
    },

    clearFilters() {
        document.getElementById('estadoFilter').value = '';
        document.getElementById('prioridadFilter').value = '';
        document.getElementById('tipoFilter').value = '';
        this.loadTickets();
        this.showAlert('Filtros limpiados', 'info');
    },

    exportTickets() {
        const tickets = getData('tickets', []);
        const filename = `tickets_${new Date().toISOString().split('T')[0]}.csv`;
        exportToCSV(tickets, filename);
        this.showAlert('Tickets exportados exitosamente', 'success');
    },

    printTicket() {
        window.print();
    }
});

// Funciones auxiliares globales
function viewEvidencia(filename) {
    app.showAlert(`Visualizando evidencia: ${filename}`, 'info');
}

function removeEvidencia(filename) {
    app.showAlert(`Eliminando evidencia: ${filename}`, 'info');
}

function downloadInforme(ticketId) {
    app.showAlert(`Descargando informe del ticket #${ticketId}`, 'info');
}
