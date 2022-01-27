import { useHistory, useParams} from "react-router-dom";
export default function Yielddetails (){
    let {id} = useParams()
    return(
        <h2>
            yield Details {id}
        </h2>
    )
}