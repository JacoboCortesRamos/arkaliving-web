import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Términos y condiciones | ARKA Living",
  description: "Términos y condiciones de uso del sitio web de ARKA Living.",
};

export default function TerminosPage() {
  return (
    <main
      style={{
        padding: "calc(var(--header-h) + 48px) var(--edge-space) 100px",
        maxWidth: 780,
        margin: "0 auto",
      }}
    >
      <h1
        style={{
          fontFamily: "var(--font-display, Georgia, serif)",
          fontSize: "clamp(28px, 4vw, 40px)",
          fontWeight: 700,
          color: "var(--arka-brown-dark)",
          marginBottom: 8,
        }}
      >
        Términos y condiciones de uso
      </h1>
      <p
        style={{
          fontSize: 13,
          color: "var(--arka-text-soft)",
          marginBottom: 48,
        }}
      >
        Última actualización: 2026/04/01
      </p>

      <Section n="1" title="Identificación del responsable">
        <p>
          El presente sitio web es operado por ARKA Living (en adelante,
          "ARKA"), empresa dedicada a la gestión y administración de propiedades
          para rentas cortas en Colombia, principalmente en las ciudades de
          Santa Marta y Bogotá.
        </p>
        <p>
          ARKA actúa como operador y administrador de inmuebles por cuenta de
          terceros (propietarios), conforme a contratos de mandato,
          administración u otros acuerdos equivalentes.
        </p>
        <p>
          Canales de contacto:
          <br />
          Correo electrónico: jacobocortes90@hotmail.com
          <br />
          WhatsApp: 3158254384
        </p>
      </Section>

      <Section n="2" title="Objeto del sitio web">
        <p>El sitio web tiene como finalidad:</p>
        <ul>
          <li>Informar sobre los servicios de ARKA</li>
          <li>Mostrar propiedades administradas</li>
          <li>Facilitar la postulación de propietarios</li>
          <li>Redirigir a plataformas externas para reservas</li>
          <li>Servir como canal de contacto</li>
        </ul>
        <p>El uso del sitio implica la aceptación de estos Términos.</p>
      </Section>

      <Section n="3" title="Naturaleza del servicio">
        <p>ARKA no es propietaria de los inmuebles publicados.</p>
        <p>ARKA actúa como:</p>
        <ul>
          <li>
            Administrador, operador y gestor comercial de propiedades para
            rentas cortas
          </li>
          <li>
            Mandatario del propietario para efectos de gestión operativa y,
            cuando aplique, recaudo de ingresos
          </li>
        </ul>
        <p>En este modelo:</p>
        <ul>
          <li>
            ARKA gestiona perfiles en plataformas externas (Airbnb, Booking,
            etc.)
          </li>
          <li>
            ARKA puede recibir pagos de huéspedes, ya sea directa o
            indirectamente a través de dichas plataformas
          </li>
          <li>
            ARKA centraliza los ingresos y realiza liquidaciones periódicas al
            propietario
          </li>
        </ul>
        <p>ARKA podrá:</p>
        <ul>
          <li>Administrar tarifas, disponibilidad y operación del inmueble</li>
          <li>Recaudar pagos en nombre del propietario</li>
          <li>Descontar comisiones y costos previamente acordados</li>
          <li>Transferir el saldo correspondiente al propietario</li>
        </ul>
        <p>En todos los casos:</p>
        <ul>
          <li>
            El servicio de alojamiento es prestado por el propietario del
            inmueble
          </li>
          <li>
            ARKA no adquiere la calidad de hotel, arrendador ni proveedor
            directo del hospedaje
          </li>
        </ul>
      </Section>

      <Section n="4" title="Uso del sitio web">
        <p>El usuario se compromete a:</p>
        <ul>
          <li>Utilizar el sitio conforme a la ley</li>
          <li>No interferir con su funcionamiento</li>
          <li>No intentar accesos no autorizados</li>
          <li>No introducir software malicioso</li>
        </ul>
        <p>ARKA podrá restringir accesos en caso de uso indebido.</p>
      </Section>

      <Section n="5" title="Registro y veracidad de la información">
        <p>Los usuarios que postulen propiedades deben:</p>
        <ul>
          <li>Suministrar información veraz y completa</li>
          <li>Tener legitimidad sobre el inmueble</li>
          <li>
            Garantizar cumplimiento normativo (incluyendo propiedad horizontal)
          </li>
        </ul>
        <p>ARKA podrá:</p>
        <ul>
          <li>Verificar la información</li>
          <li>Solicitar documentación</li>
          <li>Rechazar postulaciones sin obligación de motivación</li>
        </ul>
      </Section>

      <Section n="6" title="Información publicada">
        <p>La información del sitio:</p>
        <ul>
          <li>Puede provenir de terceros o fuentes externas</li>
          <li>Puede contener errores o cambios</li>
        </ul>
        <p>ARKA no garantiza exactitud absoluta ni actualización permanente.</p>
      </Section>

      <Section n="7" title="Reservas, disponibilidad y plataformas externas">
        <p>
          Las reservas pueden gestionarse mediante plataformas externas o
          canales definidos por ARKA.
        </p>
        <p>ARKA:</p>
        <ul>
          <li>
            Administra la disponibilidad, pero puede existir desincronización
          </li>
          <li>
            Utiliza herramientas como iCal u otras integraciones, que no son en
            tiempo real
          </li>
        </ul>
        <p>Por lo tanto:</p>
        <ul>
          <li>Puede haber errores de disponibilidad</li>
          <li>Puede presentarse overbooking</li>
        </ul>
        <p>
          ARKA no garantiza la disponibilidad en tiempo real ni la ausencia de
          conflictos de reserva.
        </p>
      </Section>

      <Section n="8" title="Recaudo y gestión de pagos">
        <p>ARKA podrá recibir pagos de huéspedes en nombre del propietario.</p>
        <p>En estos casos:</p>
        <ul>
          <li>
            ARKA actúa como administrador de recursos por cuenta de terceros
          </li>
          <li>
            Los valores recaudados no constituyen ingresos propios de ARKA en su
            totalidad
          </li>
          <li>
            ARKA realizará liquidaciones periódicas al propietario según
            contrato
          </li>
        </ul>
        <p>ARKA podrá:</p>
        <ul>
          <li>Retener comisiones</li>
          <li>Descontar costos operativos</li>
          <li>
            Aplicar ajustes o compensaciones según condiciones contractuales
          </li>
        </ul>
        <p>Los tiempos de transferencia pueden depender de:</p>
        <ul>
          <li>Plataformas externas</li>
          <li>Procesadores de pago</li>
          <li>Validaciones operativas</li>
        </ul>
      </Section>

      <Section n="9" title="Exclusión de responsabilidad">
        <p>ARKA no será responsable por:</p>
        <ul>
          <li>Fallos de plataformas externas</li>
          <li>Errores en disponibilidad o reservas</li>
          <li>Problemas derivados de sincronización de calendarios</li>
          <li>Interrupciones del sitio</li>
          <li>Decisiones tomadas por los usuarios</li>
        </ul>
      </Section>

      <Section n="10" title="Limitación de responsabilidad">
        <p>ARKA no será responsable por:</p>
        <ul>
          <li>Daños indirectos o consecuenciales</li>
          <li>Pérdida de ingresos o expectativas económicas</li>
          <li>Eventos derivados del uso del inmueble</li>
        </ul>
        <p>Para propietarios:</p>
        <ul>
          <li>ARKA no garantiza ocupación ni ingresos</li>
          <li>Los resultados dependen del mercado y del inmueble</li>
        </ul>
      </Section>

      <Section n="11" title="Propiedad intelectual">
        <p>
          Todo el contenido del sitio es propiedad de ARKA o cuenta con
          autorización. Se prohíbe su uso sin consentimiento previo.
        </p>
      </Section>

      <Section n="12" title="Cookies y analítica">
        <p>
          El sitio utiliza herramientas de analítica (GA4, GTM u otras) para
          mejorar la experiencia del usuario. El uso del sitio implica la
          aceptación del uso de cookies.
        </p>
      </Section>

      <Section n="13" title="Protección de datos">
        <p>
          ARKA trata datos personales conforme a la normativa colombiana. El
          detalle del tratamiento se encuentra en la{" "}
          <a
            href="/politica-de-privacidad"
            style={{
              color: "var(--arka-brown-mid)",
              textDecoration: "underline",
            }}
          >
            Política de Privacidad
          </a>
          .
        </p>
      </Section>

      <Section n="14" title="Uso de WhatsApp">
        <p>
          ARKA puede ofrecer contacto mediante WhatsApp. El usuario acepta el
          uso de esta plataforma de terceros y sus condiciones.
        </p>
      </Section>

      <Section n="15" title="Pagos futuros y condiciones adicionales">
        <p>
          ARKA podrá implementar nuevos mecanismos de pago. Estos podrán
          implicar:
        </p>
        <ul>
          <li>Integración con pasarelas</li>
          <li>Nuevas condiciones contractuales</li>
          <li>Validaciones adicionales</li>
        </ul>
      </Section>

      <Section n="16" title="Modificaciones">
        <p>ARKA podrá modificar estos términos en cualquier momento.</p>
      </Section>

      <Section n="17" title="Legislación aplicable">
        <p>Se rigen por la ley colombiana.</p>
      </Section>

      <Section n="18" title="Contacto">
        <p>
          Correo: jacobocortes90@hotmail.com
          <br />
          WhatsApp: 3158254384
        </p>
      </Section>
    </main>
  );
}

function Section({
  n,
  title,
  children,
}: {
  n: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section style={{ marginBottom: 40 }}>
      <h2
        style={{
          fontFamily: "var(--font-display, Georgia, serif)",
          fontSize: "clamp(17px, 2.2vw, 21px)",
          fontWeight: 700,
          color: "var(--arka-brown-dark)",
          marginBottom: 12,
          paddingBottom: 8,
          borderBottom: "1px solid rgba(200,166,122,0.3)",
        }}
      >
        {n}. {title}
      </h2>
      <div
        style={{
          fontSize: 15,
          lineHeight: 1.75,
          color: "var(--arka-text-soft)",
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        {children}
      </div>
    </section>
  );
}
