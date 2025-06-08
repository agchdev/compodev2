import { useState, useEffect } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { html } from '@codemirror/lang-html';
import { css } from '@codemirror/lang-css';
import { javascript } from '@codemirror/lang-javascript';
import './CodeProject.css';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { FaSave, FaCode, FaHtml5, FaCss3Alt, FaJs } from 'react-icons/fa';
import '../styles/AnimatedBackground.css';

const CodeProject = () => {
  const [htmlCode, setHtmlCode] = useState('<!-- Escribe tu HTML aquí -->\n<div class="container">\n  <h1>Hello CompoDev!</h1>\n  <p>Edita este HTML y verás los cambios en tiempo real</p>\n</div>');
  const [cssCode, setCssCode] = useState('/* Escribe tu CSS aquí */\n\nbody {\n  font-family: Arial, sans-serif;\n  margin: 0;\n  padding: 20px;\n}\n\n.container {\n  max-width: 800px;\n  margin: 0 auto;\n  background-color: #f5f5f5;\n  padding: 20px;\n  border-radius: 8px;\n  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);\n}');
  const [jsCode, setJsCode] = useState('// Escribe tu JavaScript aquí\n\nconsole.log("CompoDev JavaScript cargado");\n\n// Ejemplo de código JavaScript\nfunction cambiarColor() {\n  const h1 = document.querySelector("h1");\n  h1.style.color = getRandomColor();\n}\n\nfunction getRandomColor() {\n  return "#" + Math.floor(Math.random()*16777215).toString(16);\n}');
  const [combinedCode, setCombinedCode] = useState('');
  const [user, setUser] = useState(null)
  const [owner, setOwner] = useState(false) // Para saber si el dueño del proyecto o no
  const idParam = useParams();
  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL

  useEffect(() => {
    console.log(idParam.id)
    const getSession = async () => {
      try {
        const response = await axios.get(
          `${backendUrl}/users/UserController.php?action=session`,
          { withCredentials: true }
        );
        const userData = response.data.id;
        setUser(userData);
      } catch (error) {
        console.log("Error al obtener la sesión:", error)
      }
    }
    
    getSession()
  }, [backendUrl, idParam.id])

  useEffect(() => {
    if(!user) return
    // Comprobar si es el dueño del proyecto
    const checkOwner = async () => {
      try {
        const response = await axios.get(
          `${backendUrl}/projects/ProjectController.php?action=checkOwner&id=${idParam.id}&id_usuario=${user}`,
          { withCredentials: true }
        );
        if (response.data) {
          setOwner(true);
        }
        console.log("Datos de usuario recibidos:", response);
      } catch (error) {
        console.log("Error al obtener la sesión:", error)
      }
    }

    checkOwner();
  }, [user, backendUrl, idParam.id])
  

  const handleSave = async () => {
    const dataToSend = {
        html: htmlCode,
        css: cssCode,
        js: jsCode,
    };
    console.log(dataToSend);
    try {
        const response = await axios.put(
            `${backendUrl}/projects/ProjectController.php?action=updateCode&id=${idParam.id}`,
            dataToSend,
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );
        console.log("Proyecto guardado:", response.data);
        navigate('/perfil');
    } catch (error) {
        console.log("Error al guardar el proyecto:", error)
    }
}


  // Combinar el código y actualizar la vista previa cuando cambie cualquiera de los editores
  useEffect(() => {
    const combined = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>${cssCode}</style>
      </head>
      <body>
        ${htmlCode}
        <script>${jsCode}</script>
      </body>
      </html>
    `;
    setCombinedCode(combined);
  }, [htmlCode, cssCode, jsCode]);

  return (
    <>
      {/* Fondo animado futurista */}
      <div className="cyber-background">
        {/* Partículas */}
        <div className="particles-container">
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
        </div>
        
        {/* Efecto de cuadrícula */}
        <div className="grid-container"></div>
        
        {/* Formas geométricas */}
        <div className="cyber-shape hexagon shape-1"></div>
        <div className="cyber-shape triangle shape-2"></div>
        <div className="cyber-shape circle shape-3"></div>
        <div className="cyber-shape rectangle shape-4"></div>
        
        {/* Líneas digitales */}
        <div className="digital-lines">
          <div className="h-line"></div>
          <div className="h-line"></div>
          <div className="h-line"></div>
          <div className="v-line"></div>
          <div className="v-line"></div>
        </div>
      </div>
      
      {/* Elementos flotantes decorativos */}
      <div className="profile-floating-elements">
        <div className="profile-floating-element profile-element-1"></div>
        <div className="profile-floating-element profile-element-2"></div>
        <div className="profile-floating-element profile-element-3"></div>
      </div>
      
      <div className="code-project-container">
        <div className="project-header">
          <h2 className="project-title">CompoDev - Editor de Código</h2>
          <p className="project-subtitle">Edita HTML, CSS y JavaScript en tiempo real</p>
        </div>
        
        <div className="editors-container justify-center items-center">
          <div className="editors">
            <div className="editor cyber-editor">
              <div className="editor-header">
                <FaHtml5 className="me-2" /> HTML
              </div>
              <CodeMirror
                value={htmlCode}
                height="300px"
                extensions={[html()]}
                onChange={(value) => setHtmlCode(value)}
                className="code-editor"
                theme="dark"
              />
            </div>
            
            <div className="editor cyber-editor">
              <div className="editor-header">
                <FaCss3Alt className="me-2" /> CSS
              </div>
              <CodeMirror
                value={cssCode}
                height="300px"
                extensions={[css()]}
                onChange={(value) => setCssCode(value)}
                className="code-editor"
                theme="dark"
              />
            </div>
            
            <div className="editor cyber-editor">
              <div className="editor-header">
                <FaJs className="me-2" /> JavaScript
              </div>
              <CodeMirror
                value={jsCode}
                height="300px"
                extensions={[javascript()]}
                onChange={(value) => setJsCode(value)}
                className="code-editor"
                theme="dark"
              />
            </div>
          </div>
          
          <div className="preview-container cyber-preview">
            <div className="editor-header ">
              <FaCode className="me-2 " /> Vista previa
            </div>
            <iframe
              title="preview"
              className="preview "
              srcDoc={combinedCode}
              sandbox="allow-scripts"
            />
          </div>
          
          
        </div>
      </div>
      {owner && (
            <div className="save-container mb-20">
              <button onClick={handleSave} className="cyber-button primary save-button">
                <FaSave className="me-2" /> Guardar Proyecto
              </button>
            </div>
          )}
    </>
    
  );
}

export default CodeProject