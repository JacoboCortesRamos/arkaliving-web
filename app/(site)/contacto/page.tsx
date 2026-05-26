import { ContactoPage } from "@/components/contacto/ContactoPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contacto | ARKA Living",
  description:
    "Contáctanos para gestión de rentas cortas en Santa Marta y Bogotá. Resolvemos tus dudas y te asesoramos sin compromiso.",
};

export default function Page() {
  return <ContactoPage />;
}
