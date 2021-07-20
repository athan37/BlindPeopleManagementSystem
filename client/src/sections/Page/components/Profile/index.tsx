import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { useHistory, useParams } from "react-router";
import { MEMBER } from "../../../../lib/graphql/queries/Member";
import { Member as MemberData, MemberVariables } from "../../../../lib/graphql/queries/Member/__generated__/Member";
import { UpsertMember as UpsertMemberData, UpsertMemberVariables } from "../../../../lib/graphql/mutations/UpsertMember/__generated__/UpsertMember";
import { DeleteMember as DeleteMemberData, DeleteMemberVariables } from "../../../../lib/graphql/mutations/DeleteMember/__generated__/DeleteMember";
import { Typography, Button, Form, PageHeader, Skeleton } from "antd"
import { useEffect, useState } from "react";
import { deleteKey, displayErrorMessage, displaySuccessNotification } from "../../../../lib/utils";
import { UPSERT_MEMBER } from "../../../../lib/graphql/mutations/UpsertMember";
import { Organizations as OrganizationsData } from "../../../../lib/graphql/queries/Organizations/__generated__/Organizations";
import { QUERY_ORGANIZATIONS } from "../../../../lib/graphql/queries/Organizations";
import { Viewer } from "../../../../lib";
import { convertEnumTrueFalse, createFormItem, FormItems, SelectOrganizationsIfAdmin } from "../../utils";
import { DELETE_MEMBER } from "../../../../lib/graphql/mutations";
import { InputMember } from "../../../../lib/graphql/globalTypes";

const { Title } = Typography;
const { Item } = Form;

interface Params {
    id : string
    organizationId : string
}

interface Props {
    viewer : Viewer
}

export const Profile = ({ viewer } : Props ) => {
    const [fields, setFields] = useState<any>([])
    const [organizations, setOrganizations] = useState<any>([])
    const { id, organizationId }  = useParams<Params>();
    const history = useHistory();

    const [getOrganizations, { data : organizationsData }]
    = useLazyQuery<OrganizationsData>(QUERY_ORGANIZATIONS, {
        onCompleted: data => setOrganizations(data.organizations.results)
    })


    const [deleteMember, { data: deleteMemberData, error: deleteMemberError }]
    = useMutation<DeleteMemberData, DeleteMemberVariables>(DELETE_MEMBER);

    const [upsertMember, { data : upsertData, loading : upsertLoading, error : upsertError, }] = useMutation<UpsertMemberData, UpsertMemberVariables>(UPSERT_MEMBER);
    const { data, loading, error} = useQuery<MemberData, MemberVariables>(
        MEMBER, { 
            variables : { 
                id : id,
                organizationId : organizationId
            }
        })

    useEffect(() => {
        //This side effect only applicable for submit the form
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
            `Hội viên tên ${fields[2].value} ${fields[1].value} đã được chỉnh sửa` )

            if (!upsertLoading) {
                history.goBack()
            }
        }

        if (deleteMemberData && !(deleteMemberData.deleteMember === true)) {
            displayErrorMessage(`Không thể xóa hội viên.`)
            return 
        }

        if (deleteMemberData && deleteMemberData.deleteMember === true) {
            console.log("This is the fields", fields)
            displaySuccessNotification("Xóa hội viên thành công", 
            `Hội viên tên ${fields[3].value} ${fields[2].value} đã bị xóa` )

            if (!upsertLoading) {
                history.goBack()
            }
        }

        return
    }, [upsertError, upsertData, upsertLoading, history, fields, deleteMemberData, deleteMemberError])

    useEffect(() =>   {
        if (data && data.member)  {
            const { member } = data;

            const newFields : any[] = [] 
            Object.keys(member).forEach((k, _) => {
                //@ts-expect-error: The key of this dict is still the key of that dict
                //Antd only have option for "false" or "true" as string
                //So that, true or false should be convert to string
                let value = member[k];
                if ([true, false].includes(value)) {
                    if (value === true) {
                        value = "Có"
                    } else if (value === false) {
                        value = "Không"
                    } 
                }
                    newFields.push(
                        {
                            name: k,
                            value: value
                        }
                    )
                })

            setFields(newFields)
        }
        },[data])

    useEffect(() => {
        //Only fetch data if this is the admin account
        getOrganizations()
        if (viewer.isAdmin && organizationsData && organizationsData.organizations.results){
            setOrganizations(organizationsData.organizations.results)
        }
    }, [organizationsData, viewer.isAdmin, getOrganizations])

    const onFinish = async (values : any) => {

        values = convertEnumTrueFalse(values);

        let old : any = null;

        if (data && data.member) {
            old = deleteKey(data.member)
        }

        //Process the input to server by deleting the id field (will be genereted by the server)

        values = deleteKey(values)
        old    = deleteKey(old, "__typename")

        if (!viewer.isAdmin) values["organization_id"] = old.organization_id;

        console.log("Submit", values)

        await upsertMember({
            variables: {
                old: old,
                new: values
            }
        })



    }

    if (loading) {
        return (
            <Skeleton />
        )
    }

    if (error) {
        displayErrorMessage("Có lỗi xảy ra, xin vui lòng reload lại");
        return (
            <div>There are some errors, please try again later</div>
        )
    }

    if (data && data.member && fields)  {
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
                    onFieldsChange={(newFields) => {
                        setFields(newFields)
                    }}
                    onFinish={onFinish}
                    layout="vertical"
                    fields={fields}
                >
                    <div className="profile__form-header">
                        <Title type="secondary">
                            Xem và chỉnh sửa thông tin hội viên
                        </Title>
                    </div>
                    {/* Main form items are here */}
                    { SelectOrganizationsIfAdmin(organizations, viewer )}
                    { FormItems.map((item) => createFormItem(item)) }
                    
                    <div style={{
                        display: "flex",
                        flexDirection: "row"
                    }}>
                        <Item >
                            <Button style={{width: 100}} htmlType="submit" type="primary">Lưu</Button>
                        </Item>
                        <Item style={{marginLeft: "8%"}}>
                            <Button onClick={ () => {
                                 deleteMember({
                                     variables: {
                                         memberId: id
                                     }
                                 }) } 
                            }
                                 danger type="primary">Xóa hội viên</Button>
                        </Item>
                    </div>
                    </Form>
            </section>
        )
    }

    return (
        <h1>This user does not exist</h1>
    )
}