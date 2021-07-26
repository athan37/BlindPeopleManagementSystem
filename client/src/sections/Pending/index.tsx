import { Button, Spin, Divider } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { useEffect } from 'react';
export const Pending =  ({setViewer} : { setViewer : any}) => {
    const antIcon = <LoadingOutlined style={{ fontSize: 50 }} spin />;

    const handleOnClick = () => {
        window.location.href = "/login";
    }

    useEffect(() => {

        return () => {
                setViewer({
                id: null,
                name: null,
                token: null,
                avatar : null,
                isAdmin : false, 
                organization_id : null,
                didRequest : true,
                registering: true
            })
        }
    })

    return <div className="pending__container">
        <div className="pending__text-container">
            <h1>Hãy đăng nhập lại vào lần sau</h1>
            <h3>Tài khoản này đang chờ admin xét duyệt</h3>
            <Divider />
            <Spin indicator={antIcon} />
            <Divider />
            <Divider />
            <Button onClick={handleOnClick}>Quay lại trang đăng nhập</Button>
        </div>
    </div>
}