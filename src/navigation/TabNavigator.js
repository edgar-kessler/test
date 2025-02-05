import React, { useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { fetchNavigationData } from '../services/navigationService';

import HomeScreen from '../screens/HomeScreen';
import SearchScreen from '../screens/SearchScreen';
import MenuScreen from '../screens/MenuScreen';
import CartScreen from '../screens/CartScreen';
import AccountScreen from '../screens/AccountScreen';
import ProductListingScreen from '../screens/ProductListingScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const MenuStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MenuMain" component={MenuScreen} />
      <Stack.Screen name="ProductListing" component={ProductListingScreen} />
    </Stack.Navigator>
  );
};

const TabNavigator = () => {
  // Lade die Menüdaten im Hintergrund
  useEffect(() => {
    fetchNavigationData().catch(error => {
      console.error('Background menu loading error:', error);
    });
  }, []);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          switch (route.name) {
            case 'Home':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'Suche':
              iconName = focused ? 'search' : 'search-outline';
              break;
            case 'Menü':
              iconName = focused ? 'menu' : 'menu-outline';
              break;
            case 'Warenkorb':
              iconName = focused ? 'cart' : 'cart-outline';
              break;
            case 'Konto':
              iconName = focused ? 'person' : 'person-outline';
              break;
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#000',
        tabBarInactiveTintColor: '#666',
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderTopColor: '#eee',
        },
        headerStyle: {
          backgroundColor: '#fff',
        },
        headerTitleStyle: {
          color: '#000',
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Suche" component={SearchScreen} />
      <Tab.Screen 
        name="Menü" 
        component={MenuStack}
        options={{ headerShown: false }}
      />
      <Tab.Screen name="Warenkorb" component={CartScreen} />
      <Tab.Screen name="Konto" component={AccountScreen} />
    </Tab.Navigator>
  );
};

export default TabNavigator; 