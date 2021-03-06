import { Form, Select, Input, Divider } from "antd";
import { useState, useEffect } from 'react';
import * as Enum from "../../../lib/enum";
export * from "./components";


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

//https://stackoverflow.com/questions/32553158/detect-click-outside-react-component
export const useOutsideAlerter = (ref : any, func : any) => {
    useEffect(() => {
        /**
         * Alert if clicked on outside of element
         */
        function handleClickOutside(event : any) {
            if (ref.current && !ref.current.contains(event.target)) {
                func()
            }
        }

        // Bind the event listener
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            // Unbind the event listener on clean up
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [ref, func]);
}

export const useOverlapAlerter = (outRef : any, inRef : any, handleClickOutside : any, handleClickInside:any) => {
    //Refs only apply for div tag having class name
    useEffect(() => {
        /**
         * Alert if clicked on outside of element
         */
        function handleOverlapClick(event : any) {
            if (outRef.current && outRef.current.contains(event.target)) {
                //Do nothing and wait for user to click buttons inside
            } else {
                if (inRef.current && !inRef.current.contains(event.target) && outRef.current) {
                    if (!outRef.current.contains(event.target)) {
                        handleClickOutside() //Child is not clicked, should turn off here
                    } else {
                        handleClickInside() //Child is clicked, should turn on here
                    }
                } 
            }


        }

        // Bind the event listener
        document.addEventListener("mousedown", handleOverlapClick);
        return () => {
            // Unbind the event listener on clean up
            document.removeEventListener("mousedown", handleClickInside);
        };
    }, [outRef, inRef, handleClickOutside, handleClickInside]);
}

export const cleanExcelData = (values: any, organizations: any) => {

    // Create mapping for the id and organizaiton's name
    const organizationMap = {};
    organizations.forEach( (item: any) => {
        //@ts-expect-error ignore it
        organizationMap[item._id] = item.name;
    })

    console.log(organizationMap)

    const result : any[] = []
    for (const data of values) {
        //Only download people more than age 15
        if ((new Date().getFullYear()) - data.birthYear  < 16) continue;

        const obj = {};
        Object.keys(data).forEach( (k, _) : void => {
            let value = data[k];
            //These are the categories that have Kh??ng but not return boolean
            if (["languages"].includes(k)) {
                value = value.map((value : string) => value.split("_").join(" "))
            } else if (k === "phone") {
                value = value === "" || !value ? "" : `\t${value}`; //Tab works
            } else if (k === "organization_id") {
                //@ts-expect-error data[k] is a string
                value = value === "" || !value ? "" : `${organizationMap[data[k]]}`;
            }
            else if (EnumFields.includes(k))  {
                value = value.split("_").join(" ")
                //Do nothing
            } else {
                if (value === true) {
                    value = "C??"
                } else if (value === false) {
                    value = "Kh??ng"
                } 
            }
            //@ts-expect-error it's a string
            obj[k] = value
        })

        result.push(obj)
    }

    return result
}

export const createFormItem = ( obj: any ) => {
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
                        message: `??i???n ${obj.label.toLowerCase()}`
                    },
                    ...obj.validator
                ]
            }>
                { (obj.enum === undefined) ? <Input key={obj.label + obj.name} /> : 
                    <Select
                        key={obj.name + obj.label}
                        showSearch={obj.showSearch}
                        placeholder={`??i???n ${obj.label.toLocaleLowerCase()}`}
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

//These are fields with "Khong" but have other things rather than just "Khong" and "Co"
export const nonBooleanFields = [
    "occupation", 
    "supportType", 
    "religion", 
    "brailleComprehension",
    "education",
    "postEducation",
    "politicalEducation",
    "governmentAgencyLevel",
    "socialWorkLevel",
    "languages"
]

export const EnumFields = [
    "eyeCondition", 
    "ethnicity", 
    "eyeCondition", 
    "marriage", 
    "incomeType",
    ...nonBooleanFields
]


export const convertEnumTrueFalse = (values: any) => {
    //Convert TrueFalse enum to true false
    Object.keys(values).forEach( (k, _) : void => {
        let value = values[k];

        //These are the categories that have Kh??ng but not return boolean
        if (nonBooleanFields.includes(k))  {
            //Do nothing
        } else {
            if (value === "C??") {
                value = true
            } else if (value === "Kh??ng") {
                value = false
            } 
        }


        if (["birthYear", "yearJoin"].includes(k)) 
        value = parseInt(value) 
        values[k] = value;
    })

    return values;
}

export const SelectOrganizationsIfAdmin = (organizations : any) => {
        return <>
            <Item 
                className="select-organization"
                key="organization_id" 
                label="Th??nh vi??n hi???n t???i"
                name="organization_id"
                rules={
                [
                    {
                        required: true,
                        message: `Ch???n th??nh vi??n`
                    }
                ]
                }
            >
                <Select
                    showSearch={true}
                    placeholder={`??i???n t??n th??nh vi??n`}
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
        label : "H???",
        name: "lastName",
    }, 
    { 
        label : "T??n ?????m v?? t??n",
        name: "firstName",
    }, 
    { 
        label : "N??m sinh",
        name: "birthYear",
        validator: [
            () => ({
                validator(_ : any, value : string) {
                    if (/^\d{4}$/.test(value)) {
                        if (Number.parseInt(value) >= 1900 && Number.parseInt(value) <= new Date().getFullYear()) {
                            return Promise.resolve();
                        } else {
                            return Promise.reject(new Error('N??m sinh c???a b???n ph???i trong kho???ng t??? 1900 ?????n n??m hi???n t???i'));
                        }
                    }

                    return Promise.reject(new Error('H??y ??i???n n??m sinh ch??nh x??c'));

                },
            }) 
        ]
    }, 
    { 
        label : "N??m v??o h???i",
        name: "yearJoin",
        validator: [
            () => ({
                validator(_ : any, value : string) {
                    if (/^\d{4}$/.test(value)) {
                        if (Number.parseInt(value) >= 1900 && Number.parseInt(value) <= new Date().getFullYear()) {
                            return Promise.resolve();
                        } else {
                            return Promise.reject(new Error('N??m v??o h???i kh??ng h???p l???'));
                        }
                    }

                    return Promise.reject(new Error('H??y ??i???n n??m sinh ch??nh x??c'));

                },
            }) 
        ]
    }, 
    { 
        label : "S??? ??i???n tho???i",
        name: "phone",
        required: false,
        validator: [
            () => ({
                validator(_ : any, value : any) {
                    return (value && value.match(/^\d{8,12}$/)) || !value ?  Promise.resolve() : Promise.reject(new Error('H??y ??i???n s??? ??i???n tho???i trong kho???ng 8 - 12 s??? '));
                },
            }) 
        ]
    },
    { 
        label : "?????a ch???",
        name: "address",
    },
    { 
        label : "Gi???i t??nh",
        name: "gender",
        enum: Enum.Gender,
    },
    { 
        label : "D??n t???c",
        name: "ethnicity",
        enum: Enum.Ethnicity,
        showSearch: true
    },
    { 
        label : "T??n gi??o",
        name: "religion",
        enum: Enum.Religion,
        showSearch: true
    },
    { 
        label : "Ngh??? nghi???p",
        name: "occupation",
        enum: Enum.Occupation,
        showSearch: true
    },
    { 
        label : "?????ng Vi??n",
        name: "isCommunistPartisan",
        enum: Enum.TrueFalse
    },
    { 
        label : "T??nh tr???ng h??n nh??n",
        name: "marriage",
        enum: Enum.MarriageStatus
    },
    { 
        label : "T??nh tr???ng th??? l???c",
        name: "eyeCondition",
        enum: Enum.EyeCondition,
    },
    { 
        label : "Tr??nh ????? h???c v???n",
        name: "education",
        enum: Enum.Education,
    },
    { 
        label : "Tr??nh ????? chuy??n m??n",
        name: "postEducation",
        enum: Enum.PostEducation,
    },
    { 
        label : "Tr??nh ????? ch??nh tr???",
        name: "politicalEducation",
        enum: Enum.PoliticalEducation
    },
    { 
        label : "Tr??nh ????? qu???n l?? nh?? n?????c",
        name: "governmentAgencyLevel",
        enum: Enum.GovernmentAgencyLevel
    },
    { 
        label : "Tr??nh ????? ngh??? c??ng t??c x?? h???i",
        name: "socialWorkLevel",
        enum: Enum.PostEducation, //Same with post edu
    },
    { 
        label : "Tr??nh ????? ch??? n???i",
        name: "brailleComprehension",
        enum: Enum.BrailleComprehension
    },
    { 
        label : "Tr??nh ????? ngo???i ng???",
        name: "languages",
        enum: Enum.Language, 
        showSearch: true,
        mode: "tag"
    },
    { 
        label : "Ch???ng ch??? nghi???p v??? qu???n l?? h???i",
        name: "blindManageCert",
        enum: Enum.TrueFalse, //Same with post edu
    },
    { 
        label : "S??? d???ng tin h???c",
        name: "familiarWIT",
        enum: Enum.TrueFalse
    },
    { 
        label : "Gi???y ch???ng nh???n khuy???t t???t",
        name: "disabilityCert",
        enum: Enum.TrueFalse
    },
    { 
        label : "Th??? b???o hi???m y t???",
        name: "healthInsuranceCard",
        enum: Enum.TrueFalse
    },
    { 
        label : "Th??? xe bus",
        name: "busCard",
        enum: Enum.TrueFalse
    },
    { 
        label : "Ch??? ????? ??ang h?????ng",
        name: "supportType",
        enum: Enum.SupportType,
        showSearch: true
    },
    { 
        label : "?????i s???ng gia ????nh",
        name: "incomeType",
        enum: Enum.IncomeType
    },
] 


