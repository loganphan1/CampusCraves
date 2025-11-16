import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

type ThemedTextType = 'title' | 'subtitle' | 'defaultSemiBold' | 'default';
type InputMode = 'range' | 'single';

interface MockViewProps { children: React.ReactNode; style?: any; }
interface MockTextProps { children: React.ReactNode; type?: ThemedTextType; style?: any; }
interface MockImageProps { source: any; style?: any; }

const ParallaxScrollView: React.FC<any> = ({ children, headerImage, headerBackgroundColor }) => <View style={{ flex: 1 }}>{children}</View>;
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

      <ThemedText style={styles.rangeSeparator}>-</ThemedText>

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



export default function HomeScreen() {
  const [balance, setBalance] = useState('');
  
  const [proteinMode, setProteinMode] = useState<InputMode>('range');
  const [carbMode, setCarbMode] = useState<InputMode>('range');
  const [fatMode, setFatMode] = useState<InputMode>('range');

  const [proteinMin, setProteinMin] = useState('');
  const [proteinMax, setProteinMax] = useState('');
  const [carbMin, setCarbMin] = useState('');
  const [carbMax, setCarbMax] = useState('');
  const [fatMin, setFatMin] = useState('');
  const [fatMax, setFatMax] = useState('');

  const [proteinSingle, setProteinSingle] = useState('');
  const [carbSingle, setCarbSingle] = useState('');
  const [fatSingle, setFatSingle] = useState('');


  const getMacroGoals = (mode: InputMode, min: string, max: string, single: string, label: string) => {
    if (mode === 'single') {
      return `${label} Goal: ${single || 0}g`;
    }
    return `${label} Range: ${min}-${max}g`;
  };

  const handleSaveGoals = () => {
    const proteinGoal = getMacroGoals(proteinMode, proteinMin, proteinMax, proteinSingle, 'Protein');
    const carbGoal = getMacroGoals(carbMode, carbMin, carbMax, carbSingle, 'Carb');
    const fatGoal = getMacroGoals(fatMode, fatMin, fatMax, fatSingle, 'Fat');

    Alert.alert(
      "Goals Submitted",
      `Balance: $${balance || 0}\n${proteinGoal}\n${carbGoal}\n${fatGoal}`
    );
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

      <View style={styles.contentWrapper}>

        <ThemedView style={styles.formCard}>
            <ThemedText style={styles.headerText}>
                SDSU Meal Plan Optimizer
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
              <ThemedText style={styles.sectionTitle}>Daily Macro Goals in Grams</ThemedText>
              
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
    fontSize: 24,
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
    height: 36,
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