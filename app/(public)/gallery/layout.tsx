// app/(public)/gallery/layout.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Photo Gallery - IPHSS Campus Life',
  description: 'View photos and videos of our campus, facilities, events, activities, and student life at Islamia Public Higher Secondary School.',
  keywords: ['gallery', 'photos', 'pictures', 'campus', 'events', 'activities'],
  openGraph: {
    title: 'Photo Gallery - IPHSS Campus Life',
    description: 'View our campus, facilities, and student activities',
    type: 'website',
  },
};

export default function GalleryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}