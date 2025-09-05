// Datos mock completos para la Plataforma TAT - Sistema de Gestión de Soporte Técnico

// Usuarios del sistema con roles específicos
const usuarios = [
    { 
        id: 1, 
        username: 'admin', 
        password: '1234', 
        rol: 'Administrador', 
        nombre: 'Roberto Martínez - Administrador',
        email: 'admin@plataformatat.com',
        telefono: '+593-99-123-4567',
        activo: true,
        fechaCreacion: '2024-01-01',
        ultimoAcceso: '2024-01-15 14:30'
    },
    { 
        id: 2, 
        username: 'mesa', 
        password: '1234', 
        rol: 'Mesa de Ayuda', 
        nombre: 'María González - Mesa de Ayuda',
        email: 'mesa@plataformatat.com',
        telefono: '+593-99-234-5678',
        activo: true,
        fechaCreacion: '2024-01-01',
        ultimoAcceso: '2024-01-15 13:45'
    },
    { 
        id: 3, 
        username: 'tecnico', 
        password: '1234', 
        rol: 'Técnico', 
        nombre: 'Carlos Pérez',
        email: 'carlos.perez@plataformatat.com',
        telefono: '+593-99-345-6789',
        activo: true,
        especialidad: 'Generadores',
        tipo: 'Interno',
        fechaCreacion: '2024-01-01',
        ultimoAcceso: '2024-01-15 12:20'
    },
    { 
        id: 4, 
        username: 'cliente', 
        password: '1234', 
        rol: 'Cliente', 
        nombre: 'Empresa ABC S.A.',
        email: 'contacto@empresaabc.com',
        telefono: '+593-2-234-5678',
        activo: true,
        fechaCreacion: '2024-01-01',
        ultimoAcceso: '2024-01-15 11:15'
    },
    { 
        id: 5, 
        username: 'tecnico2', 
        password: '1234', 
        rol: 'Técnico', 
        nombre: 'Ana Torres',
        email: 'ana.torres@plataformatat.com',
        telefono: '+593-99-456-7890',
        activo: true,
        especialidad: 'Transformadores',
        tipo: 'Interno',
        fechaCreacion: '2024-01-05',
        ultimoAcceso: '2024-01-15 10:30'
    },
    { 
        id: 6, 
        username: 'tecnico3', 
        password: '1234', 
        rol: 'Técnico', 
        nombre: 'Luis García',
        email: 'luis.garcia@tecnicoslibres.com',
        telefono: '+593-99-567-8901',
        activo: true,
        especialidad: 'Sistemas de Refrigeración',
        tipo: 'Externo',
        fechaCreacion: '2024-01-10',
        ultimoAcceso: '2024-01-15 09:45'
    },
    { 
        id: 7, 
        username: 'cliente2', 
        password: '1234', 
        rol: 'Cliente', 
        nombre: 'Industrias XYZ Ltda.',
        email: 'soporte@industriasxyz.com',
        telefono: '+593-4-345-6789',
        activo: true,
        fechaCreacion: '2024-01-05',
        ultimoAcceso: '2024-01-15 08:20'
    }
];

// Clientes del sistema
const clientes = [
    {
        id: 1,
        nombre: 'Empresa ABC S.A.',
        contacto: 'Juan Martínez',
        email: 'juan.martinez@empresaabc.com',
        telefono: '+593-2-234-5678',
        direccion: 'Av. Amazonas 1234, Quito',
        provincia: 'Pichincha',
        estado: 'Activo',
        fechaRegistro: '2024-01-01',
        coordenadas: { lat: -0.1807, lng: -78.4678 },
        ruc: '0991234567001',
        sector: 'Manufactura',
        tipoCliente: 'Corporativo'
    },
    {
        id: 2,
        nombre: 'Industrias XYZ Ltda.',
        contacto: 'Ana Torres',
        email: 'ana.torres@industriasxyz.com',
        telefono: '+593-4-345-6789',
        direccion: 'Km 15 Vía a Daule, Guayaquil',
        provincia: 'Guayas',
        estado: 'Activo',
        fechaRegistro: '2024-01-05',
        coordenadas: { lat: -2.1894, lng: -79.8890 },
        ruc: '0992345678001',
        sector: 'Alimenticio',
        tipoCliente: 'Corporativo'
    },
    {
        id: 3,
        nombre: 'Complejo Industrial DEF',
        contacto: 'Luis García',
        email: 'luis.garcia@complejodef.com',
        telefono: '+593-7-456-7890',
        direccion: 'Zona Industrial Norte, Cuenca',
        provincia: 'Azuay',
        estado: 'Activo',
        fechaRegistro: '2024-01-10',
        coordenadas: { lat: -2.9001, lng: -79.0059 },
        ruc: '0993456789001',
        sector: 'Textil',
        tipoCliente: 'Corporativo'
    },
    {
        id: 4,
        nombre: 'Fábrica GHI S.A.',
        contacto: 'María López',
        email: 'maria.lopez@fabricaghi.com',
        telefono: '+593-2-567-8901',
        direccion: 'Parque Industrial Sur, Quito',
        provincia: 'Pichincha',
        estado: 'Activo',
        fechaRegistro: '2024-01-15',
        coordenadas: { lat: -0.2295, lng: -78.5249 },
        ruc: '0994567890001',
        sector: 'Químico',
        tipoCliente: 'Corporativo'
    },
    {
        id: 5,
        nombre: 'Hotel Plaza Internacional',
        contacto: 'Roberto Silva',
        email: 'mantenimiento@hotelplaza.com',
        telefono: '+593-2-678-9012',
        direccion: 'Av. 6 de Diciembre 1234, Quito',
        provincia: 'Pichincha',
        estado: 'Activo',
        fechaRegistro: '2024-01-20',
        coordenadas: { lat: -0.1807, lng: -78.4678 },
        ruc: '0995678901001',
        sector: 'Turismo',
        tipoCliente: 'Servicios'
    },
    {
        id: 6,
        nombre: 'Centro Comercial Mall del Sol',
        contacto: 'Patricia Vega',
        email: 'soporte@malldelsol.com',
        telefono: '+593-4-789-0123',
        direccion: 'Av. Francisco de Orellana, Guayaquil',
        provincia: 'Guayas',
        estado: 'Activo',
        fechaRegistro: '2024-01-25',
        coordenadas: { lat: -2.1894, lng: -79.8890 },
        ruc: '0996789012001',
        sector: 'Retail',
        tipoCliente: 'Comercial'
    }
];

