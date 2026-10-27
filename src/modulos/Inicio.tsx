import { useState } from 'react'

const tarjetas = [
  { nombre: 'Balance disponible', monto: 'S/ 8,450.00', icono: '◈', tono: 'morado', nota: 'Resumen general' },
  { nombre: 'Ingresos del mes', monto: 'S/ 5,280.00', icono: '↗', tono: 'menta', nota: 'Datos de ejemplo' },
  { nombre: 'Gastos del mes', monto: 'S/ 2,340.00', icono: '↘', tono: 'coral', nota: 'Datos de ejemplo' },
  { nombre: 'Ahorros', monto: 'S/ 12,800.00', icono: '◇', tono: 'amarillo', nota: 'Datos de ejemplo' },
]

export function Inicio({ nombre }: { nombre: string }) {
  const [visible, setVisible] = useState(true)
  return <>
    <section className="welcome">
      <div><div className="eyebrow">TU RESUMEN FINANCIERO</div><h1>¡Hola, {nombre}! <span>👋</span></h1><p>¿En qué se fue la plata esta vez?</p></div>
      <button className="privacy-button" type="button" onClick={() => setVisible(!visible)} aria-pressed={!visible}>{visible ? '◉  Ocultar montos' : '◎  Mostrar montos'}</button>
    </section>
    <div className="demo-banner"><span className="demo-dot" /> Vista de demostración <span className="demo-separator">·</span> Los montos son ficticios y solo ilustran el diseño.</div>
    <section className="summary" aria-label="Resumen financiero de demostración">
      {tarjetas.map((tarjeta) => <article className={`summary-card ${tarjeta.tono}`} key={tarjeta.nombre}>
        <div className="card-top"><span className="card-icon" aria-hidden="true">{tarjeta.icono}</span><span className="card-spark" aria-hidden="true">✦</span></div>
        <p>{tarjeta.nombre}</p><strong aria-label={visible ? tarjeta.monto : 'Monto oculto'}>{visible ? tarjeta.monto : 'S/ ••••••'}</strong><small>{tarjeta.nota}</small>
      </article>)}
    </section>
    <section className="placeholder-feature"><span className="feature-icon">✳</span><div><h2>Todo en un solo lugar</h2><p>Explora las secciones del menú para conocer la estructura de tu espacio financiero.</p></div></section>
  </>
}
