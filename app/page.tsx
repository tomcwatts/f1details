import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import UpcomingRaces from "@/components/UpcomingRaces";
import DriversStandings from "@/components/DriversStandings";
import LiveTiming from "@/components/LiveTiming";
import CircuitVisualization from "@/components/CircuitVisualization";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <UpcomingRaces />
        {/*<section className="py-12 bg-gray-900">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-white mb-8 f1-text-glow">
              Circuit Showcase
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <CircuitVisualization circuitId="monaco" interactive />
              <CircuitVisualization circuitId="silverstone" interactive />
              <CircuitVisualization circuitId="monza" interactive />
              <CircuitVisualization circuitId="spa" interactive />
              <CircuitVisualization circuitId="bahrain" interactive />
              <CircuitVisualization circuitId="suzuka" interactive />
              <CircuitVisualization circuitId="interlagos" interactive />
              <CircuitVisualization circuitId="austin" interactive />
            </div>
          </div>
        </section>*/}
        <DriversStandings />
        {/*<LiveTiming />*/}
      </main>
      <Footer />
    </>
  );
}
