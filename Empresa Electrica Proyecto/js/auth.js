// Sistema de autenticación separado

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
            this.redirectToDashboard();
        } else {
            this.showLoginScreen();
        }
    }

    login(username, password) {
        const user = DataManager.getUserByCredentials(username, password);
        if (user) {
            this.currentUser = user;
            localStorage.setItem('currentUser', JSON.stringify(user));
            this.redirectToDashboard();
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
        window.location.href = 'login.html';
        Utils.showToast('Sesión cerrada', 'info');
    }

    showLoginScreen() {
        // Ya estamos en la pantalla de login
    }

    redirectToDashboard() {
        if (!this.currentUser) return;
        
        const role = this.currentUser.role;
        let targetPage = '';
        
        switch (role) {
            case 'admin':
                targetPage = 'admin.html';
                break;
            case 'mesa_ayuda':
                targetPage = 'mesa-ayuda.html';
                break;
            case 'tecnico':
                targetPage = 'tecnico.html';
                break;
            case 'cliente':
                targetPage = 'cliente.html';
                break;
            default:
                targetPage = 'login.html';
        }
        
        window.location.href = targetPage;
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
}

// Inicializar aplicación de autenticación
let auth;
document.addEventListener('DOMContentLoaded', () => {
    auth = new AuthManager();
    
    // Login form
    document.getElementById('login-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        auth.login(username, password);
    });

    // Demo account buttons
    window.fillDemoAccount = (username, password) => {
        document.getElementById('username').value = username;
        document.getElementById('password').value = password;
    };
});

// Función global para logout
window.logout = () => {
    if (auth) {
        auth.logout();
    }
};
