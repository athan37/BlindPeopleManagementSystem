import { Layout, Form, Typography, Input } from "antd";
import { Organization, Viewer } from "../../lib"
import { ObjectId } from "bson";

const { Title, Text } = Typography;

const { Content } = Layout;
const { Item } = Form;

interface Props {
    viewer: Viewer;
    setViewer: (viewer: Viewer) => void;
}

interface ApprovalRequest extends Viewer {
    organization_name : string
    content: string,
    user_id: string | null
}



export const Register = ({ viewer, setViewer } : Props) => {
    const handleRegister = (values : any) => {
        //Here, it will update the message to the database
        //It will wait for the admin to approve 
        //This time, the organization id is still non, 
        //and it will update later in the database
        const registeringPerson : ApprovalRequest = 
        {   ...viewer,
            organization_name : values.organization_name,
            user_id : viewer.id ? viewer.id : null, //This is the id of the user
            id : (new ObjectId()).toString(), //This is the id of the message
            isAdmin: false,
            content: "Thành viên hội người mù xin được cấp quyền từ admin"
        }

    }
    return (
        <Content className="register-content">
            <Form layout="vertical" onFinish={handleRegister}>
                <div className="register__form-header">
                    <Title level={3} className="register__form-title">
                        Đăng ký thành viên quản lý hội người mù
                    </Title>
                    <Text type="secondary">
                        Điền thêm thông tin về tên chi nhánh, địa chỉ để được cấp quyền quản lý từ admin
                    </Text>
                </div>

                <Item label="Tên chi nhánh" name="organization_name" rules={
                [
                    {
                        required: true,
                        message: "Điền tên chi nhánh hội người mù"
                    }
                ]
                }>
                    <Input placeholder="Hội người mù quận Thanh Xuân..." />
                </Item>
            </Form> 
        </Content>
    )
}