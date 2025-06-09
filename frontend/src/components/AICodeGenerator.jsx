import { useState } from 'react';
import { FaRobot, FaTimes, FaPaperPlane, FaCheck } from 'react-icons/fa';
import PropTypes from 'prop-types';
import '../styles/AICodeGenerator.css';

/**
 * Componente para generar código con IA
 * @param {Object} props - Propiedades del componente
 * @param {Function} props.onClose - Función para cerrar el componente
 * @param {Function} props.onInsert - Función para insertar el código generado
 * @returns {JSX.Element} Componente AICodeGenerator
 */
const AICodeGenerator = ({ onClose, onInsert }) => {
    const [prompt, setPrompt] = useState('');
    const [loading, setLoading] = useState(false);
    const [output, setOutput] = useState(null);

    // Esta función se usará cuando se integre con una API real de IA
    // Comentada por ahora, se implementará cuando conectemos con la API real
    /* 
    const parseAIResponse = (responseText) => {
        try {
            // Quitar los bloques ```json y ```
            const clean = responseText.replace(/```json|```/g, '').trim();
            return JSON.parse(clean);
        } catch (error) {
            console.error('Error al parsear el JSON:', error);
            return { error: 'No se pudo interpretar como JSON.', raw: responseText };
        }
    };
    */

    // Función para manejar el envío del prompt
    const handleSend = async () => {
        if (!prompt.trim()) return;
        
        setLoading(true);
        try {
            // Aquí se implementaría la llamada real a la API de IA
            // Por ahora, simulamos una respuesta con un temporizador
            
            // Simulación de llamada API (se reemplazaría con la API real)
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Simulamos una respuesta para demostración
            const mockResponse = {
                html: `<div class="container">
  <h1>Mi Componente</h1>
  <p>Componente creado según la descripción</p>
  <button id="actionButton" class="action-button">Haz clic</button>
</div>`,
                css: `.container {
  font-family: 'Roboto', sans-serif;
  max-width: 600px;
  margin: 2rem auto;
  padding: 2rem;
  border-radius: 8px;
  background: linear-gradient(145deg, #1a1a2e, #16213e);
  color: #e0e0e0;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
}

h1 {
  color: #4cc9f0;
  border-bottom: 2px solid #4361ee;
  padding-bottom: 0.5rem;
}

.action-button {
  background: linear-gradient(90deg, #4361ee, #4cc9f0);
  border: none;
  padding: 0.8rem 1.5rem;
  color: white;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
}

.action-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 12px rgba(76, 201, 240, 0.3);
}`,
                js: `// Código JS generado
document.addEventListener('DOMContentLoaded', () => {
  const button = document.getElementById('actionButton');
  
  if (button) {
    button.addEventListener('click', () => {
      alert('¡Botón creado con IA activado!');
      
      // Cambiar color al hacer clic
      const container = document.querySelector('.container');
      container.style.background = 'linear-gradient(145deg, #16213e, #1a1a2e)';
      
      // Añadir efecto visual
      button.textContent = '¡Activado!';
      button.style.background = 'linear-gradient(90deg, #4cc9f0, #4361ee)';
    });
  }
});`
            };
            
            // Ya no necesitamos parsear una respuesta JSON, usamos directamente el objeto
            setOutput(mockResponse);
            
            // Si hay una función onInsert, la llamamos con el resultado
            if (onInsert) onInsert(mockResponse);
            
        } catch (err) {
            console.error('Error al generar código:', err);
            setOutput({ error: 'Error al generar el código. Inténtalo de nuevo.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed right-6 bottom-24 ai-generator-panel w-96 max-h-[80vh] overflow-auto z-50">
            <div className="ai-generator-header">
                <h2 className="ai-generator-title">
                    <FaRobot /> Asistente de Código
                </h2>
                <button 
                    onClick={onClose} 
                    className="ai-close-button"
                    aria-label="Cerrar"
                >
                    <FaTimes />
                </button>
            </div>

            <div className="mb-4">
                <textarea
                    className="ai-prompt-textarea"
                    rows={4}
                    placeholder="Describe el código que quieres generar..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                />
            </div>

            <div className="ai-buttons-row">
                <button
                    onClick={handleSend}
                    disabled={loading || !prompt.trim()}
                    className="ai-generate-button"
                >
                    {loading ? (
                        <>Procesando...</>
                    ) : (
                        <>
                            <FaPaperPlane style={{ marginRight: '8px' }} /> Crear código
                        </>
                    )}
                </button>
                
                <span className="ai-character-count">
                    {prompt.length ? prompt.length + " caracteres" : ""}
                </span>
            </div>

            {output && !output.error && (
                <div className="ai-output-preview">
                    <h3 className="ai-output-title">Resultado:</h3>
                    <div className="ai-code-tabs">
                        <div className="ai-code-tab ai-html-tab">HTML</div>
                        <div className="ai-code-tab ai-css-tab">CSS</div>
                        <div className="ai-code-tab ai-js-tab">JS</div>
                    </div>
                    <p className="ai-success-message">
                        <FaCheck /> Listo para insertar en el editor
                    </p>
                </div>
            )}

            {output && output.error && (
                <div className="ai-error-message">
                    {output.error}
                </div>
            )}
        </div>
    );
};

// Validación de PropTypes
AICodeGenerator.propTypes = {
    onClose: PropTypes.func.isRequired,
    onInsert: PropTypes.func.isRequired
};

export default AICodeGenerator;
