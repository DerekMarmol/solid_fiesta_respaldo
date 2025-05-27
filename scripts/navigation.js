/**
 * Sistema de navegación para la aplicación
 * Permite cargar diferentes vistas sin recargar la página
 */

// Rutas a las vistas
const views = {
    upload: 'views/upload.html',
    analysis: 'views/analysis.html',
    statistics: 'views/statistics.html',
    interactive: 'views/interactive.html',
    report: 'views/report.html',
    settings: 'views/settings.html'
};

// Función para cargar una vista en el contenedor principal
async function loadView(viewName) {
    if (!views[viewName]) {
        console.error(`Vista "${viewName}" no encontrada`);
        return;
    }
    
    try {
        // Verificar si estamos en un entorno local
        // Si estamos ejecutando el archivo directamente desde el sistema de archivos
        // necesitamos manejar esto de otra manera
        let content;
        
        if (window.location.protocol === 'file:') {
            // En caso de ejecutarse localmente, podríamos cargar un contenido predeterminado
            // o usar un método alternativo como XMLHttpRequest
            content = await loadViewWithXHR(views[viewName]);
        } else {
            const response = await fetch(views[viewName]);
            
            if (!response.ok) {
                throw new Error(`Error al cargar ${views[viewName]}: ${response.status}`);
            }
            
            content = await response.text();
        }
        
        const contentContainer = document.getElementById('content-container');
        
        // Insertar el contenido HTML
        contentContainer.innerHTML = content;
        
        // Actualizar la navegación
        updateNavigation(viewName);
        
        // Cargar estilos específicos de la vista
        loadViewStyles(viewName);
        
        // IMPORTANTE: Inicializar funcionalidad específica de la vista
        // Usar setTimeout para asegurar que el DOM esté completamente renderizado
        setTimeout(() => {
            initializeView(viewName);
        }, 100);
        
    } catch (error) {
        console.error('Error al cargar la vista:', error);
        document.getElementById('content-container').innerHTML = `
            <div class="error-message">
                <h2>Error al cargar la vista</h2>
                <p>${error.message}</p>
                <p>Asegúrate de que todas las vistas existan en la carpeta 'views' y que estés ejecutando la aplicación a través de un servidor web local.</p>
            </div>
        `;
    }
}

// Función alternativa para cargar vistas usando XMLHttpRequest (mejor compatibilidad con file://)
function loadViewWithXHR(url) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        
        xhr.onload = function() {
            if (xhr.status >= 200 && xhr.status < 300) {
                resolve(xhr.responseText);
            } else {
                reject(new Error(`XHR error: ${xhr.status} ${xhr.statusText}`));
            }
        };
        
        xhr.onerror = function() {
            // Si falla, generamos contenido predeterminado para la vista
            console.error(`No se pudo cargar la vista desde ${url}. Generando contenido predeterminado.`);
            
            // Extraer el nombre de la vista de la URL
            const viewName = url.split('/').pop().replace('.html', '');
            
            // Generar contenido HTML predeterminado según la vista
            let defaultContent = getDefaultViewContent(viewName);
            resolve(defaultContent);
        };
        
        xhr.send();
    });
}

