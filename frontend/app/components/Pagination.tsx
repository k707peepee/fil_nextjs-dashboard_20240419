// app\dashboard\filblock\Pagination.tsx
import React from 'react';

interface PaginationProps {
    totalItems: number; // 总数据条数
    itemsPerPage: number; // 每页数据条数
    currentPage: number; // 当前页码
    onPageChange: (pageNumber: number) => void; // 处理页码变化的回调函数
}

const Pagination: React.FC<PaginationProps> = ({ totalItems, itemsPerPage, currentPage, onPageChange }) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage); // 总页数
    
    // console.log("总数据条数");
    // console.log(totalItems);
    // console.log("每页数据条数");
    // console.log(itemsPerPage);
    // console.log("当前页码");
    // console.log(currentPage);
    // console.log("总页数");
    // console.log(totalPages);

    // 创建页码按钮
    const renderPageNumbers = () => {
        const pageNumbers = [];
        for (let i = 1; i <= totalPages; i++) {
            // for (let i = 1; i <= 5; i++) {
            pageNumbers.push(
                <li key={i}>
                    <button
                        className={`mx-1 px-3 py-1 rounded ${
                            i === currentPage ? 'bg-blue-500 text-white' : 'bg-white text-blue-500'
                        }`}
                        onClick={() => onPageChange(i)}
                    >
                        {i}
                    </button>
                </li>
            );
        }
        return pageNumbers;
    };

    return (
        <div className="flex justify-center my-4">
            <ul className="flex">
                {/* 渲染页码按钮 */}
                {renderPageNumbers()}
            </ul>
        </div>
    );
};

export default Pagination;
