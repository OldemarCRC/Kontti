import axios from 'axios';

const fetchCustomers = async () => {
    try {
        const response = await axios.get(
            `${process.env.REACT_APP_API_URL}/api/customers`,
            {
                withCredentials: true
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error fetching the customers: ", error);
        throw error;
    }
}; export default fetchCustomers;