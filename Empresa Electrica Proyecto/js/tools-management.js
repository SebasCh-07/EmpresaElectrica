// Sistema de gestión de herramientas

class ToolsManager {
    constructor() {
        this.tools = JSON.parse(localStorage.getItem('tools') || '[]');
        this.toolRequests = JSON.parse(localStorage.getItem('toolRequests') || '[]');
        this.initDefaultTools();
    }

    // Inicializar herramientas por defecto
    initDefaultTools() {
        if (this.tools.length === 0) {
            const defaultTools = [
                {
                    id: 'tool_001',
                    name: 'Multímetro Digital',
                    category: 'Medición',
                    description: 'Multímetro digital para medición de voltaje, corriente y resistencia',
                    serialNumber: 'MDG-2024-001',
                    status: 'disponible',
                    location: 'Almacén Principal',
                    condition: 'bueno',
                    lastMaintenance: '2024-01-15',
                    nextMaintenance: '2024-07-15',
                    image: 'multimetro.jpg',
                    createdAt: new Date().toISOString()
                },
                {
                    id: 'tool_002',
                    name: 'Taladro Industrial',
                    category: 'Perforación',
                    description: 'Taladro industrial de alta potencia para trabajos pesados',
                    serialNumber: 'TDI-2024-002',
                    status: 'en_uso',
                    location: 'Con técnico',
                    condition: 'excelente',
                    lastMaintenance: '2024-02-01',
                    nextMaintenance: '2024-08-01',
                    assignedTo: 'tech_001',
                    assignedDate: '2024-03-01',
                    image: 'taladro.jpg',
                    createdAt: new Date().toISOString()
                },
                {
                    id: 'tool_003',
                    name: 'Amperímetro de Gancho',
                    category: 'Medición',
                    description: 'Amperímetro tipo gancho para medición de corriente AC/DC',
                    serialNumber: 'AMG-2024-003',
                    status: 'disponible',
                    location: 'Almacén Principal',
                    condition: 'bueno',
                    lastMaintenance: '2024-01-20',
                    nextMaintenance: '2024-07-20',
                    image: 'amperimetro.jpg',
                    createdAt: new Date().toISOString()
                },
                {
                    id: 'tool_004',
                    name: 'Escalera Telescópica',
                    category: 'Acceso',
                    description: 'Escalera telescópica de aluminio, altura máxima 6 metros',
                    serialNumber: 'ESC-2024-004',
                    status: 'mantenimiento',
                    location: 'Taller de Mantenimiento',
                    condition: 'regular',
                    lastMaintenance: '2024-03-01',
                    nextMaintenance: '2024-03-15',
                    image: 'escalera.jpg',
                    createdAt: new Date().toISOString()
                },
                {
                    id: 'tool_005',
                    name: 'Kit de Destornilladores',
                    category: 'Herramientas Manuales',
                    description: 'Kit completo de destornilladores aislados para electricistas',
                    serialNumber: 'KDS-2024-005',
                    status: 'disponible',
                    location: 'Almacén Principal',
                    condition: 'excelente',
                    lastMaintenance: '2024-02-15',
                    nextMaintenance: '2024-08-15',
                    image: 'destornilladores.jpg',
                    createdAt: new Date().toISOString()
                }
            ];
            
            this.tools = defaultTools;
            localStorage.setItem('tools', JSON.stringify(this.tools));
        }
    }

