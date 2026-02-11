import { useState, useEffect } from 'react'
import { salesService } from '../services/salesService'
import { stripeService } from '../services/stripeService'
import { 
  TrendingUp, 
  DollarSign, 
  Clock, 
  CheckCircle,
  Search,
  Filter,
  Eye,
  CreditCard,
  Package as PackageIcon
} from 'lucide-react'

const ESTADOS = [
  { id: 'Mensaje Recibido', color: 'bg-blue-500', label: 'Mensaje Recibido' },
  { id: 'Cotizando', color: 'bg-yellow-500', label: 'Cotizando' },
  { id: 'Pendiente de Pago', color: 'bg-orange-500', label: 'Pendiente de Pago' },
  { id: 'Pedido Pendiente', color: 'bg-green-500', label: 'Pedido Pendiente' },
  { id: 'Completado', color: 'bg-gray-500', label: 'Completado' }
]

export default function Ventas() {
  const [ventas, setVentas] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedEstado, setSelectedEstado] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedVenta, setSelectedVenta] = useState(null)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    loadVentas()
  }, [selectedEstado])

  const loadVentas = async () => {
    try {
      const filters = selectedEstado !== 'all' ? { estado: selectedEstado } : {}
      const data = await salesService.getAll(filters)
      setVentas(data)
    } catch (error) {
      console.error('Error cargando ventas:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleVerDetalle = (venta) => {
    setSelectedVenta(venta)
    setShowModal(true)
  }

  const handleGenerarPagoStripe = async (venta) => {
    try {
      const { url } = await stripeService.createPaymentLink(venta)
      alert(`Link de pago generado:\n${url}`)
      await loadVentas()
    } catch (error) {
      alert('Error generando link de pago: ' + error.message)
    }
  }

  const handleActualizarEstado = async (ventaId, nuevoEstado) => {
    try {
      await salesService.updateStatus(ventaId, nuevoEstado)
      await loadVentas()
      setShowModal(false)
    } catch (error) {
      alert('Error actualizando estado: ' + error.message)
    }
  }

  // Estadísticas
  const stats = {
    total: ventas.reduce((sum, v) => sum + (v.total || 0), 0),
    pendientes: ventas.filter(v => v.estado === 'Pendiente de Pago').length,
    completadas: ventas.filter(v => v.estado === 'Completado').length,
    promedio: ventas.length > 0 ? ventas.reduce((sum, v) => sum + v.total, 0) / ventas.length : 0
  }

  const filteredVentas = ventas.filter(venta =>
    venta.clientes?.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    venta.numero_venta?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Gestión de Ventas</h2>
        <p className="text-gray-600 mt-1">Funnel de ventas • Seguimiento • Pagos</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Ventas Totales</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                ${stats.total.toLocaleString('es-MX')}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Pendientes de Pago</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{stats.pendientes}</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Completadas</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{stats.completadas}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Ticket Promedio</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                ${stats.promedio.toLocaleString('es-MX', { maximumFractionDigits: 0 })}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="card">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar por cliente o número de venta..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10 w-full"
            />
          </div>
          <select
            value={selectedEstado}
            onChange={(e) => setSelectedEstado(e.target.value)}
            className="input-field w-full sm:w-64"
          >
            <option value="all">Todos los estados</option>
            {ESTADOS.map(estado => (
              <option key={estado.id} value={estado.id}>{estado.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Funnel Visual - Columnas por Estado */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {ESTADOS.map((estado) => {
          const ventasEstado = filteredVentas.filter(v => v.estado === estado.id)
          return (
            <div key={estado.id} className="space-y-3">
              <div className={`${estado.color} text-white px-4 py-2 rounded-lg`}>
                <h3 className="font-semibold text-sm">{estado.label}</h3>
                <p className="text-xs mt-1">{ventasEstado.length} ventas</p>
              </div>
              
              <div className="space-y-2">
                {ventasEstado.map((venta) => (
                  <div
                    key={venta.id}
                    className="card cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => handleVerDetalle(venta)}
                  >
                    <div className="space-y-2">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900 text-sm">
                            {venta.clientes?.nombre || 'Sin nombre'}
                          </p>
                          <p className="text-xs text-gray-500">{venta.numero_venta}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                        <span className="text-lg font-bold text-gray-900">
                          ${venta.total?.toLocaleString('es-MX') || '0'}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleVerDetalle(venta)
                          }}
                          className="text-primary-600 hover:text-primary-700"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {/* Modal de Detalle */}
      {showModal && selectedVenta && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Header del modal */}
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {selectedVenta.numero_venta}
                  </h3>
                  <p className="text-gray-600 mt-1">
                    {selectedVenta.clientes?.nombre} • {selectedVenta.clientes?.telefono}
                  </p>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              {/* Estado actual */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estado Actual
                </label>
                <select
                  value={selectedVenta.estado}
                  onChange={(e) => handleActualizarEstado(selectedVenta.id, e.target.value)}
                  className="input-field"
                >
                  {ESTADOS.map(estado => (
                    <option key={estado.id} value={estado.id}>{estado.label}</option>
                  ))}
                </select>
              </div>

              {/* Items de la venta */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">Productos</h4>
                <div className="space-y-2">
                  {selectedVenta.items_venta?.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                      {item.productos?.url_imagen && (
                        <img 
                          src={item.productos.url_imagen} 
                          alt={item.productos.descripcion}
                          className="w-16 h-16 object-cover rounded"
                        />
                      )}
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{item.productos?.descripcion}</p>
                        <p className="text-sm text-gray-600">SKU: {item.producto_sku}</p>
                        <p className="text-sm text-gray-600">Cantidad: {item.cantidad}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">
                          ${item.subtotal?.toLocaleString('es-MX')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total */}
              <div className="border-t border-gray-200 pt-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-900">Total</span>
                  <span className="text-2xl font-bold text-gray-900">
                    ${selectedVenta.total?.toLocaleString('es-MX')}
                  </span>
                </div>
              </div>

              {/* Dirección de envío */}
              {selectedVenta.direccion_envio && (
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-2">Dirección de Envío</h4>
                  <p className="text-gray-700">{selectedVenta.direccion_envio}</p>
                </div>
              )}

              {/* Acciones */}
              <div className="flex gap-3">
                {selectedVenta.estado === 'Cotizando' && (
                  <button
                    onClick={() => handleGenerarPagoStripe(selectedVenta)}
                    className="btn-primary flex items-center gap-2 flex-1"
                  >
                    <CreditCard className="w-5 h-5" />
                    Generar Link de Pago
                  </button>
                )}
                <button
                  onClick={() => setShowModal(false)}
                  className="btn-secondary flex-1"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
