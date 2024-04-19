import { ArrowDownIcon, ArrowUpIcon } from '@heroicons/react/20/solid'
// 7天的扇区数变化情况
const stats7 = [
  { name: 'node:986', stat: '71,897', previousStat: '70,946', change: '12%', changeType: 'increase' },
  { name: 'node:576', stat: '58.16', previousStat: '56.14', change: '2.02%', changeType: 'increase' },
  { name: 'node:806', stat: '24.57', previousStat: '28.62', change: '4.05%', changeType: 'decrease' },
  { name: 'node:588', stat: '24.57', previousStat: '28.62', change: '4.05%', changeType: 'decrease' },
]
// 30天的扇区数变化情况
const stats30 = [
  { name: 'node:986', stat: '71,897', previousStat: '70,946', change: '12%', changeType: 'increase' },
  { name: 'node:576', stat: '58.16', previousStat: '56.14', change: '2.02%', changeType: 'increase' },
  { name: 'node:806', stat: '24.57', previousStat: '28.62', change: '4.05%', changeType: 'decrease' },
  { name: 'node:588', stat: '24.57', previousStat: '28.62', change: '4.05%', changeType: 'decrease' },
]

// 30内的扇区数变化情况
const stats30_duetotime = [
  { name: 'node:986', stat: '10', previousStat: '100', change: '10%', changeType: 'increase' },
  { name: 'node:576', stat: '20', previousStat: '100', change: '20%', changeType: 'increase' },
  { name: 'node:806', stat: '25', previousStat: '100', change: '25%', changeType: 'decrease' },
  { name: 'node:588', stat: '30', previousStat: '100', change: '30%', changeType: 'decrease' },
]


function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Example() {
  return (
    <div>

      <div className="flex items-baseline text-2xl font-semibold text-indigo-600">
        <h2>各个仓库存储数据及到期汇总（英文）</h2>
      </div>

      {/* // 7天的算力变化情况 */}
      <div>
        <h3 className="text-base mt-1 font-semibold leading-6 text-gray-900">Last 7 days</h3>
        <dl className="mt-5 grid grid-cols-1 divide-y divide-gray-200 overflow-hidden rounded-lg bg-white shadow md:grid-cols-4 md:divide-x md:divide-y-0">
          {stats7.map((item) => (
            <div key={item.name} className="px-4 py-5 sm:p-6">
              <dt className="text-base font-normal text-gray-900">{item.name}</dt>
              <dd className="mt-1 flex items-baseline justify-between md:block lg:flex">
                <div className="flex items-baseline text-2xl font-semibold text-indigo-600">
                  {item.stat}
                  <span className="ml-2 text-sm font-medium text-gray-500">from {item.previousStat}</span>
                </div>

                <div
                  className={classNames(
                    item.changeType === 'increase' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800',
                    'inline-flex items-baseline rounded-full px-2.5 py-0.5 text-sm font-medium md:mt-2 lg:mt-0'
                  )}
                >
                  {item.changeType === 'increase' ? (
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

                  <span className="sr-only"> {item.changeType === 'increase' ? 'Increased' : 'Decreased'} by </span>
                  {item.change}
                </div>
              </dd>
            </div>
          ))}
        </dl>
      </div>


      {/* // 30天的算力变化情况 开始 */}


      <div>
        <h3 className="text-base mt-2 font-semibold leading-6 text-gray-900">Last 30 days</h3>
        <dl className="mt-5 grid grid-cols-1 divide-y divide-gray-200 overflow-hidden rounded-lg bg-white shadow md:grid-cols-4 md:divide-x md:divide-y-0">
          {stats30.map((item) => (
            <div key={item.name} className="px-4 py-5 sm:p-6">
              <dt className="text-base font-normal text-gray-900">{item.name}</dt>
              <dd className="mt-1 flex items-baseline justify-between md:block lg:flex">
                <div className="flex items-baseline text-2xl font-semibold text-indigo-600">
                  {item.stat}
                  <span className="ml-2 text-sm font-medium text-gray-500">from {item.previousStat}</span>
                </div>

                <div
                  className={classNames(
                    item.changeType === 'increase' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800',
                    'inline-flex items-baseline rounded-full px-2.5 py-0.5 text-sm font-medium md:mt-2 lg:mt-0'
                  )}
                >
                  {item.changeType === 'increase' ? (
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

                  <span className="sr-only"> {item.changeType === 'increase' ? 'Increased' : 'Decreased'} by </span>
                  {item.change}
                </div>
              </dd>
            </div>
          ))}
        </dl>
      </div>
      {/* // // 30天的算力变化情况 开始  */}


      {/* // // 30天的算力变化情况 开始  */}
      <div>
        <h3 className="text-base mt-2 font-semibold leading-6 text-gray-900">Last Due To time 30 days</h3>
        <dl className="mt-5 grid grid-cols-1 divide-y divide-gray-200 overflow-hidden rounded-lg bg-white shadow md:grid-cols-4 md:divide-x md:divide-y-0">
          {stats30_duetotime.map((item) => (
            <div key={item.name} className="px-4 py-5 sm:p-6">
              <dt className="text-base font-normal text-gray-900">{item.name}</dt>
              <dd className="mt-1 flex items-baseline justify-between md:block lg:flex">
                <div className="flex items-baseline text-2xl font-semibold text-indigo-600">
                  {item.stat}
                  <span className="ml-2 text-sm font-medium text-gray-500"> of {item.previousStat}</span>
                </div>

                <div
                  className={classNames(
                    item.changeType === 'increase' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800',
                    'inline-flex items-baseline rounded-full px-2.5 py-0.5 text-sm font-medium md:mt-2 lg:mt-0'
                  )}
                >
                  {item.changeType === 'increase' ? (
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

                  <span className="sr-only"> {item.changeType === 'increase' ? 'Increased' : 'Decreased'} by </span>
                  {item.change}
                </div>
              </dd>
            </div>
          ))}
        </dl>
      </div>
      {/* // // 30天的算力变化情况 开始  */}


      <div>
        这里添加各个节点的详单，字段为：产生的时间  ，扇区hash，只显示3为的节点号
      </div>


    </div>

  )
}
