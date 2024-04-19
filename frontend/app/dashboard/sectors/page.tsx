// app\dashboard\filblock\page.tsx

import SectorsList from '../../components/sectors/sectorslist';
import SectorCard from '../../components/sectors/sectorcard';

// 定义 FilBlock 页面组件
export default async function SectorsPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="mt-20">
        <SectorCard />
      </div>
      <div className="mt-20">
        <SectorsList />
      </div>
    </main>
  );
}
