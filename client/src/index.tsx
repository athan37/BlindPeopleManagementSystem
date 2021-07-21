import ReactDOM from 'react-dom';
import './index.less';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  HttpLink,
  ApolloLink,
  concat,
  useMutation,
} from "@apollo/client"; 
import { Skeleton } from "antd";
import { Viewer } from './lib';
import { useEffect, useRef, useState } from 'react';
import { Pending, LogIn, NotFound, Page, Register } from './sections';
import { LOG_IN } from './lib/graphql/mutations';
import { LogIn as LogInData, LogInVariables} from "./lib/graphql/mutations/LogIn/__generated__/LogIn";



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
  organization_id : null,
  didRequest : false,
  registering: null
}

const App = () => {
  const [viewer, setViewer] = useState<Viewer>(initialViewer);
  const [login, { error }] = useMutation<LogInData, LogInVariables>(LOG_IN, { 
    onCompleted: data => {
      if (data && data.logIn) {
        setViewer(data.logIn);
      }
    }
  });

  const logInRef = useRef(login);

  useEffect(() => {
    logInRef.current();
  }, []);

  if (!viewer.didRequest && !error) {
    return (
      <Skeleton />
    )
  }

  return ( 
    <Router>
      {/* Rember to change the line below to === */}
      {viewer.isAdmin === null || viewer.registering === true  ?  
      <Switch>
        <Route exact path = "/login">
          <LogIn setViewer={setViewer}/>
        </Route> 
        <Route exact path = "/pending">
          <Pending />
        </Route> 
        <Route exact path = "/register">
          <Register setViewer={setViewer} viewer={viewer}/>
        </Route> 
        <Route exact path = "/*">
          <NotFound />
        </Route> 
      </Switch> : <Page viewer={viewer} setViewer={setViewer}/> 
      }
    </Router>
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
