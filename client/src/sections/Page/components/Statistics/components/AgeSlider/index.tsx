import { useLazyQuery } from "@apollo/client";
import { Slider, Divider, Statistic } from "antd";
import { useEffect, useState } from "react";
import { Viewer } from "../../../../../../lib";
import { NUMS_BY_AGE } from "../../../../../../lib/graphql/queries";
import { NumsByAge as NumsByAgeData, NumsByAgeVariables } from "../../../../../../lib/graphql/queries/NumsByAge/__generated__/NumsByAge";

interface Props {
    viewer: Viewer;
}

export const AgeSlider = ( { viewer } : Props) => {
    const [ numsByAge, { data : NBAData, loading: NBALoading }] =
    useLazyQuery<NumsByAgeData, NumsByAgeVariables>(NUMS_BY_AGE);
    const [state, setState] = useState<[number, number]>([20, 50]);

    useEffect(() => {
        numsByAge(
            { 
                variables: {
                    organizationId: viewer.organization_id,
                    start: state[0],
                    end  : state[1],
                }
            }
        )
    }, [state, numsByAge, viewer.organization_id])

    return (
        <>
        <Slider 
            range
            defaultValue={state} 
            onChange={(value) => setState(value)}
            disabled={NBALoading} />
        <Divider style={{border: "none"}} />
        <Statistic
            title={`Tổng hội viên trong khoảng ${state[0]} - ${state[1]} tuổi`}
            value={NBAData ? NBAData.numsByAge : "Loading" }
        />
        </>
    )
}