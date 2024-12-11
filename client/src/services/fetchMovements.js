import axios from 'axios';

export async function fetchMovements() {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}/api/movements`,
      {
        withCredentials: true
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching movements:", error);
    return [];
  }
}
