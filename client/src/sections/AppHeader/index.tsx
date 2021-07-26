import { useMutation } from "@apollo/client";
import { Input, Button } from "antd";
import { Redirect, useHistory } from "react-router";
import { Viewer } from "../../lib";
import { SearchOutlined, BellFilled, LogoutOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { bgColor } from "../../lib/bgColor";
import { LOG_OUT } from "../../lib/graphql/mutations";
import { LogOut as LogOutData } from "../../lib/graphql/mutations/LogOut/__generated__/LogOut";
import { displayErrorMessage, displaySuccessNotification } from "../../lib/utils";

const { Search } = Input;

interface Props {
    viewer: Viewer;
    setViewer: (viewer: Viewer) => void;
    setDisplayNotification : any;
    setIsOpen: (isOpen: any) => void;
}


export const AppHeader = ({ setViewer, viewer, setDisplayNotification, setIsOpen } : Props) => {
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

    const changeState = () => {
        setDisplayNotification( ( val : boolean ) : boolean => !val) };
    return (
        <header className="app-header__header">
                    {/* <Search 
                        placeholder="Search sth..."
                        style={{
                                width: 400, 
                                paddingLeft: 40, 
                                paddingRight: 40, 
                                flexShrink: 3
                            }}/> */}
                    <Button 
                        onClick={() => setIsOpen((isOpen : boolean) => !isOpen)}
                        style={{ 
                                marginLeft: 50,
                                backgroundColor: "white",
                                borderColor: "white",
                            }} 
                        icon={<MenuUnfoldOutlined 
                            style={{
                                fontSize: "150%",
                            }}
                        />}
                        ></Button>
                    <div className="app-header__notification">
                        { viewer.isAdmin &&
                            <Button 
                                onClick={changeState}
                                style={{ 
                                    backgroundColor: "white",
                                    borderColor: "white",
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
                                    backgroundColor: "white",
                                    borderColor: "white"
                                }}
                            />}
                            style={{ 
                                backgroundColor: "white",
                                borderColor: "white"
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

