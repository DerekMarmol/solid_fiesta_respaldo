/**
 * locationChart.js
 * Gráfico de distribución por ubicación/lugares de origen
 * Persona 3: Gráficos básicos y vista de estadísticas generales
 */

// Variables globales para el gráfico
let locationChartInstance = null;
let currentLocationChartType = 'doughnut'; // 'bar', 'doughnut', 'pie', 'polarArea'

/**
 * Inicializar el gráfico de ubicaciones
 */
function initLocationChart() {
    const canvas = document.getElementById('location-chart');
    if (!canvas) {
        console.error('Canvas para gráfico de ubicaciones no encontrado');
        return;
    }
    
    // Destruir gráfico existente si existe
    if (locationChartInstance) {
        locationChartInstance.destroy();
    }
    
    // Crear nuevo gráfico
    const ctx = canvas.getContext('2d');
    locationChartInstance = new Chart(ctx, {
        type: currentLocationChartType,
        data: {
            labels: [],
            datasets: [{
                label: 'Cantidad por ubicación',
                data: [],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.8)',
                    'rgba(54, 162, 235, 0.8)',
                    'rgba(255, 205, 86, 0.8)',
                    'rgba(75, 192, 192, 0.8)',
                    'rgba(153, 102, 255, 0.8)',
                    'rgba(255, 159, 64, 0.8)',
                    'rgba(199, 199, 199, 0.8)',
                    'rgba(83, 102, 255, 0.8)',
                    'rgba(255, 99, 255, 0.8)',
                    'rgba(99, 255, 132, 0.8)',
                    'rgba(255, 206, 84, 0.8)',
                    'rgba(54, 235, 162, 0.8)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 205, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                    'rgba(199, 199, 199, 1)',
                    'rgba(83, 102, 255, 1)',
                    'rgba(255, 99, 255, 1)',
                    'rgba(99, 255, 132, 1)',
                    'rgba(255, 206, 84, 1)',
                    'rgba(54, 235, 162, 1)'
                ],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Distribución por Ubicación',
                    font: {
                        size: 16,
                        weight: 'bold'
                    }
                },
                legend: {
                    display: true,
                    position: currentLocationChartType === 'bar' ? 'top' : 'bottom',
                    labels: {
                        generateLabels: function(chart) {
                            const data = chart.data;
                            if (data.labels.length && data.datasets.length) {
                                return data.labels.map((label, i) => {
                                    const value = data.datasets[0].data[i];
                                    const percentage = getLocationPercentage(value, data.datasets[0].data);
                                    return {
                                        text: `${label} (${value} - ${percentage}%)`,
                                        fillStyle: data.datasets[0].backgroundColor[i],
                                        strokeStyle: data.datasets[0].borderColor[i],
                                        lineWidth: data.datasets[0].borderWidth,
                                        hidden: false,
                                        index: i
                                    };
                                });
                            }
                            return [];
                        }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.parsed.y || context.parsed;
                            const percentage = getLocationPercentage(value, context.dataset.data);
                            return `${label}: ${value} personas (${percentage}%)`;
                        }
                    }
                }
            },
            scales: currentLocationChartType === 'bar' ? {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    },
                    title: {
                        display: true,
                        text: 'Número de Personas'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Ubicación'
                    }
                }
            } : {},
            onClick: (event, elements) => {
                if (elements.length > 0) {
                    const index = elements[0].index;
                    const label = locationChartInstance.data.labels[index];
                    const value = locationChartInstance.data.datasets[0].data[index];
                    
                    showLocationDetails(label, value);
                }
            }
        }
    });
}

/**
 * Actualizar el gráfico de ubicaciones con nuevos datos
 * @param {Array} data - Array de objetos con los datos
 */
function updateLocationChart(data) {
    if (!data || data.length === 0) {
        console.warn('No hay datos para actualizar el gráfico de ubicaciones');
        return;
    }
    
    // Buscar columna de ubicación
    const locationField = findLocationField(data);
    if (!locationField) {
        console.warn('No se encontró una columna de ubicación en los datos');
        updateLocationStatsText('No se encontró información de ubicaciones en los datos');
        return;
    }
    
    // Procesar datos de ubicación
    const locationGroups = processLocationData(data, locationField);
    
    // Inicializar gráfico si no existe
    if (!locationChartInstance) {
        initLocationChart();
    }
    
    // Actualizar datos del gráfico
    locationChartInstance.data.labels = Object.keys(locationGroups);
    locationChartInstance.data.datasets[0].data = Object.values(locationGroups);
    locationChartInstance.update('active');
    
    // Actualizar estadísticas de texto
    updateLocationStatsText(generateLocationStats(data, locationField, locationGroups));
    
    console.log('Gráfico de ubicaciones actualizado con', data.length, 'registros');
}

