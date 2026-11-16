import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { FishSpecies } from '../types/fish';

interface Props {
  fish: FishSpecies;
  isInTank: boolean;
  onPressDetails: () => void;
  onToggleTank: () => void;
}

export const FishCard: React.FC<Props> = ({
  fish,
  isInTank,
  onPressDetails,
  onToggleTank,
}) => {
  const getCareBadgeStyle = (level: string) => {
    switch (level) {
      case 'Beginner':
        return { bg: '#064e3b', text: '#6ee7b7' };
      case 'Intermediate':
        return { bg: '#713f12', text: '#fde047' };
      case 'Expert':
        return { bg: '#881337', text: '#fda4af' };
      default:
        return { bg: '#1e293b', text: '#cbd5e1' };
    }
  };

  const careBadge = getCareBadgeStyle(fish.careLevel);

  return (
    <View style={styles.card}>
      {/* Species Image with Badges */}
      <TouchableOpacity activeOpacity={0.9} onPress={onPressDetails} style={styles.imageContainer}>
        <Image
          source={{ uri: fish.imageUrl }}
          style={styles.image}
          resizeMode="cover"
        />
        {/* Floating water type badge */}
        <View
          style={[
            styles.waterBadge,
            fish.waterType === 'Freshwater' ? styles.waterFresh : styles.waterSalt,
          ]}
        >
          <Text style={styles.waterBadgeText}>
            {fish.waterType === 'Freshwater' ? '🌿 Freshwater' : '🪸 Saltwater'}
          </Text>
        </View>

        {/* Floating care level badge */}
        <View style={[styles.careBadge, { backgroundColor: careBadge.bg }]}>
          <Text style={[styles.careBadgeText, { color: careBadge.text }]}>
            {fish.careLevel}
          </Text>
        </View>
      </TouchableOpacity>

      {/* Content Section */}
      <View style={styles.content}>
        <TouchableOpacity activeOpacity={0.8} onPress={onPressDetails}>
          <Text style={styles.commonName} numberOfLines={1}>
            {fish.commonName}
          </Text>
          <Text style={styles.scientificName} numberOfLines={1}>
            {fish.scientificName}
          </Text>
        </TouchableOpacity>

        <Text style={styles.familyBadge}>
          {fish.family} • {fish.temperament}
        </Text>

        {/* Environmental Parameters Grid */}
        <View style={styles.paramGrid}>
          <View style={styles.paramItem}>
            <Text style={styles.paramLabel}>TEMP</Text>
            <Text style={styles.paramValue}>
              {fish.tempMinC}° - {fish.tempMaxC}°C
            </Text>
          </View>
          <View style={styles.paramItem}>
            <Text style={styles.paramLabel}>PH</Text>
            <Text style={styles.paramValue}>
              {fish.phMin} - {fish.phMax}
            </Text>
          </View>
          <View style={styles.paramItem}>
            <Text style={styles.paramLabel}>MIN TANK</Text>
            <Text style={styles.paramValue}>
              {fish.minTankSizeGallons} Gal ({fish.minTankSizeLiters}L)
            </Text>
          </View>
        </View>

        {/* Quick Excerpt */}
        <Text style={styles.description} numberOfLines={2}>
          {fish.description}
        </Text>

        {/* Action Buttons */}
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={[
              styles.tankBtn,
              isInTank ? styles.tankBtnRemove : styles.tankBtnAdd,
            ]}
            onPress={onToggleTank}
          >
            <Text style={styles.tankBtnText}>
              {isInTank ? '✓ In Tank' : '+ Add to Tank'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.detailsBtn} onPress={onPressDetails}>
            <Text style={styles.detailsBtnText}>Full Guide →</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#0c1829',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#1e3a5f',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
  },
  imageContainer: {
    height: 180,
    width: '100%',
    position: 'relative',
    backgroundColor: '#091322',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  waterBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  waterFresh: {
    backgroundColor: 'rgba(5, 150, 105, 0.9)',
  },
  waterSalt: {
    backgroundColor: 'rgba(2, 132, 199, 0.9)',
  },
  waterBadgeText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '700',
  },
  careBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  careBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  content: {
    padding: 14,
  },
  commonName: {
    color: '#f8fafc',
    fontSize: 16,
    fontWeight: '700',
  },
  scientificName: {
    color: '#38bdf8',
    fontSize: 13,
    fontStyle: 'italic',
    marginTop: 2,
  },
  familyBadge: {
    color: '#94a3b8',
    fontSize: 11,
    marginTop: 4,
  },
  paramGrid: {
    flexDirection: 'row',
    backgroundColor: '#08111e',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 10,
    marginVertical: 10,
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#1e293b',
  },
  paramItem: {
    alignItems: 'center',
    flex: 1,
  },
  paramLabel: {
    color: '#64748b',
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  paramValue: {
    color: '#e2e8f0',
    fontSize: 11,
    fontWeight: '600',
  },
  description: {
    color: '#94a3b8',
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 12,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 8,
  },
  tankBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tankBtnAdd: {
    backgroundColor: '#0284c7',
  },
  tankBtnRemove: {
    backgroundColor: '#0f766e',
  },
  tankBtnText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  detailsBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#1e293b',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailsBtnText: {
    color: '#38bdf8',
    fontSize: 12,
    fontWeight: '600',
  },
});
