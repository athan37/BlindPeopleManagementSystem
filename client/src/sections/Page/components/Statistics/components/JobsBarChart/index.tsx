import { Annotation, Tooltip, Axis, Chart, Coordinate, Interval } from "bizcharts";
import { Occupation } from "../../../../../../lib/enum";
import { GetOrganizationsStats as StatsDataType } from "../../../../../../lib/graphql/queries/Stats/__generated__/GetOrganizationsStats"; 

interface Props {
    data: StatsDataType["getOrganizationsStats"]["jobs"];
}

export const JobsBarChart = ({ data } : Props) => {

    const barChartData = data.map(
        (item : any) => {
            return {
                //@ts-expect-error item._id is a string
                job: Occupation[item._id],
                population : item.value
            }
        }
    )
    barChartData.sort((a : any, b : any) => a.population - b.population);

    return ( 
    <div style= {{height: "72%"}} className="wrap-border">
        <Chart 
            padding={[70, 40, 10, 130]} 
            data={barChartData} 
            title={{
                visible: true,
                text: 'Nghề nghiệp',
            }}
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
            <Annotation.Text
                    position={['0%', '-10%']}
                    content={`Nghề nghiệp của hội viên`}
                    style={{
                        fontSize: 20,
                        fill: '#000',
                        lineHeight: 20,
                        textAlign: 'start',
                        fontWeight: 500,
                        fontFamily: `"Poppins", system-ui, -apple-system, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji",
    "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"`
                    }}
            />
            <Coordinate transpose />
            <Axis name="job" />
            <Axis name="population" visible={false} />
            <Tooltip />
            <Interval 
                position="job*population"
                label="population"
            />

        </Chart>
    </div>
    )
}