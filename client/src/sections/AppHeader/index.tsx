import { useMutation } from "@apollo/client";
import { Button } from "antd";
import { useHistory } from "react-router";
import { Viewer } from "../../lib";
import { BellFilled, LogoutOutlined, MenuUnfoldOutlined, MenuFoldOutlined } from "@ant-design/icons";
import { LOG_OUT } from "../../lib/graphql/mutations";
import { LogOut as LogOutData } from "../../lib/graphql/mutations/LogOut/__generated__/LogOut";
import { displayErrorMessage, displaySuccessNotification } from "../../lib/utils";
import { useWindowDimensions } from "../Page/utils";


interface Props {
    viewer: Viewer;
    setViewer: (viewer: Viewer) => void;
    setDisplayNotification : any;
    setIsOpen: (isOpen: any) => void;
    isOpen: boolean;
}


export const AppHeader = ({ setViewer, viewer, setDisplayNotification, isOpen, setIsOpen } : Props) => {
    const history = useHistory();
    const [logOut] = useMutation<LogOutData>(LOG_OUT, {
        onCompleted: (data) => {
            if (data && data.logOut) {
                setViewer(data.logOut);
                sessionStorage.removeItem("token");
                history.push("/login")
                displaySuccessNotification("Bạn đã log out")
            }
        }, 
        onError: err => {
            displayErrorMessage(
                `Có lỗi xảy ra: ${err}`
            )
        }
    })

    const changeState = () => { setDisplayNotification( ( val : boolean ) : boolean => !val) };

    const { width } = useWindowDimensions();
    return (
        <header className="app-header__header">
            {width < 1500 ? 
                <Button 
                    onClick={() => setIsOpen((isOpen : boolean) => !isOpen)}
                    style={{ 
                            zIndex: 10,
                            marginLeft: width < 1500 && isOpen ? 50 : 100,
                            backgroundColor: "transparent",
                            borderColor: "transparent",
                        }} 
                    icon={ 
                    isOpen ?  <MenuFoldOutlined 
                        style={{
                            fontSize: "150%",
                            backgroundColor: "transparent",
                            borderColor: "transparent",
                            color: "#4650DD"
                        }}
                    /> : <MenuUnfoldOutlined 
                        style={{
                            fontSize: "150%",
                            backgroundColor: "transparent",
                            borderColor: "transparent",
                        }}
                    /> 
                }
                /> : null
                }
                <div className="app-header__notification">
                    { viewer.isAdmin &&
                        <Button 
                            onClick={changeState}
                            style={{ 
                                backgroundColor: "transparent",
                                borderColor: "transparent",
                                }} 
                            icon={<BellFilled
                                style={{
                                    fontSize: "150%",
                                }}
                            />}
                            >
                        </Button>

                    }
                    <Button 
                        icon={<LogoutOutlined 
                            style={{
                                fontSize: "150%",
                                backgroundColor: "transparent",
                                borderColor: "transparent",
                                color: width < 1500 && isOpen ? "white" : "inherit"
                            }}
                        />}
                        style={{ 
                            backgroundColor: "transparent",
                            borderColor: "transparent"
                            }} 
                        onClick={
                        () => {
                            logOut();
                        }
                    }/>
                </div>
        </header>
    )
}

