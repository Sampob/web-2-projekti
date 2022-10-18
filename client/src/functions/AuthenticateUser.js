import axios from 'axios';

export const authenticateUser = async () => {
    let response;

    try {
        response = await axios.post("http://localhost:5000/authenticateUser",
            JSON.parse(localStorage.getItem('myToken')));
    } catch (e) {
        throw new Error(e.message);
    }

    return {status: response.status, message: response.data};
}