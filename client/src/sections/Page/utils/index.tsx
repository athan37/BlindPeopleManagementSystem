import { Form, Select, Input } from "antd";
import * as Enum from "../../../lib/enum";
import { Viewer } from "../../../lib";

//Notes: the enums used here are not generated from global types via graphql because the value is different than the enum's element's name
const { Option } = Select;
const { Item } = Form;


export const getSelectOptionsFromEnum = (Enum : any, fn : any) =>  {
    const newFields : any[] = [] 
    Object.keys(Enum).forEach((k, _) => {
        newFields.push(fn(k, Enum[k]));
    })
    return newFields;
}


export const createFormItem = ( obj: any ) => {
    // console.log(obj)
    //Add some default properties
    obj.showSearch = obj.showSearch || false;
    obj.width = 300


    return (
        <Item key={obj.name} label={obj.label} name={obj.name} rules={
            [
                {
                    required: true,
                    message: `Điền ${obj.label.toLocaleLowerCase()}`
                }
            ]
        }>
            { (obj.enum === undefined) ? <Input /> : 
                <Select
                    showSearch={obj.showSearch}
                    style={{ width: obj.width}}
                    placeholder={`Điền ${obj.label.toLocaleLowerCase()}`}
                    mode={obj.mode ? "multiple" : obj.mode}
                >
                    {getSelectOptionsFromEnum(
                        obj.enum,
                        (k : any, v : string) => 
                        <Option key={k} value={k}>{v}</Option>
                    )}
                </Select>
            }
        </Item>
    )
}

export const convertEnumTrueFalse = (values: any) => {
    //Convert TrueFalse enum to true false
    Object.keys(values).forEach( (k, _) : void => {
        let value = values[k];

        //These are the category that have Không but not return boolean
        if (["occupation", "supportType", "religion", "brailleComprehension"].includes(k))  {

        } else {
            if (value === "Có") {
                value = true
            } else if (value === "Không") {
                value = false
            } 
        }


        if (k === "birthYear") 
        value = parseInt(value) 
        values[k] = value;
    })

    return values;
}

export const SelectOrganizationsIfAdmin = (organizations : any, viewer : Viewer) => {
        return viewer.isAdmin && 
            <Item 
                key="organization_id" 
                label="Chọn hội thành viên" 
                name="organization_id"
                rules={
                [
                    {
                        required: true,
                        message: `Chọn hội thành viên (Dành cho admin)`
                    }
                ]
                }
            >
                <Select
                    showSearch={true}
                    style={{ width: 300}}
                    placeholder={`Điền tên thành viên`}
                >
                    { (() => {
                        const options : any[] = []
                        organizations &&
                            organizations.forEach(
                                (item : any) => {
                                    options.push(<Select.Option key={item._id} value={item._id}>{item.name}</Select.Option>)
                                }
                            )

                        return options
                        })() //Create func above and call the func here
                    }
                </Select>
        </Item>
}

export const FormItems = [
    { 
        label : "Tên đệm và tên",
        name: "firstName",
    }, 
    { 
        label : "Họ",
        name: "lastName",
    }, 
    { 
        label : "Năm sinh",
        name: "birthYear",
    }, 
    { 
        label : "Địa chỉ",
        name: "address",
    },
    // { 
    //     label : "Ảnh",
    //     name: "image",
    // },
    { 
        label : "Giới tính",
        name: "gender",
        enum: Enum.Gender,
    },
    { 
        label : "Dân tộc",
        name: "ethnicity",
        enum: Enum.Ethnicity,
        showSearch: true
    },
    { 
        label : "Tôn giáo",
        name: "religion",
        enum: Enum.Religion,
        showSearch: true
    },
    { 
        label : "Nghề nghiệp",
        name: "occupation",
        enum: Enum.Occupation,
        showSearch: true
    },
    { 
        label : "Là Đảng Viên",
        name: "isCommunistPartisan",
        enum: Enum.TrueFalse
    },
    { 
        label : "Tình trạng hôn nhân",
        name: "marriage",
        enum: Enum.MarriageStatus
    },
    { 
        label : "Tình trạng thị lực",
        name: "eyeCondition",
        enum: Enum.EyeCondition,
    },
    { 
        label : "Trình độ học vấn",
        name: "education",
        enum: Enum.Education,
    },
    { 
        label : "Trình độ chuyên môn",
        name: "postEducation",
        enum: Enum.PostEducation,
    },
    { 
        label : "Trình độ chính trị",
        name: "politicalEducation",
        enum: Enum.PoliticalEducation
    },
    { 
        label : "Trình độ quản lý nhà nước",
        name: "governmentAgencyLevel",
        enum: Enum.GovernmentAgencyLevel
    },
    { 
        label : "Trình độ chữ nổi",
        name: "brailleComprehension",
        enum: Enum.BrailleComprehension
    },
    { 
        label : "Trình độ ngoại ngữ",
        name: "languages",
        enum: Enum.Language, 
        showSearch: true,
        mode: "tag"
    },
    { 
        label : "Sử dụng tin học",
        name: "familiarWIT",
        enum: Enum.TrueFalse
    },
    { 
        label : "Giấy chứng nhận khuyết tật",
        name: "disabilityCert",
        enum: Enum.TrueFalse
    },
    { 
        label : "Thẻ bảo hiểm y tế",
        name: "healthInsuranceCard",
        enum: Enum.TrueFalse
    },
    { 
        label : "Thẻ xe bus",
        name: "busCard",
        enum: Enum.TrueFalse
    },
    { 
        label : "Chế độ đang hưởng",
        name: "supportType",
        enum: Enum.SupportType,
        showSearch: true
    },
    { 
        label : "Đời sống gia đình",
        name: "incomeType",
        enum: Enum.IncomeType
    },
] 


