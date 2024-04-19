// app/api/LabelLineChart/route.ts

import { NextRequest } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// 获取过去30天内每个节点的最高power记录
async function getHighestPowerLast30DaysPerNode() {
  const query = `
    SELECT node_id, date, MAX(power) as power FROM f_base.f_node_stats
    WHERE date > current_date - INTERVAL '30 days'
    GROUP BY node_id, date
    ORDER BY node_id, power DESC, date ASC;
  `;
  return (await pool.query(query)).rows;
}

// 获取过去30天内每个节点的最低power记录
async function getLowestPowerLast30DaysPerNode() {
  const query = `
    SELECT node_id, date, MIN(power) as power FROM f_base.f_node_stats
    WHERE date > current_date - INTERVAL '30 days'
    GROUP BY node_id, date
    ORDER BY node_id, power ASC, date ASC;
  `;
  return (await pool.query(query)).rows;
}

// 获取最近30天的每个节点的所有记录
async function getLast30DaysDataPerNode() {
  const query = `
    SELECT node_id, date, power FROM f_base.f_node_stats
    WHERE date > current_date - INTERVAL '30 days'
    ORDER BY node_id, date ASC;
  `;
  return (await pool.query(query)).rows;
}

export async function GET(req: NextRequest) {
  try {
    const [highest, lowest, last30DaysData] = await Promise.all([
      getHighestPowerLast30DaysPerNode(),
      getLowestPowerLast30DaysPerNode(),
      getLast30DaysDataPerNode(),
    ]);

    // 合并查询结果
    const result = {
      highest,
      lowest,
      last30DaysData,
    };

    // 返回响应
    return new Response(JSON.stringify(result), {
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

