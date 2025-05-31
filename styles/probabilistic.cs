/* Estilos específicos para la vista de análisis probabilístico */

.probabilistic-container {
    padding: 1rem;
    max-width: 1200px;
    margin: 0 auto;
}

.analysis-controls {
    display: flex;
    gap: 1rem;
    align-items: end;
    margin-bottom: 2rem;
    padding: 1rem;
    background-color: #f8f9fa;
    border-radius: 8px;
    flex-wrap: wrap;
}

.control-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.control-group label {
    font-weight: 500;
    color: #495057;
}

.variable-info {
    margin-bottom: 2rem;
}

.stats-display {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
    margin-top: 1rem;
}

.stat-item {
    padding: 0.8rem;
    background-color: #f8f9fa;
    border-radius: 6px;
    border-left: 4px solid #3498db;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.probability-calculator {
    margin-bottom: 2rem;
}

.calculator-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1.5rem;
}

.calc-card {
    background: white;
    border: 1px solid #e9ecef;
    border-radius: 8px;
    padding: 1.5rem;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    transition: box-shadow 0.3s ease;
}

.calc-card:hover {
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.calc-card h3 {
    margin: 0 0 0.5rem 0;
    color: #2c3e50;
}

.calc-card p {
    margin: 0 0 1rem 0;
    color: #6c757d;
    font-family: 'Courier New', monospace;
    background-color: #f8f9fa;
    padding: 0.5rem;
    border-radius: 4px;
}

.calc-inputs {
    display: flex;
    flex-direction: column;
    gap: 0.8rem;
}

.calc-inputs label {
    font-weight: 500;
    color: #495057;
}

.number-input {
    padding: 0.6rem;
    border: 1px solid #ced4da;
    border-radius: 4px;
    font-size: 1rem;
}

.number-input:focus {
    outline: none;
    border-color: #3498db;
    box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
}

.calc-btn {
    background-color: #3498db;
    color: white;
    border: none;
    padding: 0.8rem;
    border-radius: 4px;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.calc-btn:hover {
    background-color: #2980b9;
}

.calc-btn:disabled {
    background-color: #6c757d;
    cursor: not-allowed;
}

.result-display {
    margin-top: 1rem;
    padding: 1rem;
    background-color: #e8f5e8;
    border-left: 4px solid #28a745;
    border-radius: 4px;
    font-weight: 500;
    display: none;
}

.result-display.visible {
    display: block;
}

.result-display.error {
    background-color: #f8d7da;
    border-left-color: #dc3545;
    color: #721c24;
}

.normal-chart-container {
    margin-bottom: 2rem;
}

.chart-wrapper {
    height: 400px;
    position: relative;
    margin: 1rem 0;
}

.chart-legend {
    display: flex;
    justify-content: center;
    gap: 2rem;
    margin-top: 1rem;
}

.legend-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.legend-color {
    width: 20px;
    height: 12px;
    border-radius: 2px;
}

.examples-section, .calculations-history {
    margin-bottom: 2rem;
}

.examples-buttons, .history-controls {
    display: flex;
    gap: 1rem;
    margin-top: 1rem;
}

.history-display {
    max-height: 300px;
    overflow-y: auto;
    border: 1px solid #e9ecef;
    border-radius: 4px;
    padding: 1rem;
    margin: 1rem 0;
}

.history-item {
    padding: 0.8rem;
    border-bottom: 1px solid #e9ecef;
    margin-bottom: 0.5rem;
}

.history-item:last-child {
    border-bottom: none;
    margin-bottom: 0;
}

.history-timestamp {
    font-size: 0.85rem;
    color: #6c757d;
    margin-bottom: 0.3rem;
}

.history-calculation {
    font-family: 'Courier New', monospace;
    background-color: #f8f9fa;
    padding: 0.5rem;
    border-radius: 4px;
    margin-bottom: 0.3rem;
}

.history-result {
    font-weight: 500;
    color: #28a745;
}

/* Responsive */
@media (max-width: 768px) {
    .analysis-controls {
        flex-direction: column;
        align-items: stretch;
    }
    
    .calculator-grid {
        grid-template-columns: 1fr;
    }
    
    .chart-legend {
        flex-direction: column;
        align-items: center;
        gap: 0.5rem;
    }
    
    .examples-buttons, .history-controls {
        flex-direction: column;
    }
}