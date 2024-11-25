import { toast } from 'react-toastify';

export const updateDispatchOrderStatus = async (token, orderNumber, status ) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/dispatchOrder/updateStatus`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          orderNumber,
          status,
        }),
      });
  
      if (response.ok) {
        toast.success('Dispatch updated successfully!');
        return true;
      } else {
        const errorResponse = await response.json();
        const errorMessage = errorResponse.message || 'Unknown error updating dispatch';
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error('Error updating dispatch status:', error);
      toast.error('Error updating dispatch status');
      return false;
    }
  };

