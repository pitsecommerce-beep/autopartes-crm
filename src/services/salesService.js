import { supabase } from './supabase'

export const salesService = {
  // Crear nueva venta
  async create(venta) {
    const { data, error } = await supabase
      .from('ventas')
      .insert({
        cliente_id: venta.cliente_id,
        vendedor_id: venta.vendedor_id,
        total: venta.total,
        estado: 'Mensaje Recibido',
        direccion_envio: venta.direccion_envio,
        metadata: venta.metadata
      })
      .select()
      .single()
    
    if (error) throw error
    
    // Insertar items de la venta
    if (venta.items && venta.items.length > 0) {
      const items = venta.items.map(item => ({
        venta_id: data.id,
        producto_sku: item.sku,
        cantidad: item.cantidad,
        precio_unitario: item.precio_unitario,
        subtotal: item.cantidad * item.precio_unitario
      }))
      
      const { error: itemsError } = await supabase
        .from('items_venta')
        .insert(items)
      
      if (itemsError) throw itemsError
    }
    
    return data
  },

  // Obtener todas las ventas con filtros
  async getAll(filters = {}) {
    let query = supabase
      .from('ventas')
      .select(`
        *,
        clientes (nombre, telefono, email),
        usuarios!vendedor_id (nombre, email),
        items_venta (
          *,
          productos (sku, descripcion, url_imagen)
        )
      `)
    
    if (filters.estado) {
      query = query.eq('estado', filters.estado)
    }
    
    if (filters.vendedor_id) {
      query = query.eq('vendedor_id', filters.vendedor_id)
    }
    
    if (filters.fecha_desde) {
      query = query.gte('created_at', filters.fecha_desde)
    }
    
    if (filters.fecha_hasta) {
      query = query.lte('created_at', filters.fecha_hasta)
    }
    
    const { data, error } = await query.order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  // Obtener venta por ID
  async getById(id) {
    const { data, error } = await supabase
      .from('ventas')
      .select(`
        *,
        clientes (*),
        usuarios!vendedor_id (*),
        items_venta (
          *,
          productos (*)
        )
      `)
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  },

  // Actualizar estado de venta
  async updateStatus(id, nuevoEstado, metadata = {}) {
    const { data, error } = await supabase
      .from('ventas')
      .update({ 
        estado: nuevoEstado,
        metadata: metadata,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Generar número de venta único
  async generateSaleNumber() {
    const { count } = await supabase
      .from('ventas')
      .select('*', { count: 'exact', head: true })
    
    const saleNumber = `VTA-${String(count + 1).padStart(6, '0')}`
    return saleNumber
  },

  // Asociar pago de Stripe
  async attachStripePayment(ventaId, stripePaymentId, stripeData) {
    const { data, error } = await supabase
      .from('ventas')
      .update({
        stripe_payment_id: stripePaymentId,
        stripe_payment_data: stripeData,
        estado: 'Pedido Pendiente',
        fecha_pago: new Date().toISOString()
      })
      .eq('id', ventaId)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Obtener estadísticas de ventas
  async getStats(filters = {}) {
    const { data, error } = await supabase
      .rpc('get_sales_stats', filters)
    
    if (error) throw error
    return data
  },

  // Obtener ventas por vendedor
  async getBySeller(vendedorId) {
    return this.getAll({ vendedor_id: vendedorId })
  }
}
