# ✅ CHECKLIST DE LANZAMIENTO
## AutoPartes CRM/ERP

Usa este checklist para verificar que todo esté configurado correctamente antes de lanzar.

---

## 📋 PRE-REQUISITOS

- [ ] Tienes cuenta de email
- [ ] Tienes el archivo Excel con productos
- [ ] Tienes 1 hora disponible
- [ ] Conexión estable a internet

---

## 🗄️ SUPABASE (Base de Datos)

### Crear Proyecto
- [ ] Cuenta creada en supabase.com
- [ ] Proyecto nuevo creado
- [ ] Contraseña de BD guardada en lugar seguro
- [ ] Región seleccionada: South America (São Paulo)

### Configurar Base de Datos
- [ ] Archivo `supabase-schema.sql` copiado
- [ ] Script ejecutado en SQL Editor
- [ ] Mensaje "Success" recibido
- [ ] Tablas verificadas en Table Editor

### Importar Datos
- [ ] Archivo Excel convertido a CSV
- [ ] CSV importado en tabla `productos`
- [ ] Productos visibles en la tabla
- [ ] Total de productos verificado: ______ productos

### Obtener Credenciales
- [ ] Project URL copiada: `https://____________.supabase.co`
- [ ] anon public key copiada: `eyJ...`
- [ ] Credenciales guardadas en documento seguro

---

## 🤖 ANTHROPIC (IA para WhatsApp)

- [ ] Cuenta creada en console.anthropic.com
- [ ] API Key generada
- [ ] API Key guardada: `sk-ant-...`
- [ ] ⚠️ Verificado que se guardó (solo se muestra una vez)

---

## 🚀 VERCEL (Hosting)

### Crear Cuenta
- [ ] Cuenta creada en vercel.com
- [ ] Conectada con GitHub (opcional pero recomendado)

### Subir Proyecto
- [ ] Repositorio creado (si usas GitHub)
- [ ] Archivos del proyecto subidos
- [ ] O proyecto importado directamente a Vercel

### Variables de Entorno
- [ ] VITE_SUPABASE_URL configurada
- [ ] VITE_SUPABASE_ANON_KEY configurada
- [ ] VITE_ANTHROPIC_API_KEY configurada

### Deploy
- [ ] Deploy ejecutado
- [ ] Build completado exitosamente
- [ ] URL de producción recibida: `https://____________.vercel.app`
- [ ] Sitio accesible desde navegador

---

## 👤 PRIMER USUARIO

- [ ] Formulario de registro completado
- [ ] Nombre ingresado
- [ ] Email ingresado
- [ ] Teléfono ingresado
- [ ] Rol seleccionado: **admin**
- [ ] Contraseña creada (mínimo 6 caracteres)
- [ ] Cuenta creada exitosamente
- [ ] Dashboard visible

---

## ✅ VERIFICACIÓN FUNCIONAL

### Login y Autenticación
- [ ] Puedo cerrar sesión
- [ ] Puedo volver a iniciar sesión
- [ ] Dashboard carga correctamente

### Módulo de Clientes
- [ ] Puedo ver la sección "Gestión de Clientes"
- [ ] Puedo crear un cliente de prueba
- [ ] Cliente aparece en la lista
- [ ] Puedo abrir el chat del cliente

### Módulo de Ventas
- [ ] Puedo ver la sección "Gestión de Ventas"
- [ ] Funnel de ventas se muestra correctamente
- [ ] Puedo ver las 5 columnas de estado
- [ ] Estadísticas se muestran en la parte superior

### Módulo de Pedidos
- [ ] Puedo ver la sección "Gestión de Pedidos"
- [ ] WMS se muestra correctamente
- [ ] (Normal si está vacío al inicio)

### Base de Datos
- [ ] Productos cargados (verificar en Supabase Table Editor)
- [ ] Total de productos: ______ 
- [ ] Al menos 3 productos tienen imagen (URL_IMAGEN no vacía)
- [ ] Precios están correctos

---

## 🔧 CONFIGURACIONES OPCIONALES

### WhatsApp Real (Twilio)
- [ ] Cuenta creada en twilio.com
- [ ] Número de WhatsApp obtenido
- [ ] Credenciales configuradas
- [ ] Webhook configurado
- [ ] Mensaje de prueba enviado
- [ ] Respuesta de IA recibida

### Pagos (Stripe)
- [ ] Cuenta creada en stripe.com
- [ ] Modo Test activado
- [ ] API Key obtenida
- [ ] Variable de entorno agregada
- [ ] Configuración habilitada en BD
- [ ] Link de pago de prueba generado

