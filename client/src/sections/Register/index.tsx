import { Select, Button, Layout, Form, Typography, Input, Divider, message } from "antd";
import { Viewer } from "../../lib"
import { useMutation, useQuery } from "@apollo/client";
import { QUERY_ORGANIZATIONS } from "../../lib/graphql/queries";
import { Organizations as OrganizationsData } from "../../lib/graphql/queries/Organizations/__generated__/Organizations";
import { useEffect, useState } from "react";
import bg from "./assets/bg.jpg"
import { Pending } from "../Pending";
import { HandleMessage as HandleMessageData, HandleMessageVariables } from "../../lib/graphql/mutations/HandleMessageFromClient/__generated__/HandleMessage";
import { HANDLE_MESSSAGE } from "../../lib/graphql/mutations/HandleMessageFromClient";
import { displayErrorMessage } from "../../lib/utils";
import { MessageType, ServerMessageAction } from "../../lib/graphql/globalTypes";

const { Title, Text } = Typography;
const { Item } = Form;

interface Props {
    viewer: Viewer;
    setViewer: (viewer: Viewer) => void;
}


export const Register = ({ viewer, setViewer } : Props) => {
    const [organizations, setOrganizations] = useState<any>([])
    useQuery<OrganizationsData>(QUERY_ORGANIZATIONS, {
        onCompleted: data => setOrganizations(data.organizations.results)
    })

    const [handleMessage, { data : handleMessageData, loading : handleMessageLoading, error : handleMessageError }] = useMutation<HandleMessageData, 
    HandleMessageVariables>(HANDLE_MESSSAGE, {
        onError: err => displayErrorMessage(`Không thể thực hiện thao tác ${err}`)
    });

    const [formState, setFormState] = useState<boolean>(false); 
    //true is input, false is select, or input on top
    const [inputState, setInputState]   = useState<string>("");
    const [selectState, setSelectState] = useState<string>("");
    const [formComplete, setFormComplete] = useState<boolean>(false);

    useEffect(() => {
        if (handleMessageData?.handleMessageFromClient === "true" && !handleMessageError) {
            setFormComplete(true);
        }
    }, [handleMessageData, handleMessageError])

    const item = formState ?
        <Item key="new_organization" label="Tên thành viên hội người mù mới" name="organization_name" rules={
        [
            {
                required: true,
                message: "Đăng ký tên thành viên hội người mù mới"
            },
            () => ({
                validator(_ : any, value : string) {
                    const excludeWords = [
                        "Thành phố", "Hội", "TP", "Người mù",
                        "Thanh pho", "Hoi", "Nguoi mu",
                    ]
                    excludeWords.forEach(word => {
                        if (value.includes(word)) return Promise.reject(
                            new Error("Chỉ điền tên thành viên. Ví dụ: Hội người mù quận Thanh Xuân, điền Thanh Xuân")
                        )
                    });

                    return Promise.resolve()
                },
            })
        ]
        }>
        <Input 
            size={"large"}
            onChange={e => setInputState(e.target.value)}
            value={inputState}
            placeholder="Hội người mù quận Thanh Xuân..." />
        </Item> 
        : 
        <Item 
            key="exist_organization" 
            label="Chọn hội thành viên" 
            name="organization_id"
            rules={
            [
                {
                    required: true,
                    message: `Chọn tên thành viên`
                }
            ]
            }
        >
            <Select
                size={"large"}
                value={selectState}
                showSearch={true}
                placeholder={`Chọn thành viên đã có`}
                onChange={ value => setSelectState(value)}
            >
                { (() => {
                    const options : any[] = []
                    organizations &&
                        organizations.forEach(
                            (item : any) => {
                                options.push(<Select.Option key={item._id} value={`${item._id}-${item.name}`}>{item.name}</Select.Option>)
                            }
                        )

                    return options
                    })() //Create func above and call the func here
                }
            </Select>
        </Item>

    const handleRegister = (values : any) => {
        console.log(values)
        //Here, it will update the message to the database
        //It will wait for the admin to approve 
        //This time, the organization id is still non, 
        //and it will update later in the database
        // const registeringPerson : RegisterVariables["input"] = 
        // {  
        //     id : (new ObjectId()).toString(), //This is the id of the message
        //     user_id : viewer.id ? viewer.id : null, //This is the id of the user
        //     avatar : viewer.avatar,
        //     isAdmin: false,
        //     organization_id: selectState,
        //     organization_name : inputState,
        //     content: ""
        // }

        const registeringPerson : HandleMessageVariables["input"] = {
            action: ServerMessageAction.REQUEST,
            type: MessageType.REGISTER,
            from_id: viewer.id || "",
            to_organizationId: "",
            content: ""
        }

        if (formState) {
            // registeringPerson["organization_name"]  = inputState;
            // registeringPerson["organization_id"]    = null;
            registeringPerson["content"]            = `create-${inputState}`
        } else {
            const [orgId, orgName] = values.organization_id.split("-");
            // registeringPerson["organization_id"]    = orgId;
            // registeringPerson["organization_name"]  = orgName;
            registeringPerson["content"]            = `exist-${orgId}`
        }

        handleMessage(
            {
                variables: {
                    input: registeringPerson
                }
            }
        )

    }

    if (formComplete || viewer.registering === true) {
        return <Pending setViewer={setViewer} />
    }

    return (
        <Layout style={{
            height: '100%',
            width: '100%',
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: "white"
        }}>
            <div className="register__img-container">
                <h3>Đăng ký thành viên mới hoặc chọn thành viên đã có để tạo tài khoản</h3>

                <img alt="Anh dai dien khong quan trọng"
                    src={bg} 
                />
            </div>
            
            <div className="register__form-container">
                <Form layout="vertical" onFinish={handleRegister}>
                    <div className="register__form-header">
                        <Title level={3} className="register__form-title">
                            Chọn thành viên hoặc tạo mới
                        </Title>
                        <Text type="secondary">
                            Điền thêm thông tin về tên thành viên, địa chỉ để được cấp quyền quản lý từ admin
                        </Text>
                    </div>
                        <Item>
                            <Button className="register__form-submit-button"
                                style={{
                                    width: "100%",
                                }}
                                type="primary" onClick={
                                () => setFormState(state => !state)
                            }>{formState ? "Chọn thành viên đã có" : "Tạo thành viên mới"}</Button>
                        </Item>
                        <Divider />
                        {item}
                            {/* Only copy viewer and update here to list the organizations */}
                        <Item>
                            <Button 
                                loading={handleMessageLoading}
                                className="register__form-submit-button"
                                type="primary" 
                                htmlType="submit">Submit</Button>
                        </Item>
                </Form> 
            </div>
    </Layout>
    )
}