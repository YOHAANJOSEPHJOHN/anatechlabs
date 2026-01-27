
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const revalidate = 0;

import AdminDashboardClient from '@/components/admin/AdminDashboardClient';

export default function AdminPage() {
  return <AdminDashboardClient />;
}
