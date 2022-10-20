import React, {useEffect, useState} from 'react';
import {authenticateUser} from "../functions/AuthenticateUser";
import {getUsername} from "../functions/GetUsername";

const Home = () => {
    const [loggedIn, setLoggedIn] = useState(false);

    const handleLoggedIn = () => {
        setLoggedIn(true);
    }

    useEffect(() => {
        authenticateUser().then(() => {
            handleLoggedIn();
        }).catch(() => setLoggedIn(false));
    }, []);

    return (
        <div>
            <h2>HOME PAGE</h2>
            <div hidden={!loggedIn}>
                <h3>Welcome {getUsername()}</h3>
            </div>
        </div>
    )

}

export default Home;