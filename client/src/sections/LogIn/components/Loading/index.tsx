import { Spin } from "antd";
import { LoadingOutlined } from '@ant-design/icons';

export const Loading = () => {

    const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
    return (
        <div style={{ 
            width: '100%',
            height: '100%',
            display: "flex", 
            alignItems: "center",
            justifyContent: "center"
        }}>
            <Spin indicator={antIcon}/>
        </div>
    ) 
}