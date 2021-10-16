import { useLazyQuery, useQuery } from "@apollo/client";
import { useEffect, useRef } from "react";
import { CSVLink } from "react-csv";
import { Viewer } from "../../../../../../lib";
import { MEMBERS, QUERY_ORGANIZATION } from "../../../../../../lib/graphql/queries";
import { Members as MembersData, MembersVariables } from "../../../../../../lib/graphql/queries/Members/__generated__/Members";
import { cleanExcelData, FormItems, useWindowDimensions } from "../../../../utils";
import { Organization as OrganizationData, OrganizationVariables } from "../../../../../../lib/graphql/queries/Organization/__generated__/Organization";
import { displayErrorMessage } from "../../../../../../lib/utils";

interface Props {
  viewer         : Viewer
  filterState    : any
  searchData     : any
  organizationId : string
}

export const DownloadButton = ({ viewer, filterState, searchData, organizationId} : Props) => {
    const { width } = useWindowDimensions();
    //Set header for the excel sheet
    const headers = FormItems.map(formItem =>  {
      return { label: formItem.label, key : formItem.name}
    })

    const PAGE_LIMIT = 10000; //This is differnet than member table, where you download all members
    const { data, refetch } = useQuery<MembersData, MembersVariables>(MEMBERS, {
        variables: {
            organizationId: viewer.organization_id || "",
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

    const fetchRef = useRef(refetch);
    useEffect(() => {
        fetchRef.current({
            //Admin will be viewer.isAdmin && organizationId !== "" ? organizationId , the other side is for not admin
            organizationId: viewer.isAdmin && organizationId !== "" ? organizationId : viewer.organization_id || "",
            limit: PAGE_LIMIT,
            page: 1,
            input: {
                keyword : searchData.keyword,
                filter  : searchData.filter
            }
        })

      getOrganization({
        variables: {
          organizationId : viewer.isAdmin ? organizationId : viewer.organization_id ? viewer.organization_id : ""
        }})
    }, [viewer.organization_id, searchData, viewer.isAdmin, organizationId, filterState, getOrganization]) 

    return (    
      <CSVLink  
          className={ width < 700 ? "content__create-user sm" : "content__create-user"}
          headers={headers}
          filename={
            `Thống kê hội người mù${orgData && orgData.organization ? " " + orgData.organization.name + " " : viewer.isAdmin ? ' TP Hà Nội ' : ""}ngày ${new Date().toISOString().slice(0, 10)}.csv`
          }
          data={data && data.members ? cleanExcelData(data.members.results) : [] }>
            Lưu Thống Kê
        </CSVLink>
    )

}