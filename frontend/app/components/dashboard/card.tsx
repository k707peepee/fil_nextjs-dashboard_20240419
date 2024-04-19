"use client";

import { useState, useEffect } from 'react';
import { ArrowDownIcon, ArrowUpIcon } from '@heroicons/react/20/solid';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export type summaryData = {
  node_id: string;
  power: number;
  prev_power_7_days: number;
  power_change_ratio_7_days: number;
  changetype_7_days: string; // 'increase' or 'decrease'
  prev_power_10_days: number;
  power_change_ratio_10_days: number;
  changetype_10_days: string; // 'increase' or 'decrease'
};

export default function CardPage() {
  const [summaryData, setSummaryData] = useState<summaryData[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/dashboard/card', { method: 'GET' });
        if (!response.ok) {
          throw new Error('获取数据失败');
        }
        const summary: summaryData[] = await response.json();

        // 乘以100并保留两位小数
        const updatedSummaryData = summary.map((item) => ({
          ...item,
	  power: parseFloat((item.power * 1).toFixed(2)),
          prev_power_7_days: parseFloat((item.prev_power_7_days * 1).toFixed(2)),
          power_change_ratio_7_days: parseFloat((item.power_change_ratio_7_days * 1).toFixed(2)),
	  prev_power_10_days: parseFloat((item.prev_power_10_days * 1).toFixed(2)),
          power_change_ratio_10_days: parseFloat((item.power_change_ratio_10_days * 1).toFixed(2)),
        }));

        setSummaryData(updatedSummaryData);
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
      <h3 className="text-base font-semibold leading-6 text-gray-900">7天算力变化情况</h3>
      {loading && <div>Loading...</div>}
      {error && <div>{error}</div>}
      {summaryData && (
        <dl className="mt-5 grid grid-cols-2 divide-y divide-gray-200 overflow-hidden rounded-lg bg-white shadow md:grid-cols-4 md:divide-x md:divide-y-0">
          {summaryData.map((item) => (
            <div key={item.node_id} className="px-4 py-5 sm:p-6">
              <dt className="text-base font-normal text-gray-900">{item.node_id.slice(-3)}当前存储</dt>
              <dd className="mt-1 flex items-baseline justify-between md:block lg:flex">
                <div className="flex items-baseline text-2xl font-semibold text-indigo-600">
                  {item.power}
                  <tr/>
                  <span className="ml-2 text-sm font-medium text-gray-500">较7日前 {item.prev_power_7_days}</span>
                </div>

                <div
                  className={classNames(
                    item.changetype_7_days === 'increase' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800',
                    'inline-flex items-baseline rounded-full px-2.5 py-0.5 text-sm font-medium md:mt-2 lg:mt-0'
                  )}
                >
                  {item.changetype_7_days === 'increase' ? (
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

                  <span className="sr-only"> {item.changetype_7_days === 'increase' ? 'Increased' : 'Decreased'} by </span>
                  {item.power_change_ratio_7_days}%
                </div>
              </dd>
            </div>
          ))}
        </dl>
      )}

      <h3 className="mt-5 text-base font-semibold leading-6 text-gray-900">10天算力变化情况</h3>
      {loading && <div>Loading...</div>}
      {error && <div>{error}</div>}
      {summaryData && (
        <dl className="mt-5 grid grid-cols-1 divide-y divide-gray-200 overflow-hidden rounded-lg bg-white shadow md:grid-cols-4 md:divide-x md:divide-y-0">
          {summaryData.map((item) => (
            <div key={item.node_id} className="px-4 py-5 sm:p-6">
              <dt className="text-base font-normal text-gray-900">{item.node_id.slice(-3)}当前存储</dt>
              <dd className="mt-1 flex items-baseline justify-between md:block lg:flex">
                <div className="flex items-baseline text-2xl font-semibold text-indigo-600">
                  {item.power}
                  <span className="ml-2 text-sm font-medium text-gray-500">较10日前 {item.prev_power_10_days}</span>
                </div>

                <div
                  className={classNames(
                    item.changetype_10_days === 'increase' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800',
                    'inline-flex items-baseline rounded-full px-2.5 py-0.5 text-sm font-medium md:mt-2 lg:mt-0'
                  )}
                >
                  {item.changetype_10_days === 'increase' ? (
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

                  <span className="sr-only"> {item.changetype_10_days === 'increase' ? 'Increased' : 'Decreased'} by </span>
                  {item.power_change_ratio_10_days}%
                </div>
              </dd>
            </div>
          ))}
        </dl>
      )}
    </div>




  );
}
