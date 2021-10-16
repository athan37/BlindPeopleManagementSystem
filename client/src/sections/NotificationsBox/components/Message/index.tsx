import { useLazyQuery, useMutation } from "@apollo/client";
import { Button, Skeleton } from "antd";
import { Viewer } from "../../../../lib";
import { ClientMessageAction , MessageType, ServerMessageAction } from "../../../../lib/graphql/globalTypes";
import { HANDLE_MESSSAGE } from "../../../../lib/graphql/mutations/HandleMessageFromClient";
import { HandleMessage as HandleMessageData, HandleMessageVariables } from "../../../../lib/graphql/mutations/HandleMessageFromClient/__generated__/HandleMessage";
import { LoadMessages as LoadMessagesData } from "../../../../lib/graphql/queries/Messages/__generated__/LoadMessages";
import { GET_USER_INFO_FROM_MESSAGE } from "../../../../lib/graphql/queries/GetUserInfoFromMessage";
import { MessageUserInfo as MessageUserInfoData, MessageUserInfoVariables } from "../../../../lib/graphql/queries/GetUserInfoFromMessage/__generated__/MessageUserInfo";
import { displayErrorMessage } from "../../../../lib/utils";
import { useEffect, useRef } from "react";


type ServerMessage = LoadMessagesData["loadMessages"]["results"][0]; 

interface Props {
    viewer: Viewer;
    serverMessage : ServerMessage,
    setMessage: any;
    avatar: string;
    totalMessageRefetch: any;
}

export const Message = ({ viewer, serverMessage, setMessage, avatar, totalMessageRefetch } : Props) => {

    const [ getMessageUserInfoData, { data : MessageUserInfoData, loading: MessageUserInfoLoading }] = useLazyQuery<MessageUserInfoData, MessageUserInfoVariables>(GET_USER_INFO_FROM_MESSAGE, {
            variables : {
                fromId: serverMessage.from_id,
                fromOrganizationId: serverMessage.from_organizationId,
                type: serverMessage.type,
                content: serverMessage.content //Expect a member Id
            },
            onCompleted: data => {
            },
            onError: err => displayErrorMessage(`Không thể tải thông tin người gửi tin nhắn: ${err}`)
        });

    const [handleMessage, { data, loading }] = useMutation<HandleMessageData, 
    HandleMessageVariables>(HANDLE_MESSSAGE, {
        onError: err => displayErrorMessage(`Không thể thực hiện thao tác ${err}`)
    });

    const handleMessageClick = (action : ServerMessageAction) => {
        const input = {
                    type: serverMessage.type,
                    action, 
                    from_id: viewer.id || "",
                    to_organizationId: serverMessage.from_organizationId,
                    content: serverMessage.content //Expect member ID
                }
        if (serverMessage.type === MessageType.REGISTER) {
            //@ts-expect-error nothing important
            input["to_id"] = serverMessage.from_id;
        }

        handleMessage({
            variables: {
                input
            }
        })
        totalMessageRefetch();
    }

    const ref = useRef(getMessageUserInfoData);

    useEffect(() => {
        // Better to combine uselazyquery with use effect
        if (serverMessage.action === ClientMessageAction.APPROVE_DECLINE) {
            ref.current(); //Only call here because this need to change content
        }
    }, [serverMessage.action])

    const ref2 = useRef(setMessage);

    useEffect(() => {
        if (data?.handleMessageFromClient === "true" && !loading) {
            //Delete when success
            ref2.current((messages : ServerMessage[]) => messages.filter(
                message => message.content !== serverMessage.content
            ))
        }
    }, [data, serverMessage.content, loading])

    const messageUserInfo = MessageUserInfoData?.getUserInfoFromMessage;

    const createRegisterMessageContent = (content : string) => {
        const operation = content.split("-")[0];
        let displayContent = ""
        if (operation === "exist") {
            displayContent = `Người dùng ${
                messageUserInfo?.userName} xin gia nhập thành viên đã có ${
                    messageUserInfo?.organizationName}`
        } else {
            displayContent = `Người dùng ${
                messageUserInfo?.userName} xin tạo mới thành viên ${
                    messageUserInfo?.organizationName}` //It's the name now
        }

        return displayContent;

    }
    if (MessageUserInfoLoading) {
        return <Skeleton paragraph={{rows: 1}}/>
    }

    switch (serverMessage.action) {
        case ClientMessageAction.INFO:
            return <div className="message__container">
                <div className="message__img-container">
                    <img alt="anh nguoi dung" src={avatar}></img>
                </div>
                <div className="message__description">
                    <h5>{serverMessage.content}</h5> 
                </div>
                <div className="message__controls">
                    <Button
                        onClick={() => handleMessageClick(ServerMessageAction.DELETE)}
                        loading={loading}
                        type="primary"
                        size="small"
                    >Xác nhận</Button> </div>
            </div>

        case ClientMessageAction.APPROVE_DECLINE:
            return <div className="message__container">
                <div className="message__img-container">
                    <img alt="anh nguoi dung" src={avatar}></img>
                </div>
                <div className="message__description">
                    <h4>{messageUserInfo?.userName}</h4>
                    <h3>{messageUserInfo?.email}</h3>
                    { serverMessage.type === MessageType.TRANSFER ?  
                    <h5>{`Thành viên ${messageUserInfo?.organizationName} muốn chuyển hội viên ${messageUserInfo?.memberName}`}</h5> 
                    :
                    <h5>{createRegisterMessageContent(serverMessage.content)}</h5>
                    }
                </div>
                <div className="message__controls">
                    <Button
                        onClick={() => handleMessageClick(ServerMessageAction.DECLINE)}
                        type="default"
                        danger
                        size="small"
                    >Từ chối</Button>
                    <Button
                        style={{
                            marginRight: 10
                        }}
                        onClick={() => handleMessageClick(ServerMessageAction.APPROVE)}
                        type="primary"
                        size="small"
                        loading={loading}
                    >Đồng ý</Button>
                </div>
            </div>
    }
}