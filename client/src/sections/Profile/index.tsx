import { useParams } from "react-router";
export const Profile = () => {
    const { id }  = useParams<{id : string}>();
    return ( 
        <h1> {`This is member: ${id}`}</h1>
    )
}