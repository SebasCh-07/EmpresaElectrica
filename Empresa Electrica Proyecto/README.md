# 🛠️ Plataforma TAT - Sistema de Gestión de Soporte Técnico

## 📋 Descripción del Proyecto

La **Plataforma TAT** es un sistema web completo para la gestión de soporte técnico, diseñado para empresas que brindan servicios de mantenimiento y reparación de equipos eléctricos e industriales. El sistema permite gestionar tickets, clientes, técnicos, equipos y generar reportes de manera eficiente.

## 🏗️ Arquitectura del Proyecto

### Estructura de Carpetas
```
Plataforma TAT/
├── 📁 css/                    # Estilos CSS modulares
│   ├── base.css              # Estilos base y variables
│   ├── components.css        # Componentes reutilizables
│   ├── layout.css           # Estilos de layout y estructura
│   └── tickets.css          # Estilos específicos de tickets
├── 📁 js/                    # JavaScript modular
│   ├── core.js              # Funcionalidades principales
│   ├── utils.js             # Utilidades y funciones auxiliares
│   ├── dashboard.js         # Funcionalidades del dashboard
│   ├── tickets.js           # Gestión de tickets
│   └── data-loaders.js      # Cargadores de datos
├── 📁 views/                 # Vistas HTML separadas
│   ├── login.html           # Pantalla de login
│   ├── dashboard.html       # Dashboard principal
│   ├── tickets.html         # Gestión de tickets
│   ├── ticket-detail.html   # Detalle de ticket
│   ├── ticket-form.html     # Formulario técnico
│   ├── clientes.html        # Gestión de clientes
│   ├── equipos.html         # Gestión de equipos
│   ├── tecnicos.html        # Gestión de técnicos
│   ├── geolocalizacion.html # Ubicación de técnicos
│   └── encuesta.html        # Encuesta de satisfacción
├── 📁 assets/                # Recursos estáticos
├── 📄 index.html            # Archivo principal
├── 📄 data.js               # Datos mock del sistema
├── 📄 data-loaders.js       # Cargadores de datos (legacy)
└── 📄 README.md             # Documentación del proyecto
```

## 🚀 Características Principales

### 👥 Gestión de Usuarios y Roles
- **Administrador**: Acceso completo al sistema
- **Mesa de Ayuda**: Gestión de tickets y asignaciones
- **Técnico**: Ejecución de trabajos de campo
- **Cliente**: Consulta de tickets y encuestas

### 🎫 Sistema de Tickets
- Creación de tickets por clientes y mesa de ayuda
- Asignación automática de técnicos
- Seguimiento de estados (Abierto → En Proceso → Pre-cerrado → Cerrado)
- Formularios técnicos con fases de mantenimiento
- Evidencias fotográficas y documentación
- Notificaciones automáticas

### 🏢 Gestión de Entidades
- **Clientes**: Información completa de empresas
- **Equipos**: Inventario de equipos por cliente
- **Técnicos**: Gestión de personal técnico interno y externo
- **Herramientas**: Control de inventario de herramientas
- **Destinos**: Tarifas por ubicación geográfica

### 📊 Dashboard Inteligente
- Métricas en tiempo real según el rol del usuario
- Tarjetas informativas con estadísticas clave
- Acciones rápidas contextuales
- Visualización de tickets recientes y urgentes

### 🗺️ Geolocalización
- Mapa interactivo de ubicación de técnicos
- Estados en tiempo real (Disponible, En Campo, En Oficina)
- Leyenda visual para identificación rápida

### 📋 Encuestas de Satisfacción
- Sistema de evaluación post-servicio
- Parámetros configurables (Puntualidad, Comunicación, Calidad)
- Escalas de calificación personalizables
- Generación automática de reportes

## 🎨 Diseño y UX

### Paleta de Colores
- **Primario**: #1e3c72 (Azul corporativo)
- **Secundario**: #17a2b8 (Turquesa)
- **Acento**: #ffc107 (Amarillo)
- **Éxito**: #28a745 (Verde)
- **Peligro**: #dc3545 (Rojo)
- **Advertencia**: #ffc107 (Amarillo)

### Características de Diseño
- **Responsive**: Adaptable a dispositivos móviles y tablets
- **Modular**: CSS organizado en módulos específicos
- **Accesible**: Cumple estándares de accesibilidad web
- **Moderno**: Interfaz limpia y profesional
- **Animaciones**: Transiciones suaves y feedback visual

## 🛠️ Tecnologías Utilizadas

### Frontend
- **HTML5**: Estructura semántica
- **CSS3**: Estilos modulares con variables CSS
- **JavaScript ES6+**: Funcionalidades dinámicas
- **Font Awesome**: Iconografía
- **Leaflet.js**: Mapas interactivos