// Generar contenido HTML predeterminado para las vistas
function getDefaultViewContent(viewName) {
    switch(viewName) {
        case 'upload':
            return `
                <div class="upload-container">
                    <h2 class="section-title">Cargar datos</h2>
                    
                    <div class="upload-instructions">
                        <p><strong>Instrucciones:</strong></p>
                        <ul>
                            <li>Selecciona un archivo CSV, Excel o JSON para analizar</li>
                            <li>El tamaño máximo permitido es de 10MB</li>
                            <li>Se recomienda usar archivos con encabezados</li>
                        </ul>
                    </div>
                    
                    <div class="upload-area">
                        <form id="upload-form">
                            <div class="file-drop-area">
                                <span class="fake-btn">Seleccionar archivo</span>
                                <span class="file-msg">o arrastra y suelta aquí</span>
                                <input class="file-input" id="file-upload" type="file" accept=".csv, .xlsx, .xls, .json">
                            </div>
                            
                            <div id="file-info" class="file-info">
                                Ningún archivo seleccionado
                            </div>
                            
                            <div class="upload-options">
                                <div class="form-group">
                                    <label for="delimiter">Delimitador:</label>
                                    <select id="delimiter" class="select-input">
                                        <option value="comma">Coma (,)</option>
                                        <option value="semicolon">Punto y coma (;)</option>
                                        <option value="tab">Tabulación</option>
                                    </select>
                                </div>
                                
                                <div class="form-group">
                                    <label for="encoding">Codificación:</label>
                                    <select id="encoding" class="select-input">
                                        <option value="utf8">UTF-8</option>
                                        <option value="latin1">Latin-1</option>
                                        <option value="ascii">ASCII</option>
                                    </select>
                                </div>
                            </div>
                            
                            <div class="upload-actions">
                                <button type="button" id="process-file-btn" class="btn" disabled>Procesar datos</button>
                                <button type="reset" class="btn btn-secondary">Cancelar</button>
                            </div>
                        </form>
                    </div>
                    
                    <div class="recent-uploads">
                        <h3>Archivos recientes</h3>
                        <div class="upload-history">
                            <p class="no-data">No hay archivos recientes</p>
                        </div>
                    </div>
                </div>
            `;
        case 'analysis':
            return `
                <div class="analysis-container">
                    <h2 class="section-title">Análisis de datos</h2>
                    <p>Para comenzar el análisis, primero debes cargar un conjunto de datos desde la sección "Cargar datos".</p>
                </div>
            `;
        case 'report':
            return `
                <div class="report-container">
                    <h2 class="section-title">Reportes y visualizaciones</h2>
                    <p>Los reportes estarán disponibles después de analizar los datos.</p>
                </div>
            `;
         case 'statistics':
            return `
                <div class="statistics-container">
                    <h2 class="section-title">Estadísticas Generales</h2>
                    <p>Carga un conjunto de datos para ver las estadísticas y gráficos.</p>
                    
                    <div class="stats-summary">
                        <div class="summary-card">
                            <div class="summary-content">
                                <h3>📊 Estadísticas</h3>
                                <p>Carga datos para ver estadísticas detalladas</p>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        case 'interactive':
            return `
                <div class="interactive-container">
                    <h2 class="section-title">Gráficos Interactivos</h2>
                    <p>Los gráficos interactivos estarán disponibles después de cargar datos.</p>
                </div>
            `;
        case 'settings':
            return `
                <div class="settings-container">
                    <h2 class="section-title">Configuración</h2>
                    <p>Configura las opciones de la aplicación según tus preferencias.</p>
                    
                    <div class="card">
                        <h3>Preferencias de visualización</h3>
                        <form id="settings-form">
                            <div class="form-group">
                                <label for="theme">Tema:</label>
                                <select id="theme" class="select-input">
                                    <option value="light">Claro</option>
                                    <option value="dark">Oscuro</option>
                                    <option value="system">Sistema</option>
                                </select>
                            </div>
                            
                            <div class="form-group">
                                <label for="language">Idioma:</label>
                                <select id="language" class="select-input">
                                    <option value="es">Español</option>
                                    <option value="en">Inglés</option>
                                </select>
                            </div>
                            
                            <button type="submit" class="btn">Guardar cambios</button>
                        </form>
                    </div>
                </div>
            `;
        default:
            return `
                <div class="error-message">
                    <h2>Vista no disponible</h2>
                    <p>La vista solicitada no está disponible actualmente.</p>
                </div>
            `;
    }
}

// Actualizar los elementos de navegación activos
function updateNavigation(activeView) {
    const navItems = document.querySelectorAll('#main-nav .nav-item');
    
    navItems.forEach(item => {
        if (item.dataset.view === activeView) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
}

// Cargar estilos específicos para cada vista
function loadViewStyles(viewName) {
    // Eliminar estilos anteriores específicos de vistas
    const oldStylesheet = document.querySelector('link[data-view-styles]');
    if (oldStylesheet && oldStylesheet.getAttribute('data-view-styles') !== viewName) {
        oldStylesheet.remove();
    }
    
    // Verificar si ya existen los estilos para evitar cargarlos nuevamente
    if (!document.querySelector(`link[data-view-styles="${viewName}"]`)) {
        // Añadir los nuevos estilos
        const stylesheet = document.createElement('link');
        stylesheet.rel = 'stylesheet';
        stylesheet.href = `styles/${viewName}.css`;
        stylesheet.setAttribute('data-view-styles', viewName);
        document.head.appendChild(stylesheet);
    }
}

// FUNCIÓN CRÍTICA: Inicializar funcionalidad específica para cada vista
function initializeView(viewName) {
    console.log(`Inicializando vista: ${viewName}`);
    
    switch(viewName) {
        case 'upload':
            initUploadView();
            break;
        case 'analysis':
            // Inicializar la vista de análisis cuando esté implementada
            console.log('Vista de análisis cargada');
            break;
        case 'report':
            // Inicializar la vista de reportes cuando esté implementada
            console.log('Vista de reportes cargada');
            break;
        case 'statistics':
            console.log('Vista de estadísticas cargada');
            
            setTimeout(() => {
                const hasFullStatistics = document.getElementById('age-chart') !== null;
                console.log('Vista de estadísticas completa:', hasFullStatistics);
                
                if (hasFullStatistics) {
                    console.log('Inicializando gráficos automáticamente...');
                    
                    const currentData = window.DataProcessor ? window.DataProcessor.getCurrentData() : null;
                    console.log('Datos disponibles para gráficos:', currentData?.length || 0, 'registros');
                    
                    if (window.AgeChart) {
                        window.AgeChart.init();
                        if (currentData && currentData.length > 0) {
                            console.log('Actualizando gráfico de edad automáticamente...');
                            window.AgeChart.updateChart(currentData);
                        }
                    }
                    
                    if (window.LocationChart) {
                        window.LocationChart.init();
                        if (currentData && currentData.length > 0) {
                            console.log('Actualizando gráfico de ubicación automáticamente...');
                            window.LocationChart.updateChart(currentData);
                        }
                    }
                    
                    // Inicializar gráfico adicional
                    if (window.AdditionalChart) {
                        window.AdditionalChart.init();
                        if (currentData && currentData.length > 0) {
                            console.log('Actualizando gráfico adicional automáticamente...');
                            // Usar el valor por defecto del selector
                            const defaultType = document.getElementById('additional-chart-type')?.value || 'department';
                            window.AdditionalChart.updateChart(defaultType, currentData);
                        }
                    }
                    
                    console.log('Disparando evento statisticsViewLoaded...');
                    const event = new CustomEvent('statisticsViewLoaded');
                    document.dispatchEvent(event);
                    
                    // Actualizar estadísticas numéricas
                    if (currentData && currentData.length > 0) {
                        console.log('Actualizando estadísticas numéricas...');
                        
                        // Total de registros
                        const totalRecords = document.getElementById('total-records');
                        if (totalRecords) {
                            totalRecords.textContent = currentData.length.toLocaleString();
                        }
                        
                        // Total de columnas
                        const totalColumns = document.getElementById('total-columns');
                        if (totalColumns) {
                            totalColumns.textContent = Object.keys(currentData[0]).length;
                        }
                        
                        // Calidad de datos
                        const dataQuality = document.getElementById('data-quality');
                        if (dataQuality) {
                            const completeRows = currentData.filter(row => 
                                Object.values(row).every(val => val !== null && val !== undefined && val !== '')
                            ).length;
                            const quality = Math.round((completeRows / currentData.length) * 100);
                            dataQuality.textContent = quality + '%';
                        }
                        
                        // Última actualización
                        const lastUpdated = document.getElementById('last-updated');
                        if (lastUpdated) {
                            const currentMeta = window.DataProcessor.getCurrentMeta();
                            const date = currentMeta?.processedAt ? new Date(currentMeta.processedAt) : new Date();
                            lastUpdated.textContent = date.toLocaleDateString();
                        }
                        
                        // Actualizar información detallada del dataset
                        const currentMeta = window.DataProcessor.getCurrentMeta();
                        
                        // Nombre del dataset
                        const datasetNameEl = document.getElementById('dataset-name');
                        if (datasetNameEl) {
                            datasetNameEl.textContent = currentMeta?.datasetName || 'Dataset de prueba';
                        }
                        
                        // Fuente
                        const datasetSourceEl = document.getElementById('dataset-source');
                        if (datasetSourceEl) {
                            datasetSourceEl.textContent = currentMeta?.source || 'Datos de prueba';
                        }
                        
                        // Filas completas e incompletas
                        const completeRows = currentData.filter(row => 
                            Object.values(row).every(val => val !== null && val !== undefined && val !== '')
                        ).length;
                        
                        const completeRowsEl = document.getElementById('complete-rows');
                        const incompleteRowsEl = document.getElementById('incomplete-rows');
                        
                        if (completeRowsEl) completeRowsEl.textContent = completeRows.toLocaleString();
                        if (incompleteRowsEl) incompleteRowsEl.textContent = (currentData.length - completeRows).toLocaleString();
                        
                        // Tipos de datos
                        const dataTypesEl = document.getElementById('data-types');
                        if (dataTypesEl && currentData.length > 0) {
                            const types = Object.values(currentData[0]).map(val => typeof val);
                            const uniqueTypes = [...new Set(types)];
                            dataTypesEl.textContent = uniqueTypes.join(', ');
                        }
                        
                        // Memoria estimada
                        const memoryUsageEl = document.getElementById('memory-usage');
                        if (memoryUsageEl) {
                            const estimatedSize = JSON.stringify(currentData).length;
                            const sizeInKB = Math.round(estimatedSize / 1024);
                            memoryUsageEl.textContent = sizeInKB < 1024 ? `${sizeInKB} KB` : `${Math.round(sizeInKB/1024)} MB`;
                        }
                        
                        // 🔥 AQUÍ ESTÁ LA PARTE CLAVE: Actualizar la tabla
                        console.log('Actualizando tabla de datos...');
                        setTimeout(() => {
                            updateDataTable(currentData);
                            console.log('Tabla de datos actualizada automáticamente');
                        }, 200);
                        
                        console.log('Estadísticas numéricas actualizadas');
                        console.log('Información detallada actualizada');
                    }
                } else {
                    console.log('Vista básica detectada, no hay gráficos para inicializar');
                }
                
                // Configurar eventos del selector de datos
                setupStatisticsEvents();
                
            }, 300);
            break;
        case 'settings':
            // Inicializar la vista de configuración cuando esté implementada
            console.log('Vista de configuración cargada');
            break;
    }
}

// FUNCIÓN MEJORADA: Inicializar la vista de carga de datos
function initUploadView() {
    console.log('Inicializando vista de upload...');
    
    // Buscar elementos en el DOM
    const dropArea = document.querySelector('.file-drop-area');
    const fileInput = document.getElementById('file-upload');
    const fileInfo = document.getElementById('file-info');
    const processFileBtn = document.getElementById('process-file-btn');
    
    console.log('Elementos encontrados:', {
        dropArea: !!dropArea,
        fileInput: !!fileInput,
        fileInfo: !!fileInfo,
        processFileBtn: !!processFileBtn
    });
    
    // Evento para procesar archivo local - MOVER ANTES del event listener del archivo
    let newBtn;
    if (processFileBtn) {
        // Eliminar eventos anteriores para evitar duplicados
        console.log('Botón original:', processFileBtn);
        console.log('Botón habilitado:', !processFileBtn.disabled);
        newBtn = processFileBtn.cloneNode(true);
        processFileBtn.parentNode.replaceChild(newBtn, processFileBtn);
    }
    
    // Inicializar el cargador de archivos si los elementos existen
    if (dropArea && fileInput && window.FileUploader) {
        console.log('Inicializando FileUploader...');
        window.FileUploader.init(dropArea, fileInput, fileInfo, newBtn || processFileBtn);
        
        // Verificar si el input de archivo está funcionando
        fileInput.addEventListener('change', (e) => {
            console.log('Archivo seleccionado desde navigation.js:', e.target.files[0]);
            if (e.target.files[0]) {
                console.log('Habilitando botón manualmente...');
                if (newBtn) {
                    newBtn.disabled = false;  // Usar newBtn en lugar de processFileBtn
                }
            }
        });
        console.log('FileUploader inicializado');
    } else {
        console.error('No se pudo inicializar FileUploader. Elementos faltantes o FileUploader no disponible.');
    }
    
    // Configurar las pestañas
    const tabs = document.querySelectorAll('.tab');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    console.log('Pestañas encontradas:', tabs.length);
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            console.log('Cambiando a pestaña:', tab.getAttribute('data-tab'));
            
            // Remover clase active de todas las pestañas
            tabs.forEach(t => t.classList.remove('active'));
            tabPanes.forEach(p => p.classList.remove('active'));
            
            // Agregar clase active a la pestaña actual
            tab.classList.add('active');
            
            // Mostrar el contenido correspondiente
            const tabId = tab.getAttribute('data-tab');
            const targetPane = document.getElementById(tabId);
            if (targetPane) {
                targetPane.classList.add('active');
            }
        });
    });
    
    // Configurar el selector de tipo de datos de URL
    const urlDataType = document.getElementById('url-data-type');
    const csvOptions = document.getElementById('csv-options');
    
    if (urlDataType && csvOptions) {
        urlDataType.addEventListener('change', () => {
            if (urlDataType.value === 'csv' || urlDataType.value === 'auto') {
                csvOptions.classList.remove('hidden');
            } else {
                csvOptions.classList.add('hidden');
            }
        });

        console.log('FileUploader disponible:', !!window.FileUploader);
        console.log('DataProcessor disponible:', !!window.DataProcessor);
    }
    
    // Configurar el event listener del botón procesado
    if (newBtn) {
        newBtn.addEventListener('click', () => {
            console.log('Event listener agregado al botón');
            console.log('Procesando archivo...');

            console.log('Botón clickeado, archivo actual:', window.FileUploader?.getCurrentFile());
            
            if (!window.FileUploader) {
                console.error('FileUploader no está disponible');
                return;
            }
            
            const currentFile = window.FileUploader.getCurrentFile();
            
            if (!currentFile) {
                alert('Por favor, selecciona un archivo primero');
                return;
            }
            
            // Obtener opciones
            const delimiter = document.getElementById('delimiter')?.value || 'comma';
            const encoding = document.getElementById('encoding')?.value || 'utf8';
            const datasetName = document.getElementById('dataset-name')?.value || 
                               currentFile.name.replace(/\.[^/.]+$/, "");
            
            // Mostrar indicador de carga
            if (fileInfo) {
                fileInfo.innerHTML = '<div class="loading">Procesando datos...</div>';
            }
            newBtn.disabled = true;
            
            // Leer y procesar archivo
            window.FileUploader.readFile({
                delimiter,
                encoding
            }, (error, data) => {
                if (error) {
                    if (fileInfo) {
                        fileInfo.innerHTML = `<div class="error">Error al procesar el archivo: ${error.message}</div>`;
                    }
                    newBtn.disabled = false;
                    return;
                }
                
                try {
                    // Procesar datos con el procesador de datos
                    if (window.DataProcessor) {
                        const processedData = window.DataProcessor.processData(data, {
                            datasetName,
                            source: `Archivo local: ${currentFile.name}`,
                            removeEmpty: true,
                            convertTypes: true,
                            trimStrings: true
                        });
                        
                        console.log('Datos procesados:', processedData);
                        
                        // Mostrar éxito
                        if (fileInfo) {
                            fileInfo.innerHTML = `
                                <div class="success">
                                    <p>Archivo procesado con éxito:</p>
                                    <ul>
                                        <li>Filas: ${processedData.data.length}</li>
                                        <li>Columnas: ${processedData.data.length > 0 ? Object.keys(processedData.data[0]).length : 0}</li>
                                    </ul>
                                </div>`;
                        }
                        
                        // Actualizar interfaz de historial
                        updateDatasetHistoryUI();
                        
                        // Mostrar opción para ir a la vista de análisis
                        const uploadForm = document.getElementById('upload-form');
                        if (uploadForm) {
                            uploadForm.innerHTML = `
                                <div class="success-message">
                                    <h3>¡Datos cargados correctamente!</h3>
                                    <p>Se han procesado ${processedData.data.length} filas de datos.</p>
                                    <div class="upload-actions mt-2">
                                        <button type="button" class="btn" onclick="loadView('analysis')">
                                            Ir a Análisis
                                        </button>
                                        <button type="button" class="btn btn-secondary" onclick="loadView('upload')">
                                            Cargar otro archivo
                                        </button>
                                    </div>
                                </div>
                            `;
                        }
                    } else {
                        if (fileInfo) {
                            fileInfo.innerHTML = '<div class="error">Error: Módulo DataProcessor no disponible</div>';
                        }
                        newBtn.disabled = false;
                    }
                } catch (processError) {
                    console.error('Error al procesar:', processError);
                    if (fileInfo) {
                        fileInfo.innerHTML = `<div class="error">Error al procesar: ${processError.message}</div>`;
                    }
                    newBtn.disabled = false;
                }
            });
        });
    }
    
    // Evento para procesar URL
    const processUrlBtn = document.getElementById('process-url-btn');
    if (processUrlBtn && window.UrlLoader && window.DataProcessor) {
        // Eliminar eventos anteriores
        const newUrlBtn = processUrlBtn.cloneNode(true);
        processUrlBtn.parentNode.replaceChild(newUrlBtn, processUrlBtn);
        
        newUrlBtn.addEventListener('click', async () => {
            console.log('Procesando URL...');
            
            const dataUrl = document.getElementById('data-url')?.value.trim();
            
            if (!dataUrl) {
                alert('Por favor, introduce una URL válida');
                return;
            }
            
            // Obtener opciones
            const dataType = document.getElementById('url-data-type')?.value || 'auto';
            const delimiter = document.getElementById('url-delimiter')?.value || 'comma';
            const datasetName = document.getElementById('url-dataset-name')?.value || 
                                new URL(dataUrl).pathname.split('/').pop() || 'Datos externos';
            
            // Mostrar indicador de carga
            const urlForm = document.getElementById('url-form');
            const loadingMsg = document.createElement('div');
            loadingMsg.className = 'loading-message';
            loadingMsg.innerHTML = '<div class="loading">Cargando datos desde URL...</div>';
            if (urlForm) {
                urlForm.appendChild(loadingMsg);
            }
            
            newUrlBtn.disabled = true;
            
            try {
                // Procesar URL de Google Sheets si es necesario
                let finalUrl = dataUrl;
                if (dataType === 'gsheets' || (dataType === 'auto' && dataUrl.includes('docs.google.com/spreadsheets'))) {
                    finalUrl = window.UrlLoader.getGoogleSheetsCsvUrl(dataUrl);
                }
                
                // Determinar tipo de datos real
                let actualDataType = dataType;
                if (dataType === 'auto') {
                    actualDataType = window.UrlLoader.detectDataType(finalUrl);
                }
                
                // Configurar opciones de CSV si es necesario
                const csvOptions = {};
                if (actualDataType === window.UrlLoader.DATA_TYPES.CSV) {
                    switch(delimiter) {
                        case 'comma': csvOptions.delimiter = ','; break;
                        case 'semicolon': csvOptions.delimiter = ';'; break;
                        case 'tab': csvOptions.delimiter = '\t'; break;
                    }
                    csvOptions.header = true;
                    csvOptions.dynamicTyping = true;
                    csvOptions.skipEmptyLines = true;
                }
                
                // Cargar datos
                const data = await window.UrlLoader.fetchData(finalUrl, {
                    dataType: actualDataType,
                    csvOptions
                });
                
                // Procesar datos
                const processedData = window.DataProcessor.processData(data, {
                    datasetName,
                    source: `URL: ${dataUrl}`,
                    removeEmpty: true,
                    convertTypes: true,
                    trimStrings: true
                });
                
                console.log('Datos desde URL procesados:', processedData);
                
                // Eliminar indicador de carga
                if (urlForm && urlForm.contains(loadingMsg)) {
                    urlForm.removeChild(loadingMsg);
                }
                
                // Mostrar éxito
                if (urlForm) {
                    urlForm.innerHTML = `
                        <div class="success-message">
                            <h3>¡Datos cargados correctamente!</h3>
                            <p>Se han procesado ${processedData.data.length} filas de datos desde URL.</p>
                            <div class="upload-actions mt-2">
                                <button type="button" class="btn" onclick="loadView('analysis')">
                                    Ir a Análisis
                                </button>
                                <button type="button" class="btn btn-secondary" onclick="loadView('upload')">
                                    Cargar otros datos
                                </button>
                            </div>
                        </div>
                    `;
                }
                
                // Actualizar interfaz de historial
                updateDatasetHistoryUI();
                
            } catch (error) {
                console.error('Error al cargar desde URL:', error);
                
                // Eliminar indicador de carga
                if (urlForm && urlForm.contains(loadingMsg)) {
                    urlForm.removeChild(loadingMsg);
                }
                
                // Mostrar error
                const errorMsg = document.createElement('div');
                errorMsg.className = 'error-message';
                errorMsg.innerHTML = `
                    <h3>Error al cargar datos</h3>
                    <p>${error.message}</p>
                `;
                if (urlForm) {
                    urlForm.appendChild(errorMsg);
                }
                
                newUrlBtn.disabled = false;
                
                // Eliminar mensaje de error después de 5 segundos
                setTimeout(() => {
                    if (urlForm && urlForm.contains(errorMsg)) {
                        urlForm.removeChild(errorMsg);
                    }
                }, 5000);
            }
        });
    }
    
    // Inicializar el procesador de datos para cargar el historial
    if (window.DataProcessor) {
        window.DataProcessor.init();
        updateDatasetHistoryUI();
    }
}

// Función para actualizar la interfaz del historial
function updateDatasetHistoryUI() {
    if (!window.DataProcessor) return;
    
    const historyContainer = document.querySelector('.upload-history');
    if (!historyContainer) return;
    
    const datasetHistory = window.DataProcessor.getDatasetHistory();
    
    if (!datasetHistory || datasetHistory.length === 0) {
        historyContainer.innerHTML = '<p class="no-data">No hay archivos recientes</p>';
        return;
    }
    
    // Crear lista de conjuntos de datos
    const historyList = document.createElement('ul');
    historyList.className = 'dataset-history-list';
    
    // Limitar a los últimos 5 conjuntos
    const recentDatasets = datasetHistory.slice(0, 5);
    
    recentDatasets.forEach(dataset => {
        const listItem = document.createElement('li');
        listItem.className = 'dataset-item';
        
        // Formatear fecha
        const date = new Date(dataset.timestamp);
        const formattedDate = date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
        
        // Crear HTML del elemento
        listItem.innerHTML = `
            <div class="dataset-info">
                <span class="dataset-name">${dataset.meta?.datasetName || 'Dataset sin nombre'}</span>
                <span class="dataset-date">${formattedDate}</span>
            </div>
            <div class="dataset-description">${dataset.description}</div>
            <div class="dataset-actions">
                <button class="btn-small" data-action="load" data-id="${dataset.id}">Cargar</button>
                <button class="btn-small btn-secondary" data-action="delete" data-id="${dataset.id}">Eliminar</button>
            </div>
        `;
        
        // Agregar eventos a los botones
        listItem.querySelector('[data-action="load"]').addEventListener('click', () => {
            if (window.DataProcessor && window.DataProcessor.loadDataset) {
                window.DataProcessor.loadDataset(dataset.id);
            }
        });
        
        listItem.querySelector('[data-action="delete"]').addEventListener('click', () => {
            if (window.DataProcessor && window.DataProcessor.removeDataset) {
                window.DataProcessor.removeDataset(dataset.id);
                updateDatasetHistoryUI(); // Actualizar después de eliminar
            }
        });
        
        historyList.appendChild(listItem);
    });
    
    // Limpiar contenedor y agregar la lista
    historyContainer.innerHTML = '';
    historyContainer.appendChild(historyList);
}

// Formatear el tamaño del archivo para mostrar
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Configurar eventos de navegación
document.addEventListener('DOMContentLoaded', () => {
    const navItems = document.querySelectorAll('#main-nav .nav-item');
    
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const view = item.dataset.view;
            loadView(view);
        });
    });
});

// Función para actualizar la tabla de datos
function updateDataTable(data) {
    if (!data || data.length === 0) return;
    
    const tableHead = document.getElementById('data-table-head');
    const tableBody = document.getElementById('data-table-body');
    
    if (!tableHead || !tableBody) return;
    
    // Crear encabezados
    const headers = Object.keys(data[0]);
    tableHead.innerHTML = `
        <tr>
            ${headers.map(header => `<th>${header}</th>`).join('')}
        </tr>
    `;
    
    // Mostrar primeras 10 filas
    const displayData = data.slice(0, 10);
    
    // Generar filas
    tableBody.innerHTML = displayData.map(row => {
        const cells = Object.values(row).map(value => {
            let displayValue = value;
            if (typeof value === 'number') {
                displayValue = value.toLocaleString();
            } else if (value instanceof Date) {
                displayValue = value.toLocaleDateString();
            }
            return `<td>${displayValue}</td>`;
        }).join('');
        return `<tr>${cells}</tr>`;
    }).join('');
    
    // Actualizar información de paginación
    const paginationInfo = document.getElementById('pagination-info');
    if (paginationInfo) {
        paginationInfo.textContent = `Mostrando 1-${Math.min(10, data.length)} de ${data.length} registros`;
    }
}

function setupStatisticsEvents() {
    console.log('Configurando eventos de estadísticas...');
    
    // Selector de fuente de datos
    const dataSource = document.getElementById('data-source');
    if (dataSource && !dataSource.hasAttribute('data-events-setup')) {
        dataSource.setAttribute('data-events-setup', 'true');
        dataSource.addEventListener('change', handleStatisticsDataSourceChange);
        console.log('Evento del selector de datos configurado');
    }
    
    // Botón de actualizar
    const refreshBtn = document.getElementById('refresh-stats-btn');
    if (refreshBtn && !refreshBtn.hasAttribute('data-events-setup')) {
        refreshBtn.setAttribute('data-events-setup', 'true');
        refreshBtn.addEventListener('click', () => {
            console.log('Actualizando estadísticas manualmente...');
            handleStatisticsDataSourceChange();
        });
        console.log('Evento del botón actualizar configurado');
    }

    const additionalChartType = document.getElementById('additional-chart-type');
    if (additionalChartType && !additionalChartType.hasAttribute('data-events-setup')) {
        additionalChartType.setAttribute('data-events-setup', 'true');
        
        // Eliminar eventos anteriores para evitar duplicados
        additionalChartType.removeEventListener('change', updateAdditionalChart);
        
        // Agregar evento con más logging
        additionalChartType.addEventListener('change', function(event) {
            console.log('Evento change del selector disparado');
            console.log('Valor seleccionado:', event.target.value);
            console.log('Elemento que disparó:', event.target);
            
            // Pequeño delay para asegurar que el DOM esté actualizado
            setTimeout(() => {
                console.log('Cambiando tipo de gráfico adicional a:', event.target.value);
                updateAdditionalChart();
            }, 50);
        });
        
        console.log('Evento del selector de gráfico adicional configurado');
    }
    
    // Botón de descarga
    const downloadBtn = document.getElementById('download-data');
    if (downloadBtn && !downloadBtn.hasAttribute('data-events-setup')) {
        downloadBtn.setAttribute('data-events-setup', 'true');
        downloadBtn.addEventListener('click', downloadStatisticsData);
        console.log('Evento del botón descargar configurado');
    }
}

// REEMPLAZAR la función updateAdditionalChart() en navigation.js con esta versión corregida:

// REEMPLAZAR la función updateAdditionalChart() en navigation.js con esta versión corregida:

function updateAdditionalChart() {
    const chartTypeElement = document.getElementById('additional-chart-type');
    if (!chartTypeElement) {
        console.log('Selector de tipo de gráfico adicional no encontrado');
        return;
    }
    
    const chartType = chartTypeElement.value;
    console.log('updateAdditionalChart: Actualizando gráfico adicional con tipo:', chartType);
    
    // Obtener datos actuales
    let currentData = null;
    
    // Intentar obtener datos del DataProcessor
    if (window.DataProcessor) {
        currentData = window.DataProcessor.getCurrentData();
        console.log('updateAdditionalChart: Datos de DataProcessor:', currentData?.length || 0);
    }
    
    // Si no hay datos actuales, intentar obtener de la fuente seleccionada
    if (!currentData || currentData.length === 0) {
        const dataSource = document.getElementById('data-source');
        if (dataSource) {
            const selectedValue = dataSource.value;
            console.log('updateAdditionalChart: Fuente seleccionada:', selectedValue);
            
            if (selectedValue === 'current' && window.DataProcessor) {
                currentData = window.DataProcessor.getCurrentData();
            } else if (selectedValue.startsWith('test-') && window.TestData) {
                const testType = selectedValue.replace('test-', '');
                const testData = window.TestData.loadTestData(testType);
                currentData = testData.data;
                console.log('updateAdditionalChart: Datos de prueba cargados:', currentData?.length || 0);
            }
        }
    }
    
    console.log('updateAdditionalChart: Datos finales disponibles:', currentData?.length || 0, 'registros');
    
    if (!currentData || currentData.length === 0) {
        console.warn('updateAdditionalChart: No hay datos disponibles para el gráfico adicional');
        
        // Mostrar mensaje en el gráfico
        const statsElement = document.getElementById('additional-stats');
        if (statsElement) {
            statsElement.textContent = 'No hay datos disponibles para este análisis';
        }
        return;
    }
    
    // Usar el nuevo sistema de gráficos adicionales
    if (window.AdditionalChart && window.AdditionalChart.updateChart) {
        console.log('updateAdditionalChart: Llamando a AdditionalChart.updateChart con:', chartType, currentData.length, 'registros');
        // ✅ AQUÍ ESTÁ EL FIX PRINCIPAL: pasar los parámetros correctamente
        window.AdditionalChart.updateChart(chartType, currentData);
    } else {
        console.error('updateAdditionalChart: AdditionalChart no está disponible o no tiene updateChart');
        console.log('updateAdditionalChart: window.AdditionalChart =', window.AdditionalChart);
    }
}

function handleStatisticsDataSourceChange() {
    const dataSource = document.getElementById('data-source');
    if (!dataSource) {
        console.log('Selector de datos no encontrado');
        return;
    }
    
    const selectedValue = dataSource.value;
    console.log('Cambiando fuente de datos a:', selectedValue);
    
    let data = null;
    let meta = {};
    
    if (selectedValue === 'current') {
        // Cargar datos actuales
        if (window.DataProcessor) {
            data = window.DataProcessor.getCurrentData();
            meta = window.DataProcessor.getCurrentMeta() || {};
            console.log('Cargando datos actuales:', data?.length || 0, 'registros');
        }
    } else if (selectedValue.startsWith('test-')) {
        // Cargar datos de prueba
        const testType = selectedValue.replace('test-', '');
        if (window.TestData) {
            const testData = window.TestData.loadTestData(testType);
            data = testData.data;
            meta = testData.meta;
            console.log('Cargando datos de prueba:', testType, '-', data?.length || 0, 'registros');
        }
    }
    
    if (data && data.length > 0) {
        // Actualizar gráficos
        if (window.AgeChart) {
            window.AgeChart.updateChart(data);
        }
        if (window.LocationChart) {
            window.LocationChart.updateChart(data);
        }
        
        // Actualizar estadísticas
        updateStatisticsDisplay(data, meta);
        
        // Actualizar tabla
        setTimeout(() => {
            updateDataTable(data);
            
            console.log('Tabla actualizada por cambio de fuente de datos');
        }, 100);
        
        // Actualizar gráfico adicional
        setTimeout(() => {
            updateAdditionalChart();
            console.log('Gráfico adicional actualizado por cambio de fuente de datos');
        }, 150);
    } else {
        console.log('No hay datos disponibles para la fuente seleccionada');
        showNoStatisticsData();
    }
}

function updateStatisticsDisplay(data, meta) {
    // Esta función actualiza las tarjetas de resumen y detalles
    // (código similar al que ya tienes arriba)
    console.log('Actualizando display de estadísticas...');
    
    // Total de registros
    const totalRecords = document.getElementById('total-records');
    if (totalRecords) {
        totalRecords.textContent = data.length.toLocaleString();
    }
    
    // Total de columnas
    const totalColumns = document.getElementById('total-columns');
    if (totalColumns) {
        totalColumns.textContent = Object.keys(data[0]).length;
    }
    
    // Calidad de datos
    const dataQuality = document.getElementById('data-quality');
    if (dataQuality) {
        const completeRows = data.filter(row => 
            Object.values(row).every(val => val !== null && val !== undefined && val !== '')
        ).length;
        const quality = Math.round((completeRows / data.length) * 100);
        dataQuality.textContent = quality + '%';
    }
    
    // Última actualización
    const lastUpdated = document.getElementById('last-updated');
    if (lastUpdated) {
        const date = meta.processedAt ? new Date(meta.processedAt) : new Date();
        lastUpdated.textContent = date.toLocaleDateString();
    }
    
    // Información detallada
    const datasetNameEl = document.getElementById('dataset-name');
    if (datasetNameEl) {
        datasetNameEl.textContent = meta.datasetName || 'Sin nombre';
    }
    
    const datasetSourceEl = document.getElementById('dataset-source');
    if (datasetSourceEl) {
        datasetSourceEl.textContent = meta.source || 'No especificada';
    }
}

function downloadStatisticsData() {
    // Obtener datos actuales del selector
    const dataSource = document.getElementById('data-source');
    let data = null;
    
    if (dataSource) {
        const selectedValue = dataSource.value;
        
        if (selectedValue === 'current' && window.DataProcessor) {
            data = window.DataProcessor.getCurrentData();
        } else if (selectedValue.startsWith('test-') && window.TestData) {
            const testType = selectedValue.replace('test-', '');
            const testData = window.TestData.loadTestData(testType);
            data = testData.data;
        }
    }
    
    if (!data || data.length === 0) {
        alert('No hay datos para descargar');
        return;
    }
    
    // Generar CSV
    const headers = Object.keys(data[0]);
    const csvContent = [
        headers.join(','),
        ...data.map(row => 
            headers.map(header => {
                const value = row[header];
                if (typeof value === 'string' && value.includes(',')) {
                    return `"${value}"`;
                }
                return value;
            }).join(',')
        )
    ].join('\n');
    
    // Descargar archivo
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'estadisticas_datos.csv';
    a.click();
    window.URL.revokeObjectURL(url);
    
    console.log('Descarga de datos iniciada');
}

function showNoStatisticsData() {
    // Limpiar resumen
    const elements = [
        'total-records', 'total-columns', 'data-quality', 'last-updated',
        'dataset-name', 'dataset-source', 'complete-rows', 'incomplete-rows',
        'data-types', 'memory-usage'
    ];
    
    elements.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = id.includes('quality') ? '0%' : (id.includes('records') || id.includes('columns') ? '0' : '-');
        }
    });
    
    // Mensaje en tabla
    const tableBody = document.getElementById('data-table-body');
    if (tableBody) {
        tableBody.innerHTML = '<tr><td colspan="100%">No hay datos disponibles. Selecciona una fuente de datos.</td></tr>';
    }
}

window.debugAdditionalChart = function(type) {
    console.log('=== DEBUG ADDITIONAL CHART ===');
    console.log('Tipo solicitado:', type);
    
    // Verificar elementos
    const selector = document.getElementById('additional-chart-type');
    const canvas = document.getElementById('additional-chart');
    const statsElement = document.getElementById('additional-stats');
    
    console.log('Elementos encontrados:', {
        selector: !!selector,
        canvas: !!canvas,
        statsElement: !!statsElement,
        selectorValue: selector?.value
    });
    
    // Verificar datos
    const data = window.DataProcessor?.getCurrentData();
    console.log('Datos disponibles:', data?.length || 0);
    console.log('Primer registro:', data?.[0]);
    
    // Verificar funciones
    console.log('Funciones disponibles:', {
        AdditionalChart: !!window.AdditionalChart,
        updateChart: !!window.AdditionalChart?.updateChart,
        DataProcessor: !!window.DataProcessor,
        getCurrentData: !!window.DataProcessor?.getCurrentData
    });
    
    // Intentar actualizar
    if (type && data && window.AdditionalChart) {
        console.log('Intentando actualizar con:', type);
        window.AdditionalChart.updateChart(type, data);
    }
    
    console.log('=== FIN DEBUG ===');
};

console.log('Función de debug disponible: window.debugAdditionalChart("salary")');