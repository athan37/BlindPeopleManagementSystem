import { useHistory } from "react-router";
import { Card, Button, Form, PageHeader } from "antd"
import { useEffect, useRef, useState } from "react";
import { convertEnumTrueFalse, createFormItem, organizationFormItems, SelectOrganizations } from "../../utils";
import { Organization as OrganizationData, OrganizationVariables } from "../../../../lib/graphql/queries/Organization/__generated__/Organization";
import { useLazyQuery, useMutation } from "@apollo/client";
import { QUERY_ORGANIZATION } from "../../../../lib/graphql/queries";
import { Viewer } from "../../../../lib";
import { UpdateOrganization as UpdateOrganizationData, UpdateOrganizationVariables } from "../../../../lib/graphql/mutations/UpdateOrganization/__generated__/UpdateOrganization";
import { UPDATE_ORGANIZATION } from "../../../../lib/graphql/mutations/UpdateOrganization";
import { displayErrorMessage, displaySuccessNotification } from "../../../../lib/utils";

const { Item } = Form;

interface Props {
    viewer: Viewer;
    refetchAllMembers: any;
}

export const EditOrganization = ({ viewer, refetchAllMembers} : Props) => {
    const history = useHistory();
    const [fields, setFields] = useState<any>([]);
    const [selectState, setSelectState] = useState<string>(viewer.organization_id || "");
    const [getOrganization, { data: orgData }] = 
    useLazyQuery<OrganizationData, OrganizationVariables>(
        QUERY_ORGANIZATION, {
            fetchPolicy: "no-cache"
        }
    );

    const [updateOrganization, { data: updateData, loading: updateLoading, error: updateError }] = useMutation<UpdateOrganizationData, UpdateOrganizationVariables>(UPDATE_ORGANIZATION, {
            onCompleted: data => {
                    if (data.updateOrganization) {
                        displaySuccessNotification("Thành viên đã được cập nhật ")
                    }
                },
            fetchPolicy: "no-cache"
            },
        );

    const ref = useRef(getOrganization);

    if (updateError) displayErrorMessage(`Không thể cập nhật thành viên ${updateError}`);

    useEffect(() => {
        if (selectState && selectState !== "") {
            ref.current({
                variables: {
                    organizationId: selectState
                }
            })
        } 
    }, [selectState])

    useEffect(() => {
        if (orgData && orgData.organization)  {
            const { organization } = orgData;

            const newFields : any[] = [] 
            Object.keys(organization).forEach((k, _) => {
                //@ts-expect-error: The key of this dict is still the key of that dict
                let value = organization[k];
                    newFields.push(
                        {
                            name: k,
                            value: value
                        }
                    )
                })

            setFields(newFields)
        }
    },[orgData])

    useEffect(() => {
        if (viewer.isAdmin) {
            if (updateData?.updateOrganization) {
                ref.current({
                    variables: {
                        organizationId: selectState
                    }
                })
            } 
        } else {
            ref.current({
                variables: {
                    organizationId: viewer.organization_id || ""
                }
            })
        }

        refetchAllMembers()
    }, [updateData, selectState, viewer, refetchAllMembers])

    const onFinish = (values : any) => {
        values = convertEnumTrueFalse(values);
        if (selectState && selectState !=="") {
            updateOrganization({
                variables: {
                    organizationId: selectState,
                    input: values
                }
            })
        } else {
            displayErrorMessage("Hãy chọn thành viên để chỉnh sửa")
        }

    }
    return <section className="profile-section" >
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
                    height: 150,
                    fontWeight: 400,
                    fontSize: 24,
                    letterSpacing: 1,
                    WebkitBoxShadow: "0 0.125rem 0.25rem rgb(0 0 0 / 8%)",
                    boxShadow: "0 0.125rem 0.25rem rgb(0 0 0 / 8%)",
                    paddingLeft: 50,
                    paddingTop:30
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
                extra={
                    viewer.isAdmin &&
                    <SelectOrganizations 
                        selectState={selectState}
                        setSelectState={setSelectState}
                        config={{
                            className: "stats__organizations-select",
                        }}
                    />
                }
                title="Xem và chỉnh sửa thành viên"
            >
                <Form
                    onFieldsChange={
                        (newFields) => { setFields(newFields) }
                    }
                    fields={fields}
                    onFinish={onFinish}
                    layout="vertical"
                >
                    { organizationFormItems.map((item) => createFormItem(item)) }
                    <Item>
                        <Button 
                            loading={updateLoading}
                            style={{width: 100}} 
                            htmlType="submit" type="primary">Lưu</Button>
                    </Item>
                    </Form>
            </Card>
        </section>

}