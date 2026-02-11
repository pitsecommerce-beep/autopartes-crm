# 🚗 AutoPartes CRM/ERP - Sistema Modular de Gestión

Sistema completo de CRM y ERP para distribuidores de autopartes con WhatsApp IA, gestión de ventas y almacén.

## 📋 Características Principales

### ✅ **Módulo 1: Gestión de Clientes**
- 💬 **WhatsApp con IA (Claude)** - Respuestas automáticas inteligentes
- 📊 Registro completo de clientes y historial de compras
- 🤖 Agente IA que consulta base de datos en tiempo real
- 📸 Envío automático de fotos de productos
- 🎯 Funnel de ventas automatizado
- 📍 Captura de direcciones de envío

### ✅ **Módulo 2: Gestión de Ventas**
- 📈 Dashboard con métricas en tiempo real
- 🎯 Funnel visual de ventas (Kanban)
- 💳 Integración con Stripe (opcional)
- 📊 Seguimiento de desempeño por vendedor
- 🔄 Estados: Mensaje Recibido → Cotizando → Pendiente de Pago → Pedido Pendiente

### ✅ **Módulo 3: Gestión de Pedidos (WMS)**
- 📦 Lista de surtido simplificada para almacén
- 🗺️ Direcciones de envío integradas
- ✅ Sistema de completado de pedidos
- 🚚 Integración con Envia.com (opcional)
- 📋 Impresión de listas de picking

## 🏗️ Stack Tecnológico

### Frontend
- **React 18** - Framework UI
- **Vite** - Build tool ultrarrápido
- **Tailwind CSS** - Estilos modernos
- **React Router** - Navegación
- **Lucide React** - Iconos

### Backend & Database
- **Supabase** - Backend as a Service
  - PostgreSQL database
  - Autenticación integrada
  - APIs automáticas
  - Real-time subscriptions
  - Storage

### Integraciones
- **Anthropic Claude API** - IA conversacional para WhatsApp
- **Twilio / Meta WhatsApp Business API** - Mensajería
- **Stripe** - Pagos (opcional)
- **Envia.com** - Envíos (opcional)

### Hosting
- **Vercel** - Frontend (gratis, escalable)
- **Supabase** - Backend (gratis hasta 500MB)

## 📁 Estructura del Proyecto

```
autopartes-crm-erp/
├── src/
│   ├── components/       # Componentes reutilizables
│   ├── pages/           # Páginas principales
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Clientes.jsx
│   │   ├── Ventas.jsx
│   │   └── Pedidos.jsx
│   ├── services/        # Lógica de negocio y APIs
│   │   ├── supabase.js
│   │   ├── customerService.js
│   │   ├── salesService.js
│   │   ├── productService.js
│   │   ├── whatsappService.js
│   │   └── stripeService.js
│   ├── hooks/           # React hooks personalizados
│   │   └── useAuth.js
│   ├── styles/          # Estilos globales
│   │   └── index.css
│   ├── App.jsx          # Componente raíz
│   └── main.jsx         # Punto de entrada
├── public/              # Archivos estáticos
├── supabase-schema.sql  # Schema de base de datos
├── package.json
├── vite.config.js
├── tailwind.config.js
└── .env.example
```

## 🚀 Instalación Paso a Paso

### Paso 1: Crear Cuenta en Supabase

