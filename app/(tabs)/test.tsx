// SubwayMenuScreen.tsx
import React, { useState, useRef, useEffect } from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Easing,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

type Item = {
  name: string;
  price: number;
  calories_kcal: number;
  protein_g: number;
  fat_g: number;
};

type RestaurantData = {
  restaurant: string;
  menu_url: string;
  currency: string;
  items: Item[];
};

const DATA: RestaurantData = {
  restaurant: "Subway",
  menu_url:
    "https://www.subway.com/en-us/-/media/northamerica/usa/nutrition/nutritiondocuments/2025/us_nutrition_w4_eng_9-2025.pdf",
  currency: "USD",
  items: [
    { name: '6" Sweet Onion Chicken Teriyaki Sandwich', price: 7.49, calories_kcal: 430, protein_g: 29, fat_g: 11 },
    { name: '6" Oven Roasted Turkey Sandwich', price: 6.99, calories_kcal: 270, protein_g: 21, fat_g: 4 },
    { name: '6" Veggie Delite® Sandwich', price: 5.99, calories_kcal: 210, protein_g: 10, fat_g: 3 },
    { name: "Footlong Chipotle Chicken & Cheese Sandwich", price: 11.99, calories_kcal: 450, protein_g: 27, fat_g: 18 },
    { name: "Footlong Big Hot Pastrami Sandwich", price: 12.49, calories_kcal: 1160, protein_g: 58, fat_g: 62 },
    { name: "No Bready Bowl – Sweet Onion Chicken Teriyaki", price: 8.49, calories_kcal: 300, protein_g: 35, fat_g: 20 },
    { name: "No Bready Bowl – Chicken & Bacon Ranch", price: 9.49, calories_kcal: 600, protein_g: 42, fat_g: 28 },
    { name: '6" Turkey & Bacon Club Sandwich', price: 8.99, calories_kcal: 600, protein_g: 34, fat_g: 10 },
    { name: "Footlong Steak & Cheese Sandwich", price: 10.99, calories_kcal: 860, protein_g: 64, fat_g: 32 },
    { name: '6" Tuna Sandwich', price: 7.49, calories_kcal: 470, protein_g: 25, fat_g: 20 },
  ],
};

export default function test() {
  const [isLoading, setIsLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const [selected, setSelected] = useState<Item | null>(null);
  const spinAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  const handleSelect = (item: Item) => {
    Animated.sequence([
      Animated.timing(spinAnim, { toValue: 1, duration: 300, easing: Easing.linear, useNativeDriver: true }),
      Animated.timing(spinAnim, { toValue: 0, duration: 0, useNativeDriver: true }),
    ]).start();
    setSelected(item);
    setExpanded(false);
  };

  const spin = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FFFFFF" />
        <Text style={styles.loadingText}>Loading Subway menu...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#a6192e" }}>
      <View style={styles.contentWrapper}>
        <View style={styles.card}>
          {/* Header */}
          <View style={styles.headerRow}>
            <Text style={styles.headerText}>{DATA.restaurant} Menu</Text>
            <TouchableOpacity onPress={toggleExpand} style={styles.cartCircle}>
              <Animated.View style={{ transform: [{ rotate: spin }] }}>
                <Ionicons name={expanded ? "chevron-up" : "chevron-down"} size={26} color="#A6192E" />
              </Animated.View>
            </TouchableOpacity>
          </View>

          {/* Dropdown */}
          {expanded && (
            <View style={styles.dropdown}>
              {DATA.items.map((item, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={[
                    styles.dropdownItem,
                    selected?.name === item.name && styles.dropdownItemSelected,
                  ]}
                  onPress={() => handleSelect(item)}
                >
                  <Text
                    style={[
                      styles.dropdownText,
                      selected?.name === item.name && { color: "#A6192E", fontWeight: "700" },
                    ]}
                  >
                    {item.name}
                  </Text>
                  <Text style={styles.dropdownSub}>${item.price.toFixed(2)}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Selected item details */}
          {selected ? (
            <View style={styles.selectedCard}>
              <Text style={styles.mealName}>{selected.name}</Text>
              <Text style={styles.priceText}>${selected.price.toFixed(2)}</Text>
              <View style={styles.macroRow}>
                <Text style={styles.macroText}>Calories: {selected.calories_kcal}</Text>
                <Text style={styles.macroText}>Protein: {selected.protein_g}g</Text>
                <Text style={styles.macroText}>Fat: {selected.fat_g}g</Text>
              </View>
            </View>
          ) : (
            <Text style={styles.placeholderText}>Select a menu item to view nutrition info</Text>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: { flex: 1, backgroundColor: "#a6192e", justifyContent: "center", alignItems: "center" },
  loadingText: { marginTop: 16, fontSize: 18, color: "#FFFFFF", fontWeight: "500" },
  contentWrapper: { width: "100%", maxWidth: 600, alignSelf: "center", paddingHorizontal: 20 },
  card: {
    backgroundColor: "white",
    padding: 24,
    borderRadius: 12,
    marginTop: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    borderTopWidth: 8,
    borderTopColor: "#A6192E",
  },
  headerRow: { flexDirection: "row", alignItems: "center", marginBottom: 16, position: "relative" },
  headerText: { fontSize: 20, fontWeight: "bold", color: "#A6192E" },
  cartCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: "#A6192E",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    right: 0,
  },
  dropdown: { marginBottom: 16 },
  dropdownItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  dropdownItemSelected: { backgroundColor: "#fef2f2" },
  dropdownText: { fontSize: 16, color: "#333" },
  dropdownSub: { fontSize: 14, color: "#666" },
  selectedCard: {
    backgroundColor: "#fff7f7",
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: "#fecaca",
  },
  mealName: { fontSize: 18, fontWeight: "700", color: "#A6192E", marginBottom: 4 },
  priceText: { fontSize: 16, color: "#374151", marginBottom: 6 },
  macroRow: { flexDirection: "row", justifyContent: "space-between" },
  macroText: { fontSize: 14, color: "#555" },
  placeholderText: { fontSize: 16, color: "#777", textAlign: "center" },
});
