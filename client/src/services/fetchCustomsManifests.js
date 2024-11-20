import axios from 'axios';

const fetchCustomsManifests = async (token) => {
    try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/customs-manifest`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error cargando los números de manifiesto: ", error);
        throw error;
    }
}; export default fetchCustomsManifests;