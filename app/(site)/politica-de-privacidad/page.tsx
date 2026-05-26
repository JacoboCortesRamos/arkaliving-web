import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de Privacidad | ARKA Living",
  description:
    "Política de privacidad y tratamiento de datos personales de ARKA Living, conforme a la Ley 1581 de 2012.",
};

export default function PoliticaPrivacidadPage() {
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
        Política de Privacidad
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

      <Section n="1" title="Responsable del tratamiento">
        <p>
          El responsable del tratamiento de los datos personales es ARKA Living
          (en adelante, "ARKA"), empresa dedicada a la gestión de propiedades
          para rentas cortas en Colombia.
        </p>
        <p>
          Contacto:
          <br />
          Correo electrónico: jacobocortes90@hotmail.com
          <br />
          WhatsApp: 3158254384
        </p>
        <p>
          ARKA actúa como responsable del tratamiento respecto de los datos
          recolectados a través de este sitio web.
        </p>
      </Section>

      <Section n="2" title="Datos personales que recolectamos">
        <p>ARKA podrá recolectar los siguientes datos:</p>
        <p>
          <strong>Datos de identificación:</strong>
        </p>
        <ul>
          <li>Nombre completo</li>
          <li>Correo electrónico</li>
          <li>Número de teléfono / WhatsApp</li>
        </ul>
        <p>
          <strong>Datos del inmueble:</strong>
        </p>
        <ul>
          <li>Ciudad y ubicación</li>
          <li>Características de la propiedad</li>
          <li>Estado de ocupación</li>
          <li>Fotografías</li>
        </ul>
        <p>
          <strong>Datos técnicos:</strong>
        </p>
        <ul>
          <li>Dirección IP</li>
          <li>Navegador</li>
          <li>Dispositivo</li>
          <li>Cookies y comportamiento en el sitio</li>
        </ul>
      </Section>

      <Section n="3" title="Finalidades del tratamiento">
        <p>Los datos personales serán utilizados para:</p>
        <ul>
          <li>Evaluar la postulación de propiedades</li>
          <li>Contactar al usuario</li>
          <li>Gestionar relaciones comerciales con propietarios</li>
          <li>Mejorar el sitio web y la experiencia del usuario</li>
          <li>Analizar el comportamiento de navegación</li>
          <li>Cumplir obligaciones legales</li>
        </ul>
        <p>ARKA no venderá ni comercializará los datos personales.</p>
      </Section>

      <Section n="4" title="Base legal del tratamiento">
        <p>El tratamiento de datos se realiza con base en:</p>
        <ul>
          <li>Autorización del titular</li>
          <li>Ejecución de una relación contractual o precontractual</li>
          <li>Cumplimiento de obligaciones legales</li>
        </ul>
      </Section>

      <Section n="5" title="Derechos del titular">
        <p>El titular de los datos tiene derecho a:</p>
        <ul>
          <li>Conocer, actualizar y rectificar sus datos</li>
          <li>Solicitar prueba de la autorización</li>
          <li>Ser informado sobre el uso de sus datos</li>
          <li>Revocar la autorización</li>
          <li>Solicitar la eliminación de sus datos (cuando aplique)</li>
        </ul>
        <p>
          Para ejercer estos derechos, el usuario puede contactar a ARKA a
          través de los canales indicados.
        </p>
      </Section>

      <Section n="6" title="Transferencia y uso de terceros">
        <p>
          ARKA utiliza servicios de terceros para operar el sitio, entre ellos:
        </p>
        <ul>
          <li>Cloudinary (almacenamiento de imágenes)</li>
          <li>Resend / servicios de email</li>
          <li>Google Analytics / GTM / Clarity (analítica)</li>
          <li>Cloudflare / Vercel (infraestructura)</li>
        </ul>
        <p>
          Estos proveedores pueden procesar datos en servidores fuera de
          Colombia. ARKA adopta medidas razonables para proteger la información.
        </p>
      </Section>

      <Section n="7" title="Uso de cookies">
        <p>El sitio utiliza cookies para:</p>
        <ul>
          <li>Analizar tráfico</li>
          <li>Recordar preferencias</li>
          <li>Mejorar la experiencia</li>
        </ul>
        <p>El usuario puede configurar su navegador para rechazarlas.</p>
      </Section>

      <Section n="8" title="Seguridad de la información">
        <p>
          ARKA implementa medidas técnicas y organizativas para proteger los
          datos, incluyendo:
        </p>
        <ul>
          <li>Acceso restringido</li>
          <li>Uso de proveedores seguros</li>
          <li>Protección contra accesos no autorizados</li>
        </ul>
        <p>Sin embargo, ningún sistema es completamente seguro.</p>
      </Section>

      <Section n="9" title="Conservación de datos">
        <p>Los datos serán conservados:</p>
        <ul>
          <li>Mientras exista relación con el usuario</li>
          <li>Durante el tiempo necesario para cumplir obligaciones legales</li>
          <li>O hasta que el titular solicite su eliminación</li>
        </ul>
      </Section>

      <Section n="10" title="Modificaciones">
        <p>ARKA podrá modificar esta política en cualquier momento.</p>
      </Section>

      <Section n="11" title="Legislación aplicable">
        <p>
          Esta política se rige por la legislación colombiana, en especial la
          Ley 1581 de 2012 y sus decretos reglamentarios.
        </p>
      </Section>

      <Section n="12" title="Contacto">
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
