// app/(auth)/sign-in.tsx
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { router } from "expo-router";
import { auth, db } from "../lib/firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";


export default function SignIn() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = async () => {
    try {
      if (mode === "signup") {
        const cred = await createUserWithEmailAndPassword(auth, email.trim(), password);
        await setDoc(
          doc(db, "users", cred.user.uid),
          { email: email.trim(), createdAt: serverTimestamp() },
          { merge: true }
        );
        Alert.alert("Account created", "You're signed in.");
      } else {
        await signInWithEmailAndPassword(auth, email.trim(), password);
        Alert.alert("Signed in", "Welcome back!");
      }
      router.back(); // go back to your form screen
    } catch (e: any) {
      Alert.alert("Auth failed", e?.message ?? "Please try again.");
    }
  };

  return (
    <View style={s.wrap}>
      <Text style={s.title}>{mode === "signup" ? "Create account" : "Sign in"}</Text>

      <Text style={s.label}>Email</Text>
      <TextInput
        style={s.input}
        autoCapitalize="none"
        keyboardType="email-address"
        placeholder="you@school.edu"
        placeholderTextColor="#9ca3af"
        value={email}
        onChangeText={setEmail}
      />

      <Text style={s.label}>Password</Text>
      <TextInput
        style={s.input}
        secureTextEntry
        placeholder="********"
        placeholderTextColor="#9ca3af"
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={s.primary} onPress={submit}>
        <Text style={s.primaryText}>{mode === "signup" ? "Create account" : "Sign in"}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setMode(mode === "signup" ? "signin" : "signup")}>
        <Text style={s.link}>
          {mode === "signup" ? "Have an account? Sign in" : "New here? Create an account"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const s = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: "white", padding: 24, gap: 10 },
  title: { fontSize: 22, fontWeight: "700", marginBottom: 8 },
  label: { fontSize: 14, color: "#374151" },
  input: { borderWidth: 2, borderColor: "#d1d5db", borderRadius: 8, padding: 10, fontSize: 16, marginBottom: 10 },
  primary: { backgroundColor: "#A6192E", padding: 12, borderRadius: 8, alignItems: "center", marginTop: 6 },
  primaryText: { color: "white", fontWeight: "700" },
  link: { color: "#A6192E", textAlign: "center", marginTop: 12, fontWeight: "600" },
});
