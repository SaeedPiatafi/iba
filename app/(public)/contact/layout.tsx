// app/(public)/contact/layout.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us - IPHSS',
  description: 'Get in touch with Islamia Public Higher Secondary School. Find our location, contact numbers, email addresses, and inquiry form.',
  keywords: ['contact', 'address', 'phone', 'email', 'location', 'inquiry'],
  openGraph: {
    title: 'Contact Islamia Public Higher Secondary School',
    description: 'Get in touch with our administration',
    type: 'website',
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}