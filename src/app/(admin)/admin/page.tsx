
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

import AdminDashboardClient from '@/components/admin/AdminDashboardClient';

export default function AdminDashboardPage() {
  return <AdminDashboardClient />;
}
