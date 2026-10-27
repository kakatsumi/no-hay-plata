import { useState, type FormEvent } from 'react'
import { supabase } from '../servicios/supabase'
import '../estilos/acceso.css'

type Vista = 'ingreso' | 'registro' | 'confirmacion'
type Campos = { nombreUsuario: string; nombre: string; email: string; password: string; confirmacion: string }
const camposIniciales: Campos = { nombreUsuario: '', nombre: '', email: '', password: '', confirmacion: '' }

function mensajeAuth(mensaje: string) {
  if (/invalid login credentials/i.test(mensaje)) return 'El correo o la contraseña no son correctos.'
  if (/email not confirmed/i.test(mensaje)) return 'Confirma tu correo antes de iniciar sesión.'
  if (/already registered|already exists|user already registered/i.test(mensaje)) return 'No se pudo completar el registro con estos datos. Prueba con otro correo o nombre de usuario.'
  if (/password.*(short|length|characters)/i.test(mensaje)) return 'La contraseña no cumple los requisitos de seguridad del proyecto.'
  if (/rate limit|too many requests/i.test(mensaje)) return 'Hay demasiados intentos. Espera unos minutos y vuelve a probar.'
  if (/database error saving new user/i.test(mensaje)) return 'No se pudo crear la cuenta por un problema al generar el perfil. Revisa el trigger en Supabase.'
  return `No se pudo completar la operación: ${mensaje}`
}

