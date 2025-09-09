// Generador de PDFs para el sistema de tickets

class PDFGenerator {
    constructor() {
        this.companyInfo = {
            name: 'Empresa Eléctrica',
            address: 'Av. Principal 123, Ciudad',
            phone: '+1234567890',
            email: 'info@empresaelectrica.com'
        };
    }

    // Generar PDF individual de ticket
    generateTicketPDF(ticketId) {
        const ticket = DataManager.getTicketById(ticketId);
        if (!ticket) {
            Utils.showToast('Ticket no encontrado', 'error');
            return;
        }

        const client = DataManager.getUserById(ticket.clientId);
        const technician = ticket.assignedTechnicianId ? 
            DataManager.getUserById(ticket.assignedTechnicianId) : null;

        // Crear instancia de jsPDF
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        // Configurar fuente
        doc.setFont('helvetica');

        // Header de la empresa
        this.addCompanyHeader(doc);

        // Título del reporte
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text('INFORME DE TICKET DE SOPORTE', 20, 60);

        // Información del ticket
        let yPos = 80;
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('INFORMACIÓN DEL TICKET', 20, yPos);
        
        yPos += 10;
        doc.setFont('helvetica', 'normal');
        doc.text(`ID del Ticket: ${ticket.id}`, 20, yPos);
        yPos += 7;
        doc.text(`Título: ${ticket.title}`, 20, yPos);
        yPos += 7;
        doc.text(`Estado: ${this.getStatusLabel(ticket.status)}`, 20, yPos);
        yPos += 7;
        doc.text(`Prioridad: ${(ticket.priority || 'Media').toUpperCase()}`, 20, yPos);
        yPos += 7;
        doc.text(`Tipo de Trabajo: ${ticket.workType}`, 20, yPos);
        yPos += 7;
        doc.text(`Fecha de Creación: ${this.formatDate(ticket.createdAt)}`, 20, yPos);
        if (ticket.updatedAt && ticket.updatedAt !== ticket.createdAt) {
            yPos += 7;
            doc.text(`Última Actualización: ${this.formatDate(ticket.updatedAt)}`, 20, yPos);
        }

        // Información del cliente
        yPos += 15;
        doc.setFont('helvetica', 'bold');
        doc.text('INFORMACIÓN DEL CLIENTE', 20, yPos);
        
        yPos += 10;
        doc.setFont('helvetica', 'normal');
        if (client) {
            doc.text(`Nombre: ${client.name}`, 20, yPos);
            yPos += 7;
            doc.text(`Email: ${client.email}`, 20, yPos);
            yPos += 7;
            doc.text(`Teléfono: ${client.phone}`, 20, yPos);
            if (client.company) {
                yPos += 7;
                doc.text(`Empresa: ${client.company}`, 20, yPos);
            }
            if (client.address) {
                yPos += 7;
                doc.text(`Dirección: ${client.address}`, 20, yPos);
            }
        }

        // Información del técnico
        if (technician) {
            yPos += 15;
            doc.setFont('helvetica', 'bold');
            doc.text('TÉCNICO ASIGNADO', 20, yPos);
            
            yPos += 10;
            doc.setFont('helvetica', 'normal');
            doc.text(`Nombre: ${technician.name}`, 20, yPos);
            yPos += 7;
            doc.text(`Email: ${technician.email}`, 20, yPos);
            yPos += 7;
            doc.text(`Teléfono: ${technician.phone}`, 20, yPos);
            if (technician.specializations && technician.specializations.length > 0) {
                yPos += 7;
                doc.text(`Especializaciones: ${technician.specializations.join(', ')}`, 20, yPos);
            }
        }

        // Descripción del trabajo
        yPos += 15;
        doc.setFont('helvetica', 'bold');
        doc.text('DESCRIPCIÓN DEL TRABAJO', 20, yPos);
        
        yPos += 10;
        doc.setFont('helvetica', 'normal');
        const description = doc.splitTextToSize(ticket.description, 170);
        doc.text(description, 20, yPos);
        yPos += description.length * 7;

        // Viáticos si existen
        if (ticket.viaticos) {
            yPos += 10;
            doc.setFont('helvetica', 'bold');
            doc.text('VIÁTICOS', 20, yPos);
            
            yPos += 10;
            doc.setFont('helvetica', 'normal');
            doc.text(`Estado: ${ticket.viaticos.approved ? 'Aprobado' : 'Pendiente'}`, 20, yPos);
            yPos += 7;
            doc.text(`Monto: $${ticket.viaticos.amount || 0}`, 20, yPos);
            if (ticket.viaticos.description) {
                yPos += 7;
                doc.text(`Descripción: ${ticket.viaticos.description}`, 20, yPos);
            }
        }

        // Encuesta de satisfacción si existe
        if (ticket.survey) {
            yPos += 15;
            doc.setFont('helvetica', 'bold');
            doc.text('ENCUESTA DE SATISFACCIÓN', 20, yPos);
            
            yPos += 10;
            doc.setFont('helvetica', 'normal');
            doc.text(`Satisfacción General: ${ticket.survey.satisfaction || 0}/5`, 20, yPos);
            yPos += 7;
            doc.text(`Calidad del Trabajo: ${ticket.survey.quality || 0}/5`, 20, yPos);
            yPos += 7;
            doc.text(`Puntualidad: ${ticket.survey.punctuality || 0}/5`, 20, yPos);
            if (ticket.survey.comments) {
                yPos += 7;
                doc.text(`Comentarios: ${ticket.survey.comments}`, 20, yPos);
            }
        }

        // Footer
        this.addFooter(doc);

        // Descargar el PDF
        doc.save(`Ticket_${ticket.id}_${this.formatDateForFile(ticket.createdAt)}.pdf`);
        
        Utils.showToast('PDF generado exitosamente', 'success');
    }

