import { BarChart } from "@mui/x-charts";

export default function BasicBars(props){
    return (
            <BarChart
                xAxis={props.xAxis}
                series={props.series}
                width={props.width}
                height={props.height}
            />
    )
}