// Equipos de los clientes
const equipos = [
    {
        id: 1,
        clienteId: 1,
        cliente: 'Empresa ABC S.A.',
        equipo: 'Generador Principal',
        modelo: 'GEN-3000-XL',
        serie: 'ABC001-2024',
        ubicacion: 'Planta Norte - Sala de Máquinas',
        estado: 'Activo',
        fechaInstalacion: '2024-01-01',
        ultimoMantenimiento: '2024-01-15',
        proximoMantenimiento: '2024-02-15',
        coordenadas: { lat: -0.1807, lng: -78.4678 },
        potencia: '3000 kW',
        fabricante: 'Caterpillar',
        garantia: '24 meses'
    },
    {
        id: 2,
        clienteId: 2,
        cliente: 'Industrias XYZ Ltda.',
        equipo: 'Transformador Principal',
        modelo: 'TRF-5000-K',
        serie: 'XYZ002-2024',
        ubicacion: 'Subestación Central',
        estado: 'Mantenimiento',
        fechaInstalacion: '2024-01-05',
        ultimoMantenimiento: '2024-01-20',
        proximoMantenimiento: '2024-02-20',
        coordenadas: { lat: -2.1894, lng: -79.8890 },
        potencia: '5000 kVA',
        fabricante: 'Siemens',
        garantia: '36 meses'
    },
    {
        id: 3,
        clienteId: 3,
        cliente: 'Complejo Industrial DEF',
        equipo: 'Sistema de Refrigeración',
        modelo: 'REF-2000-C',
        serie: 'DEF003-2024',
        ubicacion: 'Edificio A - Planta Baja',
        estado: 'Activo',
        fechaInstalacion: '2024-01-10',
        ultimoMantenimiento: '2024-01-25',
        proximoMantenimiento: '2024-02-25',
        coordenadas: { lat: -2.9001, lng: -79.0059 },
        potencia: '2000 TR',
        fabricante: 'Carrier',
        garantia: '18 meses'
    },
    {
        id: 4,
        clienteId: 4,
        cliente: 'Fábrica GHI S.A.',
        equipo: 'Compresor Industrial',
        modelo: 'COMP-1500-M',
        serie: 'GHI004-2024',
        ubicacion: 'Línea de Producción 2',
        estado: 'Fuera de Servicio',
        fechaInstalacion: '2024-01-15',
        ultimoMantenimiento: '2024-01-30',
        proximoMantenimiento: '2024-03-01',
        coordenadas: { lat: -0.2295, lng: -78.5249 },
        potencia: '1500 HP',
        fabricante: 'Atlas Copco',
        garantia: '12 meses'
    },
    {
        id: 5,
        clienteId: 1,
        cliente: 'Empresa ABC S.A.',
        equipo: 'UPS Industrial',
        modelo: 'UPS-1000-K',
        serie: 'ABC005-2024',
        ubicacion: 'Sala de Control',
        estado: 'Activo',
        fechaInstalacion: '2024-01-20',
        ultimoMantenimiento: '2024-01-28',
        proximoMantenimiento: '2024-02-28',
        coordenadas: { lat: -0.1807, lng: -78.4678 },
        potencia: '1000 kVA',
        fabricante: 'APC',
        garantia: '24 meses'
    },
    {
        id: 6,
        clienteId: 5,
        cliente: 'Hotel Plaza Internacional',
        equipo: 'Sistema de Aire Acondicionado',
        modelo: 'HVAC-5000',
        serie: 'HOT001-2024',
        ubicacion: 'Sótano - Cuarto de Máquinas',
        estado: 'Activo',
        fechaInstalacion: '2024-01-25',
        ultimoMantenimiento: '2024-02-01',
        proximoMantenimiento: '2024-03-01',
        coordenadas: { lat: -0.1807, lng: -78.4678 },
        potencia: '5000 TR',
        fabricante: 'Trane',
        garantia: '36 meses'
    },
    {
        id: 7,
        clienteId: 6,
        cliente: 'Centro Comercial Mall del Sol',
        equipo: 'Sistema de Iluminación LED',
        modelo: 'LED-2000',
        serie: 'MAL001-2024',
        ubicacion: 'Nivel 1 - Área Comercial',
        estado: 'Activo',
        fechaInstalacion: '2024-01-30',
        ultimoMantenimiento: '2024-02-05',
        proximoMantenimiento: '2024-03-05',
        coordenadas: { lat: -2.1894, lng: -79.8890 },
        potencia: '2000 W',
        fabricante: 'Philips',
        garantia: '60 meses'
    }
];

