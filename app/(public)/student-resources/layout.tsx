// app/(public)/student-resources/layout.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Student Resources - IPHSS',
  description: 'Access study materials, syllabus, timetables, exam schedules, library resources, and academic support for IPHSS students.',
  keywords: ['resources', 'study materials', 'syllabus', 'timetable', 'library', 'academic support'],
  openGraph: {
    title: 'Student Resources - IPHSS',
    description: 'Study materials and academic support for students',
    type: 'website',
  },
  robots: {
    index: false,
    follow: true,
  },
};

export default function StudentResourcesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}