import Link from 'next/link'

const lastUpdate = '18 de noviembre de 2025'

export default function PoliticaDePrivacidadPage() {
  return (
    <main className="min-h-screen bg-church-cream text-slate-900">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
        <header className="space-y-4">
          <p className="uppercase tracking-[0.3em] text-sm text-church-blue">Transparencia y confianza</p>
          <h1 className="text-3xl sm:text-4xl font-bold text-church-blue-dark">
            Política de Privacidad
          </h1>
          <p className="text-church-blue-dark/80">Última actualización: {lastUpdate}</p>
          <p className="text-lg text-slate-700">
            En Centro Cristiano Casa de Provisión (CCP) tratamos los datos personales con respeto, seguridad
            y apego al Reglamento General de Protección de Datos (RGPD) y a la Ley 34/2002 (LSSI-CE).
            Este documento explica qué información recogemos, por qué lo hacemos, cuánto tiempo la conservamos
            y cuáles son sus derechos.
          </p>
        </header>

        <section className="bg-white rounded-2xl shadow-sm border border-church-blue/10 p-8 space-y-5">
          <h2 className="text-2xl font-semibold text-church-blue-dark">1. Responsable y contacto</h2>
          <p>
            Centro Cristiano Casa de Provisión — Calle Arana, 28, 01002 Vitoria-Gasteiz (Álava, España).
            Teléfono: +34 627 10 87 30. Correo electrónico: <a href="mailto:pastor@casadeprovision.es" className="text-church-blue underline">pastor@casadeprovision.es</a>.
          </p>
          <p>
            No se ha designado Delegado de Protección de Datos. Para consultas o ejercicio de derechos utilice el correo
            anterior indicando “Protección de datos”.
          </p>
        </section>

        <section className="bg-white rounded-2xl shadow-sm border border-church-blue/10 p-8 space-y-6">
          <h2 className="text-2xl font-semibold text-church-blue-dark">2. Finalidades y bases jurídicas</h2>
          <p>Tratamos los datos con las siguientes finalidades legítimas:</p>
          <ul className="list-disc pl-5 space-y-2 text-slate-700">
            <li><strong>Gestión de cuentas y autenticación</strong> (Supabase, panel administrativo): ejecución contractual (art. 6.1.b RGPD).</li>
            <li><strong>Pastoral y vida congregacional</strong> (miembros, visitas, grupos, peticiones de oración): consentimiento explícito y art. 9.2.d RGPD, aplicable a entidades religiosas sin ánimo de lucro.</li>
            <li><strong>Organización de eventos</strong> y seguimiento de asistencia: ejecución contractual e interés legítimo (arts. 6.1.b y 6.1.f).</li>
            <li><strong>Comunicación informativa</strong> (email, SMS, notificaciones): consentimiento (art. 6.1.a) y, cuando proceda, interés legítimo para personas registradas.</li>
            <li><strong>Gestión de donaciones y obligaciones legales</strong>: cumplimiento normativo (art. 6.1.c).</li>
            <li><strong>Atención de consultas</strong> a través de formularios o canales oficiales: consentimiento.</li>
            <li><strong>Seguridad, prevención del fraude y auditoría</strong>: interés legítimo (art. 6.1.f).</li>
            <li><strong>Analítica técnica</strong> y mejora de experiencia (solo tras consentimiento expreso para cookies no esenciales).</li>
          </ul>
        </section>

        <section className="bg-white rounded-2xl shadow-sm border border-church-blue/10 p-8 space-y-4">
          <h2 className="text-2xl font-semibold text-church-blue-dark">3. Categorías de datos</h2>
          <p>Recopilamos únicamente la información necesaria para cada actividad pastoral o administrativa:</p>
          <ul className="list-disc pl-5 space-y-2 text-slate-700">
            <li>Identificación y contacto: nombre, apellidos, email, teléfono, dirección.</li>
            <li>Datos de cuenta y actividad: ID Supabase, registros de acceso, roles en el panel.</li>
            <li>Información pastoral: pertenencia a ministerios, asistencia, seguimiento espiritual.</li>
            <li>Datos económicos voluntarios: historial de donaciones, referencias bancarias facilitadas.</li>
            <li>Mensajes y solicitudes enviados mediante formularios.</li>
            <li>Datos técnicos: IP, navegador, identificadores de dispositivo, cookies o almacenamiento local.</li>
            <li>En caso de menores, se solicitará autorización parental o de la tutela correspondiente.</li>
          </ul>
        </section>

        <section className="bg-white rounded-2xl shadow-sm border border-church-blue/10 p-8 space-y-4">
          <h2 className="text-2xl font-semibold text-church-blue-dark">4. Procedencia de los datos</h2>
          <ul className="list-disc pl-5 space-y-2 text-slate-700">
            <li>Información proporcionada directamente por la persona interesada (formularios, donaciones, registros).</li>
            <li>Registros generados automáticamente por nuestros sistemas (Supabase, hosting, apps móviles).</li>
            <li>Integraciones internas de la iglesia cuando exista relación activa (ministerios, grupos pequeños, seguimiento pastoral).</li>
          </ul>
        </section>

        <section className="bg-white rounded-2xl shadow-sm border border-church-blue/10 p-8 space-y-4">
          <h2 className="text-2xl font-semibold text-church-blue-dark">5. Destinatarios y encargados</h2>
          <p>Compartimos datos con terceros únicamente cuando es imprescindible para prestar el servicio:</p>
          <ul className="list-disc pl-5 space-y-2 text-slate-700">
            <li><strong>Supabase</strong> (infraestructura de autenticación y base de datos) con cláusulas contractuales tipo de la UE.</li>
            <li><strong>Proveedor de hosting</strong> para servir la web y el panel administrativo.</li>
            <li><strong>Servicios de comunicación</strong> (email, SMS, mensajería) usados para avisos y confirmaciones.</li>
            <li><strong>Servicios de mapas y vídeo</strong> (Google Maps, YouTube) cuando el usuario interactúa con los contenidos integrados.</li>
            <li><strong>Asesorías o auditorías</strong> en cumplimiento de obligaciones legales o contables.</li>
          </ul>
          <p>No vendemos datos ni los cedemos para fines publicitarios de terceros. Formalizamos contratos de encargo de tratamiento según el art. 28 RGPD.</p>
        </section>

        <section className="bg-white rounded-2xl shadow-sm border border-church-blue/10 p-8 space-y-4">
          <h2 className="text-2xl font-semibold text-church-blue-dark">6. Transferencias internacionales</h2>
          <p>
            Algunos proveedores pueden operar fuera del Espacio Económico Europeo. En esos casos aplicamos salvaguardas adecuadas:
            cláusulas contractuales tipo aprobadas por la Comisión Europea, medidas técnicas adicionales y verificación de la política del proveedor.
            Puede solicitar copia de estas garantías escribiendo a <a href="mailto:pastor@casadeprovision.es" className="text-church-blue underline">pastor@casadeprovision.es</a>.
          </p>
        </section>

        <section className="bg-white rounded-2xl shadow-sm border border-church-blue/10 p-8 space-y-4">
          <h2 className="text-2xl font-semibold text-church-blue-dark">7. Plazos de conservación</h2>
          <ul className="list-disc pl-5 space-y-2 text-slate-700">
            <li>Cuentas y perfiles: mientras exista relación activa y hasta 24 meses tras la última interacción.</li>
            <li>Registros pastorales y de ministerios: hasta que se solicite supresión, salvo obligaciones eclesiales o legales.</li>
            <li>Información de donaciones y contabilidad: 10 años conforme a normativa fiscal española.</li>
            <li>Consultas y comunicaciones: 12 meses después de su cierre.</li>
            <li>Logs de seguridad y evidencias de consentimiento: 24 meses.</li>
            <li>Transcurridos los plazos, se anonimizan o se eliminan con medidas seguras.</li>
          </ul>
        </section>

        <section className="bg-white rounded-2xl shadow-sm border border-church-blue/10 p-8 space-y-4">
          <h2 className="text-2xl font-semibold text-church-blue-dark">8. Derechos de las personas interesadas</h2>
          <p>Puede ejercitar en cualquier momento los derechos de acceso, rectificación, supresión, oposición, limitación, portabilidad y retirada del consentimiento.</p>
          <p>
            Envíe su solicitud a <a href="mailto:pastor@casadeprovision.es" className="text-church-blue underline">pastor@casadeprovision.es</a> adjuntando un documento identificativo. Si considera que no hemos atendido su petición, puede presentar
            una reclamación ante la Agencia Española de Protección de Datos (AEPD), C/ Jorge Juan 6, 28001 Madrid, www.aepd.es.
          </p>
        </section>

        <section className="bg-white rounded-2xl shadow-sm border border-church-blue/10 p-8 space-y-4">
          <h2 className="text-2xl font-semibold text-church-blue-dark">9. Medidas de seguridad</h2>
          <ul className="list-disc pl-5 space-y-2 text-slate-700">
            <li>Cifrado TLS en tránsito y protección de credenciales con hashing/rotación.</li>
            <li>Roles y permisos mínimos en Supabase y el panel administrativo.</li>
            <li>Registros de auditoría y alertas ante accesos inusuales.</li>
            <li>Copias de seguridad cifradas y pruebas periódicas de restauración.</li>
            <li>Protocolos de respuesta ante incidentes y notificación de brechas según arts. 33 y 34 RGPD.</li>
          </ul>
        </section>

        <section className="bg-white rounded-2xl shadow-sm border border-church-blue/10 p-8 space-y-4">
          <h2 className="text-2xl font-semibold text-church-blue-dark">10. Menores de edad</h2>
          <p>
            Los servicios no están dirigidos a menores de 14 años. Cuando una actividad requiera datos de un menor, se solicitará
            consentimiento verificable de sus representantes legales y se aplicarán salvaguardas específicas.
          </p>
        </section>

        <section className="bg-white rounded-2xl shadow-sm border border-church-blue/10 p-8 space-y-4">
          <h2 className="text-2xl font-semibold text-church-blue-dark">11. Cookies y tecnologías similares</h2>
          <p>
            Utilizamos cookies para garantizar el funcionamiento seguro del sitio y, previo consentimiento, para analítica y contenidos embebidos.
            Puede consultar los detalles y gestionar sus preferencias en la{' '}
            <Link href="/politica-de-cookies" className="text-church-blue underline font-medium">Política de Cookies</Link>.
          </p>
        </section>

        <section className="bg-white rounded-2xl shadow-sm border border-church-blue/10 p-8 space-y-4">
          <h2 className="text-2xl font-semibold text-church-blue-dark">12. Cambios en esta política</h2>
          <p>
            Publicaremos cualquier modificación relevante en este apartado, indicando la fecha de entrada en vigor.
            Si las actualizaciones afectan de forma significativa a sus derechos, le avisaremos mediante los canales habituales.
          </p>
        </section>
      </div>
    </main>
  )
}
