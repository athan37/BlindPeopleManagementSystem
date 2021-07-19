import { Tooltip, Axis, Chart, Coordinate, Interval } from "bizcharts";
import { GetOrganizationsStats as StatsDataType } from "../../../../../../lib/graphql/queries/Stats/__generated__/GetOrganizationsStats"; 

interface Props {
    data: StatsDataType["getOrganizationsStats"]["jobs"];
}

export const JobsBarChart = ({ data } : Props) => {

    const barChartData = data.map(
        item => {
            return {
                job: item._id,
                population : item.value
            }
        }
    )
    barChartData.sort((a : any, b : any) => a.population - b.population);

    return (
        <Chart 
            padding={50} 
            data={barChartData} 
            autoFit
            scale={
                {
                    population: {
                        alias : "Số hội viên"
                    },
                    job: {
                        alias: "Nghề"
                    }
                }
            }
        >
            <Coordinate transpose />
            <Axis name="job" />
            <Axis name="population" visible={false} />
            <Tooltip />
            <Interval 
                position="job*population"
                label="population"
            />

        </Chart>
    )
}