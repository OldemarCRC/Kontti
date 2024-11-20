import axios from 'axios';

const fetchTruckCompanies = async (token) => {
    try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/truck-companies`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error cargando los transportistas: ", error);
        throw error;
    }
}; export default fetchTruckCompanies;