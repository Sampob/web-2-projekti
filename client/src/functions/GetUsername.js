export const getUsername = () => {
    try {
        return JSON.parse(localStorage.getItem('myToken')).username;
    } catch (e) {

    }
}