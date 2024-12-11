import { toast } from 'react-toastify';
import axios from 'axios';

export const updateDispatchOrderStatus = async (orderNumber, status) => {
  try {
    const response = await axios.patch(
      `${process.env.REACT_APP_API_URL}/api/dispatchOrder/updateStatus`,
      {
        orderNumber,
        status,
      },
      {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );

    toast.success('Dispatch updated successfully!');
    return true;
  } catch (error) {
    console.error('Error updating dispatch status:', error);

    // Check if the error response contains a specific message
    const errorMessage = error.response?.data?.message || 'Error updating dispatch status';
    toast.error(errorMessage);

    return false;
  }
};