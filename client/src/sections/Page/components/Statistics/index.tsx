import { useLazyQuery, useQuery, NetworkStatus } from "@apollo/client";
import { GetOrganizationsStats as StatsData, GetOrganizationsStatsVariables as StatsVariables } from "../../../../lib/graphql/queries/Stats/__generated__/GetOrganizationsStats";
import { Organization as OrganizationData, OrganizationVariables } from "../../../../lib/graphql/queries/Organization/__generated__/Organization";
import { Statistic, Divider, Descriptions  } from "antd"
import { BookOutlined, HomeOutlined } from "@ant-design/icons";
import { QUERY_ORGANIZATION, QUERY_STATS } from "../../../../lib/graphql/queries";
import { displayErrorMessage } from "../../../../lib/utils";
import { AgeSlider, BraillePieChart, CustomCount, CustomRadarChart, EducationsChart, JobsBarChart, MaxOrgCard } from "./components";
import { Viewer } from "../../../../lib";
import { useEffect, useState } from "react";
import { GetOrganizationsStats as StatsType } from "../../../../lib/graphql/queries/Stats/__generated__/GetOrganizationsStats"
import * as Enum from "../../../../lib/enum"
import { PageSkeleton } from "./skeletons";
import { SelectOrganizations } from "../../utils";
import { Language, BrailleComprehension, PostEducation, GovernmentAgencyLevel } from "../../../../lib/enum";

interface Props {
    viewer: Viewer;
}

// const jobsConfig = {
//     Enum: Language,
//     titleText: 'Nghề nghiêp',
//     xAlias: "Số hội viên",
//     yAlias: 'Nghề nghiêp',
//     intervalLabel: "population"
// }

const brailleConfig = {
    titleText: 'Trình độ chữ nổi của hội viên',
    titleDescription: 'Theo số hội viên',
    Enum:  BrailleComprehension
}

const languagesConfig = {
    titleText: 'Trình độ ngoại ngữ của hội viên',
    titleDescription: 'Theo số hội viên',
    Enum: Language
}

const socialWorksConfig = {
    Enum: PostEducation,
    title: "Chứng chỉ nghề công tác & chuyên môn"
}

const governConfig = {
    Enum: GovernmentAgencyLevel,
    title: "Trình độ chính trị & trình độ quản lý nhà nước"
}

export const Statistics = ({ viewer } : Props) => {
    const [selectState, setSelectState] = useState<string>(viewer.organization_id || "");
    const [maxOrgState, setMaxOrgState] = useState<boolean>(true);
    const { data, loading, refetch, networkStatus } = useQuery<StatsData, StatsVariables>(
        QUERY_STATS, {
            fetchPolicy: "no-cache",
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
        console.log("Original", data.getOrganizationsStats)
        const { 
            total, totalMale, totalFemale, jobs, brailleData,
            avgAge, totalBusCard, totalFWIT, totalDisabilityCert,
            totalMoreThan2Languages, medianEducation, medianIncome,
            medianReligion, minOrganization,maxOrganization, totalICP, totalHS, totalBMC,
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
                        <AgeSlider       selectState={selectState} />
                        <BraillePieChart 
                            config={brailleConfig}
                            brailleData={brailleData} 
                        /> 
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
                <div className="sub-container-flex-row">
                    <div className="barchart-stats-panel limit-width-63">
                        <BraillePieChart config={languagesConfig} brailleData={languages} />
                    </div>
                    <div>
                        <Statistic
                            className="wrap-border more-height"
                            title="Trình độ học vấn chung" //From all or from organization
                            //@ts-expect-error _id is a string
                            value={Enum.Education[medianEducation._id]}
                        />
                        <Statistic
                            className="wrap-border more-height"
                            title="Số người có giấy chứng nhận khuyết tật" //From all or from organization
                            value={totalDisabilityCert}
                        />
                        <Statistic
                            className="wrap-border more-height"
                            title="Số người có thẻ bảo hiểm y tế" //From all or from organization
                            value={totalHS}
                        />
                    </div>
                    {/* <BraillePieChart brailleData={educations} /> */}
                </div>
                <Divider/>
                <div className="sub-container-flex-row">
                    <div className="barchart-stats-panel limit-width-46">
                        <CustomRadarChart 
                            listOfData={{
                                "Chứng chỉ nghề công tác xã hội": socialWorkLevels,
                                "Trình độ chuyên môn": postEducations,
                            }}
                            config={socialWorksConfig}
                        />
                    </div>
                    <div className="barchart-stats-panel limit-width-53">
                        <CustomRadarChart 
                            listOfData={{
                                "Trình độ chính trị": politicalEducations,
                                "Trình độ quản lý nhà nước": governLevels,
                            }}
                            config={governConfig}
                        />
                    </div>
                    {/* <BraillePieChart brailleData={educations} /> */}
                </div>
                <Divider/>
                <div className="sub-container-flex-row">
                    <div className="limit-width-39">
                        <Statistic
                            className="wrap-border"
                            title="Số người có chứng chỉ quản lý công tác hội" //From all or from organization
                            value={totalBMC}
                        />
                        <Statistic
                            className="wrap-border"
                            title="Số người biết nhiều hơn 2 ngoại ngữ" //From all or from organization
                            value={totalMoreThan2Languages}
                        />
                        <div className="summary-child">
                            <CustomCount selectState={selectState}/>
                        </div>
                    </div>
                    <div className="barchart-stats-panel limit-width-60">
                        <EducationsChart config={{}} data={educations}/>
                    </div>
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
                    <MaxOrgCard 
                        viewer={viewer}
                        maxOrgState={maxOrgState}
                        max={maxOrganization?._id}
                        min={minOrganization?._id}
                        setMaxOrgState={setMaxOrgState}
                    />
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