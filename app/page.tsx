import Header from '@/components/Header'
import HeroSection from '@/components/HeroSection'
import UpcomingRaces from '@/components/UpcomingRaces'
import DriversStandings from '@/components/DriversStandings'
import LiveTiming from '@/components/LiveTiming'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <UpcomingRaces />
        <DriversStandings />
        <LiveTiming />
      </main>
      <Footer />
    </>
  )
}