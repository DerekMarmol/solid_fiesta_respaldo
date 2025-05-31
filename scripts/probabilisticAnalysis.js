/**
 * probabilisticAnalysis.js
 * Módulo de análisis probabilístico con distribución normal
 * Para cumplir con los requisitos del proyecto de estadística
 */

// Variables globales
let currentProbData = null;
let currentVariable = null;
let variableStats = null;
let normalChart = null;
let calculationHistory = [];

/**
 * Inicializar módulo de análisis probabilístico
 */
function initProbabilisticAnalysis() {
    console.log('Inicializando módulo de análisis probabilístico...');
    
    // Configurar eventos
    setupProbabilisticEvents();
    
    // Inicializar gráfico
    initNormalDistributionChart();
    
    // Cargar datos iniciales
    loadProbabilisticData();
    
    console.log('Módulo de análisis probabilístico inicializado');
}

/**
 * Configurar eventos de la interfaz
 */
function setupProbabilisticEvents() {
    // Selector de fuente de datos
    const dataSource = document.getElementById('prob-data-source');
    if (dataSource) {
        dataSource.addEventListener('change', loadProbabilisticData);
    }
    
    // Selector de variable
    const variableSelector = document.getElementById('prob-variable');
    if (variableSelector) {
        variableSelector.addEventListener('change', selectVariable);
    }
    
    // Botón de actualizar
    const refreshBtn = document.getElementById('refresh-prob-data');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', loadProbabilisticData);
    }
    
    // Botones de cálculo
    document.getElementById('calc-exact')?.addEventListener('click', calculateExactProbability);
    document.getElementById('calc-greater')?.addEventListener('click', calculateGreaterProbability);
    document.getElementById('calc-less')?.addEventListener('click', calculateLessProbability);
    document.getElementById('calc-range')?.addEventListener('click', calculateRangeProbability);
    
    // Controles del gráfico
    document.getElementById('reset-chart')?.addEventListener('click', resetNormalChart);
    document.getElementById('export-chart')?.addEventListener('click', exportNormalChart);
    
    // Ejemplos
    document.getElementById('generate-examples')?.addEventListener('click', generatePracticalExamples);
    document.getElementById('clear-examples')?.addEventListener('click', clearExamples);
    
    // Historial
    document.getElementById('clear-history')?.addEventListener('click', clearCalculationHistory);
    document.getElementById('export-history')?.addEventListener('click', exportCalculationHistory);
}

/**
 * Cargar datos para análisis probabilístico
 */
function loadProbabilisticData() {
    console.log('Cargando datos para análisis probabilístico...');
    
    const dataSource = document.getElementById('prob-data-source');
    if (!dataSource) return;
    
    const selectedValue = dataSource.value;
    let data = null;
    
    if (selectedValue === 'current') {
        // Cargar datos actuales
        if (window.DataProcessor) {
            data = window.DataProcessor.getCurrentData();
        }
    } else if (selectedValue.startsWith('test-')) {
        // Cargar datos de prueba
        const testType = selectedValue.replace('test-', '');
        if (window.TestData) {
            const testData = window.TestData.loadTestData(testType);
            data = testData.data;
        }
    }
    
    if (data && data.length > 0) {
        currentProbData = data;
        updateVariableSelector(data);
        console.log('Datos cargados:', data.length, 'registros');
    } else {
        console.warn('No se pudieron cargar datos');
        currentProbData = null;
        updateVariableSelector([]);
    }
}

/**
 * Actualizar selector de variables con campos numéricos
 */
