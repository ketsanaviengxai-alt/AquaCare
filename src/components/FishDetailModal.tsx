import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Image,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { FishSpecies } from '../types/fish';

interface Props {
  fish: FishSpecies | null;
  isInTank: boolean;
  visible: boolean;
  onClose: () => void;
  onToggleTank: () => void;
}

export const FishDetailModal: React.FC<Props> = ({
  fish,
  isInTank,
  visible,
  onClose,
  onToggleTank,
}) => {
  if (!fish) return null;

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          {/* Header Bar */}
          <View style={styles.headerBar}>
            <View style={{ flex: 1 }}>
              <Text style={styles.headerCategory}>{fish.category}</Text>
              <Text style={styles.headerTitle}>{fish.commonName}</Text>
            </View>
            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <Text style={styles.closeBtnText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={true}>
            {/* Hero Image */}
            <View style={styles.heroImageWrapper}>
              <Image source={{ uri: fish.imageUrl }} style={styles.heroImage} resizeMode="cover" />
              <View style={styles.heroGradientOverlay} />
              <View style={styles.heroBadgeRow}>
                <View
                  style={[
                    styles.heroBadge,
                    fish.waterType === 'Freshwater' ? styles.freshBadge : styles.saltBadge,
                  ]}
                >
                  <Text style={styles.heroBadgeText}>
                    {fish.waterType === 'Freshwater' ? '🌿 Freshwater' : '🪸 Saltwater'}
                  </Text>
                </View>
                <View style={styles.heroBadgeNeutral}>
                  <Text style={styles.heroBadgeText}>{fish.careLevel} Care</Text>
                </View>
              </View>
            </View>

            {/* Scientific Identity */}
            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>Scientific Classification</Text>
              <View style={styles.gridTwoCol}>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Scientific Name:</Text>
                  <Text style={styles.infoValueItalic}>{fish.scientificName}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Family:</Text>
                  <Text style={styles.infoValue}>{fish.family}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Natural Origin:</Text>
                  <Text style={styles.infoValue}>{fish.origin}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Lifespan:</Text>
                  <Text style={styles.infoValue}>{fish.lifespanYears}</Text>
                </View>
              </View>
            </View>

            {/* Water Chemistry & Environmental Requirements */}
            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>Water Parameters & Environment</Text>
              <View style={styles.paramCardsRow}>
                <View style={styles.paramStatBox}>
                  <Text style={styles.paramStatEmoji}>🌡️</Text>
                  <Text style={styles.paramStatTitle}>Temperature</Text>
                  <Text style={styles.paramStatValue}>
                    {fish.tempMinC}°C - {fish.tempMaxC}°C
                  </Text>
                  <Text style={styles.paramStatSub}>
                    ({fish.tempMinF}°F - {fish.tempMaxF}°F)
                  </Text>
                </View>

                <View style={styles.paramStatBox}>
                  <Text style={styles.paramStatEmoji}>🧪</Text>
                  <Text style={styles.paramStatTitle}>pH Range</Text>
                  <Text style={styles.paramStatValue}>
                    {fish.phMin} - {fish.phMax}
                  </Text>
                  <Text style={styles.paramStatSub}>
                    {fish.phMax <= 7.0 ? 'Acidic' : fish.phMin >= 7.5 ? 'Alkaline' : 'Neutral'}
                  </Text>
                </View>

                <View style={styles.paramStatBox}>
                  <Text style={styles.paramStatEmoji}>🛡️</Text>
                  <Text style={styles.paramStatTitle}>Min Tank Size</Text>
                  <Text style={styles.paramStatValue}>{fish.minTankSizeGallons} Gallons</Text>
                  <Text style={styles.paramStatSub}>({fish.minTankSizeLiters} Liters)</Text>
                </View>
              </View>

              {fish.waterType === 'Saltwater' && fish.specificGravity && (
                <View style={styles.salinityBanner}>
                  <Text style={styles.salinityText}>
                    Specific Gravity: <Text style={styles.bold}>{fish.specificGravity}</Text>
                  </Text>
                </View>
              )}

              {fish.hardnessMinDgh !== undefined && (
                <View style={styles.salinityBanner}>
                  <Text style={styles.salinityText}>
                    Water Hardness: <Text style={styles.bold}>{fish.hardnessMinDgh} - {fish.hardnessMaxDgh} dGH</Text>
                  </Text>
                </View>
              )}
            </View>

            {/* Tank Setup & Behavior */}
            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>Aquarium Setup & Behavior</Text>
              <View style={styles.specList}>
                <View style={styles.specListItem}>
                  <Text style={styles.specListBullet}>•</Text>
                  <Text style={styles.specListText}>
                    <Text style={styles.bold}>Max Adult Size: </Text>
                    {fish.maxSizeInches} inches ({fish.maxSizeCm} cm)
                  </Text>
                </View>
                <View style={styles.specListItem}>
                  <Text style={styles.specListBullet}>•</Text>
                  <Text style={styles.specListText}>
                    <Text style={styles.bold}>Temperament: </Text>
                    {fish.temperament}
                  </Text>
                </View>
                <View style={styles.specListItem}>
                  <Text style={styles.specListBullet}>•</Text>
                  <Text style={styles.specListText}>
                    <Text style={styles.bold}>Swimming Region: </Text>
                    {fish.swimmingLevel} of the water column
                  </Text>
                </View>
                <View style={styles.specListItem}>
                  <Text style={styles.specListBullet}>•</Text>
                  <Text style={styles.specListText}>
                    <Text style={styles.bold}>Water Flow: </Text>
                    {fish.waterFlow} current
                  </Text>
                </View>
                {fish.schoolingSize && (
                  <View style={styles.specListItem}>
                    <Text style={styles.specListBullet}>•</Text>
                    <Text style={styles.specListText}>
                      <Text style={styles.bold}>Social Preference: </Text>
                      {fish.schoolingSize}
                    </Text>
                  </View>
                )}
              </View>

              <Text style={styles.paragraphHeader}>Tank Decor & Environment:</Text>
              <Text style={styles.paragraphText}>{fish.tankSetup}</Text>
            </View>

            {/* Diet & Nutrition */}
            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>Diet & Nutrition ({fish.diet})</Text>
              <Text style={styles.paragraphText}>{fish.dietDetails}</Text>
            </View>

            {/* Tank Mates Compatibility */}
            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>Tank Mates Compatibility</Text>
              <Text style={styles.subCategoryTitle}>✓ Recommended Tank Companions:</Text>
              <View style={styles.tagWrap}>
                {fish.compatibleTankMates.map((mate, idx) => (
                  <View key={idx} style={styles.compatTag}>
                    <Text style={styles.compatTagText}>{mate}</Text>
                  </View>
                ))}
              </View>

              <Text style={[styles.subCategoryTitle, { marginTop: 12 }]}>✕ Species to Avoid:</Text>
              <View style={styles.tagWrap}>
                {fish.incompatibleTankMates.map((incomp, idx) => (
                  <View key={idx} style={styles.incompatTag}>
                    <Text style={styles.incompatTagText}>{incomp}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Practical Care Tips */}
            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>Care Masterclass & Tips</Text>
              {fish.careTips.map((tip, idx) => (
                <View key={idx} style={styles.tipRow}>
                  <Text style={styles.tipIcon}>💡</Text>
                  <Text style={styles.tipText}>{tip}</Text>
                </View>
              ))}
            </View>

            <View style={{ height: 40 }} />
          </ScrollView>

          {/* Footer Actions */}
          <View style={styles.footerBar}>
            <TouchableOpacity
              style={[
                styles.tankActionBtn,
                isInTank ? styles.tankActionBtnRemove : styles.tankActionBtnAdd,
              ]}
              onPress={onToggleTank}
            >
              <Text style={styles.tankActionBtnText}>
                {isInTank ? '✓ Remove from Aquarium' : '+ Place in Aquarium Tank'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.doneBtn} onPress={onClose}>
              <Text style={styles.doneBtnText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(3, 7, 18, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalContainer: {
    width: '100%',
    maxWidth: 680,
    maxHeight: '90%',
    backgroundColor: '#0c1829',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#1e3a5f',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.5,
    shadowRadius: 30,
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
    backgroundColor: '#08111e',
  },
  headerCategory: {
    color: '#0ea5e9',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  headerTitle: {
    color: '#f8fafc',
    fontSize: 20,
    fontWeight: '800',
    marginTop: 2,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#1e293b',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnText: {
    color: '#cbd5e1',
    fontSize: 16,
    fontWeight: '700',
  },
  scrollContent: {
    padding: 20,
  },
  heroImageWrapper: {
    height: 240,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#020617',
    marginBottom: 20,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroGradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(12, 24, 41, 0.25)',
  },
  heroBadgeRow: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    flexDirection: 'row',
    gap: 8,
  },
  heroBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  freshBadge: {
    backgroundColor: '#059669',
  },
  saltBadge: {
    backgroundColor: '#0284c7',
  },
  heroBadgeNeutral: {
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#334155',
  },
  heroBadgeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  sectionCard: {
    backgroundColor: '#08111e',
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#1e293b',
  },
  sectionTitle: {
    color: '#38bdf8',
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 12,
    letterSpacing: 0.3,
  },
  gridTwoCol: {
    gap: 8,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#0f172a',
  },
  infoLabel: {
    color: '#94a3b8',
    fontSize: 13,
  },
  infoValue: {
    color: '#f8fafc',
    fontSize: 13,
    fontWeight: '600',
  },
  infoValueItalic: {
    color: '#38bdf8',
    fontSize: 13,
    fontStyle: 'italic',
    fontWeight: '600',
  },
  paramCardsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
  },
  paramStatBox: {
    flex: 1,
    backgroundColor: '#0c1829',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1e3a5f',
  },
  paramStatEmoji: {
    fontSize: 20,
    marginBottom: 4,
  },
  paramStatTitle: {
    color: '#94a3b8',
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  paramStatValue: {
    color: '#f8fafc',
    fontSize: 13,
    fontWeight: '700',
    marginTop: 2,
    textAlign: 'center',
  },
  paramStatSub: {
    color: '#64748b',
    fontSize: 10,
    marginTop: 2,
  },
  salinityBanner: {
    backgroundColor: '#0f172a',
    padding: 8,
    borderRadius: 8,
    marginTop: 6,
  },
  salinityText: {
    color: '#cbd5e1',
    fontSize: 12,
    textAlign: 'center',
  },
  bold: {
    fontWeight: '700',
    color: '#f8fafc',
  },
  specList: {
    gap: 6,
    marginBottom: 12,
  },
  specListItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
  },
  specListBullet: {
    color: '#0ea5e9',
    fontSize: 14,
    lineHeight: 18,
  },
  specListText: {
    color: '#cbd5e1',
    fontSize: 13,
    lineHeight: 18,
    flex: 1,
  },
  paragraphHeader: {
    color: '#e2e8f0',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 4,
  },
  paragraphText: {
    color: '#94a3b8',
    fontSize: 13,
    lineHeight: 20,
  },
  subCategoryTitle: {
    color: '#cbd5e1',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 6,
  },
  tagWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  compatTag: {
    backgroundColor: '#064e3b',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  compatTagText: {
    color: '#a7f3d0',
    fontSize: 11,
    fontWeight: '600',
  },
  incompatTag: {
    backgroundColor: '#450a0a',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  incompatTagText: {
    color: '#fecaca',
    fontSize: 11,
    fontWeight: '600',
  },
  tipRow: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  tipIcon: {
    fontSize: 16,
    marginTop: 2,
  },
  tipText: {
    color: '#cbd5e1',
    fontSize: 12,
    lineHeight: 18,
    flex: 1,
  },
  footerBar: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#1e293b',
    backgroundColor: '#08111e',
    gap: 12,
  },
  tankActionBtn: {
    flex: 2,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tankActionBtnAdd: {
    backgroundColor: '#0284c7',
  },
  tankActionBtnRemove: {
    backgroundColor: '#0f766e',
  },
  tankActionBtnText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
  doneBtn: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: '#1e293b',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  doneBtnText: {
    color: '#f8fafc',
    fontSize: 13,
    fontWeight: '600',
  },
});
