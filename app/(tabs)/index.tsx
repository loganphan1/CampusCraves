import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import {auth, db} from "../lib/firebase";
import {createUserWithEmailAndPassword, signInWithEmailAndPassword,signOut,onAuthStateChanged,} from "firebase/auth";
import {doc, getDoc, serverTimestamp, setDoc} from "firebase/firestore";
import type {User} from "firebase/auth";


type ThemedTextType = 'title' | 'subtitle' | 'defaultSemiBold' | 'default';

interface MockViewProps { children: React.ReactNode; style?: any; }
interface MockTextProps { children: React.ReactNode; type?: ThemedTextType; style?: any; }
interface MockImageProps { source: any; style?: any; }

const ParallaxScrollView: React.FC<any> = ({ children, headerImage, headerBackgroundColor }) => <View style={{ flex: 1, backgroundColor: '#a6192e' }}>{children}</View>;
const ThemedView: React.FC<MockViewProps> = ({ children, style }) => <View style={style}>{children}</View>;
const ThemedText: React.FC<MockTextProps> = ({ children, type, style }) => <Text style={[{ fontSize: 16 }, style]}>{children}</Text>; 
const Image: React.FC<MockImageProps> = ({ source, style }) => <View style={style} />;
const HelloWave: React.FC = () => <ThemedText>👋</ThemedText>; 
const Link: React.FC<any> = ({ children, href }) => <TouchableOpacity onPress={() => Alert.alert('Link Pressed', `Navigating to ${href}`)}>{children}</TouchableOpacity>;

interface BalanceInputProps {
  label: string;
  value: string;
  onChange: (text: string) => void;
  placeholder: string;
  unit: string;
  isMoney?: boolean;
}

const BalanceInput: React.FC<BalanceInputProps> = ({ label, value, onChange, placeholder, unit, isMoney = false }) => (
  <View style={styles.inputContainer}>
    <ThemedText style={styles.label}>{label}</ThemedText>
    <View style={styles.textInputWrapper}>
      {isMoney && (
        <ThemedText style={styles.currencyPrefix}>$</ThemedText>
      )}
      <TextInput
        style={[styles.textInput, isMoney ? styles.inputPaddedLeft : null]}
        keyboardType="numeric"
        placeholder={placeholder}
        placeholderTextColor="#9ca3af"
        value={value}
        onChangeText={onChange}
      />
      {unit && (
        <ThemedText style={styles.unitSuffix}>{unit}</ThemedText>
      )}
    </View>
  </View>
);

interface SingleMacroInputProps {
  label: string;
  value: string;
  setValue: (text: string) => void;
  unit: string;
}

const SingleMacroInput: React.FC<SingleMacroInputProps> = ({ label, value, setValue, unit }) => (
  <View style={styles.macroRow}>
    <ThemedText style={styles.label}>{label} Goal</ThemedText>
    <View style={styles.rangeInputGroup}>
      <View style={[styles.rangeInputWrapper, { flex: 1 }]}>
        <TextInput
          style={styles.textInput}
          keyboardType="numeric"
          placeholder="goal"
          placeholderTextColor="#9ca3af"
          value={value}
          onChangeText={setValue}
        />
        <ThemedText style={styles.unitSuffix}>{unit}</ThemedText>
      </View>
    </View>
  </View>
);





export default function HomeScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] =useState("");
  const [user, setUser] = useState<User | null>(null);
  const [balance, setBalance] = useState('');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [fat, setFat] = useState('');

  useEffect(() => {
  const unsub = onAuthStateChanged(auth, async (u) => {
    setUser(u); // <-- add this line

    if (!u) return;
    try {
      const snap = await getDoc(doc(db, "users", u.uid));
      if (snap.exists()) {
        const d: any = snap.data();
        if (d.balance != null) setBalance(String(d.balance));
        if (d.goals?.calories != null) setCalories(String(d.goals.calories));
        if (d.goals?.protein != null) setProtein(String(d.goals.protein));
        if (d.goals?.fat != null) setFat(String(d.goals.fat));
      }
    } catch (e) {
      console.warn(e);
    }
  });
  return () => unsub();
}, []);


  const handleSignup = async () => {
    try{
      const cred = await createUserWithEmailAndPassword(auth, email.trim(), password);
      await setDoc(
        doc(db, "users", cred.user.uid),
        {email: email.trim(), createdAt: serverTimestamp()},
        {merge: true}
      );
      Alert.alert("Account created","You are signed in");
    } catch(e:any){
      Alert.alert("Sign up failed", e?.message ??"Try again");
    }
  };
  const handleLogin = async() => {
    try{
      await signInWithEmailAndPassword(auth, email.trim(),password);
      Alert.alert("Signed in", "Welcome back!");
    } catch (e:any){
      Alert.alert("Log in failed", "Try again");
    }
  };
  
  const handleLogout = async () => {
    await signOut(auth);
    Alert.alert("Signed out","See you soon!")
  };

  const handleSaveGoals = async () => {
    const u =auth.currentUser;
    if(!u){
      Alert.alert("Not signed in","Sign in to save your goals.");
      return;
    }
    const balanceValue = balance.trim() ? Number(balance) : null;
    const calorieValue = calories.trim() ? Number(calories) : null;
    const proteinValue = protein.trim()  ? Number(protein) : null;
    const fatValue = fat.trim() ? Number(fat) : null;

    try{
      await setDoc(
        doc(db, "users",u.uid),
        {
          balance: balanceValue,
          goals:{
            calories: calorieValue,
            protein: proteinValue,
            fat: fatValue,
          },
          updatedAt: serverTimestamp(),
        },
        {merge: true}
      );

     router.replace({
      pathname: "/(tabs)/explore",   // ← include the group
      params: {
        balance: balanceValue != null ? String(balanceValue) : "",
        calories: calorieValue != null ? String(calorieValue) : "",
        protein:  proteinValue  != null ? String(proteinValue)  : "",
        fat:      fatValue      != null ? String(fatValue)      : "",
    },
});

      setTimeout(()=> Alert.alert("Saved", "Your goals were saved to your account."),0);


    } catch (e:any){
      Alert.alert("Save failed", e?.message??"Please try again.");
    };
    }
  
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }>

      <View style={styles.contentWrapper}>
        <ThemedView style={[styles.section, { borderBottomWidth: 0, paddingBottom: 0 }]}>
  {user ? (
    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
      <ThemedText style={{ fontWeight: "600" }}>Signed in as {user.email}</ThemedText>
      <TouchableOpacity
        onPress={async () => {
          await signOut(auth);
          Alert.alert("Signed out", "See you soon!");
        }}
        style={[styles.submitButton, { paddingVertical: 8, backgroundColor: "#6b7280" }]}
      >
        <ThemedText style={styles.submitButtonText}>Sign out</ThemedText>
      </TouchableOpacity>
    </View>
  ) : (
    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
      <ThemedText style={{ color: "#6b7280" }}>You’re not signed in.</ThemedText>
      <TouchableOpacity
        onPress={() => router.push("/(auth)/sign-in")}
        style={[styles.submitButton, { paddingVertical: 8 }]}
      >
        <ThemedText style={styles.submitButtonText}>Sign in</ThemedText>
      </TouchableOpacity>
    </View>
  )}
