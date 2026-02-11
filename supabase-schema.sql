-- =====================================================
-- SCHEMA SQL PARA SUPABASE
-- AutoPartes CRM/ERP
-- =====================================================

-- Habilitar extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- TABLA: usuarios
-- Gestión de usuarios del sistema
-- =====================================================
CREATE TABLE usuarios (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  nombre TEXT NOT NULL,
  telefono TEXT,
  rol TEXT NOT NULL CHECK (rol IN ('admin', 'gerente', 'vendedor', 'almacen')),
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_usuarios_email ON usuarios(email);
CREATE INDEX idx_usuarios_rol ON usuarios(rol);

-- =====================================================
-- TABLA: productos
-- Catálogo de autopartes
-- =====================================================
CREATE TABLE productos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sku TEXT UNIQUE NOT NULL,
  descripcion TEXT NOT NULL,
  existencia_cdmx INTEGER DEFAULT 0,
  existencia_tulti INTEGER DEFAULT 0,
  existencia_foranea INTEGER DEFAULT 0,
  url_imagen TEXT,
  precio_compra DECIMAL(10, 2),
  precio_venta DECIMAL(10, 2),
  parte TEXT,
  modelo TEXT,
  marca TEXT,
  modelos_compatibles TEXT,
  lado TEXT,
  del_tras TEXT,
  int_ext TEXT,
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_productos_sku ON productos(sku);
CREATE INDEX idx_productos_marca ON productos(marca);
CREATE INDEX idx_productos_modelo ON productos(modelo);
CREATE INDEX idx_productos_parte ON productos(parte);
CREATE INDEX idx_productos_activo ON productos(activo);

-- =====================================================
-- TABLA: clientes
-- Registro de clientes
-- =====================================================
CREATE TABLE clientes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  telefono TEXT UNIQUE NOT NULL,
  nombre TEXT NOT NULL,
  email TEXT,
  direccion TEXT,
  ciudad TEXT,
  estado TEXT DEFAULT 'activo' CHECK (estado IN ('activo', 'inactivo')),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_clientes_telefono ON clientes(telefono);
CREATE INDEX idx_clientes_nombre ON clientes(nombre);
CREATE INDEX idx_clientes_estado ON clientes(estado);

-- =====================================================
-- TABLA: ventas
-- Registro de ventas y su estado en el funnel
-- =====================================================
CREATE TABLE ventas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  numero_venta TEXT UNIQUE NOT NULL,
  cliente_id UUID NOT NULL REFERENCES clientes(id) ON DELETE RESTRICT,
  vendedor_id UUID REFERENCES usuarios(id) ON DELETE SET NULL,
  total DECIMAL(10, 2) NOT NULL DEFAULT 0,
  estado TEXT NOT NULL DEFAULT 'Mensaje Recibido' 
    CHECK (estado IN ('Mensaje Recibido', 'Cotizando', 'Pendiente de Pago', 'Pedido Pendiente', 'Completado', 'Cancelado')),
  direccion_envio TEXT,
  
  -- Integración con Stripe (opcional)
  stripe_checkout_id TEXT,
  stripe_checkout_url TEXT,
  stripe_payment_id TEXT,
  stripe_payment_data JSONB,
  fecha_pago TIMESTAMPTZ,
  
  -- Integración con Envia.com (opcional)
  envia_tracking_id TEXT,
  envia_data JSONB,
  
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_ventas_cliente ON ventas(cliente_id);
CREATE INDEX idx_ventas_vendedor ON ventas(vendedor_id);
CREATE INDEX idx_ventas_estado ON ventas(estado);
CREATE INDEX idx_ventas_numero ON ventas(numero_venta);
CREATE INDEX idx_ventas_fecha ON ventas(created_at);

-- =====================================================
-- TABLA: items_venta
-- Detalle de productos en cada venta
-- =====================================================
CREATE TABLE items_venta (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  venta_id UUID NOT NULL REFERENCES ventas(id) ON DELETE CASCADE,
  producto_sku TEXT NOT NULL REFERENCES productos(sku) ON DELETE RESTRICT,
  cantidad INTEGER NOT NULL DEFAULT 1,
  precio_unitario DECIMAL(10, 2) NOT NULL,
  subtotal DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_items_venta_venta ON items_venta(venta_id);
CREATE INDEX idx_items_venta_producto ON items_venta(producto_sku);

-- =====================================================
-- TABLA: mensajes_whatsapp
-- Historial de conversaciones de WhatsApp
-- =====================================================
CREATE TABLE mensajes_whatsapp (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cliente_id UUID REFERENCES clientes(id) ON DELETE CASCADE,
  telefono TEXT NOT NULL,
  mensaje TEXT NOT NULL,
  direccion TEXT NOT NULL CHECK (direccion IN ('entrante', 'saliente')),
  whatsapp_message_id TEXT,
  media_url TEXT,
  estado TEXT DEFAULT 'enviado' CHECK (estado IN ('enviado', 'entregado', 'leido', 'fallido', 'recibido')),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_mensajes_cliente ON mensajes_whatsapp(cliente_id);
CREATE INDEX idx_mensajes_telefono ON mensajes_whatsapp(telefono);
CREATE INDEX idx_mensajes_direccion ON mensajes_whatsapp(direccion);
CREATE INDEX idx_mensajes_fecha ON mensajes_whatsapp(created_at);

-- =====================================================
-- TABLA: actividades_marketing
-- Campañas y mensajes proactivos
-- =====================================================
CREATE TABLE actividades_marketing (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cliente_id UUID REFERENCES clientes(id) ON DELETE CASCADE,
  tipo TEXT NOT NULL CHECK (tipo IN ('promocion', 'seguimiento', 'recordatorio', 'reactivacion')),
  mensaje TEXT NOT NULL,
  estado TEXT DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'enviado', 'fallido')),
  fecha_programada TIMESTAMPTZ,
  fecha_enviado TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_marketing_cliente ON actividades_marketing(cliente_id);
CREATE INDEX idx_marketing_estado ON actividades_marketing(estado);
CREATE INDEX idx_marketing_fecha_prog ON actividades_marketing(fecha_programada);

-- =====================================================
-- TABLA: configuracion
-- Configuración del sistema (API keys, etc.)
-- =====================================================
CREATE TABLE configuracion (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clave TEXT UNIQUE NOT NULL,
  valor TEXT,
  descripcion TEXT,
  tipo TEXT DEFAULT 'texto' CHECK (tipo IN ('texto', 'numero', 'boolean', 'json')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índice
CREATE INDEX idx_configuracion_clave ON configuracion(clave);

-- Insertar configuraciones por defecto
INSERT INTO configuracion (clave, valor, descripcion, tipo) VALUES
  ('stripe_enabled', 'false', 'Habilitar integración con Stripe', 'boolean'),
  ('envia_enabled', 'false', 'Habilitar integración con Envia.com', 'boolean'),
  ('whatsapp_enabled', 'true', 'Habilitar WhatsApp', 'boolean'),
  ('anthropic_api_key', '', 'API Key de Anthropic para IA', 'texto');

-- =====================================================
-- FUNCIÓN: Actualizar timestamp automáticamente
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar trigger a tablas relevantes
CREATE TRIGGER update_usuarios_updated_at BEFORE UPDATE ON usuarios
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_productos_updated_at BEFORE UPDATE ON productos
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_clientes_updated_at BEFORE UPDATE ON clientes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ventas_updated_at BEFORE UPDATE ON ventas
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- FUNCIÓN: Generar número de venta automático
-- =====================================================
CREATE OR REPLACE FUNCTION generate_sale_number()
RETURNS TRIGGER AS $$
DECLARE
  next_number INTEGER;
BEGIN
  SELECT COALESCE(MAX(CAST(SUBSTRING(numero_venta FROM 5) AS INTEGER)), 0) + 1 
  INTO next_number
  FROM ventas;
  
  NEW.numero_venta := 'VTA-' || LPAD(next_number::TEXT, 6, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para generar número de venta
CREATE TRIGGER set_sale_number BEFORE INSERT ON ventas
  FOR EACH ROW WHEN (NEW.numero_venta IS NULL)
  EXECUTE FUNCTION generate_sale_number();

-- =====================================================
-- RLS (Row Level Security) - Seguridad a nivel de fila
-- =====================================================

-- Habilitar RLS en todas las tablas
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE productos ENABLE ROW LEVEL SECURITY;
ALTER TABLE clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE ventas ENABLE ROW LEVEL SECURITY;
ALTER TABLE items_venta ENABLE ROW LEVEL SECURITY;
ALTER TABLE mensajes_whatsapp ENABLE ROW LEVEL SECURITY;
ALTER TABLE actividades_marketing ENABLE ROW LEVEL SECURITY;
ALTER TABLE configuracion ENABLE ROW LEVEL SECURITY;

-- Políticas de acceso para usuarios
CREATE POLICY "Los usuarios pueden ver su propio perfil"
  ON usuarios FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Los usuarios pueden actualizar su propio perfil"
  ON usuarios FOR UPDATE
  USING (auth.uid() = id);

-- Políticas de acceso para productos (todos los usuarios autenticados)
CREATE POLICY "Usuarios autenticados pueden ver productos"
  ON productos FOR SELECT
  TO authenticated
  USING (true);

-- Políticas de acceso para clientes
CREATE POLICY "Usuarios autenticados pueden ver clientes"
  ON clientes FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Usuarios autenticados pueden crear clientes"
  ON clientes FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Usuarios autenticados pueden actualizar clientes"
  ON clientes FOR UPDATE
  TO authenticated
  USING (true);

-- Políticas de acceso para ventas
CREATE POLICY "Usuarios autenticados pueden ver ventas"
  ON ventas FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Usuarios autenticados pueden crear ventas"
  ON ventas FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Usuarios autenticados pueden actualizar ventas"
  ON ventas FOR UPDATE
  TO authenticated
  USING (true);

-- Políticas de acceso para items_venta
CREATE POLICY "Usuarios autenticados pueden ver items de venta"
  ON items_venta FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Usuarios autenticados pueden crear items de venta"
  ON items_venta FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Políticas de acceso para mensajes
CREATE POLICY "Usuarios autenticados pueden ver mensajes"
  ON mensajes_whatsapp FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Usuarios autenticados pueden crear mensajes"
  ON mensajes_whatsapp FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Políticas de acceso para actividades de marketing
CREATE POLICY "Usuarios autenticados pueden ver actividades de marketing"
  ON actividades_marketing FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Usuarios autenticados pueden crear actividades de marketing"
  ON actividades_marketing FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Políticas de acceso para configuración (solo admins)
CREATE POLICY "Solo admins pueden ver configuración"
  ON configuracion FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM usuarios 
      WHERE id = auth.uid() AND rol = 'admin'
    )
  );

-- =====================================================
-- VISTAS ÚTILES
-- =====================================================

-- Vista de ventas con información completa
CREATE OR REPLACE VIEW ventas_completas AS
SELECT 
  v.*,
  c.nombre as cliente_nombre,
  c.telefono as cliente_telefono,
  c.email as cliente_email,
  u.nombre as vendedor_nombre,
  COUNT(iv.id) as total_items,
  SUM(iv.cantidad) as total_piezas
FROM ventas v
LEFT JOIN clientes c ON v.cliente_id = c.id
LEFT JOIN usuarios u ON v.vendedor_id = u.id
LEFT JOIN items_venta iv ON v.id = iv.venta_id
GROUP BY v.id, c.nombre, c.telefono, c.email, u.nombre;

-- =====================================================
-- DATOS DE PRUEBA (OPCIONAL)
-- =====================================================

-- Insertar un cliente de prueba
-- INSERT INTO clientes (telefono, nombre, email) VALUES
--   ('+5215512345678', 'Cliente Demo', 'demo@example.com');

-- =====================================================
-- FIN DEL SCHEMA
-- =====================================================
