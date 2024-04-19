import CardPage from '../../components/test/card';
import BlockBrowser from '../../components/test/blockbrowser'

// 定义 FilBlock 页面组件
export default async function SummaryPage() {
  return (
    <div>
      {/* <h1>Dashboard</h1> */}
      <CardPage /> {/* 包含列表页面组件 */}
      <BlockBrowser /> {/* 包含区块浏览器页面组件 */}
    </div>
  );
}

