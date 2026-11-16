import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { CareLevel, WaterType } from '../types/fish';

interface Props {
  searchQuery: string;
  onSearchChange: (text: string) => void;
  selectedWaterType: WaterType | 'All';
  onSelectWaterType: (type: WaterType | 'All') => void;
  selectedCareLevel: CareLevel | 'All';
  onSelectCareLevel: (level: CareLevel | 'All') => void;
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  categories: string[];
  totalCount: number;
  filteredCount: number;
  activeTankCount: number;
  onOpenTankView: () => void;
}

export const Header: React.FC<Props> = ({
  searchQuery,
  onSearchChange,
  selectedWaterType,
  onSelectWaterType,
  selectedCareLevel,
  onSelectCareLevel,
  selectedCategory,
  onSelectCategory,
  categories,
  totalCount,
  filteredCount,
  activeTankCount,
  onOpenTankView,
}) => {
  return (
    <View style={styles.header}>
      {/* Top Brand Bar */}
      <View style={styles.topBar}>
        <View style={styles.brandRow}>
          <View style={styles.logoBadge}>
            <Text style={styles.logoIcon}>🐠</Text>
          </View>
          <View>
            <View style={styles.brandTitleRow}>
              <Text style={styles.brandTitle}>AquaCare</Text>
              <View style={styles.versionTag}>
                <Text style={styles.versionTagText}>React Native</Text>
              </View>
            </View>
            <Text style={styles.brandTagline}>
              Aquarium Keeping & Species Care Encyclopedia
            </Text>
          </View>
        </View>

        {/* Virtual Tank Quick Pill */}
        <TouchableOpacity style={styles.tankPill} onPress={onOpenTankView}>
          <Text style={styles.tankPillIcon}>🫧</Text>
          <View>
            <Text style={styles.tankPillLabel}>Virtual Tank</Text>
            <Text style={styles.tankPillValue}>
              {activeTankCount} {activeTankCount === 1 ? 'fish' : 'fish'} swimming
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchWrapper}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by species name, scientific name, or family (e.g. Betta, Neon, Cichlid)..."
          placeholderTextColor="#64748b"
          value={searchQuery}
          onChangeText={onSearchChange}
          clearButtonMode="while-editing"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => onSearchChange('')} style={styles.clearBtn}>
            <Text style={styles.clearBtnText}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Primary Category Switch: All / Freshwater / Saltwater */}
      <View style={styles.primaryTabsRow}>
        {(['All', 'Freshwater', 'Saltwater'] as const).map((tab) => {
          const isActive = selectedWaterType === tab;
          return (
            <TouchableOpacity
              key={tab}
              style={[styles.primaryTab, isActive && styles.primaryTabActive]}
              onPress={() => onSelectWaterType(tab)}
            >
              <Text
                style={[
                  styles.primaryTabText,
                  isActive && styles.primaryTabTextActive,
                ]}
              >
                {tab === 'All' ? '🌐 All Species' : tab === 'Freshwater' ? '🌿 Freshwater' : '🪸 Saltwater'}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Secondary Horizontal Filter Pills */}
      <View style={styles.secondaryFiltersRow}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsScroll}
        >
          {/* Care Level Filters */}
          <Text style={styles.filterSectionLabel}>Care:</Text>
          {(['All', 'Beginner', 'Intermediate', 'Expert'] as const).map((level) => {
            const isActive = selectedCareLevel === level;
            return (
              <TouchableOpacity
                key={level}
                style={[styles.chip, isActive && styles.chipActive]}
                onPress={() => onSelectCareLevel(level)}
              >
                <Text style={[styles.chipText, isActive && styles.chipTextActive]}>
                  {level}
                </Text>
              </TouchableOpacity>
            );
          })}

          <View style={styles.chipDivider} />

          {/* Species Category / Family Filters */}
          <Text style={styles.filterSectionLabel}>Group:</Text>
          <TouchableOpacity
            style={[styles.chip, selectedCategory === 'All' && styles.chipActive]}
            onPress={() => onSelectCategory('All')}
          >
            <Text style={[styles.chipText, selectedCategory === 'All' && styles.chipTextActive]}>
              All Groups
            </Text>
          </TouchableOpacity>
          {categories.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <TouchableOpacity
                key={cat}
                style={[styles.chip, isActive && styles.chipActive]}
                onPress={() => onSelectCategory(cat)}
              >
                <Text style={[styles.chipText, isActive && styles.chipTextActive]}>
                  {cat}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Results Count Banner */}
      <View style={styles.countRow}>
        <Text style={styles.countText}>
          Showing <Text style={styles.countHighlight}>{filteredCount}</Text> of {totalCount} species
        </Text>
        <Text style={styles.statusIndicator}>
          • Temperature & pH verified data
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#071224',
    paddingTop: 24,
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1e3a5f',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 20,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logoBadge: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#0c2242',
    borderWidth: 1.5,
    borderColor: '#38bdf8',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#38bdf8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  logoIcon: {
    fontSize: 26,
  },
  brandTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  brandTitle: {
    color: '#f8fafc',
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  versionTag: {
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#0284c7',
  },
  versionTagText: {
    color: '#38bdf8',
    fontSize: 10,
    fontWeight: '700',
  },
  brandTagline: {
    color: '#94a3b8',
    fontSize: 12,
    marginTop: 2,
  },
  tankPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#0c2242',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#0284c7',
  },
  tankPillIcon: {
    fontSize: 22,
  },
  tankPillLabel: {
    color: '#38bdf8',
    fontSize: 12,
    fontWeight: '700',
  },
  tankPillValue: {
    color: '#cbd5e1',
    fontSize: 11,
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0c1829',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1e3a5f',
    paddingHorizontal: 12,
    marginBottom: 16,
    height: 46,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: '#f8fafc',
    fontSize: 14,
    height: '100%',
    outlineStyle: 'none' as any,
  },
  clearBtn: {
    padding: 6,
  },
  clearBtnText: {
    color: '#64748b',
    fontSize: 14,
  },
  primaryTabsRow: {
    flexDirection: 'row',
    backgroundColor: '#040d1a',
    padding: 4,
    borderRadius: 12,
    gap: 6,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#1e293b',
  },
  primaryTab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  primaryTabActive: {
    backgroundColor: '#0284c7',
  },
  primaryTabText: {
    color: '#94a3b8',
    fontSize: 13,
    fontWeight: '600',
  },
  primaryTabTextActive: {
    color: '#ffffff',
    fontWeight: '700',
  },
  secondaryFiltersRow: {
    marginBottom: 12,
  },
  chipsScroll: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  filterSectionLabel: {
    color: '#64748b',
    fontSize: 11,
    fontWeight: '700',
    marginRight: 2,
    textTransform: 'uppercase',
  },
  chip: {
    backgroundColor: '#0c1829',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#1e3a5f',
  },
  chipActive: {
    backgroundColor: '#0284c7',
    borderColor: '#38bdf8',
  },
  chipText: {
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: '500',
  },
  chipTextActive: {
    color: '#ffffff',
    fontWeight: '700',
  },
  chipDivider: {
    width: 1,
    height: 20,
    backgroundColor: '#1e293b',
    marginHorizontal: 4,
  },
  countRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
  },
  countText: {
    color: '#94a3b8',
    fontSize: 12,
  },
  countHighlight: {
    color: '#38bdf8',
    fontWeight: '700',
  },
  statusIndicator: {
    color: '#10b981',
    fontSize: 11,
  },
});