function updateVariableSelector(data) {
    const selector = document.getElementById('prob-variable');
    if (!selector || !data || data.length === 0) return;
    
    // Limpiar opciones
    selector.innerHTML = '<option value="">Selecciona una variable...</option>';
    
    // Obtener campos numéricos con mejor detección
    const firstRow = data[0];
    const numericFields = [];
    
    console.log('Analizando campos para detección numérica:', Object.keys(firstRow));
    
    Object.keys(firstRow).forEach(field => {
        console.log(`Analizando campo: ${field}`);
        
        // Tomar una muestra más grande para mejor análisis
        const sampleSize = Math.min(data.length, 50);
        const values = data.slice(0, sampleSize).map(row => row[field]);
        
        console.log(`Valores de muestra para ${field}:`, values.slice(0, 5));
        
        // Contar valores numéricos válidos
        let numericCount = 0;
        let validValues = [];
        
        values.forEach(val => {
            if (val === null || val === undefined || val === '') {
                return; // Ignorar valores vacíos
            }
            
            let numericVal = null;
            
            // Si ya es número
            if (typeof val === 'number' && !isNaN(val)) {
                numericVal = val;
            }
            // Si es string que se puede convertir a número
            else if (typeof val === 'string') {
                const trimmed = val.trim();
                
                // Intentar conversión directa
                const parsed = parseFloat(trimmed);
                if (!isNaN(parsed) && isFinite(parsed)) {
                    numericVal = parsed;
                }
                // Verificar si contiene solo dígitos (para edades como "25", "30", etc.)
                else if (/^\d+$/.test(trimmed)) {
                    numericVal = parseInt(trimmed);
                }
                // Verificar patrones de números decimales
                else if (/^\d+\.\d+$/.test(trimmed)) {
                    numericVal = parseFloat(trimmed);
                }
            }
            
            if (numericVal !== null && numericVal >= 0 && numericVal <= 999999) {
                numericCount++;
                validValues.push(numericVal);
            }
        });
        
        const nonEmptyValues = values.filter(v => v !== null && v !== undefined && v !== '').length;
        const numericPercentage = nonEmptyValues > 0 ? (numericCount / nonEmptyValues) : 0;
        
        console.log(`Campo ${field}: ${numericCount}/${nonEmptyValues} valores numéricos (${(numericPercentage * 100).toFixed(1)}%)`);
        console.log(`Valores numéricos encontrados:`, validValues.slice(0, 5));
        
        // Considerar numérico si al menos 50% de los valores no vacíos son números válidos
        // Y hay al menos 2 valores numéricos únicos
        const uniqueNumbers = [...new Set(validValues)];
        
        if (numericPercentage >= 0.5 && uniqueNumbers.length >= 2 && validValues.length >= 3) {
            numericFields.push({
                field: field,
                count: numericCount,
                percentage: numericPercentage,
                values: validValues
            });
        }
    });
    
    console.log('Campos numéricos detectados:', numericFields);
    
    // Ordenar por porcentaje de valores numéricos (mayor primero)
    numericFields.sort((a, b) => b.percentage - a.percentage);
    
    // Agregar opciones
    numericFields.forEach(fieldInfo => {
        const option = document.createElement('option');
        option.value = fieldInfo.field;
        option.textContent = `${fieldInfo.field} (${fieldInfo.count} valores numéricos)`;
        selector.appendChild(option);
    });
    
    if (numericFields.length === 0) {
        const option = document.createElement('option');
        option.value = '';
        option.textContent = 'No se encontraron variables numéricas suficientes';
        option.disabled = true;
        selector.appendChild(option);
        
        // Mostrar debug información
        console.log('Datos de muestra del primer registro:');
        Object.entries(firstRow).forEach(([key, value]) => {
            console.log(`${key}: "${value}" (tipo: ${typeof value})`);
        });
    }
}

/**
 * Seleccionar variable para análisis
 */
function selectVariable() {
    const selector = document.getElementById('prob-variable');
    if (!selector || !currentProbData) return;
    
    const selectedField = selector.value;
    if (!selectedField) {
        currentVariable = null;
        variableStats = null;
        updateVariableInfo();
        return;
    }
    
    currentVariable = selectedField;
    
    // Calcular estadísticas de la variable
    const values = currentProbData
        .map(row => Number(row[selectedField]))
        .filter(val => !isNaN(val));
    
    if (values.length === 0) {
        console.warn('No hay valores numéricos válidos para la variable:', selectedField);
        return;
    }
    
    // Calcular estadísticas
    variableStats = calculateVariableStatistics(values);
    
    console.log('Variable seleccionada:', selectedField);
    console.log('Estadísticas:', variableStats);
    
    // Actualizar interfaz
    updateVariableInfo();
    enableCalculationButtons();
    resetNormalChart();
}

