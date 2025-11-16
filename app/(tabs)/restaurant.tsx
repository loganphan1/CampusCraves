// app/(tabs)/restaurants.tsx
import React, { useMemo, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  Keyboard,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

/** Paths below assume your assets/ and lib/ are at the project root */
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

/** Data imports (project-root/lib/db) */
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

const ALL = [
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

type Row = {
  key: string;
  name: string;
  logo: any;
  count: number;
};

const normalize = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/&/g, "and")
    .replace(/['’]/g, "")
    .replace(/\s+/g, " ")
    .trim();

export default function RestaurantsList() {
  const [query, setQuery] = useState("");

  // Build the base list once
  const baseRows: Row[] = useMemo(
    () =>
      ALL.map((d: any) => ({
        key: d.restaurant,
        name: d.restaurant,
        logo: getRestaurantLogo(d.restaurant),
        count: Array.isArray(d.items) ? d.items.length : 0,
      })).sort((a, b) => a.name.localeCompare(b.name)),
    []
  );

  // Filter as user types
  const rows = useMemo(() => {
    const q = normalize(query);
    if (!q) return baseRows;
    return baseRows.filter((r) => normalize(r.name).includes(q));
  }, [baseRows, query]);

  // Open detail page
  const openRestaurant = (name: string) => {
    router.push({ pathname: "/(tabs)/test", params: { name } });
  };

  // Back to Explore (pop if possible, else go directly)
  const goBackToExplore = () => {
    const canGoBack = (router as any).canGoBack?.() === true;
    if (canGoBack) router.back();
    else router.replace("/(tabs)/explore");
  };

  const renderItem = ({ item }: { item: Row }) => (
    <TouchableOpacity style={styles.row} onPress={() => openRestaurant(item.name)}>
      <Image source={item.logo} style={styles.logo} resizeMode="contain" />
      <View style={{ flex: 1 }}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.sub}>
          {item.count} item{item.count === 1 ? "" : "s"}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#A6192E" />
    </TouchableOpacity>
  );

  const ListHeader = (
    <View style={styles.headerSticky}>
      <View style={styles.headerRow}>
        <TouchableOpacity
          onPress={goBackToExplore}
          style={styles.backButton}
          accessibilityLabel="Back to Explore"
        >
          <Ionicons name="arrow-back" size={22} color="#A6192E" />
        </TouchableOpacity>
        <Text style={styles.headerText}>All Restaurants</Text>
        <View style={{ width: 22 }} />
      </View>

      <View style={styles.searchBox}>
        <Ionicons name="search" size={18} color="#A6192E" />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search restaurants…"
          placeholderTextColor="#9ca3af"
          style={styles.searchInput}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="search"
          onSubmitEditing={Keyboard.dismiss}
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => setQuery("")} accessibilityLabel="Clear search">
            <Ionicons name="close-circle" size={18} color="#A6192E" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.wrapper}>
        <View style={styles.card}>
          <FlatList
            style={{ flex: 1 }}
            contentContainerStyle={{ paddingBottom: 16 }}
            data={rows}
            keyExtractor={(item) => item.key}
            renderItem={renderItem}
            ItemSeparatorComponent={() => <View style={styles.sep} />}
            ListEmptyComponent={
              <Text style={styles.empty}>No restaurants match “{query}”.</Text>
            }
            ListHeaderComponent={ListHeader}
            stickyHeaderIndices={[0]}              // header (with back + search) sticks to top
            showsVerticalScrollIndicator={true}    // visible scrollbar
            keyboardDismissMode="on-drag"          // dismiss keyboard when scrolling
            keyboardShouldPersistTaps="always"     // single tap focuses input
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#a6192e" },
  wrapper: { flex: 1, width: "100%", maxWidth: 600, alignSelf: "center", paddingHorizontal: 20 },
  card: {
    flex: 1,
    backgroundColor: "white",
    paddingVertical: 8,
    paddingHorizontal: 12,
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

  headerSticky: {
    backgroundColor: "white",
    paddingTop: 8,
    paddingBottom: 8,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  backButton: { padding: 4 },
  headerText: { fontSize: 20, fontWeight: "800", color: "#A6192E" },

  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#A6192E",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    gap: 8,
  },
  searchInput: { flex: 1, fontSize: 15, color: "#111827", padding: 0 },

  sep: { height: 8 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    padding: 12,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  logo: { width: 48, height: 48, borderRadius: 8, marginRight: 10 },
  name: { fontSize: 16, fontWeight: "700", color: "#A6192E" },
  sub: { fontSize: 12, color: "#6b7280", marginTop: 2 },
  empty: { textAlign: "center", color: "#6b7280", paddingVertical: 24 },
});
