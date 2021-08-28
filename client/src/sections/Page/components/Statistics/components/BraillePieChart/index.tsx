import { PieChart } from "bizcharts";
import { GetOrganizationsStats as StatsDataType,
         GetOrganizationsStats_getOrganizationsStats_jobs as GraphData } 
from "../../../../../../lib/graphql/queries/Stats/__generated__/GetOrganizationsStats"; 

interface Props {
    brailleData: StatsDataType["getOrganizationsStats"]["brailleData"]
    config: any;
}

export const BraillePieChart = ({ brailleData, config } : Props) => {
    const pieChartData = brailleData.map(
        (data : GraphData) => {
            return {
                type: config.Enum[data._id],
                value : data.value
            }
        }
    )
    return <div className="wrap-border">
            <PieChart
                data={pieChartData}
                title={{
                    visible: true,
                    text: config.titleText
                }}
                description={{
                    visible: true,
                    text: config.titleDescription
                }}
                radius={0.8}
                angleField='value'
                colorField='type'
                label={{
                    visible: true,
                    type: 'outer',
                    offset: 20,
                }}
                />
        </div>
}