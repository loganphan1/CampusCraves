import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { AuthGuard } from '../../lib/AuthGuard';

// Your existing mock components (keep these as they were)
const ParallaxScrollView: React.FC<any> = ({ children, headerImage, headerBackgroundColor }) => <View style={{ flex: 1, backgroundColor: '#a6192e' }}>{children}</View>;
const ThemedView: React.FC<any> = ({ children, style }) => <View style={style}>{children}</View>;
const ThemedText: React.FC<any> = ({ children, type, style }) => <Text style={[{ fontSize: 16 }, style]}>{children}</Text>;
const Image: React.FC<any> = ({ source, style }) => <View style={style} />;
const BalanceInput: React.FC<any> = ({ label, value, onChange, placeholder, unit, isMoney = false }) => (
  <View style={styles.inputContainer}>
    <ThemedText style={styles.label}>{label}</ThemedText>
    <View style={styles.textInputWrapper}>
      {isMoney && <ThemedText style={styles.currencyPrefix}>$</ThemedText>}
      <TextInput
        style={[styles.textInput, isMoney ? styles.inputPaddedLeft : null]}
        keyboardType="numeric"
        placeholder={placeholder}
        placeholderTextColor="#9ca3af"
        value={value}
        onChangeText={onChange}
      />
      {unit && <ThemedText style={styles.unitSuffix}>{unit}</ThemedText>}
    </View>
  </View>
);
const SingleMacroInput: React.FC<any> = ({ label, value, setValue, unit }) => (
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
  return (
    <AuthGuard>
      <HomeScreenContent />
    </AuthGuard>
  );
}

function HomeScreenContent() {
  const router = useRouter();

  const [balance, setBalance] = useState('');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [fat, setFat] = useState('');

  const handleSaveGoals = () => {
    const balanceValue = balance && balance.trim() !== '' ? parseFloat(balance) : null;
    const calorieValue = calories && calories.trim() !== '' ? parseFloat(calories) : null;
    const proteinValue = protein && protein.trim() !== '' ? parseFloat(protein) : null;
    const fatValue = fat && fat.trim() !== '' ? parseFloat(fat) : null;

    router.push({
      pathname: '/(tabs)/explore',
      params: {
        balance: balanceValue !== null ? balanceValue.toString() : '',
        calories: calorieValue !== null ? calorieValue.toString() : '',
        protein: proteinValue !== null ? proteinValue.toString() : '',
        fat: fatValue !== null ? fatValue.toString() : '',
      },
    });
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }
    >
      <View style={styles.contentWrapper}>
        <ThemedView style={styles.formCard}>
          <ThemedText style={styles.headerText}>Campus Craves</ThemedText>
          <ThemedText style={styles.subHeaderText}>Enter your balance and nutritional goals.</ThemedText>

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
              <SingleMacroInput label="Calorie" value={calories} setValue={setCalories} unit="cal" />
            </View>

            <View style={styles.macroBlock}>
              <SingleMacroInput label="Protein" value={protein} setValue={setProtein} unit="g" />
            </View>

            <View style={styles.macroBlock}>
              <SingleMacroInput label="Fat" value={fat} setValue={setFat} unit="g" />
            </View>
          </ThemedView>

          <View style={styles.submitButtonWrapper}>
            <TouchableOpacity onPress={handleSaveGoals} style={styles.submitButton}>
              <ThemedText style={styles.submitButtonText}>Find Recommendations</ThemedText>
            </TouchableOpacity>
          </View>
        </ThemedView>
      </View>
    </ParallaxScrollView>
  );
}

// --- Styles (unchanged from your original file) ---
const styles = StyleSheet.create({
  reactLogo: { height: 178, width: 290, bottom: 0, left: 0, position: 'absolute' },
  contentWrapper: { width: '100%', maxWidth: 600, alignSelf: 'center', paddingHorizontal: 20 },
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
  headerText: { fontSize: 20, fontWeight: 'bold', color: '#A6192E', marginBottom: 4 },
  subHeaderText: { fontSize: 14, color: '#6b7280', marginBottom: 16 },
  section: { marginBottom: 16, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: '#fecaca' },
  macroSection: { borderBottomWidth: 0, paddingBottom: 0 },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: '#374151', marginBottom: 10 },
  inputContainer: { marginBottom: 8 },
  label: { fontSize: 14, fontWeight: '500', color: '#374151', marginBottom: 3 },
  textInputWrapper: { flexDirection: 'row', alignItems: 'center', borderRadius: 8, borderWidth: 2, borderColor: '#d1d5db', paddingVertical: 8, paddingHorizontal: 10 },
  textInput: { flex: 1, color: '#1f2937', fontSize: 14, padding: 0 },
  currencyPrefix: { color: '#6b7280', fontSize: 14, marginRight: 3 },
  inputPaddedLeft: { paddingLeft: 4 },
  unitSuffix: { color: '#6b7280', fontSize: 14, marginLeft: 6 },
  macroRow: { marginBottom: 12 },
  rangeInputGroup: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  rangeInputWrapper: { flex: 1, flexDirection: 'row', alignItems: 'center', borderRadius: 8, borderWidth: 2, borderColor: '#d1d5db', paddingVertical: 8, paddingHorizontal: 10 },
  submitButtonWrapper: { paddingTop: 16 },
  submitButton: { backgroundColor: '#A6192E', paddingVertical: 12, borderRadius: 8, alignItems: 'center', justifyContent: 'center', shadowColor: '#A6192E', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 5, elevation: 3 },
  submitButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
  macroBlock: { marginBottom: 16, paddingTop: 5 },
});
