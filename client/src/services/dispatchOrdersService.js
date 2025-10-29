import axios from "axios";

export async function fetchDispatchOrders() {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/dispatchOrder/dispatchOrders`,
      {
        withCredentials: true
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching dispatch orders:", error);
    return [];
  }
}


export const fetchDispatchOrdersByCustomer = async (customer) => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/dispatchOrder/dispatchOrders/customer/${customer}`,
      {
        withCredentials: true
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching dispatch orders by customer:", error);
    return [];
  }
}
