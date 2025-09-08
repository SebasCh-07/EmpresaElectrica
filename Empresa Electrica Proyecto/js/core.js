// Sistema de autenticación y navegación principal

class AuthManager {
    constructor() {
        this.currentUser = null;
        this.init();
    }

    init() {
        // Verificar si hay una sesión activa
        const savedUser = localStorage.getItem('currentUser');
        if (savedUser) {
            this.currentUser = JSON.parse(savedUser);
            this.showMainApp();
        } else {
            this.showLoginScreen();
        }
    }

    login(username, password) {
        const user = DataManager.getUserByCredentials(username, password);
        if (user) {
            this.currentUser = user;
            localStorage.setItem('currentUser', JSON.stringify(user));
            this.showMainApp();
            Utils.showToast(`Bienvenido, ${user.name}`, 'success');
            return true;
        } else {
            Utils.showToast('Credenciales inválidas', 'error');
            return false;
        }
    }

    logout() {
        this.currentUser = null;
        localStorage.removeItem('currentUser');
        this.showLoginScreen();
        Utils.showToast('Sesión cerrada', 'info');
    }

    showLoginScreen() {
        document.getElementById('login-screen').style.display = 'flex';
        document.getElementById('main-app').style.display = 'none';
    }

    showMainApp() {
        document.getElementById('login-screen').style.display = 'none';
        document.getElementById('main-app').style.display = 'grid';
        
        // Actualizar información del usuario
        document.getElementById('user-name').textContent = this.currentUser.name;
        document.getElementById('user-role').textContent = this.getRoleDisplayName(this.currentUser.role);
        
        // Cargar menú de navegación
        this.loadNavigationMenu();
        
        // Cargar dashboard por defecto
        this.loadDefaultView();
    }

    getRoleDisplayName(role) {
        const roleNames = {
            'admin': 'Administrador',
            'mesa_ayuda': 'Mesa de Ayuda',
            'tecnico': 'Técnico',
            'cliente': 'Cliente'
        };
        return roleNames[role] || role;
    }

    loadNavigationMenu() {
        const navMenu = document.getElementById('nav-menu');
        const menuItems = this.getMenuItemsForRole(this.currentUser.role);
        
        navMenu.innerHTML = menuItems.map(item => `
            <li>
                <a href="#" onclick="app.navigateTo('${item.view}')" class="nav-link" data-view="${item.view}">
                    <i class="${item.icon}"></i>
                    ${item.label}
                </a>
            </li>
        `).join('');
    }

    getMenuItemsForRole(role) {
        const baseMenu = [
            { view: 'dashboard', label: 'Dashboard', icon: 'fas fa-tachometer-alt' }
        ];

        switch (role) {
            case 'admin':
                return [
                    ...baseMenu,
                    { view: 'tickets', label: 'Todos los Tickets', icon: 'fas fa-ticket-alt' },
                    { view: 'clientes', label: 'Clientes', icon: 'fas fa-users' },
                    { view: 'tecnicos', label: 'Técnicos', icon: 'fas fa-tools' },
                    { view: 'geolocalizacion', label: 'Geolocalización', icon: 'fas fa-map-marker-alt' },
                ];
            
            case 'mesa_ayuda':
                return [
                    ...baseMenu,
                    { view: 'tickets', label: 'Tickets', icon: 'fas fa-ticket-alt' },
                    { view: 'geolocalizacion', label: 'Geolocalización', icon: 'fas fa-map-marker-alt' }
                ];
            
            case 'tecnico':
                return [
                    ...baseMenu,
                    { view: 'tickets', label: 'Mis Tickets', icon: 'fas fa-ticket-alt' }
                ];
            
            case 'cliente':
                return [
                    ...baseMenu,
                    { view: 'tickets', label: 'Mis Tickets', icon: 'fas fa-ticket-alt' },
                    { view: 'ticket-form', label: 'Nuevo Ticket', icon: 'fas fa-plus' }
                ];
            
            default:
                return baseMenu;
        }
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
        
        // Cargar contenido
        Utils.loadViewContent(view, 'content-area');
    }
}

class App {
    constructor() {
        this.auth = new AuthManager();
        this.init();
    }

    init() {
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Login form
        document.getElementById('login-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            this.auth.login(username, password);
        });

        // Logout button
        document.getElementById('logout-btn').addEventListener('click', () => {
            this.auth.logout();
        });

        // Demo account buttons
        window.fillDemoAccount = (username, password) => {
            document.getElementById('username').value = username;
            document.getElementById('password').value = password;
        };
    }

    navigateTo(view) {
        this.auth.navigateTo(view);
    }
}

// Inicializar aplicación
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new App();
});

// Funciones globales para uso en HTML
window.app = app;
