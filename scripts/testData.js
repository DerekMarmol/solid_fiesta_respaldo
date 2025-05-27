/**
 * testData.js
 * Datos de prueba para facilitar el desarrollo y testing
 * Persona 5: Integración, pruebas y funcionalidades adicionales
 */

// Datos de prueba simulando una encuesta de empleados
const sampleEmployeeData = [
    { nombre: "Ana García", edad: 28, genero: "Femenino", ubicacion: "Madrid", departamento: "IT", salario: 45000 },
    { nombre: "Carlos Rodríguez", edad: 34, genero: "Masculino", ubicacion: "Barcelona", departamento: "Marketing", salario: 38000 },
    { nombre: "María López", edad: 29, genero: "Femenino", ubicacion: "Valencia", departamento: "IT", salario: 47000 },
    { nombre: "José Martínez", edad: 42, genero: "Masculino", ubicacion: "Sevilla", departamento: "Ventas", salario: 35000 },
    { nombre: "Laura Sánchez", edad: 31, genero: "Femenino", ubicacion: "Madrid", departamento: "RRHH", salario: 41000 },
    { nombre: "David Fernández", edad: 27, genero: "Masculino", ubicacion: "Bilbao", departamento: "IT", salario: 43000 },
    { nombre: "Carmen Jiménez", edad: 38, genero: "Femenino", ubicacion: "Barcelona", departamento: "Marketing", salario: 40000 },
    { nombre: "Miguel Torres", edad: 33, genero: "Masculino", ubicacion: "Valencia", departamento: "Ventas", salario: 36000 },
    { nombre: "Isabel Ruiz", edad: 26, genero: "Femenino", ubicacion: "Madrid", departamento: "IT", salario: 44000 },
    { nombre: "Antonio Morales", edad: 45, genero: "Masculino", ubicacion: "Sevilla", departamento: "RRHH", salario: 42000 },
    { nombre: "Lucía Herrera", edad: 30, genero: "Femenino", ubicacion: "Barcelona", departamento: "Marketing", salario: 39000 },
    { nombre: "Francisco Gómez", edad: 37, genero: "Masculino", ubicacion: "Madrid", departamento: "Ventas", salario: 37000 },
    { nombre: "Elena Castro", edad: 32, genero: "Femenino", ubicacion: "Valencia", departamento: "IT", salario: 46000 },
    { nombre: "Roberto Díaz", edad: 41, genero: "Masculino", ubicacion: "Bilbao", departamento: "RRHH", salario: 43000 },
    { nombre: "Patricia Vargas", edad: 25, genero: "Femenino", ubicacion: "Sevilla", departamento: "Marketing", salario: 38000 },
    { nombre: "Fernando Peña", edad: 39, genero: "Masculino", ubicacion: "Barcelona", departamento: "IT", salario: 48000 },
    { nombre: "Cristina Romero", edad: 28, genero: "Femenino", ubicacion: "Madrid", departamento: "Ventas", salario: 36000 },
    { nombre: "Alejandro Silva", edad: 35, genero: "Masculino", ubicacion: "Valencia", departamento: "RRHH", salario: 41000 },
    { nombre: "Marta Ramos", edad: 29, genero: "Femenino", ubicacion: "Bilbao", departamento: "Marketing", salario: 40000 },
    { nombre: "Javier Mendoza", edad: 44, genero: "Masculino", ubicacion: "Sevilla", departamento: "IT", salario: 49000 },
    { nombre: "Raquel Iglesias", edad: 27, genero: "Femenino", ubicacion: "Madrid", departamento: "Ventas", salario: 35000 },
    { nombre: "Sergio Blanco", edad: 36, genero: "Masculino", ubicacion: "Barcelona", departamento: "RRHH", salario: 42000 },
    { nombre: "Natalia Cano", edad: 31, genero: "Femenino", ubicacion: "Valencia", departamento: "IT", salario: 45000 },
    { nombre: "Pablo Guerrero", edad: 33, genero: "Masculino", ubicacion: "Bilbao", departamento: "Marketing", salario: 39000 },
    { nombre: "Silvia Delgado", edad: 40, genero: "Femenino", ubicacion: "Sevilla", departamento: "Ventas", salario: 37000 },
    { nombre: "Adrián Molina", edad: 26, genero: "Masculino", ubicacion: "Madrid", departamento: "IT", salario: 44000 },
    { nombre: "Mónica Ortega", edad: 34, genero: "Femenino", ubicacion: "Barcelona", departamento: "RRHH", salario: 41000 },
    { nombre: "Daniel Márquez", edad: 43, genero: "Masculino", ubicacion: "Valencia", departamento: "Marketing", salario: 40000 },
    { nombre: "Andrea Vega", edad: 29, genero: "Femenino", ubicacion: "Bilbao", departamento: "Ventas", salario: 36000 },
    { nombre: "Rubén León", edad: 38, genero: "Masculino", ubicacion: "Sevilla", departamento: "IT", salario: 47000 }
];

