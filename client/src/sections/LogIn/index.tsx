import { Card, Layout, Typography } from "antd";
import logo from "./assets/google.svg";
import { Viewer } from "../../lib";
import { useApolloClient, useMutation } from "@apollo/client";
import { AUTH_URL } from "../../lib/graphql/queries"
import { AuthUrl as AuthUrlData} from "../../lib/graphql/queries/AuthUrl/__generated__/AuthUrl"
import { LOG_IN } from "../../lib/graphql/mutations";
import { LogIn as LogInData, LogInVariables } from "../../lib/graphql/mutations/LogIn/__generated__/LogIn";
import { useEffect } from "react";
import { useRef } from "react";
import { Redirect } from "react-router";
import { Loading } from "./components";
import { displayErrorMessage } from "../../lib/utils";
import logoNHM from "./assets/logoHNM.jpg";

const { Content } = Layout;
const { Paragraph } = Typography;

interface Props {
    setViewer: (viewer: Viewer) => void;
}
export const LogIn = ({ setViewer } : Props) => {
    const client = useApolloClient();

    const [
        logIn, 
        {
            data: logInData, loading: logInLoading, error: logInError
        }
    ] = useMutation<LogInData, LogInVariables>(LOG_IN, { 
        onCompleted: data => {
            if (data && data.logIn) {
                setViewer(data.logIn);
            }
        }
    });

    console.log()
    const logInRef = useRef(logIn);

    useEffect(() => {
        const code = new URL(window.location.href).searchParams.get("code");
        if(code) {
            logInRef.current({
                variables: {
                    input: { code }
                }
            })
        }
    }, [])

    if (logInLoading) {
        return <Loading />
    }

    if (logInError) {
        displayErrorMessage(`Không thể login ${logInError}`);
    }

    if (logInData && logInData.logIn) {
        if (logInData.logIn.registering && logInData.logIn.registering === true) {
            return <Redirect to={"/pending"} />
        }
        else if (logInData.logIn.isAdmin === null) {
            return <Redirect to={"/register"} />
        } else {
            return <Redirect to={`/summary`} />;
        }

    }

    const handleAuthorize = async () => {
        try {
            const { data } = await client.query<AuthUrlData>({
                query: AUTH_URL,
            });

            window.location.href = data.authUrl;
        } catch (err) {
            throw new Error("Cannot get authorize link from google");
        }
    }

    return (
        <Content className="log-in__content">
            <img 
                className="log-in__big-img"
                src={logoNHM} alt="logo hoi nguoi mu"/>
            <Card 
                style={{
                    border: "none"
                }}
                headStyle={{
                    border: "none",
                    fontWeight: "bold",
                    fontSize: "1.2rem"
                }}
                    className="log-in__card" 
                    title="Quản lý thành viên - Hội người mù thành phố Hà Nội" 
                >
                <Paragraph 
                title="Hướng dẫn">
                    Sử dụng Google để login. Bạn sẽ 
                    được đưa đến trang đăng ký tài khoản để được cấp quyền quản lý
                </Paragraph>
                <button onClick={handleAuthorize} className="login-button__google">
                    <img 
                        style={{
                            marginRight: 10
                        }}
                    src={logo} alt="Google icon"></img>
                    <span className="login-button__google-text">Đăng nhập bằng google</span>
                </button>
            </Card>
        </Content>
    )
}