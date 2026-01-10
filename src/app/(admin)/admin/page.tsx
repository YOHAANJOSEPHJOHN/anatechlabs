import { notFound } from 'next/navigation';
import { tableConfig } from './config';
import { getData } from './actions';
import ClientTablePage from './ClientTablePage';

export default async function AdminTablePage({
  params,
  searchParams,
}: {
  params: { slug: string[] };
  searchParams: { [key: string]: string | undefined };
}) {
  const slug = params.slug.join('/');
  const config = tableConfig[slug];

  if (!config) {
    notFound();
  }

  const initialData = await getData(slug, searchParams);

  return (
    <ClientTablePage
      slug={slug}
      config={config}
      initialData={initialData.data}
      initialTotalPages={initialData.totalPages}
      initialCurrentPage={initialData.currentPage}
      initialTotalCount={initialData.totalCount}
      initialError={initialData.error ?? null}
    />
  );
}
