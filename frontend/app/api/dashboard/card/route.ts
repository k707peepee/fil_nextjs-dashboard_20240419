import { NextRequest } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

//
// 获取每个node_id的最新power、7天内power变化值、30天内power变化值
async function getPowerChanges() {
  const query = `
    WITH latest_data AS (
      SELECT 
          node_id,
          power,
          power_change_ratio_7_days,
          power_change_ratio_10_days,
          CASE 
              WHEN power_change_ratio_7_days >= 0 THEN 'increase'
              ELSE 'decrease'
          END AS changeType_7_days,
          CASE 
              WHEN power_change_ratio_10_days >= 0 THEN 'increase'
              ELSE 'decrease'
          END AS changeType_10_days,
          date,
          LAG(power, 7) OVER (PARTITION BY node_id ORDER BY date) AS prev_power_7_days,
          LAG(power, 10) OVER (PARTITION BY node_id ORDER BY date) AS prev_power_10_days,
          ROW_NUMBER() OVER (PARTITION BY node_id ORDER BY date DESC) AS rn
      FROM f_base.f_node_stats
  )
  SELECT 
      node_id,
      power,
      prev_power_7_days,
      power_change_ratio_7_days,
      changeType_7_days,
      prev_power_10_days,
      power_change_ratio_10_days,
      changeType_10_days
  FROM latest_data
  WHERE rn = 1;
  `;
  return (await pool.query(query)).rows;
}

export async function GET(req: NextRequest) {
  try {
    const powerChanges = await getPowerChanges();

    // 返回响应
    return new Response(JSON.stringify(powerChanges), {
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
