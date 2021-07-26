import { MembersTable, CreateUser, Profile, Statistics } from "./components"
import { Switch, Route } from "react-router";
import { Link } from "react-router-dom";
import { SideBar } from "../SideBar";
import { AppHeader } from "../AppHeader";
import { NotFound } from "../NotFound";
import { NotificationsBox } from "../NotificationsBox";
import { Viewer } from "../../lib";
import { bgColor } from "../../lib/bgColor";
import { useState } from "react";

interface Props {
  viewer: Viewer;
  setViewer: (viewer: Viewer) => void;
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}


export const Page = ({ viewer, setViewer, isOpen, setIsOpen } : Props) => {
    const [displayNotification, setDisplayNotification] = useState<boolean>(false);

    console.log("REadhc page")
    return (
      <>
        <section className={isOpen ? "container" : "container__no-sider" } style={{ backgroundColor: bgColor.container }}>
            {isOpen && <SideBar viewer={viewer}/>}
            <AppHeader 
              viewer={viewer} 
              setViewer={setViewer} 
              setDisplayNotification={setDisplayNotification}
              setIsOpen={setIsOpen}
              />
            <section className="content">
                <div className="content-data">
                  <Switch>
                      <Route exact path = '/members'>
                        <div className="content__members-table">
                          <Link className= "content__create-user" to="/createUser">Tạo hội viên</Link>
                          <MembersTable viewer={viewer}/>
                        </div>
                      </Route>
                      <Route exact path = "/user/:organizationId?/:id">
                        <div className="content__members-profile">
                          <Profile viewer={viewer}/>
                        </div>
                      </Route>
                      <Route exact path = "/createUser">
                        <div className="content__members-profile">
                          <CreateUser viewer={viewer} />
                        </div>
                      </Route>
                      <Route exact path = "/summary">
                        <div className="content__summary">
                          <Statistics viewer={viewer} />
                        </div>
                      </Route>
                      <Route path = "/*">
                        <div 
                          style={{ gridColumn: "2/ span 2", gridRow: "10" }}
                          className="page__error-link"
                        >
                          <NotFound />
                          <Link className= "content__create-user" to="/members">Quay về trang chủ</Link>
                        </div>
                      </Route>
                </Switch>
                </div>
            </section>
            {/* <footer style={{backgroundColor: bgColor.footer }}>
              Made by Duc Anh
            </footer> */}
        </section>
        { displayNotification && viewer.isAdmin &&  <NotificationsBox /> }
        </>
    )

}