/**
 * Calcular estadísticas de una variable
 */
function calculateVariableStatistics(values) {
    const n = values.length;
    const mean = values.reduce((sum, val) => sum + val, 0) / n;
    
    // Desviación estándar
    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / n;
    const stdDev = Math.sqrt(variance);
    
    // Otras estadísticas
    const sortedValues = [...values].sort((a, b) => a - b);
    const min = sortedValues[0];
    const max = sortedValues[sortedValues.length - 1];
    const median = sortedValues[Math.floor(n / 2)];
    
    return {
        count: n,
        mean: mean,
        stdDev: stdDev,
        variance: variance,
        min: min,
        max: max,
        median: median,
        range: max - min
    };
}

/**
 * Actualizar información de la variable
 */
function updateVariableInfo() {
    const container = document.getElementById('variable-stats');
    if (!container) return;
    
    if (!variableStats || !currentVariable) {
        container.innerHTML = '<p>Selecciona una variable numérica para ver las estadísticas</p>';
        return;
    }
    
    container.innerHTML = `
        <div class="stat-item">
            <span>Variable:</span>
            <span><strong>${currentVariable}</strong></span>
        </div>
        <div class="stat-item">
            <span>Cantidad (n):</span>
            <span><strong>${variableStats.count}</strong></span>
        </div>
        <div class="stat-item">
            <span>Media (μ):</span>
            <span><strong>${variableStats.mean.toFixed(2)}</strong></span>
        </div>
        <div class="stat-item">
            <span>Desviación Estándar (σ):</span>
            <span><strong>${variableStats.stdDev.toFixed(2)}</strong></span>
        </div>
        <div class="stat-item">
            <span>Mínimo:</span>
            <span><strong>${variableStats.min}</strong></span>
        </div>
        <div class="stat-item">
            <span>Máximo:</span>
            <span><strong>${variableStats.max}</strong></span>
        </div>
        <div class="stat-item">
            <span>Mediana:</span>
            <span><strong>${variableStats.median}</strong></span>
        </div>
        <div class="stat-item">
            <span>Rango:</span>
            <span><strong>${variableStats.range.toFixed(2)}</strong></span>
        </div>
    `;
}

/**
 * Habilitar botones de cálculo
 */
function enableCalculationButtons() {
    const buttons = ['calc-exact', 'calc-greater', 'calc-less', 'calc-range', 'generate-examples'];
    buttons.forEach(id => {
        const btn = document.getElementById(id);
        if (btn) {
            btn.disabled = !variableStats;
        }
    });
}

/**
 * Función de distribución normal estándar (aproximación)
 */
function normalCDF(x) {
    // Aproximación de la función de distribución acumulativa normal estándar
    // Usando la aproximación de Abramowitz y Stegun
    const t = 1.0 / (1.0 + 0.2316419 * Math.abs(x));
    const d = 0.3989423 * Math.exp(-x * x / 2.0);
    let prob = d * t * (0.3193815 + t * (-0.3565638 + t * (1.7814779 + t * (-1.8212560 + t * 1.3302744))));
    
    if (x > 0) {
        prob = 1.0 - prob;
    }
    
    return prob;
}

/**
 * Función de densidad de probabilidad normal
 */
function normalPDF(x, mean = 0, stdDev = 1) {
    const coefficient = 1 / (stdDev * Math.sqrt(2 * Math.PI));
    const exponent = -0.5 * Math.pow((x - mean) / stdDev, 2);
    return coefficient * Math.exp(exponent);
}

/**
 * Calcular probabilidad usando distribución normal
 */
function calculateNormalProbability(x, mean, stdDev) {
    const z = (x - mean) / stdDev;
    return normalCDF(z);
}

/**
 * Calcular probabilidad exacta (aproximada para distribución continua)
 */
