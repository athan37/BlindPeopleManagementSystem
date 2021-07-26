import { Select, Button, Layout, Form, Typography, Input, Divider } from "antd";
import { Viewer } from "../../lib"
import { ObjectId } from "bson";
import { Register as RegisterData, RegisterVariables } from "../../lib/graphql/mutations/RegisterMessage/__generated__/Register";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { REGISTER_MESSAGE } from "../../lib/graphql/mutations";
import { QUERY_ORGANIZATION, QUERY_ORGANIZATIONS } from "../../lib/graphql/queries";
import { Organizations as OrganizationsData } from "../../lib/graphql/queries/Organizations/__generated__/Organizations";
import { useEffect, useState } from "react";
import { Organization as OrganizationData, OrganizationVariables } from "../../lib/graphql/queries/Organization/__generated__/Organization";
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
            throw new Error(`Sth wrong with the request to server, check again input variables`)
        }
    });

    const [getOrganization, { data: orgData } ] = 
    useLazyQuery<OrganizationData, OrganizationVariables>(
        QUERY_ORGANIZATION, {
            fetchPolicy: "network-only"
        }
    );

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

    useEffect(() => {
        getOrganization({
            variables: {
                organizationId: selectState
            }
        })
    }, [selectState, getOrganization])

    const item = formState ?
        <Item key="new_organization" label="Tên chi nhánh hội người mù mới" name="organization_name" rules={
        [
            {
                required: true,
                message: "Đăng ký tên chi nhánh hội người mù mới"
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
                    message: `Điền tên chi nhánh thành viên`
                }
            ]
            }
        >
            <Select
                size={"large"}
                value={selectState}
                showSearch={true}
                placeholder={`Chọn chi nhánh thành viên`}
                onChange={ value => setSelectState(value)}
            >
                { (() => {
                    const options : any[] = []
                    organizations &&
                        organizations.forEach(
                            (item : any) => {
                                options.push(<Select.Option key={item._id} value={item._id}>{item.name}</Select.Option>)
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
            registeringPerson["content"]            = `Thành viên xin tạo mới chi nhánh ${inputState}`
        } else {
            registeringPerson["organization_id"]    = selectState;
            registeringPerson["organization_name"]  = orgData?.organization?.name;
            registeringPerson["content"]            = `Thành viên xin gia nhập chi nhánh đã có ${orgData && orgData.organization ? orgData.organization.name : null}`
        }

        register({
            variables: {
                input : registeringPerson
            }
        });

        // setViewer({
        //     id: null,
        //     token: null,
        //     avatar : null,
        //     isAdmin : null, 
        //     organization_id : null,
        //     didRequest : false,
        //     registering: null
        // } )

        // window.location.href = "/pending";

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
                <h3>Đăng ký chi nhánh mới hoặc chọn chi nhánh cũ để tạo tài khoản</h3>

                <img alt="Anh dai dien khong quan trọng"
                    src={bg} 
                />
            </div>
            
            <div className="register__form-container">
                <Form layout="vertical" onFinish={handleRegister}>
                    <div className="register__form-header">
                        <Title level={3} className="register__form-title">
                            Chọn chi nhánh hoặc tạo mới
                        </Title>
                        <Text type="secondary">
                            Điền thêm thông tin về tên chi nhánh, địa chỉ để được cấp quyền quản lý từ admin
                        </Text>
                    </div>
                        <Item>
                            <Button className="register__form-submit-button"
                                style={{
                                    width: "100%",
                                }}
                                type="primary" onClick={
                                () => setFormState(state => !state)
                            }>{formState ? "Chọn chi nhánh đã có" : "Tạo chi nhánh mới"}</Button>
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