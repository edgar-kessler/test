import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Image } from 'react-native';

const HeaderNavigation = ({ selectedTab, onTabChange }) => {
  return (
    <View style={styles.container}>
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          onPress={() => onTabChange('DAMEN')}
          style={[styles.tab, selectedTab === 'DAMEN' && styles.selectedTab]}
        >
          <Text style={[styles.tabText, selectedTab === 'DAMEN' && styles.selectedText]}>
            DAMEN
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          onPress={() => onTabChange('HERREN')}
          style={[styles.tab, selectedTab === 'HERREN' && styles.selectedTab]}
        >
          <Text style={[styles.tabText, selectedTab === 'HERREN' && styles.selectedText]}>
            HERREN
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={() => onTabChange('BSK')}
          style={[styles.tab, selectedTab === 'BSK' && styles.selectedTab]}
        >
          <Text style={[styles.tabText, selectedTab === 'BSK' && styles.selectedText]}>
            BSK TEEN
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    paddingTop: 10,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingHorizontal: 16,
  },
  tab: {
    marginRight: 24,
    paddingBottom: 10,
  },
  selectedTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#000',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#999',
  },
  selectedText: {
    color: '#000',
  },
});

export default HeaderNavigation; 