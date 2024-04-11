export async function fetchInventory() {
  try {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/inventory`);
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
  

export async function fetchContainers() {
  try {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/inventory/containers`);
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