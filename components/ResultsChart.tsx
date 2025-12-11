import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { RecommendationResult } from '../types';

interface ResultsChartProps {
  data: RecommendationResult[];
}

export const ResultsChart: React.FC<ResultsChartProps> = ({ data }) => {
  return (
    <div className="w-full h-[400px] bg-gray-900/50 p-4 rounded-xl border border-gray-700">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#374151" />
          <XAxis type="number" domain={[0, 100]} hide />
          <YAxis 
            dataKey="styleName" 
            type="category" 
            width={100} 
            tick={{ fill: '#9CA3AF', fontSize: 12 }}
            interval={0}
          />
          <Tooltip 
            cursor={{fill: 'transparent'}}
            contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#F3F4F6' }}
            itemStyle={{ color: '#FBBF24' }}
            formatter={(value: number) => [`${value}%`, 'Afinidad']}
          />
          <Bar dataKey="affinityScore" radius={[0, 4, 4, 0]}>
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.category === 'Lager' ? '#fbbf24' : '#d97706'} 
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      
      <div className="flex justify-center gap-6 mt-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-beer-gold rounded-sm"></div>
          <span className="text-gray-300">Lagers</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-beer-amber rounded-sm"></div>
          <span className="text-gray-300">Ales</span>
        </div>
      </div>
    </div>
  );
};