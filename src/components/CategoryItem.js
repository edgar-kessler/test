import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const CategoryItem = ({ item, onPress }) => {
  if (!item?.name) return null;

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress && onPress(item)}
      activeOpacity={0.8}
    >
      <View style={styles.contentContainer}>
        <Text style={styles.text}>{item.name}</Text>
        {item.hasChildren && (
          <Ionicons 
            name="chevron-forward" 
            size={20} 
            color="#000" 
            style={styles.icon}
          />
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 18,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  contentContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  text: {
    fontSize: 15,
    color: '#000',
    fontWeight: '500',
    letterSpacing: 0.3,
    flex: 1,
  },
  icon: {
    marginLeft: 12,
    opacity: 0.7,
  },
});

export default CategoryItem; 