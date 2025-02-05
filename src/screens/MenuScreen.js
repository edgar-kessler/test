import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation as useReactNavigation } from '@react-navigation/native';
import CategoryItem from '../components/CategoryItem';
import { useNavigation } from '../hooks/useNavigation';

const Header = ({ title, onBack, showCategory, category }) => (
  <View style={styles.header}>
    {title && (
      <Animated.View style={styles.subHeader}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Ionicons name="arrow-back" size={24} color="#000" />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.showButton}
          onPress={() => showCategory(category)}
        >
          <Text style={styles.showText}>SHOW {category?.name?.toUpperCase()}</Text>
        </TouchableOpacity>
      </Animated.View>
    )}
  </View>
);

const MenuScreen = () => {
  const [navigationStack, setNavigationStack] = useState([]);
  const [slideAnim] = useState(new Animated.Value(0));
  const [fadeAnim] = useState(new Animated.Value(1));
  const { categories, loading, error } = useNavigation();
  const navigation = useReactNavigation();

  const currentCategory = navigationStack[navigationStack.length - 1];
  const currentCategories = currentCategory ? currentCategory.children : categories;

  // Initial Animation beim Öffnen des Menüs
  useEffect(() => {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 0,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const navigateToProductListing = (category) => {
    navigation.navigate('ProductListing', {
      categoryId: category.id,
      categoryName: category.name
    });
  };

  const handlePress = (category) => {
    if (category.hasChildren) {
      // Verbesserte Animation beim Öffnen einer Kategorie
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: -30,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setNavigationStack([...navigationStack, category]);
        slideAnim.setValue(30);
        Animated.parallel([
          Animated.timing(slideAnim, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }),
        ]).start();
      });
    } else {
      navigateToProductListing(category);
    }
  };

  const handleBack = () => {
    // Verbesserte Animation beim Zurückgehen
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 30,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setNavigationStack(navigationStack.slice(0, -1));
      slideAnim.setValue(-30);
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    });
  };

  const handleShowCategory = (category) => {
    if (category) {
      navigateToProductListing(category);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Header />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#000" />
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Header />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Header
          title={currentCategory?.name}
          onBack={handleBack}
          showCategory={handleShowCategory}
          category={currentCategory}
        />
        <Animated.ScrollView 
          style={[
            styles.scrollView,
            { 
              transform: [{ translateX: slideAnim }],
              opacity: fadeAnim
            }
          ]}
          showsVerticalScrollIndicator={false}
        >
          {currentCategories?.map((category) => (
            <CategoryItem
              key={category.id}
              item={category}
              onPress={handlePress}
            />
          ))}
        </Animated.ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: '#fff',
  },
  subHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backText: {
    marginLeft: 8,
    fontSize: 15,
    color: '#000',
    fontWeight: '500',
  },
  showButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#f8f8f8',
    borderRadius: 6,
  },
  showText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#000',
    letterSpacing: 0.5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: '#ff3b30',
    fontSize: 16,
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
});

export default MenuScreen; 