import { supabase } from './supabase'

export const customerService = {
  // Obtener todos los clientes
  async getAll() {
    const { data, error } = await supabase
      .from('clientes')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  // Crear o actualizar cliente
  async upsert(cliente) {
    const { data, error } = await supabase
      .from('clientes')
      .upsert(cliente, { onConflict: 'telefono' })
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Obtener cliente por teléfono
  async getByPhone(telefono) {
    const { data, error } = await supabase
      .from('clientes')
      .select('*')
      .eq('telefono', telefono)
      .single()
    
    if (error) {
      if (error.code === 'PGRST116') return null // No encontrado
      throw error
    }
    return data
  },

  // Obtener historial de compras del cliente
  async getPurchaseHistory(clienteId) {
    const { data, error } = await supabase
      .from('ventas')
      .select(`
        *,
        items_venta (
          *,
          productos (*)
        )
      `)
      .eq('cliente_id', clienteId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  // Obtener estadísticas del cliente
  async getStats(clienteId) {
    const { data, error } = await supabase
      .rpc('get_customer_stats', { customer_id: clienteId })
    
    if (error) throw error
    return data
  },

  // Actualizar información del cliente
  async update(id, updates) {
    const { data, error } = await supabase
      .from('clientes')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  }
}
