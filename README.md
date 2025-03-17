# Koywe Challenge

Este proyecto consiste en una aplicación de cotización de criptomonedas con un backend en NestJS y un frontend en Next.js.

## Control de Versiones (Git)

1. Inicializar el repositorio Git (si aún no está inicializado):
```bash
git init
```

2. Agregar los archivos al staging:
```bash
git add .
```

3. Crear el commit con los cambios:
```bash
git commit -m "tu mensaje descriptivo aquí"
```

4. Agregar el repositorio remoto (solo la primera vez):
```bash
git remote add origin URL_DEL_REPOSITORIO
```

5. Enviar los cambios al repositorio:
```bash
git push -u origin main
```

Nota: Asegúrate de no incluir archivos sensibles como `.env` o `node_modules/` en el repositorio.

## Requisitos Previos

- Node.js (versión 18 o superior)
- npm (incluido con Node.js)
- PostgreSQL

## Estructura del Proyecto

```
koywe-challenge/
├── backend/     # Servidor NestJS
└── frontend/    # Aplicación Next.js
```

## Configuración del Backend

1. Navegar al directorio del backend:
```bash
cd backend
```

2. Instalar dependencias:
```bash
npm install
```

3. Configurar variables de entorno:
   - Crear un archivo `.env` en el directorio `backend/` con el siguiente contenido:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/koywe?schema=public"
JWT_SECRET="tu_secreto_jwt"
```

4. Iniciar el servidor en modo desarrollo:
```bash
npm run start:dev
```

El backend estará disponible en `http://localhost:3001`

## Configuración del Frontend

1. Navegar al directorio del frontend:
```bash
cd frontend
```

2. Instalar dependencias:
```bash
npm install
```

3. Configurar variables de entorno:
   - Crear un archivo `.env.local` en el directorio `frontend/` con el siguiente contenido:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

4. Iniciar el servidor de desarrollo:
```bash
npm run dev
```

El frontend estará disponible en `http://localhost:3000`

## Funcionalidades Disponibles

- Registro de usuarios
- Inicio de sesión
- Creación de cotizaciones
- Conversión entre las siguientes monedas:
  - ARS (Peso Argentino)
  - BTC (Bitcoin)
  - ETH (Ethereum)
  - USDC (USD Coin)
  - USDT (Tether)

## Pares de Conversión Soportados

- ARS ↔ ETH/BTC/USDC/USDT
- ETH ↔ BTC/USDC/USDT
- BTC ↔ USDT

## Endpoints del Backend

### Autenticación
- POST `/auth/register` - Registro de usuario
- POST `/auth/login` - Inicio de sesión

### Cotizaciones
- POST `/quotes` - Crear nueva cotización
- GET `/quotes/:id` - Obtener cotización por ID

### Usuarios
- GET `/users` - Obtener información de usuarios

## Notas Adicionales

- El backend utiliza Prisma como ORM para la base de datos PostgreSQL
- La autenticación se maneja mediante JWT
- Las cotizaciones se procesan en tiempo real
- Los montos se muestran con hasta 8 decimales para precisión en criptomonedas 