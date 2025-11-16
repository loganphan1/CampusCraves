// app/(tabs)/test.tsx
import React, { useMemo } from "react";
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, router } from "expo-router";

// Paths are from app/(tabs)/ → app/assets and app/lib/db
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
  if (restaurantLogoMap[restaurantName]) return restaurantLogoMap[restaurantName];
  const normalized = restaurantName.replace(/['’]/g, "'");
  if (restaurantLogoMap[normalized]) return restaurantLogoMap[normalized];
  return require("../../assets/images/oggis-logo.png");
}

// data imports (one level up from (tabs)/)
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

const DATA_BY_RESTAURANT: Record<string, any> = {
  "Big City Bagel Cafe": bcbData,
  "Broken Yolk Cafe": brokenYolkData,
  "Eureka!": eurekaData,
  "Everbowl": everbowlData,
  "The Habit Burger & Grill": habitData,
  "The Halal Shack": halalshackData,
  "Oggi's Pizza": oggisData,
  "Panda Express": pandaData,
  "Rubio's Coastal Grill": rubiosData,
  "Shake Smart": shakesmartData,
  "Subway": subwayData,
  "Sushi One n Half": sushionehalfData,
  "Which Wich": whichwichData,
};

type MenuItem = {
  name: string;
  price?: number;
  calories_kcal?: number;
  calories_kcal_low?: number;
  calories_kcal_high?: number;
  protein_g?: number;
  protein_g_est?: number;
  fat_g?: number;
  fat_g_est?: number;
};

function resolveRestaurantData(name: string | undefined) {
  if (!name) return { key: "", data: null };
  if (DATA_BY_RESTAURANT[name]) return { key: name, data: DATA_BY_RESTAURANT[name] };
  const foundKey = Object.keys(DATA_BY_RESTAURANT).find(k => k.toLowerCase() === name.toLowerCase());
  return { key: foundKey || name, data: foundKey ? DATA_BY_RESTAURANT[foundKey] : null };
}

export default function RestaurantDetailNoIngredients() {
  const params = useLocalSearchParams<{ name?: string }>();
  const rawName = Array.isArray(params.name) ? params.name[0] : params.name;
  const { key: restaurantName, data } = resolveRestaurantData(rawName);

  const items: Array<MenuItem & {
    calories: number;
    protein: number;
    fat: number;
    price: number;
  }> = useMemo(() => {
    if (!data?.items) return [];
    return data.items.map((item: MenuItem) => {
      const calories =
        item.calories_kcal ??
        (item.calories_kcal_low !== undefined && item.calories_kcal_high !== undefined
          ? Math.round((item.calories_kcal_low + item.calories_kcal_high) / 2)
          : 0);
      const protein = item.protein_g ?? item.protein_g_est ?? 0;
      const fat = item.fat_g ?? item.fat_g_est ?? 0;
      return { ...item, calories, protein, fat, price: item.price ?? 0 };
    });
  }, [data]);

  if (!data) {
    return (
      <View style={{ flex: 1, backgroundColor: "#a6192e", justifyContent: "center", alignItems: "center", padding: 24 }}>
        <Text style={{ color: "white", fontSize: 18, textAlign: "center" }}>
          Sorry, I couldn’t find data for “{restaurantName || ""}”.
        </Text>
        <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 16, padding: 10, backgroundColor: "white", borderRadius: 8 }}>
          <Text style={{ color: "#A6192E", fontWeight: "600" }}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const logo = getRestaurantLogo(restaurantName);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#a6192e" }}>
      <View style={styles.wrapper}>
        <View style={styles.card}>
          {/* Header */}
          <View style={styles.headerRow}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color="#A6192E" />
            </TouchableOpacity>
            <Image source={logo} style={styles.logo} resizeMode="contain" />
            <Text style={styles.title}>{restaurantName}</Text>
          </View>

          {/* Items (no ingredients UI) */}
          {items.map((item, idx) => (
            <View key={`${item.name}-${idx}`} style={styles.itemCard}>
              <View style={styles.itemTopRow}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
              </View>

              <View style={styles.macrosRow}>
                <Text style={styles.macro}>Calories: {item.calories}cal</Text>
                <Text style={styles.macro}>Protein: {item.protein}g</Text>
                <Text style={styles.macro}>Fat: {item.fat}g</Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrapper: { width: "100%", maxWidth: 600, alignSelf: "center", paddingHorizontal: 20 },
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
  headerRow: { flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 12 },
  backButton: { padding: 4 },
  logo: { width: 48, height: 48, borderRadius: 8 },
  title: { fontSize: 20, fontWeight: "800", color: "#A6192E", flexShrink: 1 },
  itemCard: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    padding: 12,
    marginBottom: 12,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  itemTopRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 4 },
  itemName: { fontSize: 16, fontWeight: "700", color: "#A6192E", flex: 1, paddingRight: 8 },
  itemPrice: { fontSize: 15, fontWeight: "600", color: "#374151" },
  macrosRow: { flexDirection: "row", gap: 12, marginBottom: 2 },
  macro: { fontSize: 13, color: "#555" },
});
