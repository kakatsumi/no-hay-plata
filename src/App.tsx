import { useEffect, useState } from 'react'
import { MenuLateral } from './componentes/MenuLateral'
import { Inicio } from './modulos/Inicio'
import { PaginaProvisional } from './modulos/PaginaProvisional'
import { negocioSubsecciones, obtenerRuta, secciones } from './servicios/navegacion'
import './estilos/app.css'

function App() {
  const [ruta, setRuta] = useState(obtenerRuta)
  const [menuAbierto, setMenuAbierto] = useState(false)

  useEffect(() => {
    const actualizar = () => setRuta(obtenerRuta())
    window.addEventListener('hashchange', actualizar)
    return () => window.removeEventListener('hashchange', actualizar)
  }, [])

  const titulo = ruta.startsWith('negocio/')
    ? negocioSubsecciones.find((seccion) => `negocio/${seccion.id}` === ruta)?.titulo
    : secciones.find((seccion) => seccion.id === ruta)?.titulo

  return <div className="app-shell">
    <MenuLateral ruta={ruta} abierto={menuAbierto} cerrar={() => setMenuAbierto(false)} />
    <div className="main-area">
      <header className="topbar"><button className="menu-toggle" type="button" onClick={() => setMenuAbierto(true)} aria-label="Abrir menú" aria-expanded={menuAbierto}>☰</button><span className="topbar-path">Mi espacio <span>/</span> <strong>{titulo}</strong></span><span className="topbar-avatar" aria-label="Usuario Ricardo">R</span></header>
      <main className="content">{ruta === 'inicio' ? <Inicio /> : <PaginaProvisional titulo={titulo ?? 'Inicio'} />}</main>
    </div>
  </div>
}

export default App
