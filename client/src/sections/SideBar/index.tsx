import { Layout, Menu, Image } from "antd";
import { Link } from "react-router-dom";

//Will be changed or deleted
import logo from "../AppHeader/assets/logo.jpg";

const { Sider } = Layout;

export const SideBar = () => {
    return (
        <Sider
          collapsedWidth={0}
          style={{
            overflow: 'auto',
            height: '100vh',
            position: 'fixed', 
            left: 0,
          }}
        > 
                <Image 
                    width={199}
                    src={logo}
                    alt="logo"
                    style={{
                      borderRadius: '10px',
                      borderColor: "red",
                      borderWidth: '10px'
                    }}
                />
          <Menu theme="dark" mode="inline" className="sider__menu"> 
            <Menu.Item key="1">
              <Link to="/members">
                Hello
              </Link>
            </Menu.Item>
            <Menu.Item key="2">
              <Link to="/user">
                Hi
              </Link>
            </Menu.Item>

          </Menu>
        </Sider>
    )
}