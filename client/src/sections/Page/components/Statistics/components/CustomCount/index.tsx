import { Cascader, Divider } from "antd";
import { useEffect, useRef, useState } from "react";
import { CascaderValueType } from "antd/lib/cascader";
import { convertEnumTrueFalse, displaySentenceFromKeyVal, filterItems, getEnumValue } from "../../../../utils";
import { CustomCount as CustomCountData, CustomCountVariables } from "../../../../../../lib/graphql/queries/CustomCount/__generated__/CustomCount";
import { useLazyQuery } from "@apollo/client";
import { CUSTOM_COUNT } from "../../../../../../lib/graphql/queries";
import { displayErrorMessage } from "../../../../../../lib/utils";

interface Props {
    selectState: string;
}
export const CustomCount = ({selectState} : Props) => {

    const [customCount, setCustomCount] = useState<CascaderValueType | undefined>(undefined);
    const [countRes, setCountRes ] = useState<number>(99999);
    
    const [ refetch, { data, error}] = useLazyQuery<CustomCountData, CustomCountVariables>(CUSTOM_COUNT);

    const onChange = (value : any) =>  {
        setCustomCount(value); 
    }

    if (error) {
        displayErrorMessage("Không thể tải mục tự chọn thống kê. Hãy tải lại trang");
    }

    const ref = useRef(refetch);

    useEffect(() => {
        if (data) {
            setCountRes(data.customCount)
        } 
    }, [data])

    useEffect(() => {
        if (customCount) {
            const [key, val] = customCount;
            const obj = {}
            //@ts-expect-error
            obj[key] = val; // Have to do this to convert `key` to real value 
            const filter = convertEnumTrueFalse(obj)

            ref.current({
                variables :  {
                    organizationId: selectState,
                    input: filter
                }
            })
        }
    }, [customCount, selectState])

    return <div>
        <Cascader 
            placeholder="Chọn mục để lọc"
            size="large"
            style={{
                width: 500
            }}
            value={customCount}
            options={filterItems}
            onChange={onChange}
        />
        <Divider />
        {(() => {
            if (countRes === 99999) {
                return <h2>Hãy chọn mục để lọc</h2>
            } else {
                if (customCount && countRes) {
                    const [key, val]  = customCount;
                    // const category    = getLabelFromName(key)
                    const categoryVal = getEnumValue(key, val)
                    
                    return <>
                        <h2>{countRes}</h2>
                        <p>Hội viên {displaySentenceFromKeyVal(key, categoryVal)}</p>
                    </> 
                } else {
                    return <h2>{`Không có hội viên thuộc mục này`}</h2> 
                }
            }
        })()}
    </div>
}