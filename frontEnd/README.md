# IoT Control — Frontend Web (ESP8266)

Interfaz web moderna, futurista y elegante para el control remoto y monitoreo en tiempo real de microcontroladores ESP8266. Diseñada con una paleta de colores inspirada en las tonalidades y calidez del café, efectos de vidrio esmerilado (*glassmorphism*), iluminación sutil y tipografía técnica.

Conectada de forma nativa a la API REST del backend desplegado en:
`https://esparduinoweb.vercel.app`

---

## 🎨 Paleta de Colores & Identidad Visual

| Color | Hex | Uso en la Interfaz |
|---|---|---|
| **Espresso oscuro** | `#211713` | Fondo principal de la aplicación |
| **Café profundo** | `#38251E` | Paneles, tarjetas y contenedores (*glassmorphism*) |
| **Café tostado** | `#654332` | Bordes secundarios, divisores y elementos auxiliares |
| **Caramelo** | `#B87945` | Botones de acción principal, acentos y resplandor activo |
| **Latte** | `#D6B58C` | Etiquetas destacadas, subtítulos y badges informativos |
| **Crema** | `#F2E6D5` | Tipografía principal y títulos de alto contraste |
| **Verde luminoso** | `#75D69A` | Indicador de dispositivo conectado / pulsos de red |
| **Rojo suave** | `#E47770` | Estados desconectados, alertas y acciones destructivas |

---

## 🚀 Tecnologías

- **React 18** + **TypeScript**
- **Vite** para desarrollo y empaquetado ultra rápido
- **Tailwind CSS** con configuración personalizada de tokens de café y sombras luminosas
- **React Router DOM 7** para navegación por rutas protegidas
- **Axios** con interceptores automáticos para Bearer JWT y detección de sesiones expiradas
- **Lucide React** para iconografía tecnológica minimalista

---

## 📁 Estructura del Proyecto

```text
frontEnd/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── dashboard/       # Tarjetas de estadísticas y widgets de resumen
│   │   ├── devices/         # Tarjeta de dispositivo, modales de registro, token y eliminación
│   │   ├── layout/          # Navbar con estado de conexión, Sidebar y Footer
│   │   └── ui/              # Button, Input, Card, Badge, Skeleton, Modal, EmptyState
│   ├── context/
│   │   ├── AuthContext.tsx  # Estado global de usuario, token JWT y persistencia
│   │   └── ToastContext.tsx # Notificaciones toast flotantes personalizadas
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useToast.ts
│   │   └── useInterval.ts   # Polling seguro para telemetría en tiempo real
│   ├── layouts/
│   │   ├── AuthLayout.tsx       # Pantalla centrada con aura de café para Login/Registro
│   │   └── DashboardLayout.tsx  # Shell responsivo con barra lateral y control de acceso
│   ├── pages/
│   │   ├── Login.tsx            # Autenticación de usuario con validación
│   │   ├── Register.tsx         # Registro con validación conforme al backend (2-80 / 8-128 chars)
│   │   ├── Dashboard.tsx        # Métricas, contadores online/offline y accesos directos
│   │   ├── Devices.tsx          # Lista interactiva, filtros, búsqueda y gestión
│   │   ├── DeviceControl.tsx    # Panel central interactivo del diodo LED ESP8266 (LED_ON / LED_OFF)
│   │   ├── CommandHistory.tsx   # Auditoría y ciclo de vida (PENDING, DELIVERED, EXECUTED, etc.)
│   │   └── Settings.tsx         # Consulta de perfil (GET /api/auth/me) y cierre de sesión
│   ├── services/
│   │   ├── api.ts               # Instancia centralizada de Axios + interceptores JWT
│   │   ├── auth.service.ts      # Endpoints /api/auth
│   │   ├── devices.service.ts   # Endpoints /api/devices
│   │   └── commands.service.ts  # Endpoints /api/devices/:id/commands
│   ├── types/                   # Tipado TypeScript estricto de la API y modelos
│   ├── utils/                   # Utilidades de formato de fechas, errores y clases CSS
│   ├── App.tsx                  # Enrutador principal
│   ├── index.css                # Estilos globales, directivas Tailwind y glassmorphism
│   ├── main.tsx                 # Entrada React DOM
│   └── vite-env.d.ts            # Tipos de entorno Vite
├── .env                         # Variables de entorno
├── .env.example
├── index.html                   # HTML con fuentes Google Fonts (Outfit y JetBrains Mono)
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── tsconfig.json
├── vercel.json                  # Reglas de reescritura para Single Page Application en Vercel
└── vite.config.ts
```

