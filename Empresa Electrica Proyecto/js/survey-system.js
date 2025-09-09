// Sistema avanzado de encuestas y calificación

class SurveySystem {
    constructor() {
        this.surveyQuestions = {
            satisfaction: {
                title: 'Satisfacción General',
                icon: 'fas fa-smile',
                type: 'rating',
                required: true,
                description: 'Califica tu experiencia general con nuestro servicio'
            },
            quality: {
                title: 'Calidad del Trabajo',
                icon: 'fas fa-star',
                type: 'rating',
                required: true,
                description: 'Evalúa la calidad técnica del trabajo realizado'
            },
            punctuality: {
                title: 'Puntualidad',
                icon: 'fas fa-clock',
                type: 'rating',
                required: true,
                description: 'Califica la puntualidad del técnico'
            },
            communication: {
                title: 'Comunicación del Técnico',
                icon: 'fas fa-comments',
                type: 'rating',
                required: true,
                description: 'Evalúa la claridad y cortesía en la comunicación'
            },
            cleanliness: {
                title: 'Limpieza del Trabajo',
                icon: 'fas fa-broom',
                type: 'rating',
                required: true,
                description: 'Califica si el área de trabajo quedó limpia'
            },
            wouldRecommend: {
                title: '¿Recomendarías nuestro servicio?',
                icon: 'fas fa-thumbs-up',
                type: 'boolean',
                required: true,
                description: 'Indica si recomendarías nuestros servicios a otros'
            },
            additionalServices: {
                title: 'Servicios Adicionales Necesarios',
                icon: 'fas fa-plus-circle',
                type: 'multiselect',
                required: false,
                options: [
                    'Mantenimiento preventivo',
                    'Inspección adicional',
                    'Capacitación en seguridad',
                    'Documentación técnica',
                    'Garantía extendida',
                    'Ninguno'
                ],
                description: 'Selecciona si necesitas algún servicio adicional'
            },
            comments: {
                title: 'Comentarios Adicionales',
                icon: 'fas fa-comment-alt',
                type: 'textarea',
                required: false,
                description: 'Comparte cualquier comentario adicional sobre el servicio'
            },
            futureContact: {
                title: 'Contacto para Futuros Servicios',
                icon: 'fas fa-phone',
                type: 'select',
                required: false,
                options: [
                    'Email',
                    'Teléfono',
                    'WhatsApp',
                    'No contactar'
                ],
                description: 'Indica tu método preferido de contacto para futuros servicios'
            }
        };
        
        this.ratingLabels = ['Muy Malo', 'Malo', 'Regular', 'Bueno', 'Excelente'];
    }

    // Crear formulario de encuesta avanzado
    createSurveyForm(ticketId, existingSurvey = null) {
        const formId = `survey-form-${ticketId}`;
        
        return `
            <div class="survey-form-container">
                <div class="survey-header">
                    <h3><i class="fas fa-clipboard-check"></i> Encuesta de Satisfacción del Cliente</h3>
                    <p>Tu opinión nos ayuda a mejorar nuestros servicios. Por favor, tómate unos minutos para evaluarnos.</p>
                </div>
                
                <form id="${formId}" class="survey-form" onsubmit="surveySystem.submitSurvey(event, '${ticketId}')">
                    ${Object.entries(this.surveyQuestions).map(([key, question]) => 
                        this.renderQuestion(key, question, existingSurvey)
                    ).join('')}
                    
                    <div class="survey-actions">
                        <button type="button" class="btn btn-secondary" onclick="this.closest('.modal').style.display='none'">
                            Cancelar
                        </button>
                        <button type="submit" class="btn btn-primary">
                            <i class="fas fa-paper-plane"></i> Enviar Encuesta
                        </button>
                    </div>
                </form>
            </div>
        `;
    }

    // Renderizar una pregunta específica
    renderQuestion(key, question, existingSurvey) {
        const value = existingSurvey && existingSurvey[key] ? existingSurvey[key] : '';
        
        let input = '';
        
        switch (question.type) {
            case 'rating':
                input = this.renderRatingInput(key, value);
                break;
            case 'boolean':
                input = this.renderBooleanInput(key, value);
                break;
            case 'multiselect':
                input = this.renderMultiSelectInput(key, question.options, value);
                break;
            case 'select':
                input = this.renderSelectInput(key, question.options, value);
                break;
            case 'textarea':
                input = this.renderTextareaInput(key, value);
                break;
            default:
                input = `<input type="text" name="${key}" value="${value}" class="form-input">`;
        }
        
        return `
            <div class="survey-question ${question.required ? 'required' : ''}">
                <div class="survey-question-header">
                    <h4><i class="${question.icon}"></i> ${question.title} ${question.required ? '*' : ''}</h4>
                    <p class="survey-question-description">${question.description}</p>
                </div>
                <div class="survey-question-input">
                    ${input}
                </div>
            </div>
        `;
    }

