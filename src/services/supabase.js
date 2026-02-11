import { createClient } from '@supabase/supabase-js'

// Estas variables se configuran en las variables de entorno
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Función helper para verificar si el usuario está autenticado
export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

// Función helper para cerrar sesión
export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}
