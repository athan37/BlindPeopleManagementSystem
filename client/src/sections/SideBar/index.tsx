import { Menu } from "antd";
import { Link } from "react-router-dom";
import { Viewer } from "../../lib";
import { EditOutlined, UserOutlined, UserAddOutlined, DashboardOutlined  } from "@ant-design/icons";

//Will be changed or deleted
import logo from "./assets/logo-hoiNguoiMu.png";
import { useWindowDimensions } from "../Page/utils";

interface Props {
  viewer: Viewer;
  setIsOpen: any
}


export const SideBar = ({ viewer, setIsOpen } : Props) => {

    const { width } = useWindowDimensions();
    const changeSideBarState = () => {
      if (width < 1500) {
        setIsOpen(false)
      }
    }
    return (
        <aside style={{backgroundColor: "white"}}> 
              <div className="sider__user-logo-container">
                  <img alt="anh logo" 
                    src={logo}
                  />
              </div>
                <div className="sider__user-tag-container">
                  <a className="sider__user-tag" href="/members">
                    <div className="sider__user-tag-img-container">
                      <img alt="anh dai dien tu google" 
                        src={viewer.avatar || logo}
                      />
                    </div>
                    <div className="sider__user-tag-text">
                      {viewer.name}
                    </div>
                  </a>
                </div>
          <Menu 
            theme="light" 
            mode="inline" 
            style={{marginTop: 30}} 
            className="sider__menu"
          > 
            <Menu.Item 
              onClick={() => changeSideBarState()}
              key="1" 
              icon={<DashboardOutlined 
                  style={{
                      fontSize: "150%",
                  }}
              />}>
              <Link to="/summary" >
                Thống kê
              </Link>
            </Menu.Item>
            <Menu.Item 
              onClick={ () => changeSideBarState()}
              key="2" 
              icon={<UserOutlined 
                  style={{
                      fontSize: "150%",
                  }}
              />}
            >
              <Link to="/members" >
                Quản lý
              </Link>
            </Menu.Item>
            <Menu.Item 
              onClick={() => changeSideBarState()}
              key="3" 
              icon={<UserAddOutlined 
                style={{
                    fontSize: "150%",
                }}
              />}
            >
              <Link to="/createUser" >
                Tạo hội viên
              </Link>
            </Menu.Item>
            <Menu.Item 
              onClick={() => changeSideBarState()}
              key="4" 
              icon={<EditOutlined 
                style={{
                    fontSize: "150%",
                }}
              />}
            >
              <Link to="/editOrganization" >
                Thành viên
              </Link>
            </Menu.Item>
          </Menu>
        </aside>
    )
}