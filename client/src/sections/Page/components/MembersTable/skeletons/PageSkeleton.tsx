import { Layout, Skeleton } from "antd"

const { Header, Content } = Layout;

export const PageSkeleton = () => {

    return <Layout className="members-table-layout">
                    <Header 
                        style={{
                            backgroundColor: "white",
                            border: "none",
                            height: 80,
                            display: "flex",
                            alignItems: "center",
                        }}
                        >
                        <div
                            style={{
                                marginLeft: -20,
                                borderRadius: 4,
                                width: 200
                            }}
                        >
                            {/* <Skeleton 
                                title={false}
                                paragraph={{
                                    rows : 1,
                                }}
                            />  */}
                        </div>
                    </Header>
                    <Content
                        style={{
                            backgroundColor: "white",
                            border: "none",
                            padding: 20
                        }}
                    >
                        <Skeleton 
                            className="members-skeleton"
                            title={false}
                            paragraph={{
                                rows : 5 + 1, //1 is the table header
                            }}
                        /> 
                    </Content>
                </Layout>
}