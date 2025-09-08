// Datos de prueba para el sistema
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
            status: 'en_curso',
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
                workCompleted: 'parcial',
                issuesFound: 'Cableado dañado en el cuadro principal',
                nextSteps: 'Reemplazar cableado y verificar conexiones',
                photos: ['foto1.jpg', 'foto2.jpg'],
                observations: 'Se encontraron varias irregularidades en la instalación'
            },
            preClosedAt: null,
            survey: null,
            reportGenerated: false,
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
            status: 'pre_cerrado',
            assignedTechnicianId: 3,
            assignedTechnicianName: 'Carlos Rodríguez',
            createdAt: '2024-01-10T09:00:00Z',
            assignedAt: '2024-01-10T10:00:00Z',
            visitDate: '2024-01-12T08:00:00Z',
            startedAt: '2024-01-12T08:00:00Z',
            preClosedAt: '2024-01-14T17:00:00Z',
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
            survey: null,
            reportGenerated: false,
            comments: [
                {
                    id: 6,
                    author: 'Carlos Rodríguez',
                    authorRole: 'tecnico',
                    content: 'Trabajo completado exitosamente. Caso marcado como pre-cerrado. Esperando encuesta del cliente.',
                    createdAt: '2024-01-14T17:30:00Z'
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

// Funciones para manejar datos
const DataManager = {
    // Obtener usuario por credenciales
    getUserByCredentials(username, password) {
        return mockData.users.find(user => 
            user.username === username && user.password === password
        );
    },

    // Obtener usuario por ID
    getUserById(id) {
        return mockData.users.find(user => user.id === id);
    },

    // Obtener usuarios por rol
    getUsersByRole(role) {
        return mockData.users.filter(user => user.role === role);
    },

    // Obtener todos los tickets
    getAllTickets() {
        return mockData.tickets;
    },

    // Obtener tickets por estado
    getTicketsByStatus(status) {
        return mockData.tickets.filter(ticket => ticket.status === status);
    },

    // Obtener tickets por cliente
    getTicketsByClient(clientId) {
        return mockData.tickets.filter(ticket => ticket.clientId === clientId);
    },

    // Obtener tickets por técnico
    getTicketsByTechnician(technicianId) {
        return mockData.tickets.filter(ticket => ticket.assignedTechnicianId === technicianId);
    },

    // Obtener ticket por ID
    getTicketById(id) {
        return mockData.tickets.find(ticket => ticket.id === id);
    },

    // Crear nuevo ticket
    createTicket(ticketData) {
        const newTicket = {
            id: `TK-${String(mockData.tickets.length + 1).padStart(3, '0')}`,
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
        mockData.tickets.push(newTicket);
        return newTicket;
    },

    // Actualizar ticket
    updateTicket(id, updates) {
        const ticketIndex = mockData.tickets.findIndex(ticket => ticket.id === id);
        if (ticketIndex !== -1) {
            mockData.tickets[ticketIndex] = { ...mockData.tickets[ticketIndex], ...updates };
            return mockData.tickets[ticketIndex];
        }
        return null;
    },

    // Agregar comentario a ticket
    addCommentToTicket(ticketId, comment) {
        const ticket = this.getTicketById(ticketId);
        if (ticket) {
            const newComment = {
                id: Date.now(),
                ...comment,
                createdAt: new Date().toISOString()
            };
            ticket.comments.push(newComment);
            return newComment;
        }
        return null;
    },

    // Obtener técnicos disponibles
    getAvailableTechnicians() {
        return mockData.users.filter(user => 
            user.role === 'tecnico' && user.status === 'disponible'
        );
    },

    // Actualizar ubicación de técnico
    updateTechnicianLocation(technicianId, location) {
        const technician = this.getUserById(technicianId);
        if (technician) {
            technician.location = location;
            return technician;
        }
        return null;
    },

    // Obtener estadísticas
    getStats() {
        const tickets = this.getAllTickets();
        const users = mockData.users;
        
        return {
            totalTickets: tickets.length,
            pendingTickets: tickets.filter(t => t.status === 'pendiente').length,
            inProgressTickets: tickets.filter(t => t.status === 'en_curso').length,
            completedTickets: tickets.filter(t => t.status === 'finalizado').length,
            totalClients: users.filter(u => u.role === 'cliente').length,
            totalTechnicians: users.filter(u => u.role === 'tecnico').length,
            availableTechnicians: users.filter(u => u.role === 'tecnico' && u.status === 'disponible').length
        };
    }
};
