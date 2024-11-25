
export async function fetchDispatchOrders(token) {
  try {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/dispatchOrder/dispatchOrders`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) {
      throw new Error('Error fetching dispatch orders');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching dispatch orders:", error);
    return [];
  }
}


export const fetchDispatchOrdersByCustomer = async (customer) => {
  const response = await fetch(`${process.env.REACT_APP_API_URL}/dispatchOrder/dispatchOrders/customer/${customer}`);
  if (!response.ok) throw new Error('Error al obtener los despachos');
  return await response.json();
};
