/**
 * additionalChart.js
 * Gráfico adicional dinámico para análisis personalizados
 * Persona 3: Gráficos básicos y vista de estadísticas generales
 */

// Variables globales para el gráfico adicional
let additionalChartInstance = null;
let currentAdditionalChartType = 'bar';

/**
 * Inicializar el gráfico adicional
 */
function initAdditionalChart() {
    const canvas = document.getElementById('additional-chart');
    if (!canvas) {
        console.error('Canvas para gráfico adicional no encontrado');
        return;
    }
    
    // Destruir gráfico existente si existe
    if (additionalChartInstance) {
        additionalChartInstance.destroy();
    }
    
    // Crear nuevo gráfico
    const ctx = canvas.getContext('2d');
    additionalChartInstance = new Chart(ctx, {
        type: currentAdditionalChartType,
        data: {
            labels: [],
            datasets: [{
                label: 'Cantidad',
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
                    'rgba(99, 255, 132, 0.8)'
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
                    'rgba(99, 255, 132, 1)'
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
                    text: 'Análisis Adicional',
                    font: {
                        size: 16,
                        weight: 'bold'
                    }
                },
                legend: {
                    display: currentAdditionalChartType === 'doughnut' || currentAdditionalChartType === 'pie',
                    position: 'bottom'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.parsed.y || context.parsed;
                            return `${label}: ${value}`;
                        }
                    }
                }
            },
            scales: currentAdditionalChartType !== 'doughnut' && currentAdditionalChartType !== 'pie' ? {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    }
                }
            } : {}
        }
    });
}

/**
 * Actualizar el gráfico adicional según el tipo seleccionado
 * @param {string} analysisType - Tipo de análisis: 'department', 'salary', 'gender', 'custom'
 * @param {Array} data - Array de objetos con los datos
 */
function updateAdditionalChart(analysisType, data) {
    console.log('updateAdditionalChart llamado con:', {
        analysisType: analysisType,
        dataLength: data?.length || 0,
        dataType: typeof data,
        isArray: Array.isArray(data),
        firstRow: data?.[0]
    });
    
    if (!data || data.length === 0) {
        console.warn('No hay datos para el gráfico adicional');
        updateAdditionalStatsText('No hay datos disponibles');
        return;
    }
    
    console.log('Actualizando gráfico adicional:', analysisType, 'con', data.length, 'registros');
    
    // Inicializar gráfico si no existe
    if (!additionalChartInstance) {
        initAdditionalChart();
    }
    
    let chartData = {};
    let chartTitle = 'Análisis Adicional';
    let statsText = '';
    
    switch (analysisType) {
        case 'department':
            chartData = processDepartmentData(data);
            chartTitle = 'Distribución por Departamento';
            statsText = generateDepartmentStats(data, chartData);
            break;
            
        case 'salary':
            chartData = processSalaryData(data);
            chartTitle = 'Distribución Salarial';
            statsText = generateSalaryStats(data, chartData);
            currentAdditionalChartType = 'bar';
            break;
            
        case 'gender':
            chartData = processGenderData(data);
            chartTitle = 'Distribución por Género';
            statsText = generateGenderStats(data, chartData);
            currentAdditionalChartType = 'doughnut';
            break;
            
        case 'custom':
            chartData = processCustomData(data);
            chartTitle = 'Análisis Personalizado';
            statsText = 'Análisis basado en los datos disponibles';
            break;
            
        default:
            console.warn('Tipo de análisis no reconocido:', analysisType);
            return;
    }
    
    // Actualizar el gráfico
    if (chartData.labels && chartData.values) {
        additionalChartInstance.data.labels = chartData.labels;
        additionalChartInstance.data.datasets[0].data = chartData.values;
        additionalChartInstance.data.datasets[0].label = chartData.label || 'Cantidad';
        
        // Actualizar título
        additionalChartInstance.options.plugins.title.text = chartTitle;
        
        // Actualizar tipo de gráfico si es necesario
        if (additionalChartInstance.config.type !== currentAdditionalChartType) {
            additionalChartInstance.destroy();
            initAdditionalChart();
            additionalChartInstance.data.labels = chartData.labels;
            additionalChartInstance.data.datasets[0].data = chartData.values;
            additionalChartInstance.data.datasets[0].label = chartData.label || 'Cantidad';
            additionalChartInstance.options.plugins.title.text = chartTitle;
        }
        
        additionalChartInstance.update('active');
        
        // Actualizar estadísticas de texto
        updateAdditionalStatsText(statsText);
        
        console.log('Gráfico adicional actualizado:', chartTitle);
    }
}