// Técnicos internos y externos
const tecnicos = [
    {
        id: 1,
        nombre: 'Carlos Pérez',
        especialidad: 'Generadores',
        tipo: 'Interno',
        estado: 'Disponible',
        email: 'carlos.perez@plataformatat.com',
        telefono: '+593-99-345-6789',
        coordenadas: { lat: -0.1807, lng: -78.4678 },
        ultimaActualizacion: '2024-01-15 10:30',
        tarifaHora: 25.00,
        experiencia: '5 años',
        certificaciones: ['Certificación CAT', 'Seguridad Industrial'],
        ticketsCompletados: 45,
        calificacionPromedio: 4.8
    },
    {
        id: 2,
        nombre: 'Ana Torres',
        especialidad: 'Transformadores',
        tipo: 'Interno',
        estado: 'En campo',
        email: 'ana.torres@plataformatat.com',
        telefono: '+593-99-456-7890',
        coordenadas: { lat: -2.1894, lng: -79.8890 },
        ultimaActualizacion: '2024-01-15 11:15',
        tarifaHora: 25.00,
        experiencia: '7 años',
        certificaciones: ['Certificación Siemens', 'Alta Tensión'],
        ticketsCompletados: 67,
        calificacionPromedio: 4.9
    },
    {
        id: 3,
        nombre: 'Luis García',
        especialidad: 'Sistemas de Refrigeración',
        tipo: 'Externo',
        estado: 'Disponible',
        email: 'luis.garcia@tecnicoslibres.com',
        telefono: '+593-99-567-8901',
        coordenadas: { lat: -2.9001, lng: -79.0059 },
        ultimaActualizacion: '2024-01-15 09:45',
        tarifaHora: 30.00,
        experiencia: '3 años',
        certificaciones: ['Certificación Carrier', 'Refrigeración Industrial'],
        ticketsCompletados: 23,
        calificacionPromedio: 4.6
    },
    {
        id: 4,
        nombre: 'María López',
        especialidad: 'Compresores',
        tipo: 'Interno',
        estado: 'En oficina',
        email: 'maria.lopez@plataformatat.com',
        telefono: '+593-99-678-9012',
        coordenadas: { lat: -0.2295, lng: -78.5249 },
        ultimaActualizacion: '2024-01-15 12:00',
        tarifaHora: 25.00,
        experiencia: '4 años',
        certificaciones: ['Certificación Atlas Copco', 'Sistemas Neumáticos'],
        ticketsCompletados: 38,
        calificacionPromedio: 4.7
    },
    {
        id: 5,
        nombre: 'Roberto Silva',
        especialidad: 'Sistemas HVAC',
        tipo: 'Externo',
        estado: 'Disponible',
        email: 'roberto.silva@hvacpro.com',
        telefono: '+593-99-789-0123',
        coordenadas: { lat: -0.1807, lng: -78.4678 },
        ultimaActualizacion: '2024-01-15 08:30',
        tarifaHora: 28.00,
        experiencia: '6 años',
        certificaciones: ['Certificación Trane', 'Eficiencia Energética'],
        ticketsCompletados: 52,
        calificacionPromedio: 4.8
    },
    {
        id: 6,
        nombre: 'Patricia Vega',
        especialidad: 'Sistemas Eléctricos',
        tipo: 'Interno',
        estado: 'Disponible',
        email: 'patricia.vega@plataformatat.com',
        telefono: '+593-99-890-1234',
        coordenadas: { lat: -2.1894, lng: -79.8890 },
        ultimaActualizacion: '2024-01-15 07:45',
        tarifaHora: 25.00,
        experiencia: '8 años',
        certificaciones: ['Certificación Schneider', 'Instalaciones Eléctricas'],
        ticketsCompletados: 89,
        calificacionPromedio: 4.9
    }
];

// Herramientas disponibles
const herramientas = [
    {
        id: 1,
        nombre: 'Multímetro Digital Fluke 87V',
        categoria: 'Medición',
        estado: 'Disponible',
        disponible: true,
        ubicacion: 'Almacén Central',
        fechaAdquisicion: '2024-01-01',
        costo: 450.00,
        descripcion: 'Multímetro digital de alta precisión con certificación CAT IV',
        fabricante: 'Fluke',
        modelo: '87V',
        serie: 'FLK001-2024'
    },
    {
        id: 2,
        nombre: 'Osciloscopio Portátil Tektronix',
        categoria: 'Medición',
        estado: 'En uso',
        disponible: false,
        ubicacion: 'En campo - Carlos Pérez',
        fechaAdquisicion: '2024-01-05',
        costo: 1200.00,
        descripcion: 'Osciloscopio portátil de 4 canales para análisis de señales',
        fabricante: 'Tektronix',
        modelo: 'TBS1052B',
        serie: 'TEK001-2024'
    },
    {
        id: 3,
        nombre: 'Kit de Herramientas Eléctricas Klein',
        categoria: 'Herramientas',
        estado: 'Disponible',
        disponible: true,
        ubicacion: 'Almacén Central',
        fechaAdquisicion: '2024-01-10',
        costo: 350.00,
        descripcion: 'Kit completo de herramientas eléctricas profesionales',
        fabricante: 'Klein Tools',
        modelo: 'KT-1000',
        serie: 'KLE001-2024'
    },
    {
        id: 4,
        nombre: 'Termómetro Infrarrojo Fluke 62 Max',
        categoria: 'Medición',
        estado: 'Disponible',
        disponible: true,
        ubicacion: 'Almacén Central',
        fechaAdquisicion: '2024-01-15',
        costo: 280.00,
        descripcion: 'Termómetro infrarrojo con láser para medición de temperatura',
        fabricante: 'Fluke',
        modelo: '62 Max',
        serie: 'FLK002-2024'
    },
    {
        id: 5,
        nombre: 'Analizador de Redes Fluke',
        categoria: 'Medición',
        estado: 'Disponible',
        disponible: true,
        ubicacion: 'Almacén Central',
        fechaAdquisicion: '2024-01-20',
        costo: 800.00,
        descripcion: 'Analizador de redes eléctricas para diagnóstico de calidad',
        fabricante: 'Fluke',
        modelo: '435',
        serie: 'FLK003-2024'
    },
    {
        id: 6,
        nombre: 'Cámara Termográfica FLIR',
        categoria: 'Medición',
        estado: 'En uso',
        disponible: false,
        ubicacion: 'En campo - Ana Torres',
        fechaAdquisicion: '2024-01-25',
        costo: 2500.00,
        descripcion: 'Cámara termográfica para análisis de temperatura',
        fabricante: 'FLIR',
        modelo: 'E8',
        serie: 'FLR001-2024'
    },
    {
        id: 7,
        nombre: 'Medidor de Aislamiento Megger',
        categoria: 'Medición',
        estado: 'Disponible',
        disponible: true,
        ubicacion: 'Almacén Central',
        fechaAdquisicion: '2024-01-30',
        costo: 600.00,
        descripcion: 'Medidor de resistencia de aislamiento portátil',
        fabricante: 'Megger',
        modelo: 'MIT1025',
        serie: 'MEG001-2024'
    },
    {
        id: 8,
        nombre: 'Generador de Señales Agilent',
        categoria: 'Medición',
        estado: 'Disponible',
        disponible: true,
        ubicacion: 'Almacén Central',
        fechaAdquisicion: '2024-02-01',
        costo: 900.00,
        descripcion: 'Generador de señales de función para pruebas',
        fabricante: 'Agilent',
        modelo: '33220A',
        serie: 'AGI001-2024'
    }
];

