// app/page.tsx
// import Header from './(public)/components/header';
import Hero from "./components/hero";
import Services from "./components/services";
import About from "./components/about";
import Teacher from "./components/teacher";
import Testimonial from "./components/testimonial";
export default function Home() {
  return (
    <main>
      {/* <Header /> */}
      <Hero/>
      <Services/>
      <About/>
      <Teacher/>
      <Testimonial/>
    </main>
  );
}