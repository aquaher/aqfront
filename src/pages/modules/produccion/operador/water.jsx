import { useParams } from "react-router-dom";

export default function Powater(){
    const {water} = useParams();
    return (
        <>
            Agua {water}
        </>
    );
}