import { Modal } from "antd";
import { useState } from "react";
import { SelectOrganizations } from "../../../../utils";

interface Props  {
    memberData : any
}

export const TransferMemberModal = ({ memberData } : Props) => {
    const [ selectState, setSelectState] = useState<string>(memberData.orga);
    return <Modal
                title="Chọn thành viên để chuyển đến"
                visible={true}
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
                            width: 300,
                            display: 'flex',
                            flexDirection: 'row-reverse'
                        }}
                    >
                            <SelectOrganizations 
                                selectState={selectState}
                                setSelectState={setSelectState}
                                config={{
                                    className: "profile__modal",
                                    size: "medium",
                                    excludeId: memberData.organization_id
                                }}
                            />
                    </div>
                </div>
            </Modal>
}