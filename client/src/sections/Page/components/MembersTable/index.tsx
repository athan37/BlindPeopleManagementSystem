import { Table, Input, Layout  } from "antd";
import { useHistory } from "react-router";
import { useQuery } from "@apollo/client";
import { MEMBERS } from "../../../../lib/graphql/queries";
import { Members as MembersData, MembersVariables } from "../../../../lib/graphql/queries/Members/__generated__/Members";
import { Viewer } from "../../../../lib";
import { PageSkeleton } from "./skeletons";
import { Filter, MembersPagination } from "./components";
import { useEffect, useRef, useState } from "react";
import { convertEnumTrueFalse, SelectOrganizations } from "../../utils";
import { displayErrorMessage } from "../../../../lib/utils";

const { Header, Content } = Layout;
const { Search } = Input;

interface Props {
    viewer: Viewer
    filterState: any;
    setFilterState: any
    searchState: any
    setSearchState: any
    searchData: any
    setSearchData: any
    organizationId: any
    setOrganziationId: any
}

const PAGE_LIMIT = 5;
export const MembersTable = ({ 
    filterState,
    setFilterState,
    searchState,
    setSearchState,
    searchData,
    setSearchData,
    organizationId,
    setOrganziationId,
    viewer
 } : Props) => {
    let history = useHistory();
    const [page, setPage] = useState(1);
    const { data, loading, error, refetch } = useQuery<MembersData, MembersVariables>(MEMBERS, {
        variables: {
            organizationId: viewer.organization_id || "",
            limit: PAGE_LIMIT,
            page: 1
        }, 
        fetchPolicy: "cache-and-network",
    });

    // Move these thing to the parent component to save state
    // const [filterState, setFilterState] = useState<CascaderValueType | undefined>();
    // const [searchState, setSearchState] = useState<string>("");
    // const [searchData,  setSearchData]  = useState<any>({ keyword: undefined, filter : undefined, });

    const fetchRef = useRef(refetch);
    useEffect(() => {
        fetchRef.current({
            //Admin will be viewer.isAdmin && organizationId !== "" ? organizationId , the other side is for not admin
            organizationId: viewer.isAdmin && organizationId !== "" ? organizationId : viewer.organization_id || "",
            limit: PAGE_LIMIT,
            page: page,
            input: {
                keyword : searchData.keyword,
                filter  : searchData.filter
            }
        })
    }, [page, viewer.organization_id, searchData, viewer.isAdmin, organizationId, filterState]) 

    useEffect(() => {
        fetchRef.current({
            organizationId
        })
    }, [organizationId])

    useEffect(() => {
        setPage(1)
        if (filterState) {
            const [key, val] = filterState;
            const obj = {}
            //@ts-expect-error
            obj[key] = val; // Have to do this to convert `key` to real value 
            const filter = convertEnumTrueFalse(obj)

            setSearchData((state : any) => {
                if (!state) return filter;
                else return {...state, filter}
             })
        } else {
            setSearchData({
                keyword: undefined,
                filter: undefined,
             })
        }
    }, [filterState, setSearchData])

    const onSearch = (keyword: string) => {
        setPage(1)
        // setSearchState(keyword);
        setSearchData((state : any) => {
            return {
                keyword: keyword,
                filter: state.filter
            }
        })
    }

    if (loading) {
        return <PageSkeleton />
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
            { data ?  <Layout className="members-table-layout">
                    <Header 
                        style={{
                            backgroundColor: "white",
                            border: "none",
                            height: 100,
                            display: "flex",
                            justifyContent: "space-around",
                            // flexDirection: "row-reverse",
                            // justifyItems: "center",
                            flexWrap: "wrap"
                        }}
                        >
                            <Search 
                                style={{
                                    marginTop: 30,
                                    marginRight: "auto",
                                    borderRadius: 4,
                                    flexShrink: 0,
                                    width: 300,
                                    height: 72 
                                }}
                                placeholder="Nhập để tìm kiếm..."
                                onSearch={onSearch}
                                onChange={(e) => setSearchState(e.target.value)}
                                value={searchState}
                                enterButton
                            />
                                <div style={{
                                    display: "flex",
                                    justifyContent: "space-between"
                                }}>
                                <Filter filterState={filterState} setFilterState={setFilterState} />
                                { viewer.isAdmin && <div style={{
                                            width: 150,
                                            display: "flex",
                                            alignItems: "center",
                                            paddingBottom: 10,
                                            marginLeft: 150 
                                        }}
                                    >
                                        <SelectOrganizations 
                                            selectState={organizationId}
                                            setSelectState={setOrganziationId}
                                            config={{
                                                size: "medium",
                                                className: "stats__organizations-select",
                                                specialPair : ["", "Tổng thành viên"]
                                            }}
                                        />
                                    </div>
                                }
                        </div>
                    </Header>
                    <Content
                        style={{
                            backgroundColor: "white",
                            border: "none"
                        }}
                    >
                        <Table 
                            tableLayout="fixed"
                            pagination={false}
                            rowKey={member => member.id} 
                            rowClassName={member => member.isTransferring ? "disabled-row" : "nothing"}
                            onRow={(member) => { 
                                return {
                                    onClick: () => {
                                        if (member.isTransferring) {
                                            displayErrorMessage("Hội viên này đang được chuyển sang thành viên khác, không thể thực hiện thao tác");
                                        } else {
                                            if (viewer.isAdmin) {
                                                history.push(`/user/${member.id}`)
                                            } else {
                                                history.push(`/user/${member.organization_id}/${member.id}`)
                                            }
                                        }
                                    }
                                }
                            }} 
                            columns={columns} 
                            dataSource={data.members.results} 
                        /> 
                        <div className="members__pager-container">
                            <MembersPagination
                                total={data.members.total}
                                page={page}
                                limit={PAGE_LIMIT}
                                setPage={setPage}

                            />
                        </div>

                    </Content>
                </Layout>
             : null}
        </>
    )
}