    // Renderizar input de calificación con estrellas
    renderRatingInput(name, value) {
        return `
            <div class="rating-input" data-name="${name}">
                <div class="rating-stars">
                    ${[1, 2, 3, 4, 5].map(star => `
                        <span class="rating-star ${parseInt(value) >= star ? 'active' : ''}" 
                              data-value="${star}" 
                              onclick="surveySystem.setRating('${name}', ${star})">
                            <i class="fas fa-star"></i>
                        </span>
                    `).join('')}
                </div>
                <div class="rating-label">
                    <span id="rating-label-${name}">${value ? this.ratingLabels[parseInt(value) - 1] : 'Selecciona una calificación'}</span>
                </div>
                <input type="hidden" name="${name}" value="${value}" id="rating-input-${name}">
            </div>
        `;
    }

    // Renderizar input booleano
    renderBooleanInput(name, value) {
        return `
            <div class="boolean-input">
                <label class="boolean-option ${value === 'true' ? 'selected' : ''}">
                    <input type="radio" name="${name}" value="true" ${value === 'true' ? 'checked' : ''} 
                           onchange="surveySystem.updateBooleanSelection('${name}', true)">
                    <span class="boolean-option-content">
                        <i class="fas fa-thumbs-up"></i>
                        <span>Sí</span>
                    </span>
                </label>
                <label class="boolean-option ${value === 'false' ? 'selected' : ''}">
                    <input type="radio" name="${name}" value="false" ${value === 'false' ? 'checked' : ''} 
                           onchange="surveySystem.updateBooleanSelection('${name}', false)">
                    <span class="boolean-option-content">
                        <i class="fas fa-thumbs-down"></i>
                        <span>No</span>
                    </span>
                </label>
            </div>
        `;
    }

    // Renderizar input de selección múltiple
    renderMultiSelectInput(name, options, value) {
        const selectedValues = Array.isArray(value) ? value : (value ? [value] : []);
        
        return `
            <div class="multiselect-input">
                ${options.map(option => `
                    <label class="multiselect-option ${selectedValues.includes(option) ? 'selected' : ''}">
                        <input type="checkbox" name="${name}[]" value="${option}" 
                               ${selectedValues.includes(option) ? 'checked' : ''}
                               onchange="surveySystem.updateMultiSelectSelection('${name}', '${option}')">
                        <span class="multiselect-option-content">
                            <i class="fas fa-check"></i>
                            <span>${option}</span>
                        </span>
                    </label>
                `).join('')}
            </div>
        `;
    }

    // Renderizar select simple
    renderSelectInput(name, options, value) {
        return `
            <select name="${name}" class="form-select">
                <option value="">Seleccionar opción</option>
                ${options.map(option => `
                    <option value="${option}" ${value === option ? 'selected' : ''}>${option}</option>
                `).join('')}
            </select>
        `;
    }

    // Renderizar textarea
    renderTextareaInput(name, value) {
        return `
            <textarea name="${name}" class="form-textarea" 
                      placeholder="Escribe tus comentarios aquí..."
                      rows="4">${value}</textarea>
        `;
    }

    // Establecer calificación con estrellas
    setRating(name, value) {
        const ratingInput = document.querySelector(`#rating-input-${name}`);
        const ratingLabel = document.querySelector(`#rating-label-${name}`);
        const stars = document.querySelectorAll(`[data-name="${name}"] .rating-star`);
        
        if (ratingInput) {
            ratingInput.value = value;
        }
        
        if (ratingLabel) {
            ratingLabel.textContent = this.ratingLabels[value - 1];
        }
        
        stars.forEach((star, index) => {
            if (index < value) {
                star.classList.add('active');
            } else {
                star.classList.remove('active');
            }
        });
    }

    // Actualizar selección booleana
    updateBooleanSelection(name, value) {
        const options = document.querySelectorAll(`input[name="${name}"]`).forEach(input => {
            const label = input.closest('.boolean-option');
            if (input.value === value.toString()) {
                label.classList.add('selected');
            } else {
                label.classList.remove('selected');
            }
        });
    }

    // Actualizar selección múltiple
    updateMultiSelectSelection(name, option) {
        const checkbox = document.querySelector(`input[name="${name}[]"][value="${option}"]`);
        const label = checkbox.closest('.multiselect-option');
        
        if (checkbox.checked) {
            label.classList.add('selected');
        } else {
            label.classList.remove('selected');
        }
    }