/**
 * Procesar datos por departamento
 * @param {Array} data - Datos originales
 * @returns {Object} - Datos procesados para el gráfico
 */
function processDepartmentData(data) {
    const departmentField = findField(data, ['departamento', 'department', 'dept', 'area']);
    
    if (!departmentField) {
        return { labels: ['Sin departamento'], values: [data.length] };
    }
    
    const departments = {};
    
    data.forEach(row => {
        const dept = row[departmentField] || 'Sin especificar';
        departments[dept] = (departments[dept] || 0) + 1;
    });
    
    return {
        labels: Object.keys(departments),
        values: Object.values(departments),
        label: 'Empleados por departamento'
    };
}

/**
 * Procesar datos salariales en rangos
 * @param {Array} data - Datos originales
 * @returns {Object} - Datos procesados para el gráfico
 */
function processSalaryData(data) {
    console.log('Procesando datos salariales:', data.length, 'registros');
    console.log('Primer registro:', data[0]);
    
    const salaryField = findField(data, ['salario', 'salary', 'sueldo', 'wage', 'ingresos']);
    console.log('Campo de salario encontrado:', salaryField);
    
    if (!salaryField) {
        console.warn('No se encontró campo de salario');
        return { labels: ['Sin datos salariales'], values: [data.length] };
    }
    
    const salaryRanges = {
        '0-30K': 0,
        '30K-40K': 0,
        '40K-50K': 0,
        '50K-60K': 0,
        '60K+': 0
    };
    
    data.forEach((row, index) => {
        const salaryValue = row[salaryField];
        const salary = Number(salaryValue) || 0;
        console.log(`Fila ${index}: ${salaryField} = ${salaryValue} -> ${salary}`);
        
        if (salary < 30000) {
            salaryRanges['0-30K']++;
        } else if (salary < 40000) {
            salaryRanges['30K-40K']++;
        } else if (salary < 50000) {
            salaryRanges['40K-50K']++;
        } else if (salary < 60000) {
            salaryRanges['50K-60K']++;
        } else {
            salaryRanges['60K+']++;
        }
    });
    
    console.log('Rangos salariales calculados:', salaryRanges);
    
    // Filtrar rangos con datos
    const filteredRanges = {};
    Object.entries(salaryRanges).forEach(([range, count]) => {
        if (count > 0) {
            filteredRanges[range] = count;
        }
    });
    
    const result = {
        labels: Object.keys(filteredRanges),
        values: Object.values(filteredRanges),
        label: 'Personas por rango salarial'
    };
    
    console.log('Resultado final:', result);
    return result;
}

/**
 * Procesar datos por género
 * @param {Array} data - Datos originales
 * @returns {Object} - Datos procesados para el gráfico
 */
function processGenderData(data) {
    console.log('Procesando datos de género:', data.length, 'registros');
    console.log('Primer registro:', data[0]);
    
    const genderField = findField(data, ['genero', 'gender', 'sexo', 'sex']);
    console.log('Campo de género encontrado:', genderField);
    
    if (!genderField) {
        console.warn('No se encontró campo de género');
        return { labels: ['Sin especificar'], values: [data.length] };
    }
    
    const genders = {};
    
    data.forEach((row, index) => {
        let genderValue = row[genderField] || 'Sin especificar';
        console.log(`Fila ${index}: ${genderField} = ${genderValue}`);
        
        // Normalizar valores comunes
        let gender = genderValue.toString().toLowerCase();
        if (gender.includes('masculino') || gender.includes('male') || gender === 'm') {
            gender = 'Masculino';
        } else if (gender.includes('femenino') || gender.includes('female') || gender === 'f') {
            gender = 'Femenino';
        } else {
            gender = 'Otro';
        }
        
        genders[gender] = (genders[gender] || 0) + 1;
    });
    
    console.log('Géneros calculados:', genders);
    
    const result = {
        labels: Object.keys(genders),
        values: Object.values(genders),
        label: 'Distribución por género'
    };
    
    console.log('Resultado final:', result);
    return result;
}

/**
 * Procesar datos personalizados (detecta automáticamente la mejor columna)
 * @param {Array} data - Datos originales
 * @returns {Object} - Datos procesados para el gráfico
 */
