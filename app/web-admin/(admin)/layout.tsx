import { ReactNode } from 'react';
import AdminNavbar from '@/app/components/adminheader';
import { validateAuthToken } from '@/app/lib/jwt-utils';
import { redirect } from 'next/navigation';

interface AdminLayoutProps {
  children: ReactNode;
}

export default async function AdminLayout({ children }: AdminLayoutProps) {
  const user = await validateAuthToken();
  
  if (!user) {
    redirect('/web-admin/login');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar user={user} />
      <main className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  );
}