function calculateExactProbability() {
    if (!variableStats) return;
    
    const input = document.getElementById('exact-value');
    const resultDiv = document.getElementById('exact-result');
    
    if (!input || !resultDiv) return;
    
    const value = parseFloat(input.value);
    if (isNaN(value)) {
        showResult(resultDiv, 'Por favor ingresa un valor numérico válido', true);
        return;
    }
    
    // Para distribución continua, P(X = x) ≈ 0, pero calculamos P(x-0.5 < X < x+0.5)
    const lowerBound = value - 0.5;
    const upperBound = value + 0.5;
    
    const pLower = calculateNormalProbability(lowerBound, variableStats.mean, variableStats.stdDev);
    const pUpper = calculateNormalProbability(upperBound, variableStats.mean, variableStats.stdDev);
    const probability = pUpper - pLower;
    
    const result = `
        <strong>P(X ≈ ${value}) = ${(probability * 100).toFixed(4)}%</strong><br>
        <small>Calculado como P(${lowerBound} < X < ${upperBound})</small><br>
        <small>Media: ${variableStats.mean.toFixed(2)}, σ: ${variableStats.stdDev.toFixed(2)}</small>
    `;
    
    showResult(resultDiv, result, false);
    addToHistory('Exacta', `P(X ≈ ${value})`, probability);
    updateNormalChart('exact', value);
}

/**
 * Calcular probabilidad mayor que un valor
 */
function calculateGreaterProbability() {
    if (!variableStats) return;
    
    const input = document.getElementById('greater-value');
    const resultDiv = document.getElementById('greater-result');
    
    if (!input || !resultDiv) return;
    
    const value = parseFloat(input.value);
    if (isNaN(value)) {
        showResult(resultDiv, 'Por favor ingresa un valor numérico válido', true);
        return;
    }
    
    const probability = 1 - calculateNormalProbability(value, variableStats.mean, variableStats.stdDev);
    
    const result = `
        <strong>P(X > ${value}) = ${(probability * 100).toFixed(4)}%</strong><br>
        <small>Media: ${variableStats.mean.toFixed(2)}, σ: ${variableStats.stdDev.toFixed(2)}</small>
    `;
    
    showResult(resultDiv, result, false);
    addToHistory('Mayor que', `P(X > ${value})`, probability);
    updateNormalChart('greater', value);
}

/**
 * Calcular probabilidad menor que un valor
 */
function calculateLessProbability() {
    if (!variableStats) return;
    
    const input = document.getElementById('less-value');
    const resultDiv = document.getElementById('less-result');
    
    if (!input || !resultDiv) return;
    
    const value = parseFloat(input.value);
    if (isNaN(value)) {
        showResult(resultDiv, 'Por favor ingresa un valor numérico válido', true);
        return;
    }
    
    const probability = calculateNormalProbability(value, variableStats.mean, variableStats.stdDev);
    
    const result = `
        <strong>P(X < ${value}) = ${(probability * 100).toFixed(4)}%</strong><br>
        <small>Media: ${variableStats.mean.toFixed(2)}, σ: ${variableStats.stdDev.toFixed(2)}</small>
    `;
    
    showResult(resultDiv, result, false);
    addToHistory('Menor que', `P(X < ${value})`, probability);
    updateNormalChart('less', value);
}

/**
 * Calcular probabilidad entre rangos
 */
