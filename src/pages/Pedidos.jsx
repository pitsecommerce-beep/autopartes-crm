import { useState, useEffect } from 'react'
import { salesService } from '../services/salesService'
import { 
  Package as PackageIcon, 
  MapPin, 
  CheckCircle, 
  Truck,
  Search,
  Filter,
  Printer,
  Navigation
} from 'lucide-react'

export default function Pedidos() {
  const [pedidos, setPedidos] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedPedido, setSelectedPedido] = useState(null)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    loadPedidos()
  }, [])

  const loadPedidos = async () => {
    try {
      // Cargar solo ventas en estado "Pedido Pendiente"
      const data = await salesService.getAll({ estado: 'Pedido Pendiente' })
      setPedidos(data)
    } catch (error) {
      console.error('Error cargando pedidos:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleMarcarSurtido = async (pedidoId) => {
    try {
      await salesService.updateStatus(pedidoId, 'Completado')
      await loadPedidos()
      setShowModal(false)
      alert('Pedido marcado como completado')
    } catch (error) {
      alert('Error marcando pedido: ' + error.message)
    }
  }

  const handleVerDetalle = (pedido) => {
    setSelectedPedido(pedido)
    setShowModal(true)
  }

  const filteredPedidos = pedidos.filter(pedido =>
    pedido.numero_venta?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pedido.clientes?.nombre?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Gestión de Pedidos</h2>
        <p className="text-gray-600 mt-1">WMS • Almacén • Despacho</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Pedidos Pendientes</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{pedidos.length}</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <PackageIcon className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Piezas a Surtir</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                {pedidos.reduce((sum, p) => 
                  sum + (p.items_venta?.reduce((s, i) => s + i.cantidad, 0) || 0), 0
                )}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Para Envío</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                {pedidos.filter(p => p.direccion_envio).length}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Truck className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Búsqueda */}
      <div className="card">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar por número de venta o cliente..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-10 w-full"
          />
        </div>
      </div>

      {/* Lista de Pedidos */}
      <div className="card">
        {loading ? (
          <div className="text-center py-12 text-gray-500">
            Cargando pedidos...
          </div>
        ) : filteredPedidos.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <PackageIcon className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <p className="text-lg font-medium">No hay pedidos pendientes</p>
            <p className="text-sm mt-1">Los pedidos aparecerán aquí cuando se confirmen pagos</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Orden
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cliente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Items
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dirección
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPedidos.map((pedido) => (
                  <tr key={pedido.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-primary-100 rounded-lg flex items-center justify-center">
                          <PackageIcon className="h-5 w-5 text-primary-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {pedido.numero_venta}
                          </div>
                          <div className="text-sm text-gray-500">
                            {new Date(pedido.created_at).toLocaleDateString('es-MX')}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {pedido.clientes?.nombre}
                      </div>
                      <div className="text-sm text-gray-500">
                        {pedido.clientes?.telefono}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {pedido.items_venta?.length || 0} productos
                      </div>
                      <div className="text-sm text-gray-500">
                        {pedido.items_venta?.reduce((sum, item) => sum + item.cantidad, 0) || 0} piezas
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate">
                        {pedido.direccion_envio || 'No especificada'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900">
                        ${pedido.total?.toLocaleString('es-MX')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleVerDetalle(pedido)}
                        className="text-primary-600 hover:text-primary-900 mr-4"
                      >
                        Ver Detalle
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal de Detalle del Pedido */}
      {showModal && selectedPedido && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    {selectedPedido.numero_venta}
                  </h3>
                  <p className="text-gray-600 mt-1">
                    {selectedPedido.clientes?.nombre} • {selectedPedido.clientes?.telefono}
                  </p>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ✕
                </button>
              </div>

              {/* Dirección de Envío */}
              {selectedPedido.direccion_envio && (
                <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-1">Dirección de Envío</h4>
                      <p className="text-gray-700">{selectedPedido.direccion_envio}</p>
                    </div>
                    <button className="btn-secondary text-sm flex items-center gap-2">
                      <Navigation className="w-4 h-4" />
                      Abrir en Maps
                    </button>
                  </div>
                </div>
              )}

              {/* Lista de Picking */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <PackageIcon className="w-5 h-5" />
                  Lista de Surtido
                </h4>
                <div className="space-y-3">
                  {selectedPedido.items_venta?.map((item, idx) => (
                    <div key={idx} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex items-center gap-4">
                        {item.productos?.url_imagen && (
                          <img 
                            src={item.productos.url_imagen} 
                            alt={item.productos.descripcion}
                            className="w-20 h-20 object-cover rounded border border-gray-200"
                          />
                        )}
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="font-semibold text-gray-900 text-lg">
                                SKU: {item.producto_sku}
                              </p>
                              <p className="text-gray-700 mt-1">{item.productos?.descripcion}</p>
                            </div>
                            <div className="text-right">
                              <span className="inline-flex items-center px-4 py-2 rounded-full text-2xl font-bold bg-primary-100 text-primary-800">
                                x{item.cantidad}
                              </span>
                            </div>
                          </div>
                          <div className="mt-2 flex gap-4 text-sm text-gray-600">
                            {item.productos?.marca && (
                              <span>Marca: {item.productos.marca}</span>
                            )}
                            {item.productos?.modelo && (
                              <span>Modelo: {item.productos.modelo}</span>
                            )}
                            {item.productos?.parte && (
                              <span>Parte: {item.productos.parte}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Resumen */}
              <div className="border-t border-gray-200 pt-4 mb-6">
                <div className="flex justify-between items-center text-lg">
                  <span className="font-semibold text-gray-900">Total del Pedido</span>
                  <span className="text-2xl font-bold text-gray-900">
                    ${selectedPedido.total?.toLocaleString('es-MX')}
                  </span>
                </div>
              </div>

              {/* Acciones */}
              <div className="flex gap-3">
                <button
                  onClick={() => window.print()}
                  className="btn-secondary flex items-center gap-2"
                >
                  <Printer className="w-5 h-5" />
                  Imprimir Lista
                </button>
                <button
                  onClick={() => handleMarcarSurtido(selectedPedido.id)}
                  className="btn-primary flex items-center gap-2 flex-1"
                >
                  <CheckCircle className="w-5 h-5" />
                  Marcar como Surtido
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="btn-secondary"
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
