// app\api\summary\route.ts  
  
import prisma from "@/prisma"; // 从 "@/prisma" 导入 Prisma 客户端  
import { NextResponse } from "next/server"; // 从 "next/server" 导入 NextResponse 类  
import { connectToDb } from "@/utils"; // 假设这是连接数据库的工具函数  
import { Summary } from "@/utils/definitions"; // 导入 Summary 数据结构  
import { extractSummaryData } from "@/utils/data"; // 导入提取数据的函数  
  
// 获取 summary 表中的最新一行数据  
export const GET = async (req: Request) => {  
  try {  
    await connectToDb(); // 连接数据库  
  
    // 使用 orderBy 和 take 来获取最新的一行数据  
    const summaryResult: Summary | null = await prisma.summary.findFirst({  
      orderBy: {  
        blockHeight: 'desc' // 按照区块高度降序排列，获取最新的数据  
      }  
    });  
  
    if (!summaryResult) {  
      // 如果没有找到数据，返回空对象或者适当的错误信息  
      return NextResponse.json({ error: '没有找到摘要数据' }, { status: 404 });  
    }  
  
    // 使用 extractSummaryData 函数提取所需的字段值  
    const { blockHeight, hashRate, trade, liquidity } = extractSummaryData(summaryResult);  
  
    // 返回处理后的数据  
    return NextResponse.json({  
      blockHeight,  
      hashRate,  
      trade,  
      liquidity  
    }, { status: 200 });  
  } catch (error: any) {  
    console.log(error);  
    return NextResponse.json({ error: error.message }, { status: 500 });  
  }  
};
