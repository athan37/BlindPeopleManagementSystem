import { Table } from "antd";
import { useHistory } from "react-router";
import { useQuery } from "@apollo/client";
import { MEMBERS } from "../../../../lib/graphql/queries";
import { Members as MembersData, MembersVariables } from "../../../../lib/graphql/queries/Members/__generated__/Members";

export const MembersTable = () => {
    let history = useHistory();

    const { data, loading, error } = useQuery<MembersData, MembersVariables>(MEMBERS, {
        variables: {
            organizationId: "60d57b609454ef427c453449"
        }, 
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
            { data ? <Table rowKey={member => member.id} onRow={(member) => { 
                return {
                    onClick: () => {
                        console.log("Hey", member)
                        history.push(`/user/${member.id}`)
                    }
                }
            }} columns={columns} dataSource={data.members.results} /> : null}
        </>
    )
}
