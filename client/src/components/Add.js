import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';

import AddMovie from "./AddMovie";
import AddActor from "./AddActor";

// eslint-disable-next-line
import {authenticateUser} from "../functions/AuthenticateUser";
// eslint-disable-next-line
import {useEffect, useState} from "react";

const Add = () => {

    return (
        <>
            <Tabs>
                <Tab eventKey="addMovie" title="Movie">
                    <AddMovie/>
                </Tab>
                <Tab eventKey="addActor" title="Actor">
                    <AddActor/>
                </Tab>
            </Tabs>
        </>
    );
}

export default Add;