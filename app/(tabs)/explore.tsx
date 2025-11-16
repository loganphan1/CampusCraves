import React, { useState, useRef, useEffect } from "react";
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, Image, Animated, Easing, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";

export default function Explore() {
  const params = useLocalSearchParams();
  
  const [isLoading, setIsLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [boxesOrder, setBoxesOrder] = useState([
    { id: 1, text: "Halal Shack", meal: "Chicken Bowl", price: 12.5, logo: require("../../assets/images/HalalShack.png"), protein: 42, calories: 600, fat: 18 },
    { id: 2, text: "Panda Express", meal: "Orange Chicken Plate", price: 11.0, logo: require("../../assets/images/PandaExpress.png"), protein: 36, calories: 700, fat: 20 },
    { id: 3, text: "Broken Yolk Cafe", meal: "Protein Scramble", price: 10.0, logo: require("../../assets/images/BroYo.png"), protein: 28, calories: 450, fat: 16 },
    { id: 4, text: "Jamals Chicken", meal: "3pc Chicken Strips", price: 9.5, logo: require("../../assets/images/JamalsChicken.png"), protein: 48, calories: 550, fat: 22 },
    { id: 5, text: "Subway", meal: "Turkey Sandwich", price: 8.5, logo: require("../../assets/images/Subway.png"), protein: 32, calories: 400, fat: 12 },
  ]);

  const spinAnim = useRef(new Animated.Value(0)).current;

  const initialBalance = params.balance && params.balance !== '' ? parseFloat(params.balance as string) : null;
  const initialCalories = params.calories && params.calories !== '' ? parseFloat(params.calories as string) : null;
  const initialProtein = params.protein && params.protein !== '' ? parseFloat(params.protein as string) : null;
  const initialFat = params.fat && params.fat !== '' ? parseFloat(params.fat as string) : null;

  const animValues = useRef(
    boxesOrder.reduce((acc, box) => {
      acc[box.id] = new Animated.Value(1);
      return acc;
    }, {} as Record<number, Animated.Value>)
  ).current;

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const toggleItem = (id: number) => {
    Animated.sequence([
      Animated.timing(animValues[id], { toValue: 1.4, duration: 150, useNativeDriver: true }),
      Animated.timing(animValues[id], { toValue: 1, duration: 150, useNativeDriver: true }),
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

    const shuffled = [...boxesOrder].sort(() => Math.random() - 0.5);
    setBoxesOrder(shuffled);
    setSelectedItems([]);
  };

  const spin = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const remainingBalance = initialBalance !== null 
    ? selectedItems.reduce((acc, id) => {
        const box = boxesOrder.find(b => b.id === id);
        return acc - (box?.price || 0);
      }, initialBalance)
    : null;

  const remainingCalories = initialCalories !== null
    ? selectedItems.reduce((acc, id) => {
        const box = boxesOrder.find(b => b.id === id);
        return acc - (box?.calories || 0);
      }, initialCalories)
    : null;

  const remainingProtein = initialProtein !== null
    ? selectedItems.reduce((acc, id) => {
        const box = boxesOrder.find(b => b.id === id);
        return acc - (box?.protein || 0);
      }, initialProtein)
    : null;

  const remainingFat = initialFat !== null
    ? selectedItems.reduce((acc, id) => {
        const box = boxesOrder.find(b => b.id === id);
        return acc - (box?.fat || 0);
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
            <Text style={styles.headerText}>Suggested Meals</Text>
            <TouchableOpacity style={styles.cartCircle} onPress={shuffleBoxes}>
              <Animated.View style={{ transform: [{ rotate: spin }] }}>
                <Ionicons name="refresh" size={28} color="#A6192E" />
              </Animated.View>
            </TouchableOpacity>
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

          {boxesOrder.map((box) => (
            <View key={box.id} style={styles.row}>
              <Image source={box.logo} style={styles.logo} resizeMode="contain" />

              <View style={{ flex: 1 }}>
                <View style={styles.mealPriceRow}>
                  <Text style={styles.mealText}>{box.meal}</Text>
                  <Text style={styles.priceText}>${box.price.toFixed(2)}</Text>
                </View>
                <Text style={styles.rowText}>{box.text}</Text>

                <View style={styles.macroRow}>
                  <Text style={styles.macroText}>Calories: {box.calories}</Text>
                  <Text style={styles.macroText}>Protein: {box.protein}g</Text>
                  <Text style={styles.macroText}>Fat: {box.fat}g</Text>
                </View>
              </View>

              <TouchableOpacity style={styles.plusCircle} onPress={() => toggleItem(box.id)}>
                <Animated.View style={{ transform: [{ scale: animValues[box.id] }] }}>
                  <Ionicons name={selectedItems.includes(box.id) ? "checkmark-outline" : "add-outline"} size={20} color="#A6192E" />
                </Animated.View>
              </TouchableOpacity>
            </View>
          ))}

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
  headerRow: { flexDirection: "row", alignItems: "center", marginBottom: 16, position: "relative" },
  headerText: { fontSize: 20, fontWeight: "bold", color: "#A6192E" },
  cartCircle: { width: 36, height: 36, borderRadius: 18, borderWidth: 2, borderColor: "#A6192E", justifyContent: "center", alignItems: "center", position: "absolute", right: 0 },
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
  plusCircle: { width: 36, height: 36, borderRadius: 18, borderWidth: 2, borderColor: "#A6192E", justifyContent: "center", alignItems: "center", marginLeft: 8 },
});