// Datos de prueba de ventas por mes
const salesData = [
    { mes: "Enero", ventas: 15000, gastos: 8000, beneficio: 7000 },
    { mes: "Febrero", ventas: 18000, gastos: 9000, beneficio: 9000 },
    { mes: "Marzo", ventas: 22000, gastos: 10000, beneficio: 12000 },
    { mes: "Abril", ventas: 25000, gastos: 11000, beneficio: 14000 },
    { mes: "Mayo", ventas: 28000, gastos: 12000, beneficio: 16000 },
    { mes: "Junio", ventas: 30000, gastos: 13000, beneficio: 17000 },
    { mes: "Julio", ventas: 32000, gastos: 14000, beneficio: 18000 },
    { mes: "Agosto", ventas: 29000, gastos: 13500, beneficio: 15500 },
    { mes: "Septiembre", ventas: 31000, gastos: 14200, beneficio: 16800 },
    { mes: "Octubre", ventas: 33000, gastos: 15000, beneficio: 18000 },
    { mes: "Noviembre", ventas: 35000, gastos: 15500, beneficio: 19500 },
    { mes: "Diciembre", ventas: 38000, gastos: 16000, beneficio: 22000 }
];

// Datos de satisfacción del cliente
const customerSatisfactionData = [
    { categoria: "Muy Satisfecho", cantidad: 45, porcentaje: 45 },
    { categoria: "Satisfecho", cantidad: 30, porcentaje: 30 },
    { categoria: "Neutral", cantidad: 15, porcentaje: 15 },
    { categoria: "Insatisfecho", cantidad: 7, porcentaje: 7 },
    { categoria: "Muy Insatisfecho", cantidad: 3, porcentaje: 3 }
];

// Datos de productos más vendidos
const topProductsData = [
    { producto: "Laptop Dell", ventas: 150, ingresos: 120000 },
    { producto: "iPhone 14", ventas: 200, ingresos: 200000 },
    { producto: "Monitor Samsung", ventas: 80, ingresos: 32000 },
    { producto: "Teclado Mecánico", ventas: 120, ingresos: 18000 },
    { producto: "Mouse Gaming", ventas: 90, ingresos: 9000 },
    { producto: "Auriculares Sony", ventas: 110, ingresos: 33000 },
    { producto: "Tablet iPad", ventas: 75, ingresos: 60000 },
    { producto: "Webcam Logitech", ventas: 60, ingresos: 12000 },
    { producto: "Disco SSD", ventas: 95, ingresos: 19000 },
    { producto: "Impresora HP", ventas: 45, ingresos: 18000 }
];

/**
 * Función para cargar datos de prueba
 * @param {string} dataType - Tipo de datos: 'employees', 'sales', 'satisfaction', 'products'
 * @returns {Array} - Array con los datos solicitados
 */
