import Link from 'next/link'

const lastUpdate = '18 de noviembre de 2025'

const cookieRows = [
  {
    name: 'sb-access-token / sb-refresh-token',
    type: 'Estrictamente necesarias',
    provider: 'Supabase',
    purpose: 'Mantener la sesión autenticada y renovar credenciales seguras.',
    duration: 'Sesión / según configuración del servidor',
    consent: 'No'
  },
  {
    name: 'ccp-cookie-consent',
    type: 'Preferencias',
    provider: 'Centro Cristiano Casa de Provisión',
    purpose: 'Recordar las elecciones de consentimiento por categorías.',
    duration: '12 meses',
    consent: 'No (es imprescindible para almacenar la preferencia)'
  },
  {
    name: 'Cookies de Google Maps',
    type: 'Funcionales / terceros',
    provider: 'Google LLC',
    purpose: 'Mostrar el mapa interactivo de la congregación.',
    duration: 'De sesión a 6 meses',
    consent: 'Sí'
  },
  {
    name: 'Cookies de YouTube (VISITOR_INFO1_LIVE, YSC...)',
    type: 'Marketing / terceros',
    provider: 'Google LLC',
    purpose: 'Reproducir vídeos embebidos y medir la interacción.',
    duration: 'Sesión / 6 meses',
    consent: 'Sí'
  }
]

