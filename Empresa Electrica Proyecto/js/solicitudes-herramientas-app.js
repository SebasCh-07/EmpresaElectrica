// Aplicación para gestionar solicitudes de herramientas

class SolicitudesHerramientasApp {
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
        
        // Verificar que sea admin
        if (this.currentUser.role !== 'admin') {
            window.location.href = 'login.html';
            return;
        }

        this.setupUserInfo();
        this.loadRequests();
        this.setupEventListeners();
        this.hideLoading();
    }

    setupUserInfo() {
        const userNameElement = document.getElementById('user-name');
        if (userNameElement) {
            userNameElement.textContent = this.currentUser.name;
        }
    }

    setupEventListeners() {
        // Logout button
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                this.logout();
            });
        }

        // Escuchar cambios en solicitudes
        window.addEventListener('toolRequests:updated', () => {
            this.loadRequests();
        });
    }

    loadRequests() {
        const contentArea = document.getElementById('content-area');
        const requests = this.getToolRequests();
        
        const pendingRequests = requests.filter(r => r.status === 'pendiente');
        const approvedRequests = requests.filter(r => r.status === 'aprobada');
        const rejectedRequests = requests.filter(r => r.status === 'rechazada');

        contentArea.innerHTML = `
            <div class="page-header">
                <div class="d-flex justify-between align-center">
                    <div>
                        <h1><i class="fas fa-clipboard-list"></i> Solicitudes de Herramientas</h1>
                        <p>Gestión de solicitudes de herramientas de técnicos</p>
                    </div>
                    <div class="action-buttons">
                        <button class="btn btn-secondary" onclick="history.back()">
                            <i class="fas fa-arrow-left"></i>
                            Volver a Herramientas
                        </button>
                    </div>
                </div>
            </div>
            
            <div class="page-content">
                <div class="requests-stats">
                    <div class="stat-card warning">
                        <div class="stat-number">${pendingRequests.length}</div>
                        <div class="stat-label">Pendientes</div>
                        <i class="fas fa-clock stat-icon"></i>
                    </div>
                    <div class="stat-card success">
                        <div class="stat-number">${approvedRequests.length}</div>
                        <div class="stat-label">Aprobadas</div>
                        <i class="fas fa-check stat-icon"></i>
                    </div>
                    <div class="stat-card danger">
                        <div class="stat-number">${rejectedRequests.length}</div>
                        <div class="stat-label">Rechazadas</div>
                        <i class="fas fa-times stat-icon"></i>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number">${requests.length}</div>
                        <div class="stat-label">Total</div>
                        <i class="fas fa-list stat-icon"></i>
                    </div>
                </div>

                <div class="requests-tabs">
                    <button class="requests-tab active" onclick="app.switchTab('pendientes')">
                        <span>Pendientes</span>
                        <span class="requests-tab-badge">${pendingRequests.length}</span>
                    </button>
                    <button class="requests-tab" onclick="app.switchTab('aprobadas')">
                        <span>Aprobadas</span>
                        <span class="requests-tab-badge">${approvedRequests.length}</span>
                    </button>
                    <button class="requests-tab" onclick="app.switchTab('rechazadas')">
                        <span>Rechazadas</span>
                        <span class="requests-tab-badge">${rejectedRequests.length}</span>
                    </button>
                    <button class="requests-tab" onclick="app.switchTab('todas')">
                        <span>Todas</span>
                        <span class="requests-tab-badge">${requests.length}</span>
                    </button>
                </div>

                <div class="requests-content">
                    <div id="requests-list">
                        ${this.renderRequestsByStatus(requests, 'pendientes')}
                    </div>
                </div>
            </div>
        `;

        // Guardar referencia al tab actual
        this.currentTab = 'pendientes';
    }

    getToolRequests() {
        return JSON.parse(localStorage.getItem('toolRequests') || '[]');
    }

    renderRequestsByStatus(requests, status) {
        let filteredRequests = requests;
        
        if (status === 'pendientes') {
            filteredRequests = requests.filter(r => r.status === 'pendiente');
        } else if (status === 'aprobadas') {
            filteredRequests = requests.filter(r => r.status === 'aprobada');
        } else if (status === 'rechazadas') {
            filteredRequests = requests.filter(r => r.status === 'rechazada');
        }

        if (filteredRequests.length === 0) {
            return `
                <div class="empty-state">
                    <i class="fas fa-clipboard-list"></i>
                    <h3>No hay solicitudes ${status === 'todas' ? '' : status}</h3>
                    <p>No se encontraron solicitudes de herramientas para mostrar</p>
                </div>
            `;
        }

        return filteredRequests.map(request => this.renderRequestCard(request)).join('');
    }

    renderRequestCard(request) {
        const tools = this.getToolsByIds(request.tools);
        const ticket = DataManager.getTicketById ? DataManager.getTicketById(request.ticketId) : null;
        
        return `
            <div class="request-card" data-status="${request.status}">
                <div class="request-header">
                    <div class="request-info">
                        <span class="request-id">#${request.id}</span>
                        <span class="request-technician">
                            <i class="fas fa-user"></i>
                            ${request.technicianName}
                        </span>
                        <span class="request-ticket">
                            <i class="fas fa-ticket-alt"></i>
                            Ticket #${request.ticketId}${ticket ? ` - ${ticket.title}` : ''}
                        </span>
                    </div>
                    <div class="request-status">
                        <span class="status-badge status-${request.status}">
                            <i class="fas fa-${this.getStatusIcon(request.status)}"></i>
                            ${this.getStatusText(request.status)}
                        </span>
                    </div>
                </div>
                <div class="request-body">
                    <div class="request-tools">
                        <h4>Herramientas solicitadas:</h4>
                        <div class="tools-list">
                            ${tools.map(tool => `
                                <div class="tool-item">
                                    <span class="tool-name">${tool.name}</span>
                                    <span class="tool-code">${tool.code}</span>
                                    <span class="tool-category">${tool.category}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    <div class="request-details">
                        <div class="request-reason">
                            <h4>Justificación:</h4>
                            <p>${request.reason}</p>
                        </div>
                        <div class="request-meta">
                            <div class="meta-item">
                                <span class="meta-label">Duración:</span>
                                <span class="meta-value">${request.duration} día${request.duration > 1 ? 's' : ''}</span>
                            </div>
                            <div class="meta-item">
                                <span class="meta-label">Solicitado:</span>
                                <span class="meta-value">${this.formatDate(request.requestedAt)}</span>
                            </div>
                            ${request.approvedAt ? `
                                <div class="meta-item">
                                    <span class="meta-label">Aprobado:</span>
                                    <span class="meta-value">${this.formatDate(request.approvedAt)}</span>
                                </div>
                            ` : ''}
                            ${request.rejectedAt ? `
                                <div class="meta-item">
                                    <span class="meta-label">Rechazado:</span>
                                    <span class="meta-value">${this.formatDate(request.rejectedAt)}</span>
                                </div>
                            ` : ''}
                        </div>
                    </div>
                </div>
                ${request.status === 'pendiente' ? `
                    <div class="request-actions">
                        <button class="btn btn-success" onclick="app.approveRequest('${request.id}')">
                            <i class="fas fa-check"></i>
                            Aprobar
                        </button>
                        <button class="btn btn-danger" onclick="app.rejectRequest('${request.id}')">
                            <i class="fas fa-times"></i>
                            Rechazar
                        </button>
                    </div>
                ` : ''}
            </div>
        `;
    }

    getToolsByIds(toolIds) {
        const allTools = DataManager.getAllTools ? DataManager.getAllTools() : [];
        return toolIds.map(id => allTools.find(tool => tool.id === id)).filter(Boolean);
    }

    getStatusIcon(status) {
        const icons = {
            'pendiente': 'clock',
            'aprobada': 'check',
            'rechazada': 'times'
        };
        return icons[status] || 'question';
    }

    getStatusText(status) {
        const texts = {
            'pendiente': 'Pendiente',
            'aprobada': 'Aprobada',
            'rechazada': 'Rechazada'
        };
        return texts[status] || status;
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    switchTab(tabName) {
        // Actualizar pestañas activas
        document.querySelectorAll('.requests-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelector(`[onclick="app.switchTab('${tabName}')"]`).classList.add('active');

        // Actualizar contenido
        const requests = this.getToolRequests();
        const requestsList = document.getElementById('requests-list');
        if (requestsList) {
            requestsList.innerHTML = this.renderRequestsByStatus(requests, tabName);
        }

        this.currentTab = tabName;
    }

    approveRequest(requestId) {
        if (!confirm('¿Estás seguro de que quieres aprobar esta solicitud?')) {
            return;
        }

        const requests = this.getToolRequests();
        const requestIndex = requests.findIndex(r => r.id === requestId);
        
        if (requestIndex !== -1) {
            requests[requestIndex].status = 'aprobada';
            requests[requestIndex].approvedAt = new Date().toISOString();
            requests[requestIndex].approvedBy = this.currentUser.id;
            
            localStorage.setItem('toolRequests', JSON.stringify(requests));
            
            // Actualizar herramientas a estado "asignada"
            this.updateToolsStatus(requests[requestIndex].tools, 'asignada');
            
            this.showToast('Solicitud aprobada exitosamente', 'success');
            this.loadRequests();
        }
    }

    rejectRequest(requestId) {
        const reason = prompt('¿Por qué rechazas esta solicitud? (opcional)');
        if (reason === null) return; // Usuario canceló

        const requests = this.getToolRequests();
        const requestIndex = requests.findIndex(r => r.id === requestId);
        
        if (requestIndex !== -1) {
            requests[requestIndex].status = 'rechazada';
            requests[requestIndex].rejectedAt = new Date().toISOString();
            requests[requestIndex].rejectedBy = this.currentUser.id;
            if (reason.trim()) {
                requests[requestIndex].rejectionReason = reason.trim();
            }
            
            localStorage.setItem('toolRequests', JSON.stringify(requests));
            
            this.showToast('Solicitud rechazada', 'info');
            this.loadRequests();
        }
    }

    updateToolsStatus(toolIds, newStatus) {
        if (!DataManager.getAllTools || !DataManager.updateTool) return;
        
        const allTools = DataManager.getAllTools();
        toolIds.forEach(toolId => {
            const tool = allTools.find(t => t.id === toolId);
            if (tool) {
                DataManager.updateTool(toolId, { status: newStatus });
            }
        });
    }

    showToast(message, type = 'info') {
        // Usar Utils si está disponible, si no crear notificación simple
        if (window.Utils && Utils.showToast) {
            Utils.showToast(message, type);
        } else {
            const toast = document.createElement('div');
            toast.className = `toast toast-${type}`;
            toast.textContent = message;
            toast.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 12px 24px;
                background: ${type === 'success' ? '#10b981' : type === 'danger' ? '#ef4444' : '#3b82f6'};
                color: white;
                border-radius: 8px;
                z-index: 10000;
            `;
            document.body.appendChild(toast);
            setTimeout(() => toast.remove(), 3000);
        }
    }

    hideLoading() {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.style.display = 'none';
        }
    }

    logout() {
        localStorage.removeItem('currentUser');
        window.location.href = 'login.html';
    }
}

// Inicializar aplicación
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new SolicitudesHerramientasApp();
    // Hacer app disponible globalmente después de inicializar
    window.app = app;
});

// Funciones globales
window.toggleMobileMenu = () => {
    const sidebar = document.querySelector('.sidebar');
    sidebar.classList.toggle('mobile-open');
};