/**
 * Buscar campo de ubicación en los datos
 * @param {Array} data - Datos a analizar
 * @returns {string|null} - Nombre del campo de ubicación encontrado
 */
function findLocationField(data) {
    if (!data || data.length === 0) return null;
    
    const firstRow = data[0];
    const possibleFields = [
        'ubicacion', 'location', 'ciudad', 'city', 'lugar', 'place',
        'origen', 'origin', 'residencia', 'residence', 'direccion', 'address',
        'provincia', 'province', 'estado', 'state', 'region', 'pais', 'country',
        'donde', 'dónde', 'de_donde', 'de_dónde', 'procedencia', 'localidad'
    ];
    
    console.log('Buscando campo de ubicación en:', Object.keys(firstRow));
    
    // Buscar por nombre exacto (case insensitive)
    for (const field of possibleFields) {
        const exactMatch = Object.keys(firstRow).find(key => 
            key.toLowerCase() === field.toLowerCase()
        );
        if (exactMatch) {
            console.log('Campo de ubicación encontrado (exacto):', exactMatch);
            return exactMatch;
        }
    }
    
    // Buscar por nombre parcial (case insensitive) - más flexible
    for (const key of Object.keys(firstRow)) {
        const lowerKey = key.toLowerCase();
        for (const field of possibleFields) {
            if (lowerKey.includes(field)) {
                console.log('Campo de ubicación encontrado (parcial):', key);
                return key;
            }
        }
    }
    
    // Buscar patrones específicos en los nombres de columnas
    for (const key of Object.keys(firstRow)) {
        const lowerKey = key.toLowerCase();
        // Buscar patrones como "¿de dónde eres?" o similar
        if (lowerKey.includes('dónde') || lowerKey.includes('donde') || 
            lowerKey.includes('eres') || lowerKey.includes('vives') ||
            lowerKey.includes('ciudad') || lowerKey.includes('lugar')) {
            console.log('Campo de ubicación encontrado (patrón):', key);
            return key;
        }
    }
    
    console.log('No se encontró campo de ubicación');
    return null;
}


/**
 * Procesar datos de ubicación
 * @param {Array} data - Datos originales
 * @param {string} locationField - Campo de ubicación
 * @returns {Object} - Grupos de ubicación con conteos
 */
function processLocationData(data, locationField) {
    const locationCounts = {};
    
    data.forEach(row => {
        let location = row[locationField];
        
        // Limpiar y normalizar ubicación
        if (location === null || location === undefined || location === '') {
            location = 'Sin especificar';
        } else {
            location = String(location).trim();
            // Normalizar mayúsculas/minúsculas
            location = location.charAt(0).toUpperCase() + location.slice(1).toLowerCase();
        }
        
        if (locationCounts[location]) {
            locationCounts[location]++;
        } else {
            locationCounts[location] = 1;
        }
    });
    
    // Ordenar por frecuencia (mayor a menor)
    const sortedLocations = Object.entries(locationCounts)
        .sort(([,a], [,b]) => b - a)
        .reduce((obj, [key, value]) => {
            obj[key] = value;
            return obj;
        }, {});
    
    // Si hay demasiadas ubicaciones, agrupar las menos frecuentes
    if (Object.keys(sortedLocations).length > 10) {
        const topLocations = {};
        const entries = Object.entries(sortedLocations);
        
        // Tomar las primeras 9
        for (let i = 0; i < 9 && i < entries.length; i++) {
            topLocations[entries[i][0]] = entries[i][1];
        }
        
        // Agrupar el resto en "Otros"
        if (entries.length > 9) {
            const othersCount = entries.slice(9).reduce((sum, [,count]) => sum + count, 0);
            if (othersCount > 0) {
                topLocations['Otros'] = othersCount;
            }
        }
        
        return topLocations;
    }
    
    return sortedLocations;
}