// Destinos y tarifas
const destinos = [
    {
        id: 1,
        destino: 'Quito',
        provincia: 'Pichincha',
        tarifaBase: 50.00,
        tarifaPorTecnico: 15.00,
        estado: 'Activo',
        coordenadas: { lat: -0.1807, lng: -78.4678 },
        zona: 'Sierra Norte',
        tiempoEstimado: '30 min'
    },
    {
        id: 2,
        destino: 'Guayaquil',
        provincia: 'Guayas',
        tarifaBase: 80.00,
        tarifaPorTecnico: 20.00,
        estado: 'Activo',
        coordenadas: { lat: -2.1894, lng: -79.8890 },
        zona: 'Costa',
        tiempoEstimado: '45 min'
    },
    {
        id: 3,
        destino: 'Cuenca',
        provincia: 'Azuay',
        tarifaBase: 100.00,
        tarifaPorTecnico: 25.00,
        estado: 'Activo',
        coordenadas: { lat: -2.9001, lng: -79.0059 },
        zona: 'Sierra Sur',
        tiempoEstimado: '60 min'
    },
    {
        id: 4,
        destino: 'Ambato',
        provincia: 'Tungurahua',
        tarifaBase: 60.00,
        tarifaPorTecnico: 18.00,
        estado: 'Activo',
        coordenadas: { lat: -1.2491, lng: -78.6198 },
        zona: 'Sierra Centro',
        tiempoEstimado: '40 min'
    },
    {
        id: 5,
        destino: 'Manta',
        provincia: 'Manabí',
        tarifaBase: 120.00,
        tarifaPorTecnico: 30.00,
        estado: 'Activo',
        coordenadas: { lat: -0.9500, lng: -80.7333 },
        zona: 'Costa',
        tiempoEstimado: '90 min'
    },
    {
        id: 6,
        destino: 'Machala',
        provincia: 'El Oro',
        tarifaBase: 110.00,
        tarifaPorTecnico: 28.00,
        estado: 'Activo',
        coordenadas: { lat: -3.2667, lng: -79.9667 },
        zona: 'Costa Sur',
        tiempoEstimado: '75 min'
    },
    {
        id: 7,
        destino: 'Riobamba',
        provincia: 'Chimborazo',
        tarifaBase: 90.00,
        tarifaPorTecnico: 22.00,
        estado: 'Activo',
        coordenadas: { lat: -1.6667, lng: -78.6333 },
        zona: 'Sierra Centro',
        tiempoEstimado: '50 min'
    }
];

// Fases de mantenimiento
const fasesMantenimiento = [
    { 
        id: 1, 
        nombre: 'Revisión inicial', 
        descripcion: 'Inspección visual y diagnóstico básico del equipo',
        orden: 1,
        obligatoria: true
    },
    { 
        id: 2, 
        nombre: 'Despiece', 
        descripcion: 'Desmontaje de componentes para inspección detallada',
        orden: 2,
        obligatoria: false
    },
    { 
        id: 3, 
        nombre: 'Pruebas', 
        descripcion: 'Pruebas de funcionamiento y mediciones técnicas',
        orden: 3,
        obligatoria: true
    },
    { 
        id: 4, 
        nombre: 'Reparación', 
        descripcion: 'Reparación o reemplazo de componentes defectuosos',
        orden: 4,
        obligatoria: false
    },
    { 
        id: 5, 
        nombre: 'Conclusiones', 
        descripcion: 'Documentación final y recomendaciones',
        orden: 5,
        obligatoria: true
    }
];

