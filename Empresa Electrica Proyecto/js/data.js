// Datos de prueba para el sistema (semilla inicial)
const mockData = {
    // Usuarios del sistema
    users: [
        {
            id: 1,
            username: 'admin',
            password: 'admin123',
            role: 'admin',
            name: 'Administrador Sistema',
            email: 'admin@empresaelectrica.com',
            phone: '+1234567890',
            avatar: 'A'
        },
        {
            id: 2,
            username: 'mesa',
            password: 'mesa123',
            role: 'mesa_ayuda',
            name: 'María González',
            email: 'mesa@empresaelectrica.com',
            phone: '+1234567891',
            avatar: 'M'
        },
        {
            id: 3,
            username: 'tecnico1',
            password: 'tecnico123',
            role: 'tecnico',
            name: 'Carlos Rodríguez',
            email: 'carlos@empresaelectrica.com',
            phone: '+1234567892',
            avatar: 'C',
            specializations: ['Instalaciones Eléctricas', 'Mantenimiento'],
            location: { lat: 19.4326, lng: -99.1332 },
            status: 'disponible'
        },
        {
            id: 4,
            username: 'tecnico2',
            password: 'tecnico123',
            role: 'tecnico',
            name: 'Ana Martínez',
            email: 'ana@empresaelectrica.com',
            phone: '+1234567893',
            avatar: 'A',
            specializations: ['Reparaciones', 'Instalaciones Domésticas'],
            location: { lat: 19.4326, lng: -99.1332 },
            status: 'ocupado'
        },
        {
            id: 7,
            username: 'tecnico3',
            password: 'tecnico123',
            role: 'tecnico',
            name: 'Jorge Ramírez',
            email: 'jorge@empresaelectrica.com',
            phone: '+1234567896',
            avatar: 'J',
            specializations: ['Mantenimiento', 'Inspecciones'],
            location: { lat: 19.44, lng: -99.14 },
            status: 'disponible'
        },
        {
            id: 8,
            username: 'tecnico4',
            password: 'tecnico123',
            role: 'tecnico',
            name: 'Sofía López',
            email: 'sofia@empresaelectrica.com',
            phone: '+1234567897',
            avatar: 'S',
            specializations: ['Soporte', 'Electricidad industrial'],
            location: { lat: 19.45, lng: -99.12 },
            status: 'disponible'
        },
        {
            id: 5,
            username: 'cliente1',
            password: 'cliente123',
            role: 'cliente',
            name: 'Roberto Silva',
            email: 'roberto@email.com',
            phone: '+1234567894',
            avatar: 'R',
            address: 'Av. Reforma 123, Ciudad de México',
            company: 'Empresa ABC'
        },
        {
            id: 6,
            username: 'cliente2',
            password: 'cliente123',
            role: 'cliente',
            name: 'Laura Pérez',
            email: 'laura@email.com',
            phone: '+1234567895',
            avatar: 'L',
            address: 'Calle Insurgentes 456, Ciudad de México',
            company: 'Comercial XYZ'
        }
    ],

    // Tickets del sistema
    tickets: [
        {
            id: 'TK-001',
            title: 'Soporte técnico - Falla en sistema eléctrico',
            description: 'Hay una falla en el sistema eléctrico del edificio. Se corta la luz constantemente y hay olor a quemado en el cuadro principal. Necesito soporte técnico urgente.',
            clientId: 5,
            clientName: 'Roberto Silva',
            clientEmail: 'roberto@email.com',
            clientPhone: '+1234567894',
            clientAddress: 'Av. Reforma 123, Ciudad de México',
            priority: 'alta',
            status: 'asignado',
            assignedTechnicianId: 3,
            assignedTechnicianName: 'Carlos Rodríguez',
            createdAt: '2024-01-15T10:30:00Z',
            assignedAt: '2024-01-15T14:20:00Z',
            visitDate: '2024-01-16T09:00:00Z',
            estimatedDuration: 4,
            workType: 'soporte',
            isInterprovincial: false,
            viaticos: null,
            visitForm: null,
            preClosedAt: null,
            survey: null,
            reportGenerated: false,
            comments: [
                {
                    id: 1,
                    author: 'Roberto Silva',
                    authorRole: 'cliente',
                    content: 'El trabajo es urgente, necesito que esté listo para el lunes.',
                    createdAt: '2024-01-15T10:35:00Z'
                },
                {
                    id: 2,
                    author: 'María González',
                    authorRole: 'mesa_ayuda',
                    content: 'Ticket asignado a Carlos Rodríguez. Visita programada para el 16 de enero a las 9:00 AM.',
                    createdAt: '2024-01-15T14:25:00Z'
                }
            ]
        },
        {
            id: 'TK-002',
            title: 'Inspección de instalación eléctrica',
            description: 'Necesito una inspección completa de la instalación eléctrica del edificio para verificar que cumple con las normativas vigentes.',
            clientId: 6,
            clientName: 'Laura Pérez',
            clientEmail: 'laura@email.com',
            clientPhone: '+1234567895',
            clientAddress: 'Calle Insurgentes 456, Ciudad de México',
            priority: 'media',
            status: 'finalizado',
            assignedTechnicianId: 4,
            assignedTechnicianName: 'Ana Martínez',
            createdAt: '2024-01-16T08:15:00Z',
            assignedAt: '2024-01-16T08:45:00Z',
            visitDate: '2024-01-16T10:00:00Z',
            startedAt: '2024-01-16T09:30:00Z',
            estimatedDuration: 6,
            workType: 'inspeccion',
            isInterprovincial: false,
            viaticos: null,
            visitForm: {
                safetyCheck: 'si',
                toolsUsed: ['multimetro', 'destornilladores', 'cables'],
                workCompleted: 'completo',
                issuesFound: 'Cableado dañado en el cuadro principal - REPARADO',
                nextSteps: 'Instalación completada según normativas',
                photos: ['foto1.jpg', 'foto2.jpg'],
                observations: 'Irregularidades reparadas. Instalación ahora cumple con todas las normativas.'
            },
            preClosedAt: '2024-01-16T16:00:00Z',
            finalCompletedAt: '2024-01-17T10:00:00Z',
            survey: {
                satisfaction: '4',
                quality: '4',
                punctuality: '5',
                communication: '4',
                recommendation: 'probablemente',
                comments: 'Buen trabajo, la inspección fue completa y detallada. El técnico fue muy profesional.'
            },
            reportGenerated: true,
            comments: [
                {
                    id: 3,
                    author: 'Laura Pérez',
                    authorRole: 'cliente',
                    content: 'Necesito el informe para presentarlo a las autoridades.',
                    createdAt: '2024-01-16T08:20:00Z'
                },
                {
                    id: 4,
                    author: 'Ana Martínez',
                    authorRole: 'tecnico',
                    content: 'En camino al sitio. ETA 30 minutos.',
                    createdAt: '2024-01-16T09:00:00Z'
                },
                {
                    id: 5,
                    author: 'Ana Martínez',
                    authorRole: 'tecnico',
                    content: 'Inspección completada. Todas las irregularidades han sido reparadas. Instalación ahora cumple con normativas.',
                    createdAt: '2024-01-16T16:00:00Z'
                },
                {
                    id: 6,
                    author: 'Laura Pérez',
                    authorRole: 'cliente',
                    content: 'Encuesta completada. Muy satisfecha con el trabajo realizado.',
                    createdAt: '2024-01-17T10:00:00Z'
                }
            ]
        },
        {
            id: 'TK-003',
            title: 'Responsabilidad - Revisión de daños',
            description: 'Revisión de responsabilidad por daños en instalación eléctrica. Cliente reporta fallas después de trabajos realizados.',
            clientId: 5,
            clientName: 'Roberto Silva',
            clientEmail: 'roberto@email.com',
            clientPhone: '+1234567894',
            clientAddress: 'Av. Reforma 123, Ciudad de México',
            priority: 'alta',
            status: 'pendiente',
            assignedTechnicianId: null,
            assignedTechnicianName: null,
            createdAt: '2024-01-17T11:00:00Z',
            assignedAt: null,
            visitDate: null,
            estimatedDuration: 4,
            workType: 'responsabilidad',
            isInterprovincial: false,
            viaticos: null,
            visitForm: null,
            preClosedAt: null,
            survey: null,
            reportGenerated: false,
            comments: [
                {
                    id: 5,
                    author: 'Roberto Silva',
                    authorRole: 'cliente',
                    content: 'Necesito una revisión urgente de los daños reportados.',
                    createdAt: '2024-01-17T11:05:00Z'
                }
            ]
        },
        {
            id: 'TK-004',
            title: 'Soporte técnico - Instalación en provincia',
            description: 'Soporte técnico para instalación eléctrica en planta industrial ubicada en Guadalajara. Requiere viáticos.',
            clientId: 6,
            clientName: 'Laura Pérez',
            clientEmail: 'laura@email.com',
            clientPhone: '+1234567895',
            clientAddress: 'Calle Insurgentes 456, Ciudad de México',
            priority: 'alta',
            status: 'finalizado',
            assignedTechnicianId: 3,
            assignedTechnicianName: 'Carlos Rodríguez',
            createdAt: '2024-01-10T09:00:00Z',
            assignedAt: '2024-01-10T10:00:00Z',
            visitDate: '2024-01-12T08:00:00Z',
            startedAt: '2024-01-12T08:00:00Z',
            preClosedAt: '2024-01-14T17:00:00Z',
            finalCompletedAt: '2024-01-15T10:30:00Z',
            estimatedDuration: 16,
            workType: 'soporte',
            isInterprovincial: true,
            viaticos: {
                requested: true,
                approved: true,
                amount: 2500,
                description: 'Transporte, hospedaje y alimentación para 3 días en Guadalajara',
                approvedBy: 'María González',
                approvedAt: '2024-01-11T15:30:00Z'
            },
            visitForm: {
                safetyCheck: 'si',
                toolsUsed: ['multimetro', 'destornilladores', 'cables', 'taladro', 'escalera'],
                workCompleted: 'completo',
                issuesFound: 'Ninguna',
                nextSteps: 'Cliente debe completar encuesta de satisfacción',
                photos: ['instalacion1.jpg', 'instalacion2.jpg', 'instalacion3.jpg'],
                observations: 'Instalación completada según especificaciones. Sistema funcionando correctamente.'
            },
            survey: {
                satisfaction: '5',
                quality: '5',
                punctuality: '4',
                communication: '5',
                recommendation: 'definitivamente',
                comments: 'Excelente servicio, el técnico Carlos fue muy profesional y completó el trabajo a tiempo. La instalación quedó perfecta y funcionando sin problemas. Definitivamente recomendaría este servicio.'
            },
            reportGenerated: true,
            comments: [
                {
                    id: 6,
                    author: 'Carlos Rodríguez',
                    authorRole: 'tecnico',
                    content: 'Trabajo completado exitosamente. Caso marcado como pre-cerrado. Esperando encuesta del cliente.',
                    createdAt: '2024-01-14T17:30:00Z'
                },
                {
                    id: 7,
                    author: 'Laura Pérez',
                    authorRole: 'cliente',
                    content: 'Encuesta de satisfacción completada. Servicio finalizado. Informe disponible para descarga.',
                    createdAt: '2024-01-15T10:30:00Z'
                }
            ]
        },
        {
            id: 'TK-005',
            title: 'Instalación de sistema eléctrico nuevo',
            description: 'Instalación completa de sistema eléctrico para nueva oficina comercial. Se requiere revisión de planos y instalación de tablero principal.',
            clientId: 5,
            clientName: 'Roberto Silva',
            clientEmail: 'roberto@email.com',
            clientPhone: '+1234567894',
            clientAddress: 'Av. Reforma 123, Ciudad de México',
            priority: 'alta',
            status: 'pendiente',
            assignedTechnicianId: null,
            assignedTechnicianName: null,
            createdAt: '2024-01-18T09:15:00Z',
            assignedAt: null,
            visitDate: null,
            estimatedDuration: 6,
            workType: 'instalacion',
            isInterprovincial: false,
            viaticos: null,
            visitForm: null,
            preClosedAt: null,
            survey: null,
            reportGenerated: false,
            comments: [
                {
                    id: 8,
                    author: 'Roberto Silva',
                    authorRole: 'cliente',
                    content: 'Es urgente completar esta instalación antes del próximo lunes para la apertura de la oficina.',
                    createdAt: '2024-01-18T09:20:00Z'
                }
            ]
        },
        {
            id: 'TK-006',
            title: 'Revisión de tablero eléctrico - Problema de sobrecarga',
            description: 'El tablero eléctrico está presentando problemas de sobrecarga. Se disparan los breakers constantemente y hay olor a quemado.',
            clientId: 6,
            clientName: 'Laura Pérez',
            clientEmail: 'laura@email.com',
            clientPhone: '+1234567895',
            clientAddress: 'Calle Insurgentes 456, Ciudad de México',
            priority: 'critica',
            status: 'pendiente',
            assignedTechnicianId: null,
            assignedTechnicianName: null,
            createdAt: '2024-01-18T14:30:00Z',
            assignedAt: null,
            visitDate: null,
            estimatedDuration: 3,
            workType: 'soporte',
            isInterprovincial: false,
            viaticos: null,
            visitForm: null,
            preClosedAt: null,
            survey: null,
            reportGenerated: false,
            comments: [
                {
                    id: 9,
                    author: 'Laura Pérez',
                    authorRole: 'cliente',
                    content: 'Por favor atender con urgencia, tengo miedo de que haya un cortocircuito o incendio.',
                    createdAt: '2024-01-18T14:35:00Z'
                }
            ]
        }
    ],

    // Configuración del sistema
    config: {
        priorities: [
            { value: 'baja', label: 'Baja', color: 'success' },
            { value: 'media', label: 'Media', color: 'warning' },
            { value: 'alta', label: 'Alta', color: 'danger' },
            { value: 'critica', label: 'Crítica', color: 'danger' }
        ],
        statuses: [
            { value: 'pendiente', label: 'Pendiente', color: 'warning' },
            { value: 'asignado', label: 'Asignado', color: 'info' },
            { value: 'en_curso', label: 'En Curso', color: 'primary' },
            { value: 'pre_cerrado', label: 'Pre-Cerrado', color: 'secondary' },
            { value: 'finalizado', label: 'Finalizado', color: 'success' },
            { value: 'cancelado', label: 'Cancelado', color: 'danger' }
        ],
        workTypes: [
            { value: 'soporte', label: 'Soporte' },
            { value: 'inspeccion', label: 'Inspección' },
            { value: 'responsabilidad', label: 'Responsabilidad' }
        ],
        visitFormQuestions: [
            {
                id: 'safetyCheck',
                question: '¿Se realizó la verificación de seguridad antes de comenzar el trabajo?',
                type: 'radio',
                options: [
                    { value: 'si', label: 'Sí' },
                    { value: 'no', label: 'No' }
                ]
            },
            {
                id: 'toolsUsed',
                question: 'Herramientas utilizadas en la visita:',
                type: 'checkbox',
                options: [
                    { value: 'multimetro', label: 'Multímetro' },
                    { value: 'destornilladores', label: 'Destornilladores' },
                    { value: 'cables', label: 'Cables' },
                    { value: 'taladro', label: 'Taladro' },
                    { value: 'escalera', label: 'Escalera' },
                    { value: 'camara', label: 'Cámara fotográfica' },
                    { value: 'otras', label: 'Otras' }
                ]
            },
            {
                id: 'workCompleted',
                question: 'Estado del trabajo realizado:',
                type: 'radio',
                options: [
                    { value: 'completo', label: 'Completo' },
                    { value: 'parcial', label: 'Parcial' },
                    { value: 'no_completo', label: 'No completado' }
                ]
            },
            {
                id: 'issuesFound',
                question: 'Problemas o irregularidades encontradas:',
                type: 'textarea'
            },
            {
                id: 'nextSteps',
                question: 'Próximos pasos o recomendaciones:',
                type: 'textarea'
            },
            {
                id: 'observations',
                question: 'Observaciones generales de la visita:',
                type: 'textarea'
            }
        ],
        surveyQuestions: [
            {
                id: 'satisfaction',
                question: '¿Qué tan satisfecho está con el servicio recibido?',
                type: 'rating',
                scale: 5
            },
            {
                id: 'quality',
                question: '¿Cómo califica la calidad del trabajo realizado?',
                type: 'rating',
                scale: 5
            },
            {
                id: 'punctuality',
                question: '¿El técnico llegó a tiempo?',
                type: 'rating',
                scale: 5
            },
            {
                id: 'communication',
                question: '¿Cómo califica la comunicación del técnico?',
                type: 'rating',
                scale: 5
            },
            {
                id: 'recommendation',
                question: '¿Recomendaría nuestros servicios?',
                type: 'radio',
                options: [
                    { value: 'definitivamente', label: 'Definitivamente' },
                    { value: 'probablemente', label: 'Probablemente' },
                    { value: 'neutral', label: 'Neutral' },
                    { value: 'probablemente_no', label: 'Probablemente no' },
                    { value: 'definitivamente_no', label: 'Definitivamente no' }
                ]
            },
            {
                id: 'comments',
                question: 'Comentarios adicionales:',
                type: 'textarea'
            }
        ]
    }
};

