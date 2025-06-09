import { useState } from 'react';
import { FaRobot, FaTimes, FaPaperPlane, FaCheck } from 'react-icons/fa';
import PropTypes from 'prop-types';
import { GoogleGenerativeAI } from '@google/generative-ai';
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

    // Función para extraer el JSON de la respuesta de Gemini
    const extractJsonFromGeminiResponse = (responseText) => {
        try {
            // Quitar los bloques ```json y ```
            const clean = responseText.replace(/```json|```/g, '').trim();
            return JSON.parse(clean);
        } catch (error) {
            console.error('Error al parsear el JSON:', error);
            return { error: 'No se pudo interpretar como JSON.', raw: responseText };
        }
    };

    // Función para manejar el envío del prompt
    const handleSend = async () => {
        if (!prompt.trim()) return;
        
        setLoading(true);
        try {
            // Obtener la API key de las variables de entorno de Vite
            const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;
            const instrucciones = import.meta.env.VITE_INSTRUCCIONES;
            
            if (!apiKey) {
                throw new Error('API Key de Google no configurada');
            }
            
            // Inicializar el cliente de Gemini
            const genAI = new GoogleGenerativeAI(apiKey);
            const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
            
            // Construir el prompt final con las instrucciones
            const finalPrompt = `${instrucciones}${prompt}`;
            
            // Realizar la llamada a la API
            const result = await model.generateContent(finalPrompt);
            const responseText = await result.response.text();
            
            // Extraer el JSON de la respuesta
            const parsed = extractJsonFromGeminiResponse(responseText);
            
            setOutput(parsed);
            
            // Si hay una función onInsert y no hay error, la llamamos con el resultado
            if (onInsert && !parsed.error) onInsert(parsed);
            
        } catch (err) {
            console.error('Error con Gemini:', err);
            setOutput({ error: 'Error al contactar con Gemini. Verifica tu API key.' });
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
