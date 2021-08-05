import { Modal } from "antd";
import { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import { Viewer } from "../../../../../../lib";
import { MessageType, ServerMessageAction } from "../../../../../../lib/graphql/globalTypes";
import { SelectOrganizations } from "../../../../utils";
import { HandleMessage as HandleMessageData, HandleMessageVariables } from "../../../../../../lib/graphql/mutations/HandleMessageFromClient/__generated__/HandleMessage";
import { HANDLE_MESSSAGE } from "../../../../../../lib/graphql/mutations/HandleMessageFromClient";
import { displayErrorMessage, displaySuccessNotification } from "../../../../../../lib/utils";
import { useMutation } from "@apollo/client";
interface Props  {
    memberData : any;
    viewer: Viewer;
    modalVisible: boolean;
    setModalVisible: ( value : boolean ) => void;
}

interface Params {
    id : string,
    organizationId : string
}

export const TransferMemberModal = ({ 
    viewer, 
    modalVisible,
    setModalVisible,
    memberData } : Props) => {
    const [ selectState, setSelectState ] = useState<string>(memberData.orga);
    const params = useParams<Params>();
    const history = useHistory();


    const [handleMessage, { data, loading }] = useMutation<HandleMessageData, 
    HandleMessageVariables>(HANDLE_MESSSAGE, {
        onError: err => displayErrorMessage(`Không thể thực hiện chuyen  ${err}`)
    });


    useEffect(() => {
        if (data?.handleMessageFromClient === "true") {
            if (!loading) {
                displaySuccessNotification("Chuyển hội viên thành công");
                history.goBack();
            }
        } else if (data && data?.handleMessageFromClient !== "true") {
            displayErrorMessage("Không thể chuyển hội viên")
        }
    }, [data, history, loading])

    const handleOk = () => { 
        const { id : member_id } = params;
        setModalVisible(false);
        handleMessage({
            variables: {
                input : { 
                    action: ServerMessageAction.REQUEST,
                    type: MessageType.TRANSFER,
                    from_id: viewer.id || "",
                    to_organizationId: selectState,
                    content: member_id
                }
            }
        })
    }
    
    const handleCancel = () => { 
        setModalVisible(false);
    }

    return <Modal
                width={800}
                title="Chọn thành viên để chuyển đến"
                visible={modalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
            >
                <div
                    style={{
                        width: "100%",
                        display: 'flex',
                    }}
                >
                    <h3
                        style={{
                            fontWeight: "initial",
                            fontFamily: `"Poppins",system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto Sans",sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji"`
                        }}
                    >Tên thành viên mới: </h3>
                    <div
                        style={{
                            marginLeft: "auto",
                            width: 450,
                            display: 'flex',
                            flexDirection: 'row-reverse'
                        }}
                    >
                            <SelectOrganizations 
                                selectState={selectState}
                                setSelectState={setSelectState}
                                config={{
                                    className: "profile__modal",
                                    size: "large",
                                    excludeId: memberData.organization_id
                                }}
                            />
                    </div>
                </div>
            </Modal>
}