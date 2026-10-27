import { useEffect, useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import { MenuLateral } from './componentes/MenuLateral'
import { Acceso } from './modulos/Acceso'
import { Inicio } from './modulos/Inicio'
import { PaginaProvisional } from './modulos/PaginaProvisional'
import { negocioSubsecciones, obtenerRuta, secciones } from './servicios/navegacion'
import { supabase } from './servicios/supabase'
import './estilos/app.css'

type Perfil = { userId: string; nombre: string }

function App() {
  const [ruta, setRuta] = useState(obtenerRuta)
  const [menuAbierto, setMenuAbierto] = useState(false)
  const [sesion, setSesion] = useState<Session | null | undefined>(undefined)
  const [perfil, setPerfil] = useState<Perfil | null>(null)
  const [errorPerfil, setErrorPerfil] = useState('')
  const [errorSesion, setErrorSesion] = useState('')
  const [cerrandoSesion, setCerrandoSesion] = useState(false)

  useEffect(() => {
    const actualizar = () => setRuta(obtenerRuta())
    window.addEventListener('hashchange', actualizar)
    return () => window.removeEventListener('hashchange', actualizar)
  }, [])

  useEffect(() => {
    let activo = true
    let eventoRecibido = false
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_evento, nuevaSesion) => {
      eventoRecibido = true
      if (activo) setSesion(nuevaSesion)
    })
    void supabase.auth.getSession().then(({ data, error }) => {
      if (!activo || eventoRecibido) return
      if (error) setErrorSesion('No se pudo recuperar la sesión. Inténtalo nuevamente.')
      setSesion(data.session)
    }).catch(() => {
      if (activo && !eventoRecibido) {
        setErrorSesion('No se pudo recuperar la sesión. Inténtalo nuevamente.')
        setSesion(null)
      }
    })
    return () => { activo = false; subscription.unsubscribe() }
  }, [])

  const userId = sesion?.user.id
  useEffect(() => {
    if (!userId) return
    let activo = true
    void supabase.from('perfiles').select('nombre').eq('id', userId).maybeSingle().then(({ data, error }) => {
      if (!activo) return
      if (error || !data) {
        setErrorPerfil('No se pudo cargar tu perfil. Revisa que el perfil exista y que sus permisos de lectura estén configurados en Supabase.')
        return
      }
      setPerfil({ userId, nombre: data.nombre })
      setErrorPerfil('')
    })
    return () => { activo = false }
  }, [userId])

  async function cerrarSesion() {
    setErrorSesion('')
    setCerrandoSesion(true)
    try {
      const { error } = await supabase.auth.signOut()
      if (error) setErrorSesion('No se pudo cerrar la sesión. Inténtalo nuevamente.')
    } catch {
      setErrorSesion('No se pudo cerrar la sesión. Inténtalo nuevamente.')
    } finally {
      setCerrandoSesion(false)
    }
  }

  if (sesion === undefined) return <div className="app-loading" role="status">Preparando tu espacio…</div>
  if (!sesion) return <Acceso />

  const titulo = ruta.startsWith('negocio/')
    ? negocioSubsecciones.find((seccion) => `negocio/${seccion.id}` === ruta)?.titulo
    : secciones.find((seccion) => seccion.id === ruta)?.titulo
  const nombre = perfil && perfil.userId === userId ? perfil.nombre :
    (typeof sesion.user.user_metadata?.nombre === 'string' ? sesion.user.user_metadata.nombre : 'Usuario')

  return <div className="app-shell">
    <MenuLateral ruta={ruta} abierto={menuAbierto} cerrar={() => setMenuAbierto(false)} nombre={nombre} cerrarSesion={cerrarSesion} cerrandoSesion={cerrandoSesion} />
    <div className="main-area">
      <header className="topbar"><button className="menu-toggle" type="button" onClick={() => setMenuAbierto(true)} aria-label="Abrir menú" aria-expanded={menuAbierto}>☰</button><span className="topbar-path">Mi espacio <span>/</span> <strong>{titulo}</strong></span><span className="topbar-avatar" aria-label={`Usuario ${nombre}`}>{nombre.charAt(0).toUpperCase()}</span></header>
      <main className="content">
        {errorSesion && <div className="app-error" role="alert">{errorSesion}</div>}
        {errorPerfil && <div className="app-error" role="alert">{errorPerfil}</div>}
        {ruta === 'inicio' ? <Inicio nombre={nombre} /> : <PaginaProvisional titulo={titulo ?? 'Inicio'} />}
      </main>
    </div>
  </div>
}

export default App
