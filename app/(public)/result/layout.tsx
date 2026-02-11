// app/(public)/result/layout.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Results & Examination - IPHSS',
  description: 'Check examination results, academic performance, and board results for AKU-EB and Sindh Board. View toppers and academic achievements.',
  keywords: ['results', 'examination', 'marksheet', 'board results', 'AKU-EB results', 'Sindh Board'],
  openGraph: {
    title: 'Examination Results - IPHSS',
    description: 'Check academic results and achievements',
    type: 'website',
  },
};

export default function ResultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}