// Tickets del sistema con flujo completo
const tickets = [
    {
        id: 1,
        clienteId: 1,
        cliente: 'Empresa ABC S.A.',
        equipoId: 1,
        equipo: 'Generador Principal',
        tipo: 'Soporte',
        prioridad: 'Alta',
        estado: 'Abierto',
        tecnicoId: null,
        tecnico: 'Sin asignar',
        fechaCreacion: '2024-01-15',
        fechaAsignacion: null,
        fechaVisita: '2024-01-16',
        descripcion: 'El generador presenta fallas intermitentes en el arranque. Se requiere revisión urgente.',
        observaciones: '',
        fases: [],
        evidencias: [],
        solicitudHerramientas: null,
        solicitudViaticos: null,
        encuestaCompletada: false,
        informeGenerado: false,
        tiempoEstimado: '4 horas',
        costoEstimado: 200.00
    },
    {
        id: 8,
        clienteId: 5,
        cliente: 'Hotel Plaza Internacional',
        equipoId: 6,
        equipo: 'Sistema de Aire Acondicionado',
        tipo: 'Inspección',
        prioridad: 'Media',
        estado: 'Abierto',
        tecnicoId: null,
        tecnico: 'Sin asignar',
        fechaCreacion: '2024-01-16',
        fechaAsignacion: null,
        fechaVisita: '2024-01-17',
        descripcion: 'Inspección preventiva programada del sistema HVAC. Revisión de filtros y funcionamiento general.',
        observaciones: '',
        fases: [],
        evidencias: [],
        solicitudHerramientas: null,
        solicitudViaticos: null,
        encuestaCompletada: false,
        informeGenerado: false,
        tiempoEstimado: '2 horas',
        costoEstimado: 150.00
    },
    {
        id: 9,
        clienteId: 6,
        cliente: 'Centro Comercial Mall del Sol',
        equipoId: 7,
        equipo: 'Sistema de Iluminación LED',
        tipo: 'Responsabilidad',
        prioridad: 'Baja',
        estado: 'Abierto',
        tecnicoId: null,
        tecnico: 'Sin asignar',
        fechaCreacion: '2024-01-16',
        fechaAsignacion: null,
        fechaVisita: '2024-01-18',
        descripcion: 'Mantenimiento preventivo del sistema de iluminación LED. Verificación de conexiones y limpieza.',
        observaciones: '',
        fases: [],
        evidencias: [],
        solicitudHerramientas: null,
        solicitudViaticos: null,
        encuestaCompletada: false,
        informeGenerado: false,
        tiempoEstimado: '3 horas',
        costoEstimado: 120.00
    },
    {
        id: 10,
        clienteId: 1,
        cliente: 'Empresa ABC S.A.',
        equipoId: 5,
        equipo: 'UPS Industrial',
        tipo: 'Soporte',
        prioridad: 'Alta',
        estado: 'Abierto',
        tecnicoId: null,
        tecnico: 'Sin asignar',
        fechaCreacion: '2024-01-16',
        fechaAsignacion: null,
        fechaVisita: '2024-01-17',
        descripcion: 'El UPS presenta alarmas de batería baja. Se requiere revisión inmediata del sistema de respaldo.',
        observaciones: '',
        fases: [],
        evidencias: [],
        solicitudHerramientas: null,
        solicitudViaticos: null,
        encuestaCompletada: false,
        informeGenerado: false,
        tiempoEstimado: '3 horas',
        costoEstimado: 180.00
    },
    {
        id: 11,
        clienteId: 4,
        cliente: 'Empresa ABC S.A.',
        equipoId: 1,
        equipo: 'Generador Principal',
        tipo: 'Soporte',
        prioridad: 'Media',
        estado: 'En Proceso',
        tecnicoId: 1,
        tecnico: 'Carlos Pérez',
        fechaCreacion: '2024-01-14',
        fechaAsignacion: '2024-01-14',
        fechaVisita: '2024-01-15',
        descripcion: 'El generador presenta ruidos anormales durante el funcionamiento. Se requiere inspección técnica.',
        observaciones: 'Técnico asignado, en proceso de diagnóstico',
        fases: [
            {
                id: 1,
                nombre: 'Inspección Inicial',
                completada: true,
                fecha: '2024-01-15',
                observaciones: 'Se detectó desgaste en los cojinetes',
                valores: [
                    { parametro: 'Temperatura', valor: '85°C', unidad: 'Celsius' },
                    { parametro: 'Vibración', valor: '0.8 mm/s', unidad: 'mm/s' }
                ]
            }
        ],
        evidencias: ['foto_cojinetes_001.jpg', 'video_ruido_001.mp4'],
        solicitudHerramientas: null,
        solicitudViaticos: null,
        encuestaCompletada: false,
        informeGenerado: false,
        tiempoEstimado: '4 horas',
        costoEstimado: 200.00
    },
    {
        id: 12,
        clienteId: 4,
        cliente: 'Empresa ABC S.A.',
        equipoId: 5,
        equipo: 'UPS Industrial',
        tipo: 'Inspección',
        prioridad: 'Baja',
        estado: 'Pre-cerrado',
        tecnicoId: 2,
        tecnico: 'Ana Torres',
        fechaCreacion: '2024-01-10',
        fechaAsignacion: '2024-01-10',
        fechaVisita: '2024-01-11',
        descripcion: 'Inspección preventiva programada del sistema UPS. Verificación de baterías y funcionamiento general.',
        observaciones: 'Inspección completada, sistema funcionando correctamente',
        fases: [
            {
                id: 1,
                nombre: 'Inspección Inicial',
                completada: true,
                fecha: '2024-01-11',
                observaciones: 'Sistema funcionando correctamente'
            },
            {
                id: 2,
                nombre: 'Pruebas de Funcionamiento',
                completada: true,
                fecha: '2024-01-11',
                observaciones: 'Todas las pruebas pasaron exitosamente',
                valores: [
                    { parametro: 'Voltaje de Salida', valor: '220V', unidad: 'Voltios' },
                    { parametro: 'Frecuencia', valor: '60Hz', unidad: 'Hertz' },
                    { parametro: 'Tiempo de Respuesta', valor: '2ms', unidad: 'Milisegundos' }
                ]
            }
        ],
        evidencias: ['reporte_inspeccion_ups.pdf'],
        solicitudHerramientas: null,
        solicitudViaticos: null,
        encuestaCompletada: false,
        informeGenerado: false,
        tiempoEstimado: '2 horas',
        costoEstimado: 150.00
    },
    {
        id: 13,
        clienteId: 7,
        cliente: 'Industrias XYZ Ltda.',
        equipoId: 2,
        equipo: 'Transformador Principal',
        tipo: 'Soporte',
        prioridad: 'Alta',
        estado: 'Abierto',
        tecnicoId: null,
        tecnico: 'Sin asignar',
        fechaCreacion: '2024-01-17',
        fechaAsignacion: null,
        fechaVisita: null,
        descripcion: 'El transformador presenta sobrecalentamiento en una de las fases. Se requiere revisión urgente.',
        observaciones: '',
        fases: [],
        evidencias: [],
        solicitudHerramientas: null,
        solicitudViaticos: null,
        encuestaCompletada: false,
        informeGenerado: false,
        tiempoEstimado: '4 horas',
        costoEstimado: 300.00
    },
    {
        id: 2,
        clienteId: 2,
        cliente: 'Industrias XYZ Ltda.',
        equipoId: 2,
        equipo: 'Transformador Principal',
        tipo: 'Inspección',
        prioridad: 'Media',
        estado: 'En Proceso',
        tecnicoId: 2,
        tecnico: 'Ana Torres',
        fechaCreacion: '2024-01-14',
        fechaAsignacion: '2024-01-14',
        fechaVisita: '2024-01-15',
        descripcion: 'Sobrecalentamiento del transformador durante operación normal. Inspección programada.',
        observaciones: 'Se requiere revisión completa del sistema de enfriamiento',
        fases: [
            { 
                id: 1, 
                nombre: 'Revisión inicial', 
                completada: true, 
                fecha: '2024-01-15',
                observaciones: 'Inspección visual completada. Se detectó sobrecalentamiento en fase A.',
                evidencias: ['inspeccion1.jpg', 'medicion1.jpg'],
                valores: [
                    { parametro: 'Temperatura Fase A', valor: '85°C', unidad: 'Celsius' },
                    { parametro: 'Temperatura Fase B', valor: '72°C', unidad: 'Celsius' },
                    { parametro: 'Temperatura Fase C', valor: '75°C', unidad: 'Celsius' }
                ]
            },
            { 
                id: 2, 
                nombre: 'Pruebas', 
                completada: true, 
                fecha: '2024-01-15',
                observaciones: 'Pruebas de aislamiento realizadas. Valores dentro de parámetros.',
                evidencias: ['prueba1.jpg', 'prueba2.jpg'],
                valores: [
                    { parametro: 'Resistencia de Aislamiento', valor: '500 MΩ', unidad: 'Megaohm' },
                    { parametro: 'Factor de Potencia', valor: '0.95', unidad: 'Sin unidad' }
                ]
            },
            { 
                id: 3, 
                nombre: 'Reparación', 
                completada: false, 
                fecha: null,
                observaciones: '',
                evidencias: [],
                valores: []
            }
        ],
        evidencias: ['inspeccion1.jpg', 'medicion1.jpg', 'prueba1.jpg', 'prueba2.jpg'],
        solicitudHerramientas: {
            id: 1,
            herramientas: [1, 2],
            estado: 'Aprobada',
            fechaSolicitud: '2024-01-14',
            fechaAprobacion: '2024-01-14'
        },
        solicitudViaticos: {
            id: 1,
            destino: 'Guayaquil',
            cantidadTecnicos: 1,
            tarifaBase: 80.00,
            tarifaPorTecnico: 20.00,
            total: 100.00,
            estado: 'Aprobada',
            fechaSolicitud: '2024-01-14',
            fechaAprobacion: '2024-01-14'
        },
        encuestaCompletada: false,
        informeGenerado: false
    },
    {
        id: 3,
        clienteId: 3,
        cliente: 'Complejo Industrial DEF',
        equipoId: 3,
        equipo: 'Sistema de Refrigeración',
        tipo: 'Responsabilidad',
        prioridad: 'Baja',
        estado: 'Pre-cerrado',
        tecnicoId: 3,
        tecnico: 'Luis García',
        fechaCreacion: '2024-01-10',
        fechaAsignacion: '2024-01-10',
        fechaVisita: '2024-01-11',
        descripcion: 'Mantenimiento preventivo programado del sistema de refrigeración.',
        observaciones: 'Mantenimiento completado exitosamente. Sistema funcionando correctamente.',
        fases: [
            { 
                id: 1, 
                nombre: 'Revisión inicial', 
                completada: true, 
                fecha: '2024-01-11',
                observaciones: 'Inspección general del sistema completada.',
                evidencias: ['revision1.jpg'],
                valores: []
            },
            { 
                id: 2, 
                nombre: 'Pruebas', 
                completada: true, 
                fecha: '2024-01-11',
                observaciones: 'Pruebas de funcionamiento realizadas correctamente.',
                evidencias: ['prueba3.jpg'],
                valores: [
                    { parametro: 'Temperatura de Salida', valor: '4°C', unidad: 'Celsius' },
                    { parametro: 'Presión de Trabajo', valor: '2.5 bar', unidad: 'Bar' }
                ]
            },
            { 
                id: 3, 
                nombre: 'Reparación', 
                completada: true, 
                fecha: '2024-01-12',
                observaciones: 'Limpieza y lubricación de componentes realizadas.',
                evidencias: ['reparacion1.jpg'],
                valores: []
            },
            { 
                id: 4, 
                nombre: 'Conclusiones', 
                completada: true, 
                fecha: '2024-01-12',
                observaciones: 'Sistema en perfecto estado. Próximo mantenimiento en 30 días.',
                evidencias: ['final1.jpg'],
                valores: []
            }
        ],
        evidencias: ['revision1.jpg', 'prueba3.jpg', 'reparacion1.jpg', 'final1.jpg'],
        solicitudHerramientas: {
            id: 2,
            herramientas: [3, 4],
            estado: 'Aprobada',
            fechaSolicitud: '2024-01-10',
            fechaAprobacion: '2024-01-10'
        },
        solicitudViaticos: {
            id: 2,
            destino: 'Cuenca',
            cantidadTecnicos: 1,
            tarifaBase: 100.00,
            tarifaPorTecnico: 25.00,
            total: 125.00,
            estado: 'Aprobada',
            fechaSolicitud: '2024-01-10',
            fechaAprobacion: '2024-01-10'
        },
        encuestaCompletada: false,
        informeGenerado: true
    },
    {
        id: 4,
        clienteId: 4,
        cliente: 'Fábrica GHI S.A.',
        equipoId: 4,
        equipo: 'Compresor Industrial',
        tipo: 'Soporte',
        prioridad: 'Alta',
        estado: 'Cerrado',
        tecnicoId: 4,
        tecnico: 'María López',
        fechaCreacion: '2024-01-05',
        fechaAsignacion: '2024-01-05',
        fechaVisita: '2024-01-06',
        descripcion: 'Falla total del compresor - requiere reemplazo de componentes principales.',
        observaciones: 'Ticket cerrado. Compresor reemplazado y funcionando correctamente.',
        fases: [
            { 
                id: 1, 
                nombre: 'Revisión inicial', 
                completada: true, 
                fecha: '2024-01-06',
                observaciones: 'Diagnóstico: falla en motor principal.',
                evidencias: ['falla1.jpg'],
                valores: []
            },
            { 
                id: 2, 
                nombre: 'Despiece', 
                completada: true, 
                fecha: '2024-01-06',
                observaciones: 'Desmontaje completo para inspección.',
                evidencias: ['despiece1.jpg', 'despiece2.jpg'],
                valores: []
            },
            { 
                id: 3, 
                nombre: 'Pruebas', 
                completada: true, 
                fecha: '2024-01-07',
                observaciones: 'Pruebas de componentes realizadas.',
                evidencias: ['prueba4.jpg'],
                valores: [
                    { parametro: 'Resistencia del Motor', valor: '0 Ω', unidad: 'Ohm' },
                    { parametro: 'Aislamiento', valor: '0 MΩ', unidad: 'Megaohm' }
                ]
            },
            { 
                id: 4, 
                nombre: 'Reparación', 
                completada: true, 
                fecha: '2024-01-07',
                observaciones: 'Motor principal reemplazado.',
                evidencias: ['reparacion2.jpg', 'reparacion3.jpg'],
                valores: []
            },
            { 
                id: 5, 
                nombre: 'Conclusiones', 
                completada: true, 
                fecha: '2024-01-08',
                observaciones: 'Compresor funcionando correctamente. Garantía de 6 meses.',
                evidencias: ['final2.jpg'],
                valores: []
            }
        ],
        evidencias: ['falla1.jpg', 'despiece1.jpg', 'despiece2.jpg', 'prueba4.jpg', 'reparacion2.jpg', 'reparacion3.jpg', 'final2.jpg'],
        solicitudHerramientas: {
            id: 3,
            herramientas: [1, 2, 3],
            estado: 'Aprobada',
            fechaSolicitud: '2024-01-05',
            fechaAprobacion: '2024-01-05'
        },
        solicitudViaticos: {
            id: 3,
            destino: 'Quito',
            cantidadTecnicos: 1,
            tarifaBase: 50.00,
            tarifaPorTecnico: 15.00,
            total: 65.00,
            estado: 'Aprobada',
            fechaSolicitud: '2024-01-05',
            fechaAprobacion: '2024-01-05'
        },
        encuestaCompletada: true,
        informeGenerado: true
    }
];

