# CompoDev - Plataforma Web de Desarrollo de Componentes

  ![image](https://github.com/user-attachments/assets/57c7bcf8-da99-42bd-98c4-bd3d91f5896b)

## 📋 Descripción

CompoDev es una plataforma web interactiva diseñada para el desarrollo y compartición de componentes web. Permite a los usuarios crear, editar y visualizar código HTML, CSS y JavaScript en tiempo real, con una interfaz inspirada en diseño ciberpunk.

La plataforma incluye un generador de código basado en inteligencia artificial (Google Gemini) que permite a los usuarios crear componentes a partir de descripciones en lenguaje natural.

## ✨ Características

- **Editor de código en vivo** con visualización en tiempo real
- **Asistente de código con IA** integrado con Google Gemini
- **Guardado y compartición** de componentes
- **Perfil de usuario** con proyectos guardados
- **Interfaz moderna** con temática ciberpunk
- **Responsive design** adaptable a diferentes dispositivos

## 🚀 Tecnologías

### Frontend
- React + Vite
- CodeMirror para editores de código
- Tailwind CSS + CSS personalizado
- React Router para navegación
- Axios para peticiones HTTP
- React Icons

### Backend
- PHP 8
- MySQL
- Arquitectura de casos de uso
- API REST

### Integración con IA
- API de Google Generative AI (Gemini)

## 💻 Instalación

### Requisitos
- XAMPP (Apache, MySQL, PHP)
- Node.js y npm
- Git

### Pasos

1. Clonar el repositorio:
```bash
git clone https://github.com/agchdev/compodev2.git
cd compodev2
```

2. Configurar el backend:
```bash
# Importar la base de datos
# (Usar el archivo SQL en la carpeta database)
```

3. Instalar dependencias del frontend:
```bash
cd frontend
npm install
```

4. Configurar variables de entorno:
   - Crear archivo `.env` en la carpeta frontend con:
```
VITE_BACKEND_URL="http://localhost/compodev2/backend"
VITE_GOOGLE_API_KEY="tu_api_key_de_google"
VITE_INSTRUCCIONES="Instrucciones para la IA"
```
    - LAS CREDENCIALES SE ENCUENTRAN EN EL PDF DEL TFG

5. Iniciar el servidor de desarrollo:
```bash
npm run dev
```

## 📱 Uso

1. **Crear una cuenta** o iniciar sesión
2. **Crear un nuevo proyecto** desde el panel de usuario
3. **Editar el código** en los editores de HTML, CSS y JavaScript
4. **Ver la previsualización** en tiempo real
5. **Utilizar el asistente de IA** para generar código a partir de descripciones
6. **Guardar** para acceder a los proyectos más tarde

## 🔗 Integración con IA

CompoDev utiliza la API de Google Generative AI (Gemini) para generar código a partir de descripciones en texto. La integración se encuentra en el componente `AICodeGenerator.jsx`.

La API está configurada para devolver un objeto JSON con tres claves:
- `html`: Código HTML generado
- `css`: Estilos CSS generados
- `js`: Código JavaScript generado

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Para contribuir:

1. Haz fork del proyecto
2. Crea una rama para tu función (`git checkout -b feature/amazing-feature`)
3. Haz commit de tus cambios (`git commit -m 'Add some amazing feature'`)
4. Push a la rama (`git push origin feature/amazing-feature`)
5. Abre un Pull Request

## 📝 Licencia

Distribuido bajo la Licencia MIT. Ver `LICENSE` para más información.

## 📞 Contacto

Autor: [Tu Nombre] - [Tu Correo]

Enlace del proyecto: [https://github.com/agchdev/compodev2](https://github.com/agchdev/compodev2)
