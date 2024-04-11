export const uploadDataToMongoDB = async (dataToSend) => {
  try {
    console.log(dataToSend);
    const response = await fetch(`${process.env.REACT_APP_API_URL}/movements`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dataToSend),
    });

    if (response.ok) {
      const result = await response.json();
      console.log(`Datos cargados con éxito: ${JSON.stringify(result)}`); // Usar console.log para éxito
      return result;
    } else {
      const errorResponse = await response.json(); // Intenta parsear la respuesta como JSON
      const errorMessage = errorResponse.message || 'Error desconocido al cargar los datos';
      throw new Error(errorMessage); // Usa el mensaje de error del backend o un mensaje por defecto
    }
  } catch (error) {
    console.error(error.message); // Usar console.error para capturar errores
    throw new Error(error.message); // Relanzar el error con el mensaje específico para que pueda ser capturado por el llamador
  }
};



// Función para actualizar la localización del contenedor en el inventario
export const updateContainerLocation = async (dataToSend) => {
  try {
    const response = await fetch('REACT_APP_API_URL/inventory/location', {
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
