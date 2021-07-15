import { Slider, Statistic, Divider, Descriptions } from "antd"
import { BarChart, PieChart } from "bizcharts";

const barChartData = [
    { country: 'Asia', year: '1750', value: 502,},
    { country: 'Asias', year: '1753', value: 502,},
    { country: 'Asia43', year: '1751', value: 502,},
    { country: 'Asiae4', year: '1800', value: 635,},
  ];

  const pieChartData = [
    {
      type: '分类一',
      value: 27,
    },
    {
      type: '分类二',
      value: 25,
    },
    {
      type: '分类三',
      value: 18,
    },
    {
      type: '分类四',
      value: 15,
    },
    {
      type: '分类五',
      value: 10,
    },
    {
      type: '其它',
      value: 5,
    },
  ];

export const Statistics = () => {

    return (
        <div className="summary-container">
            <div className="summary-child">
                <Descriptions 
                    title = "Thống kê hội người mù"
                    className="big"
                    size={"middle"}
                >
                    <Descriptions.Item label="Hội viên">Hội người mù quận Cầu Tiêu</Descriptions.Item>
                    <Descriptions.Item label="Địa chỉ">
                    Thanh Xuân, Hà Nội
                    </Descriptions.Item>
                </Descriptions>
            </div>
            <Divider />
            <div className="summary-child">
                <Statistic
                    className="big"
                    title="Tổng thành viên hội người mù"
                    value={31}
                />
                <Statistic
                    className="big"
                    title="Số tuổi trung bình của hội viên"
                    value={30}
                />
                <Statistic
                    title="Tổng hội viên nam"
                    value={500}
                />
                <Statistic
                    title="Tổng hội viên nữ"
                    value={500}
                />
            </div>
            <Divider />
            <div className="sub-container-flex-row" >
                <div className="age-slider-piechart-panel">
                    <div className="wrap-border">
                        <Slider range defaultValue={[20, 50]} disabled={false} />
                        <Divider style={{border: "none"}} />
                        <Statistic
                            title="Tổng hội viên trong khoảng 30 - 50 tuổi"
                            value={500}
                        />
                    </div>
                    <div className="wrap-border">
                        <PieChart
                            data={pieChartData}
                            title={{
                                visible: true,
                                text: 'Trình độ chữ nổi của hội viên',
                            }}
                            description={{
                                visible: true,
                                text: 'Theo phần trăm',
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
                </div>
                <div className="barchart-stats-panel">
                    <div 
                    style= {{height: "72%"}}
                    className="wrap-border">
                        <BarChart
                            padding={50}
                            autoFit
                            data={barChartData}
                            title="Nghề nghiệp"
                        meta={{
                            year: {
                                alias:'year',
                                range: [0, 1],
                            },
                            value: {
                                alias: '数量',
                                formatter:(v)=>{return `${v}个`}
                            }
                            }}
                            // highlight-end
                            xField="year"
                            yField="value"
                            colorField="country"
                        />
                    </div>
                    <div style={{
                         display: "flex", justifyContent: "space-around"
                    }} >


                            <Statistic
                                className="wrap-border big"
                                title="Phần trăm có thẻ xe buýt" //From all or from organization
                                value={50}
                            />
                            <Statistic 
                                className="wrap-border big"
                                title="Phần trăm sử dụng tin học" //From all or from organization
                                value={40}
                            />

                            <Statistic
                                className="wrap-border big"
                                title="Phần trăm có giấy chứng nhận khuyết tật" //From all or from organization
                                value={50}
                            />
                    </div>
                </div>
            </div>
            <Divider />
            <div className="summary-child">
                <Statistic
                    className="big"
                    title="Tôn giáo chủ yếu" //From all or from organization
                    value={"Phật giáo"}
                />
                <Statistic
                    className="big" style={{ flex: "1 1 400px"}}
                    title="Thành viên đông nhất"
                    value={"Hội người mù quận Cầu Diễn"}
                />
                <Statistic
                    className="big"
                    title="Đời sống gia đình chủ yếu" //From all or from organization
                    value={"Trung bình"}
                />
            </div>
            <Divider />
            <div className="summary-child">
                <Statistic
                    className="big"
                    title="Trình độ chuyên môn cao nhất" //From all or from organization
                    value={"Tiến sĩ"}
                />
                <Statistic
                    title="Phần trăm biết nhiều hơn 2 ngoại ngữ" //From all or from organization
                    value={20}
                />
            </div>
            {/* May be click here again to change title and value to smallest */}

        </div>

    )
}