### Arquitectura
- **SPA (Single Page Application)**: Navegación sin recarga
- **Modular**: Código organizado en módulos específicos
- **LocalStorage**: Persistencia de datos local
- **Event-Driven**: Comunicación basada en eventos

## 📱 Responsive Design

### Breakpoints
- **Desktop**: > 768px
- **Tablet**: 768px - 1024px
- **Mobile**: < 768px

### Adaptaciones Móviles
- Sidebar colapsable
- Tablas con scroll horizontal
- Botones de acción apilados
- Formularios optimizados para touch

## 🔧 Instalación y Uso

### Requisitos
- Navegador web moderno (Chrome, Firefox, Safari, Edge)
- Servidor web local (opcional)

### Instalación
1. Clonar o descargar el proyecto
2. Abrir `index.html` en un navegador web
3. Usar las credenciales de prueba para acceder

### Credenciales de Prueba
```
admin / 1234     (Administrador)
mesa / 1234      (Mesa de Ayuda)
tecnico / 1234   (Carlos Pérez - Técnico)
tecnico2 / 1234  (Ana Torres - Técnico)
tecnico3 / 1234  (Luis García - Técnico)
cliente / 1234   (Empresa ABC S.A.)
cliente2 / 1234  (Industrias XYZ Ltda.)
```

## 📊 Datos de Prueba

El sistema incluye datos mock completos para demostración:
- **10+ Usuarios** con diferentes roles
- **15+ Clientes** empresariales
- **20+ Equipos** industriales
- **10+ Técnicos** especializados
- **50+ Herramientas** categorizadas
- **15+ Destinos** con tarifas
- **20+ Tickets** en diferentes estados
- **Notificaciones** del sistema

## 🔄 Flujo de Trabajo

### Para Clientes
1. **Login** → Dashboard personalizado
2. **Crear Ticket** → Sin fecha de visita (asignada por mesa)
3. **Seguimiento** → Ver estado de tickets
4. **Encuesta** → Completar evaluación post-servicio

### Para Mesa de Ayuda
1. **Login** → Dashboard con métricas
2. **Gestionar Tickets** → Asignar técnicos y fechas
3. **Supervisar** → Ver ubicación de técnicos
4. **Reportes** → Generar informes

### Para Técnicos
1. **Login** → Ver tickets asignados
2. **Trabajar** → Completar formularios técnicos
3. **Evidencias** → Subir fotos y documentación
4. **Solicitudes** → Pedir herramientas y viáticos

## 🎯 Funcionalidades por Rol

### 👑 Administrador
- Acceso completo a todos los módulos
- Gestión de usuarios y roles
- Configuración del sistema
- Reportes y estadísticas globales

### 🎧 Mesa de Ayuda
- Gestión de tickets
- Asignación de técnicos
- Programación de visitas
- Supervisión de ubicaciones

### 🔧 Técnico
- Ver tickets asignados
- Completar formularios técnicos
- Subir evidencias
- Solicitar recursos

### 🏢 Cliente
- Crear tickets
- Seguimiento de servicios
- Completar encuestas
- Descargar reportes

## 📈 Métricas y KPIs

### Dashboard Administrador
- Tickets abiertos/en proceso/cerrados
- Total de clientes registrados
- Técnicos disponibles
- Solicitudes pendientes

### Dashboard Mesa de Ayuda
- Tickets pendientes de asignación
- Técnicos disponibles
- Solicitudes por aprobar

### Dashboard Técnico
- Tickets asignados
- Trabajos en proceso
- Solicitudes realizadas

### Dashboard Cliente
- Tickets activos
- Servicios completados
- Encuestas pendientes

## 🔮 Características Técnicas

### Rendimiento
- Carga rápida de páginas
- Lazy loading de componentes
- Optimización de imágenes
- Caché local eficiente

### Seguridad
- Autenticación por roles
- Validación de formularios
- Sanitización de datos
- Control de acceso granular

### Mantenibilidad
- Código modular y documentado
- Separación de responsabilidades
- Patrones de diseño consistentes
- Estructura escalable

## 🚀 Próximas Mejoras

### Funcionalidades Planificadas
- [ ] Integración con APIs reales
- [ ] Notificaciones push
- [ ] Chat en tiempo real
- [ ] Reportes avanzados
- [ ] Integración con calendarios
- [ ] App móvil nativa

### Mejoras Técnicas
- [ ] PWA (Progressive Web App)
- [ ] Service Workers
- [ ] Offline support
- [ ] Testing automatizado
- [ ] CI/CD pipeline

## 📞 Soporte

Para soporte técnico o consultas sobre el proyecto:
- **Email**: soporte@plataformatat.com
- **Documentación**: Ver archivos README específicos
- **Issues**: Reportar en el repositorio del proyecto

## 📄 Licencia

Este proyecto está desarrollado para uso interno de la empresa. Todos los derechos reservados.

---

**Plataforma TAT v1.0.0** - Sistema de Gestión de Soporte Técnico