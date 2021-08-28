import { Viewer } from "../../../../../../lib"
import { TeamOutlined } from "@ant-design/icons";
interface Props {
    viewer: Viewer;
    maxOrgState: boolean;
    setMaxOrgState: any;
    max: any;
    min: any;
}
export const MaxOrgCard = ({ viewer, setMaxOrgState, maxOrgState, max, min } : Props) => {
    return <>
        { viewer.isAdmin && 
            <div onClick={() => setMaxOrgState((val : boolean) => !val)}
                className="stats-card__2nd_type"
                style={{
                    backgroundColor: "#dadcf8",
                    color: "#4650dd"
                }}
            >
                <div>
                    <div>
                        <h3
                            style={{
                                color: "#4650dd"
                            }}
                        >
                            {maxOrgState ? max : min}
                        </h3>
                        <h5>
                            {`Đơn vị có số hội viên ${maxOrgState ? "đông" : "ít"} nhất`}
                        </h5>
                    </div>
                    <TeamOutlined 
                        style={{
                            fontSize: "150%"
                        }}
                    />
                </div>
            </div>
        }
    </>
}