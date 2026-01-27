
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { tableConfig } from '@/app/(admin)/admin/[...slug]/config';
import { query } from '@/lib/mysql';

export async function GET(request: NextRequest, { params }: { params: { slug: string[] } }) {
    // The build-time guard is now handled by the centralized mysql.ts module.
    // We can remove environment-specific checks from this file.
    
    const slug = params.slug.join('/');
    const searchParams = request.nextUrl.searchParams;

    const config = tableConfig[slug];
    if (!config) {
        return NextResponse.json({ error: 'Invalid configuration for this view.' }, { status: 404 });
    }

    const ITEMS_PER_PAGE = 20;
    const page = parseInt(searchParams.get('page') || '1', 10);
    const offset = (page - 1) * ITEMS_PER_PAGE;
    
    const search = searchParams.get('search') || '';
    const from = searchParams.get('from');
    const to = searchParams.get('to');
    const status = searchParams.get('status');
    const country = searchParams.get('country');

    let whereClauses: string[] = [];
    let queryParams: any[] = [];

    if (search && config.searchColumns.length > 0) {
        const searchClause = config.searchColumns.map(col => `\`${col}\` LIKE ?`).join(' OR ');
        whereClauses.push(`(${searchClause})`);
        config.searchColumns.forEach(() => queryParams.push(`%${search}%`));
    }

    if (from && to && config.dateColumn) {
        whereClauses.push(`\`${config.dateColumn}\` BETWEEN ? AND ?`);
        queryParams.push(from, `${to} 23:59:59`);
    } else if (from && config.dateColumn) {
        whereClauses.push(`\`${config.dateColumn}\` >= ?`);
        queryParams.push(from);
    } else if (to && config.dateColumn) {
        whereClauses.push(`\`${config.dateColumn}\` <= ?`);
        queryParams.push(`${to} 23:59:59`);
    }
    
    if (status && status !== 'all' && config.filterColumns?.includes('status')) {
        whereClauses.push('`status` = ?');
        queryParams.push(status);
    }
    
    if (country && config.filterColumns?.includes('country')) {
        whereClauses.push('`country` = ?');
        queryParams.push(country);
    }

    const whereSql = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';
    const countSql = `SELECT COUNT(*) as total FROM \`${config.table}\` ${whereSql}`;
    const dataSql = `SELECT * FROM \`${config.table}\` ${whereSql} ORDER BY ${config.dateColumn || 'id'} DESC LIMIT ? OFFSET ?`;
    
    try {
        const [countResult, dataResult] = await Promise.all([
            query(config.db, countSql, queryParams),
            query(config.db, dataSql, [...queryParams, ITEMS_PER_PAGE, offset])
        ]);
        
        const totalCount = (countResult as any)?.[0]?.total ?? 0;
        const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

        return NextResponse.json({
            data: dataResult as any[],
            totalPages,
            currentPage: page,
            totalCount
        });
    } catch (error) {
        console.error("Failed to fetch admin table data:", error);
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}