function loadTestData(dataType = 'employees') {
    switch (dataType) {
        case 'employees':
            return {
                data: sampleEmployeeData,
                meta: {
                    datasetName: 'Datos de Empleados (Prueba)',
                    source: 'Datos generados para pruebas',
                    fields: ['nombre', 'edad', 'genero', 'ubicacion', 'departamento', 'salario'],
                    processedAt: new Date().toISOString()
                }
            };
        case 'sales':
            return {
                data: salesData,
                meta: {
                    datasetName: 'Ventas Mensuales (Prueba)',
                    source: 'Datos generados para pruebas',
                    fields: ['mes', 'ventas', 'gastos', 'beneficio'],
                    processedAt: new Date().toISOString()
                }
            };
        case 'satisfaction':
            return {
                data: customerSatisfactionData,
                meta: {
                    datasetName: 'Satisfacción del Cliente (Prueba)',
                    source: 'Datos generados para pruebas',
                    fields: ['categoria', 'cantidad', 'porcentaje'],
                    processedAt: new Date().toISOString()
                }
            };
        case 'products':
            return {
                data: topProductsData,
                meta: {
                    datasetName: 'Productos Más Vendidos (Prueba)',
                    source: 'Datos generados para pruebas',
                    fields: ['producto', 'ventas', 'ingresos'],
                    processedAt: new Date().toISOString()
                }
            };
        default:
            return {
                data: sampleEmployeeData,
                meta: {
                    datasetName: 'Datos de Prueba',
                    source: 'Datos generados para pruebas',
                    fields: ['nombre', 'edad', 'genero', 'ubicacion', 'departamento', 'salario'],
                    processedAt: new Date().toISOString()
                }
            };
    }
}

/**
 * Función para cargar datos de prueba en el sistema
 * @param {string} dataType - Tipo de datos a cargar
 */
function loadTestDataIntoSystem(dataType = 'employees') {
    if (!window.DataProcessor) {
        console.error('DataProcessor no está disponible');
        return;
    }
    
    const testData = loadTestData(dataType);
    
    try {
        // Procesar los datos de prueba con el sistema
        const processedData = window.DataProcessor.processData(testData, {
            datasetName: testData.meta.datasetName,
            source: testData.meta.source,
            removeEmpty: false, // Los datos de prueba ya están limpios
            convertTypes: false, // Los tipos ya están correctos
            trimStrings: false
        });
        
        console.log(`Datos de prueba "${dataType}" cargados correctamente:`, processedData);
        
        // Actualizar la interfaz si estamos en la vista de upload
        if (window.updateDatasetHistoryUI) {
            window.updateDatasetHistoryUI();
        }
        
        return processedData;
    } catch (error) {
        console.error('Error al cargar datos de prueba:', error);
        return null;
    }
}

/**
 * Función para generar CSV de los datos de prueba
 * @param {string} dataType - Tipo de datos
 * @returns {string} - String en formato CSV
 */
function generateTestCSV(dataType = 'employees') {
    const testData = loadTestData(dataType);
    
    if (!testData.data || testData.data.length === 0) {
        return '';
    }
    
    // Obtener encabezados
    const headers = Object.keys(testData.data[0]);
    
    // Crear filas CSV
    const rows = testData.data.map(row => {
        return headers.map(header => {
            const value = row[header];
            // Escapar valores que contengan comas o comillas
            if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
                return `"${value.replace(/"/g, '""')}"`;
            }
            return value;
        }).join(',');
    });
    
    // Combinar encabezados y filas
    return [headers.join(','), ...rows].join('\n');
}

// Exportar funciones para uso global
window.TestData = {
    loadTestData,
    loadTestDataIntoSystem,
    generateTestCSV,
    sampleEmployeeData,
    salesData,
    customerSatisfactionData,
    topProductsData
};

// Auto-cargar datos de prueba solo si se solicita explícitamente
document.addEventListener('DOMContentLoaded', () => {
    // NO cargar datos automáticamente - solo estar disponible para uso manual
    console.log('TestData disponible. Usa TestData.loadTestDataIntoSystem() para cargar datos de prueba.');
});