import HeroSection from "@/components/Hero";          // Hero.js
import AboutSection from "@/components/About";        // About.js
import Featured from "@/components/Featured";         // Featured.js
import CardContent from "@/components/CardContent"; // Cards/CardContent.js

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
