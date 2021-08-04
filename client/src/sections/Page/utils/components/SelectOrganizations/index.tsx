import { useQuery } from "@apollo/client"
import { QUERY_ORGANIZATIONS } from "../../../../../lib/graphql/queries";
import { Organizations as OrganizationsData } from "../../../../../lib/graphql/queries/Organizations/__generated__/Organizations";
import { Select } from "antd";
import { useState } from "react";

interface Props {
    setSelectState : any;
    selectState : any;
    config ?: any;
}
export const SelectOrganizations = ({ selectState, setSelectState, config } : Props) => {
    const [organizations, setOrganizations] = useState<any>([])
    useQuery<OrganizationsData>(QUERY_ORGANIZATIONS, {
        onCompleted: data => setOrganizations(data.organizations.results)
    })

    return <Select
                className={config.className}
                size={config.size ? config.size : "large"}
                value={selectState}
                showSearch={true}
                placeholder={`Chọn thành viên đã có`}
                onChange={ value => setSelectState(value)}
            >
                { (() => {
                    const options : any[] = []
                    organizations &&
                        organizations.forEach(
                            (item : any) => {
                                if(config.excludeId) {
                                    if (item._id !== config.excludeId) {
                                        options.push(<Select.Option key={item._id} value={item._id}>{item.name}</Select.Option>)
                                    }
                                } else {
                                    options.push(<Select.Option key={item._id} value={item._id}>{item.name}</Select.Option>)
                                }
                            }
                        )

                    if (config.specialPair)  {
                        const [key, val] = config.specialPair;
                        options.push(<Select.Option key={key} value={key}>{val}</Select.Option>)
                    }
                    return options
                    })() //Create func above and call the func here
                }
            </Select>

}