### Envíos (Envia.com)
- [ ] Cuenta creada en envia.com
- [ ] API Key obtenida
- [ ] Variable de entorno agregada
- [ ] Configuración habilitada en BD

---

## 📱 PRUEBAS DE USUARIO

### Crear Venta de Prueba
- [ ] Cliente de prueba creado
- [ ] Productos seleccionados
- [ ] Dirección ingresada
- [ ] Total calculado correctamente
- [ ] Venta visible en funnel

### Mover en Funnel
- [ ] Puedo mover venta de "Mensaje Recibido" a "Cotizando"
- [ ] Puedo mover a "Pendiente de Pago"
- [ ] Puedo mover a "Pedido Pendiente"
- [ ] Pedido aparece en módulo de Almacén

### Completar Pedido
- [ ] Pedido visible en módulo de Pedidos
- [ ] Puedo ver detalles del pedido
- [ ] SKUs se muestran correctamente
- [ ] Cantidades correctas
- [ ] Puedo marcar como completado

---

## 🔐 SEGURIDAD

### Credenciales
- [ ] Todas las API keys guardadas en lugar seguro
- [ ] Contraseñas no compartidas
- [ ] Variables de entorno no expuestas en código
- [ ] Archivo `.env` en `.gitignore`

### Accesos
- [ ] Solo personas autorizadas tienen acceso a Supabase
- [ ] Solo personas autorizadas tienen acceso a Vercel
- [ ] Contraseñas complejas usadas
- [ ] 2FA habilitado donde sea posible

---

## 📊 MONITOREO

### Vercel
- [ ] Dashboard de Vercel accesible
- [ ] Function logs revisables
- [ ] Analytics habilitado (opcional)

### Supabase
- [ ] Dashboard de Supabase accesible
- [ ] Logs de BD disponibles
- [ ] Backup automático verificado

---

## 📚 DOCUMENTACIÓN

- [ ] README.md leído
- [ ] GUIA-INSTALACION-SIMPLE.md consultada
- [ ] ARQUITECTURA.md revisada (para técnicos)
- [ ] Equipo capacitado en uso básico del sistema

---

## 🎯 LANZAMIENTO

### Pre-Lanzamiento
- [ ] Todos los checkpoints anteriores completados
- [ ] Datos de producción cargados (reemplazar datos de prueba)
- [ ] Backup de datos realizado
- [ ] Plan de rollback definido

### Día del Lanzamiento
- [ ] Equipo de ventas capacitado
- [ ] Equipo de almacén capacitado
- [ ] Usuarios creados para todo el equipo
- [ ] Proceso de soporte definido
- [ ] Monitoreo activo durante las primeras 24h

### Post-Lanzamiento
- [ ] Revisar logs de errores (día 1)
- [ ] Recolectar feedback del equipo (semana 1)
- [ ] Verificar métricas de uso (semana 1)
- [ ] Ajustes necesarios implementados (semana 2)

---

## 💰 COSTOS VERIFICADOS

### Servicios Activos
- [ ] Supabase: Plan ________ ($______/mes)
- [ ] Vercel: Plan ________ ($______/mes)
- [ ] Anthropic: Uso estimado ($______/mes)
- [ ] Twilio WhatsApp (opcional): ($______/mes)
- [ ] Stripe (opcional): Solo % de transacciones
- [ ] Envia.com (opcional): Por envío

### Total Estimado
- [ ] Costo mensual total estimado: $________ USD
- [ ] Presupuesto aprobado
- [ ] Método de pago configurado

---

## 🆘 SOPORTE

### Contactos de Emergencia
- [ ] Soporte Supabase: support.supabase.com
- [ ] Soporte Vercel: vercel.com/support
- [ ] Documentación revisada: README.md en el proyecto

### Plan B
- [ ] Backup de datos descargado
- [ ] Proceso de restauración documentado
- [ ] Equipo técnico de soporte identificado

---

## ✨ SIGUIENTE NIVEL

Una vez que el sistema esté funcionando bien:

- [ ] Configurar reportes automáticos
- [ ] Implementar más automatizaciones
- [ ] Expandir catálogo de productos
- [ ] Integrar más canales de venta
- [ ] Capacitar a más usuarios

---

## 📝 NOTAS ADICIONALES

Usa este espacio para notas específicas de tu implementación:

```
______________________________________________________________________

______________________________________________________________________

______________________________________________________________________

______________________________________________________________________
```

---

## ✅ FIRMA DE APROBACIÓN

**Proyecto revisado por:**

Nombre: _________________________________

Fecha: __________________________________

Firma: __________________________________

---

**¡Éxito con tu CRM/ERP! 🚀**
