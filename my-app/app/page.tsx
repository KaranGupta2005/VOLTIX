import HeroSection from "@/app/components/HeroSectio";
import ClientsSection from "@/app/components/ClientSection";
import Feature1Section from "@/app/components/Feature1";
import Feature2Section from "@/app/components/Features2";
import PricingSection from "@/app/components/PricingSection";
import FooterSection from "@/app/components/FooterSection";
// Make sure the import path matches your folder structure

export default function Home() {
  return (
    <main className="min-h-screen w-full bg-background text-foreground">
      {/* Render sections one after another so scroll-based effects can work across the page */}
      <HeroSection />
      <ClientsSection />
      <Feature1Section />
      <Feature2Section />
      <PricingSection />
      <FooterSection />
    </main>
  );
}
