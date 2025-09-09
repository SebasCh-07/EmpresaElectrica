// Utilidades generales del sistema

// Formatear fechas
const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

// Formatear fecha relativa
const formatRelativeDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) {
        return 'Hace un momento';
    } else if (diffInSeconds < 3600) {
        const minutes = Math.floor(diffInSeconds / 60);
        return `Hace ${minutes} minuto${minutes > 1 ? 's' : ''}`;
    } else if (diffInSeconds < 86400) {
        const hours = Math.floor(diffInSeconds / 3600);
        return `Hace ${hours} hora${hours > 1 ? 's' : ''}`;
    } else {
        const days = Math.floor(diffInSeconds / 86400);
        return `Hace ${days} día${days > 1 ? 's' : ''}`;
    }
};

// Generar ID único
const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Validar email
const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// Validar teléfono
const isValidPhone = (phone) => {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
};

// Sanitizar HTML
const sanitizeHTML = (str) => {
    const temp = document.createElement('div');
    temp.textContent = str;
    return temp.innerHTML;
};

// Mostrar notificación toast
const showToast = (message, type = 'info', duration = 5000) => {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const iconMap = {
        success: 'fas fa-check-circle',
        error: 'fas fa-exclamation-circle',
        warning: 'fas fa-exclamation-triangle',
        info: 'fas fa-info-circle'
    };
    
    toast.innerHTML = `
        <i class="${iconMap[type]} toast-icon"></i>
        <div class="toast-content">
            <div class="toast-title">${type.charAt(0).toUpperCase() + type.slice(1)}</div>
            <div class="toast-message">${message}</div>
        </div>
        <button class="toast-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    document.body.appendChild(toast);
    
    // Mostrar toast
    setTimeout(() => {
        toast.classList.add('show');
    }, 100);
    
    // Auto-remover
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            if (toast.parentElement) {
                toast.remove();
            }
        }, 300);
    }, duration);
};

// Confirmar acción
const confirmAction = (message, callback) => {
    if (confirm(message)) {
        callback();
    }
};

// Cargar contenido dinámicamente
const loadContent = (url, containerId) => {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = '<div class="loading-container"><div class="loading"></div><p>Cargando...</p></div>';
    
    // Simular carga (en una aplicación real, aquí harías una petición AJAX)
    setTimeout(() => {
        // El contenido se cargará desde los archivos de vistas
        loadViewContent(url, containerId);
    }, 500);
};

// Cargar contenido de vista
const loadViewContent = (viewName, containerId) => {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    // Mapear nombres de vista a funciones de carga
    const viewLoaders = {
        'dashboard': loadDashboard,
        'tickets': loadTicketsView,
        'ticket-detail': loadTicketDetail,
        'ticket-form': loadTicketForm,
        'clientes': loadClientsView,
        'tecnicos': loadTechniciansView,
        'geolocalizacion': loadGeolocationView,
        'herramientas': loadToolsView,
        'encuesta': loadSurveyView,
    };
    
    let loader = viewLoaders[viewName];
    
    // Verificación adicional para loadTicketsView
    if (viewName === 'tickets' && !loader && window.loadTicketsView) {
        loader = window.loadTicketsView;
    }
    
    if (loader) {
        loader(container);
    } else {
        console.error(`Vista no encontrada: ${viewName}`, {
            available: Object.keys(viewLoaders),
            windowLoadTicketsView: !!window.loadTicketsView
        });
        container.innerHTML = '<div class="error-message"><h3>Vista no encontrada</h3><p>La vista solicitada no existe.</p></div>';
    }
};

// Debounce function
const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

// Throttle function
const throttle = (func, limit) => {
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
};

// Copiar al portapapeles
const copyToClipboard = (text) => {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
            showToast('Copiado al portapapeles', 'success');
        });
    } else {
        // Fallback para navegadores más antiguos
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showToast('Copiado al portapapeles', 'success');
    }
};

// Formatear moneda
const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN'
    }).format(amount);
};

// Formatear duración
const formatDuration = (hours) => {
    if (hours < 1) {
        return `${Math.round(hours * 60)} minutos`;
    } else if (hours < 24) {
        return `${hours} hora${hours > 1 ? 's' : ''}`;
    } else {
        const days = Math.floor(hours / 24);
        const remainingHours = hours % 24;
        let result = `${days} día${days > 1 ? 's' : ''}`;
        if (remainingHours > 0) {
            result += ` y ${remainingHours} hora${remainingHours > 1 ? 's' : ''}`;
        }
        return result;
    }
};

// Obtener color de prioridad
const getPriorityColor = (priority) => {
    const colors = {
        baja: 'success',
        media: 'warning',
        alta: 'danger',
        critica: 'danger'
    };
    return colors[priority] || 'secondary';
};

// Obtener color de estado
const getStatusColor = (status) => {
    const colors = {
        pendiente: 'warning',
        asignado: 'info',
        en_curso: 'primary',
        semi_finalizado: 'secondary',
        finalizado: 'success',
        cancelado: 'danger'
    };
    return colors[status] || 'secondary';
};

// Obtener icono de estado
const getStatusIcon = (status) => {
    const icons = {
        pendiente: 'fas fa-clock',
        asignado: 'fas fa-user-check',
        en_curso: 'fas fa-tools',
        semi_finalizado: 'fas fa-check-circle',
        finalizado: 'fas fa-check-double',
        cancelado: 'fas fa-times-circle'
    };
    return icons[status] || 'fas fa-question-circle';
};

// Obtener icono de prioridad
const getPriorityIcon = (priority) => {
    const icons = {
        baja: 'fas fa-arrow-down',
        media: 'fas fa-minus',
        alta: 'fas fa-arrow-up',
        critica: 'fas fa-exclamation-triangle'
    };
    return icons[priority] || 'fas fa-question-circle';
};

// Validar formulario
const validateForm = (formData, rules) => {
    const errors = {};
    
    for (const field in rules) {
        const rule = rules[field];
        const value = formData[field];
        
        if (rule.required && (!value || value.trim() === '')) {
            errors[field] = `${rule.label} es requerido`;
            continue;
        }
        
        if (value && rule.minLength && value.length < rule.minLength) {
            errors[field] = `${rule.label} debe tener al menos ${rule.minLength} caracteres`;
            continue;
        }
        
        if (value && rule.maxLength && value.length > rule.maxLength) {
            errors[field] = `${rule.label} no puede tener más de ${rule.maxLength} caracteres`;
            continue;
        }
        
        if (value && rule.pattern && !rule.pattern.test(value)) {
            errors[field] = rule.message || `${rule.label} tiene un formato inválido`;
            continue;
        }
        
        if (value && rule.custom && !rule.custom(value)) {
            errors[field] = rule.message || `${rule.label} no es válido`;
        }
    }
    
    return errors;
};

// Mostrar errores de formulario
const showFormErrors = (errors, formElement) => {
    // Limpiar errores anteriores
    formElement.querySelectorAll('.error-message').forEach(error => error.remove());
    formElement.querySelectorAll('.form-group').forEach(group => {
        group.classList.remove('has-error');
    });
    
    // Mostrar nuevos errores
    for (const field in errors) {
        const input = formElement.querySelector(`[name="${field}"]`);
        if (input) {
            const formGroup = input.closest('.form-group');
            formGroup.classList.add('has-error');
            
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            errorDiv.textContent = errors[field];
            formGroup.appendChild(errorDiv);
        }
    }
};

// Limpiar errores de formulario
const clearFormErrors = (formElement) => {
    formElement.querySelectorAll('.error-message').forEach(error => error.remove());
    formElement.querySelectorAll('.form-group').forEach(group => {
        group.classList.remove('has-error');
    });
};

// Obtener etiqueta de estado
const getStatusLabel = (status) => {
    const statusLabels = {
        'pendiente': 'Pendiente',
        'asignado': 'Asignado',
        'en_curso': 'En Curso',
        'pre_cerrado': 'Pre-cerrado',
        'finalizado': 'Finalizado',
        'cerrado': 'Cerrado'
    };
    return statusLabels[status] || status;
};

// Obtener etiqueta de prioridad
const getPriorityLabel = (priority) => {
    const priorityLabels = {
        'baja': 'Baja',
        'media': 'Media',
        'alta': 'Alta',
        'critica': 'Crítica'
    };
    return priorityLabels[priority] || priority;
};

// Obtener etiqueta de tipo de trabajo
const getWorkTypeLabel = (workType) => {
    const workTypeLabels = {
        'soporte': 'Soporte Técnico',
        'inspeccion': 'Inspección',
        'responsabilidad': 'Responsabilidad',
        'mantenimiento': 'Mantenimiento',
        'instalacion': 'Instalación'
    };
    return workTypeLabels[workType] || workType;
};

// Exportar funciones para uso global
// Formatear texto de recomendación de encuesta
const formatRecommendation = (recommendation) => {
    const recommendations = {
        'definitivamente': 'Definitivamente',
        'probablemente': 'Probablemente',
        'neutral': 'Neutral',
        'probablemente_no': 'Probablemente no',
        'definitivamente_no': 'Definitivamente no'
    };
    return recommendations[recommendation] || recommendation;
};

// Calcular promedio de encuesta de satisfacción
const calculateSurveyAverage = (survey) => {
    if (!survey) return 0;
    
    const ratings = [
        survey.satisfaction,
        survey.quality,
        survey.punctuality,
        survey.communication
    ].filter(rating => rating && !isNaN(rating));
    
    if (ratings.length === 0) return 0;
    
    const average = ratings.reduce((sum, rating) => sum + parseInt(rating), 0) / ratings.length;
    return Math.round(average * 10) / 10; // Redondear a 1 decimal
};

window.Utils = {
    formatDate,
    formatRelativeDate,
    generateId,
    isValidEmail,
    isValidPhone,
    sanitizeHTML,
    showToast,
    confirmAction,
    loadContent,
    loadViewContent,
    debounce,
    throttle,
    copyToClipboard,
    formatCurrency,
    formatDuration,
    getPriorityColor,
    getStatusColor,
    getStatusIcon,
    getPriorityIcon,
    getStatusLabel,
    getPriorityLabel,
    getWorkTypeLabel,
    validateForm,
    showFormErrors,
    clearFormErrors,
    formatRecommendation,
    calculateSurveyAverage
};
