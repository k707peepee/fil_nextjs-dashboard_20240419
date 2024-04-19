'use client';
import React, { useEffect, useState } from 'react';
import { CubeTransparentIcon } from '@heroicons/react/24/outline';
import { Block, myBlockchain } from '@/utils/blockchain'; // 确保路径与你的文件结构相匹配

interface IBlock {
  index: number;
  timestamp: number;
  data: string;
  prevHash: string;
  hash: string;
}

const BlockBrowser: React.FC = () => {
  const [blocks, setBlocks] = useState<IBlock[]>([]);

  // 加载区块链数据
  useEffect(() => {
    const loadBlockchainData = async () => {
      console.log('Loading blockchain data...');
      const response = await fetch('/api/blockbrowser/loadBlockchain');
      if (!response.ok) {
        console.error('Failed to load blockchain data');
        return;
      }
      console.log('Blockchain data loaded:', response.body);
      const data = await response.json();
      setBlocks(data.reverse());
    };

    loadBlockchainData();
  }, []);

  // 添加新区块并保存
  const addBlockAutomatically = async () => {
    const newBlockData = `Block ${blocks.length + 1}`;
    const newBlock = new Block(blocks.length, newBlockData, blocks[blocks.length - 1]?.hash || '');
    await myBlockchain.addBlock(newBlock);
    console.log('New block added:', newBlock);
    setBlocks([...myBlockchain.chain].reverse());
    await saveBlockchainData();
   
  };

  // 保存区块链数据
  const saveBlockchainData = async () => {
    await fetch('/api/blockbrowser/saveBlockchain', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(myBlockchain.chain),
      
    
    });
  };

  // 设置定时器以自动添加区块
  useEffect(() => {
    console.log('Setting interval...');


    const intervalId = setInterval(() => {
      addBlockAutomatically().catch(console.error);
    }, 5000); // 每5秒添加一个新区块

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="p-4 flex-auto">
      <div className='flex mb-2 items-center'>
        <CubeTransparentIcon className="h-8 w-8 text-gray-500 mr-2" />
        <h1 className="text-3xl font-bold">RTFChain Blockchain</h1>
      </div>
      <div className="mt-4">
        <span>
          Mining the value of medical data makes it no longer difficult for people to see a doctor.
        </span>
      </div>
      {blocks.map((block, index) => (
        <div key={index} className="mt-2 mb-2 p-4 shadow rounded bg-gray-100">
          <p>Index: {block.index}</p>
          <p>Timestamp: {new Date(block.timestamp).toLocaleString()}</p>
          <p>Data: {block.data}</p>
          <p>PrevHash: {block.prevHash}</p>
          <p>Hash: {block.hash}</p>
        </div>
      ))}
    </div>
  );
};

export default BlockBrowser;

