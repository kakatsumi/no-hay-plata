import { negocioSubsecciones, secciones } from '../servicios/navegacion'

type Props = {
  ruta: string
  abierto: boolean
  cerrar: () => void
  nombre: string
  cerrarSesion: () => void
  cerrandoSesion: boolean
}

export function MenuLateral({ ruta, abierto, cerrar, nombre, cerrarSesion, cerrandoSesion }: Props) {
  return (
    <>
      {abierto && <button className="menu-overlay" aria-label="Cerrar menú" onClick={cerrar} />}
      <aside className={`sidebar ${abierto ? 'sidebar--abierto' : ''}`} aria-label="Menú principal">
        <div className="brand"><span className="brand-mark">✳</span><span>No Hay <strong>Plata</strong><small>FINANZAS EN ORDEN</small></span></div>
        <div className="nav-caption">TU ESPACIO</div>
        <nav aria-label="Secciones">
          {secciones.map((seccion) => (
            <div key={seccion.id}>
              <a href={`#/${seccion.id}`} onClick={cerrar} className={`nav-link ${ruta === seccion.id || (seccion.id === 'negocio' && ruta.startsWith('negocio/')) ? 'nav-link--activo' : ''}`} aria-current={ruta === seccion.id ? 'page' : undefined}>
                <span className="nav-icon" aria-hidden="true">{seccion.icono}</span><span>{seccion.titulo}</span>
                {seccion.id === 'negocio' && <span className="nav-chevron">⌄</span>}
              </a>
              {seccion.id === 'negocio' && <div className="submenu" aria-label="Subsecciones de Negocio">
                {negocioSubsecciones.map((sub) => <a key={sub.id} href={`#/negocio/${sub.id}`} onClick={cerrar} className={ruta === `negocio/${sub.id}` ? 'submenu-link submenu-link--activo' : 'submenu-link'} aria-current={ruta === `negocio/${sub.id}` ? 'page' : undefined}>{sub.titulo}</a>)}
              </div>}
            </div>
          ))}
        </nav>
        <div className="sidebar-footer"><span className="avatar">{nombre.charAt(0).toUpperCase()}</span><span className="sidebar-user"><strong>{nombre}</strong><small>Espacio personal</small></span></div>
        <button className="logout-button" type="button" onClick={cerrarSesion} disabled={cerrandoSesion}>{cerrandoSesion ? 'Cerrando sesión…' : '↪  Cerrar sesión'}</button>
      </aside>
    </>
  )
}
