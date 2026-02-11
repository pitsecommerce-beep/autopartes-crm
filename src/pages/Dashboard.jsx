import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { 
  Users, 
  TrendingUp, 
  Package, 
  Menu, 
  X, 
  LogOut,
  Settings,
  MessageSquare
} from 'lucide-react'

import Clientes from './Clientes'
import Ventas from './Ventas'
import Pedidos from './Pedidos'

export default function Dashboard() {
  const [activeSection, setActiveSection] = useState('clientes')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const { user, profile, signOut } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await signOut()
      navigate('/login')
    } catch (error) {
      console.error('Error al cerrar sesión:', error)
    }
  }

  const sections = [
    { id: 'clientes', name: 'Gestión de Clientes', icon: Users, roles: ['admin', 'gerente', 'vendedor'] },
    { id: 'ventas', name: 'Gestión de Ventas', icon: TrendingUp, roles: ['admin', 'gerente', 'vendedor'] },
    { id: 'pedidos', name: 'Gestión de Pedidos', icon: Package, roles: ['admin', 'gerente', 'almacen'] },
  ]

  const availableSections = sections.filter(section => 
    section.roles.includes(profile?.rol || 'vendedor')
  )

  const renderSection = () => {
    switch (activeSection) {
      case 'clientes':
        return <Clientes />
      case 'ventas':
        return <Ventas />
      case 'pedidos':
        return <Pedidos />
      default:
        return <Clientes />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden text-gray-600 hover:text-gray-900"
            >
              {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-primary-600" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">AutoPartes CRM</h1>
                <p className="text-sm text-gray-500">{profile?.rol || 'Usuario'}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{profile?.nombre}</p>
                <p className="text-xs text-gray-500">{profile?.email}</p>
              </div>
              <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center text-white font-semibold">
                {profile?.nombre?.charAt(0).toUpperCase() || 'U'}
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="text-gray-600 hover:text-gray-900 p-2 rounded-lg hover:bg-gray-100"
              title="Cerrar sesión"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          fixed lg:static lg:translate-x-0
          z-30 w-64 bg-white border-r border-gray-200 h-[calc(100vh-73px)]
          transition-transform duration-300 ease-in-out
        `}>
          <nav className="p-4 space-y-2">
            {availableSections.map((section) => {
              const Icon = section.icon
              return (
                <button
                  key={section.id}
                  onClick={() => {
                    setActiveSection(section.id)
                    if (window.innerWidth < 1024) {
                      setSidebarOpen(false)
                    }
                  }}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors
                    ${activeSection === section.id
                      ? 'bg-primary-50 text-primary-700 font-medium'
                      : 'text-gray-700 hover:bg-gray-50'
                    }
                  `}
                >
                  <Icon className="w-5 h-5" />
                  <span>{section.name}</span>
                </button>
              )
            })}
          </nav>

          {/* Footer del sidebar */}
          <div className="absolute bottom-0 w-full p-4 border-t border-gray-200">
            <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg">
              <Settings className="w-5 h-5" />
              <span>Configuración</span>
            </button>
          </div>
        </aside>

        {/* Contenido principal */}
        <main className="flex-1 p-6 lg:p-8 overflow-auto">
          {renderSection()}
        </main>
      </div>

      {/* Overlay para móvil */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  )
}
