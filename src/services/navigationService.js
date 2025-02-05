import { API_CONFIG } from '../constants/api';

export const fetchNavigationData = async () => {
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}/navigation/main-navigation/main-navigation`, {
      method: 'POST',
      headers: API_CONFIG.HEADERS,
      body: JSON.stringify({
        depth: 2,
        buildTree: true,
        includes: {
          category: [
            "id",
            "name",
            "parent",
            "children",
            "translated"
          ],
          media: ["url"]
        }
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    const processCategory = (category) => {
      if (!category) return null;

      // Verwende den übersetzten Namen, falls vorhanden
      const name = category.translated?.name || category.name;
      if (!name && (!category.children || category.children.length === 0)) {
        return null;
      }

      return {
        id: category.id,
        name: name,
        children: category.children
          ?.map(processCategory)
          .filter(Boolean),
        hasChildren: category.children && category.children.length > 0
      };
    };

    const filterCategories = (categories) => {
      if (!Array.isArray(categories)) return [];
      
      return categories
        .map(processCategory)
        .filter(Boolean);
    };

    if (Array.isArray(data)) {
      return filterCategories(data);
    } else if (data && typeof data === 'object') {
      return filterCategories([data]);
    }

    throw new Error('Ungültiges Datenformat von der API');
  } catch (error) {
    console.error('Navigation fetch error:', error);
    throw error;
  }
}; 