function processCustomData(data) {
    if (!data || data.length === 0) {
        return { labels: [], values: [] };
    }
    
    // Buscar la primera columna categórica (no numérica)
    const firstRow = data[0];
    let bestField = null;
    
    for (const field in firstRow) {
        const value = firstRow[field];
        if (typeof value === 'string' || isNaN(Number(value))) {
            bestField = field;
            break;
        }
    }
    
    if (!bestField) {
        // Si no hay campos categóricos, usar el primer campo
        bestField = Object.keys(firstRow)[0];
    }
    
    const categories = {};
    
    data.forEach(row => {
        const category = row[bestField] || 'Sin especificar';
        categories[category] = (categories[category] || 0) + 1;
    });
    
    // Limitar a máximo 10 categorías
    const sortedCategories = Object.entries(categories)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 10);
    
    return {
        labels: sortedCategories.map(([category]) => category),
        values: sortedCategories.map(([,count]) => count),
        label: `Distribución por ${bestField}`
    };
}

/**
 * Buscar un campo en los datos
 * @param {Array} data - Datos a analizar
 * @param {Array} possibleFields - Posibles nombres de campo
 * @returns {string|null} - Nombre del campo encontrado
 */
function findField(data, possibleFields) {
    if (!data || data.length === 0) return null;
    
    const firstRow = data[0];
    
    // Buscar por nombre exacto (case insensitive)
    for (const field of possibleFields) {
        const exactMatch = Object.keys(firstRow).find(key => 
            key.toLowerCase() === field.toLowerCase()
        );
        if (exactMatch) {
            return exactMatch;
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
    
    return null;
}

/**
 * Generar estadísticas de departamento
 */
function generateDepartmentStats(data, chartData) {
    const total = chartData.values.reduce((sum, val) => sum + val, 0);
    const departments = chartData.labels.length;
    const avgPerDept = Math.round(total / departments);
    
    const topDept = chartData.labels[
        chartData.values.indexOf(Math.max(...chartData.values))
    ];
    
    return `${departments} departamentos • Promedio: ${avgPerDept} personas/dept • Más grande: ${topDept}`;
}

/**
 * Generar estadísticas salariales
 */
function generateSalaryStats(data, chartData) {
    const salaryField = findField(data, ['salario', 'salary', 'sueldo', 'wage', 'ingresos']);
    
    if (!salaryField) {
        return 'No se encontraron datos salariales';
    }
    
    const salaries = data.map(row => Number(row[salaryField])).filter(s => s > 0);
    
    if (salaries.length === 0) {
        return 'No hay datos salariales válidos';
    }
    
    const avgSalary = Math.round(salaries.reduce((sum, s) => sum + s, 0) / salaries.length);
    const minSalary = Math.min(...salaries);
    const maxSalary = Math.max(...salaries);
    
    return `Promedio: $${avgSalary.toLocaleString()} • Rango: $${minSalary.toLocaleString()} - $${maxSalary.toLocaleString()}`;
}

/**
 * Generar estadísticas de género
 */
function generateGenderStats(data, chartData) {
    const total = chartData.values.reduce((sum, val) => sum + val, 0);
    const mostCommon = chartData.labels[
        chartData.values.indexOf(Math.max(...chartData.values))
    ];
    const percentage = Math.round((Math.max(...chartData.values) / total) * 100);
    
    return `${chartData.labels.length} categorías • Más común: ${mostCommon} (${percentage}%)`;
}

/**
 * Actualizar texto de estadísticas adicionales
 * @param {string} statsText - Texto a mostrar
 */
function updateAdditionalStatsText(statsText) {
    const statsElement = document.getElementById('additional-stats');
    if (statsElement) {
        statsElement.textContent = statsText;
    }
}

/**
 * Exportar gráfico adicional como imagen
 * @param {string} format - Formato de imagen ('png', 'jpeg')
 * @returns {string} - URL de la imagen generada
 */
function exportAdditionalChart(format = 'png') {
    if (!additionalChartInstance) {
        console.error('No hay gráfico adicional para exportar');
        return null;
    }
    
    return additionalChartInstance.toBase64Image('image/' + format, 1);
}

// Exportar funciones para uso global
window.AdditionalChart = {
    init: initAdditionalChart,
    updateChart: updateAdditionalChart,
    export: exportAdditionalChart
};

// Auto-inicializar cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    // Esperar un poco para asegurar que Chart.js esté cargado
    setTimeout(() => {
        if (typeof Chart !== 'undefined' && document.getElementById('additional-chart')) {
            initAdditionalChart();
        }
    }, 500);
});