/**
 * Generar estadísticas de texto para las ubicaciones
 * @param {Array} data - Datos originales
 * @param {string} locationField - Campo de ubicación
 * @param {Object} locationGroups - Grupos de ubicación procesados
 * @returns {string} - Texto con estadísticas
 */
function generateLocationStats(data, locationField, locationGroups) {
    const totalLocations = Object.keys(locationGroups).length;
    const totalPeople = Object.values(locationGroups).reduce((sum, count) => sum + count, 0);
    
    // Encontrar la ubicación más común
    const topLocation = Object.entries(locationGroups).reduce((max, [location, count]) => 
        count > max.count ? { location, count } : max, { location: '', count: 0 });
    
    // Calcular diversidad (distribución)
    const avgPerLocation = Math.round(totalPeople / totalLocations);
    
    return `${totalLocations} ubicaciones diferentes • Promedio: ${avgPerLocation} personas/ubicación • Más común: ${topLocation.location} (${topLocation.count} personas)`;
}

/**
 * Actualizar texto de estadísticas
 * @param {string} statsText - Texto a mostrar
 */
function updateLocationStatsText(statsText) {
    const statsElement = document.getElementById('location-stats');
    if (statsElement) {
        statsElement.textContent = statsText;
    }
}

/**
 * Cambiar tipo de gráfico
 * @param {string} newType - Nuevo tipo de gráfico ('bar', 'doughnut', 'pie', 'polarArea')
 */
function changeLocationChartType(newType) {
    if (!locationChartInstance) return;
    
    currentLocationChartType = newType;
    
    // Guardar datos actuales
    const currentData = {
        labels: [...locationChartInstance.data.labels],
        data: [...locationChartInstance.data.datasets[0].data]
    };
    
    // Destruir gráfico actual
    locationChartInstance.destroy();
    
    // Crear nuevo gráfico con el tipo especificado
    initLocationChart();
    
    // Restaurar datos
    locationChartInstance.data.labels = currentData.labels;
    locationChartInstance.data.datasets[0].data = currentData.data;
    locationChartInstance.update();
}

/**
 * Mostrar detalles de una ubicación específica
 * @param {string} location - Ubicación seleccionada
 * @param {number} count - Cantidad de personas en esa ubicación
 */
function showLocationDetails(location, count) {
    const percentage = getLocationPercentage(count, locationChartInstance.data.datasets[0].data);
    
    const message = `
Ubicación: ${location}
Cantidad: ${count} personas
Porcentaje: ${percentage}%
    `.trim();
    
    // Por ahora mostrar como alert, después se puede mejorar con un modal
    alert(message);
}

/**
 * Calcular porcentaje para ubicaciones
 * @param {number} value - Valor específico
 * @param {Array} dataset - Array completo de datos
 * @returns {number} - Porcentaje redondeado
 */
function getLocationPercentage(value, dataset) {
    const total = dataset.reduce((sum, val) => sum + val, 0);
    return total > 0 ? Math.round((value / total) * 100) : 0;
}

/**
 * Exportar gráfico de ubicaciones como imagen
 * @param {string} format - Formato de imagen ('png', 'jpeg')
 * @returns {string} - URL de la imagen generada
 */
function exportLocationChart(format = 'png') {
    if (!locationChartInstance) {
        console.error('No hay gráfico de ubicaciones para exportar');
        return null;
    }
    
    return locationChartInstance.toBase64Image('image/' + format, 1);
}

/**
 * Obtener datos del gráfico para exportación
 * @returns {Object} - Datos estructurados del gráfico
 */
function getLocationChartData() {
    if (!locationChartInstance) return null;
    
    return {
        type: 'location-distribution',
        chartType: currentLocationChartType,
        labels: locationChartInstance.data.labels,
        data: locationChartInstance.data.datasets[0].data,
        title: 'Distribución por Ubicación'
    };
}

// Exportar funciones para uso global
window.LocationChart = {
    init: initLocationChart,
    updateChart: updateLocationChart,
    changeType: changeLocationChartType,
    export: exportLocationChart,
    getData: getLocationChartData
};

// Auto-inicializar cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    // Esperar un poco para asegurar que Chart.js esté cargado
    setTimeout(() => {
        if (typeof Chart !== 'undefined' && document.getElementById('location-chart')) {
            initLocationChart();
        }
    }, 500);
});