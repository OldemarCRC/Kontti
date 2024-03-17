export async function fetchInventory() {
  try {
    const response = await fetch('http://localhost:8800/api/containers/inventory'); // Asegúrate de que la URL sea correcta
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching inventory:", error);
    return [];
  }
}
  