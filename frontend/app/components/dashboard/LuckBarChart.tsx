"use client";

import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LabelList
} from "recharts";

const LuckBarChart = () => {
  const [luckData, setLuckData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/dashboard/LuckBarChart');
        if (!response.ok) {
          throw new Error('获取数据失败');
        }
        const data = await response.json();
        setLuckData(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <BarChart
      width={1000}
      height={500}
      data={luckData}
      margin={{
        top: 15,
        right: 30,
        left: 20,
        bottom: 5
      }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="node_id" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Bar dataKey="lucky_value_7_days" fill="#2563EB" minPointSize={5}>
        <LabelList position="top" />
      </Bar>
      <Bar dataKey="lucky_value_30_days" fill="#87CEFA" minPointSize={5}>
        <LabelList position="top" />
      </Bar>
    </BarChart>
  );
};

export default LuckBarChart;
