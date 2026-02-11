import { useState, useEffect } from 'react'
import { customerService } from '../services/customerService'
import { whatsappService } from '../services/whatsappService'
import { 
  Search, 
  MessageSquare, 
  Phone, 
  Mail, 
  ShoppingBag,
  Calendar,
  Filter,
  Plus,
  Send
} from 'lucide-react'

export default function Clientes() {
  const [clientes, setClientes] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCliente, setSelectedCliente] = useState(null)
  const [conversacion, setConversacion] = useState([])
  const [nuevoMensaje, setNuevoMensaje] = useState('')

  useEffect(() => {
    loadClientes()
  }, [])

  const loadClientes = async () => {
    try {
      const data = await customerService.getAll()
      setClientes(data)
    } catch (error) {
      console.error('Error cargando clientes:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadConversacion = async (clienteId) => {
    try {
      const mensajes = await whatsappService.getConversationHistory(clienteId)
      setConversacion(mensajes)
    } catch (error) {
      console.error('Error cargando conversación:', error)
    }
  }

  const handleSelectCliente = async (cliente) => {
    setSelectedCliente(cliente)
    await loadConversacion(cliente.id)
  }

  const handleEnviarMensaje = async () => {
    if (!nuevoMensaje.trim() || !selectedCliente) return

    try {
      await whatsappService.sendMessage(
        selectedCliente.telefono,
        nuevoMensaje
      )
      setNuevoMensaje('')
      await loadConversacion(selectedCliente.id)
    } catch (error) {
      console.error('Error enviando mensaje:', error)
    }
  }

  const filteredClientes = clientes.filter(cliente =>
    cliente.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cliente.telefono?.includes(searchTerm) ||
    cliente.email?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestión de Clientes</h2>
          <p className="text-gray-600 mt-1">WhatsApp IA • CRM • Automatización</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Nuevo Cliente
        </button>
      </div>

      {/* Stats rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Clientes</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{clientes.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <ShoppingBag className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Conversaciones Activas</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                {clientes.filter(c => c.estado === 'activo').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Mensajes Hoy</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">0</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Send className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Vista principal: Lista de clientes + Chat */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lista de Clientes */}
        <div className="lg:col-span-1">
          <div className="card h-[600px] flex flex-col">
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Buscar cliente..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-field pl-10"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2">
              {loading ? (
                <div className="text-center py-8 text-gray-500">
                  Cargando clientes...
                </div>
              ) : filteredClientes.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No se encontraron clientes
                </div>
              ) : (
                filteredClientes.map((cliente) => (
                  <button
                    key={cliente.id}
                    onClick={() => handleSelectCliente(cliente)}
                    className={`
                      w-full text-left p-4 rounded-lg border transition-all
                      ${selectedCliente?.id === cliente.id
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }
                    `}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{cliente.nombre}</h4>
                        <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
                          <Phone className="w-4 h-4" />
                          {cliente.telefono}
                        </div>
                        {cliente.email && (
                          <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
                            <Mail className="w-4 h-4" />
                            {cliente.email}
                          </div>
                        )}
                      </div>
                      <span className={`badge ${
                        cliente.estado === 'activo' ? 'badge-success' : 'badge-warning'
                      }`}>
                        {cliente.estado}
                      </span>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Chat de WhatsApp */}
        <div className="lg:col-span-2">
          <div className="card h-[600px] flex flex-col">
            {selectedCliente ? (
              <>
                {/* Header del chat */}
                <div className="border-b border-gray-200 pb-4 mb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">{selectedCliente.nombre}</h3>
                      <p className="text-sm text-gray-600">{selectedCliente.telefono}</p>
                    </div>
                    <button className="btn-secondary text-sm">
                      Ver Historial Compras
                    </button>
                  </div>
                </div>

                {/* Mensajes */}
                <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                  {conversacion.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                      <MessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                      <p>No hay mensajes aún</p>
                      <p className="text-sm mt-1">Inicia la conversación enviando un mensaje</p>
                    </div>
                  ) : (
                    conversacion.map((mensaje, idx) => (
                      <div
                        key={idx}
                        className={`flex ${mensaje.direccion === 'saliente' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`
                          max-w-[70%] rounded-lg px-4 py-2
                          ${mensaje.direccion === 'saliente'
                            ? 'bg-primary-500 text-white'
                            : 'bg-gray-100 text-gray-900'
                          }
                        `}>
                          <p className="text-sm">{mensaje.mensaje}</p>
                          {mensaje.media_url && (
                            <img 
                              src={mensaje.media_url} 
                              alt="Imagen adjunta" 
                              className="mt-2 rounded max-w-full"
                            />
                          )}
                          <p className="text-xs mt-1 opacity-70">
                            {new Date(mensaje.created_at).toLocaleTimeString('es-MX', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Input de mensaje */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={nuevoMensaje}
                    onChange={(e) => setNuevoMensaje(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleEnviarMensaje()}
                    placeholder="Escribe un mensaje..."
                    className="input-field flex-1"
                  />
                  <button
                    onClick={handleEnviarMensaje}
                    className="btn-primary flex items-center gap-2"
                  >
                    <Send className="w-5 h-5" />
                    Enviar
                  </button>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <p>Selecciona un cliente para ver la conversación</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