// Solicitudes de herramientas y viáticos
const solicitudes = [
    {
        id: 1,
        ticketId: 2,
        tecnicoId: 2,
        tecnico: 'Ana Torres',
        herramientas: [
            { id: 1, nombre: 'Multímetro Digital', cantidad: 1 },
            { id: 2, nombre: 'Osciloscopio Portátil', cantidad: 1 }
        ],
        viaticos: {
            destino: 'Guayaquil',
            cantidadTecnicos: 1,
            tarifaBase: 80.00,
            tarifaPorTecnico: 20.00,
            total: 100.00
        },
        estado: 'Aprobada',
        fechaSolicitud: '2024-01-14',
        fechaAprobacion: '2024-01-14',
        aprobadoPor: 'María González'
    },
    {
        id: 2,
        ticketId: 3,
        tecnicoId: 3,
        tecnico: 'Luis García',
        herramientas: [
            { id: 3, nombre: 'Kit de Herramientas Eléctricas', cantidad: 1 },
            { id: 4, nombre: 'Termómetro Infrarrojo', cantidad: 1 }
        ],
        viaticos: {
            destino: 'Cuenca',
            cantidadTecnicos: 1,
            tarifaBase: 100.00,
            tarifaPorTecnico: 25.00,
            total: 125.00
        },
        estado: 'Aprobada',
        fechaSolicitud: '2024-01-10',
        fechaAprobacion: '2024-01-10',
        aprobadoPor: 'María González'
    },
    {
        id: 3,
        ticketId: 4,
        tecnicoId: 4,
        tecnico: 'María López',
        herramientas: [
            { id: 1, nombre: 'Multímetro Digital', cantidad: 1 },
            { id: 2, nombre: 'Osciloscopio Portátil', cantidad: 1 },
            { id: 3, nombre: 'Kit de Herramientas Eléctricas', cantidad: 1 }
        ],
        viaticos: {
            destino: 'Quito',
            cantidadTecnicos: 1,
            tarifaBase: 50.00,
            tarifaPorTecnico: 15.00,
            total: 65.00
        },
        estado: 'Aprobada',
        fechaSolicitud: '2024-01-05',
        fechaAprobacion: '2024-01-05',
        aprobadoPor: 'María González'
    }
];