    // Crear vista de gestión de herramientas
    createToolsManagementView() {
        const availableTools = this.tools.filter(tool => tool.status === 'disponible');
        const toolsInUse = this.tools.filter(tool => tool.status === 'en_uso');
        const toolsInMaintenance = this.tools.filter(tool => tool.status === 'mantenimiento');
        const allRequests = JSON.parse(localStorage.getItem('toolRequests') || '[]');
        const pendingRequests = allRequests.filter(req => req.status === 'pendiente');

        return `
            <div class="page-header">
                <div class="d-flex justify-between align-center">
                    <div>
                        <h1><i class="fas fa-tools"></i> Gestión de Herramientas</h1>
                        <p>Administración de herramientas y equipos técnicos</p>
                    </div>
                    <div class="action-buttons">
                        <button class="btn btn-info" onclick="window.location.href='solicitudes-herramientas.html'" title="Ver solicitudes de herramientas">
                            <i class="fas fa-list"></i> Solicitudes (${pendingRequests.length})
                        </button>
                        <button class="btn btn-success" onclick="toolsManager.showAddToolModal()" title="Agregar nueva herramienta">
                            <i class="fas fa-plus"></i> Agregar Herramienta
                        </button>
                    </div>
                </div>
            </div>

            <div class="page-content">
                <!-- Estadísticas rápidas -->
                <div class="tools-stats-grid">
                    <div class="tools-stat-card available">
                        <div class="stat-icon">
                            <i class="fas fa-check-circle"></i>
                        </div>
                        <div class="stat-info">
                            <span class="stat-number">${availableTools.length}</span>
                            <span class="stat-label">Disponibles</span>
                        </div>
                    </div>
                    <div class="tools-stat-card in-use">
                        <div class="stat-icon">
                            <i class="fas fa-user-tools"></i>
                        </div>
                        <div class="stat-info">
                            <span class="stat-number">${toolsInUse.length}</span>
                            <span class="stat-label">En Uso</span>
                        </div>
                    </div>
                    <div class="tools-stat-card maintenance">
                        <div class="stat-icon">
                            <i class="fas fa-wrench"></i>
                        </div>
                        <div class="stat-info">
                            <span class="stat-number">${toolsInMaintenance.length}</span>
                            <span class="stat-label">Mantenimiento</span>
                        </div>
                    </div>
                    <div class="tools-stat-card requests">
                        <div class="stat-icon">
                            <i class="fas fa-clipboard-list"></i>
                        </div>
                        <div class="stat-info">
                            <span class="stat-number">${pendingRequests.length}</span>
                            <span class="stat-label">Solicitudes</span>
                        </div>
                    </div>
                </div>

                <!-- Filtros y búsqueda -->
                <div class="tools-filters">
                    <div class="search-box">
                        <input type="text" id="tools-search" placeholder="Buscar herramientas..." onkeyup="toolsManager.filterTools()">
                        <i class="fas fa-search"></i>
                    </div>
                    <select id="category-filter" onchange="toolsManager.filterTools()">
                        <option value="">Todas las categorías</option>
                        <option value="Medición">Medición</option>
                        <option value="Perforación">Perforación</option>
                        <option value="Acceso">Acceso</option>
                        <option value="Herramientas Manuales">Herramientas Manuales</option>
                        <option value="Seguridad">Seguridad</option>
                    </select>
                    <select id="status-filter" onchange="toolsManager.filterTools()">
                        <option value="">Todos los estados</option>
                        <option value="disponible">Disponible</option>
                        <option value="en_uso">En Uso</option>
                        <option value="mantenimiento">Mantenimiento</option>
                        <option value="fuera_servicio">Fuera de Servicio</option>
                    </select>
                </div>

                <!-- Lista de herramientas -->
                <div class="tools-grid" id="tools-grid">
                    ${this.renderToolsGrid(this.tools)}
                </div>
            </div>
        `;
    }

