import { useLazyQuery, useQuery } from "@apollo/client";
import { GetOrganizationsStats as StatsData, GetOrganizationsStatsVariables as StatsVariables } from "../../../../lib/graphql/queries/Stats/__generated__/GetOrganizationsStats";
import { Organization as OrganizationData, OrganizationVariables } from "../../../../lib/graphql/queries/Organization/__generated__/Organization";
import { Statistic, Divider, Descriptions  } from "antd"
import { TeamOutlined, BookOutlined, HomeOutlined } from "@ant-design/icons";
import { PieChart } from "bizcharts";
import { QUERY_ORGANIZATION, QUERY_STATS } from "../../../../lib/graphql/queries";
import { displayErrorMessage } from "../../../../lib/utils";
import { AgeSlider, JobsBarChart } from "./components";
import { Viewer } from "../../../../lib";
import { useEffect } from "react";
import { GetOrganizationsStats as StatsType , GetOrganizationsStats_getOrganizationsStats_jobs as GraphData } from "../../../../lib/graphql/queries/Stats/__generated__/GetOrganizationsStats"
import * as Enum from "../../../../lib/enum"
import { PageSkeleton } from "./skeletons";

interface Props {
    viewer: Viewer;
}

export const Statistics = ({ viewer } : Props) => {


    const { data, loading } = useQuery<StatsData, StatsVariables>(
        QUERY_STATS, {
            fetchPolicy: "cache-and-network",
            variables: {
                organizationId: viewer.organization_id
            },
            onError: (err) => {
                displayErrorMessage(`Cannot fetch stats data: ${err}`)
            }
        }
    )

    const [getOrganization, { data: orgData }] = 
    useLazyQuery<OrganizationData, OrganizationVariables>(
        QUERY_ORGANIZATION, 
    );

    useEffect(() => {
        if (!viewer.isAdmin && viewer.organization_id) {
            getOrganization({
                variables: {
                    organizationId: viewer.organization_id
                }
            })
        }
    }, [viewer, getOrganization])

    
    if (loading) {
        return <PageSkeleton />
    }

    if (data && data.getOrganizationsStats) {
        const { total, totalMale, totalFemale, jobs, brailleData, avgAge,
            totalBusCard, totalFWIT, totalDisabilityCert,
            totalMoreThan2Languages, medianEducation, medianIncome,
            medianReligion, maxOrganization
        }  : StatsType["getOrganizationsStats"] = data.getOrganizationsStats;
        const pieChartData = brailleData.map(
            (data : GraphData) => {
                return {
                    type: data._id,
                    value : data.value
                }
            }
        )

        return (
            <div className="summary-container">

                <div className="summary-child">
                    {(() => {
                        const mainStats = [
                            {
                                title: "Tổng thành viên",
                                value: total,
                                color: "indigo",
                            },
                            {
                                title: "Tuổi trung bình",
                                value: avgAge,
                                color: "green",
                            },
                            {
                                title: "Hội viên nam",
                                value: totalMale,
                                color: "blue",
                            },
                            {
                                title: "Hội viên nữ",
                                value: totalFemale,
                                color: "red",
                            }
                        ] 

                        return <>
                            {mainStats.map(stat => {
                                return <div className="stats-main__container" 
                                    key={stat.title + stat.value}
                                    style={{
                                        display: "flex",
                                        flexDirection: "row",
                                        alignItems: "center",
                                        border: "none",
                                        WebkitBoxShadow: "0 0.5rem 1rem rgb(0 0 0 / 15%)",
                                        boxShadow: "0 0.5rem 1rem rgb(0 0 0 / 15%)",
                                        borderRadius: "50rem",
                                        maxHeight: "90px",
                                        fontFamily: `"Poppins",system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto Sans",sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji"`

                                    }}
                                >
                                    <div
                                        className="dot"
                                        style={{
                                            backgroundColor: stat.color
                                        }}
                                    />
                                    <div className="stats-main__texts">
                                        <h3>{ stat.title}</h3>
                                        <h4>{ stat.value }</h4>
                                    </div>
                                </div>

                            })}
                        </>
                    })()}
                </div>
                <Divider />
                <div className="summary-child">
                    <Descriptions 
                        title = "Thống kê hội người mù"
                        className="big"
                        size={"middle"}
                        style={{
                            border: "none",
                            fontFamily: `"Poppins",system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto Sans",sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji"`
                        }}
                    >
                        <Descriptions.Item label="Hội viên">
                            {`Hội người mù 
                                ${orgData && orgData.organization 
                                    ? orgData.organization.name : "TP Hà nội" }`
                            } </Descriptions.Item> 
                        {
                            orgData && orgData.organization && orgData.organization.address ? 
                            <Descriptions.Item label="Địa chỉ"> 
                                {orgData.organization.address}
                            </Descriptions.Item> : null
                        }
                    </Descriptions>
                </div>
                <Divider />
                <div className="sub-container-flex-row" >
                    <div className="age-slider-piechart-panel">
                        <div className="wrap-border">
                            <AgeSlider viewer={viewer}/>
                        </div>
                        <div className="wrap-border">
                            <PieChart
                                data={pieChartData}
                                title={{
                                    visible: true,
                                    text: 'Trình độ chữ nổi của hội viên',
                                }}
                                description={{
                                    visible: true,
                                    text: 'Theo số hội viên',
                                }}
                                radius={0.8}
                                angleField='value'
                                colorField='type'
                                label={{
                                    visible: true,
                                    type: 'outer',
                                    offset: 20,
                                }}
                                />
                        </div>
                    </div>
                    <div className="barchart-stats-panel">
                        <div 
                        style= {{height: "72%"}}
                        className="wrap-border">
                            <JobsBarChart data={jobs} />
                        </div>
                        <div style={{
                             display: "flex", justifyContent: "space-around"
                        }} >
    
    
                                <Statistic
                                    className="wrap-border big"
                                    title="Số hội viên có thẻ xe buýt" //From all or from organization
                                    value={totalBusCard}
                                />
                                <Statistic 
                                    className="wrap-border big"
                                    title="Số hội viên biết sử dụng tin học" //From all or from organization
                                    value={totalFWIT}
                                />
    
                                <Statistic
                                    className="wrap-border big"
                                    title="Số người có giấy chứng nhận khuyết tật" //From all or from organization
                                    value={totalDisabilityCert}
                                />
                        </div>
                    </div>
                </div>
                <Divider />
                <div className="summary-child">
                    <Statistic
                        className="big"
                        title="Trình độ học vấn chung" //From all or from organization
                        //@ts-expect-error _id is a string
                        value={Enum.Education[medianEducation._id]}
                    />
                    <Statistic
                        title="Số người biết nhiều hơn 2 ngoại ngữ" //From all or from organization
                        value={totalMoreThan2Languages}
                    />
                </div>
                <Divider />
                <div className="summary-child">
                    <div 
                        className="stats-card__2nd_type"
                        style={{
                            backgroundColor: "#d7f0dd",
                            color: "#35b653"
                        }}
                    >
                        <div>
                            <div>
                                <h3
                                    style={{
                                        color: "#35b653"
                                    }}
                                >
                                    {
                                        //@ts-expect-error _id is a string
                                        Enum.Religion[medianReligion._id]
                                    }
                                </h3>
                                <h5>
                                    {"Tôn giáo chủ yếu"}
                                </h5>
                            </div>
                            <BookOutlined 
                                style={{
                                    fontSize: "150%"
                                }}
                            />
                        </div>
                    </div>
                    { viewer.isAdmin && 
                        <div 
                            className="stats-card__2nd_type"
                            style={{
                                backgroundColor: "#dadcf8",
                                color: "#4650dd"
                            }}
                        >
                            <div>
                                <div>
                                    <h3
                                        style={{
                                            color: "#4650dd"
                                        }}
                                    >
                                        {maxOrganization?._id}
                                    </h3>
                                    <h5>
                                        {"Chi nhánh thành viên đông nhất"}
                                    </h5>
                                </div>
                                <TeamOutlined 
                                    style={{
                                        fontSize: "150%"
                                    }}
                                />
                            </div>
                        </div>
                    }
                    <div 
                        className="stats-card__2nd_type"
                        style={{
                            backgroundColor: "#cfe2ff",
                            color: "#0d6efd"
                        }}
                    >
                        <div>
                            <div>
                                <h3
                                    style={{
                                        color:"#0d6efd"
                                    }}
                                >
                                    { //@ts-expect-error _id is a string
                                    Enum.IncomeType[medianIncome._id]}
                                </h3>
                                <h5>

                                    {"Đời sống gia đình chủ yếu"}
                                </h5>
                            </div>
                            <HomeOutlined 
                                style={{
                                    fontSize: "150%"
                                }}
                            />
                        </div>
                    </div>
                </div>

                {/* May be click here again to change title and value to smallest */}
    
            </div>
        )
    } 

    return <h1>Cannot fetch data</h1>

}