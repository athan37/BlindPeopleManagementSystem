import {
  Chart,
  Point,
  Line,
	Axis,
  Area,
  Tooltip,
  Coordinate,
  Annotation
} from 'bizcharts';
import DataSet from '@antv/data-set';

interface Props {
    listOfData: any
    config: any
}

export const CustomRadarChart = ({ listOfData, config } : Props) => {
    const { DataView } = DataSet;

    //1. First take out all the ids from list of data
    // const _ids = listOfData[Object.keys(listOfData)[0]].map((item : any) => item._id)

    const _ids = Object.keys(config.Enum)
    let newData = {}
    Array.from(_ids).forEach((_id : any) => {
        //@ts-expect-error _id is a string
        newData[_id] = {}
        Object.keys(listOfData).forEach( entry => { 
            //@ts-expect-error _id is a string
            newData[_id][entry] = 0
        })
    })

    //2. Add all subvalues into the map
    let maxVal = -1
    for (const [label, value] of Object.entries(listOfData)) {
        //@ts-expect-error it's not unknown
        for (const entry of Array.from(value)) {
            //@ts-expect-error it's a string
            if (entry.value > maxVal) maxVal = entry.value
            //@ts-expect-error it's a string
            newData[entry._id][label] = entry.value;
        }
    }

    console.log(newData, "Hei the fuck")

    //3. Add the word item and other things in
    const finalData = Array.from(Object.entries(newData)).map(datum => 
        {
            //@ts-expect-error no error here
            return { "item" : config.Enum[datum[0]] , ...datum[1]}
        }
        )

    console.log(finalData)
    
    const dv = new DataView().source(finalData);
    dv.transform({
        type: 'fold',
        fields: Object.keys(listOfData), // 展开字段集
        key: 'user', // key字段
        value: 'score', // value字段
    });
    return <div className="wrap-border">
    <Chart
        padding={[80, 0, 40, 0]} 
        height={400}
        data={dv.rows}
        autoFit
        scale={{
        score:{
            min: 0,
            max: maxVal,
        }
        }}
        interactions={['legend-highlight']}
    >
        <Annotation.Text
                position={['2%', '-20%']}
                content={config.title}
                style={{
                    display: "flex",
                    wrap: "flex-wrap",
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
        <Coordinate type="polar" radius={0.8} />
        <Tooltip shared />
        <Point
        position="item*score"
        color="user"
        shape="circle"
        />
        <Line
        position="item*score"
        color="user"
        size="2"
        />
        <Area
        position="item*score"
        color="user"
        />
            <Axis name="score" grid={{ line: {type: 'line'}}} />
            <Axis name="item" line={false} />
    </Chart> 
    </div>
}