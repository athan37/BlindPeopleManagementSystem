import { Input, Button } from "antd";
import { Viewer } from "../../lib";
import { bgColor } from "../../lib/bgColor";

const { Search } = Input;

interface Props {
    viewer: Viewer;
    setDisplayNotification : any;
}


export const AppHeader = ({ viewer, setDisplayNotification } : Props) => {
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
                        <Button style={{ height: 60, marginLeft: 20 }}>Thoát</Button>
                    </div>
        </header>
    )
}

