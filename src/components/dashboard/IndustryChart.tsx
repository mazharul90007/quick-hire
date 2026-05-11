"use client";
 
 import {
   BarChart,
   Bar,
   XAxis,
   YAxis,
   CartesianGrid,
   Tooltip,
   ResponsiveContainer,
   Cell,
 } from "recharts";
 
 interface IndustryData {
   name: string;
   count: number;
 }
 
 interface IndustryChartProps {
   data: IndustryData[];
 }
 
 const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"];
 
 export default function IndustryChart({ data }: IndustryChartProps) {
   // Limit to top 8 for better visualization
   const chartData = data.slice(0, 8);
 
   return (
     <div className="h-[350px] w-full">
       <ResponsiveContainer width="100%" height="100%">
         <BarChart
           data={chartData}
           margin={{
             top: 20,
             right: 30,
             left: 0,
             bottom: 60,
           }}
         >
           <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
           <XAxis
             dataKey="name"
             axisLine={false}
             tickLine={false}
             tick={{ fill: "#64748b", fontSize: 12, fontWeight: 500 }}
             angle={-45}
             textAnchor="end"
             interval={0}
           />
           <YAxis
             axisLine={false}
             tickLine={false}
             tick={{ fill: "#64748b", fontSize: 12 }}
           />
           <Tooltip
             cursor={{ fill: "transparent" }}
             contentStyle={{
               backgroundColor: "#fff",
               borderRadius: "12px",
               border: "1px solid #e2e8f0",
               boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
             }}
             itemStyle={{ fontWeight: "bold", fontSize: "14px" }}
           />
           <Bar
             dataKey="count"
             radius={[6, 6, 0, 0]}
             barSize={40}
           >
             {chartData.map((entry, index) => (
               <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
             ))}
           </Bar>
         </BarChart>
       </ResponsiveContainer>
     </div>
   );
 }
