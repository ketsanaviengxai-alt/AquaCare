import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Animated,
  Platform,
} from 'react-native';
import { FishSpecies, WaterType } from '../types/fish';

interface Props {
  activeFish: FishSpecies[];
  waterType: WaterType;
  onSelectFish: (fish: FishSpecies) => void;
  onRemoveFishFromTank: (fishId: string) => void;
  onToggleWaterType: (type: WaterType) => void;
}

export const AquariumTank: React.FC<Props> = ({
  activeFish,
  waterType,
  onSelectFish,
  onRemoveFishFromTank,
  onToggleWaterType,
}) => {
  const [tankTemp, setTankTemp] = useState<number>(25); // Celsius
  const [tankPh, setTankPh] = useState<number>(waterType === 'Freshwater' ? 7.0 : 8.2);
  const [lighting, setLighting] = useState<'Daylight' | 'Dusk' | 'Actinic'>('Daylight');
  const [bubblesActive, setBubblesActive] = useState<boolean>(true);

  // Sync pH when waterType toggles
  useEffect(() => {
    if (waterType === 'Freshwater' && tankPh > 7.6) {
      setTankPh(7.0);
    } else if (waterType === 'Saltwater' && tankPh < 7.8) {
      setTankPh(8.2);
    }
  }, [waterType, tankPh]);

  // Animated Bubbles
  const bubble1 = useRef(new Animated.Value(0)).current;
  const bubble2 = useRef(new Animated.Value(0)).current;
  const bubble3 = useRef(new Animated.Value(0)).current;
  const bubble4 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!bubblesActive) return;

    const createBubbleLoop = (anim: Animated.Value, duration: number, delay: number) => {
      return Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(anim, {
            toValue: 1,
            duration,
            useNativeDriver: Platform.OS !== 'web',
          }),
          Animated.timing(anim, {
            toValue: 0,
            duration: 0,
            useNativeDriver: Platform.OS !== 'web',
          }),
        ])
      );
    };

    const l1 = createBubbleLoop(bubble1, 2800, 200);
    const l2 = createBubbleLoop(bubble2, 3400, 700);
    const l3 = createBubbleLoop(bubble3, 2400, 1200);
    const l4 = createBubbleLoop(bubble4, 3000, 500);

    l1.start();
    l2.start();
    l3.start();
    l4.start();

    return () => {
      l1.stop();
      l2.stop();
      l3.stop();
      l4.stop();
    };
  }, [bubblesActive, bubble1, bubble2, bubble3, bubble4]);

  // Fish swimming animations
  const fishPositions = useRef<{ [key: string]: { x: Animated.Value; y: Animated.Value; dir: number } }>({});

  activeFish.forEach((f) => {
    if (!fishPositions.current[f.id]) {
      fishPositions.current[f.id] = {
        x: new Animated.Value(Math.random() * 200 + 40),
        y: new Animated.Value(Math.random() * 80 + 30),
        dir: Math.random() > 0.5 ? 1 : -1,
      };
    }
  });

  useEffect(() => {
    const loops: Animated.CompositeAnimation[] = [];

    activeFish.forEach((f, idx) => {
      const pos = fishPositions.current[f.id];
      if (!pos) return;

      const duration = (f.swimSpeedSec || 6) * 1000;
      const loop = Animated.loop(
        Animated.sequence([
          Animated.timing(pos.x, {
            toValue: 260 + (idx % 3) * 30,
            duration: duration,
            useNativeDriver: Platform.OS !== 'web',
          }),
          Animated.timing(pos.x, {
            toValue: 30 + (idx % 2) * 20,
            duration: duration,
            useNativeDriver: Platform.OS !== 'web',
          }),
        ])
      );
      loop.start();
      loops.push(loop);

      const yLoop = Animated.loop(
        Animated.sequence([
          Animated.timing(pos.y, {
            toValue: 20 + ((idx * 37) % 90),
            duration: duration * 0.7,
            useNativeDriver: Platform.OS !== 'web',
          }),
          Animated.timing(pos.y, {
            toValue: 70 + ((idx * 23) % 70),
            duration: duration * 0.7,
            useNativeDriver: Platform.OS !== 'web',
          }),
        ])
      );
      yLoop.start();
      loops.push(yLoop);
    });

    return () => {
      loops.forEach((l) => l.stop());
    };
  }, [activeFish]);

  // Lighting backgrounds
  const getTankBackground = () => {
    if (lighting === 'Actinic') {
      return waterType === 'Saltwater' ? '#031b4e' : '#041c32';
    }
    if (lighting === 'Dusk') {
      return '#1a243b';
    }
    return waterType === 'Saltwater' ? '#034066' : '#073336';
  };

  // Warnings / Compatibility with Tank Water Parameters
  const incompatibleFish = activeFish.filter((f) => f.waterType !== waterType);
  const tempAlertFish = activeFish.filter((f) => tankTemp < f.tempMinC || tankTemp > f.tempMaxC);

  return (
    <View style={styles.container}>
      {/* Header bar for the Tank */}
      <View style={styles.tankHeader}>
        <View style={styles.tankTitleRow}>
          <Text style={styles.tankTitleIcon}>🫧</Text>
          <View>
            <Text style={styles.tankTitleText}>Living Aquarium Tank</Text>
            <Text style={styles.tankSubtitle}>
              {waterType} Biotope • {lighting} Lighting • {activeFish.length} Resident {activeFish.length === 1 ? 'Fish' : 'Fishes'}
            </Text>
          </View>
        </View>

        {/* Quick Water Switch */}
        <View style={styles.waterSwitchRow}>
          <TouchableOpacity
            style={[
              styles.waterSwitchBtn,
              waterType === 'Freshwater' && styles.waterSwitchActiveFresh,
            ]}
            onPress={() => onToggleWaterType('Freshwater')}
          >
            <Text
              style={[
                styles.waterSwitchBtnText,
                waterType === 'Freshwater' && styles.waterSwitchBtnTextActive,
              ]}
            >
              🌿 Freshwater
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.waterSwitchBtn,
              waterType === 'Saltwater' && styles.waterSwitchActiveSalt,
            ]}
            onPress={() => onToggleWaterType('Saltwater')}
          >
            <Text
              style={[
                styles.waterSwitchBtnText,
                waterType === 'Saltwater' && styles.waterSwitchBtnTextActive,
              ]}
            >
              🪸 Saltwater
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Glass Aquarium Window */}
      <View style={[styles.glassAquarium, { backgroundColor: getTankBackground() }]}>
        {/* Glass Reflection Highlight */}
        <View style={styles.glassHighlight} />
        <View style={styles.waterSurfaceLine} />

        {/* Rising Bubbles Effect */}
        {bubblesActive && (
          <>
            <Animated.View
              style={[
                styles.bubble,
                {
                  left: '18%',
                  transform: [
                    {
                      translateY: bubble1.interpolate({
                        inputRange: [0, 1],
                        outputRange: [180, -20],
                      }),
                    },
                    {
                      scale: bubble1.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.6, 1.3],
                      }),
                    },
                  ],
                  opacity: bubble1.interpolate({
                    inputRange: [0, 0.8, 1],
                    outputRange: [0.7, 0.8, 0],
                  }),
                },
              ]}
            />
            <Animated.View
              style={[
                styles.bubble,
                {
                  left: '42%',
                  width: 14,
                  height: 14,
                  transform: [
                    {
                      translateY: bubble2.interpolate({
                        inputRange: [0, 1],
                        outputRange: [180, -20],
                      }),
                    },
                  ],
                  opacity: bubble2.interpolate({
                    inputRange: [0, 0.8, 1],
                    outputRange: [0.8, 0.9, 0],
                  }),
                },
              ]}
            />
            <Animated.View
              style={[
                styles.bubble,
                {
                  left: '68%',
                  width: 10,
                  height: 10,
                  transform: [
                    {
                      translateY: bubble3.interpolate({
                        inputRange: [0, 1],
                        outputRange: [180, -20],
                      }),
                    },
                  ],
                },
              ]}
            />
            <Animated.View
              style={[
                styles.bubble,
                {
                  left: '82%',
                  width: 16,
                  height: 16,
                  transform: [
                    {
                      translateY: bubble4.interpolate({
                        inputRange: [0, 1],
                        outputRange: [180, -20],
                      }),
                    },
                  ],
                },
              ]}
            />
          </>
        )}

        {/* Swimming Fish in the Tank */}
        {activeFish.length === 0 ? (
          <View style={styles.emptyTankMessage}>
            <Text style={styles.emptyTankIcon}>🌊</Text>
            <Text style={styles.emptyTankTitle}>Tank is Currently Empty</Text>
            <Text style={styles.emptyTankSub}>
              Browse the species below and click "Add to Tank" to observe them swimming in this aquarium.
            </Text>
          </View>
        ) : (
          activeFish.map((fish) => {
            const pos = fishPositions.current[fish.id];
            if (!pos) return null;

            return (
              <Animated.View
                key={fish.id}
                style={[
                  styles.swimmingFishContainer,
                  {
                    transform: [
                      { translateX: pos.x },
                      { translateY: pos.y },
                    ],
                  },
                ]}
              >
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => onSelectFish(fish)}
                  style={styles.fishTouchTarget}
                >
                  <Image
                    source={{ uri: fish.imageUrl }}
                    style={styles.swimmingFishAvatar}
                    resizeMode="cover"
                  />
                  <View style={styles.fishNameBubble}>
                    <Text style={styles.fishNameBubbleText} numberOfLines={1}>
                      {fish.commonName.split(' ')[0]}
                    </Text>
                  </View>
                </TouchableOpacity>
              </Animated.View>
            );
          })
        )}

        {/* Substrate Floor & Aquatic Decor */}
        <View style={styles.substrateFloor}>
          <Text style={styles.decorLeft}>
            {waterType === 'Freshwater' ? '🌿🌱' : '🪸🪸'}
          </Text>
          <Text style={styles.decorCenter}>
            {waterType === 'Freshwater' ? '🪵 🌿 🪨' : '🐚 🪸 🪨'}
          </Text>
          <Text style={styles.decorRight}>
            {waterType === 'Freshwater' ? '🌱🌿' : '🪸🐚'}
          </Text>
        </View>
      </View>

      {/* Warnings & Diagnostics Banner */}
      {(incompatibleFish.length > 0 || tempAlertFish.length > 0) && (
        <View style={styles.warningBanner}>
          <Text style={styles.warningIcon}>⚠️</Text>
          <View style={{ flex: 1 }}>
            {incompatibleFish.length > 0 && (
              <Text style={styles.warningText}>
                <Text style={styles.warningBold}>Water Salinity Mismatch:</Text>{' '}
                {incompatibleFish.map((f) => f.commonName).join(', ')} cannot survive in{' '}
                {waterType.toLowerCase()} water!
              </Text>
            )}
            {tempAlertFish.length > 0 && (
              <Text style={styles.warningText}>
                <Text style={styles.warningBold}>Temperature Alert ({tankTemp}°C):</Text>{' '}
                {tempAlertFish
                  .map((f) => `${f.commonName} (${f.tempMinC}°C-${f.tempMaxC}°C)`)
                  .join(', ')}
              </Text>
            )}
          </View>
        </View>
      )}

      {/* Interactive Tank Controls (หม้อน้ำ Controllers) */}
      <View style={styles.controlPanel}>
        {/* Thermostat / Heater Controller */}
        <View style={styles.controlBox}>
          <View style={styles.controlBoxHeader}>
            <Text style={styles.controlBoxTitle}>🌡️ Water Heater</Text>
            <Text
              style={[
                styles.tempBadge,
                tankTemp >= 24 && tankTemp <= 28
                  ? styles.tempSafe
                  : styles.tempWarning,
              ]}
            >
              {tankTemp}°C / {Math.round((tankTemp * 9) / 5 + 32)}°F
            </Text>
          </View>
          <View style={styles.stepperRow}>
            <TouchableOpacity
              style={styles.stepBtn}
              onPress={() => setTankTemp((t) => Math.max(18, t - 1))}
            >
              <Text style={styles.stepBtnText}>−</Text>
            </TouchableOpacity>
            <View style={styles.stepperTrack}>
              <View
                style={[
                  styles.stepperFill,
                  { width: `${((tankTemp - 18) / (32 - 18)) * 100}%` },
                ]}
              />
            </View>
            <TouchableOpacity
              style={styles.stepBtn}
              onPress={() => setTankTemp((t) => Math.min(32, t + 1))}
            >
              <Text style={styles.stepBtnText}>+</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.controlSubtext}>Ideal Tropical Range: 24°C - 28°C</Text>
        </View>

        {/* pH Chemistry Gauge */}
        <View style={styles.controlBox}>
          <View style={styles.controlBoxHeader}>
            <Text style={styles.controlBoxTitle}>🧪 pH Chemistry</Text>
            <Text style={styles.phBadge}>pH {tankPh.toFixed(1)}</Text>
          </View>
          <View style={styles.stepperRow}>
            <TouchableOpacity
              style={styles.stepBtn}
              onPress={() => setTankPh((p) => Math.max(6.0, Number((p - 0.2).toFixed(1))))}
            >
              <Text style={styles.stepBtnText}>−</Text>
            </TouchableOpacity>
            <View style={styles.stepperTrack}>
              <View
                style={[
                  styles.stepperFill,
                  {
                    width: `${((tankPh - 6.0) / (8.6 - 6.0)) * 100}%`,
                    backgroundColor: tankPh < 7.0 ? '#f59e0b' : '#38bdf8',
                  },
                ]}
              />
            </View>
            <TouchableOpacity
              style={styles.stepBtn}
              onPress={() => setTankPh((p) => Math.min(8.6, Number((p + 0.2).toFixed(1))))}
            >
              <Text style={styles.stepBtnText}>+</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.controlSubtext}>
            {waterType === 'Freshwater' ? 'Acidic - Neutral (6.5-7.5)' : 'Marine Alkaline (8.1-8.4)'}
          </Text>
        </View>

        {/* Lighting Atmosphere Mode */}
        <View style={styles.controlBox}>
          <Text style={styles.controlBoxTitle}>💡 Light Spectrum</Text>
          <View style={styles.buttonGroup}>
            {(['Daylight', 'Dusk', 'Actinic'] as const).map((mode) => (
              <TouchableOpacity
                key={mode}
                style={[
                  styles.modeButton,
                  lighting === mode && styles.modeButtonActive,
                ]}
                onPress={() => setLighting(mode)}
              >
                <Text
                  style={[
                    styles.modeButtonText,
                    lighting === mode && styles.modeButtonTextActive,
                  ]}
                >
                  {mode === 'Daylight' ? '☀️ Day' : mode === 'Dusk' ? '🌅 Dusk' : '🌙 Actinic'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Bubbles Aerator Pump */}
        <View style={styles.controlBox}>
          <Text style={styles.controlBoxTitle}>💨 Aerator Bubbler</Text>
          <TouchableOpacity
            style={[
              styles.aeratorToggle,
              bubblesActive ? styles.aeratorOn : styles.aeratorOff,
            ]}
            onPress={() => setBubblesActive(!bubblesActive)}
          >
            <Text style={styles.aeratorToggleText}>
              {bubblesActive ? '🫧 Aeration: Active (High O₂)' : '💤 Aeration: Off'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Resident Fish Chips */}
      {activeFish.length > 0 && (
        <View style={styles.rosterContainer}>
          <Text style={styles.rosterTitle}>
            Swimming Residents ({activeFish.length}):
          </Text>
          <View style={styles.rosterChipsRow}>
            {activeFish.map((fish) => (
              <View key={fish.id} style={styles.rosterChip}>
                <Image source={{ uri: fish.imageUrl }} style={styles.chipAvatar} />
                <TouchableOpacity onPress={() => onSelectFish(fish)}>
                  <Text style={styles.rosterChipName}>{fish.commonName}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.chipRemoveBtn}
                  onPress={() => onRemoveFishFromTank(fish.id)}
                >
                  <Text style={styles.chipRemoveText}>×</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0c1829',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#1e3a5f',
    padding: 16,
    marginBottom: 24,
    shadowColor: '#0ea5e9',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
  },
  tankHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  tankTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  tankTitleIcon: {
    fontSize: 28,
  },
  tankTitleText: {
    color: '#f8fafc',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  tankSubtitle: {
    color: '#94a3b8',
    fontSize: 12,
    marginTop: 2,
  },
  waterSwitchRow: {
    flexDirection: 'row',
    backgroundColor: '#08111e',
    borderRadius: 12,
    padding: 4,
    borderWidth: 1,
    borderColor: '#1e293b',
  },
  waterSwitchBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  waterSwitchActiveFresh: {
    backgroundColor: '#059669',
  },
  waterSwitchActiveSalt: {
    backgroundColor: '#0284c7',
  },
  waterSwitchBtnText: {
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: '600',
  },
  waterSwitchBtnTextActive: {
    color: '#ffffff',
  },
  glassAquarium: {
    height: 250,
    borderRadius: 16,
    borderWidth: 4,
    borderColor: '#38bdf840',
    position: 'relative',
    overflow: 'hidden',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
  },
  glassHighlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.15)',
  },
  waterSurfaceLine: {
    position: 'absolute',
    top: 38,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: '#7dd3fc55',
  },
  bubble: {
    position: 'absolute',
    bottom: 30,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.55)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
  },
  emptyTankMessage: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  emptyTankIcon: {
    fontSize: 40,
    marginBottom: 8,
  },
  emptyTankTitle: {
    color: '#e2e8f0',
    fontSize: 16,
    fontWeight: '700',
  },
  emptyTankSub: {
    color: '#94a3b8',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 4,
    lineHeight: 18,
  },
  swimmingFishContainer: {
    position: 'absolute',
    width: 90,
    height: 60,
    zIndex: 10,
  },
  fishTouchTarget: {
    alignItems: 'center',
  },
  swimmingFishAvatar: {
    width: 58,
    height: 42,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#ffffffdd',
    backgroundColor: '#0f172a',
  },
  fishNameBubble: {
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginTop: 3,
    borderWidth: 1,
    borderColor: '#38bdf866',
  },
  fishNameBubbleText: {
    color: '#f8fafc',
    fontSize: 10,
    fontWeight: '700',
  },
  substrateFloor: {
    height: 38,
    backgroundColor: '#0a1628',
    borderTopWidth: 2,
    borderTopColor: '#1e3a5f',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    zIndex: 5,
  },
  decorLeft: {
    fontSize: 20,
  },
  decorCenter: {
    fontSize: 18,
    letterSpacing: 4,
  },
  decorRight: {
    fontSize: 20,
  },
  warningBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#451a03',
    borderColor: '#b45309',
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginTop: 12,
  },
  warningIcon: {
    fontSize: 22,
  },
  warningText: {
    color: '#fed7aa',
    fontSize: 12,
    lineHeight: 18,
  },
  warningBold: {
    fontWeight: '700',
    color: '#fef08a',
  },
  controlPanel: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 16,
  },
  controlBox: {
    flex: 1,
    minWidth: 140,
    backgroundColor: '#08111e',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#1e293b',
  },
  controlBoxHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  controlBoxTitle: {
    color: '#cbd5e1',
    fontSize: 12,
    fontWeight: '600',
  },
  tempBadge: {
    fontSize: 11,
    fontWeight: '700',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  tempSafe: {
    backgroundColor: '#065f46',
    color: '#6ee7b7',
  },
  tempWarning: {
    backgroundColor: '#7c2d12',
    color: '#fdba74',
  },
  phBadge: {
    backgroundColor: '#1e3a5f',
    color: '#7dd3fc',
    fontSize: 11,
    fontWeight: '700',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  stepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginVertical: 4,
  },
  stepBtn: {
    width: 28,
    height: 28,
    backgroundColor: '#1e293b',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepBtnText: {
    color: '#f8fafc',
    fontSize: 16,
    fontWeight: '700',
  },
  stepperTrack: {
    flex: 1,
    height: 6,
    backgroundColor: '#1e293b',
    borderRadius: 3,
    overflow: 'hidden',
  },
  stepperFill: {
    height: '100%',
    backgroundColor: '#10b981',
    borderRadius: 3,
  },
  controlSubtext: {
    color: '#64748b',
    fontSize: 10,
    marginTop: 4,
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 8,
  },
  modeButton: {
    flex: 1,
    paddingVertical: 6,
    backgroundColor: '#1e293b',
    borderRadius: 6,
    alignItems: 'center',
  },
  modeButtonActive: {
    backgroundColor: '#0ea5e9',
  },
  modeButtonText: {
    color: '#94a3b8',
    fontSize: 10,
    fontWeight: '600',
  },
  modeButtonTextActive: {
    color: '#ffffff',
    fontWeight: '700',
  },
  aeratorToggle: {
    marginTop: 8,
    paddingVertical: 7,
    paddingHorizontal: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  aeratorOn: {
    backgroundColor: '#0369a1',
  },
  aeratorOff: {
    backgroundColor: '#1e293b',
  },
  aeratorToggleText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '600',
  },
  rosterContainer: {
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#1e293b',
  },
  rosterTitle: {
    color: '#94a3b8',
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  rosterChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  rosterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#08111e',
    borderRadius: 20,
    paddingVertical: 4,
    paddingLeft: 4,
    paddingRight: 8,
    borderWidth: 1,
    borderColor: '#1e3a5f',
  },
  chipAvatar: {
    width: 22,
    height: 22,
    borderRadius: 11,
  },
  rosterChipName: {
    color: '#e2e8f0',
    fontSize: 12,
    fontWeight: '500',
  },
  chipRemoveBtn: {
    paddingHorizontal: 4,
  },
  chipRemoveText: {
    color: '#94a3b8',
    fontSize: 14,
    fontWeight: '700',
  },
});