---

## 🔌 Integración con los Endpoints del Backend

Toda la comunicación pasa a través de la URL base configurada en `VITE_API_URL`:

### Autenticación (`/api/auth`)
- `POST /api/auth/register` — Registro con `{ name, email, password }`. Retorna JWT y datos del usuario.
- `POST /api/auth/login` — Inicio de sesión con `{ email, password }`. Retorna JWT y datos del usuario.
- `GET /api/auth/me` — Validación de sesión y obtención del usuario actual usando `Authorization: Bearer <token>`.

### Dispositivos (`/api/devices`)
- `GET /api/devices` — Lista los dispositivos del usuario con cálculo en tiempo real de `isOnline` (`lastSeen < 60s`).
- `GET /api/devices/:id` — Consulta individual del dispositivo y su última actividad.
- `POST /api/devices` — Registro de nuevo dispositivo con `{ name }`. Devuelve el objeto del dispositivo y el `deviceToken` privado en texto plano por única vez.
- `DELETE /api/devices/:id` — Eliminación segura del dispositivo y sus comandos asociados.

### Comandos de Control (`/api/devices/:id/commands`)
- `POST /api/devices/:id/commands` — Emisión de comandos para conmutación digital.
  - Encender LED: `{"commands":{"led":"LED_ON"}}`
  - Apagar LED: `{"commands":{"led":"LED_OFF"}}`
  - El backend almacena el comando con expiración (TTL de 5 minutos) en la tabla `Command`.
  - El ESP8266 consulta periódicamente `GET /api/iot/commands/next` y confirma con `POST /api/iot/commands/:id/ack`.

---

## 💻 Instrucciones para Ejecutar Localmente

### Prerrequisitos
- Node.js versión 18 o superior (recomendado Node 20 o 22).
- Gestor de paquetes `npm` (o `pnpm` / `yarn`).

### 1. Clonar el repositorio y entrar a la carpeta del frontend
```bash
cd frontEnd
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar variables de entorno
Crea un archivo `.env` en la raíz de `frontEnd/` (ya incluido por defecto):
```env
VITE_API_URL=https://esparduinoweb.vercel.app
```
*(Si vas a probar un backend local en Node.js, puedes cambiarlo temporalmente a `http://localhost:3000`)*.

### 4. Iniciar el servidor de desarrollo Vite
```bash
npm run dev
```
La aplicación estará disponible inmediatamente en tu navegador en:
`http://localhost:5173`

### 5. Compilar para producción
```bash
npm run build
```
Esto generará la carpeta optimizada y minificada `dist/`.

---

## ☁️ Despliegue en Vercel

El proyecto incluye el archivo `vercel.json` con la regla de *rewrites* requerida para que las rutas de React Router DOM funcionen correctamente al recargar la página.

### Opción A: Despliegue mediante Vercel CLI
1. Instala Vercel CLI globalmente (si no lo tienes):
   ```bash
   npm i -g vercel
   ```
2. Entra al directorio `frontEnd`:
   ```bash
   cd frontEnd
   ```
3. Ejecuta el comando de despliegue:
   ```bash
   vercel
   ```
4. Para producción:
   ```bash
   vercel --prod
   ```

### Opción B: Despliegue desde GitHub / Vercel Dashboard
1. Sube tu código al repositorio de GitHub.
2. Ingresa a [vercel.com](https://vercel.com) e inicia sesión.
3. Haz clic en **Add New...** > **Project**.
4. Importa tu repositorio.
5. Configura el proyecto:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `frontEnd`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
6. En la sección **Environment Variables**, añade:
   - `VITE_API_URL` = `https://esparduinoweb.vercel.app`
7. Haz clic en **Deploy**. ¡Listo!

