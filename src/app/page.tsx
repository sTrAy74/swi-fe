import Hero from "../components/Hero";
import WealthSection from "../components/WealthSection";
import WhyNow from "../components/WhyNow";
import Knowledge from "../components/Knowledge";
import Process from "../components/Process";
import GovtSupport from "../components/GovtSupport";
import Calculator from "../components/Calculator";
import Testimonials from "../components/Testimonials";
import FAQs from "../components/FAQs";
import FinalCTA from "../components/FinalCTA";
import Footer from "../components/Footer";
import CleanEnergy from "../components/CleanEnergy";

export default function Home() {
  return (
    <main className="bg-white text-black">
      <Hero />
      <WealthSection />
      <WhyNow />
      <Knowledge />
      <CleanEnergy />
      <Process />
      <GovtSupport />
      <Calculator />
      <Testimonials />
      <FAQs />
      <FinalCTA />
      <Footer />
    </main>
  );
}
