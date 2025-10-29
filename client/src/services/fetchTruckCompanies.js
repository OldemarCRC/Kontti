import axios from 'axios';

const fetchTruckCompanies = async () => {
    try {
        const response = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/truck-companies`,
            {
                withCredentials: true
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error fetching truck companies: ", error);
        throw error;
    }
}; export default fetchTruckCompanies;