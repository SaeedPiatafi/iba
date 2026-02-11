// app/(public)/alumni/layout.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Alumni Network - IPHSS Graduates',
  description: 'Connect with our successful alumni network. See where our graduates are today and join the IPHSS alumni community.',
  keywords: ['alumni', 'graduates', 'former students', 'alumni network', 'success stories'],
  openGraph: {
    title: 'IPHSS Alumni Network',
    description: 'Connect with our successful graduates',
    type: 'website',
  },
};

export default function AlumniLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}