export default function PoliticaDeCookiesPage() {
  return (
    <main className="min-h-screen bg-church-cream text-slate-900">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
        <header className="space-y-4">
          <p className="uppercase tracking-[0.3em] text-sm text-church-blue">Controla tu experiencia</p>
          <h1 className="text-3xl sm:text-4xl font-bold text-church-blue-dark">Política de Cookies</h1>
          <p className="text-church-blue-dark/80">Última actualización: {lastUpdate}</p>
          <p className="text-lg text-slate-700">
            Explicamos qué cookies utilizamos en nuestros sitios y aplicaciones, cómo puedes gestionarlas,
            y qué consecuencias tiene aceptar o rechazar cada categoría. Solo instalamos cookies no esenciales
            cuando contamos con tu consentimiento explícito, de acuerdo con el RGPD y la LSSI-CE.
          </p>
        </header>

        <section className="bg-white rounded-2xl shadow-sm border border-church-blue/10 p-8 space-y-4">
          <h2 className="text-2xl font-semibold text-church-blue-dark">1. ¿Qué son las cookies?</h2>
          <p>
            Son archivos o identificadores que el sitio o la app guardan en tu dispositivo para recordar información
            sobre tu visita. Incluirán tecnologías equivalentes como almacenamiento local, SDK móviles o identificadores
            de dispositivo. Algunas son estrictamente necesarias, mientras que otras ayudan a mejorar la experiencia o a
            integrar servicios de terceros.
          </p>
        </section>

        <section className="bg-white rounded-2xl shadow-sm border border-church-blue/10 p-8 space-y-4" id="categorias">
          <h2 className="text-2xl font-semibold text-church-blue-dark">2. Categorías utilizadas</h2>
          <ul className="list-disc pl-5 space-y-2 text-slate-700">
            <li><strong>Estrictamente necesarias:</strong> garantizan funciones básicas como el inicio de sesión, la seguridad o la preferencia de idioma. No requieren consentimiento.</li>
            <li><strong>Preferencias / funcionales:</strong> recuerdan ajustes o características opcionales (por ejemplo, el estado del consentimiento o accesibilidad).</li>
            <li><strong>Analíticas / estadísticas:</strong> permiten medir la interacción con la web o la app para mejorarla. Siempre pedimos tu consentimiento previo.</li>
            <li><strong>Marketing o terceros:</strong> activan contenidos externos (YouTube, mapas, redes sociales) o crean perfiles. Se cargan únicamente cuando lo autorizas.</li>
          </ul>
        </section>

        <section className="bg-white rounded-2xl shadow-sm border border-church-blue/10 p-8 space-y-6" id="listado-cookies">
          <h2 className="text-2xl font-semibold text-church-blue-dark">3. Listado actualizado de cookies</h2>
          <p>Realizamos auditorías periódicas y actualizamos esta tabla cuando añadimos o retiramos servicios.</p>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left border-b border-slate-200">
                  <th className="py-3 pr-4 font-semibold text-church-blue-dark">Nombre</th>
                  <th className="py-3 pr-4 font-semibold text-church-blue-dark">Tipo</th>
                  <th className="py-3 pr-4 font-semibold text-church-blue-dark">Proveedor</th>
                  <th className="py-3 pr-4 font-semibold text-church-blue-dark">Finalidad</th>
                  <th className="py-3 pr-4 font-semibold text-church-blue-dark">Duración</th>
                  <th className="py-3 font-semibold text-church-blue-dark">Consentimiento</th>
                </tr>
              </thead>
              <tbody>
                {cookieRows.map((row) => (
                  <tr key={row.name} className="border-b border-slate-100">
                    <td className="py-3 pr-4 font-medium text-slate-800">{row.name}</td>
                    <td className="py-3 pr-4 text-slate-700">{row.type}</td>
                    <td className="py-3 pr-4 text-slate-700">{row.provider}</td>
                    <td className="py-3 pr-4 text-slate-700">{row.purpose}</td>
                    <td className="py-3 pr-4 text-slate-700">{row.duration}</td>
                    <td className="py-3 text-slate-700">{row.consent}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-sm text-slate-500">
            Si detectas alguna cookie no listada o deseas más detalle (p.ej., duración exacta), escríbenos a{' '}
            <a href="mailto:pastor@casadeprovision.es" className="text-church-blue underline">pastor@casadeprovision.es</a>.
          </p>
        </section>

        <section className="bg-white rounded-2xl shadow-sm border border-church-blue/10 p-8 space-y-4" id="gestionar-consentimiento">
          <h2 className="text-2xl font-semibold text-church-blue-dark">4. Cómo gestionamos tu consentimiento</h2>
          <ul className="list-disc pl-5 space-y-2 text-slate-700">
            <li>Mostramos un banner en la primera visita con opciones “Aceptar todas”, “Rechazar no esenciales” y “Configurar cookies”.</li>
            <li>Las categorías no esenciales permanecen desactivadas hasta que otorgas consentimiento explícito.</li>
            <li>Puedes modificar tu elección en cualquier momento mediante el enlace “Configurar cookies” disponible al final de todas las páginas.</li>
            <li>Registramos la fecha, hora, versión de la política y categorías seleccionadas para acreditar el consentimiento (art. 7 RGPD).</li>
          </ul>
        </section>

        <section className="bg-white rounded-2xl shadow-sm border border-church-blue/10 p-8 space-y-4">
          <h2 className="text-2xl font-semibold text-church-blue-dark">5. Consecuencias de desactivar cookies</h2>
          <p>
            Al bloquear cookies estrictamente necesarias es posible que no puedas iniciar sesión o que determinadas funciones del panel
            de liderazgo no se carguen correctamente. Rechazar cookies analíticas o de marketing no impedirá el uso básico del sitio, pero
            puede limitar funcionalidades como mapas interactivos o vídeos incrustados.
          </p>
        </section>

        <section className="bg-white rounded-2xl shadow-sm border border-church-blue/10 p-8 space-y-4" id="eliminar-cookies">
          <h2 className="text-2xl font-semibold text-church-blue-dark">6. Cómo eliminar o bloquear cookies desde tu navegador</h2>
          <p>Puedes seguir las guías oficiales:</p>
          <ul className="list-disc pl-5 space-y-2 text-church-blue">
            <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noreferrer noopener" className="underline">Google Chrome</a></li>
            <li><a href="https://support.mozilla.org/es/kb/borrar-cookies-datos-sitios-web" target="_blank" rel="noreferrer noopener" className="underline">Mozilla Firefox</a></li>
            <li><a href="https://support.apple.com/es-es/guide/safari/sfri11471/mac" target="_blank" rel="noreferrer noopener" className="underline">Safari</a></li>
            <li><a href="https://support.microsoft.com/es-es/microsoft-edge/eliminar-las-cookies-en-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noreferrer noopener" className="underline">Microsoft Edge</a></li>
          </ul>
          <p>
            En apps móviles, gestiona permisos de seguimiento desde los ajustes del sistema (iOS: Privacidad &gt; Seguimiento,
            Android: Configuración &gt; Privacidad &gt; Anuncios).
          </p>
        </section>

        <section className="bg-white rounded-2xl shadow-sm border border-church-blue/10 p-8 space-y-4">
          <h2 className="text-2xl font-semibold text-church-blue-dark">7. Apps móviles y SDK</h2>
          <p>
            Nuestras aplicaciones pueden emplear identificadores de dispositivo, tokens de notificaciones push o almacenamiento local
            para recordar la sesión y ofrecer avisos personalizados. Se consideran cookies equivalentes y se solicitará el mismo nivel
            de consentimiento antes de activarlos.
          </p>
        </section>

        <section className="bg-white rounded-2xl shadow-sm border border-church-blue/10 p-8 space-y-4">
          <h2 className="text-2xl font-semibold text-church-blue-dark">8. Actualizaciones</h2>
          <p>
            Revisamos esta política siempre que integramos un nuevo proveedor o modificamos nuestros sistemas. Indicaremos la nueva fecha de
            vigencia y, si el cambio es relevante, mostraremos un aviso destacado o solicitaremos de nuevo tu consentimiento.
          </p>
          <p>
            Para ampliar esta información o ejercer tus derechos de privacidad, consulta también la{' '}
            <Link href="/politica-de-privacidad" className="text-church-blue underline font-medium">Política de Privacidad</Link>.
          </p>
        </section>
      </div>
    </main>
  )
}
