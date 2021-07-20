import { useLazyQuery, useQuery } from "@apollo/client";
import { GetOrganizationsStats, GetOrganizationsStats as StatsData, GetOrganizationsStatsVariables as StatsVariables } from "../../../../lib/graphql/queries/Stats/__generated__/GetOrganizationsStats";
import { Organization as OrganizationData, OrganizationVariables } from "../../../../lib/graphql/queries/Organization/__generated__/Organization";
import { Statistic, Divider, Descriptions } from "antd"
import { PieChart } from "bizcharts";
import { QUERY_ORGANIZATION, QUERY_STATS } from "../../../../lib/graphql/queries";
import { displayErrorMessage } from "../../../../lib/utils";
import { AgeSlider, JobsBarChart } from "./components";
import { Viewer } from "../../../../lib";
import { useEffect } from "react";
import { GetOrganizationsStats as StatsType , GetOrganizationsStats_getOrganizationsStats_jobs as GraphData } from "../../../../lib/graphql/queries/Stats/__generated__/GetOrganizationsStats"
import * as Enum from "../../../../lib/enum"

interface Props {
    viewer: Viewer;
}

export const Statistics = ({ viewer } : Props) => {


    const { data, loading, error } = useQuery<StatsData, StatsVariables>(
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

    const [getOrganization, { data: orgData, loading: orgLoading, error: orgError }] = 
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
        return <h1>Loading</h1>
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
                    <Descriptions 
                        title = "Thống kê hội người mù"
                        className="big"
                        size={"middle"}
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
                <div className="summary-child">
                    <Statistic
                        className="big"
                        title="Tổng thành viên hội người mù"
                        value={total}
                    />
                    <Statistic
                        className="big"
                        title="Số tuổi trung bình của hội viên"
                        value={avgAge}
                    />
                    <Statistic
                        title="Tổng hội viên nam"
                        value={totalMale}
                    />
                    <Statistic
                        title="Tổng hội viên nữ"
                        value={totalFemale}
                    />
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
                        title="Tôn giáo chủ yếu" //From all or from organization
                        //@ts-expect-error _id is a string
                        value={Enum.Religion[medianReligion._id]}
                    />
                    { viewer.isAdmin && 
                        <Statistic
                            className="big" style={{ flex: "1 1 400px"}}
                            title="Chi nhánh thành viên đông nhất"
                            value={maxOrganization?._id}
                        />
                    }
                    <Statistic
                        className="big"
                        title="Đời sống gia đình chủ yếu" //From all or from organization
                        //@ts-expect-error _id is a string
                        value={Enum.IncomeType[medianIncome._id]}
                    />
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
                {/* May be click here again to change title and value to smallest */}
    
            </div>
        )
    } 

    return <h1>Cannot fetch data</h1>

}