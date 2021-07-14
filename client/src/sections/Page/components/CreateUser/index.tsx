import { useHistory} from "react-router";
import { UpsertMember as UpsertMemberData, UpsertMemberVariables } from "../../../../lib/graphql/mutations/UpsertMember/__generated__/UpsertMember";
import { Organizations as OrganizationsData } from "../../../../lib/graphql/queries/Organizations/__generated__/Organizations";
import { Typography, Button, Form, PageHeader  } from "antd"
import { useEffect, useState } from "react";
import { bgColor } from "../../../../lib/bgColor";
import { deleteKey, displayErrorMessage, displaySuccessNotification } from "../../../../lib/utils";
import { useLazyQuery, useMutation } from "@apollo/client";
import { UPSERT_MEMBER } from "../../../../lib/graphql/mutations/UpsertMember";
import { Viewer } from "../../../../lib";
import { QUERY_ORGANIZATIONS } from "../../../../lib/graphql/queries/Organizations";
import { createFormItem, FormItems, SelectOrganizationsIfAdmin } from "../../utils";

const { Title } = Typography;
const { Item } = Form;


interface Props {
    viewer : Viewer
}
export const CreateUser = ({ viewer } : Props) => {
    const [fields, setFields] = useState<any>([])
    const [organizations, setOrganizations] = useState<any>([])
    const history = useHistory();

    const [upsertMember, { data : upsertData, loading : upsertLoading, error : upsertError, }] 
    = useMutation<UpsertMemberData, UpsertMemberVariables>(UPSERT_MEMBER);


    const [getOrganizations, { data : organizationsData }]
    = useLazyQuery<OrganizationsData>(QUERY_ORGANIZATIONS, {
        onCompleted: data => setOrganizations(data.organizations.results)
    })

    useEffect(() => {
        //This side effect only applicable for submit the form
        console.log("Reached here, waiting for go back")
        if (upsertError) {
            displayErrorMessage("Không thể cập nhật hội viên. Lỗi không xác định")
            return
        }

        if (upsertData && !(upsertData.upsertMember === "true"))  {
            displayErrorMessage(`Không thể cập nhật hội viên. ${upsertData.upsertMember} `)
            return
        }

        if (upsertData && upsertData.upsertMember === "true") {
            displaySuccessNotification("Chỉnh sửa hội viên thành công", 
            `Tua lên đầu trang để quay lại trang quản lý` )

            if (!upsertLoading) {
                history.goBack()
            }
        }

        return
    }, [upsertError, upsertData, upsertLoading, history])

    useEffect(() => {
        //Only fetch data if this is the admin account
        getOrganizations()
        if (viewer.isAdmin && organizationsData && organizationsData.organizations.results){
            setOrganizations(organizationsData.organizations.results)

            console.log("MTP", organizationsData.organizations.results)
        }
    }, [organizationsData, viewer.isAdmin, getOrganizations])

    const onFinish = (values : any) => {
        Object.keys(values).forEach( (k, _) : void => {
            let value = values[k];
            if (value === "Có") {
                value = true
            } else if (value === "Không") {
                value = false
            }


            if (k === "birthYear") 
            value = parseInt(value) 
            values[k] = value;
        })

        values = deleteKey(values)

        //If admin then there should be an additional field to select the organization
        if (!viewer.isAdmin) values["organization_id"] = viewer.organization_id;

        upsertMember({
            variables : {
                new: values 
            }
        })
    }

    return ( 
        <section className="profile-section" >
            <PageHeader
                ghost={false}
                style={{
                    backgroundColor: "white",
                    marginTop: 24,
                    padding: 24
                }}
                className="profile__page-header"
                onBack={() => history.push("/members")}
                title="Quay lại"
            />
            <Form
                onFieldsChange={
                    (newFields) => { setFields(newFields) }
                }
                fields={fields}
                onFinish={onFinish}
                layout="vertical"
            >
                <div style={{paddingBottom: 50}} className="profile__form-header">
                    <Title type="secondary">
                        Tạo hội viên
                    </Title>
                </div>
                {/* Main form items are here */}
                { SelectOrganizationsIfAdmin(organizations, viewer)}
                { FormItems.map((item) => createFormItem(item)) }
                
                <Item>
                    <Button style={{width: 100}} htmlType="submit" type="primary">Lưu</Button>
                </Item>
                </Form>
        </section>
    )
    }


