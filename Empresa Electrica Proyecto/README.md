# Sistema de Gestión de Empresa Eléctrica

Un sistema completo de gestión de tickets para empresas eléctricas con 4 roles de usuario diferentes.

## 🚀 Características Principales

### Roles del Sistema

1. **Administrador**
   - Control total del sistema
   - Gestión de todos los tickets
   - Administración de clientes y técnicos
   - Acceso al mapa de geolocalización
   - Estadísticas completas del sistema

2. **Mesa de Ayuda**
   - Recepción de tickets de clientes
   - Asignación de tickets a técnicos
   - Seguimiento del estado de trabajos
   - Acceso al mapa de geolocalización
   - Gestión de prioridades

3. **Técnicos**
   - Visualización de tickets asignados
   - Actualización del estado de trabajos
   - Solicitud de viáticos para trabajos interprovinciales
   - Completado de rúbricas de trabajo
   - Gestión de su disponibilidad

4. **Clientes**
   - Creación de tickets de servicio
   - Seguimiento del estado de sus solicitudes
   - Completado de encuestas de satisfacción
   - Descarga de informes finales

## 🔄 Flujo de Trabajo

### Flujo Principal del Proceso

1. **Inicio del caso**
   - Cliente solicita atención o mesa de ayuda genera el ticket
   - Se registra el tipo de caso: soporte, inspección o responsabilidad

2. **Asignación de recursos**
   - Mesa de ayuda/jefe técnico asigna:
     - Técnico responsable
     - Fecha de visita
     - Prioridad del caso
   - Notificación automática al técnico

3. **Visita técnica**
   - Técnico llega al lugar y llena formulario según tipo de ticket
   - Puede solicitar herramientas y viáticos desde el sistema
   - Adjunta observaciones, fotos y datos de la visita

4. **Pre-cierre técnico**
   - Técnico marca el caso como pre-cerrado
   - Sistema registra fecha/hora y genera informe preliminar

5. **Revisión y encuesta del cliente**
   - Cliente recibe notificación y revisa el ticket
   - Completa encuesta de satisfacción del servicio
   - Solo al llenar la encuesta puede descargar el informe PDF

6. **Cierre del caso**
   - Ticket pasa a estado cerrado
   - Se genera el informe final (PDF) disponible en carpeta del cliente

### Estados del Sistema
- **Pendiente**: Ticket creado, esperando asignación
- **Asignado**: Asignado a técnico con fecha de visita
- **En Curso**: Técnico trabajando en el sitio
- **Pre-Cerrado**: Formulario de visita completado, esperando encuesta
- **Finalizado**: Encuesta completada, informe disponible
- **Cancelado**: Ticket cancelado

## 🛠️ Tecnologías Utilizadas

- **HTML5** - Estructura semántica
- **CSS3** - Estilos modernos y responsivos
- **JavaScript ES6+** - Lógica de la aplicación
- **Leaflet.js** - Mapas interactivos
- **Font Awesome** - Iconografía

## 📁 Estructura del Proyecto

```
├── index.html              # Página principal (redirige a login)
├── login.html              # Pantalla de autenticación
├── admin.html              # Panel de administrador
├── mesa-ayuda.html         # Panel de mesa de ayuda
├── tecnico.html            # Panel de técnico
├── cliente.html            # Panel de cliente
├── css/
│   ├── base.css           # Estilos base y reset
│   ├── layout.css         # Layout y estructura
│   ├── components.css     # Componentes reutilizables
│   └── tickets.css        # Estilos específicos de tickets
├── js/
│   ├── data.js           # Datos de prueba y gestión
│   ├── utils.js          # Utilidades generales
│   ├── auth.js           # Sistema de autenticación
│   ├── dashboard.js      # Dashboards por rol
│   ├── tickets.js        # Gestión de tickets
│   ├── data-loaders.js   # Cargadores de vistas
│   ├── shared-functions.js # Funciones compartidas
│   ├── admin-app.js      # Aplicación específica admin
│   ├── mesa-ayuda-app.js # Aplicación específica mesa de ayuda
│   ├── tecnico-app.js    # Aplicación específica técnico
│   └── cliente-app.js    # Aplicación específica cliente
└── README.md             # Documentación
```

## 🚀 Instalación y Uso

