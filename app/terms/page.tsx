import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export const metadata = {
  title: "Términos y Condiciones - Carta Secreta",
  description: "Términos y Condiciones de uso de Carta Secreta.",
}

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 py-12 pb-16">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver al inicio
        </Link>

        <h1 className="font-serif text-2xl md:text-3xl font-semibold text-foreground mb-2">
          Términos y Condiciones de Uso
        </h1>
        <p className="text-sm text-muted-foreground mb-10">
          Última actualización: 14 de Febrero de 2024
        </p>

        <article className="prose prose-neutral dark:prose-invert max-w-none space-y-8 text-muted-foreground">
          <section>
            <h2 className="font-serif text-lg font-semibold text-foreground mb-2">
              1. Introducción y Aceptación
            </h2>
            <p>
              Bienvenido a Carta Secreta (en adelante, &quot;el Servicio&quot; o &quot;la Plataforma&quot;). Estos Términos y Condiciones (&quot;Términos&quot;) rigen el uso que haces de nuestro sitio web y servicios de envío de cartas digitales.
            </p>
            <p>
              El Servicio es operado por Liam Marega (en adelante &quot;Nosotros&quot; o &quot;el Titular&quot;), con domicilio legal en Calle 1375, Paraná, Entre Ríos, Argentina y correo electrónico de contacto liammaregadevelop@gmail.com.
            </p>
            <p>
              Al acceder o utilizar nuestro Servicio, aceptas estar legalmente vinculado por estos Términos. Si no aceptas alguno de estos puntos, por favor no utilices la Plataforma.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-lg font-semibold text-foreground mb-2">
              2. Descripción del Servicio
            </h2>
            <p>
              Carta Secreta es una plataforma digital que permite a los usuarios:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Crear y personalizar cartas digitales.</li>
              <li>Enviar dichas cartas a terceros vía correo electrónico.</li>
              <li>Acceder a funciones &quot;PRO&quot; o &quot;Premium&quot; mediante un pago único, que incluyen: programación de envíos, temas exclusivos, subida de imágenes y personalización avanzada.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-lg font-semibold text-foreground mb-2">
              3. Elegibilidad y Uso Aceptable
            </h2>
            <p>
              Para usar el Servicio, declaras que eres mayor de edad según la legislación de tu país de residencia o que cuentas con la autorización de tus padres o tutores legales.
            </p>
            <p>
              Te comprometes a NO utilizar el Servicio para:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Enviar contenido ilegal, amenazante, acosador, difamatorio, obsceno o que incite al odio.</li>
              <li>Realizar spam o enviar correos no solicitados de forma masiva.</li>
              <li>Hacerse pasar por otra persona o entidad.</li>
              <li>Intentar vulnerar la seguridad de la Plataforma o inyectar virus/malware.</li>
            </ul>
            <p>
              Nos reservamos el derecho de eliminar cualquier carta y bloquear el acceso a usuarios que violen estas normas, sin derecho a reembolso.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-lg font-semibold text-foreground mb-2">
              4. Cuentas y Seguridad
            </h2>
            <p>
              Si el Servicio requiere registro, eres responsable de mantener la confidencialidad de tus credenciales. Eres responsable de toda actividad que ocurra bajo tu cuenta. Debes notificarnos inmediatamente sobre cualquier uso no autorizado.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-lg font-semibold text-foreground mb-2">
              5. Servicios de Pago (Funciones PRO)
            </h2>
            <p>
              Ciertas características (como temas Premium, programación de fecha, subida de fotos) requieren el pago de una tarifa única.
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Pagos:</strong> Los pagos se procesan a través de proveedores externos seguros (ej. Stripe, Mercado Pago). Nosotros no almacenamos tus datos bancarios completos.</li>
              <li><strong>Naturaleza del Bien:</strong> Al comprar una carta Premium, estás adquiriendo una licencia de uso de contenido digital.</li>
              <li><strong>Política de Reembolsos:</strong> Dado que el producto es un bien digital de consumo inmediato o personalizado, no se ofrecen reembolsos una vez que la carta ha sido enviada o el diseño ha sido descargado/generado, salvo que exista una falla técnica comprobable imputable a nuestra Plataforma que impida el envío.</li>
              <li><strong>Cambios de Precio:</strong> Nos reservamos el derecho de modificar los precios de los servicios PRO en cualquier momento.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-lg font-semibold text-foreground mb-2">
              6. Contenido del Usuario y Licencia
            </h2>
            <p>
              Tú conservas los derechos de propiedad intelectual sobre el texto y las imágenes que subas a tus cartas (&quot;Contenido del Usuario&quot;).
            </p>
            <p>
              Sin embargo, al enviar una carta, nos otorgas una licencia mundial, no exclusiva y libre de regalías para:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Almacenar, procesar y mostrar tu contenido únicamente con el fin de prestar el servicio (ej: generar la carta y enviarla al destinatario).</li>
              <li>Realizar copias de seguridad técnicas.</li>
            </ul>
            <p>
              <strong>Importante:</strong> Tú eres el único responsable del contenido de tus cartas. Carta Secreta actúa como un mero intermediario técnico y no modera preventivamente los mensajes privados.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-lg font-semibold text-foreground mb-2">
              7. Envíos Programados y Disponibilidad
            </h2>
            <p>
              Para las cartas con &quot;Envío Programado&quot; (función PRO):
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Hacemos nuestros mejores esfuerzos técnicos para asegurar que la carta llegue en la fecha y hora seleccionadas (basado en la zona horaria configurada).</li>
              <li>No obstante, debido a la naturaleza de internet, filtros de spam de los proveedores de correo (Gmail, Outlook, etc.) y posibles latencias de servidores, no garantizamos la entrega en el segundo exacto.</li>
              <li>No nos hacemos responsables si el correo llega a la carpeta de &quot;Spam&quot; o &quot;Correo no deseado&quot; del destinatario.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-lg font-semibold text-foreground mb-2">
              8. Propiedad Intelectual del Titular
            </h2>
            <p>
              Todos los derechos sobre el diseño de la web, el código fuente, los logotipos, las ilustraciones de los temas (templates), la música predeterminada y la marca Carta Secreta son propiedad exclusiva de Liam Marega o de sus licenciantes. Está prohibida su reproducción, distribución o modificación sin autorización expresa.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-lg font-semibold text-foreground mb-2">
              9. Limitación de Responsabilidad
            </h2>
            <p>
              El Servicio se proporciona &quot;tal cual&quot; y &quot;según disponibilidad&quot;. En la máxima medida permitida por la ley aplicable (y específicamente bajo la Ley de Defensa del Consumidor de Argentina):
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>No seremos responsables por daños indirectos, incidentales o consecuentes derivados del uso o la imposibilidad de uso del servicio.</li>
              <li>No garantizamos que el servicio sea ininterrumpido o esté libre de errores.</li>
              <li>No somos responsables de las consecuencias emocionales o relacionales derivadas del envío o recepción de las cartas.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-lg font-semibold text-foreground mb-2">
              10. Privacidad
            </h2>
            <p>
              El tratamiento de tus datos personales (nombre, email, dirección IP) se rige por nuestra Política de Privacidad. Al usar el servicio, aceptas dicho tratamiento para los fines de funcionamiento de la aplicación.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-lg font-semibold text-foreground mb-2">
              11. Ley Aplicable y Jurisdicción
            </h2>
            <p>
              Estos Términos se rigen por las leyes de la República Argentina. Cualquier disputa relacionada con estos Términos o el Servicio se someterá a la jurisdicción exclusiva de los Tribunales Ordinarios de la ciudad de Paraná, Entre Ríos, renunciando a cualquier otro fuero que pudiera corresponder.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-lg font-semibold text-foreground mb-2">
              12. Contacto
            </h2>
            <p>
              Si tienes preguntas sobre estos términos, por favor contáctanos en:
            </p>
            <ul className="list-none pl-0 space-y-1">
              <li><strong>Email:</strong> liammaregadevelop@gmail.com</li>
              <li><strong>Dirección:</strong> Calle 1375, Paraná, Entre Ríos, Argentina.</li>
            </ul>
          </section>
        </article>

        <footer className="mt-12 pt-8 border-t border-border text-center space-y-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al inicio
          </Link>
          <p className="text-sm text-muted-foreground">© 2026 ValentineDayLetter by Liam Marega</p>
          <div className="flex flex-wrap justify-center gap-6 text-xs text-muted-foreground">
            <Link href="/pricing" className="hover:underline">Precios</Link>
            <Link href="/terms" className="hover:underline">Terms &amp; Conditions</Link>
            <Link href="/privacy" className="hover:underline">Privacy Policy</Link>
            <Link href="/refund" className="hover:underline">Refund Policy</Link>
          </div>
        </footer>
      </div>
    </main>
  )
}
