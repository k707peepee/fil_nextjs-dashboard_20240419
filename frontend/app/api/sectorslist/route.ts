import { NextResponse } from "next/server";
import { Pool } from 'pg';
import crypto from 'crypto';

// 创建 PostgreSQL 数据库连接池
const pool = new Pool({
    connectionString: process.env.DATABASE_URL, // 替换成你的数据库连接字符串
});

// 定义一个函数，将数字转换为哈希值
function hashSectorId(sectorId: number): string {
    return crypto.createHash('sha256').update(String(sectorId)).digest('hex');
}

export const GET = async (req: Request) => {
    try {
        // 连接数据库
        const client = await pool.connect();

        // 获取今天的日期
        const today = new Date();
        const todayString = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`;

        // 执行 SQL 查询语句
        const result = await client.query(`
            SELECT 
                node_id,
                sectorid,
                expiration_date,
                CASE 
                    WHEN expire30 ='1' THEN '是'
                    ELSE '否'
                END AS expire30,
                deals,
                updatedate
            FROM 
                f_base.f_sector_details
            WHERE 
                updatedate = $1
	    ORDER BY  
                updatedate DESC  
            LIMIT 10000;
        `, [todayString]);

        // 释放数据库连接
        client.release();

        // 对数据进行转换和处理
        const processedSectors = result.rows.map(sector => ({
            ...sector,
            // 将 sectorid 转换为哈希值
            sectorid: hashSectorId(sector.sectorid),
        }));

        return NextResponse.json({
            sectors: processedSectors,
        }, { status: 200 });
    } catch (error: any) {
        console.log(error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
};
