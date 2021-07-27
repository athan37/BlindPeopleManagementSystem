import { Form, Select, Input, Divider } from "antd";
import { useState, useEffect } from 'react';
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


function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height
  };
}

//https://stackoverflow.com/questions/36862334/get-viewport-window-height-in-reactjs
export const useWindowDimensions = () => {
  const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowDimensions;
}


export const createFormItem = ( obj: any ) => {
    // console.log(obj)
    //Add some default properties
    obj.showSearch = obj.showSearch || false;

    if (!obj.validator) {
        obj.validator = []
    }

    return (
        <div key={obj.label}>
            <Item key={obj.label + obj.name} label={obj.label} name={obj.name} rules={
                [
                    {
                        required: obj.required === false ? false : true,
                        message: `Điền ${obj.label.toLocaleLowerCase()}`
                    },
                    ...obj.validator
                ]
            }>
                { (obj.enum === undefined) ? <Input key={obj.label + obj.name} /> : 
                    <Select
                        key={obj.name + obj.label}
                        showSearch={obj.showSearch}
                        placeholder={`Điền ${obj.label.toLocaleLowerCase()}`}
                        mode={obj.mode ? "multiple" : obj.mode}
                    >
                        {getSelectOptionsFromEnum(
                            obj.enum,
                            (k : any, v : string) => 
                            <Option key={k + v} value={k}>{v}</Option>
                        )}
                    </Select>
                }
            </Item>
            <Divider />
        </div>
    )
}


export const convertEnumTrueFalse = (values: any) => {
    //Convert TrueFalse enum to true false
    Object.keys(values).forEach( (k, _) : void => {
        let value = values[k];

        //These are the categories that have Không but not return boolean
        if ([ 
            "occupation", 
            "supportType", 
            "religion", 
            "brailleComprehension",
            "education",
            "postEducation",
            "politicalEducation",
            "governmentAgencyLevel",
            "languages"
        ].includes(k))  {
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
        <>
            <Item 
                className="select-organization"
                key="organization_id" 
                label="Chọn thành viên" 
                name="organization_id"
                rules={
                [
                    {
                        required: true,
                        message: `Chọn thành viên (Dành cho admin)`
                    }
                ]
                }
            >
                <Select
                    showSearch={true}
                    placeholder={`Điền tên thành viên`}
                >
                    { (() => {
                        const options : any[] = []
                        organizations &&
                            organizations.forEach(
                                (item : any) => {
                                    options.push(<Select.Option key={item._id + item.name} value={item._id}>{item.name}</Select.Option>)
                                }
                            )

                        return options
                        })() //Create func above and call the func here
                    }
                </Select>
        </Item>
        <Divider />
        </>
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
        validator: [
            () => ({
                validator(_ : any, value : string) {
                    if (/^\d{4}$/.test(value)) {
                        if (Number.parseInt(value) >= 1900 && Number.parseInt(value) <= new Date().getFullYear()) {
                            return Promise.resolve();
                        } else {
                            return Promise.reject(new Error('Năm sinh của bạn phải trong khoảng từ 1900 đến năm hiện tại'));
                        }
                    }

                    return Promise.reject(new Error('Hãy điền năm sinh chính xác'));

                },
            }) 
        ]
    }, 
    { 
        label : "Số điện thoại",
        name: "phone",
        required: false,
        validator: [
            () => ({
                validator(_ : any, value : string) {
                    return value.match(/^\d{8,12}$/) ?  Promise.resolve() : Promise.reject(new Error('Hãy điền số điện thoại trong khoảng 8 - 12 số '));

                },
            }) 
        ]
    },
    { 
        label : "Địa chỉ",
        name: "address",
    },
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


export const filterItems = Array.from(FormItems).map(
    (item : any) => {
        if (item.enum) {
            const currentEnum = item.enum;
            const obj = {
                label: item.label,
                value: item.name,
                children: Array.from(Object.keys(currentEnum)).map((currentEnumKey) => {
                    const currentEnumValue = currentEnum[currentEnumKey];
                    const childObj = {
                        label: currentEnumValue, //Sounds reverse because enum key cannot have space character
                        value: currentEnumKey
                    }

                    return childObj;
                })
            }

            return obj;
        } else {
            return {
                label: "None",
                value: "None"
            }
        }

    }
).filter(item => item.label !== "None")

