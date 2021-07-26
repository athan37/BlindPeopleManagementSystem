import { useLazyQuery } from "@apollo/client";
import { Slider, Divider } from "antd";
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
    const [isSliding, setIsSliding] = useState<boolean>(false);

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
        <div >
            <div>
                {!NBALoading && !isSliding? <h2
                    style={{
                        fontWeight: 700,
                        textTransform: "capitalize"
                    }}
                >
                    {NBAData ? NBAData.numsByAge : ""}
                </h2>: null}
                <p
                    style={{
                        textTransform: "capitalize",
                        fontFamily: `"Poppins",system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto Sans",sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji"`
                    }}
                >
                    {`Hội viên trong khoảng ${state[0]} - ${state[1]} tuổi`}
                </p> 
            </div>
            <Slider 
                range
                defaultValue={state} 
                onChange={(value) => {
                        setState(value)
                        setIsSliding(true)
                    }
                }
                onAfterChange={() => {
                    setIsSliding(false)
                }}
                disabled={NBALoading} />
            <Divider style={{border: "none"}} />
        </div>
    )
}