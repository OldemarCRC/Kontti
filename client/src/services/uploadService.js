const uploadDataToMongoDB = async (jsonData) => {
  try {
    const response = await fetch('http://localhost:8800/api/containers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(jsonData),
    });

    if (response.ok) {
      const result = await response.json();
      console.log(`Datos cargados con éxito: ${JSON.stringify(result)}`); // Usar console.log para éxito
      return result;
    } else {
      const errorResponse = await response.text(); // O response.json() si el servidor responde con JSON
      throw new Error(`Error al cargar los datos: ${errorResponse}`);
    }
  } catch (error) {
    console.error('Error al intentar cargar los datos:', error); // Usar console.error para capturar errores
    throw error; // Relanzar el error para que pueda ser capturado por el llamador
  }
};

export default uploadDataToMongoDB;