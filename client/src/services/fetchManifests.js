import axios from 'axios';

const fetchManifests = async () => {
    try {
        const response = await axios.get(
            `${process.env.REACT_APP_API_URL}/api/manifest`,
            {
                withCredentials: true
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error fetching manifest numbers: ", error);
        throw error;
    }
}; export default fetchManifests;