"use client";

import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";
import dayjs from 'dayjs';

export type PowerDate = {
  date: string;
  power: number;
  node_id: string;
};

export type Stats = {
  highest: PowerDate;
  lowest: PowerDate;
  last30DaysData: PowerDate[];
  maxPower: number; // 新增最大值字段
};

const LabelLineChart: React.FC = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [uniqueDates, setUniqueDates] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/dashboard/LabelLineChart');
        if (!response.ok) {
          throw new Error('获取数据失败');
        }
        const data: Stats = await response.json();
        setStats(data);

        // 提取唯一的日期
        const uniqueDates = Array.from(new Set(data.last30DaysData.map(item => item.date)));
        setUniqueDates(uniqueDates);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  if (!stats) {
    return <div>Loading...</div>;
  }

  const formatDate = (date: string) => {
    return dayjs(date).format('MM-DD');
  };

  // 根据 node_id 分组数据
  const groupedData: { [key: string]: PowerDate[] } = {};
  stats.last30DaysData.forEach(item => {
    if (!groupedData[item.node_id]) {
      groupedData[item.node_id] = [];
    }
    groupedData[item.node_id].push(item);
  });

  // 预定义颜色数组
  const colors = ['#2563EB', '#2563EB', '#2563EB', '#2563EB'];

  return (
    <div>
      <h3>All Node IDs</h3>
      <LineChart
        width={1000}
        height={500}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="date"
          tickFormatter={formatDate}
          ticks={uniqueDates}
        />
        <YAxis />
        <Tooltip labelFormatter={formatDate} />
        <Legend />
        {Object.keys(groupedData).map((node_id, index) => (
          <Line
            key={node_id}
            type="monotone"
            dataKey="power"
            data={groupedData[node_id]}
            name={`Node ID: ${node_id}`}
            stroke={colors[index % colors.length]} // 使用预定义颜色数组
          />
        ))}
      </LineChart>
    </div>
  );
};

export default LabelLineChart;

