import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, ActivityIndicator, Dimensions, TouchableOpacity, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { fetchProductListing } from '../services/productService';
import { styled } from "nativewind/styled";

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledImage = styled(Image);
const StyledAnimatedView = styled(Animated.View);
const StyledSafeAreaView = styled(SafeAreaView);

const HEADER_MAX_HEIGHT = 120;
const HEADER_MIN_HEIGHT = 44;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

const ProductListingScreen = ({ route }) => {
  const { categoryId, categoryName } = route.params;
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigation = useNavigation();
  const scrollY = new Animated.Value(0);

  const headerHeight = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
    extrapolate: 'clamp',
  });

  const headerTitleOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE / 2],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const bigTitleOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE / 2],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  useEffect(() => {
    loadProducts();
  }, [categoryId]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchProductListing(categoryId);
      setProducts(data.elements || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const renderPrice = (calculatedPrice) => {
    if (!calculatedPrice) return null;
    
    const hasDiscount = calculatedPrice.listPrice && calculatedPrice.listPrice.price > calculatedPrice.unitPrice;
    
    return (
      <StyledView className="flex-row items-center flex-wrap gap-2">
        <StyledText className="text-base font-semibold text-primary">
          €{calculatedPrice.unitPrice.toFixed(2)}
        </StyledText>
        {hasDiscount && (
          <StyledText className="text-sm text-secondary line-through">
            €{calculatedPrice.listPrice.price.toFixed(2)}
          </StyledText>
        )}
      </StyledView>
    );
  };

  const renderDiscountLabel = (calculatedPrice, hasStaffelPreise) => {
    if (hasStaffelPreise || !calculatedPrice?.listPrice?.percentage) return null;
    
    return (
      <StyledView className="bg-error px-2 py-1 rounded-md">
        <StyledText className="text-xs text-white font-semibold">
          -{calculatedPrice.listPrice.percentage}%
        </StyledText>
      </StyledView>
    );
  };

  const renderStaffelPreise = (calculatedPrices) => {
    if (!calculatedPrices || calculatedPrices.length <= 1) return null;

    return (
      <StyledView className="w-full px-1 mb-3">
        {calculatedPrices.map((price, index) => {
          const from = price.extensions?.maxiaListingBlockPrices?.from;
          const to = price.extensions?.maxiaListingBlockPrices?.to;
          
          return (
            <StyledView key={index} className="flex-row justify-between items-center mb-1">
              <StyledText className="text-sm text-secondary">
                Ab {from}
              </StyledText>
              <StyledView className="flex-row items-center gap-2">
                <StyledText className="text-sm font-semibold text-primary">€{price.unitPrice.toFixed(2)}</StyledText>
                {price.listPrice && (
                  <StyledText className="text-sm text-secondary line-through">€{price.listPrice.price.toFixed(2)}</StyledText>
                )}
              </StyledView>
            </StyledView>
          );
        })}
      </StyledView>
    );
  };

  const renderProduct = ({ item }) => {
    const hasStaffelPreise = item.calculatedPrices && item.calculatedPrices.length > 1;
    const imageSize = Dimensions.get('window').width - 32;
    
    return (
      <StyledView className="bg-white mx-4 mb-4 rounded-xl overflow-hidden shadow">
        <StyledView className="p-0 items-center">
          {item.isNew && (
            <StyledView className="absolute top-4 left-4 bg-success px-3 py-1.5 rounded-md z-10">
              <StyledText className="text-white text-xs font-semibold tracking-wide">New</StyledText>
            </StyledView>
          )}
          <StyledView className="bg-white mb-3" style={{ width: imageSize, aspectRatio: 1 }}>
            {item.cover?.media?.url && (
              <StyledImage
                source={{ uri: item.cover.media.url }}
                className="w-full h-full"
                resizeMode="contain"
              />
            )}
          </StyledView>
          <StyledText className="text-sm font-normal text-primary text-left self-start px-1 mb-2" numberOfLines={2}>
            {item.translated.name}
          </StyledText>
          {hasStaffelPreise ? (
            <StyledView className="w-full px-1 mb-3">
              {item.calculatedPrices.map((price, index) => {
                const from = price.extensions?.maxiaListingBlockPrices?.from || 1;
                return (
                  <StyledView key={index} className="flex-row justify-between items-center mb-1">
                    <StyledText className="text-sm text-secondary">From {from}</StyledText>
                    <StyledView className="flex-row items-center gap-2">
                      <StyledText className="text-sm font-semibold text-primary">€{price.unitPrice.toFixed(2)}</StyledText>
                      {price.listPrice && (
                        <StyledText className="text-sm text-secondary line-through">€{price.listPrice.price.toFixed(2)}</StyledText>
                      )}
                    </StyledView>
                  </StyledView>
                );
              })}
            </StyledView>
          ) : (
            <StyledView className="self-start px-1 mb-3">
              {renderPrice(item.calculatedPrices?.[0])}
            </StyledView>
          )}
        </StyledView>
      </StyledView>
    );
  };

  const renderHeader = () => (
    <StyledAnimatedView className="bg-white border-b border-divider z-10 overflow-hidden" style={{ height: headerHeight }}>
      <StyledView className="flex-row items-center h-11">
        <StyledTouchableOpacity className="w-11 h-11 justify-center items-center" onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </StyledTouchableOpacity>
        <Animated.Text className="flex-1 text-center text-[15px] font-normal mx-2" style={{ opacity: headerTitleOpacity }} numberOfLines={1}>
          {categoryName}
        </Animated.Text>
        <StyledView className="w-11 h-11" />
      </StyledView>
      <StyledAnimatedView className="px-4 h-9 justify-center" style={{ opacity: bigTitleOpacity }}>
        <StyledText className="text-2xl font-normal tracking-tight" numberOfLines={1}>{categoryName}</StyledText>
      </StyledAnimatedView>
      <StyledView className="h-[1px] bg-divider mx-4 -mb-1" />
      <StyledAnimatedView className="flex-row items-center h-10 px-4" style={{ opacity: bigTitleOpacity }}>
        <StyledView className="flex-1 h-full justify-center">
          <StyledText className="text-xs text-secondary" numberOfLines={1}>{products.length} Ergebnisse</StyledText>
        </StyledView>
        <StyledView className="w-[1px] h-4 bg-divider mx-3" />
        <StyledTouchableOpacity className="w-11 h-11 justify-center items-center">
          <Ionicons name="options-outline" size={20} color="#666" />
        </StyledTouchableOpacity>
      </StyledAnimatedView>
    </StyledAnimatedView>
  );

  if (loading) {
    return (
      <StyledSafeAreaView className="flex-1 bg-white">
        {renderHeader()}
        <StyledView className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#000" />
        </StyledView>
      </StyledSafeAreaView>
    );
  }

  if (error) {
    return (
      <StyledSafeAreaView className="flex-1 bg-white">
        {renderHeader()}
        <StyledView className="flex-1 justify-center items-center p-5">
          <StyledText className="text-error text-base text-center">{error}</StyledText>
        </StyledView>
      </StyledSafeAreaView>
    );
  }

  return (
    <StyledSafeAreaView className="flex-1 bg-white">
      {renderHeader()}
      <FlatList
        data={products}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id}
        className="p-2.5"
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      />
    </StyledSafeAreaView>
  );
};

export default ProductListingScreen; 