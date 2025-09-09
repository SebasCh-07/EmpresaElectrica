// Aplicación específica para administradores

class AdminApp {
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

        this.setupEventListeners();
        this.loadUserInfo();
        this.cleanInvalidTickets();
        this.loadDefaultView();
    }

    setupEventListeners() {
        // Logout button
        document.getElementById('logout-btn').addEventListener('click', () => {
            this.logout();
        });

        // Manejar cambios de hash en la URL
        window.addEventListener('hashchange', () => {
            const hash = window.location.hash.substring(1);
            if (hash && ['dashboard', 'tickets', 'clientes', 'tecnicos', 'geolocalizacion'].includes(hash)) {
                this.navigateTo(hash);
            }
        });
    }

    loadUserInfo() {
        document.getElementById('user-name').textContent = this.currentUser.name;
        document.getElementById('user-role').textContent = 'Administrador';
    }

    loadDefaultView() {
        // Verificar si hay un hash en la URL para navegar a una vista específica
        const hash = window.location.hash.substring(1); // Remover el #
        if (hash && ['dashboard', 'tickets', 'clientes', 'tecnicos', 'geolocalizacion'].includes(hash)) {
            this.navigateTo(hash);
        } else {
            this.navigateTo('dashboard');
        }
    }

    navigateTo(view) {
        // Actualizar menú activo
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        const activeLink = document.querySelector(`[data-view="${view}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }
        
        // Cargar contenido
        Utils.loadViewContent(view, 'content-area');
    }

    logout() {
        localStorage.removeItem('currentUser');
        window.location.href = 'login.html';
    }

    cleanInvalidTickets() {
        try {
            const cleanedTickets = DataManager.cleanInvalidTickets();
            console.log('Limpieza de tickets completada:', cleanedTickets.length, 'tickets válidos');
        } catch (error) {
            console.error('Error al limpiar tickets:', error);
        }
    }
}

// Inicializar aplicación
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new AdminApp();
});

// Funciones globales
window.app = app;

// Función para toggle del menú móvil
window.toggleMobileMenu = () => {
    const sidebar = document.querySelector('.sidebar');
    sidebar.classList.toggle('mobile-open');
};
