// app/(public)/champs/layout.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AKU-EB Toppers & Achievers - IPHSS',
  description: 'Celebrating our top-performing students in AKU-EB examinations. Meet our academic champions and their outstanding achievements.',
  keywords: ['toppers', 'achievers', 'AKU-EB', 'board toppers', 'academic excellence', 'merit list'],
  openGraph: {
    title: 'AKU-EB Toppers - IPHSS Academic Excellence',
    description: 'Celebrating our top-performing students',
    type: 'article',
  },
};

export default function ChampsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}