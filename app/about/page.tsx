// app/page.tsx
import AboutHeroSection from "../components/abouthero";
import About from "../components/about";
import Principlemessage from "../components/principlemessage";
import WhyChooseUs from "../components/chooseus";
import Vision from '../components/vision'
export default function Home() {
  return (
    <main>
      {/* <Header /> */}
      <AboutHeroSection/>
      <About/>
      <Principlemessage/>
      <WhyChooseUs/>
      <Vision/>
    </main>
  );
}