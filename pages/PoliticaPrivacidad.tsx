
import React from 'react';

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <section className="mb-12">
    <h2 className="text-xl font-bold uppercase tracking-widest text-zinc-900 mb-4">{title}</h2>
    <div className="text-zinc-600 leading-relaxed space-y-4">{children}</div>
  </section>
);

const PoliticaPrivacidad: React.FC = () => {
  return (
    <div className="pt-32 pb-24 animate-fadeIn">
      <div className="max-w-3xl mx-auto px-6">
        <header className="mb-16">
          <span className="text-emerald-600 text-[11px] font-bold uppercase tracking-[0.6em] block mb-6">
            Legal
          </span>
          <h1 className="text-5xl serif italic mb-6">Política de Privacidad</h1>
          <p className="text-zinc-400 text-sm">Última actualización: 25 de septiembre de 2026</p>
        </header>

        <Section title="1. Responsable del tratamiento">
          <p>
            El responsable del tratamiento de los datos personales recogidos a través de este sitio web
            (captaloonaart.com) es Captaloona Art, con domicilio en C. de Andrés Mellado, 55, 28015 Madrid,
            España. Puede contactar con nosotros en cualquier momento a través del correo electrónico{' '}
            <a href="mailto:info@loonacontemporary.com" className="text-emerald-600 hover:underline">
              info@loonacontemporary.com
            </a>{' '}
            o del teléfono +34 669 61 62 20.
          </p>
        </Section>

        <Section title="2. Datos que recogemos y con qué finalidad">
          <p>
            Tratamos los datos personales que usted nos facilita voluntariamente a través de los siguientes
            formularios y funcionalidades del sitio:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Formulario de contacto:</strong> nombre, correo electrónico y mensaje, con la finalidad
              de responder a sus consultas.
            </li>
            <li>
              <strong>Suscripción a la newsletter:</strong> nombre y correo electrónico, con la finalidad de
              enviarle comunicaciones sobre artistas, exposiciones y actividades de la galería.
            </li>
            <li>
              <strong>Pujas y subastas:</strong> nombre, correo electrónico, teléfono e importe de la oferta,
              con la finalidad de gestionar su participación en las subastas publicadas en el sitio.
            </li>
          </ul>
          <p>
            La base legal para estos tratamientos es su consentimiento, otorgado al enviar voluntariamente
            cada formulario.
          </p>
        </Section>

        <Section title="3. Destinatarios y encargados del tratamiento">
          <p>
            Para prestar el servicio utilizamos los siguientes proveedores, que actúan como encargados del
            tratamiento y pueden alojar sus datos en servidores fuera del Espacio Económico Europeo, en cuyo
            caso cuentan con las garantías exigidas por el RGPD (cláusulas contractuales tipo u otro mecanismo
            equivalente):
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Netlify</strong> — alojamiento del sitio web y gestión de los formularios (Netlify Forms).</li>
            <li><strong>Supabase</strong> — almacenamiento de los mensajes de contacto y las pujas.</li>
            <li><strong>GoHighLevel (GHL)</strong> — gestión de la relación con el cliente (CRM) y envío de comunicaciones comerciales a los suscriptores de la newsletter.</li>
            <li><strong>Google Analytics</strong> — únicamente si usted acepta las cookies analíticas (ver sección de cookies).</li>
          </ul>
          <p>Sus datos no se cederán a terceros salvo obligación legal.</p>
        </Section>

        <Section title="4. Conservación de los datos">
          <p>
            Conservaremos sus datos mientras exista una relación con usted (por ejemplo, mientras esté
            suscrito a la newsletter) y, posteriormente, durante los plazos legalmente exigibles. Puede
            solicitar la supresión de sus datos en cualquier momento, tal y como se explica en la sección 6.
          </p>
        </Section>

        <Section title="5. Cookies">
          <p>
            Este sitio utiliza cookies propias, necesarias para su funcionamiento, y cookies analíticas de
            Google Analytics, que solo se instalan si usted las acepta expresamente mediante el banner de
            cookies. Puede cambiar su elección en cualquier momento borrando las cookies de su navegador, lo
            que volverá a mostrarle el banner en su próxima visita.
          </p>
        </Section>

        <Section title="6. Sus derechos">
          <p>
            Puede ejercer en cualquier momento sus derechos de acceso, rectificación, supresión, oposición,
            limitación del tratamiento y portabilidad de sus datos, escribiendo a{' '}
            <a href="mailto:info@loonacontemporary.com" className="text-emerald-600 hover:underline">
              info@loonacontemporary.com
            </a>{' '}
            e indicando el derecho que desea ejercer junto con una copia de un documento que acredite su
            identidad. También tiene derecho a retirar su consentimiento en cualquier momento y a presentar
            una reclamación ante la Agencia Española de Protección de Datos (www.aepd.es) si considera que el
            tratamiento no se ajusta a la normativa vigente.
          </p>
        </Section>

        <Section title="7. Seguridad">
          <p>
            Adoptamos las medidas técnicas y organizativas necesarias para garantizar la seguridad de los
            datos personales y evitar su alteración, pérdida, tratamiento o acceso no autorizado.
          </p>
        </Section>

        <Section title="8. Cambios en esta política">
          <p>
            Podemos actualizar esta política de privacidad para adaptarla a novedades legislativas o cambios
            en el funcionamiento del sitio. Le recomendamos revisarla periódicamente.
          </p>
        </Section>
      </div>
    </div>
  );
};

export default PoliticaPrivacidad;
