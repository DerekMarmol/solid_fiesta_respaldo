/**
 * ageChart.js
 * Gráfico de distribución de edades
 * Persona 3: Gráficos básicos y vista de estadísticas generales
 */

// Variables globales para el gráfico
let ageChartInstance = null;
let currentAgeChartType = 'bar'; // 'bar', 'doughnut', 'line'

/**
 * Inicializar el gráfico de edades
 */
function initAgeChart() {
    const canvas = document.getElementById('age-chart');
    if (!canvas) {
        console.error('Canvas para gráfico de edades no encontrado');
        return;
    }
    
    // Destruir gráfico existente si existe
    if (ageChartInstance) {
        ageChartInstance.destroy();
    }
    
    // Crear nuevo gráfico
    const ctx = canvas.getContext('2d');
    ageChartInstance = new Chart(ctx, {
        type: currentAgeChartType,
        data: {
            labels: [],
            datasets: [{
                label: 'Cantidad de personas',
                data: [],
                backgroundColor: [
                    'rgba(54, 162, 235, 0.8)',
                    'rgba(255, 99, 132, 0.8)',
                    'rgba(255, 205, 86, 0.8)',
                    'rgba(75, 192, 192, 0.8)',
                    'rgba(153, 102, 255, 0.8)',
                    'rgba(255, 159, 64, 0.8)',
                    'rgba(199, 199, 199, 0.8)',
                    'rgba(83, 102, 255, 0.8)'
                ],
                borderColor: [
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 99, 132, 1)',
                    'rgba(255, 205, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                    'rgba(199, 199, 199, 1)',
                    'rgba(83, 102, 255, 1)'
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
                    text: 'Distribución por Rangos de Edad',
                    font: {
                        size: 16,
                        weight: 'bold'
                    }
                },
                legend: {
                    display: currentAgeChartType === 'doughnut',
                    position: 'bottom'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.parsed.y || context.parsed;
                            const percentage = getPercentage(value, context.dataset.data);
                            return `${label}: ${value} personas (${percentage}%)`;
                        }
                    }
                }
            },
            scales: currentAgeChartType !== 'doughnut' ? {
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
                        text: 'Rango de Edad'
                    }
                }
            } : {},
            onClick: (event, elements) => {
                if (elements.length > 0) {
                    const index = elements[0].index;
                    const label = ageChartInstance.data.labels[index];
                    const value = ageChartInstance.data.datasets[0].data[index];
                    
                    showAgeGroupDetails(label, value);
                }
            }
        }
    });
}

/**
 * Actualizar el gráfico de edades con nuevos datos
 * @param {Array} data - Array de objetos con los datos
 */
function updateAgeChart(data) {
    if (!data || data.length === 0) {
        console.warn('No hay datos para actualizar el gráfico de edades');
        return;
    }
    
    // Buscar columna de edad
    const ageField = findAgeField(data);
    if (!ageField) {
        console.warn('No se encontró una columna de edad en los datos');
        updateAgeStatsText('No se encontró información de edades en los datos');
        return;
    }
    
    // Procesar datos de edad
    const ageGroups = processAgeData(data, ageField);
    
    // Inicializar gráfico si no existe
    if (!ageChartInstance) {
        initAgeChart();
    }
    
    // Actualizar datos del gráfico
    ageChartInstance.data.labels = Object.keys(ageGroups);
    ageChartInstance.data.datasets[0].data = Object.values(ageGroups);
    ageChartInstance.update('active');
    
    // Actualizar estadísticas de texto
    updateAgeStatsText(generateAgeStats(data, ageField, ageGroups));
    
    console.log('Gráfico de edades actualizado con', data.length, 'registros');
}

/**
 * Buscar campo de edad en los datos
 * @param {Array} data - Datos a analizar
 * @returns {string|null} - Nombre del campo de edad encontrado
 */
function findAgeField(data) {
    if (!data || data.length === 0) return null;
    
    const firstRow = data[0];
    const possibleFields = ['edad', 'age', 'años', 'years', 'edades'];
    
    // Buscar por nombre exacto
    for (const field of possibleFields) {
        if (firstRow.hasOwnProperty(field)) {
            return field;
        }
    }
    
    // Buscar por nombre parcial (case insensitive)
    for (const key of Object.keys(firstRow)) {
        const lowerKey = key.toLowerCase();
        for (const field of possibleFields) {
            if (lowerKey.includes(field)) {
                return key;
            }
        }
    }
    
    // Buscar campo numérico que podría ser edad (valores entre 1 y 120)
    for (const key of Object.keys(firstRow)) {
        const values = data.slice(0, 10).map(row => row[key]).filter(val => typeof val === 'number');
        if (values.length > 0) {
            const avgValue = values.reduce((sum, val) => sum + val, 0) / values.length;
            if (avgValue >= 1 && avgValue <= 120) {
                return key;
            }
        }
    }
    
    return null;
}

/**
 * Procesar datos de edad en grupos
 * @param {Array} data - Datos originales
 * @param {string} ageField - Campo de edad
 * @returns {Object} - Grupos de edad con conteos
 */
