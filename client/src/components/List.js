import {Tab, Tabs} from "react-bootstrap";
import Movies from "./Movies";
import Actors from "./Actors";


const List = () => {

    return (
        <>
            <Tabs>
                <Tab eventKey="movies" title="Movies">
                    <Movies/>
                </Tab>
                <Tab eventKey="actors" title="Actors">
                    <Actors/>
                </Tab>
            </Tabs>
        </>
    );
}

export default List;