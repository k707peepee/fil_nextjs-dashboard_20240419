import { promises as fs } from "fs";

const crypto = require('crypto');

export class Block {
  public index: number;
  public timestamp: number;
  public data: string;
  public prevHash: string;
  public hash: string; // 初始时哈希为空，将在之后计算

  constructor(index: number, data: string, prevHash = '') {
    this.index = index;
    this.timestamp = Date.now();
    this.data = data;
    this.prevHash = prevHash;
    this.hash = this.calculateHash(); // 不再需要await，因为calculateHash现在是同步的
  }

  calculateHash(): string {
    const str = `${this.index}${this.timestamp}${this.data}${this.prevHash}`;
    const hash = crypto.createHash('sha256').update(str).digest('hex');
    return hash;
  }

  DataHash(): string {
    const str = `i am data',${this.index}${this.timestamp}${this.data}${this.prevHash}`;
    const hash = crypto.createHash('sha256').update(str).digest('hex');
    return hash;
  }
}

export class Blockchain {
  public chain: Block[];

  constructor() {
    this.chain = [this.createGenesisBlock()];
  }

  createGenesisBlock(): Block {
    console.log('createGenesisBlock....')
    const genesisBlock = new Block(226599, 'Genesis Block', '');
    genesisBlock.hash = ''; // 假定创世区块的哈希值，在实际应用中应计算
    return genesisBlock;
  }

  getLatestBlock(): Block {
    return this.chain[this.chain.length - 1];
  }

  async addBlock(newBlock: Block): Promise<void> {
    // 获取新区块的索引，即最后一个区块的索引加1
    newBlock.index = this.getLatestBlock().index + 1;
    newBlock.data = await newBlock.DataHash();
    newBlock.prevHash = this.getLatestBlock().hash;
    newBlock.hash = await newBlock.calculateHash();
    this.chain.push(newBlock);


  }

  // 验证区块链的完整性（简化版本）
  async isChainValid(): Promise<boolean> {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const prevBlock = this.chain[i - 1];

      // 重新计算当前区块的哈希值进行验证
      if (currentBlock.hash !== currentBlock.calculateHash()) {
        return false;
      }

      // 检查区块是否正确链接到前一个区块
      if (currentBlock.prevHash !== prevBlock.hash) {
        return false;
      }
    }

    return true; // 如果所有检查都通过，则返回true
  }



}

// 导出区块链实例
export const myBlockchain = new Blockchain();

