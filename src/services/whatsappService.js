import { supabase } from './supabase'
import { productService } from './productService'
import { customerService } from './customerService'
import { salesService } from './salesService'

export const whatsappService = {
  // Procesar mensaje entrante de WhatsApp
  async processIncomingMessage(from, message, messageId) {
    try {
      // 1. Obtener o crear cliente
      const cliente = await customerService.getByPhone(from) || 
                     await customerService.upsert({
                       telefono: from,
                       nombre: 'Cliente ' + from.slice(-4),
                       estado: 'activo'
                     })
      
      // 2. Guardar mensaje en historial
      await this.saveMessage({
        cliente_id: cliente.id,
        telefono: from,
        mensaje: message,
        direccion: 'entrante',
        whatsapp_message_id: messageId,
        estado: 'recibido'
      })
      
      // 3. Generar respuesta con IA
      const response = await this.generateAIResponse(message, cliente)
      
      // 4. Si la respuesta incluye acciones, ejecutarlas
      if (response.actions) {
        await this.executeActions(response.actions, cliente)
      }
      
      // 5. Enviar respuesta
      if (response.reply) {
        await this.sendMessage(from, response.reply, response.mediaUrl)
      }
      
      return response
    } catch (error) {
      console.error('Error procesando mensaje:', error)
      throw error
    }
  },

  // Generar respuesta con IA (Claude API)
  async generateAIResponse(userMessage, cliente) {
    // Obtener contexto del cliente
    const purchaseHistory = await customerService.getPurchaseHistory(cliente.id)
    
    // Preparar el prompt para Claude
    const systemPrompt = `Eres un asistente virtual experto en autopartes de colisión. Tu trabajo es:
1. Responder consultas sobre existencias, precios y especificaciones de productos
2. Ayudar a los clientes a encontrar la pieza correcta para su vehículo
3. Confirmar detalles del pedido incluyendo dirección de envío
4. Mantener un tono profesional pero amigable en español

Tienes acceso a la base de datos de productos y al historial del cliente.
Cliente: ${cliente.nombre}
Compras anteriores: ${purchaseHistory.length} pedidos

IMPORTANTE:
- Si el cliente pregunta por una pieza, busca en la base de datos
- Si hay existencias, proporciona precio y confirma con foto
- Si el cliente muestra interés en comprar, solicita su dirección de envío
- Cuando tengas todos los datos (producto + dirección), confirma el pedido`

    // Aquí iría la llamada a Claude API
    // Por ahora, simulamos la respuesta
    const response = await this.callClaudeAPI(systemPrompt, userMessage, cliente)
    
    return response
  },

  // Llamar a Claude API (placeholder - se configura después)
  async callClaudeAPI(systemPrompt, userMessage, cliente) {
    // Esta función se conectará con Anthropic API
    // Por ahora retorna una respuesta simulada para desarrollo
    
    const messageLower = userMessage.toLowerCase()
    
    // Detectar intención
    if (messageLower.includes('precio') || messageLower.includes('costo') || messageLower.includes('cuanto')) {
      return {
        reply: 'Para ayudarte con el precio, ¿podrías compartirme la marca, modelo y año de tu vehículo, y qué pieza específica necesitas? (Ej: defensa, faro, espejo, etc.)',
        actions: null
      }
    }
    
    if (messageLower.includes('disponible') || messageLower.includes('tiene') || messageLower.includes('hay')) {
      return {
        reply: 'Con gusto te ayudo a verificar disponibilidad. ¿Qué pieza buscas y para qué vehículo? (Marca, modelo, año)',
        actions: null
      }
    }
    
    // Respuesta por defecto
    return {
      reply: '¡Hola! Soy tu asistente de AutoPartes. Puedo ayudarte con:\n\n📦 Consultar existencias\n💰 Cotizar piezas\n🚗 Encontrar la refacción correcta\n📍 Coordinar entregas\n\n¿En qué puedo ayudarte hoy?',
      actions: null
    }
  },

  // Buscar productos relevantes para la consulta
  async searchRelevantProducts(query) {
    try {
      const results = await productService.search(query)
      return results
    } catch (error) {
      console.error('Error buscando productos:', error)
      return []
    }
  },

  // Ejecutar acciones derivadas de la conversación
  async executeActions(actions, cliente) {
    for (const action of actions) {
      switch (action.type) {
        case 'create_sale':
          await salesService.create({
            cliente_id: cliente.id,
            ...action.data
          })
          break
        
        case 'update_customer':
          await customerService.update(cliente.id, action.data)
          break
        
        case 'send_payment_link':
          // Se implementa cuando se active Stripe
          break
        
        default:
          console.log('Acción no reconocida:', action.type)
      }
    }
  },

  // Guardar mensaje en base de datos
  async saveMessage(messageData) {
    const { data, error } = await supabase
      .from('mensajes_whatsapp')
      .insert(messageData)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Enviar mensaje por WhatsApp (integración Twilio/Meta)
  async sendMessage(to, message, mediaUrl = null) {
    // Esta función se conectará con Twilio o Meta WhatsApp API
    // Por ahora solo guarda el mensaje como enviado
    
    await this.saveMessage({
      telefono: to,
      mensaje: message,
      direccion: 'saliente',
      estado: 'enviado',
      media_url: mediaUrl
    })
    
    return { success: true, messageId: 'mock-' + Date.now() }
  },

  // Obtener historial de conversación
  async getConversationHistory(clienteId, limit = 50) {
    const { data, error } = await supabase
      .from('mensajes_whatsapp')
      .select('*')
      .eq('cliente_id', clienteId)
      .order('created_at', { ascending: true })
      .limit(limit)
    
    if (error) throw error
    return data
  },

  // Enviar mensaje proactivo (campañas)
  async sendProactiveMessage(clienteId, mensaje, tipo = 'promocion') {
    const cliente = await customerService.getById(clienteId)
    
    await this.sendMessage(cliente.telefono, mensaje)
    
    // Registrar actividad de marketing
    await supabase
      .from('actividades_marketing')
      .insert({
        cliente_id: clienteId,
        tipo,
        mensaje,
        estado: 'enviado'
      })
  }
}
