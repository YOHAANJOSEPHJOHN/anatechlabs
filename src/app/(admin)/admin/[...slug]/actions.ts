
'use server';

import { tableConfig } from './config';
import { query } from '@/lib/mysql';

export async function getData(slug: string, searchParams: { [key: string]: string | undefined }) {
    // DEV/STUDIO ONLY: Return empty data in non-production environments to avoid DB errors.
    if (process.env.NODE_ENV !== 'production') {
        console.log(`DEV/STUDIO MODE: Skipping MySQL connection for admin table: ${slug}. Returning empty data.`);
        const page = parseInt(searchParams.page || '1', 10);
        return { data: [], totalPages: 0, currentPage: page, totalCount: 0 };
    }
    
    const config = tableConfig[slug];
    if (!config) {
        return { data: [], totalPages: 0, currentPage: 1, totalCount: 0, error: 'Invalid configuration for this view.' };
    }

    const ITEMS_PER_PAGE = 20;
    const page = parseInt(searchParams.page || '1', 10);
    const offset = (page - 1) * ITEMS_PER_PAGE;
    
    const search = searchParams.search || '';
    const from = searchParams.from;
    const to = searchParams.to;
    const status = searchParams.status;
    const country = searchParams.country;

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

        return {
            data: dataResult as any[],
            totalPages,
            currentPage: page,
            totalCount
        };
    } catch (error) {
        console.error("Failed to fetch admin table data:", error);
        return { data: [], totalPages: 0, currentPage: 1, totalCount: 0, error: (error as Error).message };
    }
}
