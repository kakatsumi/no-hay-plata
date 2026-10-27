import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL?.trim()
const publishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY?.trim()

const missing = [
  !url && 'VITE_SUPABASE_URL',
  !publishableKey && 'VITE_SUPABASE_PUBLISHABLE_KEY',
].filter(Boolean)

if (missing.length > 0) {
  throw new Error(
    `Falta configurar Supabase: ${missing.join(', ')}. Añade las variables a .env.local y reinicia Vite.`,
  )
}

// Este cliente compartido servirá para Supabase Auth y consultas a PostgreSQL.
export const supabase = createClient(url as string, publishableKey as string)
