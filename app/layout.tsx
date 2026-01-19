// app/layout.tsx
import type { Metadata } from 'next';
import { Inter, Poppins, Montserrat, Open_Sans } from 'next/font/google';
import './globals.css';
import Header from './components/header';
import Footer from './components/footer'

// Import multiple fonts for better typography hierarchy
const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
});

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-montserrat',
  display: 'swap',
});

const openSans = Open_Sans({
  subsets: ['latin'],
  variable: '--font-open-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'eLEARNING - Transform Your Education Journey',
  description: 'Premium online learning platform with expert instructors, interactive courses, and flexible learning paths.',
  keywords: 'online learning, education, courses, e-learning, skills development',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable} ${montserrat.variable} ${openSans.variable}`}>
      <body className={`${inter.className} min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-white antialiased`}>
        <Header />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}