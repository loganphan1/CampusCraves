import React, { useState, useRef, useEffect } from "react";
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, Image, Animated, Easing, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, router } from "expo-router";

const restaurantLogoMap: Record<string, any> = {
  "The Halal Shack": require("../../assets/images/HalalShack.png"),
  "Panda Express": require("../../assets/images/PandaExpress.png"),
  "Broken Yolk Cafe": require("../../assets/images/BroYo.png"),
  "Subway": require("../../assets/images/Subway.png"),
  "Eureka!": require("../../assets/images/eureka-logo.png"),
  "Big City Bagel Cafe": require("../../assets/images/bcb-logo.webp"),
  "Oggi's Pizza": require("../../assets/images/oggis-logo.png"),
  "The Habit Burger & Grill": require("../../assets/images/Habit-logo.png"),
  "Everbowl": require("../../assets/images/everbowl-logo.png"),
  "Rubio's Coastal Grill": require("../../assets/images/rubios-logo.png"),
  "Shake Smart": require("../../assets/images/shakessmart-logo.png"),
  "Sushi One n Half": require("../../assets/images/onenhalf-logo.png"),
  "Which Wich": require("../../assets/images/which-wich.svg"),
};

function getRestaurantLogo(restaurantName: string): any {
  if (restaurantLogoMap[restaurantName]) {
    return restaurantLogoMap[restaurantName];
  }
  
  const normalized = restaurantName.replace(/['']/g, "'");
  if (restaurantLogoMap[normalized]) {
    return restaurantLogoMap[normalized];
  }
  
  const withCurly = restaurantName.replace(/'/g, "'");
  if (restaurantLogoMap[withCurly]) {
    return restaurantLogoMap[withCurly];
  }
  
  return require("../../assets/images/oggis-logo.png");
}

const bcbData = require("../../lib/db/bcb.json");
const brokenYolkData = require("../../lib/db/broken_yolk.json");
const eurekaData = require("../../lib/db/eureka.json");
const everbowlData = require("../../lib/db/everbowl.json");
const habitData = require("../../lib/db/habit.json");
const halalshackData = require("../../lib/db/halalshack.json");
const oggisData = require("../../lib/db/oggis.json");
const pandaData = require("../../lib/db/panda.json");
const rubiosData = require("../../lib/db/rubios.json");
const shakesmartData = require("../../lib/db/shakesmart.json");
const subwayData = require("../../lib/db/subway.json");
const sushionehalfData = require("../../lib/db/sushionehalf.json");
const whichwichData = require("../../lib/db/whichwich.json");

interface MealItem {
  id: number;
  text: string;
  meal: string;
  price: number;
  logo: any;
  protein: number;
  calories: number;
  fat: number;
}

function processMealData(): MealItem[] {
  const allData = [
    bcbData,
    brokenYolkData,
    eurekaData,
    everbowlData,
    habitData,
    halalshackData,
    oggisData,
    pandaData,
    rubiosData,
    shakesmartData,
    subwayData,
    sushionehalfData,
    whichwichData,
  ];

  const mealsByRestaurant: Record<string, MealItem[]> = {};
  let idCounter = 1;

  allData.forEach((restaurantData) => {
    const restaurantName = restaurantData.restaurant;
    const logo = getRestaurantLogo(restaurantName);
    const restaurantMeals: MealItem[] = [];

    restaurantData.items.forEach((item: any) => {
      let calories = 0;
      if (item.calories_kcal !== undefined) {
        calories = item.calories_kcal;
      } else if (item.calories_kcal_low !== undefined && item.calories_kcal_high !== undefined) {
        calories = Math.round((item.calories_kcal_low + item.calories_kcal_high) / 2);
      }

      let protein = 0;
      if (item.protein_g !== undefined) {
        protein = item.protein_g;
      } else if (item.protein_g_est !== undefined) {
        protein = item.protein_g_est;
      }

      let fat = 0;
      if (item.fat_g !== undefined) {
        fat = item.fat_g;
      } else if (item.fat_g_est !== undefined) {
        fat = item.fat_g_est;
      }

      restaurantMeals.push({
        id: idCounter++,
        text: restaurantName,
        meal: item.name,
        price: item.price || 0,
        logo: logo,
        protein: protein,
        calories: calories,
        fat: fat,
      });
    });

    mealsByRestaurant[restaurantName] = restaurantMeals;
  });

  const oneMealPerRestaurant: MealItem[] = [];
  Object.keys(mealsByRestaurant).forEach((restaurantName) => {
    const meals = mealsByRestaurant[restaurantName];
    if (meals.length > 0) {
      const randomMeal = meals[Math.floor(Math.random() * meals.length)];
      oneMealPerRestaurant.push(randomMeal);
    }
  });

  const randomized = oneMealPerRestaurant.sort(() => Math.random() - 0.5);
  
  return randomized.slice(0, 6);
}

function sortMeals(meals: MealItem[], sortBy: 'calories' | 'protein' | 'fat', descending: boolean = true): MealItem[] {
  return [...meals].sort((a, b) => {
    const multiplier = descending ? -1 : 1;
    let primaryValue: number;
    let secondaryValue: number;
    let tertiaryValue: number;
    
    if (sortBy === 'calories') {
      primaryValue = (b.calories - a.calories) * multiplier;
      secondaryValue = (b.protein - a.protein) * multiplier;
      tertiaryValue = (b.fat - a.fat) * multiplier;
    } else if (sortBy === 'protein') {
      primaryValue = (b.protein - a.protein) * multiplier;
      secondaryValue = (b.calories - a.calories) * multiplier;
      tertiaryValue = (b.fat - a.fat) * multiplier;
    } else {
      primaryValue = (b.fat - a.fat) * multiplier;
      secondaryValue = (b.calories - a.calories) * multiplier;
      tertiaryValue = (b.protein - a.protein) * multiplier;
    }
    
    if (primaryValue !== 0) return primaryValue;
    if (secondaryValue !== 0) return secondaryValue;
    return tertiaryValue;
  });
}

export default function Explore() {
  const params = useLocalSearchParams();
  
  const [isLoading, setIsLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [boxesOrder, setBoxesOrder] = useState<MealItem[]>([]);
  const [sortBy, setSortBy] = useState<'calories' | 'protein' | 'fat'>('calories');
  const [sortDescending, setSortDescending] = useState(false);
  const [expandedRestaurants, setExpandedRestaurants] = useState<Set<string>>(new Set());
  const [allMealsByRestaurant, setAllMealsByRestaurant] = useState<Record<string, MealItem[]>>({});

  const spinAnim = useRef(new Animated.Value(0)).current;

  const initialBalance = params.balance && params.balance !== '' ? parseFloat(params.balance as string) : null;
  const initialCalories = params.calories && params.calories !== '' ? parseFloat(params.calories as string) : null;
  const initialProtein = params.protein && params.protein !== '' ? parseFloat(params.protein as string) : null;
  const initialFat = params.fat && params.fat !== '' ? parseFloat(params.fat as string) : null;

  const defaultAnimValue = useRef(new Animated.Value(1)).current;
  const animValues = useRef<Record<number, Animated.Value>>({});

  useEffect(() => {
    const allData = [
      bcbData,
      brokenYolkData,
      eurekaData,
      everbowlData,
      habitData,
      halalshackData,
      oggisData,
      pandaData,
      rubiosData,
      shakesmartData,
      subwayData,
      sushionehalfData,
      whichwichData,
    ];

    const mealsByRestaurant: Record<string, MealItem[]> = {};
    let idCounter = 1;

    allData.forEach((restaurantData) => {
      const restaurantName = restaurantData.restaurant;
      const logo = getRestaurantLogo(restaurantName);
      const restaurantMeals: MealItem[] = [];

      restaurantData.items.forEach((item: any) => {
        let calories = 0;
        if (item.calories_kcal !== undefined) {
          calories = item.calories_kcal;
        } else if (item.calories_kcal_low !== undefined && item.calories_kcal_high !== undefined) {
          calories = Math.round((item.calories_kcal_low + item.calories_kcal_high) / 2);
        }

        let protein = 0;
        if (item.protein_g !== undefined) {
          protein = item.protein_g;
        } else if (item.protein_g_est !== undefined) {
          protein = item.protein_g_est;
        }

        let fat = 0;
        if (item.fat_g !== undefined) {
          fat = item.fat_g;
        } else if (item.fat_g_est !== undefined) {
          fat = item.fat_g_est;
        }

        restaurantMeals.push({
          id: idCounter++,
          text: restaurantName,
          meal: item.name,
          price: item.price || 0,
          logo: logo,
          protein: protein,
          calories: calories,
          fat: fat,
        });
      });

      mealsByRestaurant[restaurantName] = restaurantMeals;
    });

    setAllMealsByRestaurant(mealsByRestaurant);

    const oneMealPerRestaurant: MealItem[] = [];
    Object.keys(mealsByRestaurant).forEach((restaurantName) => {
      const meals = mealsByRestaurant[restaurantName];
      if (meals.length > 0) {
        const randomMeal = meals[Math.floor(Math.random() * meals.length)];
        oneMealPerRestaurant.push(randomMeal);
      }
    });

    const randomized = oneMealPerRestaurant.sort(() => Math.random() - 0.5);
    const sortedMeals = sortMeals(randomized, sortBy, sortDescending);
    setBoxesOrder(sortedMeals);

    Object.values(mealsByRestaurant).flat().forEach((meal) => {
      if (!animValues.current[meal.id]) {
        animValues.current[meal.id] = new Animated.Value(1);
      }
    });

    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const toggleItem = (id: number) => {
    if (!animValues.current[id]) {
      animValues.current[id] = new Animated.Value(1);
    }
    
    Animated.sequence([
      Animated.timing(animValues.current[id], { toValue: 1.4, duration: 150, useNativeDriver: true }),
      Animated.timing(animValues.current[id], { toValue: 1, duration: 150, useNativeDriver: true }),
    ]).start();

    setSelectedItems(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const shuffleBoxes = () => {
    spinAnim.setValue(0);
    Animated.timing(spinAnim, {
      toValue: 1,
      duration: 1000,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start();

    const meals = processMealData();
    const sortedMeals = sortMeals(meals, sortBy, sortDescending);
    setBoxesOrder(sortedMeals);
    setSelectedItems([]);
    
    const newAnimValues: Record<number, Animated.Value> = {};
    sortedMeals.forEach((meal) => {
      newAnimValues[meal.id] = new Animated.Value(1);
    });
    Object.assign(animValues.current, newAnimValues);
  };

  const toggleSort = () => {
    let newSortBy: 'calories' | 'protein' | 'fat';
    let newSortDescending: boolean;
    
    if (sortBy === 'calories') {
      if (sortDescending) {
        newSortBy = 'protein';
        newSortDescending = false;
      } else {
        newSortBy = 'calories';
        newSortDescending = true;
      }
    } else if (sortBy === 'protein') {
      if (sortDescending) {
        newSortBy = 'fat';
        newSortDescending = false;
      } else {
        newSortBy = 'protein';
        newSortDescending = true;
      }
    } else {
      if (sortDescending) {
        newSortBy = 'calories';
        newSortDescending = false;
      } else {
        newSortBy = 'fat';
        newSortDescending = true;
      }
    }
    
    setSortBy(newSortBy);
    setSortDescending(newSortDescending);
    
    const sortedMeals = sortMeals(boxesOrder, newSortBy, newSortDescending);
    setBoxesOrder(sortedMeals);
  };

  const toggleRestaurant = (restaurantName: string) => {
    setExpandedRestaurants(prev => {
      const newSet = new Set(prev);
      if (newSet.has(restaurantName)) {
        newSet.delete(restaurantName);
      } else {
        newSet.add(restaurantName);
      }
      return newSet;
    });
  };

  const spin = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const findMealById = (id: number): MealItem | undefined => {
    for (const meals of Object.values(allMealsByRestaurant)) {
      const meal = meals.find(m => m.id === id);
      if (meal) return meal;
    }
    return undefined;
  };

  const remainingBalance = initialBalance !== null 
    ? selectedItems.reduce((acc, id) => {
        const meal = findMealById(id);
        return acc - (meal?.price || 0);
      }, initialBalance)
    : null;

  const remainingCalories = initialCalories !== null
    ? selectedItems.reduce((acc, id) => {
        const meal = findMealById(id);
        return acc - (meal?.calories || 0);
      }, initialCalories)
    : null;

  const remainingProtein = initialProtein !== null
    ? selectedItems.reduce((acc, id) => {
        const meal = findMealById(id);
        return acc - (meal?.protein || 0);
      }, initialProtein)
    : null;

  const remainingFat = initialFat !== null
    ? selectedItems.reduce((acc, id) => {
        const meal = findMealById(id);
        return acc - (meal?.fat || 0);
      }, initialFat)
    : null;

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FFFFFF" />
        <Text style={styles.loadingText}>Finding your suggested meals...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#a6192e" }}>
      <View style={styles.contentWrapper}>
        <View style={styles.card}>

          {/* Header Row */}
          <View style={styles.headerRow}>
            <View style={styles.headerLeft}>
              <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                <Ionicons name="arrow-back" size={24} color="#A6192E" />
              </TouchableOpacity>
              <Text style={styles.headerText}>Suggested Meals</Text>
            </View>
            <View style={styles.headerButtons}>
              <TouchableOpacity style={styles.sortButton} onPress={toggleSort}>
                <Ionicons name={sortDescending ? "arrow-down" : "arrow-up"} size={20} color="#A6192E" />
                <Text style={styles.sortButtonText}>
                  {sortBy === 'calories' ? 'Cal' : sortBy === 'protein' ? 'Pro' : 'Fat'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cartCircle} onPress={shuffleBoxes}>
                <Animated.View style={{ transform: [{ rotate: spin }] }}>
                  <Ionicons name="refresh" size={28} color="#A6192E" />
                </Animated.View>
              </TouchableOpacity>
            </View>
          </View>

          {/* Top blocks */}
          <View style={styles.topBlocks}>
            <View style={styles.block}>
              <Text style={styles.blockLabel}>Balance</Text>
              <Text style={[styles.blockValue, remainingBalance !== null && remainingBalance < 0 && { color: "red" }]}>
                {remainingBalance !== null ? `$${remainingBalance.toFixed(2)}` : "N/A"}
              </Text>
            </View>
            <View style={styles.block}>
              <Text style={styles.blockLabel}>Calories</Text>
              <Text style={[styles.blockValue, remainingCalories !== null && remainingCalories < 0 && { color: "red" }]}>
                {remainingCalories !== null ? remainingCalories.toString() : "N/A"}
              </Text>
            </View>
            <View style={styles.block}>
              <Text style={styles.blockLabel}>Protein</Text>
              <Text style={[styles.blockValue, remainingProtein !== null && remainingProtein < 0 && { color: "red" }]}>
                {remainingProtein !== null ? `${remainingProtein}g` : "N/A"}
              </Text>
            </View>
            <View style={styles.block}>
              <Text style={styles.blockLabel}>Fat</Text>
              <Text style={[styles.blockValue, remainingFat !== null && remainingFat < 0 && { color: "red" }]}>
                {remainingFat !== null ? `${remainingFat}g` : "N/A"}
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          {boxesOrder.map((box) => {
            const isExpanded = expandedRestaurants.has(box.text);
            const allRestaurantMeals = allMealsByRestaurant[box.text] || [];
            const otherMeals = allRestaurantMeals.filter(meal => meal.id !== box.id && meal.meal !== box.meal);

            return (
              <View key={box.id}>
                <View style={styles.row}>
                  <Image source={box.logo} style={styles.logo} resizeMode="contain" />

                  <View style={{ flex: 1 }}>
                    <View style={styles.mealPriceRow}>
                      <Text style={styles.mealText}>{box.meal}</Text>
                      <Text style={styles.priceText}>${box.price.toFixed(2)}</Text>
                    </View>
                    <Text style={styles.rowText}>{box.text}</Text>

                    <View style={styles.macroRow}>
                      <Text style={styles.macroText}>Calories: {box.calories}cal</Text>
                      <Text style={styles.macroText}>Protein: {box.protein}g</Text>
                      <Text style={styles.macroText}>Fat: {box.fat}g</Text>
                    </View>
                  </View>

                  <View style={styles.rowButtons}>
                    {otherMeals.length > 0 && (
                      <TouchableOpacity style={styles.dropdownButton} onPress={() => toggleRestaurant(box.text)}>
                        <Ionicons name={isExpanded ? "chevron-up" : "chevron-down"} size={20} color="#A6192E" />
                      </TouchableOpacity>
                    )}
                    <TouchableOpacity style={styles.plusCircle} onPress={() => toggleItem(box.id)}>
                      <Animated.View style={{ transform: [{ scale: animValues.current[box.id] || defaultAnimValue }] }}>
                        <Ionicons name={selectedItems.includes(box.id) ? "checkmark-outline" : "add-outline"} size={20} color="#A6192E" />
                      </Animated.View>
                    </TouchableOpacity>
                  </View>
                </View>

                {isExpanded && otherMeals.length > 0 && (
                  <View style={styles.expandedContainer}>
                    {otherMeals.map((meal) => (
                      <View key={meal.id} style={styles.expandedRow}>
                        <Image source={meal.logo} style={styles.logo} resizeMode="contain" />

                        <View style={{ flex: 1 }}>
                          <View style={styles.mealPriceRow}>
                            <Text style={styles.expandedMealText}>{meal.meal}</Text>
                            <Text style={styles.expandedPriceText}>${meal.price.toFixed(2)}</Text>
                          </View>

                          <View style={styles.macroRow}>
                            <Text style={styles.expandedMacroText}>Calories: {meal.calories}cal</Text>
                            <Text style={styles.expandedMacroText}>Protein: {meal.protein}g</Text>
                            <Text style={styles.expandedMacroText}>Fat: {meal.fat}g</Text>
                          </View>
                        </View>

                        <TouchableOpacity style={styles.plusCircle} onPress={() => toggleItem(meal.id)}>
                          <Animated.View style={{ transform: [{ scale: animValues.current[meal.id] || defaultAnimValue }] }}>
                            <Ionicons name={selectedItems.includes(meal.id) ? "checkmark-outline" : "add-outline"} size={20} color="#A6192E" />
                          </Animated.View>
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            );
          })}

        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: { flex: 1, backgroundColor: "#a6192e", justifyContent: "center", alignItems: "center" },
  loadingText: { marginTop: 16, fontSize: 18, color: "#FFFFFF", fontWeight: "500" },
  contentWrapper: { width: "100%", maxWidth: 600, alignSelf: "center", paddingHorizontal: 20 },
  card: { backgroundColor: "white", padding: 24, borderRadius: 12, marginTop: 16, shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 5, borderTopWidth: 8, borderTopColor: "#A6192E" },
  headerRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 16, position: "relative" },
  headerLeft: { flexDirection: "row", alignItems: "center", gap: 8 },
  backButton: { padding: 4 },
  headerText: { fontSize: 20, fontWeight: "bold", color: "#A6192E" },
  headerButtons: { flexDirection: "row", alignItems: "center", gap: 8 },
  sortButton: { flexDirection: "row", alignItems: "center", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, borderWidth: 2, borderColor: "#A6192E", gap: 4 },
  sortButtonText: { fontSize: 14, fontWeight: "600", color: "#A6192E" },
  cartCircle: { width: 36, height: 36, borderRadius: 18, borderWidth: 2, borderColor: "#A6192E", justifyContent: "center", alignItems: "center" },
  topBlocks: { flexDirection: "row", justifyContent: "space-between", marginBottom: 16 },
  block: { flex: 1, backgroundColor: "#f5f5f5", padding: 8, marginHorizontal: 4, borderRadius: 8, alignItems: "center" },
  blockLabel: { fontSize: 14, color: "#555", marginBottom: 2 },
  blockValue: { fontSize: 16, fontWeight: "600", color: "#374151" },
  divider: { height: 1, backgroundColor: "#fecaca", marginBottom: 16 },
  row: { flexDirection: "row", alignItems: "center", backgroundColor: "#fff", borderWidth: 1, borderColor: "#e5e7eb", padding: 12, marginBottom: 12, borderRadius: 10, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 4, elevation: 1 },
  logo: { width: 65, height: 65, marginRight: 12, borderRadius: 8 },
  mealPriceRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 4 },
  mealText: { fontSize: 18, fontWeight: "600", color: "#A6192E" },
  priceText: { fontSize: 16, fontWeight: "500", color: "#374151" },
  rowText: { fontSize: 16, fontWeight: "500", marginBottom: 6, color: "#333" },
  macroRow: { flexDirection: "row", gap: 12 },
  macroText: { fontSize: 14, color: "#555" },
  rowButtons: { flexDirection: "row", alignItems: "center", gap: 8 },
  dropdownButton: { width: 32, height: 32, borderRadius: 16, borderWidth: 2, borderColor: "#A6192E", justifyContent: "center", alignItems: "center" },
  plusCircle: { width: 36, height: 36, borderRadius: 18, borderWidth: 2, borderColor: "#A6192E", justifyContent: "center", alignItems: "center" },
  expandedContainer: { marginLeft: 12, marginBottom: 12, paddingLeft: 12, borderLeftWidth: 2, borderLeftColor: "#A6192E" },
  expandedRow: { flexDirection: "row", alignItems: "center", backgroundColor: "#f9fafb", borderWidth: 1, borderColor: "#e5e7eb", padding: 10, marginBottom: 8, borderRadius: 8 },
  expandedMealText: { fontSize: 14, fontWeight: "600", color: "#A6192E" },
  expandedPriceText: { fontSize: 13, fontWeight: "500", color: "#374151" },
  expandedMacroText: { fontSize: 12, color: "#555" },
});
