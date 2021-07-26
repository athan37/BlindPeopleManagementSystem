import { Menu, Layout } from "antd";
import { Link } from "react-router-dom";
import { Viewer } from "../../lib";
import { UserOutlined, UserAddOutlined, DashboardOutlined  } from "@ant-design/icons";

//Will be changed or deleted
import logo from "./assets/logo-hoiNguoiMu.png";
import { useState } from "react";

interface Props {
  viewer: Viewer;
}


export const SideBar = ({ viewer } : Props) => {
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
            <Menu.Item key="1" icon={<UserOutlined 
                style={{
                    fontSize: "150%",
                }}
            />}>
              <Link to="/members">
                Quản lý
              </Link>
            </Menu.Item>
            <Menu.Item key="2" icon={<UserAddOutlined 
                style={{
                    fontSize: "150%",
                }}
            />}>
              <Link to="/createUser">
                Tạo hội viên
              </Link>
            </Menu.Item>
            <Menu.Item key="3" icon={<DashboardOutlined 
                style={{
                    fontSize: "150%",
                }}
            />}>
              <Link to="/summary">
                Thống kê
              </Link>
            </Menu.Item>
          </Menu>
        </aside>
    )
}