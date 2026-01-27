import HeroSection from "@/app/components/HeroSectio";
// Make sure the import path matches your folder structure

export default function Home() {
  return (
    <main className="min-h-screen w-full bg-background text-foreground">
      {/* Remove 'p-24' and 'flex-col' to allow full-screen sections */}
        <section className={' w-full h=screen '}>

      <HeroSection />
        </section>
    </main>
  );
}
