import ReactDOM from 'react-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { Layout, Menu, Image } from "antd";
import logo from "./sections/AppHeader/assets/logo.jpg"
import { Member, MembersTable, SideBar, AppHeader } from './sections';
import { BrowserRouter as Router, Switch, Route, Link} from 'react-router-dom';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  useQuery,
  gql,
  HttpLink,
  ApolloLink,
  concat
} from "@apollo/client";
import { Viewer } from './lib';
import { useState } from 'react';


const { Header, Sider, Footer, Content } = Layout;

const httpLink  = new HttpLink({ uri : '/api'});
const authMiddleware = new ApolloLink((operation, forward) => {
  const token = sessionStorage.getItem("token");
  operation.setContext({
    headers: {
      'X-CSRF-TOKEN' : token || ""
    }
  });

  return forward(operation);
});

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: concat(authMiddleware, httpLink)
});

const initialViewer : Viewer = {
  id: null,
  token: null,
  avatar : null,
  isAdmin : null, 
  organization_id : null
}

const App = () => {
  const [viewer, setViewer] = useState<Viewer>(initialViewer);
  return ( 
    <>
    <Router>

        {/* <AppHeader /> */}
      <Layout style={{ minHeight: `100vh`}}>
        <Sider
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
              <Link to="/">
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
        <Layout>
            <AppHeader />
            <Content style={{ margin: '24px 16px 0', overflow: 'initial', padding: 24, minHeight:280 }}>
              <div style={{ padding: 36, textAlign: 'center'}}>
                <Switch>
                    <Route exact path = '/'>
                        <MembersTable />
                    </Route>
                    <Route exact path = "/user/:id">
                      <Member/>
                    </Route>
                </Switch>
              </div>
            </Content>
            <Footer style={{ textAlign: 'center', border: '1px solid #000' }} >

              Made by me 
            </Footer>
        </Layout>
      </Layout>

  </Router>

    </>
  )

}

ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
