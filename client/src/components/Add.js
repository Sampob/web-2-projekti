import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';

import AddMovie from "./AddMovie";
import AddActor from "./AddActor";

import {authenticateUser} from "../functions/AuthenticateUser";
// eslint-disable-next-line
import {useEffect, useState} from "react";
import {Button} from "react-bootstrap";

const Add = () => {

    const [loggedIn, setLoggedIn] = useState(false);

    useEffect(() => {
        authenticateUser().then(() => {
            setLoggedIn(true);
        }).catch(() => {
            setLoggedIn(false);
        });
    }, []);

    return (
        <>
            <Tabs>
                <Tab eventKey="addMovie" title="Movie">
                    <AddMovie
                        loggedIn={loggedIn}
                    />
                </Tab>
                <Tab eventKey="addActor" title="Actor">
                    <AddActor
                        loggedIn={loggedIn}
                    />
                </Tab>
            </Tabs>
        </>
    );
}

export default Add;