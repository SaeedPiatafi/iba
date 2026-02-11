// import Header from './(public)/components/header';
import About from "../components/about";
import Teacher from "../components/teacher";
import Testimonial from "../components/testimonial";
import AccedamicOverview from "../components/accedamic-overview";
import type { Metadata } from 'next';


export const metadata: Metadata = {
  title: 'Home Page - IBA-IPHSS',
  description: 'Welcome to Islamia public higher secondary school',
  keywords: ['nextjs', 'react', 'typescript'],
  openGraph: {
    title: 'Home Page - IBA-IPHSS',
    description: 'Welcome to Islamia public higher secondary school',
    type: 'website',
  },
};

export default function Home() {
  return (
    <main>
      {/* <Header /> */}
      <About />
      <AccedamicOverview />
      <Teacher />
      <Testimonial />
    </main>
  );
}
