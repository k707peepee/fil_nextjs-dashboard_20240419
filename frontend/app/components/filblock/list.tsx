// app\dashboard\filblock\list.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { FilBlock } from '@/utils/definitions';
import Pagination from '../Pagination'; // 引入 Pagination 组件

// 定义列表页面组件
export default function ListPage() {
    const [myBlock, setMyBlock] = useState<FilBlock[]>([]);
    // const [otherBlock, setOtherBlock] = useState<FilBlock[]>([]);
    const [myBlockPage, setMyBlockPage] = useState(1); // 当前真实节点表格页码
    const [otherBlockPage, setOtherBlockPage] = useState(1); // 当前非真实节点表格页码
    const [myBlockLength, setMyBlockLength] = useState(0); // 真实节点数据条数
    // const [otherBlockLength, setOtherBlockLength] = useState(0); // 非真实节点数据条数

    const itemsPerPage = 15; // 每页显示的数据条数

    useEffect(() => {
        // 在这里获取数据，根据页码和每页数据条数进行切片处理，然后设置到对应的表格中
        const fetchData = async () => {
            try {
                // 发送 GET 请求到 API 路由
                const response = await fetch('/api/filblock', { method: 'GET' });
                if (!response.ok) {
                    throw new Error('获取数据失败');
                }
                // const { myBlock, otherBlock } = await response.json();
                const { myBlock } = await response.json();

                // 对数据进行排序，让最新的时间排在前面
                const sortedsetMyBlock = myBlock.sort((a: any, b: any) => new Date(b.blockTime).getTime() - new Date(a.blockTime).getTime());
                // const sortedOtherBlock = otherBlock.sort((a: any, b: any) => new Date(b.blockTime).getTime() - new Date(a.blockTime).getTime());

                // 设置数据长度
                setMyBlockLength(sortedsetMyBlock.length);
                // setOtherBlockLength(sortedOtherBlock.length);

                // console.log("真实节点数据条数");
                // console.log(sortedsetMyBlock.length);
                // console.log("非真实节点数据条数");
                // console.log(sortedOtherBlock.length);
                
                // 对排序后的数据进行切片以确保每页只显示指定数量的数据
                const slicedMyBlock = sortedsetMyBlock.slice((myBlockPage - 1) * itemsPerPage, myBlockPage * itemsPerPage);
                // const slicedOtherBlock = sortedOtherBlock.slice((otherBlockPage - 1) * itemsPerPage, otherBlockPage * itemsPerPage);

                setMyBlock(slicedMyBlock);
                // setOtherBlock(slicedOtherBlock);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
    
        fetchData(); // 调用数据获取函数
    }, [myBlockPage, otherBlockPage]); // 当页码变化时重新获取数据

    const handleMyBlockPageChange = (pageNumber: number) => {
        setMyBlockPage(pageNumber);
    };

    const handleOtherBlockPageChange = (pageNumber: number) => {
        setOtherBlockPage(pageNumber);
    };


    return (
        <div>
            <h2 className="text-lg font-semibold mb-4">Order statistics</h2>
            <h2 className="text-lg font-semibold mb-4">订单统计</h2>
            <div className="overflow-x-auto">
                {/* 真实节点表格 */}
                <table className="w-full">
                    {/* 表头部分 */}
                    <thead>
                        {/* 表头行 */}
                        <tr className="bg-gray-200">
                            {/* 表头单元格 */}
                            <th className="py-2 px-4 text-center align-middle">订单哈希</th>
                            <th className="py-2 px-4 text-center align-middle">存储仓库</th>
                            <th className="py-2 px-4 text-center align-middle">订单时间</th>
                            {/* <th className="py-2 px-4 text-center align-middle">出块数量</th> */}
                        </tr>
                    </thead>
                    <tbody>
                        {myBlock.map((block) => (
                            <tr key={block.id} className="border-b">
                                <td className="py-2 px-4 text-center align-middle">{block.blockHeight}</td>
                                {/* 节点号只显示最后3位 */}
                                <td className="py-2 px-4 text-center align-middle">{block.rewardNodeId.slice(-3)}</td>
                                <td className="py-2 px-4 text-center align-middle">{block.blockTime.toString()}</td>
                                {/* <td className="py-2 px-4 text-center align-middle">{block.blockReward}</td> */}
                            </tr>
                        ))}
                    </tbody>
                </table>
                {/* 翻页按钮 */}
                <Pagination
                    totalItems={myBlockLength} // 总数据条数
                    itemsPerPage={itemsPerPage} // 每页数据条数
                    currentPage={myBlockPage} // 当前页码
                    onPageChange={handleMyBlockPageChange} // 处理页码变化的回调函数
                />
            </div>

            {/* <h2 className="text-lg font-semibold mt-8 mb-4">别人的节点出块情况</h2>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="py-2 px-4 text-center align-middle">出块高度</th>
                            <th className="py-2 px-4 text-center align-middle">出块节点</th>
                            <th className="py-2 px-4 text-center align-middle">出块时间</th>
                        </tr>
                    </thead>
                    <tbody>
                        {otherBlock.map((block) => (
                            <tr key={block.id} className="border-b">
                                <td className="py-2 px-4 text-center align-middle">{block.blockHeight}</td>
                                <td className="py-2 px-4 text-center align-middle">{block.rewardNodeId}</td>
                                <td className="py-2 px-4 text-center align-middle">{block.blockTime.toString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <Pagination
                    totalItems={otherBlockLength} // 总数据条数
                    itemsPerPage={itemsPerPage} // 每页数据条数
                    currentPage={otherBlockPage} // 当前页码
                    onPageChange={handleOtherBlockPageChange} // 处理页码变化的回调函数
                />
            </div> */}
        </div>
    );
}
