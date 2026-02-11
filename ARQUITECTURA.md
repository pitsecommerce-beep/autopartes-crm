# 🏗️ ARQUITECTURA TÉCNICA
## AutoPartes CRM/ERP

---

## 📊 DIAGRAMA DE ARQUITECTURA

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND (React + Vite)                 │
│                      Hosted en Vercel (Edge)                    │
├─────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   Clientes   │  │    Ventas    │  │   Pedidos    │          │
│  │  (WhatsApp)  │  │   (Funnel)   │  │    (WMS)     │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│          │                 │                 │                  │
│          └─────────────────┴─────────────────┘                  │
│                            │                                    │
│                    React Router                                 │
│                            │                                    │
│          ┌─────────────────┴─────────────────┐                  │
│          │                                   │                  │
│     ┌────▼─────┐                      ┌──────▼──────┐           │
│     │  Auth    │                      │  Services   │           │
│     │ (useAuth)│                      │   Layer     │           │
│     └────┬─────┘                      └──────┬──────┘           │
│          │                                   │                  │
└──────────┼───────────────────────────────────┼──────────────────┘
           │                                   │
           │                                   │
┌──────────▼───────────────────────────────────▼──────────────────┐
│                    SUPABASE (Backend as a Service)              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │  PostgreSQL  │  │     Auth     │  │   Storage    │          │
│  │   Database   │  │   (JWT)      │  │   (Files)    │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│                                                                 │
│  Tables:                                                        │
│  • usuarios          • ventas           • productos            │
│  • clientes          • items_venta      • mensajes_whatsapp    │
│  • actividades_marketing                • configuracion        │
│                                                                 │
│  Row Level Security (RLS) habilitado                            │
│  Políticas de acceso por rol                                    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
           │                                   │
           │                                   │
┌──────────▼───────────────────────────────────▼──────────────────┐
│                    INTEGRACIONES EXTERNAS                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────┐  ┌─────────────────┐  ┌────────────────┐  │
│  │  Anthropic API  │  │  Twilio/Meta    │  │  Stripe API    │  │
│  │  (Claude IA)    │  │  WhatsApp API   │  │  (Pagos)       │  │
│  │                 │  │                 │  │                │  │
│  │  • Procesa msgs │  │  • Envía msgs   │  │  • Checkout    │  │
│  │  • Consulta BD  │  │  • Recibe msgs  │  │  • Webhooks    │  │
│  │  • Genera resp. │  │  • Webhooks     │  │  • Status      │  │
│  └─────────────────┘  └─────────────────┘  └────────────────┘  │
│                                                                 │
│  ┌─────────────────┐                                            │
│  │  Envia.com API  │                                            │
│  │  (Envíos)       │                                            │
│  │                 │                                            │
│  │  • Crear envío  │                                            │
│  │  • Tracking     │                                            │
│  │  • Cotizaciones │                                            │
│  └─────────────────┘                                            │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔄 FLUJO DE DATOS

### 1. FLUJO DE AUTENTICACIÓN

```
Usuario → Login Form
    ↓
Supabase Auth (JWT)
    ↓
Validación de Credenciales
    ↓
Generar Token (almacenado en localStorage)
    ↓
Cargar Perfil de Usuario (tabla usuarios)
    ↓
Redirigir a Dashboard
```

### 2. FLUJO DE MENSAJE WHATSAPP → VENTA

```
Cliente envía mensaje WhatsApp
    ↓
Webhook recibe mensaje en backend
    ↓
whatsappService.processIncomingMessage()
    ↓
┌─────────────────────────────────────┐
│ 1. Buscar/Crear Cliente (por tel)  │
│ 2. Guardar mensaje en BD            │
│ 3. Llamar a Claude API con contexto │
│ 4. Claude consulta productos        │
│ 5. Generar respuesta inteligente    │
│ 6. Si hay intención de compra:      │
│    - Solicitar dirección             │
│    - Crear venta (estado: Cotizando)│
│ 7. Enviar respuesta por WhatsApp    │
└─────────────────────────────────────┘
    ↓
Actualizar estado en funnel de ventas
    ↓
Vendedor ve la venta en dashboard
    ↓
Genera link de pago (Stripe)
    ↓
Cliente paga
    ↓
Webhook de Stripe confirma pago
    ↓
Estado cambia a "Pedido Pendiente"
    ↓
Almacén ve el pedido
    ↓
Surte y marca como "Completado"
```

### 3. FLUJO DE CONSULTA DE PRODUCTOS (IA)

```
Cliente: "¿Tienen defensa para Nissan Sentra 2018?"
    ↓
WhatsApp → Backend → Claude API
    ↓
Claude genera query de búsqueda
    ↓
productService.search("defensa nissan sentra 2018")
    ↓
Supabase query:
SELECT * FROM productos 
WHERE 
  (descripcion ILIKE '%defensa%' OR parte ILIKE '%defensa%')
  AND marca ILIKE '%nissan%'
  AND (modelo ILIKE '%sentra%' OR modelos_compatibles ILIKE '%sentra%')
    ↓
Retorna productos coincidentes
    ↓
Claude genera respuesta:
"Sí, tenemos estas opciones:
1. SKU: XYZ123 - Defensa Delantera Nissan Sentra 2016-2020
   Precio: $3,500 MXN
   Existencia: 5 piezas"
    ↓
Envía foto del producto (url_imagen)
    ↓
"¿Es esta la pieza que buscas?"
```

---

## 🗃️ MODELO DE DATOS

### Relaciones entre Tablas

