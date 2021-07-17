import { Form, Select, Input } from "antd";
import { Ethnicity, EyeCondition, Gender, Language, Occupation, Religion, TrueFalse } from "../../../lib/enum";
import { BrailleComprehension, Education, IncomeType, PoliticalEducation, PostEducation, SupportType } from "../../../lib/graphql/globalTypes";
import { Viewer } from "../../../lib";
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
                >
                    {getSelectOptionsFromEnum(
                        obj.enum,
                        (k : any, v : string) => 
                        <Option key={k} value={v}>{k}</Option>
                    )}
                </Select>
            }
        </Item>
    )
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
    { 
        label : "Ảnh",
        name: "image",
    },
    { 
        label : "Giới tính",
        name: "gender",
        enum: Gender,
    },
    { 
        label : "Dân tộc",
        name: "ethnicity",
        enum: Ethnicity,
        showSearch: true
    },
    { 
        label : "Tôn giáo",
        name: "religion",
        enum: Religion,
        showSearch: true
    },
    { 
        label : "Nghề nghiệp",
        name: "occupation",
        enum: Occupation,
        showSearch: true
    },
    { 
        label : "Là Đảng Viên",
        name: "isCommunistPartisan",
        enum: TrueFalse
    },
    { 
        label : "Tình trạng hôn nhân",
        name: "marriage",
        enum: TrueFalse
    },
    { 
        label : "Tình trạng thị lực",
        name: "eyeCondition",
        enum: EyeCondition,
    },
    { 
        label : "Trình độ học vấn",
        name: "education",
        enum: Education,
    },
    { 
        label : "Trình độ chuyên môn",
        name: "postEducation",
        enum: PostEducation,
    },
    { 
        label : "Trình độ chính trị",
        name: "politicalEducation",
        enum: PoliticalEducation
    },
    { 
        label : "Trình độ chữ nổi",
        name: "brailleComprehension",
        enum: BrailleComprehension
    },
    { 
        label : "Trình độ ngoại ngữ",
        name: "languages",
        enum: Language, 
        showSearch: true
    },
    { 
        label : "Sử dụng tin học",
        name: "familiarWIT",
        enum: TrueFalse
    },
    { 
        label : "Giấy chứng nhận khuyết tật",
        name: "disabilityCert",
        enum: TrueFalse
    },
    { 
        label : "Thẻ bảo hiểm y tế",
        name: "healthInsuranceCard",
        enum: TrueFalse
    },
    { 
        label : "Thẻ xe bus",
        name: "busCard",
        enum: TrueFalse
    },
    { 
        label : "Chế độ đang hưởng",
        name: "supportType",
        enum: SupportType,
        showSearch: true
    },
    { 
        label : "Đời sống gia đình",
        name: "incomeType",
        enum: IncomeType
    },
] 


