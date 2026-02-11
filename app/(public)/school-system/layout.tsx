// app/(public)/school-system/layout.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'School System & Structure - IPHSS',
  description: 'Learn about our academic structure, grading system, curriculum, co-curricular activities, and educational approach at IPHSS.',
  keywords: ['school system', 'academic structure', 'curriculum', 'grading system', 'co-curricular', 'educational approach'],
  openGraph: {
    title: 'School System - IPHSS Academic Structure',
    description: 'Our curriculum and educational approach',
    type: 'website',
  },
};

export default function SchoolSystemLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}