</ThemedView>

        <ThemedView style={styles.formCard}>
            <ThemedText style={styles.headerText}>
                Campus Craves
            </ThemedText>
            <ThemedText style={styles.subHeaderText}>
                Enter your balance and nutritional goals.
            </ThemedText>

            <ThemedView style={styles.section}>
              <ThemedText style={styles.sectionTitle}>Meal Plan Budget</ThemedText>
              <BalanceInput
                label="Balance"
                value={balance}
                onChange={setBalance}
                placeholder="e.g., 75.00"
                unit="USD"
                isMoney={true}
              />
              
            </ThemedView>

            <ThemedView style={[styles.section, styles.macroSection]}>
              <ThemedText style={styles.sectionTitle}>Daily Macro Goals</ThemedText>

              <View style={styles.macroBlock}>
                  <SingleMacroInput
                      label="Calorie"
                      value={calories} setValue={setCalories}
                      unit="cal"
                  />
              </View>

              <View style={styles.macroBlock}>
                  <SingleMacroInput
                      label="Protein"
                      value={protein} setValue={setProtein}
                      unit="g"
                  />
              </View>

              <View style={styles.macroBlock}>
                  <SingleMacroInput
                      label="Fat"
                      value={fat} setValue={setFat}
                      unit="g"
                  />
              </View>
              
            </ThemedView>

            <View style={styles.submitButtonWrapper}>
              <TouchableOpacity
                onPress={handleSaveGoals}
                style={styles.submitButton}
              >
                <ThemedText style={styles.submitButtonText}>
                  Find Recommendations
                </ThemedText>
              </TouchableOpacity>
            </View>
        </ThemedView>
        
      </View>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },

  contentWrapper: {
    width: '100%',
    maxWidth: 600,
    alignSelf: 'center',
    paddingHorizontal: 20,
  },

  formCard: {
    padding: 24,
    borderRadius: 12,
    marginTop: 16,
    backgroundColor: '#FFFFFF', 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    borderTopWidth: 8,
    borderTopColor: '#A6192E', 
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#A6192E', 
    marginBottom: 4,
  },
  subHeaderText: {
    fontSize: 14,
    color: '#6b7280', 
    marginBottom: 16,
  },
  section: {
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#fecaca', 
  },
  macroSection: {
    borderBottomWidth: 0,
    paddingBottom: 0,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151', 
    marginBottom: 10,
  },
  inputContainer: {
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 3,
  },
  textInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#d1d5db',
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  textInput: {
    flex: 1,
    color: '#1f2937',
    fontSize: 14,
    padding: 0,
  },
  currencyPrefix: {
    color: '#6b7280', 
    fontSize: 14,
    marginRight: 3,
  },
  inputPaddedLeft: {
    paddingLeft: 4, 
  },
  unitSuffix: {
    color: '#6b7280', 
    fontSize: 14,
    marginLeft: 6,
  },

  macroRow: {
    marginBottom: 12,
  },
  rangeInputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rangeInputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#d1d5db',
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  rangeSeparator: {
    marginHorizontal: 6,
    color: '#9ca3af',
  },
  submitButtonWrapper: {
    paddingTop: 16,
  },
  submitButton: {
    backgroundColor: '#A6192E', 
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#A6192E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 3,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  
  macroBlock: {
    marginBottom: 16,
    paddingTop: 5,
  },
  modeSelectorGroup: {
    flexDirection: 'row',
    backgroundColor: '#e5e7eb',
    borderRadius: 8,
    marginBottom: 8,
    height: 32,
  },
  modeButton: {
    flex: 1,
    paddingVertical: 6,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  modeButtonRight: {
  },
  modeButtonActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  modeButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4b5563',
  },
  modeButtonTextActive: {
    color: '#A6192E',
    fontWeight: '700',
  },
});