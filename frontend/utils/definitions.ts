// utils/definitions.ts  
  
// 根据 Prisma 模型定义的数据类型  
export type FilBlockID = number;  
export type FilBlockHeight = number;  
export type FilBlockRewardNodeId = string;  
export type FilBlockTime = Date;  
// export type FilBlockReward = number;  
export type FilBlockIsOurNode = boolean;  
  
// 定义 FilBlock 的完整类型  
export interface FilBlock {  
  id: FilBlockID;  
  blockHeight: FilBlockHeight;  
  rewardNodeId: FilBlockRewardNodeId;  
  blockTime: FilBlockTime;  
  // blockReward: FilBlockReward;  
  isOurNode: FilBlockIsOurNode;  
}  
  
// 如果需要在其他地方引用整个 fil_blocks 表的数据类型，可以导出 FilBlock 接口  
export type FilBlocksTableData = FilBlock[];

// 定义 Summary 表的数据结构
export interface Summary {
  id: number;
  blockHeight: number;
  hashRate: number;
  trade: number;
  liquidity: number;
}