function processAgeData(data, ageField) {
    const ageGroups = {
        '18-25': 0,
        '26-35': 0,
        '36-45': 0,
        '46-55': 0,
        '56-65': 0,
        '65+': 0,
        'Sin especificar': 0
    };
    
    data.forEach(row => {
        const age = row[ageField];
        
        if (age === null || age === undefined || age === '') {
            ageGroups['Sin especificar']++;
        } else {
            const numAge = Number(age);
            
            if (isNaN(numAge)) {
                ageGroups['Sin especificar']++;
            } else if (numAge >= 18 && numAge <= 25) {
                ageGroups['18-25']++;
            } else if (numAge >= 26 && numAge <= 35) {
                ageGroups['26-35']++;
            } else if (numAge >= 36 && numAge <= 45) {
                ageGroups['36-45']++;
            } else if (numAge >= 46 && numAge <= 55) {
                ageGroups['46-55']++;
            } else if (numAge >= 56 && numAge <= 65) {
                ageGroups['56-65']++;
            } else if (numAge > 65) {
                ageGroups['65+']++;
            } else {
                ageGroups['Sin especificar']++;
            }
        }
    });
    
    // Filtrar grupos con 0 elementos para mejor visualización
    const filteredGroups = {};
    Object.entries(ageGroups).forEach(([group, count]) => {
        if (count > 0) {
            filteredGroups[group] = count;
        }
    });
    
    return Object.keys(filteredGroups).length > 0 ? filteredGroups : ageGroups;
}

/**
 * Generar estadísticas de texto para las edades
 * @param {Array} data - Datos originales
 * @param {string} ageField - Campo de edad
 * @param {Object} ageGroups - Grupos de edad procesados
 * @returns {string} - Texto con estadísticas
 */
function generateAgeStats(data, ageField, ageGroups) {
    const ages = data.map(row => Number(row[ageField])).filter(age => !isNaN(age) && age > 0);
    
    if (ages.length === 0) {
        return 'No hay datos válidos de edad para mostrar estadísticas';
    }
    
    const minAge = Math.min(...ages);
    const maxAge = Math.max(...ages);
    const avgAge = Math.round(ages.reduce((sum, age) => sum + age, 0) / ages.length);
    
    // Encontrar el grupo más común
    const maxGroup = Object.entries(ageGroups).reduce((max, [group, count]) => 
        count > max.count ? { group, count } : max, { group: '', count: 0 });
    
    return `Edad promedio: ${avgAge} años • Rango: ${minAge}-${maxAge} años • Grupo más común: ${maxGroup.group} (${maxGroup.count} personas)`;
}

/**
 * Actualizar texto de estadísticas
 * @param {string} statsText - Texto a mostrar
 */
function updateAgeStatsText(statsText) {
    const statsElement = document.getElementById('age-stats');
    if (statsElement) {
        statsElement.textContent = statsText;
    }
}

/**
 * Cambiar tipo de gráfico
 * @param {string} newType - Nuevo tipo de gráfico ('bar', 'doughnut', 'line')
 */
function changeAgeChartType(newType) {
    if (!ageChartInstance) return;
    
    currentAgeChartType = newType;
    
    // Guardar datos actuales
    const currentData = {
        labels: [...ageChartInstance.data.labels],
        data: [...ageChartInstance.data.datasets[0].data]
    };
    
    // Destruir gráfico actual
    ageChartInstance.destroy();
    
    // Crear nuevo gráfico con el tipo especificado
    initAgeChart();
    
    // Restaurar datos
    ageChartInstance.data.labels = currentData.labels;
    ageChartInstance.data.datasets[0].data = currentData.data;
    ageChartInstance.update();
}

/**
 * Mostrar detalles de un grupo de edad específico
 * @param {string} ageGroup - Grupo de edad seleccionado
 * @param {number} count - Cantidad de personas en el grupo
 */
function showAgeGroupDetails(ageGroup, count) {
    // Crear modal o tooltip con información detallada
    const percentage = getPercentage(count, ageChartInstance.data.datasets[0].data);
    
    const message = `
Grupo de edad: ${ageGroup}
Cantidad: ${count} personas
Porcentaje: ${percentage}%
    `.trim();
    
    // Por ahora mostrar como alert, después se puede mejorar con un modal
    alert(message);
}

/**
 * Calcular porcentaje
 * @param {number} value - Valor específico
 * @param {Array} dataset - Array completo de datos
 * @returns {number} - Porcentaje redondeado
 */
function getPercentage(value, dataset) {
    const total = dataset.reduce((sum, val) => sum + val, 0);
    return total > 0 ? Math.round((value / total) * 100) : 0;
}

/**
 * Exportar gráfico de edades como imagen
 * @param {string} format - Formato de imagen ('png', 'jpeg')
 * @returns {string} - URL de la imagen generada
 */
function exportAgeChart(format = 'png') {
    if (!ageChartInstance) {
        console.error('No hay gráfico de edades para exportar');
        return null;
    }
    
    return ageChartInstance.toBase64Image('image/' + format, 1);
}

/**
 * Obtener datos del gráfico para exportación
 * @returns {Object} - Datos estructurados del gráfico
 */
function getAgeChartData() {
    if (!ageChartInstance) return null;
    
    return {
        type: 'age-distribution',
        chartType: currentAgeChartType,
        labels: ageChartInstance.data.labels,
        data: ageChartInstance.data.datasets[0].data,
        title: 'Distribución por Rangos de Edad'
    };
}

// Exportar funciones para uso global
window.AgeChart = {
    init: initAgeChart,
    updateChart: updateAgeChart,
    changeType: changeAgeChartType,
    export: exportAgeChart,
    getData: getAgeChartData
};

// Auto-inicializar cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    // Esperar un poco para asegurar que Chart.js esté cargado
    setTimeout(() => {
        if (typeof Chart !== 'undefined' && document.getElementById('age-chart')) {
            initAgeChart();
        }
    }, 500);
});