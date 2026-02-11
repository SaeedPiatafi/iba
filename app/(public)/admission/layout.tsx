// app/(public)/admission/layout.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admissions - Join IPHSS',
  description: 'Admission process, requirements, forms, and deadlines for Islamia Public Higher Secondary School. Apply now for KG to 12th grade.',
  keywords: ['admission', 'admission form', 'apply', 'enrollment', 'admission process', 'requirements'],
  openGraph: {
    title: 'Admissions - Islamia Public Higher Secondary School',
    description: 'Apply for admission from KG to 12th grade',
    type: 'website',
  },
};

export default function AdmissionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}