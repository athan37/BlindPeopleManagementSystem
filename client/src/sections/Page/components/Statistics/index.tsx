import { Input, Card, Statistic, Divider, Descriptions } from "antd"
import { ArrowDownOutlined, ArrowUpOutlined } from "@ant-design/icons"
import { BarChart, Chart, Legend, Tooltip, Geom } from "bizcharts";

    const data = [
        { 地区: "华东", 销售额: 4684506.442 },
        { 地区: "中南", 销售额: 4137415.0929999948 },
        { 地区: "东北", 销售额: 2681567.469000001 },
        { 地区: "华北", 销售额: 2447301.017000004 },
        { 地区: "西南", 销售额: 1303124.508000002 },
        { 地区: "西北", 销售额: 815039.5959999998 }
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
            <div className="summary-child" style={{width: "30%"}}>
                <div >
                    <Input style={{width: 100, marginRight: 50}}/>
                    <Input style={{width: 100}}/>
                    <Divider style={{border: "none"}} />
                    <Statistic
                        title="Tổng hội viên trong khoảng 30 - 50 tuổi"
                        value={500}
                    />
                </div>
                <Chart width={600} height={400} data={data}>
                    <Legend visible={false} /> 
                    <Tooltip visible={false} /> 
                    <Geom type="area" position="genre*sold" color="genre" />
                    </Chart>

                    <Chart width={600} height={400} data={data}>
                    <Legend /> 
                    <Geom type="area" position="genre*sold" color="genre" />
                </Chart>
            </div>
            <Divider style={{ border: "none" }} />
            <Statistic
                className="big"
                title="Nghề phổ thông nhất"
                value={"Lái xe"}
            />
            <Statistic
                title="Tôn giáo chủ yếu" //From all or from organization
                value={"Phật giáo"}
            />
            <Statistic
                className="big"
                title="Phần trăm có thẻ bảo hiểm y tế" //From all or from organization
                value={50}
            />
            <Statistic
                title="Phần trăm đảng viên" //From all or from organization
                value={50}
            />
            <Statistic
                className="big"
                title="Phần trăm có thẻ xe buýt" //From all or from organization
                value={50}
            />
            <Statistic
                className="big"
                title="Phần trăm có giấy chứng nhận khuyết tật" //From all or from organization
                value={50}
            />
            <Statistic
                className="big"
                title="Trình độ chữ nổi chung" //From all or from organization
                value={"M1"}
            />
            <Statistic
                title="Dân tộc chủ yếu" //From all or from organization
                value={"Kinh"}
            />
            <Statistic
                className="big"
                title="Đời sống gia đình chủ yếu" //From all or from organization
                value={"Trung bình"}
            />
            <Statistic
                className="big"
                title="Phần trăm sử dụng tin học" //From all or from organization
                value={40}
            />
            <Statistic
                className="big"
                title="Trình độ chuyên môn cao nhất" //From all or from organization
                value={"Tiến sĩ"}
            />
            <Statistic
                title="Phần trăm biết nhiều hơn 2 ngoại ngữ" //From all or from organization
                value={20}
            />
            {/* May be click here again to change title and value to smallest */}
            <Statistic
                className="big"
                title="Thành viên đông nhất"
                value={"Hội người mù quận Cầu Diễn"}
            />

        </div>

    )
}