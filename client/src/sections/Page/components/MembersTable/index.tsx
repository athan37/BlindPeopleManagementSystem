import { Table } from "antd";
import { useHistory } from "react-router";
import { useQuery } from "@apollo/client";
import { MEMBERS } from "../../../../lib/graphql/queries";
import { Members as MembersData, MembersVariables } from "../../../../lib/graphql/queries/Members/__generated__/Members";
import { Viewer } from "../../../../lib";


interface Props {
    viewer: Viewer
}
export const MembersTable = ({ viewer } : Props) => {
    let history = useHistory();

    const { data, loading, error } = useQuery<MembersData, MembersVariables>(MEMBERS, {
        variables: {
            organizationId: viewer.organization_id || ""
        }, 
        fetchPolicy: "network-only",
        onCompleted: data => console.log(data.members.results)
    });

    if (loading) {
        console.log("Skeleton will be here")
    }

    if (error)  {
        throw Error("Cannot fetch members, check server connection again")
    }

    type Member = MembersData["members"]["results"][0];


    const columns = [
        {
            title: "Họ",
            dataIndex: 'lastName',
            key:"lastName",
            sorter: (a : Member, b : Member) => a.lastName.length - b.lastName.length

        },
        {
            title: "Tên",
            dataIndex: 'firstName',
            key:"firstName",
            sorter: (a : Member, b : Member) => a.firstName.length - b.firstName.length
        },
        {
            title: "Giới tính",
            dataIndex: 'gender',
            key:"gender",
            sorter: (a : Member, b : Member) => a.gender.length - b.gender.length
        },
        {
            title: "Năm sinh",
            dataIndex: 'birthYear',
            key:"birthYear",
            sorter: (a : Member, b : Member) => a.birthYear - b.birthYear
        },
    ]

    return (
        <>
            { data ? <Table 
            tableLayout="fixed"
            rowKey={member => member.id} onRow={(member) => { 
                return {
                    onClick: () => {
                        console.log("Hey", member)
                        if (viewer.isAdmin) {
                            history.push(`/user/${member.id}`)
                        } else {
                            history.push(`/user/${member.organization_id}/${member.id}`)
                        }
                    }
                }
            }} columns={columns} dataSource={data.members.results} /> : null}
        </>
    )
}
