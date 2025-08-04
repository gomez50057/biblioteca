import HeroSection from "@/components/Hero";
import AboutSection from "@/components/About";
import Featured from "@/components/Featured";

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <AboutSection />
      <Featured />
    </main>
  );
}