function calculateRangeProbability() {
    if (!variableStats) return;
    
    const minInput = document.getElementById('range-min');
    const maxInput = document.getElementById('range-max');
    const resultDiv = document.getElementById('range-result');
    
    if (!minInput || !maxInput || !resultDiv) return;
    
    const minValue = parseFloat(minInput.value);
    const maxValue = parseFloat(maxInput.value);
    
    if (isNaN(minValue) || isNaN(maxValue)) {
        showResult(resultDiv, 'Por favor ingresa valores numéricos válidos', true);
        return;
    }
    
    if (minValue >= maxValue) {
        showResult(resultDiv, 'El valor mínimo debe ser menor que el máximo', true);
        return;
    }
    
    const pMin = calculateNormalProbability(minValue, variableStats.mean, variableStats.stdDev);
    const pMax = calculateNormalProbability(maxValue, variableStats.mean, variableStats.stdDev);
    const probability = pMax - pMin;
    
    const result = `
        <strong>P(${minValue} < X < ${maxValue}) = ${(probability * 100).toFixed(4)}%</strong><br>
        <small>Media: ${variableStats.mean.toFixed(2)}, σ: ${variableStats.stdDev.toFixed(2)}</small>
    `;
    
    showResult(resultDiv, result, false);
    addToHistory('Entre rangos', `P(${minValue} < X < ${maxValue})`, probability);
    updateNormalChart('range', [minValue, maxValue]);
}

/**
 * Mostrar resultado en un div
 */
function showResult(resultDiv, content, isError = false) {
    resultDiv.innerHTML = content;
    resultDiv.className = `result-display visible ${isError ? 'error' : ''}`;
}

/**
 * Agregar cálculo al historial
 */
function addToHistory(type, calculation, probability) {
    const timestamp = new Date().toLocaleString();
    const historyItem = {
        timestamp,
        type,
        calculation,
        probability,
        variable: currentVariable,
        mean: variableStats.mean,
        stdDev: variableStats.stdDev
    };
    
    calculationHistory.unshift(historyItem);
    
    // Limitar historial a 20 elementos
    if (calculationHistory.length > 20) {
        calculationHistory = calculationHistory.slice(0, 20);
    }
    
    updateHistoryDisplay();
}

/**
 * Actualizar display del historial
 */
function updateHistoryDisplay() {
    const container = document.getElementById('history-list');
    if (!container) return;
    
    if (calculationHistory.length === 0) {
        container.innerHTML = '<p>No hay cálculos realizados</p>';
        return;
    }
    
    container.innerHTML = calculationHistory.map(item => `
        <div class="history-item">
            <div class="history-timestamp">${item.timestamp}</div>
            <div class="history-calculation">${item.calculation} (${item.variable})</div>
            <div class="history-result">Resultado: ${(item.probability * 100).toFixed(4)}%</div>
        </div>
    `).join('');
}

/**
 * Inicializar gráfico de distribución normal
 */
function initNormalDistributionChart() {
    const canvas = document.getElementById('normal-distribution-chart');
    if (!canvas) {
        console.error('Canvas para gráfico de distribución normal no encontrado');
        return;
    }
    
    const ctx = canvas.getContext('2d');
    
    normalChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Distribución Normal',
                data: [],
                borderColor: 'rgba(255, 99, 132, 1)',
                backgroundColor: 'rgba(255, 99, 132, 0.1)',
                borderWidth: 2,
                fill: false,
                pointRadius: 0
            }, {
                label: 'Área de Probabilidad',
                data: [],
                borderColor: 'rgba(54, 162, 235, 0.8)',
                backgroundColor: 'rgba(54, 162, 235, 0.3)',
                borderWidth: 1,
                fill: true,
                pointRadius: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Distribución Normal',
                    font: {
                        size: 16,
                        weight: 'bold'
                    }
                },
                legend: {
                    display: true,
                    position: 'top'
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Valor'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Densidad de Probabilidad'
                    },
                    beginAtZero: true
                }
            }
        }
    });
    
    console.log('Gráfico de distribución normal inicializado');
}

/**
 * Actualizar gráfico de distribución normal
 */
