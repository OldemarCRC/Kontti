import { toast } from 'react-toastify';

export const updateDispatchOrderStatus = async (orderNumber, status) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/dispatchOrder/updateStatus`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderNumber,
          status,
        }),
      });
  
      if (response.ok) {
        toast.success('¡Despacho actualizado correctamente!');
        return true;
      } else {
        const errorResponse = await response.json();
        const errorMessage = errorResponse.message || 'Error desconocido al actualizar el despacho';
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error('Error al actualizar el estado del despacho:', error);
      toast.error('Error al actualizar el despacho');
      return false;
    }
  };

