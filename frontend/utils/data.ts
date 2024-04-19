// utils/data.ts  
  
import {  
    FilBlock,  
    FilBlockHeight,  
    FilBlockRewardNodeId,  
    FilBlockTime,  
    // FilBlockReward,  
    FilBlockIsOurNode,  
    FilBlocksTableData  
  } from './definitions';  
    
  // 假设这个函数是用来根据一些条件生成表格数据的  
  // export const createTableData = (filBlocks: FilBlocksTableData): { myBlock: FilBlocksTableData, otherBlock: FilBlocksTableData } => {  
  export const createTableData = (filBlocks: FilBlocksTableData): { myBlock: FilBlocksTableData} => {
    // 根据 isOurNode 字段对 filBlocks 进行分类  
    const myBlock = filBlocks.filter(block => block.isOurNode === true);  
    // const otherBlock = filBlocks.filter(block => block.isOurNode === false);  
    
    return {  
      myBlock,  
      // otherBlock  
    };  
  };  
    
  // 示例函数，用于处理 FilBlock 数据  
  export const processFilBlock = (filBlock: FilBlock): void => {  
    // 这里可以添加处理 FilBlock 数据的逻辑  
    console.log('Processing FilBlock:', filBlock);  
  };  
    
  // 示例函数，用于验证 FilBlock 数据的有效性  
  export const validateFilBlock = (filBlock: FilBlock): boolean => {  
    // 这里可以添加验证 FilBlock 数据的逻辑  
    // 例如，检查字段是否存在，是否符合预期的类型等  
    return true; // 假设这里总是返回 true，实际中应该有验证逻辑  
  };  
    

import { Summary } from './definitions';  

// 函数用于从 Summary 对象中提取所需字段的值  
export function extractSummaryData(summary: Summary) {  
  const { blockHeight, hashRate, trade, liquidity } = summary;  
  return {  
    blockHeight,  
    hashRate,  
    trade,  
    liquidity,  
  };  
}
