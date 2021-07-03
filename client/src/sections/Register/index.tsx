import { Button, Layout, Form, Typography, Input } from "antd";
import { Viewer } from "../../lib"
import { ObjectId } from "bson";
import { Redirect } from "react-router";
import { Register as RegisterData, RegisterVariables } from "../../lib/graphql/mutations/RegisterMessage/__generated__/Register";
import { useMutation } from "@apollo/client";
import { REGISTER_MESSAGE } from "../../lib/graphql/mutations";

const { Title, Text } = Typography;

const { Content } = Layout;
const { Item } = Form;

interface Props {
    viewer: Viewer;
    setViewer: (viewer: Viewer) => void;
}




export const Register = ({ viewer, setViewer } : Props) => {
    const [register, {
        data: registerData, loading: registerLoading, error: registerError
    }] = useMutation<RegisterData, RegisterVariables>(REGISTER_MESSAGE, {
        onCompleted: () => {
            console.log("Request to server to get register function is successful")
        },
        onError: (err) => {
            throw new Error(`Sth wrong with the request to server, check again input variables`)
        }
    });

    const handleRegister = (values : any) => {
        //Here, it will update the message to the database
        //It will wait for the admin to approve 
        //This time, the organization id is still non, 
        //and it will update later in the database
        const registeringPerson : RegisterVariables["input"] = 
        {  
            id : (new ObjectId()).toString(), //This is the id of the message
            user_id : viewer.id ? viewer.id : null, //This is the id of the user
            avatar : viewer.avatar,
            isAdmin: false,
            organization_id: null,
            organization_name : values.organization_name,
            content: "Thành viên hội người mù xin được cấp quyền từ admin"
        }


        register({
            variables: {
                input : registeringPerson
            }
        });

        // return <Redirect to={"/pending"} />

        window.location.href = "/pending";

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
                <Item>
                    <Button type="primary" htmlType="submit">Submit</Button>
                </Item>
            </Form> 
        </Content>
    )
}