import { useState, useEffect } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { html } from '@codemirror/lang-html';
import { css } from '@codemirror/lang-css';
import { javascript } from '@codemirror/lang-javascript';
import './CodeProject.css';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

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
  }, [backendUrl])

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
  }, [user])
  

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
    <div className="code-project-container">
      <h2 className="project-title">CompoDev - Editor de Código</h2>
      
      <div className="editors-container">
        <div className="editors">
          <div className="editor">
            <div className="editor-header">HTML</div>
            <CodeMirror
              value={htmlCode}
              height="300px"
              extensions={[html()]}
              onChange={(value) => setHtmlCode(value)}
              className="code-editor"
              theme="dark"
            />
          </div>
          
          <div className="editor">
            <div className="editor-header">CSS</div>
            <CodeMirror
              value={cssCode}
              height="300px"
              extensions={[css()]}
              onChange={(value) => setCssCode(value)}
              className="code-editor"
              theme="dark"
            />
          </div>
          
          <div className="editor">
            <div className="editor-header">JavaScript</div>
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
        
        <div className="preview-container">
          <div className="editor-header">Vista previa</div>
          <iframe
            title="preview"
            className="preview"
            srcDoc={combinedCode}
            sandbox="allow-scripts"
          />
        </div>
        {owner && (
          <button onClick={handleSave}>Guardar</button>
        )}
      </div>
    </div>
    
  );
}

export default CodeProject