// Claves de almacenamiento
const STORAGE_KEYS = {
    users: 'users',
    tickets: 'tickets'
};

// Inicialización de almacenamiento con semilla si está vacío
(() => {
    try {
        if (!localStorage.getItem(STORAGE_KEYS.users)) {
            localStorage.setItem(STORAGE_KEYS.users, JSON.stringify(mockData.users));
        } else {
            // Merge: agregar usuarios de semilla que no existan aún (por ID)
            const existing = JSON.parse(localStorage.getItem(STORAGE_KEYS.users) || '[]');
            const byId = new Map(existing.map(u => [u.id, u]));
            let changed = false;
            mockData.users.forEach(u => {
                if (!byId.has(u.id)) { existing.push(u); changed = true; }
            });
            if (changed) localStorage.setItem(STORAGE_KEYS.users, JSON.stringify(existing));
        }
        if (!localStorage.getItem(STORAGE_KEYS.tickets)) {
            localStorage.setItem(STORAGE_KEYS.tickets, JSON.stringify(mockData.tickets));
        }
    } catch (e) {
        console.warn('No se pudo inicializar el almacenamiento local:', e);
    }
})();

// Utilidad para emitir eventos de datos (tiempo real)
const DataEvents = {
    emit(eventName, detail) {
        try {
            const evt = new CustomEvent(eventName, { detail });
            window.dispatchEvent(evt);
        } catch (_) {}
    }
};

