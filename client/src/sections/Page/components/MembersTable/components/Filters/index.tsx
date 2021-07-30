import { Cascader, Button } from "antd";
import { FilterOutlined } from "@ant-design/icons";
import { filterItems } from "../../../../utils";
import { CascaderValueType } from "antd/lib/cascader";

interface Props {
    filterState : CascaderValueType | undefined;
    setFilterState : (value : any) => void;
};

export const Filter = ({ filterState, setFilterState} : Props)  => {

    const onChange = (value : any) =>  {
        setFilterState(value); 
    }
      return (

        <div
            style={{
                marginTop: 15,
                flexShrink: 0,
            }}
        >
            <Button 
                disabled
                style={{ 
                        backgroundColor: "white",
                        borderColor: "white",
                    }} 
                icon={<FilterOutlined  
                    style={{
                        color: "#4650dd",
                        fontSize: "150%",
                    }}
                />}
            />
            <Cascader
                placeholder="Chọn mục để lọc"
                value={filterState}
                options={filterItems}
                onChange={onChange}
            />
        </div>
      )
}
