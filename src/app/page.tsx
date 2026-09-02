import type { Metadata } from "next";
import TopNav from "@/components/TopNav";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import ScrollProgress from "@/components/ScrollProgress";
import ScrollReveal from "@/components/ScrollReveal";
import Hero from "@/components/redesign/Hero";
import Lineage from "@/components/redesign/Lineage";
import ReefsMap from "@/components/redesign/ReefsMap";
import MarineSlab from "@/components/redesign/MarineSlab";
import DivingCards from "@/components/redesign/DivingCards";
import SafetyQuote from "@/components/redesign/SafetyQuote";
import BedouinMoment from "@/components/redesign/BedouinMoment";
import LiveFromReef from "@/components/redesign/LiveFromReef";
import AnaReview from "@/components/redesign/AnaReview";
import CommonQuestions from "@/components/redesign/CommonQuestions";
import GalleryPreview from "@/components/redesign/GalleryPreview";
import SayHello from "@/components/redesign/SayHello";

export const metadata: Metadata = {
  title:
    "OsamaDives. PADI Master Scuba Diver Trainer in Dahab, Egypt. Since 1983.",
  description:
    "Osama is a PADI Master Scuba Diver Trainer in Dahab, Egypt. Pioneer family in Dahab since 1983. Dive the Red Sea, the Blue Hole, the Canyon, and Ras Abu Galum with a lifelong local.",
};

const sections = [
  { id: "hero", label: "Hero" },
  { id: "story", label: "Story" },
  { id: "reefs", label: "Reefs" },
  { id: "diving", label: "Diving" },
  { id: "live", label: "Live" },
  { id: "review", label: "Review" },
  { id: "questions", label: "Questions" },
  { id: "gallery-preview", label: "Gallery" },
  { id: "say-hello", label: "Say hello" },
];

export default function Home() {
  return (
    <main className="bg-abyss text-white">
      <TopNav />
      <ScrollProgress sections={sections} />
      <ScrollReveal />
      <Hero />
      <Lineage />
      <ReefsMap />
      <MarineSlab />
      <DivingCards />
      <SafetyQuote />
      <BedouinMoment />
      <LiveFromReef />
      <AnaReview />
      <CommonQuestions />
      <GalleryPreview />
      <SayHello />
      <Footer />
      <FloatingWhatsApp />
    </main>
  );
}
