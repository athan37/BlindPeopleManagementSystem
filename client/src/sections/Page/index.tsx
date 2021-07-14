import { MembersTable, CreateUser, Profile, Statistics } from "./components"
import { Switch, Route } from "react-router";
import { SideBar } from "../SideBar";
import { AppHeader } from "../AppHeader";
import { NotFound } from "../NotFound";
import { NotificationsBox } from "../NotificationsBox";
import { Viewer } from "../../lib";
import { bgColor } from "../../lib/bgColor";
import { useState } from "react";

interface Props {
  viewer: Viewer;
}


export const Page = ({ viewer } : Props) => {
    const [displayNotification, setDisplayNotification] = useState(false);

    return (
      <>
        <section className="container" style={{ backgroundColor: bgColor.container }}>
            <SideBar />
            <AppHeader viewer={viewer} setDisplayNotification={setDisplayNotification}/>
            <section className="content">
                <div className="content-data">
                  <Switch>
                      <Route exact path = '/members'>
                        <div className="content__members-table">
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
                          <Statistics />
                        </div>
                      </Route>
                      <Route path = "/*">
                        <NotFound />
                      </Route>
                </Switch>
                </div>
            </section>
            <footer style={{backgroundColor: bgColor.footer }}>
              Made by Duc Anh
            </footer>
        </section>
        { displayNotification && viewer.isAdmin &&  <NotificationsBox /> }
        </>
    )

}