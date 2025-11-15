import React from "react";
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function Explore() {
  const logoImage = require("../../assets/images/HalalShack.png");

  const boxes = [
    { id: 1, text: "Halal Shack", logo: require("../../assets/images/HalalShack.png") },
    { id: 2, text: "Panda Express", logo: require("../../assets/images/PandaExpress.png") },
    { id: 3, text: "Broken Yolk Cafe", logo: require("../../assets/images/BroYo.png") },
    { id: 4, text: "Jamals Chicken", logo: require("../../assets/images/JamalsChicken.png") },
    { id: 5, text: "Subway", logo: require("../../assets/images/Subway.png") },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: "#a6192e" }}>
      <Text style={styles.header}>Your Results</Text>
      <Text style={styles.information}>
        Remaining balance: $20.00 - Remaining Macros: 1500 calories, 100 grams protein
      </Text>
      <View style={{ height: 5, width: "100%", backgroundColor: "black" }}></View>

      <ScrollView contentContainerStyle={styles.container}>
        {boxes.map((box) => (
          <View key={box.id} style={styles.box}>
            <Image source={box.logo} style={styles.logo} resizeMode="contain"/>

            <Text style={styles.boxText}>{box.text}</Text>

            <TouchableOpacity
              onPress={() => console.log(`Plus pressed on ${box.text}`)}
              style={styles.cartButton}
            >
              <Ionicons name="cart" size={28} color="#a6192e" />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 30,
    paddingHorizontal: 20,
    alignItems: "center",
    backgroundColor: "#a6192e",
    paddingBottom: 30,
  },
  header: {
    paddingTop: 10,
    textAlign: "center",
    color: "white",
    fontSize: 32,
    fontWeight: "bold",
  },
  information: {
    textAlign: "center",
    color: "white",
    fontSize: 25,
    fontWeight: "bold",
    paddingBottom: 10,
  },
  box: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    borderRadius: 10,
    borderWidth: 3,
    borderColor: "#000",
    padding: 10,
    width: "90%",
    height: 100,
    backgroundColor: "white",
  },
  logo: {
    width: 100,
    height: "80%",
    // borderRadius: 25,
    marginRight: 15,
  },
  boxText: {
    flex: 1,
    fontSize: 20,
    color: "#333",
  },
  cartButton: {
    justifyContent: "center",
    alignItems: "center",
  },
});
