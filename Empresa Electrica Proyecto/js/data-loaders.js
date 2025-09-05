// Funcionalidades de carga de datos para la Plataforma TAT

// Extender la clase principal con métodos de carga de datos
Object.assign(PlataformaTAT.prototype, {
    
    loadTickets() {
        const tickets = getData('tickets', []);
        let filteredTickets = tickets;

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

    loadClientes() {
        const clientes = getData('clientes', []);
        const tbody = document.getElementById('clientesTableBody');
        
        tbody.innerHTML = '';
        clientes.forEach(cliente => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${cliente.id}</td>
                <td>${cliente.nombre}</td>
                <td>${cliente.contacto}</td>
                <td>${cliente.email}</td>
                <td>${cliente.telefono}</td>
                <td><span class="status-badge status-${cliente.estado.toLowerCase()}">${cliente.estado}</span></td>
                <td>
                    <button class="btn btn-primary btn-sm" onclick="app.editCliente(${cliente.id})" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-danger btn-sm" onclick="app.deleteCliente(${cliente.id})" title="Eliminar">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });
    },

    loadEquipos() {
        const equipos = getData('equipos', []);
        const tbody = document.getElementById('equiposTableBody');
        
        tbody.innerHTML = '';
        equipos.forEach(equipo => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${equipo.id}</td>
                <td>${equipo.cliente}</td>
                <td>${equipo.equipo}</td>
                <td>${equipo.modelo}</td>
                <td>${equipo.serie}</td>
                <td>${equipo.ubicacion}</td>
                <td><span class="status-badge status-${equipo.estado.toLowerCase().replace(' ', '')}">${equipo.estado}</span></td>
                <td>
                    <button class="btn btn-primary btn-sm" onclick="app.editEquipo(${equipo.id})" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-danger btn-sm" onclick="app.deleteEquipo(${equipo.id})" title="Eliminar">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });
    },

    loadTecnicos() {
        const tecnicos = getData('tecnicos', []);
        const tbody = document.getElementById('tecnicosTableBody');
        
        tbody.innerHTML = '';
        tecnicos.forEach(tecnico => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${tecnico.id}</td>
                <td>${tecnico.nombre}</td>
                <td>${tecnico.especialidad}</td>
                <td><span class="badge badge-${tecnico.tipo.toLowerCase()}">${tecnico.tipo}</span></td>
                <td><span class="status-badge status-${tecnico.estado.toLowerCase().replace(' ', '')}">${tecnico.estado}</span></td>
                <td>${tecnico.coordenadas ? `${tecnico.coordenadas.lat.toFixed(4)}, ${tecnico.coordenadas.lng.toFixed(4)}` : 'N/A'}</td>
                <td>
                    <button class="btn btn-primary btn-sm" onclick="app.editTecnico(${tecnico.id})" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-danger btn-sm" onclick="app.deleteTecnico(${tecnico.id})" title="Eliminar">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });
    },

    loadHerramientas() {
        const herramientas = getData('herramientas', []);
        const tbody = document.getElementById('herramientasTableBody');
        
        tbody.innerHTML = '';
        herramientas.forEach(herramienta => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${herramienta.id}</td>
                <td>${herramienta.nombre}</td>
                <td>${herramienta.categoria}</td>
                <td><span class="status-badge status-${herramienta.estado.toLowerCase().replace(' ', '')}">${herramienta.estado}</span></td>
                <td><span class="badge badge-${herramienta.disponible ? 'success' : 'warning'}">${herramienta.disponible ? 'Sí' : 'No'}</span></td>
                <td>
                    <button class="btn btn-primary btn-sm" onclick="app.editHerramienta(${herramienta.id})" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-danger btn-sm" onclick="app.deleteHerramienta(${herramienta.id})" title="Eliminar">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });
    },

    loadDestinos() {
        const destinos = getData('destinos', []);
        const tbody = document.getElementById('destinosTableBody');
        
        tbody.innerHTML = '';
        destinos.forEach(destino => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${destino.id}</td>
                <td>${destino.destino}</td>
                <td>${destino.provincia}</td>
                <td>${formatCurrency(destino.tarifaBase)}</td>
                <td>${formatCurrency(destino.tarifaPorTecnico)}</td>
                <td><span class="status-badge status-${destino.estado.toLowerCase()}">${destino.estado}</span></td>
                <td>
                    <button class="btn btn-primary btn-sm" onclick="app.editDestino(${destino.id})" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-danger btn-sm" onclick="app.deleteDestino(${destino.id})" title="Eliminar">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });
    },

    loadSolicitudes() {
        const solicitudes = getData('solicitudes', []);
        let filteredSolicitudes = solicitudes;

        if (this.currentUser.rol === 'Técnico') {
            filteredSolicitudes = solicitudes.filter(s => s.tecnicoId === this.currentUser.id);
        }

        const tbody = document.getElementById('solicitudesTableBody');
        tbody.innerHTML = '';
        
        filteredSolicitudes.forEach(solicitud => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${solicitud.id}</td>
                <td>#${solicitud.ticketId}</td>
                <td>${solicitud.tecnico}</td>
                <td>${solicitud.herramientas.length} herramientas</td>
                <td>${solicitud.viaticos ? formatCurrency(solicitud.viaticos.total) : 'N/A'}</td>
                <td><span class="status-badge status-${solicitud.estado.toLowerCase()}">${solicitud.estado}</span></td>
                <td>${formatDate(solicitud.fechaSolicitud)}</td>
                <td>
                    <button class="btn btn-primary btn-sm" onclick="app.viewSolicitud(${solicitud.id})" title="Ver detalles">
                        <i class="fas fa-eye"></i>
                    </button>
                    ${solicitud.estado === 'Pendiente' && this.currentUser.rol !== 'Técnico' ? 
                        `<button class="btn btn-success btn-sm" onclick="app.approveSolicitud(${solicitud.id})" title="Aprobar">
                            <i class="fas fa-check"></i>
                        </button>` : ''
                    }
                </td>
            `;
            tbody.appendChild(row);
        });
    },

    loadGeolocalizacion() {
        const tecnicos = getData('tecnicos', []);
        const mapContainer = document.querySelector('.tecnicos-map');
        
        mapContainer.innerHTML = `
            <div class="map-placeholder">
                <h3>Ubicación de Técnicos en Tiempo Real</h3>
                <div class="tecnicos-map">
                    ${tecnicos.map(tecnico => `
                        <div class="tecnico-marker" style="left: ${Math.random() * 80 + 10}%; top: ${Math.random() * 80 + 10}%;">
                            <div class="marker-icon ${tecnico.estado.toLowerCase().replace(' ', '-')}">
                                <i class="fas fa-user"></i>
                            </div>
                            <div class="marker-info">
                                <strong>${tecnico.nombre}</strong>
                                <br>${tecnico.especialidad}
                                <br><small>${tecnico.estado}</small>
                                <br><small>Última actualización: ${tecnico.ultimaActualizacion}</small>
                            </div>
                        </div>
                    `).join('')}
                </div>
                <p><em>Mapa simulado - En producción se integraría con Google Maps o Leaflet</em></p>
                <div class="map-legend">
                    <div class="legend-item">
                        <span class="legend-color disponible"></span>
                        <span>Disponible</span>
                    </div>
                    <div class="legend-item">
                        <span class="legend-color en-campo"></span>
                        <span>En Campo</span>
                    </div>
                    <div class="legend-item">
                        <span class="legend-color en-oficina"></span>
                        <span>En Oficina</span>
                    </div>
                </div>
            </div>
        `;
    },

    loadEncuesta() {
        const tickets = getData('tickets', []);
        const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
        const ticketsPreCerrados = tickets.filter(t => t.estado === 'Pre-cerrado' && t.clienteId === currentUser.id);
        
        const content = document.getElementById('encuestaContent');
        
        if (ticketsPreCerrados.length === 0) {
            content.innerHTML = `
                <div class="form-container">
                    <div class="text-center">
                        <i class="fas fa-star" style="font-size: 4rem; color: #ffc107; margin-bottom: 1rem;"></i>
                        <h3>No hay tickets pendientes de encuesta</h3>
                        <p>Actualmente no tienes tickets en estado pre-cerrado que requieran encuesta de satisfacción.</p>
                        <button class="btn btn-primary" onclick="app.showSection('tickets')">
                            <i class="fas fa-arrow-left"></i> Ver Mis Tickets
                        </button>
                    </div>
                </div>
            `;
            return;
        }
        
        content.innerHTML = `
            <div class="form-container">
                <h3>Encuestas de Satisfacción Pendientes</h3>
                <div class="tickets-list">
                    ${ticketsPreCerrados.map(ticket => `
                        <div class="ticket-card">
                            <div class="ticket-header">
                                <h4>Ticket #${ticket.id} - ${ticket.equipo}</h4>
                                <span class="priority-${ticket.prioridad.toLowerCase()}">${ticket.prioridad}</span>
                            </div>
                            <div class="ticket-info">
                                <p><strong>Cliente:</strong> ${ticket.cliente}</p>
                                <p><strong>Técnico:</strong> ${ticket.tecnico}</p>
                                <p><strong>Fecha de Visita:</strong> ${ticket.fechaVisita}</p>
                            </div>
                            <div class="ticket-actions">
                                <button class="btn btn-success" onclick="app.showEncuesta(${ticket.id})">
                                    <i class="fas fa-star"></i> Llenar Encuesta
                                </button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    },

    loadReportes() {
        const reportes = getData('reportes', []);
        const tbody = document.getElementById('reportesTableBody');
        
        tbody.innerHTML = '';
        reportes.forEach(reporte => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${reporte.id}</td>
                <td>${reporte.nombre}</td>
                <td><span class="badge badge-${reporte.tipo.toLowerCase()}">${reporte.tipo}</span></td>
                <td>${reporte.cliente || 'Todos'}</td>
                <td>${formatDate(reporte.fechaGeneracion)}</td>
                <td><span class="status-badge status-${reporte.estado.toLowerCase().replace(' ', '')}">${reporte.estado}</span></td>
                <td>
                    ${reporte.archivo ? 
                        `<button class="btn btn-primary btn-sm" onclick="app.downloadReport('${reporte.archivo}')" title="Descargar">
                            <i class="fas fa-download"></i>
                        </button>` : 
                        '<span class="text-muted">En proceso...</span>'
                    }
                </td>
            `;
            tbody.appendChild(row);
        });
    },

    loadConfiguracion() {
        const content = document.getElementById('configContent');
        const usuarios = getData('usuarios', []);
        const fases = getData('fasesMantenimiento', []);
        const parametros = getData('parametrosEncuesta', { preguntas: [] });
        const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');

        if (currentUser.rol !== 'Administrador') {
            content.innerHTML = `
                <div class="alert alert-warning">
                    <i class="fas fa-exclamation-triangle"></i>
                    <strong>Acceso Restringido</strong><br>
                    Solo los administradores pueden acceder a esta sección.
                </div>
            `;
            return;
        }

        content.innerHTML = `
            <div id="usuariosTab" class="config-tab active">
                <h3>Gestión de Usuarios y Roles</h3>
                <div class="table-container">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Usuario</th>
                                <th>Nombre</th>
                                <th>Rol</th>
                                <th>Email</th>
                                <th>Último Acceso</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${usuarios.map(user => `
                                <tr>
                                    <td>${user.id}</td>
                                    <td>${user.username}</td>
                                    <td>${user.nombre}</td>
                                    <td><span class="badge badge-${user.rol.toLowerCase().replace(' ', '')}">${user.rol}</span></td>
                                    <td>${user.email}</td>
                                    <td>${user.ultimoAcceso || 'N/A'}</td>
                                    <td>
                                        <button class="btn btn-primary btn-sm" onclick="app.editUser(${user.id})" title="Editar">
                                            <i class="fas fa-edit"></i>
                                        </button>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
            <div id="fasesTab" class="config-tab">
                <h3>Fases de Mantenimiento</h3>
                <div class="table-container">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nombre</th>
                                <th>Descripción</th>
                                <th>Orden</th>
                                <th>Obligatoria</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${fases.map(fase => `
                                <tr>
                                    <td>${fase.id}</td>
                                    <td>${fase.nombre}</td>
                                    <td>${fase.descripcion}</td>
                                    <td>${fase.orden}</td>
                                    <td><span class="badge badge-${fase.obligatoria ? 'success' : 'warning'}">${fase.obligatoria ? 'Sí' : 'No'}</span></td>
                                    <td>
                                        <button class="btn btn-primary btn-sm" onclick="app.editFase(${fase.id})" title="Editar">
                                            <i class="fas fa-edit"></i>
                                        </button>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
            <div id="parametrosTab" class="config-tab">
                <h3>Parámetros de Encuesta de Satisfacción</h3>
                <div class="form-container">
                    ${parametros.preguntas.map((pregunta, index) => `
                        <div class="form-group">
                            <label>Pregunta ${index + 1}:</label>
                            <input type="text" value="${pregunta.texto}" readonly>
                            <div class="pregunta-details">
                                <small><strong>Tipo:</strong> ${pregunta.tipo} | <strong>Obligatoria:</strong> ${pregunta.obligatoria ? 'Sí' : 'No'}</small>
                                ${pregunta.escala ? `<small> | <strong>Escala:</strong> ${pregunta.escala}</small>` : ''}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
            <div id="notificacionesTab" class="config-tab">
                <h3>Configuración de Notificaciones</h3>
                <div class="form-container">
                    <div class="form-group">
                        <label>
                            <input type="checkbox" checked> Notificaciones por Email
                        </label>
                    </div>
                    <div class="form-group">
                        <label>
                            <input type="checkbox" checked> Notificaciones Push
                        </label>
                    </div>
                    <div class="form-group">
                        <label>
                            <input type="checkbox" checked> Notificaciones de Tickets
                        </label>
                    </div>
                    <div class="form-group">
                        <label>
                            <input type="checkbox" checked> Notificaciones de Solicitudes
                        </label>
                    </div>
                </div>
            </div>
        `;

        // Configurar pestañas
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tabName = e.target.dataset.tab;
                this.switchConfigTab(tabName);
            });
        });
    },

    switchConfigTab(tabName) {
        // Ocultar todas las pestañas
        document.querySelectorAll('.config-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        
        // Desactivar todos los botones
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Mostrar la pestaña seleccionada
        const tabElement = document.getElementById(tabName + 'Tab');
        const btnElement = document.querySelector(`[data-tab="${tabName}"]`);
        
        if (tabElement) tabElement.classList.add('active');
        if (btnElement) btnElement.classList.add('active');
    },

});

// Funciones auxiliares para acciones
function editCliente(id) {
    app.showAlert(`Editando cliente ${id}`, 'info');
}

function deleteCliente(id) {
    if (confirm('¿Está seguro de eliminar este cliente?')) {
        app.showAlert(`Cliente ${id} eliminado`, 'success');
    }
}

function editEquipo(id) {
    app.showAlert(`Editando equipo ${id}`, 'info');
}

function deleteEquipo(id) {
    if (confirm('¿Está seguro de eliminar este equipo?')) {
        app.showAlert(`Equipo ${id} eliminado`, 'success');
    }
}

function editTecnico(id) {
    app.showAlert(`Editando técnico ${id}`, 'info');
}

function deleteTecnico(id) {
    if (confirm('¿Está seguro de eliminar este técnico?')) {
        app.showAlert(`Técnico ${id} eliminado`, 'success');
    }
}

function editHerramienta(id) {
    app.showAlert(`Editando herramienta ${id}`, 'info');
}

function deleteHerramienta(id) {
    if (confirm('¿Está seguro de eliminar esta herramienta?')) {
        app.showAlert(`Herramienta ${id} eliminada`, 'success');
    }
}

function editDestino(id) {
    app.showAlert(`Editando destino ${id}`, 'info');
}

function deleteDestino(id) {
    if (confirm('¿Está seguro de eliminar este destino?')) {
        app.showAlert(`Destino ${id} eliminado`, 'success');
    }
}

function viewSolicitud(id) {
    app.showAlert(`Viendo solicitud ${id}`, 'info');
}

function approveSolicitud(id) {
    if (confirm('¿Aprobar esta solicitud?')) {
        app.showAlert(`Solicitud ${id} aprobada`, 'success');
    }
}

function downloadReport(filename) {
    app.showAlert(`Descargando ${filename}`, 'info');
}

function editUser(id) {
    app.showAlert(`Editando usuario ${id}`, 'info');
}

function editFase(id) {
    app.showAlert(`Editando fase ${id}`, 'info');
}
