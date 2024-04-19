//@ts-nocheck  
// 这是一个TypeScript指令，表示以下的代码不进行类型检查，通常用于避免TypeScript编译器报错  
  
import { PrismaClient } from "@prisma/client";  
// 从@prisma/client模块中导入PrismaClient类，PrismaClient是Prisma框架提供的用于与数据库交互的客户端  
  
let prisma: PrismaClient;  
// 声明一个变量prisma，其类型为PrismaClient  
  
declare global {  
// 使用declare global关键字扩展全局命名空间  
    namespace NodeJS {  
    // 扩展NodeJS的全局命名空间  
        interface Global {  
        // 扩展Global接口  
            prisma: PrismaClient;  
        // 在Global接口中新增一个名为prisma的属性，其类型为PrismaClient  
        }  
    }  
}  
  
if (process.env.NODE_ENV === "production") {  
// 判断环境变量NODE_ENV是否等于"production"，如果是生产环境  
    prisma = new PrismaClient();  
// 则在当前作用域内创建PrismaClient实例并赋值给prisma变量  
} else {  
// 否则，如果不是生产环境  
    if (!global.prisma) {  
    // 检查全局对象global上是否存在prisma属性，如果不存在  
        global.prisma = new PrismaClient();  
    // 则在全局对象上创建PrismaClient实例并赋值给prisma属性  
    }  
    prisma = global.prisma;  
// 将全局对象上的prisma属性赋值给当前作用域内的prisma变量  
}

export default prisma;