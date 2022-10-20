import {useEffect, useState} from "react";
import axios from "axios";
import {Button, Col, Container, Form, Row, Table} from "react-bootstrap";
import {Link} from "react-router-dom";

const Actors = () => {

    const [actors, setActors] = useState([]);
    const [search, setSearch] = useState('');

    useEffect(() => {
        axios.get(("http://localhost:5000/getActors:" + search))
            .then(r => {
                setActors(r.data);
            })
            .catch(err => {
                console.log(err);
            });
    }, [search])

    const handleSearch = (e) => {
        e.preventDefault();
        setSearch(e.target.value);
    }

    const displayData = actors.map((data) => {
        return (
            <tr key={data.id}>
                <td>{data.name}</td>
                <td>
                    <Link to={"/actor?name=" + data.name}><Button>View</Button></Link>
                </td>
            </tr>
        )
    })

    return (
        <Container>
            <br/>
            <Row>
                <Col><h3>Actors</h3></Col>

                <Form className="d-flex">
                    <Form.Control
                        type="search"
                        placeholder="Search"
                        className="me-2"
                        aria-label="Search"
                        onChange={handleSearch}
                    />
                </Form>
            </Row>
            <Table striped>
                <thead>
                <tr>
                    <th>Name</th>
                    <th> </th>
                </tr>
                </thead>
                <tbody>
                    {displayData}
                </tbody>
            </Table>
        </Container>
    )
}

export default Actors;