    // Renderizar grilla de herramientas
    renderToolsGrid(tools) {
        if (tools.length === 0) {
            return '<div class="no-tools"><i class="fas fa-tools"></i><p>No hay herramientas registradas</p></div>';
        }

        return tools.map(tool => {
            const technician = tool.assignedTo ? DataManager.getUserById(tool.assignedTo) : null;
            const maintenanceDue = this.isMaintenanceDue(tool);
            
            return `
                <div class="tool-card ${tool.status}" data-tool-id="${tool.id}">
                    <div class="tool-header">
                        <div class="tool-status">
                            <span class="status-badge status-${tool.status}">
                                <i class="${this.getStatusIcon(tool.status)}"></i>
                                ${this.getStatusLabel(tool.status)}
                            </span>
                            ${maintenanceDue ? '<span class="maintenance-alert"><i class="fas fa-exclamation-triangle"></i> Mantenimiento</span>' : ''}
                        </div>
                        <div class="tool-actions">
                            <button class="tool-action-btn" onclick="toolsManager.showToolDetail('${tool.id}')" title="Ver detalles">
                                <i class="fas fa-eye"></i>
                            </button>
                            <button class="tool-action-btn" onclick="toolsManager.showEditToolModal('${tool.id}')" title="Editar">
                                <i class="fas fa-edit"></i>
                            </button>
                            ${tool.status === 'disponible' ? `
                                <button class="tool-action-btn assign" onclick="toolsManager.showAssignToolModal('${tool.id}')" title="Asignar">
                                    <i class="fas fa-user-plus"></i>
                                </button>
                            ` : ''}
                        </div>
                    </div>
                    
                    <div class="tool-content">
                        <div class="tool-image">
                            <i class="fas fa-tools"></i>
                        </div>
                        <div class="tool-info">
                            <h4 class="tool-name">${tool.name}</h4>
                            <p class="tool-category">${tool.category}</p>
                            <p class="tool-serial">S/N: ${tool.serialNumber}</p>
                            <p class="tool-location"><i class="fas fa-map-marker-alt"></i> ${tool.location}</p>
                            ${technician ? `
                                <p class="tool-assigned">
                                    <i class="fas fa-user"></i> ${technician.name}
                                    <span class="assigned-date">desde ${this.formatDate(tool.assignedDate)}</span>
                                </p>
                            ` : ''}
                        </div>
                    </div>
                    
                    <div class="tool-footer">
                        <div class="tool-condition">
                            <span class="condition-badge condition-${tool.condition}">
                                ${this.getConditionIcon(tool.condition)} ${tool.condition.toUpperCase()}
                            </span>
                        </div>
                        <div class="tool-maintenance">
                            <span class="maintenance-date">
                                <i class="fas fa-calendar"></i>
                                Próximo: ${this.formatDate(tool.nextMaintenance)}
                            </span>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    // Verificar si el mantenimiento está vencido
    isMaintenanceDue(tool) {
        const nextMaintenance = new Date(tool.nextMaintenance);
        const today = new Date();
        const daysUntilMaintenance = Math.ceil((nextMaintenance - today) / (1000 * 60 * 60 * 24));
        return daysUntilMaintenance <= 7; // Alerta si faltan 7 días o menos
    }

    // Obtener icono de estado
    getStatusIcon(status) {
        const icons = {
            'disponible': 'fas fa-check-circle',
            'en_uso': 'fas fa-user-tools',
            'mantenimiento': 'fas fa-wrench',
            'fuera_servicio': 'fas fa-times-circle'
        };
        return icons[status] || 'fas fa-question-circle';
    }

    // Obtener etiqueta de estado
    getStatusLabel(status) {
        const labels = {
            'disponible': 'Disponible',
            'en_uso': 'En Uso',
            'mantenimiento': 'Mantenimiento',
            'fuera_servicio': 'Fuera de Servicio'
        };
        return labels[status] || status;
    }

    // Obtener icono de condición
    getConditionIcon(condition) {
        const icons = {
            'excelente': '🟢',
            'bueno': '🟡',
            'regular': '🟠',
            'malo': '🔴'
        };
        return icons[condition] || '⚫';
    }

    // Filtrar herramientas
    filterTools() {
        const searchTerm = document.getElementById('tools-search')?.value.toLowerCase() || '';
        const categoryFilter = document.getElementById('category-filter')?.value || '';
        const statusFilter = document.getElementById('status-filter')?.value || '';

        let filteredTools = this.tools;

        if (searchTerm) {
            filteredTools = filteredTools.filter(tool => 
                tool.name.toLowerCase().includes(searchTerm) ||
                tool.description.toLowerCase().includes(searchTerm) ||
                tool.serialNumber.toLowerCase().includes(searchTerm)
            );
        }

        if (categoryFilter) {
            filteredTools = filteredTools.filter(tool => tool.category === categoryFilter);
        }

        if (statusFilter) {
            filteredTools = filteredTools.filter(tool => tool.status === statusFilter);
        }

        const toolsGrid = document.getElementById('tools-grid');
        if (toolsGrid) {
            toolsGrid.innerHTML = this.renderToolsGrid(filteredTools);
        }
    }

    // Mostrar modal de detalle de herramienta
    showToolDetail(toolId) {
        const tool = this.tools.find(t => t.id === toolId);
        if (!tool) return;

        const technician = tool.assignedTo ? DataManager.getUserById(tool.assignedTo) : null;
        const historyEntries = this.getToolHistory(toolId);

        const modal = document.createElement('div');
        modal.className = 'modal show tool-detail-modal';
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 800px;">
                <div class="modal-header">
                    <h3><i class="fas fa-tools"></i> ${tool.name}</h3>
                    <button class="modal-close-btn" onclick="this.closest('.modal').remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="tool-detail-content">
                        <div class="tool-detail-info">
                            <div class="info-section">
                                <h4>Información General</h4>
                                <div class="info-grid">
                                    <div class="info-item">
                                        <strong>Categoría:</strong>
                                        <span>${tool.category}</span>
                                    </div>
                                    <div class="info-item">
                                        <strong>Número de Serie:</strong>
                                        <span>${tool.serialNumber}</span>
                                    </div>
                                    <div class="info-item">
                                        <strong>Estado:</strong>
                                        <span class="status-badge status-${tool.status}">
                                            <i class="${this.getStatusIcon(tool.status)}"></i>
                                            ${this.getStatusLabel(tool.status)}
                                        </span>
                                    </div>
                                    <div class="info-item">
                                        <strong>Condición:</strong>
                                        <span class="condition-badge condition-${tool.condition}">
                                            ${this.getConditionIcon(tool.condition)} ${tool.condition.toUpperCase()}
                                        </span>
                                    </div>
                                    <div class="info-item">
                                        <strong>Ubicación:</strong>
                                        <span>${tool.location}</span>
                                    </div>
                                    <div class="info-item full-width">
                                        <strong>Descripción:</strong>
                                        <span>${tool.description}</span>
                                    </div>
                                </div>
                            </div>

                            ${technician ? `
                                <div class="info-section">
                                    <h4>Asignación Actual</h4>
                                    <div class="assignment-info">
                                        <p><strong>Técnico:</strong> ${technician.name}</p>
                                        <p><strong>Email:</strong> ${technician.email}</p>
                                        <p><strong>Fecha de Asignación:</strong> ${this.formatDate(tool.assignedDate)}</p>
                                    </div>
                                </div>
                            ` : ''}

                            <div class="info-section">
                                <h4>Mantenimiento</h4>
                                <div class="maintenance-info">
                                    <p><strong>Último Mantenimiento:</strong> ${this.formatDate(tool.lastMaintenance)}</p>
                                    <p><strong>Próximo Mantenimiento:</strong> ${this.formatDate(tool.nextMaintenance)}</p>
                                    ${this.isMaintenanceDue(tool) ? `
                                        <div class="maintenance-alert">
                                            <i class="fas fa-exclamation-triangle"></i>
                                            El mantenimiento está próximo a vencer
                                        </div>
                                    ` : ''}
                                </div>
                            </div>
                        </div>

                        <div class="tool-history">
                            <h4>Historial de Uso</h4>
                            <div class="history-list">
                                ${historyEntries.length > 0 ? 
                                    historyEntries.map(entry => `
                                        <div class="history-entry">
                                            <div class="history-date">${this.formatDate(entry.date)}</div>
                                            <div class="history-action">${entry.action}</div>
                                            <div class="history-user">${entry.user}</div>
                                        </div>
                                    `).join('') :
                                    '<p class="no-history">No hay historial registrado</p>'
                                }
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    ${tool.status === 'disponible' ? `
                        <button class="btn btn-primary" onclick="toolsManager.showAssignToolModal('${tool.id}'); this.closest('.modal').remove();">
                            <i class="fas fa-user-plus"></i> Asignar Herramienta
                        </button>
                    ` : tool.status === 'en_uso' ? `
                        <button class="btn btn-warning" onclick="toolsManager.returnTool('${tool.id}'); this.closest('.modal').remove();">
                            <i class="fas fa-undo"></i> Devolver Herramienta
                        </button>
                    ` : ''}
                    <button class="btn btn-info" onclick="toolsManager.scheduleMaintenanceModal('${tool.id}'); this.closest('.modal').remove();">
                        <i class="fas fa-wrench"></i> Programar Mantenimiento
                    </button>
                    <button class="btn btn-secondary" onclick="this.closest('.modal').remove()">
                        Cerrar
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
    }

    // Obtener historial de herramienta (simulado)
    getToolHistory(toolId) {
        // En un sistema real, esto vendría de una base de datos
        const sampleHistory = [
            {
                date: '2024-03-01',
                action: 'Asignado a técnico',
                user: 'Juan Pérez'
            },
            {
                date: '2024-02-15',
                action: 'Mantenimiento completado',
                user: 'Supervisor de Mantenimiento'
            },
            {
                date: '2024-01-30',
                action: 'Devuelto al almacén',
                user: 'Carlos García'
            }
        ];
        return sampleHistory;
    }

    // Formatear fecha
    formatDate(dateString) {
        if (!dateString) return 'No especificado';
        try {
            return new Date(dateString).toLocaleDateString('es-ES');
        } catch (e) {
            return dateString;
        }
    }

    // Mostrar modal para agregar herramienta
    showAddToolModal() {
        // Implementar modal para agregar nueva herramienta
        Utils.showToast('Funcionalidad de agregar herramienta en desarrollo', 'info');
    }

    // Mostrar modal para editar herramienta
    showEditToolModal(toolId) {
        // Implementar modal para editar herramienta
        Utils.showToast('Funcionalidad de editar herramienta en desarrollo', 'info');
    }

    // Mostrar modal para asignar herramienta
    showAssignToolModal(toolId) {
        // Implementar modal para asignar herramienta a técnico
        Utils.showToast('Funcionalidad de asignar herramienta en desarrollo', 'info');
    }

    // Devolver herramienta
    returnTool(toolId) {
        const tool = this.tools.find(t => t.id === toolId);
        if (tool && tool.status === 'en_uso') {
            tool.status = 'disponible';
            tool.location = 'Almacén Principal';
            tool.assignedTo = null;
            tool.assignedDate = null;
            
            localStorage.setItem('tools', JSON.stringify(this.tools));
            
            // Recargar vista
            const toolsGrid = document.getElementById('tools-grid');
            if (toolsGrid) {
                toolsGrid.innerHTML = this.renderToolsGrid(this.tools);
            }
            
            Utils.showToast('Herramienta devuelta al almacén', 'success');
        }
    }

    // Mostrar solicitudes de herramientas
    showToolRequests() {
        Utils.showToast('Vista de solicitudes de herramientas en desarrollo', 'info');
    }

    // Programar mantenimiento
    scheduleMaintenanceModal(toolId) {
        Utils.showToast('Funcionalidad de programar mantenimiento en desarrollo', 'info');
    }
}

// Instancia global
window.toolsManager = new ToolsManager();
