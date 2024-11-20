import axios from 'axios';

const fetchCustomers = async (token) => {
    try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/customers`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error cargando los clientes: ", error);
        throw error;
    }
}; export default fetchCustomers;