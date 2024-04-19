'use client';

import React, { useState, useEffect } from 'react';
import Pagination from '../Pagination'; // 引入 Pagination 组件

// 定义Sector的数据类型
type Sector = {
  node_id: string;
  sectorid: string;
  expiration_date: string;
  expire30: string;
  deals: string;
  updatedate: Date;
};

export default function SectorsList() {
    const [sectors, setSectors] = useState<Sector[]>([]);
    const [page, setPage] = useState(1); // 当前页码
    const [totalItems, setTotalItems] = useState(0); // 总数据条数
    const itemsPerPage = 15; // 每页显示的数据条数

    useEffect(() => {
        // 获取数据
        const fetchData = async () => {
            try {
                const response = await fetch('/api/sectorslist', { method: 'GET' });
                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }
                const { sectors } = await response.json();
                setSectors(sectors);
                setTotalItems(sectors.length);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData(); // 获取数据

    }, [page]); // 当页码变化时重新获取数据

    // 处理页码变化的回调函数
    const handlePageChange = (pageNumber: number) => {
        setPage(pageNumber);
    };

    return (
        <div>
            <h2 className="text-lg font-semibold mb-4">Sector List</h2>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="py-2 px-4 text-center align-middle">节点号</th>
                            <th className="py-2 px-4 text-center align-middle">扇区哈希</th>
                            <th className="py-2 px-4 text-center align-middle">有效期</th>
                            <th className="py-2 px-4 text-center align-middle">30天到期</th>
                            <th className="py-2 px-4 text-center align-middle">数据类型</th>
                            <th className="py-2 px-4 text-center align-middle">更新日期</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sectors.map((sector, index) => (
                            <tr key={index} className="border-b">
                                <td className="py-2 px-4 text-center align-middle">{sector.node_id.slice(-3)}</td>
                                <td className="py-2 px-4 text-center align-middle">{sector.sectorid}</td>
                                <td className="py-2 px-4 text-center align-middle">{sector.expiration_date}</td>
                                <td className="py-2 px-4 text-center align-middle">{sector.expire30}</td>
                                <td className="py-2 px-4 text-center align-middle">{sector.deals}</td>
                                <td className="py-2 px-4 text-center align-middle">{new Date(sector.updatedate).toLocaleString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <Pagination
                    totalItems={totalItems} // 总数据条数
                    itemsPerPage={itemsPerPage} // 每页数据条数
                    currentPage={page} // 当前页码
                    onPageChange={handlePageChange} // 处理页码变化的回调函数
                />
            </div>
        </div>
    );
}
