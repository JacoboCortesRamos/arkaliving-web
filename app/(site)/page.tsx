import { Hero } from "@/components/home/Hero";
import { SectionValue } from "@/components/home/SectionValue";
import { SectionSteps } from "@/components/home/SectionSteps";
import { SectionPropertiesPreview } from "@/components/home/SectionPropertiesPreview";

export default function HomePage() {
  return (
    <>
      <Hero />
      <SectionValue />
      <SectionSteps />
      <SectionPropertiesPreview />

      {/* Sección 4: Footer ya existe como bloque final en layout */}
      <div id="s4" />
    </>
  );
}
