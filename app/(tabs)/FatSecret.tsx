import { XMLParser } from "fast-xml-parser";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

export default function FatSecretFoodByIdScreen() {
  const [token, setToken] = useState("");          // paste token here
  const [foodId, setFoodId] = useState("33691");   // Colby Cheese example
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [food, setFood] = useState<any>(null);

  async function fetchFood() {
    if (!token || !foodId) {
      setError("Paste an access token and enter a food ID");
      return;
    }
    setError(null);
    setLoading(true);
    setFood(null);
    try {
      const res = await fetch(
        `https://platform.fatsecret.com/rest/food/v5?food_id=${foodId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const xml = await res.text();
      if (!res.ok) throw new Error(`HTTP ${res.status}: ${xml}`);

      const parser = new XMLParser({ ignoreAttributes: false });
      const json = parser.parse(xml);
      setFood(json.food);
    } catch (e: any) {
      setError(e.message || String(e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>FatSecret Food Lookup</Text>

        <Text style={styles.label}>Access Token</Text>
        <TextInput
          value={token}
          onChangeText={setToken}
          placeholder="eyJhbGciOi..."
          style={styles.input}
          autoCapitalize="none"
        />

        <Text style={styles.label}>Food ID</Text>
        <TextInput
          value={foodId}
          onChangeText={setFoodId}
          placeholder="Enter food ID (e.g. 33691)"
          keyboardType="numeric"
          style={styles.input}
        />

        <Pressable style={styles.btn} onPress={fetchFood} disabled={loading}>
          <Text style={styles.btnText}>{loading ? "Loading..." : "Fetch"}</Text>
        </Pressable>

        {error && <Text style={styles.error}>{error}</Text>}
        {loading && <ActivityIndicator style={{ marginTop: 12 }} />}

        {food && (
          <View style={styles.card}>
            <Text style={styles.foodName}>{food.food_name}</Text>
            <Text style={styles.foodMeta}>{food.food_type}</Text>
            <Text style={styles.section}>Servings</Text>
            {Array.isArray(food.servings.serving)
              ? food.servings.serving.map((s: any) => (
                  <View key={s.serving_id} style={styles.servingRow}>
                    <Text style={styles.servingText}>
                      {s.serving_description}
                    </Text>
                    <Text style={styles.nutrition}>
                      {`Calories: ${s.calories} | Protein: ${s.protein}g | Fat: ${s.fat}g | Carbs: ${s.carbohydrate}g`}
                    </Text>
                  </View>
                ))
              : (
                <Text style={styles.nutrition}>
                  {JSON.stringify(food.servings.serving, null, 2)}
                </Text>
              )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },
  container: { padding: 16 },
  title: { fontSize: 22, fontWeight: "700", marginBottom: 12 },
  label: { fontSize: 14, color: "#666", marginTop: 12 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: Platform.select({ ios: 12, android: 8 }),
  },
  btn: {
    marginTop: 16,
    backgroundColor: "#111",
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
  },
  btnText: { color: "#fff", fontWeight: "600" },
  error: { color: "#b00020", marginTop: 10 },
  card: { marginTop: 16, borderWidth: 1, borderColor: "#eee", borderRadius: 8, padding: 12 },
  foodName: { fontSize: 18, fontWeight: "700" },
  foodMeta: { color: "#555", marginBottom: 8 },
  section: { marginTop: 8, fontWeight: "700" },
  servingRow: { marginTop: 6 },
  servingText: { fontWeight: "600" },
  nutrition: { color: "#333" },
});
