export async function fetchMovements(token) {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/movements/movements`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
      if (!response.ok) {
        throw new Error('Error al obtener los movimientos');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error al obtener los movimientos:", error);
      return [];
    }
  }