// Parámetros de encuesta de satisfacción
const parametrosEncuesta = {
    preguntas: [
        {
            id: 1,
            texto: '¿Cómo califica la puntualidad del técnico?',
            tipo: 'estrellas',
            obligatoria: true,
            escala: 5
        },
        {
            id: 2,
            texto: '¿Qué tan satisfecho está con la comunicación del técnico?',
            tipo: 'escala',
            obligatoria: true,
            escala: 10
        },
        {
            id: 3,
            texto: '¿Cómo califica la calidad del servicio recibido?',
            tipo: 'estrellas',
            obligatoria: true,
            escala: 5
        },
        {
            id: 4,
            texto: '¿Recomendaría nuestros servicios a otras empresas?',
            tipo: 'si_no',
            obligatoria: true
        },
        {
            id: 5,
            texto: 'Comentarios adicionales sobre el servicio:',
            tipo: 'texto',
            obligatoria: false
        }
    ]
};

// Encuestas de satisfacción completadas
const encuestas = [
    {
        id: 1,
        ticketId: 4,
        clienteId: 4,
        cliente: 'Fábrica GHI S.A.',
        fecha: '2024-01-09',
        respuestas: {
            puntualidad: 5,
            comunicacion: 9,
            calidad: 5,
            recomendacion: true,
            comentarios: 'Excelente servicio, técnico muy profesional y resolutivo. El problema se solucionó rápidamente.'
        },
        completada: true,
        calificacionPromedio: 4.8
    }
];

// Reportes e informes generados
const reportes = [
    {
        id: 1,
        nombre: 'Informe Técnico - Ticket #4 - Compresor Industrial',
        tipo: 'Técnico',
        clienteId: 4,
        cliente: 'Fábrica GHI S.A.',
        ticketId: 4,
        fechaGeneracion: '2024-01-08',
        estado: 'Completado',
        archivo: 'informe_ticket_4_20240108.pdf',
        tamaño: '2.5 MB'
    },
    {
        id: 2,
        nombre: 'Reporte Mensual - Enero 2024',
        tipo: 'Mensual',
        clienteId: null,
        cliente: 'Todos los clientes',
        ticketId: null,
        fechaGeneracion: '2024-01-31',
        estado: 'Completado',
        archivo: 'reporte_mensual_enero_2024.pdf',
        tamaño: '5.2 MB'
    },
    {
        id: 3,
        nombre: 'Reporte de Satisfacción del Cliente - Q1 2024',
        tipo: 'Satisfacción',
        clienteId: null,
        cliente: 'Todos los clientes',
        ticketId: null,
        fechaGeneracion: '2024-03-31',
        estado: 'En proceso',
        archivo: null,
        tamaño: null
    }
];

