import { useLazyQuery } from "@apollo/client";
import { Radio, Slider, Divider } from "antd";
import { useEffect, useRef, useState } from "react";
import { NUMS_BY_AGE } from "../../../../../../lib/graphql/queries";
import { NumsByAge as NumsByAgeData, NumsByAgeVariables } from "../../../../../../lib/graphql/queries/NumsByAge/__generated__/NumsByAge";

interface Props {
    selectState: any;
}

export const AgeSlider = ( { selectState } : Props) => {
    const [ numsByAge, { data : NBAData, loading: NBALoading }] =
    useLazyQuery<NumsByAgeData, NumsByAgeVariables>(NUMS_BY_AGE);
    const [isSliding, setIsSliding] = useState<boolean>(false);
    const [gender, setGender] = useState("both");
    const [state, setState] = useState<[number, number]>([20, 50]);

    const ref = useRef(numsByAge);
    useEffect(() => {
        ref.current(
            { 
                variables: {
                    organizationId: selectState,
                    gender,
                    start: state[0],
                    end  : state[1],
                }
            }
        )
    }, [state, selectState, gender])


    const handleSizeChange = ( e: any) => {
        setGender(e.target.value);
    };

    return (
    <div className="wrap-border">
        <div >
            <div>
                <div style={{
                    display: "flex",
                    flexDirection: "row",
                    height: 60
                }}>
                    {!NBALoading && !isSliding? <h2
                        style={{
                            fontWeight: 700,
                            textTransform: "capitalize"
                        }}
                    >
                        {NBAData ? NBAData.numsByAge : ""}
                    </h2>: null}
                    <div style={{
                        marginLeft: "auto"
                    }}>
                        <Radio.Group value={gender} onChange={handleSizeChange}>
                            <Radio.Button value="Nam">Nam</Radio.Button>
                            <Radio.Button value="Nữ">Nữ</Radio.Button>
                            <Radio.Button value="both">Tổng</Radio.Button>
                        </Radio.Group>
                    </div>
                </div>
                <p
                    style={{
                        textTransform: "capitalize",
                        fontFamily: `"Poppins",system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto Sans",sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji"`
                    }}
                >
                    {`Hội viên ${gender !== "both" ? gender === 'Nam' ? "Nam" : "Nữ" : ""} trong khoảng ${state[0]} - ${state[1]} tuổi`}
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
    </div>
    )
}