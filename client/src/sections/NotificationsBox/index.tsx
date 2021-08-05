import { Spin} from "antd";
import { useQuery } from "@apollo/client";
import { useEffect, useRef, useState } from "react";
import { Message } from "./components";
import { Viewer } from "../../lib";
import { LoadMessages as LoadMessagesData, LoadMessagesVariables } from "../../lib/graphql/queries/Messages/__generated__/LoadMessages";
import { QUERY_MESSAGES } from "../../lib/graphql/queries/Messages";
import { displayErrorMessage } from "../../lib/utils";
import { useOutsideAlerter } from "../Page/utils";

interface Props {
    viewer : Viewer;
    totalMessageRefetch: any;
    setDisplayNotification: any;
}
export const NotificationsBox = ({ viewer, totalMessageRefetch, setDisplayNotification } : Props ) => {
    type ServerMessage = LoadMessagesData["loadMessages"]["results"][0];
    const [ messages, setMessages ] = useState<ServerMessage[]>();
    const [ avatars, setAvatars ] = useState<string[]>();
    const { refetch, loading } = useQuery<LoadMessagesData, LoadMessagesVariables>(
        QUERY_MESSAGES, { 
            variables: {
                viewerId: viewer.id || "",
            },
            onCompleted: data => {
                setMessages(data.loadMessages.results)
                setAvatars(data.loadMessages.avatars)
            },
            pollInterval: 500,
            onError: err => displayErrorMessage(`Không thể tải tin nhắn ${err}`)
        }, 
    )

    const ref = useRef(refetch);

    useEffect(() => {
        ref.current();
    }, [messages])

    const wrapperRef = useRef(null);
    useOutsideAlerter(wrapperRef, () => setDisplayNotification(false));

    return <div 
                ref={wrapperRef}
                className="notification-box-container"
                >
            <div className="notification-box">
            { !loading ? 
                    <>  
                        <div className="notification-box__text">
                            Thông báo mới
                        </div>
                        { 
                            messages && messages.length > 0 ? 
                                messages.map( ( serverMessage : ServerMessage, index : number ) => 
                                    <Message 
                                        totalMessageRefetch={totalMessageRefetch}
                                        key={serverMessage.content}
                                        viewer={viewer} 
                                        serverMessage={ serverMessage } 
                                        setMessage = { setMessages }
                                        avatar={avatars ? avatars[index] : "https://bolgatangabaskets.com/wp-content/uploads/2019/05/placeholder-image.png"}
                                    />) 
                                : 
                                <div className="message__no-items" > 
                                    <h3>
                                        Không có thông báo
                                    </h3>
                                </div>
                        } 
                    </> 
                    :
                    <div className="message__no-items" > 
                        <Spin />
                    </div> }
            </div>
    </div>
}


// const mock = [
//     {
//         "name" : "Tran Van Ngu",
//         "organization_name": "Thanh Xuan",
//         "content": "Toi muon gia nhap thanh vien "
//     },
//     {
//         "name" : "Tran Van Cac",
//         "organization_name": "Long Bien",
//         "content": "Toi muon gia nhap thanh vien "
//     }
// ]