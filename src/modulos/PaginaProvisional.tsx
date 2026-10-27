type Props = { titulo: string }

export function PaginaProvisional({ titulo }: Props) {
  return <section className="coming-page"><div className="eyebrow">TU ESPACIO FINANCIERO</div><h1>{titulo}</h1><div className="coming-card"><span>✳</span><h2>Próximamente</h2><p>Esta sección se desarrollará posteriormente.</p></div></section>
}
