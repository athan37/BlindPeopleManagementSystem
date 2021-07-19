import { useMutation } from "@apollo/client";
import { Input, Button } from "antd";
import { Redirect, useHistory } from "react-router";
import { Viewer } from "../../lib";
import { bgColor } from "../../lib/bgColor";
import { LOG_OUT } from "../../lib/graphql/mutations";
import { LogOut as LogOutData } from "../../lib/graphql/mutations/LogOut/__generated__/LogOut";
import { displayErrorMessage, displaySuccessNotification } from "../../lib/utils";

const { Search } = Input;

interface Props {
    viewer: Viewer;
    setViewer: (viewer: Viewer) => void;
    setDisplayNotification : any;
}


export const AppHeader = ({ setViewer, viewer, setDisplayNotification } : Props) => {
    const history = useHistory();
    const [logOut] = useMutation<LogOutData>(LOG_OUT, {
        onCompleted: (data) => {
            if (data && data.logOut) {
                setViewer(data.logOut);
                sessionStorage.removeItem("token");
                displaySuccessNotification("Bạn đã log out")
            }
        }, 
        onError: err => {
            displayErrorMessage(
                `Có lỗi xảy ra: ${err}`
            )
        }
    })

    const changeState = () => {setDisplayNotification( ( val : boolean ) 
        : boolean => !val) };
    return (
        <header className="app-header__header" style={{backgroundColor: bgColor.header}}>
                <Search 
                    style={{width: 400, 
                            paddingLeft: 40, 
                            flexShrink: 3}}/>
                    <div className="app-header__notification">
                        { viewer.isAdmin &&
                            <Button 
                                onClick={changeState}
                                style={{ height: 60 }} >Thông báo</Button>

                        }
                        <Button style={{ height: 60, marginLeft: 20 }} onClick={
                            () => {
                                logOut();
                                history.push("/login")
                            }
                        }>Thoát</Button>
                    </div>
        </header>
    )
}

