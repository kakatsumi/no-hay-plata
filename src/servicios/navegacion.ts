export const secciones = [
  { id: 'inicio', titulo: 'Inicio', icono: '⌂' },
  { id: 'finanzas', titulo: 'Finanzas', icono: '◈' },
  { id: 'mis-hojas', titulo: 'Mis hojas', icono: '▤' },
  { id: 'negocio', titulo: 'Negocio', icono: '▦' },
  { id: 'deudas', titulo: 'Deudas', icono: '↗' },
  { id: 'pedidos', titulo: 'Pedidos', icono: '◫' },
  { id: 'ahorros', titulo: 'Ahorros', icono: '◇' },
  { id: 'reportes', titulo: 'Reportes', icono: '▥' },
  { id: 'configuracion', titulo: 'Configuración', icono: '⚙' },
] as const

export const negocioSubsecciones = [
  { id: 'ventas', titulo: 'Ventas' },
  { id: 'compras', titulo: 'Compras' },
  { id: 'stock', titulo: 'Stock' },
] as const

export function obtenerRuta() {
  const ruta = window.location.hash.slice(1).replace(/^\//, '') || 'inicio'
  const valida = secciones.some((seccion) => seccion.id === ruta) ||
    negocioSubsecciones.some((seccion) => `negocio/${seccion.id}` === ruta)
  return valida ? ruta : 'inicio'
}
