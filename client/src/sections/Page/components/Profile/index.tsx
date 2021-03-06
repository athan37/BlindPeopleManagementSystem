import { useMutation, useQuery } from "@apollo/client";
import { useHistory, useParams } from "react-router";
import { MEMBER } from "../../../../lib/graphql/queries/Member";
import { Member as MemberData, MemberVariables } from "../../../../lib/graphql/queries/Member/__generated__/Member";
import { UpsertMember as UpsertMemberData, UpsertMemberVariables } from "../../../../lib/graphql/mutations/UpsertMember/__generated__/UpsertMember";
import { DeleteMember as DeleteMemberData, DeleteMemberVariables } from "../../../../lib/graphql/mutations/DeleteMember/__generated__/DeleteMember";
import { Button, Form, PageHeader, Card, Divider } from "antd"
import { useEffect, useState } from "react";
import { deleteKey, displayErrorMessage, displaySuccessNotification } from "../../../../lib/utils";
import { UPSERT_MEMBER } from "../../../../lib/graphql/mutations/UpsertMember";
import { Viewer } from "../../../../lib";
import { convertEnumTrueFalse, createFormItem, FormItems, SelectOrganizations } from "../../utils";
import { DELETE_MEMBER } from "../../../../lib/graphql/mutations/DeleteMember";
import { FormSkeleton } from "../../utils/FormSkeleton";
import { TransferMemberModal } from "./components";

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
    const { id, organizationId }  = useParams<Params>();
    const params = useParams<Params>();
    const history = useHistory();
    const [ modalVisible, setModalVisible ] = useState<boolean>(false);

    const [deleteMember, { data: deleteMemberData, error: deleteMemberError }]
    = useMutation<DeleteMemberData, DeleteMemberVariables>(DELETE_MEMBER);

    const [upsertMember, { data : upsertData, loading : upsertLoading, error : upsertError, }] = useMutation<UpsertMemberData, UpsertMemberVariables>(UPSERT_MEMBER);
    const { data, loading, error } = useQuery<MemberData, MemberVariables>(
        MEMBER, { 
            variables : { 
                id : id,
                organizationId : organizationId
            },
            fetchPolicy: "network-only"
        })


    const [ selectState, setSelectState ] = useState<string>(params.organizationId);
    
    useEffect(() => {
        //This side effect only applicable for submit the form
        if (upsertError) {
            displayErrorMessage("Kh??ng th??? c???p nh???t h???i vi??n. L???i kh??ng x??c ?????nh")
            return
        }

        if (upsertData && upsertData.upsertMember !== "true")  {
            displayErrorMessage(`Kh??ng th??? c???p nh???t h???i vi??n. ${upsertData.upsertMember} `)
            return 
        }

        let fieldIdx = viewer.isAdmin ? 1 : 0;

        if (upsertData && upsertData.upsertMember === "true") {
            displaySuccessNotification("Ch???nh s???a h???i vi??n th??nh c??ng", 
            `H???i vi??n t??n ${fields[fieldIdx].value} ${fields[fieldIdx + 1].value} ???? ???????c ch???nh s???a` )

            // refetchAllMembers() //Important for csv
            if (!upsertLoading) {
                history.goBack()
            }
        }


        if (deleteMemberData && !(deleteMemberData.deleteMember === true)) {
            displayErrorMessage(`Kh??ng th??? x??a h???i vi??n.`)
            return 
        }

        if (deleteMemberData && deleteMemberData.deleteMember === true) {
            let firstName = "";
            let lastName  = "";
            for (const field of fields) {
                if (field.name === "lastName") firstName = field.value;

                if (field.name === "firstName") lastName = field.value;
            }

            displaySuccessNotification("X??a h???i vi??n th??nh c??ng", 
            `H???i vi??n t??n ${firstName} ${lastName} ???? b??? x??a` )

            // refetchAllMembers() //Important for csv file
            if (!upsertLoading) {
                history.goBack()
            }
        }

        return
    }, [upsertError, 
        upsertData, 
        upsertLoading, 
        history, fields, 
        deleteMemberData, 
        deleteMemberError,
        viewer.isAdmin
    ])

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
                        value = "C??"
                    } else if (value === false) {
                        value = "Kh??ng"
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
            setSelectState(data.member.organization_id)
        }
        },[data])


    const onFinish = async (values : any) => {
            //Set it to the original organization Id
            values.organization_id = data?.member?.organization_id 
            if (viewer.isAdmin && selectState !== "") { 
                values.organization_id = selectState 
            } 
            // else {
            //     values.organization_id = data?.member?.organization_id;
            // }
            values = convertEnumTrueFalse(values);

            let old : any = null;

            if (data && data.member) {
                old = deleteKey(data.member)
            }

            //Process the input to server by deleting the id field (will be genereted by the server)

            values = deleteKey(values)
            old    = deleteKey(old, "__typename")

            await upsertMember({
                variables: {
                    old: old,
                    new: values
                }
            })
    }

    if (loading) {
        return <FormSkeleton />
    }

    if (error) {
        displayErrorMessage("C?? l???i x???y ra, xin vui l??ng reload l???i");
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
                    title="Quay l???i"
                />

            <Card
                extra={
                    !viewer.isAdmin &&
                    <div
                        style={{
                            width: "100px !important",
                            marginRight: 30
                        }}
                    >
                        <Button
                            onClick={() => setModalVisible(true)}
                            type="primary"
                        >Chuy???n h???i vi??n</Button>
                    </div>
                }
                headStyle={{
                    width: "100%",
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
                title="Xem v?? ch???nh s???a th??ng tin h???i vi??n"
            >
                <Form
                    onFieldsChange={(newFields) => {
                        setFields(newFields)
                    }}
                    onFinish={onFinish}
                    layout="vertical"
                    fields={fields}
                >
                    {/* Main form items are here */}
                    { 
                        viewer.isAdmin && 
                        <>
                        <Item 
                            className="select-organization"
                            key="organization_id" 
                            label="Th??nh vi??n hi???n t???i"
                            name="organization_id"
                            rules={
                            [
                                {
                                    required: true,
                                    message: `Ch???n th??nh vi??n`
                                }
                            ]
                            }
                        >
                            <SelectOrganizations
                                selectState={selectState}
                                setSelectState={setSelectState}
                                config={{
                                    size : "medium"
                                }}
                            />
                        </Item>
                        <Divider />
                        </>
                    }
                    {/* {viewer.isAdmin && SelectOrganizationsIfAdmin(viewer.organization_id)} */}
                    { FormItems.map((item) => createFormItem(item)) }
                    
                    <div style={{
                        display: "flex",
                        flexDirection: "row"
                    }}>
                        <Item >
                            <Button 
                                style={{width: 100}} 
                                htmlType="submit" 
                                type="primary">L??u</Button>
                        </Item>
                        <Item style={{marginLeft: "8%"}}>
                            <Button onClick={ () => {
                                 deleteMember({
                                     variables: {
                                         memberId: id
                                     }
                                 }) 
                                } 
                            }
                                 danger type="primary">X??a h???i vi??n</Button>
                        </Item>
                    </div>
                    </Form>
                </Card>
                <TransferMemberModal
                    memberData={data.member}
                    viewer={viewer}
                    modalVisible={modalVisible}
                    setModalVisible={setModalVisible}
                />
            </section>
        )
    }

    return (
        <h1>This user does not exist</h1>
    )
}