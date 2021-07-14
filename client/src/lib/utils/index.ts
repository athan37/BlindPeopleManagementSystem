import { message, notification } from "antd";

export const iconColor = "#1800ff";

export const displaySuccessNotification = (message: string, description?: string) => {
    return notification["success"]({
        message, 
        description, 
        placement: "topRight",
        style: {
            marginTop: 20
        }
    })
}

export const deleteKey = (obj : any, key = "id") => {
    let newObj = {}
    Object.keys(obj).forEach( (k, _) => {
        //@ts-expect-error
        if (k !== key) newObj[k] = obj[k] 
    })

    return newObj;
}

export const displayErrorMessage = (error: string) => {
    return message.error(error);
} 