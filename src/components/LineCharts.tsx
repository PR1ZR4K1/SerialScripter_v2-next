import { LineChart } from '@mui/x-charts/LineChart';

export default function BasicLineChart(props) {
  return (
    <LineChart
      xAxis={props.xAxis}
      series={props.series}
      width={props.width}
      height={props.height}
    />
  );
}