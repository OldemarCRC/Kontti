export const uploadDataToMongoDB = async (dataToSend, collection) => {
  try {
    console.log(dataToSend);
    const response = await fetch(`${process.env.REACT_APP_API_URL}/${collection}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dataToSend),
    });

    if (response.ok) {
      const result = await response.json();
      return result;
    } else {
      const errorResponse = await response.json();
      const errorMessage = errorResponse.message || 'Error desconocido al cargar los datos';
      throw new Error(errorMessage);
    }
  } catch (error) {
    console.error(error.message);
    throw new Error(error.message);
  }
};



// Función para actualizar la localización del contenedor en el inventario
export const updateContainerLocation = async (dataToSend) => {
  try {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/inventory/location`, {
      method: 'PATCH', // Cambia el método a PATCH para indicar una actualización parcial
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dataToSend),
    });

    if (response.ok) {
      const result = await response.json();
      console.log(`Localización actualizada con éxito: ${JSON.stringify(result)}`);
      return result;
    } else {
      const errorResponse = await response.json();
      const errorMessage = errorResponse.message || 'Error desconocido al actualizar la localización';
      throw new Error(errorMessage);
    }
  } catch (error) {
    console.error(error.message);
    throw new Error(error.message);
  }
};
