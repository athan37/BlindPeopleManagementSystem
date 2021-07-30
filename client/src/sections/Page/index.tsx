import { MembersTable, CreateUser, Profile, Statistics, EditOrganization } from "./components"
import { Switch, Route } from "react-router";
import { Link } from "react-router-dom";
import { SideBar } from "../SideBar";
import { AppHeader } from "../AppHeader";
import { NotFound } from "../NotFound";
import { NotificationsBox } from "../NotificationsBox";
import { Viewer } from "../../lib";
import { bgColor } from "../../lib/bgColor";
import { useState } from "react";
import { useWindowDimensions } from "./utils";

interface Props {
  viewer: Viewer;
  setViewer: (viewer: Viewer) => void;
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}


export const Page = ({ viewer, setViewer, isOpen, setIsOpen } : Props) => {
    const [displayNotification, setDisplayNotification] = useState<boolean>(false);
    const { width } = useWindowDimensions();
    return (
      <>
        <section 
          className={isOpen ?  width < 1500 ? "container__sider-sm" : "container" :  "container__no-sider" } 
          style={{ backgroundColor: bgColor.container }}
          >
            {isOpen && <SideBar viewer={viewer} setIsOpen={setIsOpen}/>}
            <AppHeader 
              isOpen={isOpen}
              viewer={viewer} 
              setViewer={setViewer} 
              setDisplayNotification={setDisplayNotification}
              setIsOpen={setIsOpen}
              />
            <section className="content">
                <div className="content-data">
                  { isOpen && width < 1500 ? null :
                  <Switch>
                      <Route exact path = '/members'>
                        <div className="content__members-table">
                          <Link className={ width < 700 ? "content__create-user sm" : "content__create-user"} to="/createUser">Tạo hội viên</Link>
                          <MembersTable viewer={viewer} isOpen={isOpen}/>
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
                      <Route exact path = "/editOrganization">
                        <div className="content__members-profile">
                          <EditOrganization  viewer={viewer}/>
                        </div>
                      </Route>
                      <Route path = "/*">
                        <div 
                          style={{ gridColumn: "2 / span 2", gridRow: "10" }}
                          className="page__error-link"
                        >
                          <NotFound />
                          <Link className= "content__create-user" to="/members">Quay về trang chủ</Link>
                        </div>
                      </Route>
                </Switch>}
                </div>
            </section>
        </section>
        { displayNotification && viewer.isAdmin &&  <NotificationsBox /> }
        </>
    )

}