    // Generar PDF de reporte general
    generateGeneralReport(filters = {}) {
        const allTickets = DataManager.getAllTickets();
        let tickets = allTickets;

        // Aplicar filtros si se proporcionan
        if (filters.status) {
            tickets = tickets.filter(t => t.status === filters.status);
        }
        if (filters.priority) {
            tickets = tickets.filter(t => t.priority === filters.priority);
        }
        if (filters.dateFrom) {
            tickets = tickets.filter(t => new Date(t.createdAt) >= new Date(filters.dateFrom));
        }
        if (filters.dateTo) {
            tickets = tickets.filter(t => new Date(t.createdAt) <= new Date(filters.dateTo));
        }

        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        // Header de la empresa
        this.addCompanyHeader(doc);

        // Título del reporte
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text('REPORTE GENERAL DE TICKETS', 20, 60);

        // Estadísticas generales
        let yPos = 80;
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('ESTADÍSTICAS GENERALES', 20, yPos);
        
        yPos += 10;
        doc.setFont('helvetica', 'normal');
        
        const stats = this.calculateStats(tickets);
        doc.text(`Total de Tickets: ${stats.total}`, 20, yPos);
        yPos += 7;
        doc.text(`Pendientes: ${stats.pendientes}`, 20, yPos);
        yPos += 7;
        doc.text(`En Progreso: ${stats.enProgreso}`, 20, yPos);
        yPos += 7;
        doc.text(`Finalizados: ${stats.finalizados}`, 20, yPos);
        yPos += 7;
        doc.text(`Cancelados: ${stats.cancelados}`, 20, yPos);

        // Lista de tickets
        yPos += 20;
        doc.setFont('helvetica', 'bold');
        doc.text('LISTADO DE TICKETS', 20, yPos);

        yPos += 15;
        // Headers de tabla
        doc.setFontSize(10);
        doc.text('ID', 20, yPos);
        doc.text('Título', 35, yPos);
        doc.text('Cliente', 100, yPos);
        doc.text('Estado', 140, yPos);
        doc.text('Fecha', 170, yPos);

        yPos += 5;
        doc.line(20, yPos, 190, yPos); // Línea separadora

        // Datos de tickets
        yPos += 5;
        doc.setFont('helvetica', 'normal');
        tickets.slice(0, 30).forEach(ticket => { // Límite de 30 tickets por página
            doc.text(ticket.id.toString(), 20, yPos);
            doc.text(this.truncateText(ticket.title, 20), 35, yPos);
            doc.text(this.truncateText(ticket.clientName, 15), 100, yPos);
            doc.text(this.getStatusLabel(ticket.status), 140, yPos);
            doc.text(this.formatDateShort(ticket.createdAt), 170, yPos);
            yPos += 7;

            // Nueva página si es necesario
            if (yPos > 270) {
                doc.addPage();
                yPos = 20;
            }
        });

        // Footer
        this.addFooter(doc);

        // Descargar el PDF
        const dateStr = this.formatDateForFile(new Date());
        doc.save(`Reporte_General_Tickets_${dateStr}.pdf`);
        
        Utils.showToast('Reporte PDF generado exitosamente', 'success');
    }

    // Métodos auxiliares
    addCompanyHeader(doc) {
        doc.setFontSize(18);
        doc.setFont('helvetica', 'bold');
        doc.text(this.companyInfo.name, 20, 20);
        
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text(this.companyInfo.address, 20, 30);
        doc.text(`Tel: ${this.companyInfo.phone} | Email: ${this.companyInfo.email}`, 20, 37);
        
        // Línea separadora
        doc.line(20, 45, 190, 45);
    }

    addFooter(doc) {
        const pageHeight = doc.internal.pageSize.height;
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.text(`Generado el: ${this.formatDate(new Date())}`, 20, pageHeight - 10);
        doc.text('Sistema de Gestión de Tickets - Empresa Eléctrica', 120, pageHeight - 10);
    }

    calculateStats(tickets) {
        return {
            total: tickets.length,
            pendientes: tickets.filter(t => t.status === 'pendiente').length,
            enProgreso: tickets.filter(t => t.status === 'en_progreso').length,
            finalizados: tickets.filter(t => t.status === 'finalizado').length,
            cancelados: tickets.filter(t => t.status === 'cancelado').length
        };
    }

    getStatusLabel(status) {
        const labels = {
            'pendiente': 'Pendiente',
            'en_progreso': 'En Progreso',
            'finalizado': 'Finalizado',
            'cancelado': 'Cancelado',
            'pre_cerrado': 'Pre-Cerrado'
        };
        return labels[status] || status;
    }

    formatDate(dateString) {
        if (!dateString) return '';
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('es-ES', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (e) {
            return dateString;
        }
    }

    formatDateShort(dateString) {
        if (!dateString) return '';
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('es-ES', {
                year: '2-digit',
                month: '2-digit',
                day: '2-digit'
            });
        } catch (e) {
            return dateString;
        }
    }

    formatDateForFile(date) {
        return date.toISOString().split('T')[0].replace(/-/g, '');
    }

    truncateText(text, maxLength) {
        if (!text) return '';
        return text.length <= maxLength ? text : text.substring(0, maxLength) + '...';
    }
}

// Instancia global
window.PDFGenerator = new PDFGenerator();

// Funciones globales para fácil acceso
window.generateTicketPDF = (ticketId) => {
    window.PDFGenerator.generateTicketPDF(ticketId);
};

window.generateGeneralReport = (filters) => {
    window.PDFGenerator.generateGeneralReport(filters);
};
