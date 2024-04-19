// app\dashboard\filblock\page.tsx

import ListPage from '../../components/filblock/list';

// 定义 FilBlock 页面组件
export default async function OrderPage() {
  return (
    <div>
      {/* <h1>FilBlock Dashboard</h1> */}
      <ListPage /> {/* 包含列表页面组件 */}
    </div>
  );
}
