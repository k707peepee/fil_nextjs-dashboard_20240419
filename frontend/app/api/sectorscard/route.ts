import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// 获取每个node_id的sector 当前总数，以及7天内扇区变化和变化百分比
async function getSectorChanges7Days() {
  const query = `
    SELECT 
    node_id,
    MAX(sector_sum) AS sector_current,
    (
        SELECT sector_sum 
        FROM f_base.f_sector_summary 
        WHERE 
            node_id = s.node_id 
            AND updatedate = CURRENT_DATE - INTERVAL '7 days'
    ) AS sector_sum_7days_ago,
    MAX(sector_sum) - (
        SELECT sector_sum 
        FROM f_base.f_sector_summary 
        WHERE 
            node_id = s.node_id 
            AND updatedate = CURRENT_DATE - INTERVAL '7 days'
    ) AS sector_change_7days,
    CASE 
        WHEN (
            SELECT sector_sum 
            FROM f_base.f_sector_summary 
            WHERE 
                node_id = s.node_id 
                AND updatedate = CURRENT_DATE - INTERVAL '7 days'
        ) IS NOT NULL 
        THEN ROUND(
                (MAX(sector_sum) - (
                    SELECT sector_sum 
                    FROM f_base.f_sector_summary 
                    WHERE 
                        node_id = s.node_id 
                        AND updatedate = CURRENT_DATE - INTERVAL '7 days'
                ))::NUMERIC(10, 2) / (
                    SELECT sector_sum 
                    FROM f_base.f_sector_summary 
                    WHERE 
                        node_id = s.node_id 
                        AND updatedate = CURRENT_DATE - INTERVAL '7 days'
                )::NUMERIC(10, 2), 
                2
            )
        ELSE NULL
    END AS sector_change_percentage_7days
  FROM 
    f_base.f_sector_summary s
  WHERE 
    updatedate >= CURRENT_DATE - INTERVAL '6 days' -- 只考虑最近7天的数据
  GROUP BY 
    node_id;

    `;
    return (await pool.query(query)).rows;
  }

  // 获取每个node_id的sector 当前总数，以及30天内扇区变化和变化百分比
  async function getSectorChanges30Days() {
    const query = `
    SELECT 
    node_id,
    MAX(sector_sum) AS sector_current,
    (
        SELECT sector_sum 
        FROM f_base.f_sector_summary 
        WHERE 
            node_id = s.node_id 
            AND updatedate = CURRENT_DATE - INTERVAL '30 days'
    ) AS sector_sum_30days_ago,
    MAX(sector_sum) - (
        SELECT sector_sum 
        FROM f_base.f_sector_summary 
        WHERE 
            node_id = s.node_id 
            AND updatedate = CURRENT_DATE - INTERVAL '30 days'
    ) AS sector_change_30days,
    CASE 
        WHEN (
            SELECT sector_sum 
            FROM f_base.f_sector_summary 
            WHERE 
                node_id = s.node_id 
                AND updatedate = CURRENT_DATE - INTERVAL '30 days'
        ) IS NOT NULL 
        THEN ROUND(
                (MAX(sector_sum) - (
                    SELECT sector_sum 
                    FROM f_base.f_sector_summary 
                    WHERE 
                        node_id = s.node_id 
                        AND updatedate = CURRENT_DATE - INTERVAL '30 days'
                ))::NUMERIC(10, 2) / (
                    SELECT sector_sum 
                    FROM f_base.f_sector_summary 
                    WHERE 
                        node_id = s.node_id 
                        AND updatedate = CURRENT_DATE - INTERVAL '30 days'
                )::NUMERIC(10, 2), 
                2
            )
        ELSE NULL
    END AS sector_change_percentage_30days
FROM 
    f_base.f_sector_summary s
WHERE 
    updatedate >= CURRENT_DATE - INTERVAL '29 days' -- 只考虑最近30天的数据
GROUP BY 
    node_id;

  `;
  return (await pool.query(query)).rows;
}

// 获取每个node_id低于1月的扇区数
async function getLowSectorCount() {
  const query = `
    SELECT 
    node_id,
    MAX(expiration_sum) AS expiration_sum_current,
    MAX(sector_sum) AS sector_sum_current,
    CASE 
        WHEN MAX(sector_sum) <> 0 
        THEN (MAX(expiration_sum) / MAX(sector_sum) * 100.0)::NUMERIC(10, 2)
        ELSE NULL
    END AS expiration_sum_percentage
  FROM 
    f_base.f_sector_summary
  WHERE 
    updatedate >= CURRENT_DATE
  GROUP BY 
    node_id;

  `;
  return (await pool.query(query)).rows;
}

export async function GET(req: NextRequest) {
  try {
    // 获取每个node_id的sector 当前总数，7天内扇区变化和变化百分比
    const sectorChanges7Days = await getSectorChanges7Days();

    // 获取每个node_id的sector 当前总数，30天内扇区变化和变化百分比
    const sectorChanges30Days = await getSectorChanges30Days();

    // 获取每个node_id低于1月的扇区数
    const lowSectorCount = await getLowSectorCount();

    // 将所有结果组合成一个对象
    const result = {
      sectorChanges7Days,
      sectorChanges30Days,
      lowSectorCount,
    };

    // 返回响应
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('Database query error', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
