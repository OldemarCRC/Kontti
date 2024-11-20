export async function fetchInventory(token) {
  try {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/inventory`, {
      headers: {
          'Authorization': `Bearer ${token}`
      }
  });
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

export async function fetchContainers(token) {
  try {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/inventory/containers`, {
      headers: {
          'Authorization': `Bearer ${token}`
      }
  });
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
