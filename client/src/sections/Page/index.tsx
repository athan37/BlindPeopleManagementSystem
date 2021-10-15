import { MembersTable, CreateUser, Profile, Statistics, EditOrganization } from "./components"
import { Switch, Route } from "react-router";
import { Link } from "react-router-dom";
import { SideBar } from "../SideBar";
import { AppHeader } from "../AppHeader";
import { NotFound } from "../NotFound";
import { NotificationsBox } from "../NotificationsBox";
import { Viewer } from "../../lib";
import { bgColor } from "../../lib/bgColor";
import { useEffect, useState } from "react";
import { EnumFields, FormItems, useWindowDimensions } from "./utils";
import { LoadMessages as LoadMessagesData, LoadMessagesVariables } from "../../lib/graphql/queries/Messages/__generated__/LoadMessages";
import { QUERY_MESSAGES } from "../../lib/graphql/queries/Messages";
import { useLazyQuery, useQuery } from "@apollo/client";
import { displayErrorMessage } from "../../lib/utils";
import { CascaderValueType } from "antd/lib/cascader";
import { CSVLink } from "react-csv";
import { Members as MembersData, MembersVariables } from "../../lib/graphql/queries/Members/__generated__/Members";
import { Organization as OrganizationData, OrganizationVariables } from "../../lib/graphql/queries/Organization/__generated__/Organization";
import { MEMBERS, QUERY_ORGANIZATION } from "../../lib/graphql/queries";
import { cleanExcelData as cleanData} from "./utils";

interface Props {
  viewer: Viewer;
  setViewer: (viewer: Viewer) => void;
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}

export const Page = ({ viewer, setViewer, isOpen, setIsOpen } : Props) => {
    const [displayNotification, setDisplayNotification] = useState<boolean>(false);
    const [ totalMessages, setTotalMessages] = useState<number>(0);
    const [ footerCollapse, setFooterCollapse ] = useState<boolean>(true);
    const [filterState, setFilterState] = useState<CascaderValueType | undefined>();
    const [searchState, setSearchState] = useState<string>();
    const [searchData,  setSearchData]  = useState<any>({ keyword: undefined, filter : undefined, });
    const [organizationId, setOrganziationId ] = useState<string>("");
    const { data: totalMessageData, loading : totalMessageLoading, refetch : totalMessageRefetch } = useQuery<LoadMessagesData, LoadMessagesVariables>(
        QUERY_MESSAGES, { 
            variables: {
                viewerId: viewer.id || "",
            },
            pollInterval: 1000, //Remmeber to set back to 500
            onCompleted: data => {
                setTotalMessages(data.loadMessages.total)
            },
            onError: err => displayErrorMessage(`Không thể tải tin nhắn ${err}`)
        }, 
    )


    const PAGE_LIMIT = 10000; //Get al people
    const { refetch : refetchAllMembers, data : membersData } = useQuery<MembersData, MembersVariables>(MEMBERS, {
        variables: {
            organizationId: viewer.isAdmin ? organizationId : viewer.organization_id || "qwerjncalsnqwe0324hj3d89", //For not using ""
            limit: PAGE_LIMIT,
            page: 1
        }, 
        fetchPolicy: "cache-and-network",
    });

    const [getOrganization, { data: orgData }] = 
    useLazyQuery<OrganizationData, OrganizationVariables>(
        QUERY_ORGANIZATION, {
            fetchPolicy: "no-cache",
            onError: err => displayErrorMessage(`Không thể tải tên thành viên. Thử lại vào lần sau: ${err}`)
        }, 
    );

    useEffect(() => {
      refetchAllMembers() 
      getOrganization({
        variables: {
          organizationId : viewer.isAdmin ? organizationId : viewer.organization_id ? viewer.organization_id : ""
        }})
    }, [organizationId, refetchAllMembers, getOrganization, viewer])

    //Set header for the excel sheet
    const headers = FormItems.map(formItem =>  {
      return { label: formItem.label, key : formItem.name}
    })

    const { width } = useWindowDimensions();


    useEffect(() => {
      if (totalMessageData) setTotalMessages(totalMessageData.loadMessages.total)
    }, [totalMessageData])
    return (
      <>
        <section 
          className={isOpen ?  width < 1500 ? "container__sider-sm" : "container" :  "container__no-sider" } 
          style={{ backgroundColor: bgColor.container }}
        >
          {isOpen && <SideBar 
            viewer={viewer} 
            setIsOpen={setIsOpen}/>}
          <AppHeader 
            totalMessageLoading={totalMessageLoading}
            isOpen={isOpen}
            totalMessages={totalMessages}
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
                          <CSVLink  
                          className={ width < 700 ? "content__create-user sm" : "content__create-user"}
                          headers={headers}
                          filename={
                            `Thống kê hội người mù${orgData && orgData.organization ? " " + orgData.organization.name + " " : viewer.isAdmin ? ' TP Hà Nội ' : ""}ngày ${new Date().toISOString().slice(0, 10)}.csv`
                          }
                          data={membersData && membersData.members ? cleanData(membersData.members.results) 
                            : []}>Lưu Thống Kê</CSVLink>
                          <Link className={ width < 700 ? "content__create-user sm" : "content__create-user"} to="/createUser">Tạo hội viên</Link>
                          <MembersTable 
                            viewer={viewer} 
                            filterState={filterState}
                            setFilterState={setFilterState}
                            searchState={searchState}
                            setSearchState={setSearchState}
                            searchData={searchData}
                            setSearchData={setSearchData}
                            organizationId={organizationId}
                            setOrganziationId={setOrganziationId}
                          />
                        </div>
                      </Route>
                      <Route exact path = "/user/:organizationId?/:id">
                        <div className="content__members-profile">
                          <Profile viewer={viewer}
                            refetchAllMembers={refetchAllMembers}
                          />
                        </div>
                      </Route>
                      <Route exact path = "/createUser">
                        <div className="content__members-profile">
                          <CreateUser viewer={viewer} refetchAllMembers={refetchAllMembers} />
                        </div>
                      </Route>
                      <Route exact path = "/summary">
                        <div className="content__summary">
                          <Statistics viewer={viewer} />
                        </div>
                      </Route>
                      <Route exact path = "/editOrganization">
                        <div className="content__members-profile">
                          <EditOrganization  viewer={viewer} />
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
        <footer className={footerCollapse ? "closed" : "openned" }>
          {footerCollapse ? 
            <div 
              onClick={() => setFooterCollapse(value => !value)}
              className="footer-container"
              >
                  <div className="footer__org-name long">
                    <h3>HỘI NGƯỜI MÙ THÀNH PHỐ HÀ NỘI</h3>
                    <h3>Copyright © 2021</h3>
                  </div>
            </div> : 
            <div 
              onClick={() => setFooterCollapse(value => !value)}
              className="footer-container"
              >
                  <div className="footer__org-name short">
                    <h3>Email</h3>
                    <h3>hnmtphanoi@gmail.com</h3>
                  </div>
                  <div className="footer__org-name short">
                      <h3>Điện thoại / Fax</h3>
                    <h3>024-39364422</h3>
                  </div>
                  <div className="footer__org-name short">
                      <h3>Website</h3>
                      <h3>http://www.hnmhanoi.org.vn</h3>
                  </div>
                  <div className="footer__org-name short">
                      <h3>Made by</h3>
                      <h3>Duc Anh</h3>
                  </div>
            </div>
        }
        </footer>
        </section>
        { displayNotification &&  
        <NotificationsBox 
            viewer={viewer}
            setDisplayNotification={setDisplayNotification}
            totalMessageRefetch={totalMessageRefetch}
          />}
        </>
    )

}