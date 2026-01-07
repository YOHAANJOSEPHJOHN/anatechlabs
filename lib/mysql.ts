
import mysql from 'mysql2/promise';

/**
 * @file Database connection and query utility.
 * @summary This file configures and exports connection pools for multiple MySQL databases
 * and provides a unified query function. Firebase data services are not used in this application.
 */

// --- Connection Pools ---

/**
 * @description Main database pool for general application data, admin, and authentication.
 * Corresponds to the 'u115797407_anatechlabs_db' database.
 */
const mainDbPool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME_MAIN,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

/**
 * @description SSP database pool dedicated to the Sample Submission Portal.
 * Corresponds to the 'u115797407_anatechlabs_ss' database.
 * This pool supports transactions for multi-step order submissions.
 */
const sspDbPool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME_SSP,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Note: A third database 'u115797407_anatechlabs_au' was mentioned but is not
// currently used in the application code. It can be added here if needed.

export const db = {
  main: mainDbPool,
  ssp: sspDbPool
};

// --- Unified Query Function ---

/**
 * Executes a SQL query against the specified database pool.
 * @param dbName - The name of the database pool to use ('main' or 'ssp').
 * @param sql - The SQL query string.
 * @param params - An array of parameters to be escaped and inserted into the query.
 * @returns A promise that resolves with the query results.
 * @throws An error if the query fails.
 */
export async function query(dbName: 'main' | 'ssp', sql: string, params: any[] = []) {
  try {
    const pool = db[dbName];
    const [rows] = await pool.execute(sql, params);
    return rows;
  } catch (error) {
    console.error(`Database query failed on ${dbName} DB:`, error);
    throw new Error(`MySQL query failed: ${(error as Error).message}`);
  }
}