export const organizationFormItems = [
    {
        label: "T??n th??nh vi??n",
        name: "name",
        required: true
    },
    {
        label: "?????a ch???",
        name: "address",
        required: false
    },
    {
        label: "S??? ??i???n tho???i",
        name: "phone",
        required: false,
        validator: [
            () => ({
                validator(_ : any, value : any) {
                    return value === null || value.match(/^\d{8,12}$/) ?  Promise.resolve() : Promise.reject(new Error('H??y ??i???n s??? ??i???n tho???i trong kho???ng 8 - 12 s??? '));
                },
            }) 
        ]
    }
]

export const getLabelFromName = (fieldName: any) => {
    for (const item of FormItems) {
        if (fieldName === item.name) {
            return item.label;
        }
    }
    
    return "Kh??ng t???n t???i" //Not found
}

export const convertRomanToNumText = (string: string) => {
    const [val, roman] = string.trim().split(" ");
    let numText = "";
    switch (roman) {
        case "iii":
            numText = "ba"
            break;
        case "ii":
            numText = "hai"
            break;
        case "i":
            numText = "m???t"
            break;
    }

    return `${val} ${numText}`
}

export const displaySentenceFromKeyVal = (key: any, val: any) => {
    let label = ""
    switch (key) {
        case "incomeType":
            return `c?? ${getLabelFromName(key)} ${val}`.toLowerCase();
        case "supportType":
            if (val === "Kh??ng") return `kh??ng ???????c h?????ng ch??? ????? h??? tr???`.toLowerCase();
            return `??ang h?????ng ch??? ????? h??? tr??? ${val}`.toLowerCase();
        case "busCard":
        case "healthInsuranceCard":
        case "disabilityCert":
            label = getLabelFromName(key)
            if (val === "Kh??ng") return `kh??ng c?? ${label}`.toLowerCase();
            return `c?? ${label}`.toLowerCase();
        case "familiarWIT":
            label = getLabelFromName(key)
            if (val === "Kh??ng") return `kh??ng bi???t ${label}`.toLowerCase();
            return `bi???t ${label}`.toLowerCase();
        case "languages":
            label = getLabelFromName(key)
            if (val === "Kh??ng") return `kh??ng c?? ${label}`.toLowerCase();
            return `bi???t ti???ng ${val}`
        case "brailleComprehension":
            label = getLabelFromName(key)
            if (val === "Kh??ng") return `kh??ng c?? ${label}`.toLowerCase();
            return `c?? ${label.toLowerCase()} ${val}`
        case "education":
            label = getLabelFromName(key)
            if (val === "Kh??ng") return `kh??ng c?? ${label}`.toLowerCase();
            return `c?? ${label.toLowerCase()} ${convertRomanToNumText(val.toLowerCase())}`
        case "postEducation":
        case "politicalEducation":
        case "governmentAgencyLevel":
            label = getLabelFromName(key)
            if (val === "Kh??ng") return `kh??ng c?? ${label}`.toLowerCase();
            return `c?? ${label.toLowerCase()} ${val.toLowerCase()}`
        case "eyeCondition":
            return `${val} ${label}`.toLowerCase();
        case "marriage":
            if (val === "M??? ????n th??n") return `l?? ${val}`.toLowerCase();
            return `${val.toLowerCase()}`
        case "isCommunistPartisan":
            label = getLabelFromName(key)
            if (val === "Kh??ng") return `kh??ng l?? ${label}`.toLowerCase();
            return `l?? ${label}`.toLowerCase();
        case "occupation":
            label = getLabelFromName(key)
            if (val === "Kh??ng") return `kh??ng c?? ${label}`.toLowerCase();
            return `l??m ${val.toLowerCase()}`
        case "religion":
            label = getLabelFromName(key)
            if (val === "Kh??ng") return `kh??ng theo ${label}`.toLowerCase();
            return `theo ${val}`
        case "ethnicity":
            label = getLabelFromName(key)
            return `thu???c d??n t???c ${val}`
        case "gender":
            return `l?? ${val}`.toLowerCase();
    }
    return ""
}


export const getEnumValue = (fieldName: any, value : any) => {
    for (const item of FormItems) {
        if (fieldName === item.name) {
            //@ts-expect-error
            return item.enum[value];
        }
    }
}

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

