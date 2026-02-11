// app/(public)/fee/layout.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Fee Structure & Payment - IPHSS',
  description: 'View our transparent fee structure for all classes from KG to 12th grade. Information on payment methods, scholarships, and financial assistance.',
  keywords: ['fee', 'tuition', 'payment', 'scholarship', 'financial aid', 'admission fee'],
  openGraph: {
    title: 'Fee Structure - Islamia Public Higher Secondary School',
    description: 'Transparent fee information and payment methods',
    type: 'website',
  },
  robots: {
    index: false,
    follow: true,
  },
};

export default function FeeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}