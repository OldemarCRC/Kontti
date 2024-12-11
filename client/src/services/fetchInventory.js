import axios from 'axios';

export async function fetchInventory() {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}/api/inventory`,
      {
        withCredentials: true
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching inventory:", error);
    return [];
  }
}

export async function fetchContainers() {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}/api/inventory/containers`,
      {
        withCredentials: true
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching containers:", error);
    return [];
  }
}