export function Acceso() {
  const [vista, setVista] = useState<Vista>('ingreso')
  const [campos, setCampos] = useState(camposIniciales)
  const [mostrarPassword, setMostrarPassword] = useState(false)
  const [enviando, setEnviando] = useState(false)
  const [error, setError] = useState('')
  const [correoConfirmacion, setCorreoConfirmacion] = useState('')

  function cambiarVista(siguiente: Vista) {
    setVista(siguiente)
    setError('')
    setCampos(camposIniciales)
    setMostrarPassword(false)
  }

  function actualizar(campo: keyof Campos, valor: string) {
    setCampos((actual) => ({ ...actual, [campo]: valor }))
  }

  async function enviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault()
    setError('')
    const email = campos.email.trim()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Escribe un correo electrónico válido.')
      return
    }
    if (!campos.password) {
      setError('Escribe tu contraseña.')
      return
    }
    if (vista === 'registro') {
      const usuario = campos.nombreUsuario.trim()
      const nombre = campos.nombre.trim()
      if (!/^[A-Za-z0-9_]{3,30}$/.test(usuario)) {
        setError('El nombre de usuario debe tener entre 3 y 30 caracteres y usar solo letras, números o guion bajo.')
        return
      }
      if (!nombre) {
        setError('Escribe tu nombre visible.')
        return
      }
      if (nombre.length > 80) {
        setError('El nombre visible no puede superar los 80 caracteres.')
        return
      }
      if (campos.password.length < 6) {
        setError('La contraseña debe tener al menos 6 caracteres.')
        return
      }
      if (campos.password !== campos.confirmacion) {
        setError('Las contraseñas no coinciden.')
        return
      }
    }

    setEnviando(true)
    try {
      if (vista === 'registro') {
        const { data, error: authError } = await supabase.auth.signUp({
          email,
          password: campos.password,
          options: { data: { nombre_usuario: campos.nombreUsuario.trim(), nombre: campos.nombre.trim() } },
        })
        if (authError) throw authError
        if (!data.session) {
          setCorreoConfirmacion(email)
          setCampos(camposIniciales)
          setVista('confirmacion')
        }
      } else {
        const { error: authError } = await supabase.auth.signInWithPassword({ email, password: campos.password })
        if (authError) throw authError
      }
    } catch (fallo) {
      setError(mensajeAuth(fallo instanceof Error ? fallo.message : 'Error inesperado. Inténtalo nuevamente.'))
    } finally {
      setEnviando(false)
    }
  }

  return <main className="auth-page">
    <div className="auth-brand"><span className="brand-mark">✳</span><span>No Hay <strong>Plata</strong><small>FINANZAS EN ORDEN</small></span></div>
    <section className="auth-card" aria-label={vista === 'registro' ? 'Registro' : vista === 'ingreso' ? 'Inicio de sesión' : 'Confirmación de correo'}>
      {vista === 'confirmacion' ? <>
        <div className="auth-symbol">✉</div><div className="eyebrow">UN PASO MÁS</div><h1>Revisa tu correo</h1>
        <p>Enviamos un enlace de confirmación a <strong>{correoConfirmacion}</strong>. Revisa tu bandeja de entrada y, si es necesario, la carpeta de spam. Después podrás iniciar sesión.</p>
        <button className="auth-submit" type="button" onClick={() => cambiarVista('ingreso')}>Ir a iniciar sesión</button>
      </> : <>
        <div className="eyebrow">TU ESPACIO FINANCIERO</div>
        <h1>{vista === 'ingreso' ? 'Bienvenido de nuevo' : 'Crea tu cuenta'}</h1>
        <p className="auth-intro">{vista === 'ingreso' ? 'Ingresa para continuar donde lo dejaste.' : 'Comienza a ordenar tus finanzas en un solo lugar.'}</p>
        <form onSubmit={enviar} noValidate>
          {vista === 'registro' && <>
            <label htmlFor="nombre-usuario">Nombre de usuario</label><input id="nombre-usuario" name="nombre-usuario" autoComplete="username" minLength={3} maxLength={30} required value={campos.nombreUsuario} onChange={(e) => actualizar('nombreUsuario', e.target.value)} placeholder="ricardo_123" />
            <label htmlFor="nombre">Nombre visible</label><input id="nombre" name="nombre" autoComplete="name" maxLength={80} required value={campos.nombre} onChange={(e) => actualizar('nombre', e.target.value)} placeholder="Ricardo" />
          </>}
          <label htmlFor="email">Correo electrónico</label><input id="email" name="email" type="email" autoComplete="email" required value={campos.email} onChange={(e) => actualizar('email', e.target.value)} placeholder="tu@correo.com" />
          <label htmlFor="password">Contraseña</label><div className="password-field"><input id="password" name="password" type={mostrarPassword ? 'text' : 'password'} autoComplete={vista === 'ingreso' ? 'current-password' : 'new-password'} required value={campos.password} onChange={(e) => actualizar('password', e.target.value)} placeholder="Escribe tu contraseña" /><button type="button" onClick={() => setMostrarPassword(!mostrarPassword)} aria-label={mostrarPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}>{mostrarPassword ? 'Ocultar' : 'Mostrar'}</button></div>
          {vista === 'registro' && <><label htmlFor="confirmacion">Confirmar contraseña</label><input id="confirmacion" name="confirmacion" type={mostrarPassword ? 'text' : 'password'} autoComplete="new-password" required value={campos.confirmacion} onChange={(e) => actualizar('confirmacion', e.target.value)} placeholder="Repite tu contraseña" /></>}
          {error && <div className="auth-error" role="alert">{error}</div>}
          <button className="auth-submit" type="submit" disabled={enviando}>{enviando ? 'Espera un momento…' : vista === 'ingreso' ? 'Iniciar sesión' : 'Crear cuenta'}</button>
        </form>
        <p className="auth-switch">{vista === 'ingreso' ? '¿Aún no tienes cuenta?' : '¿Ya tienes cuenta?'} <button type="button" onClick={() => cambiarVista(vista === 'ingreso' ? 'registro' : 'ingreso')}>{vista === 'ingreso' ? 'Regístrate' : 'Inicia sesión'}</button></p>
      </>}
    </section>
    <p className="auth-footnote">Tus finanzas, a tu manera.</p>
  </main>
}
