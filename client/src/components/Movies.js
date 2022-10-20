import {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import axios from "axios";
import {Button, Col, Container, Form, Row, Table} from "react-bootstrap";


const Movies = () => {

    const [movies, setMovies] = useState([]);
    const [search, setSearch] = useState('');
    const [moviePath, setMoviePath] = useState('');

    useEffect(() => {
        axios.get(("http://localhost:5000/getMovies:" + search))
            .then(r => {
                setMovies(r.data);
            })
            .catch(err => {
                console.log(err);
            });
    }, [search])

    const handleSearch = (e) => {
        e.preventDefault();
        setSearch(e.target.value);
    }

    const displayData = movies.map((data) => {
        let description = '';

        if (data.description === '') description = '[No description]';
        else if (data.description.length < 47) description = data.description;
        else description = (data.description.slice(0, 47) + "...");


        return (
            <tr key={data.id}>
                <td><img alt="Movie poster"/></td>
                <td>{data.title}</td>
                <td>{description}</td>
                <td>
                    <Link to={"/movie?title=" + data.title}><Button>View</Button></Link>
                </td>
            </tr>
        )
    });

    return (
        <Container>
            <br/>
            <Row>
                <Col><h3>Movies</h3></Col>

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
                    <th>Poster</th>
                    <th>Title</th>
                    <th>Description</th>
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

export default Movies;