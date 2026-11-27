import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Features from "../components/Features";
import HowItWorks from "../components/HowItWorks";
import Marquee from "../components/Marquee";
import ChatBot from "../components/ChatBot";
import AIInsights from "../components/AIInsights";
import { UseCases, TeamSection, CTASection, Footer } from "../components/LandingComponents";

const Index = () => (
  <div className="min-h-screen bg-white text-ink overflow-x-hidden">
    <Navbar overlay />
    <main>
      <Hero />
      <Marquee />
      <Features />
      <HowItWorks />
      <AIInsights />
      <UseCases />
      <TeamSection />
      <CTASection />
    </main>
    <Footer />
    <ChatBot />
  </div>
);

export default Index;