// Notificaciones del sistema
const notificaciones = [
    {
        id: 1,
        usuarioId: 2,
        titulo: 'Nuevo Ticket Asignado',
        mensaje: 'Se ha asignado el ticket #2 - Transformador Principal a Ana Torres',
        tipo: 'asignacion',
        leida: false,
        fecha: '2024-01-14 10:30',
        prioridad: 'media'
    },
    {
        id: 2,
        usuarioId: 3,
        titulo: 'Solicitud de Herramientas Aprobada',
        mensaje: 'Su solicitud de herramientas para el ticket #2 ha sido aprobada',
        tipo: 'aprobacion',
        leida: false,
        fecha: '2024-01-14 11:00',
        prioridad: 'baja'
    },
    {
        id: 3,
        usuarioId: 4,
        titulo: 'Ticket Pre-cerrado',
        mensaje: 'El ticket #3 ha sido marcado como pre-cerrado. Por favor complete la encuesta de satisfacción',
        tipo: 'encuesta',
        leida: false,
        fecha: '2024-01-12 16:45',
        prioridad: 'alta'
    },
    {
        id: 4,
        usuarioId: 1,
        titulo: 'Nuevo Ticket Creado',
        mensaje: 'Se ha creado el ticket #8 - Sistema de Aire Acondicionado por Hotel Plaza Internacional',
        tipo: 'nuevo_ticket',
        leida: false,
        fecha: '2024-01-16 09:15',
        prioridad: 'media'
    },
    {
        id: 5,
        usuarioId: 2,
        titulo: 'Ticket Requiere Asignación',
        mensaje: 'El ticket #1 - Generador Principal requiere asignación urgente (Prioridad Alta)',
        tipo: 'asignacion',
        leida: false,
        fecha: '2024-01-16 09:20',
        prioridad: 'alta'
    },
    {
        id: 6,
        usuarioId: 5,
        titulo: 'Solicitud de Viáticos Aprobada',
        mensaje: 'Su solicitud de viáticos para Cuenca ha sido aprobada por $125.00',
        tipo: 'aprobacion',
        leida: false,
        fecha: '2024-01-15 14:30',
        prioridad: 'baja'
    },
    {
        id: 7,
        usuarioId: 6,
        titulo: 'Ticket Completado',
        mensaje: 'El ticket #4 - Compresor Industrial ha sido completado exitosamente',
        tipo: 'completado',
        leida: false,
        fecha: '2024-01-15 16:45',
        prioridad: 'media'
    },
    {
        id: 8,
        usuarioId: 1,
        titulo: 'Reporte Generado',
        mensaje: 'Se ha generado el reporte mensual de enero 2024',
        tipo: 'reporte',
        leida: false,
        fecha: '2024-01-31 18:00',
        prioridad: 'baja'
    },
    {
        id: 9,
        usuarioId: 4,
        titulo: 'Encuesta Completada',
        mensaje: 'Gracias por completar la encuesta de satisfacción del ticket #4',
        tipo: 'encuesta',
        leida: true,
        fecha: '2024-01-09 17:30',
        prioridad: 'baja'
    },
    {
        id: 10,
        usuarioId: 2,
        titulo: 'Técnico No Disponible',
        mensaje: 'Carlos Pérez no está disponible. Asigne otro técnico para el ticket #1',
        tipo: 'asignacion',
        leida: false,
        fecha: '2024-01-16 10:45',
        prioridad: 'alta'
    }
];

// Función para obtener datos del localStorage o usar datos por defecto
function getData(key, defaultValue) {
    try {
        const stored = localStorage.getItem('tat_' + key);
        return stored ? JSON.parse(stored) : defaultValue;
    } catch (error) {
        console.error('Error al obtener datos:', error);
        return defaultValue;
    }
}

// Función para guardar datos en localStorage
function saveData(key, data) {
    try {
        localStorage.setItem('tat_' + key, JSON.stringify(data));
        return true;
    } catch (error) {
        console.error('Error al guardar datos:', error);
        return false;
    }
}

// Función para generar ID único
function generateId() {
    return Date.now() + Math.random().toString(36).substr(2, 9);
}

// Función para inicializar datos por defecto
function initializeData() {
    // Verificar si ya existen datos
    if (localStorage.getItem('tat_usuarios')) {
        return; // Los datos ya están inicializados
    }
    
    // Guardar datos por defecto
    saveData('usuarios', usuarios);
    saveData('clientes', clientes);
    saveData('equipos', equipos);
    saveData('tecnicos', tecnicos);
    saveData('herramientas', herramientas);
    saveData('destinos', destinos);
    saveData('tickets', tickets);
    saveData('solicitudes', solicitudes);
    saveData('encuestas', encuestas);
    saveData('reportes', reportes);
    saveData('notificaciones', notificaciones);
    saveData('fasesMantenimiento', fasesMantenimiento);
    
    console.log('Datos inicializados correctamente');
}

// Inicializar datos al cargar el script
initializeData();

// Función para formatear fechas
function formatDate(date) {
    return new Date(date).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });
}

// Función para formatear moneda
function formatCurrency(amount) {
    return new Intl.NumberFormat('es-EC', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

// Función para calcular tarifas
function calculateTarifa(destinoId, cantidadTecnicos) {
    const destino = destinos.find(d => d.id === destinoId);
    if (!destino) return 0;
    
    return destino.tarifaBase + (destino.tarifaPorTecnico * cantidadTecnicos);
}


// Función para enviar notificación por correo (simulada)
function sendEmailNotification(destinatario, asunto, mensaje) {
    console.log(`📧 Email enviado a: ${destinatario}`);
    console.log(`📧 Asunto: ${asunto}`);
    console.log(`📧 Mensaje: ${mensaje}`);
    
    // En producción, aquí se integraría con un servicio de email real
    return true;
}

// Inicializar datos en localStorage si no existen
function initializeData() {
    const dataKeys = [
        'usuarios', 'clientes', 'equipos', 'tecnicos', 'herramientas', 
        'destinos', 'fasesMantenimiento', 'tickets', 'solicitudes', 
        'parametrosEncuesta', 'encuestas', 'reportes', 'notificaciones'
    ];
    
    dataKeys.forEach(key => {
        if (!localStorage.getItem(key)) {
            const data = eval(key);
            saveData(key, data);
        }
    });
}

// Inicializar datos al cargar la página
document.addEventListener('DOMContentLoaded', initializeData);