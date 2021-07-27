import { Select, Button, Layout, Form, Typography, Input, Divider } from "antd";
import { Viewer } from "../../lib"
import { ObjectId } from "bson";
import { Register as RegisterData, RegisterVariables } from "../../lib/graphql/mutations/RegisterMessage/__generated__/Register";
import { useMutation, useQuery } from "@apollo/client";
import { REGISTER_MESSAGE } from "../../lib/graphql/mutations";
import { QUERY_ORGANIZATIONS } from "../../lib/graphql/queries";
import { Organizations as OrganizationsData } from "../../lib/graphql/queries/Organizations/__generated__/Organizations";
import { useEffect, useState } from "react";
import bg from "./assets/bg.jpg"
import { Pending } from "../Pending";

const { Title, Text } = Typography;
const { Item } = Form;

interface Props {
    viewer: Viewer;
    setViewer: (viewer: Viewer) => void;
}


export const Register = ({ viewer, setViewer } : Props) => {
    const [organizations, setOrganizations] = useState<any>([])
    const [register, { data: registerData, loading: registerLoading, error: registerError
    }] = useMutation<RegisterData, RegisterVariables>(REGISTER_MESSAGE, {
        onCompleted: () => {
            console.log("Request to server to get register function is successful")
        },
        onError: (err) => {
            throw new Error(`Sth wrong with the request to server, check again input variables: ${err}`)
        }
    });

    // const [getOrganization, { data: orgData } ] = 
    // useLazyQuery<OrganizationData, OrganizationVariables>(
    //     QUERY_ORGANIZATION, {
    //         fetchPolicy: "network-only"
    //     }
    // );

    useQuery<OrganizationsData>(QUERY_ORGANIZATIONS, {
        onCompleted: data => setOrganizations(data.organizations.results)
    })

    const [formState, setFormState] = useState<boolean>(false); 
    //true is input, false is select, or input on top
    const [inputState, setInputState]   = useState<string>("");
    const [selectState, setSelectState] = useState<string>("");
    const [formComplete, setFormComplete] = useState<boolean>(false);

    useEffect(() => {
        if (registerData?.register && !registerError) {
            setFormComplete(true)
        }

    }, [registerData?.register, registerError])

    // useEffect(() => {
    //     getOrganization({
    //         variables: {
    //             organizationId: selectState
    //         }
    //     })
    // }, [selectState, getOrganization])

    const item = formState ?
        <Item key="new_organization" label="Tên thành viên hội người mù mới" name="organization_name" rules={
        [
            {
                required: true,
                message: "Đăng ký tên thành viên hội người mù mới"
            }
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
            organization_id: selectState,
            organization_name : inputState,
            content: ""
        }



        if (formState) {
            registeringPerson["organization_name"]  = inputState;
            registeringPerson["organization_id"]    = null;
            registeringPerson["content"]            = `Người dùng xin tạo mới thành viên ${inputState}`
        } else {
            const [orgId, orgName] = values.organization_id.split("-");
            registeringPerson["organization_id"]    = orgId;
            registeringPerson["organization_name"]  = orgName;
            registeringPerson["content"]            = `Người dùng xin gia nhập thành viên đã có ${orgName}`
        }

        register({
            variables: {
                input : registeringPerson
            }
        });

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
                                loading={registerLoading}
                                className="register__form-submit-button"
                                type="primary" 
                                htmlType="submit">Submit</Button>
                        </Item>
                </Form> 
            </div>
    </Layout>
    )
}