import { supabase } from './supabase'

export const productService = {
  // Obtener todos los productos
  async getAll() {
    const { data, error } = await supabase
      .from('productos')
      .select('*')
      .order('sku', { ascending: true })
    
    if (error) throw error
    return data
  },

  // Buscar productos por término de búsqueda
  async search(searchTerm) {
    const { data, error } = await supabase
      .from('productos')
      .select('*')
      .or(`sku.ilike.%${searchTerm}%,descripcion.ilike.%${searchTerm}%,marca.ilike.%${searchTerm}%,modelo.ilike.%${searchTerm}%,parte.ilike.%${searchTerm}%`)
      .limit(50)
    
    if (error) throw error
    return data
  },

  // Obtener producto por SKU
  async getBySKU(sku) {
    const { data, error } = await supabase
      .from('productos')
      .select('*')
      .eq('sku', sku)
      .single()
    
    if (error) throw error
    return data
  },

  // Verificar existencias totales
  async checkStock(sku) {
    const product = await this.getBySKU(sku)
    const totalStock = (product.existencia_cdmx || 0) + 
                      (product.existencia_tulti || 0) + 
                      (product.existencia_foranea || 0)
    
    return {
      sku: product.sku,
      totalStock,
      locations: {
        cdmx: product.existencia_cdmx,
        tulti: product.existencia_tulti,
        foranea: product.existencia_foranea
      }
    }
  },

  // Actualizar existencias
  async updateStock(sku, location, quantity) {
    const field = `existencia_${location.toLowerCase()}`
    const { data, error } = await supabase
      .from('productos')
      .update({ [field]: quantity })
      .eq('sku', sku)
      .select()
    
    if (error) throw error
    return data
  },

  // Cargar productos desde archivo Excel (admin)
  async bulkImport(productos) {
    const { data, error } = await supabase
      .from('productos')
      .upsert(productos, { onConflict: 'sku' })
    
    if (error) throw error
    return data
  }
}
