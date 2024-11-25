import axios from 'axios';

const fetchManifests = async (token) => {
    try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/manifest`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error loading manifest numbers: ", error);
        throw error;
    }
}; export default fetchManifests;