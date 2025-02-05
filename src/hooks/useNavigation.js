import { useState, useEffect, useCallback } from 'react';
import { fetchNavigationData } from '../services/navigationService';

export const useNavigation = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchNavigationData();
      setCategories(data);
    } catch (error) {
      setError(error.message);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const handleCategoryPress = useCallback((category) => {
    // Hier können Sie zusätzliche Logik für Kategorie-Klicks implementieren
    console.log('Kategorie ausgewählt:', category);
  }, []);

  return {
    categories,
    loading,
    error,
    reload: loadCategories,
    handleCategoryPress,
  };
}; 