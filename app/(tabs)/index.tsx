import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

// NOTE: These components are assumed to exist in your project structure:
// import { Image } from 'expo-image';
// import { HelloWave } from '@/components/hello-wave';
// import ParallaxScrollView from '@/components/parallax-scroll-view';
// import { ThemedText } from '@/components/themed-text';
// import { ThemedView } from '@/components/themed-view';
// import { Link } from 'expo-router';

// Type definitions for the custom components used in your original file structure
type ThemedTextType = 'title' | 'subtitle' | 'defaultSemiBold' | 'default';
type InputMode = 'range' | 'single';

// --- MOCK COMPONENT TYPING AND DEFINITIONS ---
// Defined with React.FC interfaces to prevent TS errors.

interface MockViewProps { children: React.ReactNode; style?: any; }
interface MockTextProps { children: React.ReactNode; type?: ThemedTextType; style?: any; }
interface MockImageProps { source: any; style?: any; }

const ParallaxScrollView: React.FC<any> = ({ children, headerImage, headerBackgroundColor }) => <View style={{ flex: 1 }}>{children}</View>;
const ThemedView: React.FC<MockViewProps> = ({ children, style }) => <View style={style}>{children}</View>;
const ThemedText: React.FC<MockTextProps> = ({ children, type, style }) => <Text style={[{ fontSize: 16 }, style]}>{children}</Text>; 
const Image: React.FC<MockImageProps> = ({ source, style }) => <View style={style} />;
// Removed Link and HelloWave mocks as they are no longer used in the main render
const HelloWave: React.FC = () => <ThemedText>👋</ThemedText>; 
const Link: React.FC<any> = ({ children, href }) => <TouchableOpacity onPress={() => Alert.alert('Link Pressed', `Navigating to ${href}`)}>{children}</TouchableOpacity>;
// -------------------------------------------------------------


// --- Reusable Component: Weekly Balance Input ---

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

// --- Reusable Component: Single Macro Input ---
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

// --- Reusable Component: Macro Range Input ---

interface MacroRangeInputProps {
  label: string;
  minVal: string;
  setMin: (text: string) => void;
  maxVal: string;
  setMax: (text: string) => void;
  unit: string;
}

const MacroRangeInput: React.FC<MacroRangeInputProps> = ({ label, minVal, setMin, maxVal, setMax, unit }) => (
  <View style={styles.macroRow}>
    <ThemedText style={styles.label}>{label} Range</ThemedText>
    <View style={styles.rangeInputGroup}>
      {/* Minimum Input */}
      <View style={styles.rangeInputWrapper}>
        <TextInput
          style={styles.textInput}
          keyboardType="numeric"
          placeholder="min"
          placeholderTextColor="#9ca3af"
          value={minVal}
          onChangeText={setMin}
        />
        <ThemedText style={styles.unitSuffix}>{unit}</ThemedText>
      </View>
      
      {/* Separator */}
      <ThemedText style={styles.rangeSeparator}>-</ThemedText>

      {/* Maximum Input */}
      <View style={styles.rangeInputWrapper}>
        <TextInput
          style={styles.textInput}
          keyboardType="numeric"
          placeholder="max"
          placeholderTextColor="#9ca3af"
          value={maxVal}
          onChangeText={setMax}
        />
        <ThemedText style={styles.unitSuffix}>{unit}</ThemedText>
      </View>
    </View>
  </View>
);

// --- Mode Selector Component ---

interface MacroModeSelectorProps {
  mode: InputMode;
  setMode: (mode: InputMode) => void;
}

const MacroModeSelector: React.FC<MacroModeSelectorProps> = ({ mode, setMode }) => (
  <View style={styles.modeSelectorGroup}>
    <TouchableOpacity
      style={[styles.modeButton, mode === 'range' && styles.modeButtonActive]}
      onPress={() => setMode('range')}
    >
      <ThemedText style={[styles.modeButtonText, mode === 'range' && styles.modeButtonTextActive]}>Range</ThemedText>
    </TouchableOpacity>
    <TouchableOpacity
      style={[styles.modeButton, mode === 'single' && styles.modeButtonActive, styles.modeButtonRight]}
      onPress={() => setMode('single')}
    >
      <ThemedText style={[styles.modeButtonText, mode === 'single' && styles.modeButtonTextActive]}>Single Number</ThemedText>
    </TouchableOpacity>
  </View>
);


