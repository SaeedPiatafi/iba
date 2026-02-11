import Principlemessage from "../../components/principlemessage";
import WhyChooseUs from "../../components/chooseus";
import Vision from "../../components/vision";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us - Islamia Public Higher Secondary School',
  description: 'Learn about our history, mission, vision, and values. Discover why IPHSS is a premier educational institution managed by IBA Sukkur University.',
  keywords: ['about', 'history', 'mission', 'vision', 'facilities', 'IBA Sukkur'],
  openGraph: {
    title: 'About Islamia Public Higher Secondary School',
    description: 'Our history, mission, and educational philosophy',
    type: 'article',
  },
};
export default function Home() {
  return (
    <main>
      <Principlemessage />
      <WhyChooseUs />
      <Vision />
    </main>
  );
}