function updateNormalChart(type, value) {
    if (!normalChart || !variableStats) return;
    
    const mean = variableStats.mean;
    const stdDev = variableStats.stdDev;
    
    // Generar puntos para la curva normal
    const points = 200;
    const range = 4 * stdDev; // ±4 desviaciones estándar
    const start = mean - range;
    const end = mean + range;
    const step = (end - start) / points;
    
    const labels = [];
    const normalData = [];
    const areaData = [];
    
    for (let i = 0; i <= points; i++) {
        const x = start + i * step;
        const y = normalPDF(x, mean, stdDev);
        
        labels.push(x.toFixed(2));
        normalData.push({ x: x.toFixed(2), y: y });
        
        // Determinar si este punto está en el área de interés
        let inArea = false;
        
        switch (type) {
            case 'exact':
                inArea = Math.abs(x - value) <= 0.5;
                break;
            case 'greater':
                inArea = x >= value;
                break;
            case 'less':
                inArea = x <= value;
                break;
            case 'range':
                inArea = x >= value[0] && x <= value[1];
                break;
        }
        
        areaData.push({ x: x.toFixed(2), y: inArea ? y : 0 });
    }
    
    // Actualizar datos del gráfico
    normalChart.data.labels = labels;
    normalChart.data.datasets[0].data = normalData;
    normalChart.data.datasets[1].data = areaData;
    
    // Actualizar título
    let title = 'Distribución Normal';
    switch (type) {
        case 'exact':
            title += ` - P(X ≈ ${value})`;
            break;
        case 'greater':
            title += ` - P(X > ${value})`;
            break;
        case 'less':
            title += ` - P(X < ${value})`;
            break;
        case 'range':
            title += ` - P(${value[0]} < X < ${value[1]})`;
            break;
    }
    
    normalChart.options.plugins.title.text = title;
    normalChart.update();
}

/**
 * Resetear gráfico de distribución normal
 */
function resetNormalChart() {
    if (!normalChart) return;
    
    normalChart.data.labels = [];
    normalChart.data.datasets[0].data = [];
    normalChart.data.datasets[1].data = [];
    normalChart.options.plugins.title.text = 'Distribución Normal';
    normalChart.update();
}

/**
 * Exportar gráfico como imagen
 */
function exportNormalChart() {
    if (!normalChart) {
        alert('No hay gráfico para exportar');
        return;
    }
    
    const url = normalChart.toBase64Image('image/png', 1);
    const link = document.createElement('a');
    link.download = `distribucion_normal_${currentVariable || 'grafico'}.png`;
    link.href = url;
    link.click();
}

/**
 * Generar ejemplos prácticos
 */
function generatePracticalExamples() {
    if (!variableStats || !currentVariable) return;
    
    const container = document.getElementById('practical-examples');
    if (!container) return;
    
    const mean = variableStats.mean;
    const stdDev = variableStats.stdDev;
    
    // Generar valores de ejemplo basados en la distribución
    const example1 = Math.round(mean);
    const example2 = Math.round(mean + stdDev);
    const example3 = Math.round(mean - stdDev);
    const example4Min = Math.round(mean - 0.5 * stdDev);
    const example4Max = Math.round(mean + 0.5 * stdDev);
    
    container.innerHTML = `
        <h4>Ejemplos basados en tu variable: ${currentVariable}</h4>
        <div class="examples-grid">
            <div class="example-item">
                <strong>Ejemplo 1:</strong> ¿Cuál es la probabilidad de que ${currentVariable} sea exactamente ${example1}?
                <br><em>P(X ≈ ${example1})</em>
                <button onclick="setExampleValue('exact-value', ${example1})" class="btn-small">Usar este valor</button>
            </div>
            
            <div class="example-item">
                <strong>Ejemplo 2:</strong> ¿Cuál es la probabilidad de que ${currentVariable} sea mayor que ${example2}?
                <br><em>P(X > ${example2})</em>
                <button onclick="setExampleValue('greater-value', ${example2})" class="btn-small">Usar este valor</button>
            </div>
            
            <div class="example-item">
                <strong>Ejemplo 3:</strong> ¿Cuál es la probabilidad de que ${currentVariable} sea menor que ${example3}?
                <br><em>P(X < ${example3})</em>
                <button onclick="setExampleValue('less-value', ${example3})" class="btn-small">Usar este valor</button>
            </div>
            
            <div class="example-item">
                <strong>Ejemplo 4:</strong> ¿Cuál es la probabilidad de que ${currentVariable} esté entre ${example4Min} y ${example4Max}?
                <br><em>P(${example4Min} < X < ${example4Max})</em>
                <button onclick="setRangeExample(${example4Min}, ${example4Max})" class="btn-small">Usar estos valores</button>
            </div>
        </div>
        
        <div class="examples-note">
            <strong>Nota:</strong> Estos ejemplos están basados en las estadísticas de tu variable:
            <br>Media (μ) = ${mean.toFixed(2)}, Desviación Estándar (σ) = ${stdDev.toFixed(2)}
        </div>
    `;
}

