/* ========================================
   UTILS - Plataforma TAT
   Utilidades y funciones auxiliares
   ======================================== */

// Funciones de formato
function formatDate(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });
}

function formatDateTime(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString('es-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function formatCurrency(amount) {
    if (amount === null || amount === undefined) return 'N/A';
    return new Intl.NumberFormat('es-EC', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

function formatNumber(number) {
    if (number === null || number === undefined) return 'N/A';
    return new Intl.NumberFormat('es-EC').format(number);
}

// Funciones de validación
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePhone(phone) {
    const re = /^[\+]?[0-9\s\-\(\)]{10,}$/;
    return re.test(phone);
}

function validateRequired(value) {
    return value !== null && value !== undefined && value.toString().trim() !== '';
}

function validateMinLength(value, minLength) {
    return value && value.toString().length >= minLength;
}

function validateMaxLength(value, maxLength) {
    return !value || value.toString().length <= maxLength;
}

// Funciones de datos
function getData(key, defaultValue = null) {
    try {
        const stored = localStorage.getItem(CONFIG.STORAGE_PREFIX + key);
        return stored ? JSON.parse(stored) : defaultValue;
    } catch (error) {
        console.error('Error al obtener datos:', error);
        return defaultValue;
    }
}

function saveData(key, data) {
    try {
        localStorage.setItem(CONFIG.STORAGE_PREFIX + key, JSON.stringify(data));
        return true;
    } catch (error) {
        console.error('Error al guardar datos:', error);
        return false;
    }
}

function removeData(key) {
    try {
        localStorage.removeItem(CONFIG.STORAGE_PREFIX + key);
        return true;
    } catch (error) {
        console.error('Error al eliminar datos:', error);
        return false;
    }
}

function clearAllData() {
    try {
        const keys = Object.keys(localStorage);
        keys.forEach(key => {
            if (key.startsWith(CONFIG.STORAGE_PREFIX)) {
                localStorage.removeItem(key);
            }
        });
        return true;
    } catch (error) {
        console.error('Error al limpiar datos:', error);
        return false;
    }
}

// Funciones de generación de IDs
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function generateTicketId() {
    const tickets = getData('tickets', []);
    return tickets.length > 0 ? Math.max(...tickets.map(t => t.id)) + 1 : 1;
}

// Funciones de notificaciones
function createNotification(userId, title, message, type = 'info', priority = 'media') {
    const notifications = getData('notificaciones', []);
    const notification = {
        id: generateId(),
        usuarioId: userId,
        titulo: title,
        mensaje: message,
        tipo: type,
        leida: false,
        fecha: new Date().toISOString(),
        prioridad: priority
    };
    
    notifications.push(notification);
    saveData('notificaciones', notifications);
    
    // Actualizar contador si el usuario actual está logueado
    if (window.app && window.app.currentUser && window.app.currentUser.id === userId) {
        window.app.loadNotifications();
    }
}

function markNotificationAsRead(notificationId) {
    const notifications = getData('notificaciones', []);
    const notification = notifications.find(n => n.id === notificationId);
    if (notification) {
        notification.leida = true;
        saveData('notificaciones', notifications);
        return true;
    }
    return false;
}

// Funciones de filtrado y búsqueda
function filterArray(array, filters) {
    return array.filter(item => {
        return Object.keys(filters).every(key => {
            if (!filters[key]) return true;
            
            const itemValue = item[key];
            const filterValue = filters[key].toString().toLowerCase();
            
            if (typeof itemValue === 'string') {
                return itemValue.toLowerCase().includes(filterValue);
            } else if (typeof itemValue === 'number') {
                return itemValue.toString().includes(filterValue);
            } else if (Array.isArray(itemValue)) {
                return itemValue.some(val => 
                    val.toString().toLowerCase().includes(filterValue)
                );
            }
            
            return false;
        });
    });
}

function sortArray(array, key, direction = 'asc') {
    return array.sort((a, b) => {
        let aVal = a[key];
        let bVal = b[key];
        
        // Manejar valores nulos/undefined
        if (aVal === null || aVal === undefined) aVal = '';
        if (bVal === null || bVal === undefined) bVal = '';
        
        // Convertir a string para comparación
        aVal = aVal.toString().toLowerCase();
        bVal = bVal.toString().toLowerCase();
        
        if (direction === 'asc') {
            return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
        } else {
            return aVal > bVal ? -1 : aVal < bVal ? 1 : 0;
        }
    });
}

// Funciones de paginación
function paginateArray(array, page = 1, pageSize = 10) {
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    
    return {
        data: array.slice(startIndex, endIndex),
        pagination: {
            currentPage: page,
            pageSize: pageSize,
            totalItems: array.length,
            totalPages: Math.ceil(array.length / pageSize),
            hasNext: endIndex < array.length,
            hasPrev: page > 1
        }
    };
}

// Funciones de exportación
function exportToCSV(data, filename = 'export.csv') {
    if (!data || data.length === 0) return;
    
    const headers = Object.keys(data[0]);
    const csvContent = [
        headers.join(','),
        ...data.map(row => 
            headers.map(header => {
                const value = row[header];
                return typeof value === 'string' && value.includes(',') 
                    ? `"${value}"` 
                    : value;
            }).join(',')
        )
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function exportToJSON(data, filename = 'export.json') {
    const jsonContent = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Funciones de archivos
function downloadFile(content, filename, mimeType = 'text/plain') {
    const blob = new Blob([content], { type: mimeType });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Limpiar URL
    setTimeout(() => URL.revokeObjectURL(url), 100);
}

function readFileAsText(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = e => resolve(e.target.result);
        reader.onerror = e => reject(e);
        reader.readAsText(file);
    });
}

function readFileAsDataURL(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = e => resolve(e.target.result);
        reader.onerror = e => reject(e);
        reader.readAsDataURL(file);
    });
}

// Funciones de URL y navegación
function getUrlParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

function setUrlParameter(name, value) {
    const url = new URL(window.location);
    url.searchParams.set(name, value);
    window.history.pushState({}, '', url);
}

function removeUrlParameter(name) {
    const url = new URL(window.location);
    url.searchParams.delete(name);
    window.history.pushState({}, '', url);
}

// Funciones de tiempo
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Funciones de animación
function fadeIn(element, duration = 300) {
    element.style.opacity = '0';
    element.style.display = 'block';
    
    let start = performance.now();
    
    function animate(currentTime) {
        const elapsed = currentTime - start;
        const progress = Math.min(elapsed / duration, 1);
        
        element.style.opacity = progress;
        
        if (progress < 1) {
            requestAnimationFrame(animate);
        }
    }
    
    requestAnimationFrame(animate);
}

function fadeOut(element, duration = 300) {
    let start = performance.now();
    const initialOpacity = parseFloat(getComputedStyle(element).opacity);
    
    function animate(currentTime) {
        const elapsed = currentTime - start;
        const progress = Math.min(elapsed / duration, 1);
        
        element.style.opacity = initialOpacity * (1 - progress);
        
        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            element.style.display = 'none';
        }
    }
    
    requestAnimationFrame(animate);
}

// Funciones de validación de formularios
function validateForm(formElement) {
    const errors = [];
    const formData = new FormData(formElement);
    
    // Validar campos requeridos
    const requiredFields = formElement.querySelectorAll('[required]');
    requiredFields.forEach(field => {
        if (!validateRequired(field.value)) {
            errors.push(`El campo ${field.name || field.id} es requerido`);
        }
    });
    
    // Validar emails
    const emailFields = formElement.querySelectorAll('input[type="email"]');
    emailFields.forEach(field => {
        if (field.value && !validateEmail(field.value)) {
            errors.push(`El campo ${field.name || field.id} debe ser un email válido`);
        }
    });
    
    // Validar teléfonos
    const phoneFields = formElement.querySelectorAll('input[type="tel"]');
    phoneFields.forEach(field => {
        if (field.value && !validatePhone(field.value)) {
            errors.push(`El campo ${field.name || field.id} debe ser un teléfono válido`);
        }
    });
    
    return {
        isValid: errors.length === 0,
        errors: errors
    };
}

// Funciones de manipulación del DOM
function createElement(tag, attributes = {}, content = '') {
    const element = document.createElement(tag);
    
    Object.keys(attributes).forEach(key => {
        if (key === 'className') {
            element.className = attributes[key];
        } else if (key === 'innerHTML') {
            element.innerHTML = attributes[key];
        } else {
            element.setAttribute(key, attributes[key]);
        }
    });
    
    if (content) {
        element.textContent = content;
    }
    
    return element;
}

function removeElement(element) {
    if (element && element.parentNode) {
        element.parentNode.removeChild(element);
    }
}

function toggleClass(element, className) {
    if (element) {
        element.classList.toggle(className);
    }
}

function addClass(element, className) {
    if (element) {
        element.classList.add(className);
    }
}

function removeClass(element, className) {
    if (element) {
        element.classList.remove(className);
    }
}

// Funciones de estadísticas
function calculateStatistics(data, key) {
    if (!data || data.length === 0) return null;
    
    const values = data.map(item => item[key]).filter(val => val !== null && val !== undefined);
    
    if (values.length === 0) return null;
    
    const sorted = values.sort((a, b) => a - b);
    const sum = values.reduce((acc, val) => acc + val, 0);
    
    return {
        count: values.length,
        sum: sum,
        average: sum / values.length,
        min: sorted[0],
        max: sorted[sorted.length - 1],
        median: sorted.length % 2 === 0 
            ? (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2
            : sorted[Math.floor(sorted.length / 2)]
    };
}

// Funciones de colores
function getStatusColor(status) {
    const colors = {
        'Abierto': '#dc3545',
        'En Proceso': '#ffc107',
        'Pre-cerrado': '#17a2b8',
        'Cerrado': '#28a745',
        'Alta': '#dc3545',
        'Media': '#ffc107',
        'Baja': '#28a745'
    };
    return colors[status] || '#6c757d';
}

function getPriorityColor(priority) {
    const colors = {
        'Alta': '#dc3545',
        'Media': '#ffc107',
        'Baja': '#28a745'
    };
    return colors[priority] || '#6c757d';
}

// Funciones de configuración
function getConfig(key, defaultValue = null) {
    return CONFIG[key] || defaultValue;
}

function setConfig(key, value) {
    CONFIG[key] = value;
}

// Funciones de logging
function log(level, message, data = null) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] [${level.toUpperCase()}] ${message}`;
    
    switch (level) {
        case 'error':
            console.error(logMessage, data);
            break;
        case 'warn':
            console.warn(logMessage, data);
            break;
        case 'info':
            console.info(logMessage, data);
            break;
        default:
            console.log(logMessage, data);
    }
}

// Exportar funciones globalmente
window.formatDate = formatDate;
window.formatDateTime = formatDateTime;
window.formatCurrency = formatCurrency;
window.formatNumber = formatNumber;
window.validateEmail = validateEmail;
window.validatePhone = validatePhone;
window.validateRequired = validateRequired;
window.getData = getData;
window.saveData = saveData;
window.removeData = removeData;
window.generateId = generateId;
window.createNotification = createNotification;
window.filterArray = filterArray;
window.sortArray = sortArray;
window.paginateArray = paginateArray;
window.exportToCSV = exportToCSV;
window.exportToJSON = exportToJSON;
window.downloadFile = downloadFile;
window.readFileAsText = readFileAsText;
window.readFileAsDataURL = readFileAsDataURL;
window.getUrlParameter = getUrlParameter;
window.setUrlParameter = setUrlParameter;
window.removeUrlParameter = removeUrlParameter;
window.debounce = debounce;
window.throttle = throttle;
window.fadeIn = fadeIn;
window.fadeOut = fadeOut;
window.validateForm = validateForm;
window.createElement = createElement;
window.removeElement = removeElement;
window.toggleClass = toggleClass;
window.addClass = addClass;
window.removeClass = removeClass;
window.calculateStatistics = calculateStatistics;
window.getStatusColor = getStatusColor;
window.getPriorityColor = getPriorityColor;
window.getConfig = getConfig;
window.setConfig = setConfig;
window.log = log;
