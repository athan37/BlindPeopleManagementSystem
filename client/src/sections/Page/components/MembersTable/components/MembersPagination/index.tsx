import { Pagination } from "antd";
interface Props {
    total: number;
    page: number;
    limit: number;
    setPage: (page : number) => void;
}
export const MembersPagination = ({ total, page, limit, setPage}: Props) => {

    return (<Pagination 
        simple
        current={page}
        total  = {total}
        defaultPageSize={limit}
        hideOnSinglePage
        showLessItems
        onChange={(page: number) => setPage(page)}
    />)

}