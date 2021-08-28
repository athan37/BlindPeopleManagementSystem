import {
  Chart,
  Axis,
  Tooltip,
  Interval,
  Coordinate,
  Annotation
} from 'bizcharts';
import { GetOrganizationsStats as StatsDataType } 
from "../../../../../../lib/graphql/queries/Stats/__generated__/GetOrganizationsStats"; 
import { Education } from "../../../../../../lib/enum";
interface Props {
    data: StatsDataType["getOrganizationsStats"]["educations"]
    config: any
}

export const EducationsChart = ({ data } : Props) => {
    const processedData = data.sort((a, b) => b.value - a.value).map(
        (item : any) => {
            return {
                //@ts-expect-error nothing
                type: Education[item._id],
                value : item.value
            }
        }
    )

    return <div className="wrap-border">
    <Chart 
        padding={[80, 0, 40, 0]} 
        height={431} data={processedData} autoFit
    >
        <Annotation.Text
                position={['2%', '-20%']}
                content={"Trình độ học vấn của hội viên"}
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
        <Annotation.Text
                position={['2%', '-10%']}
                content={`Theo số hội viên`}
                style={{
                    fontSize: 14,
                    fill: 'grey',
                    lineHeight: 16,
                    textAlign: 'start',
                    fontFamily: `"Poppins", system-ui, -apple-system, "Segoe UI", Roboto,
"Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji",
"Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"`
                }}
        />
      <Coordinate
        type="polar"
         startAngle={Math.PI} // 起始角度
         endAngle={Math.PI * (3 / 2)} // 结束角度
      />
      <Axis name="value" grid={{
        line: {
          type: 'circle',
        },
        closed: false,
      }} />
      <Tooltip showTitle={false} />
      <Interval
        position="type*value"
        adjust="stack"
        color={['type', 'rgb(252,143,72)-rgb(255,215,135)']}
        element-highlight
        style={{
          lineWidth: 1,
          stroke: '#fff',
        }}
        label={['value', {
          offset: -15,
          style: {
            textAlign: 'center',
            fill: '#000',
          },
        }]}
      />
    </Chart>
    </div>
}