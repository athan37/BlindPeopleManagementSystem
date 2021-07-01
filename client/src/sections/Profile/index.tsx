import { useParams } from "react-router";
export const Member = () => {
    const { id }  = useParams<{id : string}>();
    return ( 
        <h1> {`This is member: ${id}`}</h1>
    )
}