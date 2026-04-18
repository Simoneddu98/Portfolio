import { Nav } from "@/components/ui/Nav";
import { SmoothScrollProvider } from "@/components/ui/SmoothScrollProvider";
import { SectionReveal } from "@/components/ui/SectionReveal";
import { HeroSection } from "@/components/sections/HeroSection";
import { IndexSection } from "@/components/sections/IndexSection";
import { IntroSection } from "@/components/sections/IntroSection";
import { MetodoSection } from "@/components/sections/MetodoSection";
import { ToolSection } from "@/components/sections/ToolSection";
import { ServiziSection } from "@/components/sections/ServiziSection";
import { WorksSection } from "@/components/sections/WorksSection";
import { CertificazioniSection } from "@/components/sections/CertificazioniSection";
import { ContattiSection } from "@/components/sections/ContattiSection";
import { Footer } from "@/components/sections/Footer";

export default function Home() {
  return (
    <SmoothScrollProvider>
      <Nav />
      <main>
        <HeroSection />
        <SectionReveal><IndexSection /></SectionReveal>
        <SectionReveal><IntroSection /></SectionReveal>
        <SectionReveal><MetodoSection /></SectionReveal>
        <SectionReveal><ToolSection /></SectionReveal>
        <SectionReveal><ServiziSection /></SectionReveal>
        <SectionReveal><WorksSection /></SectionReveal>
        <SectionReveal><CertificazioniSection /></SectionReveal>
        <SectionReveal><ContattiSection /></SectionReveal>
      </main>
      <SectionReveal><Footer /></SectionReveal>
    </SmoothScrollProvider>
  );
}
