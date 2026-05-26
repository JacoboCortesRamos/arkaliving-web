import { Hero } from "../../components/home/Hero";
import { FloatingCTA } from "../../components/home/FloatingCTA";
import { SectionBeneficios } from "../../components/home/SectionBeneficios";
import { SectionFrase } from "../../components/home/SectionFrase";
import { SectionPasos } from "../../components/home/SectionPasos";
import { SectionCasoExito } from "../../components/home/SectionCasoExito";

export default function Page() {
  return (
    <>
      <Hero />
      <SectionBeneficios />
      <SectionFrase />
      <SectionPasos />
      <SectionCasoExito />
      <FloatingCTA />
    </>
  );
}
