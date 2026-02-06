// app/web-admin/login/layout.tsx
import { ReactNode } from 'react';

export default function LoginLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      {children}
    </div>
  );
}

export const metadata = {
  title: 'Admin Login',
  description: 'Admin portal login page',
};