import type { Metadata } from "next";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";

export const metadata: Metadata = {
  title: "Términos y condiciones",
  description: "Términos y condiciones de uso de la web pública de Matchpoint.",
};

export default function TerminosYCondicionesPage() {
  return (
    <div className="flex min-h-screen flex-col bg-mp-bg">
      <SiteHeader variant="detail" title="Términos y condiciones" />
      <main
        id="main-content"
        className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 sm:px-6 lg:max-w-[42rem] lg:px-8"
        tabIndex={-1}
      >
        <div className="space-y-6 text-sm leading-relaxed text-mp-text-secondary">
          <p className="text-mp-text">
            El acceso y uso de esta aplicación web pública de Matchpoint implica la aceptación de las
            siguientes condiciones generales.
          </p>
          <section>
            <h2 className="mb-2 text-base font-semibold text-mp-text">Información y datos</h2>
            <p>
              Los datos de torneos, equipos y partidos se obtienen de la API pública de Matchpoint y se
              muestran con fines informativos. No garantizamos la disponibilidad continua del servicio ni
              la ausencia de errores en los datos mostrados.
            </p>
          </section>
          <section>
            <h2 className="mb-2 text-base font-semibold text-mp-text">Uso permitido</h2>
            <p>
              Queda prohibido el uso de esta web para fines ilícitos, el intento de acceso no autorizado a
              sistemas o datos, o cualquier uso que pueda dañar la infraestructura o a terceros.
            </p>
          </section>
          <section>
            <h2 className="mb-2 text-base font-semibold text-mp-text">Enlaces externos</h2>
            <p>
              Los enlaces a sitios de terceros (por ejemplo Miralab) son independientes de Matchpoint; su
              contenido y políticas son responsabilidad de sus titulares.
            </p>
          </section>
          <section>
            <h2 className="mb-2 text-base font-semibold text-mp-text">Modificaciones</h2>
            <p>
              Podemos actualizar estos términos ocasionalmente. La versión vigente será la publicada en
              esta página.
            </p>
          </section>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
