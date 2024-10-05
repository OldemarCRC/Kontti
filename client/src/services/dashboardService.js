// Este es un ejemplo simplificado. En un caso real, aquí harías llamadas a tu API.
export const fetchDashboardData = async () => {
    // Simula una llamada a la API
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      activeUsers: Math.floor(Math.random() * 100),
      failedLogins: Math.floor(Math.random() * 20),
      requestsData: [
        { name: 'GET', value: Math.floor(Math.random() * 1000) },
        { name: 'POST', value: Math.floor(Math.random() * 500) },
        { name: 'PUT', value: Math.floor(Math.random() * 200) },
        { name: 'DELETE', value: Math.floor(Math.random() * 100) },
      ],
    };
  };