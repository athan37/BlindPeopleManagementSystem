import { PageHeader, Card, Skeleton } from "antd"
import { useHistory } from "react-router";

export const FormSkeleton = () => {
    const history = useHistory();
    return <section className="profile-section" >
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
                    padding: "10px 40px"
                }}
                title="Xem và chỉnh sửa thông tin hội viên"
            >
                    {/* Main form items are here */}

                    <Skeleton paragraph={{
                        rows: 1
                    }} />

                    {(() => {
                        const mainStats = [ 
                            { }, { }, { }, { },
                            { }, { }, { }, { },
                            { }, { }, { }, { },
                            { }, { }, { }, { },
                            { }, { }, { }, { },
                            { }, { }, { }, { },
                        ] 
                        return <>
                            {mainStats.map((_, index) => {
                                return <div key={index} className="skeleton__ant-form-item">
                                            <Skeleton 
                                                key={index} 
                                                paragraph={
                                                    { rows: 1 }
                                                }
                                            />
                                        </div>
                            })}
                        </>
                    })()}
                    {/* { SelectOrganizationsIfAdmin(organizations, viewer )}
                    { FormItems.map((item) => createFormItem(item)) } */}
                    
                </Card>
            </section>
}