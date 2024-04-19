import { NextRequest } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// 获取最近个node_id的lucky_value_7_days和lucky_value_30_days值
async function getLatestLuckValues() {
  const query = `
    SELECT 
      node_id,
      MAX(date) AS date,
      MAX(lucky_value_7_days) AS lucky_value_7_days,
      MAX(lucky_value_30_days) AS lucky_value_30_days
    FROM f_base.f_node_stats
    GROUP BY node_id
  `;
  return (await pool.query(query)).rows;
}

export async function GET(req: NextRequest) {
  try {
    const latestLuckValues = await getLatestLuckValues();

    // 返回响应
    return new Response(JSON.stringify(latestLuckValues), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Database query error', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