1. **Clonar o descargar** el proyecto
2. **Abrir** `index.html` en un navegador web moderno (redirige automáticamente a login)
3. **Usar las credenciales de prueba**:

### Cuentas de Prueba

| Rol | Usuario | Contraseña | Descripción |
|-----|---------|------------|-------------|
| Admin | `admin` | `admin123` | Control total del sistema |
| Mesa de Ayuda | `mesa` | `mesa123` | Gestión de tickets y asignaciones |
| Técnico | `tecnico1` | `tecnico123` | Trabajo en campo |
| Cliente | `cliente1` | `cliente123` | Solicitudes de servicio |

## 📋 Funcionalidades por Rol

### 👨‍💼 Administrador
- ✅ Dashboard con estadísticas completas
- ✅ Gestión de todos los tickets
- ✅ Administración de clientes
- ✅ Administración de técnicos
- ✅ Mapa de geolocalización en tiempo real
- ✅ Control de equipos de trabajo

### 🎧 Mesa de Ayuda
- ✅ Dashboard con tickets pendientes
- ✅ Asignación de tickets a técnicos
- ✅ Seguimiento de trabajos
- ✅ Mapa de geolocalización
- ✅ Gestión de prioridades

### 🔧 Técnicos
- ✅ Dashboard con tickets asignados
- ✅ Inicio y gestión de trabajos
- ✅ Solicitud de viáticos
- ✅ Completado de rúbricas
- ✅ Actualización de estado

### 👤 Clientes
- ✅ Dashboard con sus tickets
- ✅ Creación de nuevos tickets
- ✅ Seguimiento de trabajos
- ✅ Encuestas de satisfacción
- ✅ Descarga de informes

## 🎯 Tipos de Casos/Tickets

- **Soporte**: Asistencia técnica y resolución de problemas
- **Inspección**: Verificación y evaluación de instalaciones
- **Responsabilidad**: Revisión de daños y responsabilidades

## 🗺️ Sistema de Geolocalización

- Mapa en tiempo real para Admin y Mesa de Ayuda
- Ubicación actual de técnicos
- Estado de disponibilidad
- Información de trabajos activos

## 💰 Sistema de Viáticos

- Solicitud automática para trabajos interprovinciales
- Aprobación por Mesa de Ayuda
- Seguimiento de gastos
- Integración con el flujo de trabajo

## 📋 Formulario de Visita

- Verificación de seguridad
- Herramientas utilizadas en la visita
- Estado del trabajo realizado
- Problemas o irregularidades encontradas
- Próximos pasos o recomendaciones
- Observaciones generales de la visita
- Fotos adjuntas de la visita

## ⭐ Encuestas de Satisfacción

- Calificación del servicio (obligatoria para descargar informe)
- Calidad del trabajo
- Puntualidad
- Comunicación
- Recomendación
- Comentarios adicionales
- **Importante**: Solo al completar la encuesta se puede descargar el informe PDF

## 🔧 Características Técnicas

- **Responsive Design**: Compatible con dispositivos móviles
- **Modo Oscuro**: Preparado para implementación futura
- **Notificaciones**: Sistema de toast notifications
- **Búsqueda y Filtros**: Búsqueda avanzada en todos los módulos
- **Validación de Formularios**: Validación en tiempo real
- **Datos de Prueba**: Sistema completamente funcional con datos mock

## 🚀 Próximas Mejoras

- [ ] Integración con base de datos real
- [ ] Sistema de notificaciones push
- [ ] Chat en tiempo real
- [ ] Reportes avanzados
- [ ] Integración con sistemas de pago
- [ ] App móvil nativa
- [ ] Sistema de backup automático

## 📝 Notas de Desarrollo

Este sistema está diseñado para ser completamente funcional con datos de prueba. Todas las funcionalidades principales están implementadas y pueden ser probadas inmediatamente.

Para implementar en producción, será necesario:
1. Conectar con una base de datos real
2. Implementar autenticación segura
3. Agregar validaciones del lado del servidor
4. Configurar notificaciones reales
5. Implementar sistema de archivos para adjuntos

## 🤝 Contribuciones

Este proyecto está abierto a contribuciones. Para sugerir mejoras o reportar bugs, por favor crear un issue en el repositorio.

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo LICENSE para más detalles.

---

**Desarrollado para Empresa Eléctrica** ⚡
