import { MembersTable, CreateUser, Profile, Statistics } from "./components"
import { Switch, Route } from "react-router";
import { SideBar } from "../SideBar";
import { AppHeader } from "../AppHeader";
import { NotFound } from "../NotFound";
import { NotificationsBox } from "../NotificationsBox";
import { Viewer } from "../../lib";
import { bgColor } from "../../lib/bgColor";
import { useState } from "react";
import { Button } from "antd";

interface Props {
  viewer: Viewer;
  setViewer: (viewer: Viewer) => void;
}


export const Page = ({ viewer, setViewer } : Props) => {
    const [displayNotification, setDisplayNotification] = useState<boolean>(false);
    const [isOpen, setIsOpen] = useState<boolean>(false);

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
                          <a className= "content__create-user" href="/createUser">Create user</a>
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
                        <NotFound />
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