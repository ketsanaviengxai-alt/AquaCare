import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  SafeAreaView,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import { FISH_SPECIES } from './src/data/fishData';
import { FishSpecies, WaterType, CareLevel } from './src/types/fish';
import { Header } from './src/components/Header';
import { AquariumTank } from './src/components/AquariumTank';
import { FishCard } from './src/components/FishCard';
import { FishDetailModal } from './src/components/FishDetailModal';
import { TankCompatibilityModal } from './src/components/TankCompatibilityModal';

export default function App() {
  const { width } = useWindowDimensions();

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedWaterType, setSelectedWaterType] = useState<WaterType | 'All'>('All');
  const [selectedCareLevel, setSelectedCareLevel] = useState<CareLevel | 'All'>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Tank State ("หม้อน้ำ" Simulator)
  const [tankWaterType, setTankWaterType] = useState<WaterType>('Freshwater');
  const [tankFishIds, setTankFishIds] = useState<string[]>([
    'betta-splendens',
    'neon-tetra',
    'freshwater-angelfish',
  ]);

  // Modals
  const [selectedFish, setSelectedFish] = useState<FishSpecies | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);
  const [isCompatibilityModalOpen, setIsCompatibilityModalOpen] = useState<boolean>(false);

  // Extract all unique species categories/groups
  const categories = useMemo(() => {
    const set = new Set<string>();
    FISH_SPECIES.forEach((f) => set.add(f.category));
    return Array.from(set);
  }, []);

  // Filtered Fish List
  const filteredFish = useMemo(() => {
    return FISH_SPECIES.filter((fish) => {
      // Water Type filter
      if (selectedWaterType !== 'All' && fish.waterType !== selectedWaterType) {
        return false;
      }
      // Care Level filter
      if (selectedCareLevel !== 'All' && fish.careLevel !== selectedCareLevel) {
        return false;
      }
      // Category filter
      if (selectedCategory !== 'All' && fish.category !== selectedCategory) {
        return false;
      }
      // Search query
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        const matchesName = fish.commonName.toLowerCase().includes(query);
        const matchesSci = fish.scientificName.toLowerCase().includes(query);
        const matchesFamily = fish.family.toLowerCase().includes(query);
        const matchesCategory = fish.category.toLowerCase().includes(query);
        if (!matchesName && !matchesSci && !matchesFamily && !matchesCategory) {
          return false;
        }
      }
      return true;
    });
  }, [searchQuery, selectedWaterType, selectedCareLevel, selectedCategory]);

  // Fish objects currently in the tank
  const activeTankFish = useMemo(() => {
    return tankFishIds
      .map((id) => FISH_SPECIES.find((f) => f.id === id))
      .filter((f): f is FishSpecies => Boolean(f));
  }, [tankFishIds]);

  // Actions
  const handleToggleFishInTank = (fishId: string) => {
    if (tankFishIds.includes(fishId)) {
      setTankFishIds((prev) => prev.filter((id) => id !== fishId));
    } else {
      setTankFishIds((prev) => [...prev, fishId]);
      // If adding a saltwater fish and tank was fresh, notify or optionally switch
      const fishObj = FISH_SPECIES.find((f) => f.id === fishId);
      if (fishObj && fishObj.waterType !== tankWaterType) {
        // Automatically align tank water if tank was empty or switch as convenient
        if (tankFishIds.length === 0) {
          setTankWaterType(fishObj.waterType);
        }
      }
    }
  };

  const handleOpenFishDetail = (fish: FishSpecies) => {
    setSelectedFish(fish);
    setIsDetailModalOpen(true);
  };

  const handleToggleWaterType = (type: WaterType) => {
    setTankWaterType(type);
  };

  // Determine grid columns based on screen width
  const isDesktop = width >= 960;
  const isTablet = width >= 640 && width < 960;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
        {/* Main Header with Search & Filter Tabs */}
        <Header
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedWaterType={selectedWaterType}
          onSelectWaterType={(type) => {
            setSelectedWaterType(type);
            if (type !== 'All') {
              setTankWaterType(type);
            }
          }}
          selectedCareLevel={selectedCareLevel}
          onSelectCareLevel={setSelectedCareLevel}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          categories={categories}
          totalCount={FISH_SPECIES.length}
          filteredCount={filteredFish.length}
          activeTankCount={activeTankFish.length}
          onOpenTankView={() => setIsCompatibilityModalOpen(true)}
        />

        {/* Inner Content Area */}
        <View style={styles.contentWrapper}>
          {/* Virtual Aquarium Tank Component (หม้อน้ำ / ตู้ปลาจำลอง) */}
          <AquariumTank
            activeFish={activeTankFish}
            waterType={tankWaterType}
            onSelectFish={handleOpenFishDetail}
            onRemoveFishFromTank={(id) =>
              setTankFishIds((prev) => prev.filter((fishId) => fishId !== id))
            }
            onToggleWaterType={handleToggleWaterType}
          />

          {/* Section Heading & Quick Toolbar */}
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>
                {selectedWaterType === 'All'
                  ? 'All Aquarium Species'
                  : `${selectedWaterType} Species`}
              </Text>
              <Text style={styles.sectionSubtitle}>
                Verified biological profiles, environmental parameters, and care guidelines
              </Text>
            </View>

            <TouchableOpacity
              style={styles.compatBtn}
              onPress={() => setIsCompatibilityModalOpen(true)}
            >
              <Text style={styles.compatBtnText}>
                ⚡ Compatibility Report ({activeTankFish.length})
              </Text>
            </TouchableOpacity>
          </View>

          {/* Species Cards Grid */}
          {filteredFish.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>🔍</Text>
              <Text style={styles.emptyTitle}>No Matching Fish Found</Text>
              <Text style={styles.emptyText}>
                Try adjusting your search keywords or resetting your care level and category filters.
              </Text>
              <TouchableOpacity
                style={styles.resetBtn}
                onPress={() => {
                  setSearchQuery('');
                  setSelectedWaterType('All');
                  setSelectedCareLevel('All');
                  setSelectedCategory('All');
                }}
              >
                <Text style={styles.resetBtnText}>Reset All Filters</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View
              style={[
                styles.gridContainer,
                isDesktop && styles.gridDesktop,
                isTablet && styles.gridTablet,
              ]}
            >
              {filteredFish.map((fish) => (
                <View
                  key={fish.id}
                  style={[
                    styles.gridItem,
                    isDesktop
                      ? { width: '31.8%' }
                      : isTablet
                      ? { width: '48.5%' }
                      : { width: '100%' },
                  ]}
                >
                  <FishCard
                    fish={fish}
                    isInTank={tankFishIds.includes(fish.id)}
                    onPressDetails={() => handleOpenFishDetail(fish)}
                    onToggleTank={() => handleToggleFishInTank(fish.id)}
                  />
                </View>
              ))}
            </View>
          )}

          {/* Educational Aquatic Guide Footer Banner */}
          <View style={styles.guideBanner}>
            <View style={styles.guideHeader}>
              <Text style={styles.guideIcon}>📘</Text>
              <Text style={styles.guideTitle}>Aquarium Husbandry Quick Principles</Text>
            </View>
            <View style={styles.guideGrid}>
              <View style={styles.guideItem}>
                <Text style={styles.guideItemTitle}>1. The Nitrogen Cycle</Text>
                <Text style={styles.guideItemDesc}>
                  Never add fish to an uncycled tank. Establish beneficial nitrifying bacteria
                  for 2–4 weeks until ammonia and nitrite consistently test at 0 ppm.
                </Text>
              </View>
              <View style={styles.guideItem}>
                <Text style={styles.guideItemTitle}>2. Temperature Stability</Text>
                <Text style={styles.guideItemDesc}>
                  Use a calibrated submersible heater with an external thermometer. Temperature
                  swings exceeding 2°C (4°F) stress fish immune defenses.
                </Text>
              </View>
              <View style={styles.guideItem}>
                <Text style={styles.guideItemTitle}>3. Weekly Water Maintenance</Text>
                <Text style={styles.guideItemDesc}>
                  Perform 20%–25% weekly water changes using dechlorinated water to replenish
                  vital trace minerals and maintain low nitrate levels.
                </Text>
              </View>
            </View>
          </View>

          {/* Footer copyright */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              AquaCare Encyclopedia • Biological Data Verified via Scientific Registries
            </Text>
            <Text style={styles.footerSub}>
              Designed for Web & Mobile with React Native
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Full Species Dossier Modal */}
      <FishDetailModal
        fish={selectedFish}
        isInTank={Boolean(selectedFish && tankFishIds.includes(selectedFish.id))}
        visible={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        onToggleTank={() => {
          if (selectedFish) {
            handleToggleFishInTank(selectedFish.id);
          }
        }}
      />

      {/* Tank Compatibility Report Modal */}
      <TankCompatibilityModal
        visible={isCompatibilityModalOpen}
        onClose={() => setIsCompatibilityModalOpen(false)}
        activeFish={activeTankFish}
        onRemoveFish={(id) => setTankFishIds((prev) => prev.filter((fishId) => fishId !== id))}
        onClearAll={() => setTankFishIds([])}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#060e1a',
  },
  container: {
    flex: 1,
    backgroundColor: '#060e1a',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  contentWrapper: {
    maxWidth: 1200,
    width: '100%',
    alignSelf: 'center',
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  sectionTitle: {
    color: '#f8fafc',
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  sectionSubtitle: {
    color: '#94a3b8',
    fontSize: 13,
    marginTop: 2,
  },
  compatBtn: {
    backgroundColor: '#08111e',
    borderColor: '#38bdf8',
    borderWidth: 1.5,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    shadowColor: '#38bdf8',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  compatBtnText: {
    color: '#38bdf8',
    fontSize: 12,
    fontWeight: '700',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  gridDesktop: {
    justifyContent: 'space-between',
  },
  gridTablet: {
    justifyContent: 'space-between',
  },
  gridItem: {
    marginBottom: 4,
  },
  emptyContainer: {
    padding: 60,
    backgroundColor: '#0c1829',
    borderRadius: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1e3a5f',
    marginVertical: 20,
  },
  emptyIcon: {
    fontSize: 44,
    marginBottom: 12,
  },
  emptyTitle: {
    color: '#f8fafc',
    fontSize: 18,
    fontWeight: '700',
  },
  emptyText: {
    color: '#94a3b8',
    fontSize: 13,
    textAlign: 'center',
    marginTop: 6,
    maxWidth: 400,
    lineHeight: 20,
  },
  resetBtn: {
    marginTop: 16,
    backgroundColor: '#0284c7',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10,
  },
  resetBtnText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
  guideBanner: {
    backgroundColor: '#08111e',
    borderRadius: 20,
    padding: 24,
    marginTop: 36,
    borderWidth: 1,
    borderColor: '#1e3a5f',
  },
  guideHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  guideIcon: {
    fontSize: 24,
  },
  guideTitle: {
    color: '#f8fafc',
    fontSize: 18,
    fontWeight: '700',
  },
  guideGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  guideItem: {
    flex: 1,
    minWidth: 260,
    backgroundColor: '#0c1829',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#1e293b',
  },
  guideItemTitle: {
    color: '#38bdf8',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 6,
  },
  guideItemDesc: {
    color: '#94a3b8',
    fontSize: 12,
    lineHeight: 18,
  },
  footer: {
    paddingVertical: 30,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#1e293b',
    marginTop: 36,
  },
  footerText: {
    color: '#64748b',
    fontSize: 12,
  },
  footerSub: {
    color: '#475569',
    fontSize: 11,
    marginTop: 4,
  },
});
