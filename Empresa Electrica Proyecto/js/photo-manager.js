// Gestor de fotografías para tickets

class PhotoManager {
    constructor() {
        this.maxFileSize = 5 * 1024 * 1024; // 5MB máximo por archivo
        this.allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
        this.maxPhotos = 10; // Máximo 10 fotos por ticket
    }

    // Crear componente de subida de fotos
    createPhotoUploader(ticketId, existingPhotos = []) {
        const uploaderId = `photo-uploader-${ticketId || 'new'}`;
        
        return `
            <div class="photo-uploader" id="${uploaderId}">
                <div class="photo-uploader-header">
                    <h4><i class="fas fa-camera"></i> Fotografías de Soporte</h4>
                    <p>Sube imágenes relacionadas con el ticket (máx. ${this.maxPhotos} fotos, 5MB cada una)</p>
                </div>
                
                <div class="photo-upload-area">
                    <input type="file" 
                           id="photo-input-${ticketId || 'new'}" 
                           accept="image/*" 
                           multiple 
                           style="display: none;"
                           onchange="photoManager.handleFileSelect(event, '${ticketId || 'new'}')">
                    
                    <div class="photo-drop-zone" 
                         onclick="document.getElementById('photo-input-${ticketId || 'new'}').click()"
                         ondrop="photoManager.handleDrop(event, '${ticketId || 'new'}')"
                         ondragover="photoManager.handleDragOver(event)"
                         ondragleave="photoManager.handleDragLeave(event)">
                        <div class="photo-drop-content">
                            <i class="fas fa-cloud-upload-alt"></i>
                            <p>Haz clic aquí o arrastra las imágenes</p>
                            <span class="photo-formats">Formatos: JPG, PNG, WEBP</span>
                        </div>
                    </div>
                </div>
                
                <div class="photo-gallery" id="photo-gallery-${ticketId || 'new'}">
                    ${this.renderPhotoGallery(existingPhotos)}
                </div>
            </div>
        `;
    }

    // Manejar selección de archivos
    handleFileSelect(event, ticketId) {
        const files = Array.from(event.target.files);
        this.processFiles(files, ticketId);
    }

    // Manejar arrastrar y soltar
    handleDrop(event) {
        event.preventDefault();
        event.stopPropagation();
        
        const ticketId = event.target.closest('.photo-uploader').id.split('-').pop();
        const files = Array.from(event.dataTransfer.files);
        
        // Remover clase de hover
        event.target.classList.remove('drag-over');
        
        this.processFiles(files, ticketId);
    }

    handleDragOver(event) {
        event.preventDefault();
        event.stopPropagation();
        event.target.closest('.photo-drop-zone').classList.add('drag-over');
    }

    handleDragLeave(event) {
        event.preventDefault();
        event.stopPropagation();
        event.target.closest('.photo-drop-zone').classList.remove('drag-over');
    }

    // Procesar archivos seleccionados
    async processFiles(files, ticketId) {
        const validFiles = files.filter(file => this.validateFile(file));
        
        if (validFiles.length === 0) {
            Utils.showToast('No se seleccionaron archivos válidos', 'warning');
            return;
        }

        // Verificar límite de fotos
        const currentPhotos = this.getTicketPhotos(ticketId);
        if (currentPhotos.length + validFiles.length > this.maxPhotos) {
            Utils.showToast(`Máximo ${this.maxPhotos} fotos permitidas por ticket`, 'warning');
            return;
        }

        // Procesar cada archivo
        for (const file of validFiles) {
            try {
                const photoData = await this.processPhoto(file, ticketId);
                this.addPhotoToTicket(ticketId, photoData);
                this.updatePhotoGallery(ticketId);
            } catch (error) {
                console.error('Error procesando foto:', error);
                Utils.showToast(`Error procesando ${file.name}`, 'error');
            }
        }

        Utils.showToast(`${validFiles.length} foto(s) agregada(s) exitosamente`, 'success');
    }

    // Validar archivo
    validateFile(file) {
        // Verificar tipo
        if (!this.allowedTypes.includes(file.type)) {
            Utils.showToast(`Tipo de archivo no válido: ${file.name}`, 'error');
            return false;
        }

        // Verificar tamaño
        if (file.size > this.maxFileSize) {
            Utils.showToast(`Archivo muy grande: ${file.name} (máx. 5MB)`, 'error');
            return false;
        }

        return true;
    }

    // Procesar foto y convertir a base64
    processPhoto(file, ticketId) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = (e) => {
                // Crear imagen para obtener dimensiones
                const img = new Image();
                img.onload = () => {
                    // Redimensionar si es necesario
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    
                    // Máximo 1200px de ancho manteniendo proporción
                    const maxWidth = 1200;
                    let { width, height } = img;
                    
                    if (width > maxWidth) {
                        height = (height * maxWidth) / width;
                        width = maxWidth;
                    }
                    
                    canvas.width = width;
                    canvas.height = height;
                    
                    // Dibujar imagen redimensionada
                    ctx.drawImage(img, 0, 0, width, height);
                    
                    // Convertir a base64 con calidad optimizada
                    const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.8);
                    
                    const photoData = {
                        id: this.generatePhotoId(),
                        name: file.name,
                        size: file.size,
                        type: file.type,
                        data: compressedDataUrl,
                        uploadedAt: new Date().toISOString(),
                        ticketId: ticketId
                    };
                    
                    resolve(photoData);
                };
                
