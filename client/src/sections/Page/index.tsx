import { MembersTable } from "./components"
import { Layout } from "antd";
import { Switch, Route } from "react-router";
import { Profile } from "../Profile";
import { SideBar } from "../SideBar";
import { AppHeader } from "../AppHeader";
import { NotFound } from "../NotFound";
import { Viewer } from "../../lib";

const { Footer, Content } = Layout;
interface Props {
  viewer: Viewer;
}
export const Page = ({ viewer } : Props) => {
    return (
      <Layout style={{ minHeight: `100vh`}}>
        <SideBar />
        <Layout>
            <AppHeader />
            <Content style={{ margin: '24px 16px 0', overflow: 'initial', padding: 24, minHeight:280 }}>
              <div style={{ padding: 36, textAlign: 'center'}}>
                <Switch>
                    <Route exact path = '/members'>
                        <MembersTable />
                    </Route>
                    <Route exact path = "/user/:id">
                      <Profile/>
                    </Route>
                    <Route path = "/*">
                      <NotFound />
                    </Route>
                </Switch>
              </div>
            </Content>
            <Footer style={{ textAlign: 'center', border: '1px solid #000' }} >

              Made by Duc Anh
            </Footer>
        </Layout>
      </Layout>
    )

}