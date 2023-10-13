import { BarChart } from "@mui/x-charts";

export default function BarGraph(){
    return (
        // <div style = {{display: "flex"}}>
            <BarChart
                xAxis={[
                    {
                        id: 'barCategories',
                        data: ['bar A', 'bar B', 'bar C'],
                        scaleType: 'band',
                    },
                ]}
                
                series={[
                    {
                        data: [2, 5, 3],
                    },
                ]}
                
                width={400}
                height={300}
            />
        // </div>
    )
}
