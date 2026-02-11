import { supabase } from './supabase'

export const stripeService = {
  // Verificar si Stripe está configurado
  isEnabled() {
    const { data } = supabase
      .from('configuracion')
      .select('valor')
      .eq('clave', 'stripe_enabled')
      .single()
    
    return data?.valor === 'true'
  },

  // Crear link de pago para una venta
  async createPaymentLink(venta) {
    try {
      const { data: config } = await supabase
        .from('configuracion')
        .select('valor')
        .eq('clave', 'stripe_secret_key')
        .single()
      
      if (!config) {
        throw new Error('Stripe no está configurado')
      }

      // Llamada al backend serverless function para crear el checkout
      const response = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ventaId: venta.id,
          numeroVenta: venta.numero_venta,
          total: venta.total,
          items: venta.items_venta,
          metadata: {
            venta_id: venta.id,
            cliente_id: venta.cliente_id
          }
        })
      })

      const result = await response.json()
      
      if (!result.success) {
        throw new Error(result.error)
      }

      // Actualizar venta con el payment link
      await supabase
        .from('ventas')
        .update({
          stripe_checkout_url: result.url,
          stripe_checkout_id: result.sessionId,
          estado: 'Pendiente de Pago'
        })
        .eq('id', venta.id)

      return {
        url: result.url,
        sessionId: result.sessionId
      }
    } catch (error) {
      console.error('Error creando link de pago:', error)
      throw error
    }
  },

  // Verificar estado de pago
  async checkPaymentStatus(ventaId) {
    try {
      const { data: venta } = await supabase
        .from('ventas')
        .select('stripe_checkout_id, stripe_payment_id')
        .eq('id', ventaId)
        .single()

      if (!venta.stripe_checkout_id) {
        return { paid: false, status: 'no_checkout' }
      }

      // Llamar al backend para verificar el estado
      const response = await fetch(`/api/check-payment?session_id=${venta.stripe_checkout_id}`)
      const result = await response.json()

      if (result.paid) {
        // Actualizar estado de la venta
        await supabase
          .from('ventas')
          .update({
            estado: 'Pedido Pendiente',
            fecha_pago: new Date().toISOString(),
            stripe_payment_id: result.payment_intent_id
          })
          .eq('id', ventaId)
      }

      return result
    } catch (error) {
      console.error('Error verificando pago:', error)
      throw error
    }
  },

  // Webhook handler (para el backend)
  async handleWebhook(event) {
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object
        
        // Actualizar venta
        await supabase
          .from('ventas')
          .update({
            estado: 'Pedido Pendiente',
            fecha_pago: new Date().toISOString(),
            stripe_payment_id: session.payment_intent
          })
          .eq('stripe_checkout_id', session.id)
        break

      case 'payment_intent.succeeded':
        // Confirmar pago exitoso
        console.log('Pago confirmado:', event.data.object.id)
        break

      default:
        console.log('Evento no manejado:', event.type)
    }
  }
}
