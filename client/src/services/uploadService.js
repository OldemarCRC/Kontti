import axios from 'axios';

export const uploadDataToMongoDB = async (dataToSend, collection) => {
  try {
    const response = await axios.post(
      `${process.env.VITE_API_URL}/api/${collection}`,
      dataToSend,
      {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error(error.message);
    const errorMessage = error.response?.data?.message || 'Error desconocido al cargar los datos';
    throw new Error(errorMessage);
  }
};

export const updateContainerLocation = async (dataToSend) => {
  try {
    const response = await axios.patch(
      `${process.env.VITE_API_URL}/api/inventory/location`,
      dataToSend,
      {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );

    console.log(`Localización actualizada con éxito: ${JSON.stringify(response.data)}`);
    return response.data;
  } catch (error) {
    console.error(error.message);
    const errorMessage = error.response?.data?.message || 'Error desconocido al actualizar la localización';
    throw new Error(errorMessage);
  }
};