// 从 "@/prisma" 导入 prisma 实例，它提供了与数据库交互的方法  
import prisma  from "@/prisma";  
  
// 定义一个异步函数 connectToDb，用于连接数据库  
export const connectToDb = async () => {  
    try {  
        // 等待 prisma 的 $connect() 方法执行，该方法用于建立与数据库的连接  
        await prisma.$connect();  
        console.log("数据库连接成功");
    } catch (error: any) {  
        // 如果连接过程中发生错误，捕获该错误，并返回一个包含错误信息的新 Error 对象  
        console.log("数据库连接失败:", error.message);
        return new Error(error.message);  
    }  
};