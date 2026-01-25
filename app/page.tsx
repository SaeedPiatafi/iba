"use client"
// import Header from './(public)/components/header';
import About from "./components/about";
import Teacher from "./components/teacher";
import Testimonial from "./components/testimonial";
import AccedamicOverview from "./components/accedamic-overview";
export default function Home() {
  return (
    <main>
      {/* <Header /> */}
      <About/>
      <AccedamicOverview />
      <Teacher/>
      <Testimonial/>
    </main>
  );
}