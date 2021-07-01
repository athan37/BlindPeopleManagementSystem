import { Layout, Input, Menu, Image } from "antd";

const { Header } = Layout;
const { Search } = Input;

export const AppHeader = () => {

    return (


            <Header style={{  right: 0,  width: '100%', color:"#1b4368" }}>
                {/* <div className="app-header__search-input">
                </div> */}
                {/* <div className="app-header__menu">
                </div> */}

                    <Search/>
                    <Menu mode="horizontal" >
                        <Menu.Item key="sontung">
                            Log Out
                        </Menu.Item>
                        <Menu.Item key="hei">
                            Login
                        </Menu.Item>
                    </Menu>
            </Header>
    )
}

