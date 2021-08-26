import { useLazyQuery, useQuery, NetworkStatus } from "@apollo/client";
import { GetOrganizationsStats as StatsData, GetOrganizationsStatsVariables as StatsVariables } from "../../../../lib/graphql/queries/Stats/__generated__/GetOrganizationsStats";
import { Organization as OrganizationData, OrganizationVariables } from "../../../../lib/graphql/queries/Organization/__generated__/Organization";
import { Statistic, Divider, Descriptions  } from "antd"
import { TeamOutlined, BookOutlined, HomeOutlined } from "@ant-design/icons";
import { QUERY_ORGANIZATION, QUERY_STATS } from "../../../../lib/graphql/queries";
import { displayErrorMessage } from "../../../../lib/utils";
import { AgeSlider, BraillePieChart, CustomCount, JobsBarChart } from "./components";
import { Viewer } from "../../../../lib";
import { useEffect, useState } from "react";
import { GetOrganizationsStats as StatsType , GetOrganizationsStats_getOrganizationsStats_jobs as GraphData } from "../../../../lib/graphql/queries/Stats/__generated__/GetOrganizationsStats"
import * as Enum from "../../../../lib/enum"
import { PageSkeleton } from "./skeletons";
import { SelectOrganizations } from "../../utils";

interface Props {
    viewer: Viewer;
}

export const Statistics = ({ viewer } : Props) => {
    const [selectState, setSelectState] = useState<string>(viewer.organization_id || "");
    const { data, loading, refetch, networkStatus } = useQuery<StatsData, StatsVariables>(
        QUERY_STATS, {
            fetchPolicy: "cache-and-network",
            variables: {
                organizationId: viewer.organization_id
            },
            notifyOnNetworkStatusChange: true,
            onError: (err) => {
                displayErrorMessage(`Cannot fetch stats data: ${err}`)
            }
        }
    )

    useEffect(() => {
        if (viewer.isAdmin) refetch( { organizationId: selectState })
    }, [selectState, refetch, viewer.isAdmin])


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

    if (loading || networkStatus === NetworkStatus.refetch) {
        return <PageSkeleton />
    }

    if (data && data.getOrganizationsStats) {
        const { 
            total, totalMale, totalFemale, jobs, brailleData,
            avgAge, totalBusCard, totalFWIT, totalDisabilityCert,
            totalMoreThan2Languages, medianEducation, medianIncome,
            medianReligion, maxOrganization, totalICP, totalHS, totalBMC,
            educations, postEducations, politicalEducations, governLevels, languages, socialWorkLevels
        }  : StatsType["getOrganizationsStats"] = data.getOrganizationsStats;

        return (
            <div className="summary-container">
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
                {viewer.isAdmin && <>
                    <Divider />
                    <div className="stats_organization-select-container">
                        <h1>Chọn thành viên</h1>
                        <SelectOrganizations 
                            selectState={selectState}
                            setSelectState={setSelectState}
                            config={{
                                className: "stats__organizations-select",
                                specialPair : ["", "Tổng thành viên"]
                            }}
                        />
                    </div>
                    <Divider />
                </>
                }
                <Divider />
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
                                        <h4>{ stat.title}</h4>
                                        <h5>{ stat.value }</h5>
                                    </div>
                                </div>

                            })}
                        </>
                    })()}
                </div>
                <Divider />
                <div className="sub-container-flex-row" >
                    <div className="age-slider-piechart-panel">
                        <AgeSlider       selectState={selectState}/>
                        <BraillePieChart brailleData={brailleData} />
                    </div>
                    <div className="barchart-stats-panel">
                        <JobsBarChart data={jobs} />
                        {/* Begin of 3 stats panel */}
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
                                title="Số người là đảng viên" //From all or from organization
                                value={totalICP}
                            />
                        </div>
                    </div>
                </div>
                <Divider />
                <div className="summary-child">
                    <CustomCount selectState={selectState}/>
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
                        className="wrap-border"
                        title="Số người có giấy chứng nhận khuyết tật" //From all or from organization
                        value={totalDisabilityCert}
                    />
                    <Statistic
                        title="Số người có thẻ bảo hiểm y tế" //From all or from organization
                        value={totalHS}
                    />
                    <Statistic
                        title="Số người có chứng chỉ quản lý công tác hội" //From all or from organization
                        value={totalBMC}
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
                                        {"Đơn vị có số hội viên đông nhất"}
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