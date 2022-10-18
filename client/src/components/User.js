import Button from "react-bootstrap/Button";
import {useNavigate} from "react-router-dom";
import {getUsername} from "../functions/GetUsername";

const User = () => {

    const navigate = useNavigate();

    const logout = () => {
        localStorage.removeItem('myToken');
        navigate('/');
    }

    return(
        <>
            <br/>
            <h3>{getUsername()}</h3>
            <Button onClick={logout} variant="warning">Log out</Button>
        </>
    )
}

export default User;