1. Ve a [supabase.com](https://supabase.com)
2. Haz clic en "Start your project"
3. Crea una cuenta con tu email
4. Crea un nuevo proyecto:
   - **Nombre**: autopartes-crm
   - **Password**: Guarda bien esta contraseña
   - **Región**: South America (São Paulo) - más cercana a México
5. Espera 2-3 minutos mientras se crea el proyecto

### Paso 2: Configurar la Base de Datos

1. Una vez creado el proyecto, ve a la sección **SQL Editor** (icono de base de datos)
2. Haz clic en **+ New Query**
3. Abre el archivo `supabase-schema.sql` de este proyecto
4. Copia TODO el contenido del archivo
5. Pégalo en el editor SQL de Supabase
6. Haz clic en **Run** (botón verde abajo a la derecha)
7. Deberías ver "Success. No rows returned" - ¡Perfecto!

### Paso 3: Obtener las Credenciales de Supabase

1. En el panel de Supabase, ve a **Settings** (⚙️) → **API**
2. Copia estos dos valores:
   - **Project URL** (ejemplo: `https://xxxxx.supabase.co`)
   - **anon public** key (una clave larga que empieza con `eyJ...`)
3. Guárdalos en un lugar seguro

### Paso 4: Cargar los Datos de Productos

1. En Supabase, ve a **Table Editor**
2. Selecciona la tabla `productos`
3. Haz clic en **Insert** → **Import data from CSV**
4. Convierte tu archivo Excel a CSV:
   - Abre `ejemplo_informacion_autopartes.xlsx`
   - Guarda como → CSV (delimitado por comas)
5. Arrastra el archivo CSV a Supabase
6. Mapea las columnas (deben coincidir automáticamente)
7. Haz clic en **Import**

### Paso 5: Obtener API Key de Anthropic (para WhatsApp IA)

1. Ve a [console.anthropic.com](https://console.anthropic.com)
2. Crea una cuenta o inicia sesión
3. Ve a **API Keys**
4. Haz clic en **Create Key**
5. Dale un nombre: "AutoPartes WhatsApp"
6. Copia la API key (empieza con `sk-ant-...`)
7. ⚠️ **IMPORTANTE**: Esta clave solo se muestra una vez, guárdala bien

### Paso 6: Crear Cuenta en Vercel

1. Ve a [vercel.com](https://vercel.com)
2. Haz clic en **Sign Up**
3. Regístrate con tu cuenta de GitHub (recomendado) o email
4. No hagas nada más por ahora

### Paso 7: Configurar el Proyecto Localmente

#### Opción A: Usar StackBlitz (SIN instalar nada - RECOMENDADO)

1. Ve a [stackblitz.com](https://stackblitz.com)
2. Haz clic en **New Project** → **Import from GitHub**
3. O crea un nuevo proyecto React + Vite
4. Sube todos los archivos de este proyecto
5. Crea un archivo `.env` con:

```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key-aqui
VITE_ANTHROPIC_API_KEY=tu-api-key-de-anthropic
```

6. El proyecto se ejecutará automáticamente

#### Opción B: Instalación Local (requiere Node.js)

Si tienes Node.js instalado:

1. Abre la terminal en la carpeta del proyecto
2. Ejecuta:
```bash
npm install
```

3. Crea un archivo `.env` (copia de `.env.example`):
```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key-aqui
VITE_ANTHROPIC_API_KEY=tu-api-key-de-anthropic
```

4. Inicia el servidor de desarrollo:
```bash
npm run dev
```

5. Abre el navegador en `http://localhost:3000`

### Paso 8: Desplegar en Vercel

1. Ve a [vercel.com](https://vercel.com/dashboard)
2. Haz clic en **Add New** → **Project**
3. Conecta tu repositorio de GitHub o sube el proyecto
4. Configura las variables de entorno:
   - Ve a **Settings** → **Environment Variables**
   - Agrega las mismas variables del archivo `.env`
   - **IMPORTANTE**: No incluyas las comillas ni espacios
5. Haz clic en **Deploy**
6. Espera 2-3 minutos
7. ¡Tu aplicación estará en vivo! Vercel te dará una URL como `tu-proyecto.vercel.app`

## 👤 Crear Primer Usuario

1. Ve a tu aplicación (local o desplegada)
2. Haz clic en **Registrarse**
3. Completa el formulario:
   - Nombre completo
   - Email
   - Teléfono
   - Rol: **admin** (para el primer usuario)
   - Contraseña (mínimo 6 caracteres)
4. Haz clic en **Crear Cuenta**
5. ¡Listo! Ya puedes acceder al dashboard

## 🔧 Configuración Opcional

### Integrar WhatsApp (Twilio)

1. Crea cuenta en [twilio.com](https://twilio.com)
2. Ve a **Messaging** → **Try it out** → **Get a WhatsApp test number**
3. Copia las credenciales:
   - Account SID
   - Auth Token
   - WhatsApp Number
4. Agrega a tus variables de entorno
5. Configura el webhook en Twilio apuntando a tu backend

### Integrar Stripe (Pagos)

1. Crea cuenta en [stripe.com](https://stripe.com)
2. Ve a **Developers** → **API Keys**
3. En modo **Test**, copia:
   - Publishable key (empieza con `pk_test_...`)
4. Agrega a tus variables de entorno:
```env
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
```
5. En Supabase, ve a la tabla `configuracion`
6. Cambia `stripe_enabled` a `true`

### Integrar Envia.com (Envíos)

1. Crea cuenta en [envia.com](https://envia.com)
2. Ve a **API** → **Credentials**
3. Copia tu API Key
4. Agrega a tus variables de entorno:
```env
VITE_ENVIA_API_KEY=tu-api-key
```
5. En Supabase, cambia `envia_enabled` a `true`

## 📱 Uso del Sistema

### Gestión de Clientes
- Los clientes se crean automáticamente cuando envían un mensaje por WhatsApp
- El agente IA responde consultas sobre productos
- Cuando hay interés de compra, solicita la dirección
- Mueve automáticamente al funnel de ventas

### Gestión de Ventas
- Arrastra ventas entre columnas del funnel
- Genera links de pago de Stripe
- Rastrea el estado de cada venta
- Ve métricas en tiempo real

### Gestión de Pedidos
- Solo muestra pedidos pagados
- Lista simplificada para surtir
- Marca como completado cuando se envía
- Imprime listas de picking

## 🔐 Roles de Usuario

- **Admin**: Acceso completo + configuración
- **Gerente**: Ve todo, gestiona vendedores
- **Vendedor**: Clientes y Ventas
- **Almacén**: Solo Pedidos

## 💰 Costos Estimados (MVP)

- **Supabase**: GRATIS (hasta 500MB DB, 50K usuarios)
- **Vercel**: GRATIS (100GB bandwidth/mes)
- **Anthropic API**: ~$0.003 por mensaje (100 mensajes = $0.30 USD)
- **Twilio WhatsApp**: ~$0.005 por mensaje
- **Stripe**: 2.9% + $0.30 USD por transacción (solo al cobrar)
- **Envia.com**: Por envío según tarifa

**Total mensual estimado para MVP (100 mensajes/día)**: ~$15-20 USD

## 🎨 Personalización

### Cambiar Colores

Edita `tailwind.config.js`:
```js
colors: {
  primary: {
    // Cambia estos valores por tu color de marca
    500: '#0ea5e9',
    600: '#0284c7',
    // ...
  }
}
```

### Cambiar Logo

1. Reemplaza el icono `<Package />` en los componentes
2. O agrega tu logo en `/public/logo.png`
3. Actualiza las referencias en `Login.jsx` y `Dashboard.jsx`

## 🐛 Solución de Problemas

### Error: "Invalid API Key"
- Verifica que copiaste bien las API keys
- Asegúrate de no incluir espacios al inicio/final
- Las variables deben empezar con `VITE_`

### Error: "Table does not exist"
- Verifica que ejecutaste el archivo `supabase-schema.sql`
- Ve a Supabase → SQL Editor → revisa que las tablas existan

### La aplicación no se conecta a Supabase
- Verifica las variables de entorno
- Asegúrate de que el `.env` esté en la raíz del proyecto
- Reinicia el servidor de desarrollo

### WhatsApp no responde
- Verifica que la API key de Anthropic sea válida
- Revisa los logs en Supabase → Logs
- Asegúrate de que el webhook esté configurado

## 📞 Soporte

Para dudas o problemas:
1. Revisa esta documentación
2. Verifica los logs en Supabase
3. Consulta la documentación oficial de cada servicio

## 📄 Licencia

Este proyecto es privado y propietario.

---

**Desarrollado con ❤️ para distribuidores de autopartes**
