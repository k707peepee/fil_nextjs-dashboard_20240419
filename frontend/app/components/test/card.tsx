'use client';

import { Card } from '@/app/ui/dashboard/cards';
import RevenueChart from '@/app/ui/dashboard/revenue-chart';
import LatestInvoices from '@/app/ui/dashboard/latest-invoices';
import { lusitana } from '@/app/ui/fonts';
import { Summary } from '@/utils/definitions';
import React, { useState, useEffect } from 'react';
 
export default function CardPage() {
  const [summaryData, setSummaryData] = useState<null | { blockHeight: number; hashRate: number; trade: number; liquidity: number }>(null);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/summary', { method: 'GET' });
        if (!response.ok) {
          throw new Error('获取数据失败');
      }
      const summary: { blockHeight: number; hashRate: number; trade: number; liquidity: number } = await response.json();


        setSummaryData(summary);

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData(); // 调用 fetchData 函数  
  }, []); // 确保 useEffect 只运行一次  
  
  if (summaryData === null) {  
    // 在数据加载期间显示加载指示器或其他内容  
    return <div>Loading...</div>;  
  }


  return (
    <main>
      {/* <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Dashboard
      </h1> */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card title="区块高度" value={summaryData.blockHeight} type="collected" />
        <Card title="当前算力" value={summaryData.hashRate} type="pending" />
        <Card title="交易数量" value={summaryData.trade} type="invoices" />
        <Card title="流动数量" value={summaryData.liquidity} type="customers"
        />
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
        {/* <RevenueChart revenue={revenue}  /> */}
        {/* <LatestInvoices latestInvoices={latestInvoices} /> */}
      </div>
    </main>
  );
}
