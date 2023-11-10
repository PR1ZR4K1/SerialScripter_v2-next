'use client'
import { Carousel } from "@material-tailwind/react";
// import { PieChart } from "@mui/icons-material";
// import  BasicPie  from "../../components/PieCharts";
// import BasicLineChart from "../../components/LineCharts";
// import BasicBars from "../../components/BarCharts";
import { BarChart, LineChart, PieChart } from "@mui/x-charts";
 
export function CarouselDefault() {
  return (
    <Carousel className="rounded-x1">
      <div className='flex justify-center items-center h-full'>
        <BarChart
          xAxis={[{id: 'barCategories', data: ['bar A', 'bar B', 'bar C'],scaleType: 'band',}]}
          series={[{data: [2, 5, 3]}]}
          width={600} height={320}
        />
      </div>
      <div className='flex justify-center items-center h-full'>
        <PieChart
        colors={['green', 'blue', 'red']}
        series={[{data: [{ id: 0, value: 50, label: 'series A' },{ id: 1, value: 10, label: 'series B' },{ id: 2, value: 20, label: 'series C' },],},]}
        width={400} height={230}
        />
      </div>
      <div className='flex justify-center items-center h-full'>
        <LineChart
          xAxis={[{ data: [1, 2, 3, 5, 8, 10] }]}
          series={[{data: [2, 5.5, 2, 8.5, 1.5, 5],},]}
          width={400} height={320}
        />
      </div>
    </Carousel>
  );
}