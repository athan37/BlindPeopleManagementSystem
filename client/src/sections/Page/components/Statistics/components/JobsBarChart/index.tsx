import { Chart, Coordinate, Interval } from "bizcharts";

export const JobsBarChart = ({barChartData}: any) => {
    barChartData.sort((a : any, b : any) => a.population - b.population);

    return (
        <Chart padding={50} data={barChartData} autoFit>
            <Coordinate transpose />
            <Interval position="jobs*population" />
        </Chart>
    )
}