                img.onerror = () => reject(new Error('Error cargando imagen'));
                img.src = e.target.result;
            };
            
            reader.onerror = () => reject(new Error('Error leyendo archivo'));
            reader.readAsDataURL(file);
        });
    }

    // Agregar foto al ticket
    addPhotoToTicket(ticketId, photoData) {
        const photos = JSON.parse(localStorage.getItem('ticketPhotos') || '{}');
        
        if (!photos[ticketId]) {
            photos[ticketId] = [];
        }
        
        photos[ticketId].push(photoData);
        localStorage.setItem('ticketPhotos', JSON.stringify(photos));
    }

    // Obtener fotos de un ticket
    getTicketPhotos(ticketId) {
        const photos = JSON.parse(localStorage.getItem('ticketPhotos') || '{}');
        return photos[ticketId] || [];
    }

    // Eliminar foto
    removePhoto(ticketId, photoId) {
        const photos = JSON.parse(localStorage.getItem('ticketPhotos') || '{}');
        
        if (photos[ticketId]) {
            photos[ticketId] = photos[ticketId].filter(photo => photo.id !== photoId);
            localStorage.setItem('ticketPhotos', JSON.stringify(photos));
            this.updatePhotoGallery(ticketId);
            Utils.showToast('Foto eliminada', 'success');
        }
    }

    // Actualizar galería de fotos
    updatePhotoGallery(ticketId) {
        const gallery = document.getElementById(`photo-gallery-${ticketId}`);
        if (gallery) {
            const photos = this.getTicketPhotos(ticketId);
            gallery.innerHTML = this.renderPhotoGallery(photos);
        }
    }

    // Renderizar galería de fotos
    renderPhotoGallery(photos) {
        if (!photos || photos.length === 0) {
            return '<div class="no-photos"><i class="fas fa-image"></i><p>No hay fotografías</p></div>';
        }

        return `
            <div class="photo-grid">
                ${photos.map(photo => `
                    <div class="photo-item" data-photo-id="${photo.id}">
                        <div class="photo-preview">
                            <img src="${photo.data}" alt="${photo.name}" onclick="photoManager.showPhotoModal('${photo.id}', '${photo.ticketId}')">
                            <div class="photo-overlay">
                                <button class="photo-action-btn" onclick="photoManager.showPhotoModal('${photo.id}', '${photo.ticketId}')" title="Ver imagen">
                                    <i class="fas fa-eye"></i>
                                </button>
                                <button class="photo-action-btn delete" onclick="photoManager.removePhoto('${photo.ticketId}', '${photo.id}')" title="Eliminar">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </div>
                        <div class="photo-info">
                            <span class="photo-name">${this.truncateFileName(photo.name)}</span>
                            <span class="photo-size">${this.formatFileSize(photo.size)}</span>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    // Mostrar modal de foto
    showPhotoModal(photoId, ticketId) {
        const photos = this.getTicketPhotos(ticketId);
        const photo = photos.find(p => p.id === photoId);
        
        if (!photo) return;

        const modal = document.createElement('div');
        modal.className = 'photo-modal-overlay';
        modal.innerHTML = `
            <div class="photo-modal">
                <div class="photo-modal-header">
                    <h3>${photo.name}</h3>
                    <button class="modal-close-btn" onclick="this.closest('.photo-modal-overlay').remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="photo-modal-content">
                    <img src="${photo.data}" alt="${photo.name}">
                </div>
                <div class="photo-modal-footer">
                    <div class="photo-modal-info">
                        <span>Subida: ${this.formatDate(photo.uploadedAt)}</span>
                        <span>Tamaño: ${this.formatFileSize(photo.size)}</span>
                    </div>
                    <div class="photo-modal-actions">
                        <button class="btn btn-primary" onclick="photoManager.downloadPhoto('${photoId}', '${ticketId}')">
                            <i class="fas fa-download"></i> Descargar
                        </button>
                        <button class="btn btn-danger" onclick="photoManager.removePhoto('${ticketId}', '${photoId}'); this.closest('.photo-modal-overlay').remove()">
                            <i class="fas fa-trash"></i> Eliminar
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Cerrar con ESC
        const closeHandler = (e) => {
            if (e.key === 'Escape') {
                modal.remove();
                document.removeEventListener('keydown', closeHandler);
            }
        };
        document.addEventListener('keydown', closeHandler);

        // Cerrar al hacer clic fuera
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
                document.removeEventListener('keydown', closeHandler);
            }
        });
    }

    // Descargar foto
    downloadPhoto(photoId, ticketId) {
        const photos = this.getTicketPhotos(ticketId);
        const photo = photos.find(p => p.id === photoId);
        
        if (!photo) return;

        // Crear enlace de descarga
        const link = document.createElement('a');
        link.href = photo.data;
        link.download = photo.name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        Utils.showToast('Descarga iniciada', 'success');
    }

    // Métodos auxiliares
    generatePhotoId() {
        return 'photo_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    truncateFileName(name, maxLength = 20) {
        if (name.length <= maxLength) return name;
        const ext = name.split('.').pop();
        const nameWithoutExt = name.substring(0, name.lastIndexOf('.'));
        return nameWithoutExt.substring(0, maxLength - ext.length - 4) + '...' + ext;
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    formatDate(dateString) {
        return new Date(dateString).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
}

// Instancia global
window.photoManager = new PhotoManager();

