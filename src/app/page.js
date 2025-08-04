import HeroSection from "@/components/Hero";
import AboutSection from "@/components/About";
import Featured from "@/components/Featured";
import CardContent from "@/components/CardContent";

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <AboutSection />
      <Featured />
      <CardContent />
    </main>
  );
}