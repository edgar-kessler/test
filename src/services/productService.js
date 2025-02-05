import { API_CONFIG } from '../constants/api';

export const fetchProductListing = async (categoryId) => {
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}/product-listing/${categoryId}`, {
      method: 'POST',
      headers: {
        ...API_CONFIG.HEADERS,
        'sw-include-seo-urls': 'true'
      },
      body: JSON.stringify({
        page: 1,
        includes: {
          product: [
            "id",
            "name",
            "description",
            "cover",
            "calculatedPrices",
            "calculatedPrice",
            "price",
            "translated",
            "isNew",
            "calculatedPrices",
          ],
          media: ["url"],
        }
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Product listing fetch error:', error);
    throw error;
  }
}; 