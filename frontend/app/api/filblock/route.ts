import prisma from "@/prisma";
import { NextResponse } from "next/server";
import { connectToDb } from "@/utils";
import { createTableData } from "@/utils/data";
import crypto from 'crypto';

// 定义一个函数，将数字转换为哈希值
function hashBlockHeight(blockHeight: number): string {
    return crypto.createHash('sha256').update(String(blockHeight)).digest('hex');
}

// 定义一个函数，格式化blockTime为年月日小时分钟
function formatBlockTime(blockTime: Date): string {
    return new Intl.DateTimeFormat('default', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false // 使用24小时制
    }).format(blockTime);
}

export const GET = async (req: Request) => {
    try {
        await connectToDb();
        const filBlocks = await prisma.filBlock.findMany({
            take: 20000,
            orderBy: {
                blockTime: 'desc',
            },
        });

        // 将blockHeight转换为哈希值，并格式化blockTime
        const processedFilBlocks = filBlocks.map(block => ({
            ...block,
            blockHeight: hashBlockHeight(block.blockHeight),
            blockTime: formatBlockTime(new Date(block.blockTime)), // 格式化blockTime
        }));

        // 使用 createTableData 函数处理processedFilBlocks数据
        // const { myBlock, otherBlock } = createTableData(processedFilBlocks);
        const { myBlock } = createTableData(processedFilBlocks);

        return NextResponse.json({
            myBlock,
            // otherBlock,
        }, { status: 200 });
    } catch (error: any) {
        console.log(error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
};
