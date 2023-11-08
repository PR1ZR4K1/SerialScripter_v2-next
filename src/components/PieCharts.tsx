import { PieChart } from '@mui/x-charts/PieChart';

export default function BasicPie(props){
    return (
            <PieChart
                colors = {props.colors}
                series={props.series}
                width={props.width}
                height={props.height}
            />
    )
}