// --- Main HomeScreen Component (SDSU Meal Plan Logic) ---

export default function HomeScreen() {
  // State variables for user inputs
  const [balance, setBalance] = useState('');
  
  // Macro Input Modes (default to range)
  const [proteinMode, setProteinMode] = useState<InputMode>('range');
  const [carbMode, setCarbMode] = useState<InputMode>('range');
  const [fatMode, setFatMode] = useState<InputMode>('range');

  // Range states
  const [proteinMin, setProteinMin] = useState('');
  const [proteinMax, setProteinMax] = useState('');
  const [carbMin, setCarbMin] = useState('');
  const [carbMax, setCarbMax] = useState('');
  const [fatMin, setFatMin] = useState('');
  const [fatMax, setFatMax] = useState('');

  // Single goal states (used when mode is 'single')
  const [proteinSingle, setProteinSingle] = useState('');
  const [carbSingle, setCarbSingle] = useState('');
  const [fatSingle, setFatSingle] = useState('');


  // Helper function to get the current macro goals for display/submission
  const getMacroGoals = (mode: InputMode, min: string, max: string, single: string, label: string) => {
    if (mode === 'single') {
      return `${label} Goal: ${single || 0}g`;
    }
    return `${label} Range: ${min}-${max}g`;
  };

  // Handles form submission 
  const handleSaveGoals = () => {
    const proteinGoal = getMacroGoals(proteinMode, proteinMin, proteinMax, proteinSingle, 'Protein');
    const carbGoal = getMacroGoals(carbMode, carbMin, carbMax, carbSingle, 'Carb');
    const fatGoal = getMacroGoals(fatMode, fatMin, fatMax, fatSingle, 'Fat');

    Alert.alert(
      "Goals Submitted",
      `Balance: $${balance || 0}\n${proteinGoal}\n${carbGoal}\n${fatGoal}`
    );
    // TODO: Implement navigation or data processing here
  };
  
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }>
      
      {/* Content Wrapper added to constrain width and center content */}
      <View style={styles.contentWrapper}>

        {/* --- SDSU MEAL PLAN OPTIMIZER FORM --- */}
        <ThemedView style={styles.formCard}>
            <ThemedText style={styles.headerText}>
                SDSU Meal Plan Optimizer
            </ThemedText>
            <ThemedText style={styles.subHeaderText}>
                Enter your balance and nutritional goals.
            </ThemedText>

            {/* Balance Input */}
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

            {/* Macro Goals Input */}
            <ThemedView style={[styles.section, styles.macroSection]}>
              <ThemedText style={styles.sectionTitle}>Daily Macro Goals in Grams</ThemedText>
              
              {/* Protein Input Block */}
              <View style={styles.macroBlock}>
                  <MacroModeSelector mode={proteinMode} setMode={setProteinMode} />
                  {proteinMode === 'range' ? (
                      <MacroRangeInput
                          label="Protein"
                          minVal={proteinMin} setMin={setProteinMin}
                          maxVal={proteinMax} setMax={setProteinMax}
                          unit="g"
                      />
                  ) : (
                      <SingleMacroInput
                          label="Protein"
                          value={proteinSingle} setValue={setProteinSingle}
                          unit="g"
                      />
                  )}
              </View>

              {/* Carb Input Block */}
              <View style={styles.macroBlock}>
                  <MacroModeSelector mode={carbMode} setMode={setCarbMode} />
                  {carbMode === 'range' ? (
                      <MacroRangeInput
                          label="Carb"
                          minVal={carbMin} setMin={setCarbMin}
                          maxVal={carbMax} setMax={setCarbMax}
                          unit="g"
                      />
                  ) : (
                      <SingleMacroInput
                          label="Carb"
                          value={carbSingle} setValue={setCarbSingle}
                          unit="g"
                      />
                  )}
              </View>

              {/* Fat Input Block */}
              <View style={styles.macroBlock}>
                  <MacroModeSelector mode={fatMode} setMode={setFatMode} />
                  {fatMode === 'range' ? (
                      <MacroRangeInput
                          label="Fat"
                          minVal={fatMin} setMin={setFatMin}
                          maxVal={fatMax} setMax={setFatMax}
                          unit="g"
                      />
                  ) : (
                      <SingleMacroInput
                          label="Fat"
                          value={fatSingle} setValue={setFatSingle}
                          unit="g"
                      />
                  )}
              </View>
              
            </ThemedView>

            {/* Submit Button */}
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
        
        {/* Removed Step 2 and Step 3 content to make the screen shorter */}
        
      </View>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  // Original styles
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

  // --- NEW STYLE FOR WIDTH CONSTRAINT ---
  contentWrapper: {
    width: '100%', // Default to full width on small screens
    maxWidth: 600, // Maximum width for tablets/desktops
    alignSelf: 'center', // Center the container horizontally
    paddingHorizontal: 20, // Add some padding on the sides for mobile
  },

  // --- SDSU Meal Plan Styles (Tailwind equivalent) ---

  formCard: {
    padding: 24,
    borderRadius: 12,
    marginTop: 16,
    // Note: React Native uses backgroundColor instead of class bg-white
    backgroundColor: '#FFFFFF', 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5, // For Android shadow
    borderTopWidth: 8,
    borderTopColor: '#A6192E', 
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#A6192E', 
    marginBottom: 4,
  },
  subHeaderText: {
    fontSize: 14,
    color: '#6b7280', 
    marginBottom: 16, // Reduced margin
  },
  section: {
    marginBottom: 16, // Reduced margin
    paddingBottom: 12, // Reduced padding
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
    marginBottom: 10, // Reduced margin
  },
  // Reusable Input Styles
  inputContainer: {
    marginBottom: 8, // Reduced margin
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 3, // Reduced margin
  },
  textInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#d1d5db',
    paddingVertical: 8, // Reduced padding
    paddingHorizontal: 10, // Reduced padding
  },
  textInput: {
    flex: 1,
    color: '#1f2937',
    fontSize: 14,
    padding: 0, // Reset default TextInput padding
  },
  currencyPrefix: {
    color: '#6b7280', 
    fontSize: 14,
    marginRight: 3, // Reduced margin
  },
  inputPaddedLeft: {
    paddingLeft: 4, 
  },
  unitSuffix: {
    color: '#6b7280', 
    fontSize: 14,
    marginLeft: 6, // Reduced margin
  },
  // Macro Range Styles
  macroRow: {
    marginBottom: 12, // Reduced margin
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
    paddingVertical: 8, // Reduced padding
    paddingHorizontal: 10, // Reduced padding
  },
  rangeSeparator: {
    marginHorizontal: 6, // Reduced margin
    color: '#9ca3af',
  },
  // Submit Button Styles
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
  
  // --- NEW MODE SELECTOR STYLES ---
  macroBlock: {
    marginBottom: 16, // Reduced margin
    paddingTop: 5,
  },
  modeSelectorGroup: {
    flexDirection: 'row',
    backgroundColor: '#e5e7eb', // Gray-200 for background
    borderRadius: 8,
    marginBottom: 8, // Reduced margin
    height: 36, // Reduced height for compactness
  },
  modeButton: {
    flex: 1,
    paddingVertical: 6, // Reduced padding
    paddingHorizontal: 8, // Reduced padding
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  modeButtonRight: {
    // Styling placeholder
  },
  modeButtonActive: {
    backgroundColor: '#FFFFFF', // Active button background
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  modeButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4b5563', // Inactive text color
  },
  modeButtonTextActive: {
    color: '#A6192E', // SDSU Red for active text
    fontWeight: '700',
  },
});