    // Enviar encuesta
    submitSurvey(event, ticketId) {
        event.preventDefault();
        
        const formData = new FormData(event.target);
        const surveyData = {};
        
        // Procesar datos del formulario
        for (const [key, value] of formData.entries()) {
            if (key.endsWith('[]')) {
                const cleanKey = key.replace('[]', '');
                if (!surveyData[cleanKey]) {
                    surveyData[cleanKey] = [];
                }
                surveyData[cleanKey].push(value);
            } else {
                surveyData[key] = value;
            }
        }
        
        // Validar campos requeridos
        const missingFields = this.validateSurvey(surveyData);
        if (missingFields.length > 0) {
            Utils.showToast(`Por favor, completa los campos requeridos: ${missingFields.join(', ')}`, 'warning');
            return;
        }
        
        // Agregar timestamp
        surveyData.submittedAt = new Date().toISOString();
        surveyData.score = this.calculateOverallScore(surveyData);
        
        // Guardar en el ticket
        DataManager.updateTicket(ticketId, { survey: surveyData });
        
        // Enviar notificación de encuesta completada
        if (typeof notificationSystem !== 'undefined') {
            const ticket = DataManager.getTicketById(ticketId);
            if (ticket) {
                notificationSystem.notifySurveyCompleted(ticket, surveyData);
            }
        }
        
        // Cerrar modal
        const modal = event.target.closest('.modal');
        if (modal) {
            modal.remove();
        }
        
        Utils.showToast('Encuesta enviada exitosamente. ¡Gracias por tu opinión!', 'success');
        
        // Recargar vista de tickets si es necesario
        if (typeof loadTicketDetailById === 'function') {
            loadTicketDetailById(ticketId);
        }
    }

    // Validar encuesta
    validateSurvey(surveyData) {
        const missingFields = [];
        
        Object.entries(this.surveyQuestions).forEach(([key, question]) => {
            if (question.required && (!surveyData[key] || surveyData[key] === '')) {
                missingFields.push(question.title);
            }
        });
        
        return missingFields;
    }

    // Calcular puntuación general
    calculateOverallScore(surveyData) {
        const ratingFields = ['satisfaction', 'quality', 'punctuality', 'communication', 'cleanliness'];
        let totalScore = 0;
        let validRatings = 0;
        
        ratingFields.forEach(field => {
            if (surveyData[field] && !isNaN(parseInt(surveyData[field]))) {
                totalScore += parseInt(surveyData[field]);
                validRatings++;
            }
        });
        
        return validRatings > 0 ? Math.round((totalScore / validRatings) * 100) / 100 : 0;
    }

    // Mostrar modal de encuesta
    showSurveyModal(ticketId) {
        const ticket = DataManager.getTicketById(ticketId);
        if (!ticket) {
            Utils.showToast('Ticket no encontrado', 'error');
            return;
        }
        
        const modal = document.createElement('div');
        modal.className = 'modal show survey-modal';
        modal.innerHTML = `
            <div class="modal-content survey-modal-content">
                <div class="modal-header">
                    <h3><i class="fas fa-clipboard-check"></i> Encuesta de Satisfacción - Ticket ${ticket.id}</h3>
                    <button class="modal-close-btn" onclick="this.closest('.modal').remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    ${this.createSurveyForm(ticketId, ticket.survey)}
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

    // Renderizar resultados de encuesta para admin
    renderSurveyResults(survey) {
        if (!survey) {
            return '<div class="no-survey"><i class="fas fa-clipboard"></i><p>No hay encuesta completada</p></div>';
        }
        
        return `
            <div class="survey-results">
                <div class="survey-score">
                    <div class="score-circle">
                        <span class="score-value">${survey.score || 0}</span>
                        <span class="score-label">Puntuación General</span>
                    </div>
                </div>
                
                <div class="survey-ratings">
                    ${Object.entries(this.surveyQuestions).map(([key, question]) => {
                        if (question.type === 'rating' && survey[key]) {
                            return `
                                <div class="survey-rating-item">
                                    <span class="survey-label"><i class="${question.icon}"></i> ${question.title}:</span>
                                    <div class="rating-display">
                                        <span class="rating-stars">${'★'.repeat(parseInt(survey[key]))}${'☆'.repeat(5 - parseInt(survey[key]))}</span>
                                        <span class="rating-number">${survey[key]}/5</span>
                                    </div>
                                </div>
                            `;
                        }
                        return '';
                    }).join('')}
                </div>
                
                ${survey.wouldRecommend ? `
                    <div class="survey-recommendation">
                        <span class="survey-label"><i class="fas fa-thumbs-up"></i> Recomendaría el servicio:</span>
                        <span class="recommendation-value ${survey.wouldRecommend === 'true' ? 'positive' : 'negative'}">
                            ${survey.wouldRecommend === 'true' ? 'Sí' : 'No'}
                        </span>
                    </div>
                ` : ''}
                
                ${survey.comments ? `
                    <div class="survey-comments">
                        <h4><i class="fas fa-comment-alt"></i> Comentarios:</h4>
                        <p>${survey.comments}</p>
                    </div>
                ` : ''}
                
                ${survey.additionalServices && survey.additionalServices.length > 0 ? `
                    <div class="survey-additional-services">
                        <h4><i class="fas fa-plus-circle"></i> Servicios Adicionales:</h4>
                        <ul>
                            ${survey.additionalServices.map(service => `<li>${service}</li>`).join('')}
                        </ul>
                    </div>
                ` : ''}
                
                <div class="survey-meta">
                    <span><i class="fas fa-calendar"></i> Completada: ${new Date(survey.submittedAt).toLocaleDateString()}</span>
                </div>
            </div>
        `;
    }
}

// Instancia global
window.surveySystem = new SurveySystem();
