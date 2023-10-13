import { PieChart } from '@mui/x-charts/PieChart';

export default function PieGraph(){
    return (
        // <div style = {{display: "flex"}}>
            <PieChart
                colors={['black', 'blue', 'red']}
                series={[
                    {
                        data: [
                            { id: 0, value: 50, label: 'series A' },
                            { id: 1, value: 10, label: 'series B' },
                            { id: 2, value: 20, label: 'series C' },
                        ],
                    },
                ]}
                width={400}
                height={200}
            />
        // </div>
    )
}