
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

import AdminTablePageClient from '@/components/admin/AdminTablePageClient';

export default function AdminTablePage({ params }: { params: { slug: string[] } }) {
  return <AdminTablePageClient params={params} />;
}
