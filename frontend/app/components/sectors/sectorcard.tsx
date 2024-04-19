'use client';

import { useState, useEffect } from 'react';
import { ArrowDownIcon, ArrowUpIcon } from '@heroicons/react/20/solid';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

type SectorChanges_7 = {
  node_id: string;
  sector_current: number;
  sector_sum_7days_ago: number;
  sector_change_7days: number;
  sector_change_percentage_7days: number;
};

type SectorChanges_30 = {
  node_id: string;
  sector_current: number;
  sector_sum_30days_ago: number;
  sector_change_30days: number;
  sector_change_percentage_30days: number;
};

type lowSector_Count = {
  node_id: string;
  expiration_sum_current: number;
  sector_sum_current: number;
  expiration_sum_percentage: number;
};

type SectorCardData = {
  sectorChanges7Days: SectorChanges_7[];
  sectorChanges30Days: SectorChanges_30[];
  lowSectorCount: lowSector_Count[];
};

export default function SectorCard() {
  const [sectorCardData, setSectorCardData] = useState<SectorCardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/sectorscard', { method: 'GET' });
        if (!response.ok) {
          throw new Error('获取数据失败');
        }
        const data: SectorCardData = await response.json();

        setSectorCardData(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('获取数据失败，请重试');
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      <h3 className="text-base font-semibold leading-6 text-gray-900">7天内扇区变化情况</h3>
      {loading && <div>Loading...</div>}
      {error && <div>{error}</div>}
      {sectorCardData && (
        <dl className="mt-5 grid grid-cols-2 divide-y divide-gray-200 overflow-hidden rounded-lg bg-white shadow md:grid-cols-4 md:divide-x md:divide-y-0">
          {sectorCardData.sectorChanges7Days.map((item) => (
            <div key={item.node_id} className="px-4 py-5 sm:p-6">
              <dt className="text-base font-normal text-gray-900">{item.node_id.slice(-3)} 扇区数</dt>
              <dd className="mt-1 flex items-baseline justify-between md:block lg:flex">
                <div className="flex items-baseline text-2xl font-semibold text-indigo-600">
                  {item.sector_current}
                  <span className="ml-2 text-sm font-medium text-gray-500">7天内变化 {item.sector_change_7days}</span>
                </div>

                <div
                  className={classNames(
                    item.sector_change_7days >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800',
                    'inline-flex items-baseline rounded-full px-2.5 py-0.5 text-sm font-medium md:mt-2 lg:mt-0'
                  )}
                >
                  {item.sector_change_7days >= 0 ? (
                    <ArrowUpIcon
                      className="-ml-1 mr-0.5 h-5 w-5 flex-shrink-0 self-center text-green-500"
                      aria-hidden="true"
                    />
                  ) : (
                    <ArrowDownIcon
                      className="-ml-1 mr-0.5 h-5 w-5 flex-shrink-0 self-center text-red-500"
                      aria-hidden="true"
                    />
                  )}

                  <span className="sr-only"> {item.sector_change_7days >= 0 ? 'Increased' : 'Decreased'} by </span>
                  {item.sector_change_percentage_7days}%
                </div>
              </dd>
            </div>
          ))}
        </dl>
      )}

      <h3 className="mt-5 text-base font-semibold leading-6 text-gray-900">30天内扇区变化情况</h3>
      {loading && <div>Loading...</div>}
      {error && <div>{error}</div>}
      {sectorCardData && (
        <dl className="mt-5 grid grid-cols-2 divide-y divide-gray-200 overflow-hidden rounded-lg bg-white shadow md:grid-cols-4 md:divide-x md:divide-y-0">
          {sectorCardData.sectorChanges30Days.map((item) => (
            <div key={item.node_id} className="px-4 py-5 sm:p-6">
              <dt className="text-base font-normal text-gray-900">{item.node_id.slice(-3)} 扇区数</dt>
              <dd className="mt-1 flex items-baseline justify-between md:block lg:flex">
                <div className="flex items-baseline text-2xl font-semibold text-indigo-600">
                  {item.sector_current}
                  <span className="ml-2 text-sm font-medium text-gray-500">30天内变化 {item.sector_change_30days}</span>
                </div>

                <div
                  className={classNames(
                    item.sector_change_30days >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800',
                    'inline-flex items-baseline rounded-full px-2.5 py-0.5 text-sm font-medium md:mt-2 lg:mt-0'
                  )}
                >
                  {item.sector_change_30days >= 0 ? (
                    <ArrowUpIcon
                      className="-ml-1 mr-0.5 h-5 w-5 flex-shrink-0 self-center text-green-500"
                      aria-hidden="true"
                    />
                  ) : (
                    <ArrowDownIcon
                      className="-ml-1 mr-0.5 h-5 w-5 flex-shrink-0 self-center text-red-500"
                      aria-hidden="true"
                    />
                  )}

                  <span className="sr-only"> {item.sector_change_30days >= 0 ? 'Increased' : 'Decreased'} by </span>
                  {item.sector_change_percentage_30days}%
                </div>
              </dd>
            </div>
          ))}
        </dl>
      )}

<h3 className="mt-5 text-base font-semibold leading-6 text-gray-900">30天到期扇区数</h3>
      {loading && <div>Loading...</div>}
      {error && <div>{error}</div>}
      {sectorCardData && (
        <dl className="mt-5 grid grid-cols-2 divide-y divide-gray-200 overflow-hidden rounded-lg bg-white shadow md:grid-cols-4 md:divide-x md:divide-y-0">
          {sectorCardData.lowSectorCount.map((item) => (
            <div key={item.node_id} className="px-4 py-5 sm:p-6">
              <dt className="text-base font-normal text-gray-900">{item.node_id.slice(-3)} 扇区数</dt>
              <dd className="mt-1 flex items-baseline justify-between md:block lg:flex">
                <div className="flex items-baseline text-2xl font-semibold text-indigo-600">
                  {item.expiration_sum_current}
                  <span className="ml-2 text-sm font-medium text-gray-500">占总扇区 {item.sector_sum_current}</span>
                </div>

                <div
                  className={classNames(
                    item.expiration_sum_percentage >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800',
                    'inline-flex items-baseline rounded-full px-2.5 py-0.5 text-sm font-medium md:mt-2 lg:mt-0'
                  )}
                >
                  {item.expiration_sum_percentage >= 0 ? (
                    <ArrowUpIcon
                      className="-ml-1 mr-0.5 h-5 w-5 flex-shrink-0 self-center text-green-500"
                      aria-hidden="true"
                    />
                  ) : (
                    <ArrowDownIcon
                      className="-ml-1 mr-0.5 h-5 w-5 flex-shrink-0 self-center text-red-500"
                      aria-hidden="true"
                    />
                  )}

                  <span className="sr-only"> {item.expiration_sum_percentage >= 0 ? 'Increased' : 'Decreased'} by </span>
                  {item.expiration_sum_percentage}%
                </div>
              </dd>
            </div>
          ))}
        </dl>
      )}


    </div>
  );
}
