# Anti Social - Frontend

Frontend de **Anti Social**, una red social desarrollada con React y TypeScript.  
La aplicación consume una API REST propia y permite a los usuarios registrarse, iniciar sesión, visualizar publicaciones, crear contenido, comentar y acceder a perfiles.

---

## Tecnologías utilizadas

- React
- TypeScript
- Vite
- React Router DOM
- React Bootstrap
- Bootstrap
- Axios
- Lucide React
- Yet Another React Lightbox
- CSS

---

## Funcionalidades

### Usuarios

- Registro de usuarios.
- Inicio y cierre de sesión.
- Protección de rutas.
- Visualización de perfiles.

### Publicaciones

- Feed principal.
- Creación de publicaciones.
- Edición y eliminación de publicaciones.
- Detalle de publicaciones.
- Soporte para imágenes.
- Filtrado por etiquetas.

### Comentarios

- Listado de comentarios.
- Creación de comentarios.
- Edición de comentarios propios.
- Eliminación de comentarios.

### Interfaz

- Diseño responsive.
- Navegación mediante rutas.
- Header y Footer reutilizables.
- Lightbox para visualizar imágenes.
- Página personalizada de error 404.
- Scroll automático al navegar.

---

## Estructura del proyecto

```bash
src/
│
├── assets/           # Recursos estáticos
├── component/        # Componentes reutilizables
├── config/           # Configuración de la API
├── constants/        # Constantes de la aplicación
├── hooks/            # Hooks personalizados
├── pages/            # Páginas principales
├── services/         # Comunicación con la API
├── styles/           # Archivos CSS
├── types/            # Tipos de TypeScript
├── utils/            # Funciones auxiliares
│
├── App.tsx
├── main.tsx
└── index.css
```

---

## Comunicación con la API

El frontend consume una API REST propia para gestionar la información de la aplicación.

La comunicación con el backend se encuentra organizada mediante una combinación de:

- Servicios encargados de centralizar operaciones sobre cada recurso.
- Peticiones HTTP realizadas mediante Axios.

Los servicios permiten interactuar con distintos recursos de la API, entre ellos:

- Usuarios
- Publicaciones
- Comentarios
- Imágenes de publicaciones
- Etiquetas

Esta organización permite desacoplar la lógica de comunicación con la API del resto de los componentes de la interfaz.

---

## Variables de entorno

Crear un archivo `.env` tomando como referencia `.env.example`.

Ejemplo:

```env
VITE_API_URL=http://localhost:3001
```

---

## Instalación

Clonar el repositorio:

```bash
git clone <url-del-repositorio>
```

Ingresar al proyecto:

```bash
cd Frontend-main
```

Instalar dependencias:

```bash
npm install
```

---

## Ejecución

Ejecutar el servidor de desarrollo:

```bash
npm run dev
```

La aplicación estará disponible en:

```bash
http://localhost:5173
```

---

## Scripts disponibles

```bash
npm run dev      # Ejecuta el servidor de desarrollo

```

---

## Estado del proyecto

El proyecto cuenta con las funcionalidades principales implementadas:

- Registro e inicio de sesión.
- Feed de publicaciones.
- Gestión de publicaciones.
- Gestión de comentarios.
- Visualización de perfiles.
- Gestión de imágenes.
- Filtrado por etiquetas.
- Consumo de API propia.

---

## Autores

Trabajo práctico desarrollado para la **Universidad Nacional de Hurlingham (UNAHUR)**.

**Grupo:** Hijos de la Placa Madre.
