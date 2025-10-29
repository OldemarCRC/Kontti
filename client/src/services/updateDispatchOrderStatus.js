import { toast } from 'react-toastify';
import axios from 'axios';

export const updateDispatchOrderStatus = async (orderNumber, status) => {
  try {
    const response = await axios.patch(
      `${process.env.VITE_API_URL}/api/dispatchOrder/updateStatus`,
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

    if (response.status === 200) {
      toast.success('Dispatch updated successfully!');
      return true;
    } else {
      throw new Error('Unexpected response status');
    }
  } catch (error) {
    console.error('Error updating dispatch status:', error);

    const errorMessage = error.response?.data?.message || 'Error updating dispatch status';
    toast.error(errorMessage);

    return false;
  }
};