```
usuarios (1) ──────< (N) ventas
    │
    │ (1:N)
    ↓
clientes (1) ──────< (N) ventas
    │                      │
    │ (1:N)                │ (1:N)
    ↓                      ↓
mensajes_whatsapp    items_venta (N) ────> (1) productos
    │
    │ (1:N)
    ↓
actividades_marketing
```

### Tablas Principales

**usuarios**
- Almacena información de empleados (vendedores, gerentes, almacén)
- FK: Referencia a auth.users de Supabase
- Roles: admin, gerente, vendedor, almacen

**clientes**
- Registro de clientes finales
- Clave principal: teléfono (único)
- Estado: activo/inactivo

**productos**
- Catálogo de autopartes
- Clave principal: SKU (único)
- Existencias en 3 ubicaciones (CDMX, Tulti, Foránea)

**ventas**
- Registro de todas las ventas
- Estado: Mensaje Recibido → Cotizando → Pendiente de Pago → Pedido Pendiente → Completado
- Incluye campos para Stripe y Envia.com

**items_venta**
- Detalle de productos en cada venta
- Permite ventas multi-producto

**mensajes_whatsapp**
- Historial completo de conversaciones
- Dirección: entrante/saliente
- Estados de entrega

**actividades_marketing**
- Campañas automatizadas
- Mensajes programados
- Tipos: promoción, seguimiento, recordatorio, reactivación

---

## 🔐 SEGURIDAD

### Row Level Security (RLS)

Todas las tablas tienen RLS habilitado. Políticas principales:

```sql
-- Usuarios solo ven su propio perfil
CREATE POLICY "ver_propio_perfil" ON usuarios
  FOR SELECT USING (auth.uid() = id);

-- Usuarios autenticados ven todos los productos
CREATE POLICY "ver_productos" ON productos
  FOR SELECT TO authenticated USING (true);

-- Solo admins ven configuración
CREATE POLICY "ver_config_admin" ON configuracion
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM usuarios 
      WHERE id = auth.uid() AND rol = 'admin'
    )
  );
```

### Variables de Entorno

Nunca expuestas al cliente:
- API Keys (Anthropic, Stripe, etc.) solo en backend
- Credenciales de BD solo en Supabase

Expuestas al frontend (seguras):
- VITE_SUPABASE_URL (pública)
- VITE_SUPABASE_ANON_KEY (pública, con RLS activo)

---

## ⚡ OPTIMIZACIONES

### Frontend
- Code splitting por ruta (React.lazy)
- Imágenes optimizadas (WebP cuando sea posible)
- Cache de queries con React Query (opcional para v2)

### Base de Datos
- Índices en columnas frecuentemente consultadas:
  - productos: sku, marca, modelo, parte
  - ventas: estado, cliente_id, created_at
  - clientes: telefono
- Triggers para timestamps automáticos
- Función para generar números de venta automáticos

### APIs
- Rate limiting en Anthropic API
- Batch processing para importación de productos
- Webhooks asíncronos para pagos

---

## 📈 ESCALABILIDAD

### Horizontal Scaling

**Frontend (Vercel)**
- Auto-scaling basado en demanda
- Edge network global
- Sin configuración necesaria

**Backend (Supabase)**
- Plan gratuito: hasta 500MB DB, 50K usuarios activos
- Plan Pro: $25/mes - 8GB DB, 100K usuarios activos
- Plan Team/Enterprise para > 1M usuarios

### Vertical Scaling

**Base de Datos**
- Iniciar con plan Free
- Migrar a Pro cuando:
  - > 500MB de datos
  - > 50K usuarios activos mensuales
  - > 2GB de bandwidth
  
**APIs Externas**
- Anthropic: Pay-as-you-go ($0.003/mensaje)
- Twilio WhatsApp: Pay-per-message ($0.005)
- Stripe: % de transacciones (sin costo fijo)

---

## 🔄 CI/CD

### Deployment Automático

```
Git Push → GitHub
    ↓
Webhook → Vercel
    ↓
Build Process:
  1. npm install
  2. npm run build
  3. Deploy to Edge
    ↓
✅ Live en < 2 minutos
```

### Ambientes

- **Production**: main branch → tu-proyecto.vercel.app
- **Preview**: feature branches → preview-xxx.vercel.app
- **Development**: Local → localhost:3000

---

## 🐛 Monitoreo y Logs

### Vercel
- Function logs en tiempo real
- Error tracking
- Performance metrics

### Supabase
- Query logs
- Auth logs
- Real-time monitoring
- Backup automático diario

---

## 📊 Métricas de Rendimiento

### Objetivos

- **Time to First Byte (TTFB)**: < 200ms
- **First Contentful Paint (FCP)**: < 1.5s
- **Time to Interactive (TTI)**: < 3s
- **API Response Time**: < 500ms (p95)

### Monitoreo

Herramientas recomendadas:
- Vercel Analytics (integrado)
- Google Lighthouse (para auditorías)
- Supabase Dashboard (métricas de BD)

---

## 🔮 Roadmap Técnico

### Fase 1 (MVP) ✅
- Autenticación
- CRUD básico
- WhatsApp IA
- Funnel de ventas
- WMS básico

### Fase 2 (Q2 2024)
- Integración completa Stripe
- Integración Envia.com
- Reportes avanzados
- Export a Excel/PDF
- Notificaciones push

### Fase 3 (Q3 2024)
- App móvil (React Native)
- Integración con facturación (SAT)
- Inventario multi-sucursal
- BI Dashboard
- API pública para integraciones

### Fase 4 (Q4 2024)
- Machine Learning para pronóstico de ventas
- Chatbot multicanal (Messenger, Instagram, etc.)
- Programa de lealtad
- Marketplace de proveedores

---

**Última actualización**: Febrero 2024
