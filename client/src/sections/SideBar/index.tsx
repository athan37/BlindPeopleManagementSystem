import { Menu, Image } from "antd";
import { Link } from "react-router-dom";
import { bgColor } from "../../lib/bgColor";

//Will be changed or deleted
import logo from "../AppHeader/assets/logo.jpg";

export const SideBar = () => {
    return (
        <aside style={{backgroundColor: bgColor.aside}}> 
                <Image
                    alt={"Anh dai dien logo"}
                    width={200}
                    src={logo}
                    style={{
                      backgroundColor: "green-4",
                      borderRadius: '10px',
                      borderColor: "red",
                      borderWidth: '10px'
                    }}
                />
          <Menu 
            theme="light" 
            mode="inline" 
            style={{marginTop: 30, backgroundColor: bgColor.asideMenu}} 
          > 
            <Menu.Item key="1" style={{backgroundColor: bgColor.asideMenuItem }}>
              <Link to="/members">
                Quản lý
              </Link>
            </Menu.Item>
            <Menu.Item key="2" style={{backgroundColor: bgColor.asideMenuItem }}>
              <Link to="/createUser">
                Tạo hội viên
              </Link>
            </Menu.Item>
            <Menu.Item key="3" style={{backgroundColor: bgColor.asideMenuItem }}>
              <Link to="/summary">
                Thống kê
              </Link>
            </Menu.Item>
          </Menu>
        </aside>
    )
}