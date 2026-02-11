// app/(public)/teachers/layout.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Our Faculty - Experienced Teaching Staff',
  description: 'Meet our qualified and experienced teaching faculty at Islamia Public Higher Secondary School. Expert educators committed to student success.',
  keywords: ['teachers', 'faculty', 'staff', 'educators', 'teaching staff'],
  openGraph: {
    title: 'Our Teaching Faculty - IPHSS',
    description: 'Meet our qualified and experienced educators',
    type: 'profile',
  },
};

export default function TeachersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}