/**
 * Establecer valor de ejemplo en un input
 */
function setExampleValue(inputId, value) {
    const input = document.getElementById(inputId);
    if (input) {
        input.value = value;
    }
}

/**
 * Establecer valores de ejemplo para rango
 */
function setRangeExample(min, max) {
    setExampleValue('range-min', min);
    setExampleValue('range-max', max);
}

/**
 * Limpiar ejemplos
 */
function clearExamples() {
    const container = document.getElementById('practical-examples');
    if (container) {
        container.innerHTML = '<p>Carga datos para ver ejemplos específicos basados en tu encuesta</p>';
    }
}

/**
 * Limpiar historial de cálculos
 */
function clearCalculationHistory() {
    calculationHistory = [];
    updateHistoryDisplay();
}

/**
 * Exportar historial como CSV
 */
function exportCalculationHistory() {
    if (calculationHistory.length === 0) {
        alert('No hay historial para exportar');
        return;
    }
    
    const csvContent = [
        'Timestamp,Tipo,Calculo,Variable,Media,Desviacion_Estandar,Probabilidad',
        ...calculationHistory.map(item => 
            `"${item.timestamp}","${item.type}","${item.calculation}","${item.variable}",${item.mean.toFixed(4)},${item.stdDev.toFixed(4)},${item.probability.toFixed(6)}`
        )
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = `historial_probabilidades_${new Date().toISOString().split('T')[0]}.csv`;
    link.href = url;
    link.click();
    window.URL.revokeObjectURL(url);
}

// Exportar funciones para uso global
window.ProbabilisticAnalysis = {
    init: initProbabilisticAnalysis,
    loadData: loadProbabilisticData,
    selectVariable: selectVariable,
    calculateExact: calculateExactProbability,
    calculateGreater: calculateGreaterProbability,
    calculateLess: calculateLessProbability,
    calculateRange: calculateRangeProbability,
    generateExamples: generatePracticalExamples
};

// Funciones globales para los ejemplos
window.setExampleValue = setExampleValue;
window.setRangeExample = setRangeExample;

// Auto-inicializar cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    // Esperar un poco para asegurar que Chart.js esté cargado
    setTimeout(() => {
        if (typeof Chart !== 'undefined' && document.getElementById('normal-distribution-chart')) {
            initProbabilisticAnalysis();
        }
    }, 500);
});

// CSS adicional para los ejemplos
const additionalCSS = `
.examples-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1rem;
    margin: 1rem 0;
}

.example-item {
    padding: 1rem;
    border: 1px solid #e9ecef;
    border-radius: 6px;
    background-color: #f8f9fa;
}

.example-item strong {
    color: #2c3e50;
}

.example-item em {
    font-family: 'Courier New', monospace;
    background-color: white;
    padding: 0.2rem 0.4rem;
    border-radius: 3px;
    display: inline-block;
    margin: 0.5rem 0;
}

.btn-small {
    background-color: #3498db;
    color: white;
    border: none;
    padding: 0.4rem 0.8rem;
    border-radius: 4px;
    font-size: 0.85rem;
    cursor: pointer;
    margin-top: 0.5rem;
}

.btn-small:hover {
    background-color: #2980b9;
}

.examples-note {
    margin-top: 1.5rem;
    padding: 1rem;
    background-color: #e8f4f8;
    border-left: 4px solid #3498db;
    border-radius: 4px;
    font-size: 0.9rem;
}
`;

// Agregar CSS adicional
const style = document.createElement('style');
style.textContent = additionalCSS;
document.head.appendChild(style);