// Acceso seguro a localStorage
const Storage = {
    get(key) {
        try {
            return JSON.parse(localStorage.getItem(key) || '[]');
        } catch (_) {
            return [];
        }
    },
    set(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    }
};

// Funciones para manejar datos
const DataManager = {
    // Obtener usuario por credenciales
    getUserByCredentials(username, password) {
        const users = Storage.get(STORAGE_KEYS.users);
        return users.find(user => 
            user.username === username && user.password === password
        );
    },

    // Obtener usuario por ID
    getUserById(id) {
        const users = Storage.get(STORAGE_KEYS.users);
        return users.find(user => user.id === id);
    },

    // Obtener usuarios por rol
    getUsersByRole(role) {
        const users = Storage.get(STORAGE_KEYS.users);
        return users.filter(user => user.role === role);
    },

    // Obtener todos los tickets
    getAllTickets() {
        return Storage.get(STORAGE_KEYS.tickets);
    },

    // Obtener tickets por estado
    getTicketsByStatus(status) {
        const tickets = Storage.get(STORAGE_KEYS.tickets);
        return tickets.filter(ticket => ticket.status === status);
    },

    // Obtener tickets por cliente
    getTicketsByClient(clientId) {
        const tickets = Storage.get(STORAGE_KEYS.tickets);
        return tickets.filter(ticket => ticket.clientId === clientId);
    },

    // Obtener tickets por técnico
    getTicketsByTechnician(technicianId) {
        const tickets = Storage.get(STORAGE_KEYS.tickets);
        return tickets.filter(ticket => ticket.assignedTechnicianId === technicianId);
    },

    // Obtener ticket por ID
    getTicketById(id) {
        const tickets = Storage.get(STORAGE_KEYS.tickets);
        return tickets.find(ticket => ticket.id === id);
    },

    // Crear nuevo ticket
    createTicket(ticketData) {
        const tickets = Storage.get(STORAGE_KEYS.tickets);
        const newTicket = {
            id: `TK-${String(tickets.length + 1).padStart(3, '0')}`,
            ...ticketData,
            createdAt: new Date().toISOString(),
            status: 'pendiente',
            assignedTechnicianId: null,
            assignedTechnicianName: null,
            assignedAt: null,
            startedAt: null,
            completedAt: null,
            viaticos: null,
            rubric: null,
            survey: null,
            comments: []
        };
        tickets.push(newTicket);
        Storage.set(STORAGE_KEYS.tickets, tickets);
        DataEvents.emit('tickets:updated', { type: 'create', ticket: newTicket });
        return newTicket;
    },

    // Actualizar ticket
    updateTicket(id, updates) {
        const tickets = Storage.get(STORAGE_KEYS.tickets);
        const ticketIndex = tickets.findIndex(ticket => ticket.id === id);
        if (ticketIndex !== -1) {
            tickets[ticketIndex] = { ...tickets[ticketIndex], ...updates, updatedAt: new Date().toISOString() };
            Storage.set(STORAGE_KEYS.tickets, tickets);
            DataEvents.emit('tickets:updated', { type: 'update', ticket: tickets[ticketIndex] });
            return tickets[ticketIndex];
        }
        return null;
    },

    // Agregar comentario a ticket
    addCommentToTicket(ticketId, comment) {
        const tickets = Storage.get(STORAGE_KEYS.tickets);
        const ticketIndex = tickets.findIndex(t => t.id === ticketId);
        if (ticketIndex !== -1) {
            // Asegurar que comments sea un array
            if (!tickets[ticketIndex].comments) {
                tickets[ticketIndex].comments = [];
            }
            
            const newComment = {
                id: Date.now(),
                ...comment,
                createdAt: new Date().toISOString()
            };
            tickets[ticketIndex].comments.push(newComment);
            Storage.set(STORAGE_KEYS.tickets, tickets);
            DataEvents.emit('tickets:updated', { type: 'comment', ticket: tickets[ticketIndex] });
            return newComment;
        }
        return null;
    },

    // Obtener técnicos disponibles
    getAvailableTechnicians() {
        const users = Storage.get(STORAGE_KEYS.users);
        return users.filter(user => user.role === 'tecnico' && user.status === 'disponible');
    },

    // Actualizar ubicación de técnico
    updateTechnicianLocation(technicianId, location) {
        const users = Storage.get(STORAGE_KEYS.users);
        const idx = users.findIndex(u => u.id === technicianId);
        if (idx !== -1) {
            users[idx].location = location;
            Storage.set(STORAGE_KEYS.users, users);
            return users[idx];
        }
        return null;
    },

    // Actualizar estado del técnico (disponible/ocupado)
    updateTechnicianStatus(technicianId, status) {
        const users = Storage.get(STORAGE_KEYS.users);
        const idx = users.findIndex(u => u.id === technicianId && u.role === 'tecnico');
        if (idx !== -1) {
            users[idx].status = status;
            Storage.set(STORAGE_KEYS.users, users);
            DataEvents.emit('technicians:updated', { id: technicianId, status });
            return users[idx];
        }
        return null;
    },

    // Obtener estadísticas
    getStats() {
        const tickets = this.getAllTickets();
        const users = Storage.get(STORAGE_KEYS.users);
        
        return {
            totalTickets: tickets.length,
            pendingTickets: tickets.filter(t => t.status === 'pendiente').length,
            inProgressTickets: tickets.filter(t => t.status === 'en_curso').length,
            completedTickets: tickets.filter(t => t.status === 'finalizado').length,
            totalClients: users.filter(u => u.role === 'cliente').length,
            totalTechnicians: users.filter(u => u.role === 'tecnico').length,
            availableTechnicians: users.filter(u => u.role === 'tecnico' && u.status === 'disponible').length
        };
    },

    // Obtener configuración (prioridades, estados, etc.)
    getConfig() {
        return mockData.config;
    },

    // Limpiar tickets con datos faltantes o undefined
    cleanInvalidTickets() {
        const tickets = Storage.get(STORAGE_KEYS.tickets);
        const validTickets = tickets.filter(ticket => {
            // Verificar que el ticket tenga las propiedades básicas requeridas
            return ticket && 
                   ticket.id && 
                   ticket.title && 
                   ticket.description && 
                   ticket.priority && 
                   ticket.status &&
                   ticket.clientName &&
                   ticket.createdAt;
        });
        
        if (validTickets.length !== tickets.length) {
            console.log(`Se eliminaron ${tickets.length - validTickets.length} tickets con datos inválidos`);
            Storage.set(STORAGE_KEYS.tickets, validTickets);
            DataEvents.emit('tickets:updated', { type: 'cleanup' });
        }
        
        return validTickets;
    },

    // Eliminar ticket específico
    deleteTicket(id) {
        const tickets = Storage.get(STORAGE_KEYS.tickets);
        const filteredTickets = tickets.filter(ticket => ticket.id !== id);
        Storage.set(STORAGE_KEYS.tickets, filteredTickets);
        DataEvents.emit('tickets:updated', { type: 'delete', ticketId: id });
        return true;
    }
};

// Exportar eventos de datos
window.DataEvents = DataEvents;
