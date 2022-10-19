import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';

import Login from "./Login";
import Register from "./Register";
import User from "./User";
import {authenticateUser} from "../functions/AuthenticateUser";
import {useEffect, useState} from "react";


const UserPage = () => {
    const [loggedIn, setLoggedIn] = useState(false);
    const [activeTab, setActiveTab] = useState('login');

    useEffect(() => {
        authenticateUser().then(() => {
            setLoggedIn(true);
            setActiveTab('user');
        }).catch(() => {
            setLoggedIn(false);
            setActiveTab('login');
        });

    }, []);


    return (
        <Tabs
            activeKey={activeTab}
            onSelect={(k) => setActiveTab(k)}
        >
            <Tab disabled={!loggedIn} eventKey="user" title="User">
                <User/>
            </Tab>
            <Tab disabled={loggedIn} eventKey="login" title="Log In">
                <Login
                    activeTab={activeTab}
                />
            </Tab>
            <Tab disabled={loggedIn} eventKey="register" title="Register">
                <Register
                    activeTab={activeTab}
                    tab={setActiveTab}
                />
            </Tab>
        </Tabs>
    )
}

export default UserPage;