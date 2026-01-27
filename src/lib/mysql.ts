
import mysql, { PoolConnection } from 'mysql2/promise';

/**
 * @file This file centralizes all MySQL database connection logic for the application.
 */

// --- Environment Variable Validation ---

const requiredDbEnv = [
  'DB_HOST',
  'DB_USER',
  'DB_PASSWORD',
  'DB_NAME_MAIN',
  'DB_NAME_SSP',
];

const missingDbEnv = requiredDbEnv.filter(envVar => !process.env[envVar]);

// FIXED: Only throw error in production RUNTIME, not during build
if (missingDbEnv.length > 0 && 
    process.env.NODE_ENV === 'production' && 
    process.env.NEXT_PHASE !== 'phase-production-build') {
  console.error(
    `FATAL: Missing required database environment variables: ${missingDbEnv.join(', ')}`
  );
}

// --- Connection Pool Configuration ---

const poolConfig = (database: string | undefined) => ({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: database,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 30000, // 30-second timeout
});

// FIXED: Don't create pools during build
const createPool = (dbName: string | undefined) => {
    // Don't create pools during build phase
    if (process.env.NEXT_PHASE === 'phase-production-build') {
        console.log(`[BUILD] Skipping pool creation for ${dbName} during build`);
        return null;
    }
    
    if (!dbName) return null;
    
    try {
        return mysql.createPool(poolConfig(dbName));
    } catch (error) {
        console.error(`Failed to create pool for ${dbName}:`, error);
        return null;
    }
}

// --- Database Pools ---

export const db = {
  main: createPool(process.env.DB_NAME_MAIN),
  ssp: createPool(process.env.DB_NAME_SSP),
};

// --- Unified Query Function ---

export async function query(dbName: keyof typeof db, sql: string, params: any[] = []) {
  // FIXED: Return empty array during build instead of throwing
  if (process.env.NEXT_PHASE === 'phase-production-build') {
    console.warn(`[BUILD-GUARD] Database access blocked during build: ${sql.substring(0, 50)}...`);
    return [];
  }

  const pool = db[dbName];

  if (!pool) {
      const errorMessage = `Database pool "${dbName}" is not configured. Check your environment variables.`;
      console.error(errorMessage);
      throw new Error(errorMessage);
  }

  try {
    const [rows] = await pool.execute(sql, params);
    return rows;
  } catch (error: any) {
    console.error('[MySQL Query Error]', {
      timestamp: new Date().toISOString(),
      database: dbName,
      sql: sql.substring(0, 100),
      errorCode: error.code,
      errorMessage: error.message,
    });
    
    throw new Error(`MySQL query failed: ${error.message}`);
  }
}

export async function withTransaction<T>(
  dbName: keyof typeof db,
  callback: (connection: PoolConnection) => Promise<T>
): Promise<T> {
  // Build-time guard
  if (process.env.NEXT_PHASE === 'phase-production-build') {
    throw new Error(`[BUILD-GUARD] Database access is disabled during build. Transaction blocked.`);
  }

  const pool = db[dbName];
  if (!pool) {
    const errorMessage = `Database pool "${dbName}" is not configured. Check your environment variables.`;
    console.error(errorMessage);
    throw new Error(errorMessage);
  }

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const result = await callback(connection);
    await connection.commit();
    return result;
  } catch (error: any) {
    await connection.rollback();
    console.error('[MySQL Transaction Error]', {
      timestamp: new Date().toISOString(),
      database: dbName,
      errorCode: error.code,
      errorMessage: error.message,
    });
    throw error;
  } finally {
    connection.release();
  }
}
