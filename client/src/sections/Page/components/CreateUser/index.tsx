import { useHistory} from "react-router";
import { UpsertMember as UpsertMemberData, UpsertMemberVariables } from "../../../../lib/graphql/mutations/UpsertMember/__generated__/UpsertMember";
import { Organizations as OrganizationsData } from "../../../../lib/graphql/queries/Organizations/__generated__/Organizations";
import { Card, Typography, Button, Form, PageHeader  } from "antd"
import { useEffect, useState } from "react";
import { deleteKey, displayErrorMessage, displaySuccessNotification } from "../../../../lib/utils";
import { useLazyQuery, useMutation } from "@apollo/client";
import { UPSERT_MEMBER } from "../../../../lib/graphql/mutations/UpsertMember";
import { Viewer } from "../../../../lib";
import { QUERY_ORGANIZATIONS } from "../../../../lib/graphql/queries/Organizations";
import { convertEnumTrueFalse, createFormItem, FormItems, SelectOrganizationsIfAdmin } from "../../utils";

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

        values = convertEnumTrueFalse(values);

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
                }}
                className="profile__page-header"
                onBack={() => history.push("/members")}
                title="Quay lại"
            />
            <Card
                headStyle={{
                    display: "flex",
                    height: 150,
                    fontWeight: 400,
                    fontSize: 24,
                    letterSpacing: 1,
                    alignItems: "center",
                    WebkitBoxShadow: "0 0.125rem 0.25rem rgb(0 0 0 / 8%)",
                    boxShadow: "0 0.125rem 0.25rem rgb(0 0 0 / 8%)",
                    paddingLeft: 50
                }}
                style={{
                    marginTop: "5%",
                    borderRadius: 25,
                    boxShadow: "rgb(145 158 171 / 24%) 0px 0px 2px 0px, rgb(145 158 171 / 24%) 0px 16px 32px -4px",
                    fontFamily: '"Poppins",system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto Sans",sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji"',
                }}
                bodyStyle={{
                    padding: "40px 40px"
                }}
                title="Tạo hội viên "
            >
                <Form
                    onFieldsChange={
                        (newFields) => { setFields(newFields) }
                    }
                    fields={fields}
                    onFinish={onFinish}
                    layout="vertical"
                >
                    {/* Main form items are here */}
                    { SelectOrganizationsIfAdmin(organizations, viewer)}
                    { FormItems.map((item) => createFormItem(item)) }
                    
                    <Item>
                        <Button style={{width: 100}} htmlType="submit" type="primary">Lưu</Button>
                    </Item>
                    </Form>
            </Card>
        </section>
    )
    }


