import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { FishSpecies } from '../types/fish';

interface Props {
  visible: boolean;
  onClose: () => void;
  activeFish: FishSpecies[];
  onRemoveFish: (id: string) => void;
  onClearAll: () => void;
}

export const TankCompatibilityModal: React.FC<Props> = ({
  visible,
  onClose,
  activeFish,
  onRemoveFish,
  onClearAll,
}) => {
  // Compute analytics
  const freshwaterCount = activeFish.filter((f) => f.waterType === 'Freshwater').length;
  const saltwaterCount = activeFish.filter((f) => f.waterType === 'Saltwater').length;
  const hasSalinityConflict = freshwaterCount > 0 && saltwaterCount > 0;

  // Temperature overlap check
  const maxMinTemp = activeFish.length > 0 ? Math.max(...activeFish.map((f) => f.tempMinC)) : 0;
  const minMaxTemp = activeFish.length > 0 ? Math.min(...activeFish.map((f) => f.tempMaxC)) : 0;
  const hasTempConflict = activeFish.length > 1 && maxMinTemp > minMaxTemp;

  // pH overlap check
  const maxMinPh = activeFish.length > 0 ? Math.max(...activeFish.map((f) => f.phMin)) : 0;
  const minMaxPh = activeFish.length > 0 ? Math.min(...activeFish.map((f) => f.phMax)) : 0;
  const hasPhConflict = activeFish.length > 1 && maxMinPh > minMaxPh;

  // Tank size required
  const maxSingleTankReq =
    activeFish.length > 0 ? Math.max(...activeFish.map((f) => f.minTankSizeGallons)) : 0;
  const recommendedVolume = Math.max(
    maxSingleTankReq,
    activeFish.reduce((acc, f) => acc + f.minTankSizeGallons * 0.5, 0)
  );

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.headerBar}>
            <View>
              <Text style={styles.title}>Aquarium Compatibility Report</Text>
              <Text style={styles.subtitle}>
                Scientific multi-species biotope & water analysis
              </Text>
            </View>
            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <Text style={styles.closeBtnText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollContent}>
            {activeFish.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyIcon}>🧪</Text>
                <Text style={styles.emptyTitle}>No Fish Selected</Text>
                <Text style={styles.emptySubtitle}>
                  Add two or more fish from the list to run an automated biological compatibility check.
                </Text>
              </View>
            ) : (
              <>
                {/* Overall Score Card */}
                <View
                  style={[
                    styles.scoreCard,
                    hasSalinityConflict || hasTempConflict
                      ? styles.scoreCardDanger
                      : styles.scoreCardSuccess,
                  ]}
                >
                  <Text style={styles.scoreEmoji}>
                    {hasSalinityConflict || hasTempConflict ? '⚠️' : '✅'}
                  </Text>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.scoreTitle}>
                      {hasSalinityConflict
                        ? 'Fatal Water Salinity Incompatibility'
                        : hasTempConflict
                        ? 'Water Temperature Mismatch'
                        : 'Biologically Compatible Setup'}
                    </Text>
                    <Text style={styles.scoreDesc}>
                      {hasSalinityConflict
                        ? 'Freshwater and marine fish cannot be kept in the same aquarium.'
                        : hasTempConflict
                        ? `The selected fish have mutually exclusive temperature envelopes (Requires ${maxMinTemp}°C vs Max ${minMaxTemp}°C).`
                        : 'All resident fish share overlapping temperature, pH, and environmental requirements!'}
                    </Text>
                  </View>
                </View>

                {/* Compatibility Diagnostics Grid */}
                <View style={styles.diagnosticsGrid}>
                  {/* Salinity Diagnostic */}
                  <View style={styles.diagItem}>
                    <Text style={styles.diagTitle}>Salinity Match</Text>
                    <Text
                      style={[
                        styles.diagStatus,
                        hasSalinityConflict ? styles.statusBad : styles.statusGood,
                      ]}
                    >
                      {hasSalinityConflict ? 'Fail: Mixed Types' : 'Pass: Single Biotope'}
                    </Text>
                    <Text style={styles.diagDetail}>
                      {freshwaterCount} Freshwater • {saltwaterCount} Saltwater
                    </Text>
                  </View>

                  {/* Temperature Overlap */}
                  <View style={styles.diagItem}>
                    <Text style={styles.diagTitle}>Temperature Overlap</Text>
                    <Text
                      style={[
                        styles.diagStatus,
                        hasTempConflict ? styles.statusBad : styles.statusGood,
                      ]}
                    >
                      {hasTempConflict
                        ? 'No Safe Range'
                        : `${maxMinTemp}°C - ${minMaxTemp}°C`}
                    </Text>
                    <Text style={styles.diagDetail}>
                      {hasTempConflict
                        ? 'Fish would suffer from thermal shock'
                        : 'Safe thermostat window'}
                    </Text>
                  </View>

                  {/* pH Overlap */}
                  <View style={styles.diagItem}>
                    <Text style={styles.diagTitle}>pH Range Match</Text>
                    <Text
                      style={[
                        styles.diagStatus,
                        hasPhConflict ? styles.statusBad : styles.statusGood,
                      ]}
                    >
                      {hasPhConflict
                        ? 'Conflicting pH'
                        : `pH ${maxMinPh.toFixed(1)} - ${minMaxPh.toFixed(1)}`}
                    </Text>
                    <Text style={styles.diagDetail}>
                      {hasPhConflict ? 'Parameters diverge' : 'Compatible water chemistry'}
                    </Text>
                  </View>

                  {/* Tank Size Recommendation */}
                  <View style={styles.diagItem}>
                    <Text style={styles.diagTitle}>Min Aquarium Size</Text>
                    <Text style={[styles.diagStatus, styles.statusInfo]}>
                      ~{Math.round(recommendedVolume)} Gallons
                    </Text>
                    <Text style={styles.diagDetail}>
                      ~{Math.round(recommendedVolume * 3.785)} Liters for healthy bioload
                    </Text>
                  </View>
                </View>

                {/* Selected Fish List */}
                <View style={styles.section}>
                  <View style={styles.sectionHeaderRow}>
                    <Text style={styles.sectionTitle}>
                      Residents Under Evaluation ({activeFish.length})
                    </Text>
                    <TouchableOpacity onPress={onClearAll}>
                      <Text style={styles.clearAllText}>Clear All</Text>
                    </TouchableOpacity>
                  </View>

                  {activeFish.map((fish) => (
                    <View key={fish.id} style={styles.fishItemRow}>
                      <Image source={{ uri: fish.imageUrl }} style={styles.fishThumb} />
                      <View style={{ flex: 1 }}>
                        <Text style={styles.fishItemName}>{fish.commonName}</Text>
                        <Text style={styles.fishItemSpecs}>
                          {fish.waterType} • {fish.tempMinC}°-{fish.tempMaxC}°C • pH{' '}
                          {fish.phMin}-{fish.phMax} • {fish.temperament}
                        </Text>
                      </View>
                      <TouchableOpacity
                        style={styles.removeBtn}
                        onPress={() => onRemoveFish(fish.id)}
                      >
                        <Text style={styles.removeBtnText}>Remove</Text>
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              </>
            )}
          </ScrollView>

          {/* Footer */}
          <View style={styles.footer}>
            <TouchableOpacity style={styles.closeFooterBtn} onPress={onClose}>
              <Text style={styles.closeFooterBtnText}>Return to Guide</Text>
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
    maxWidth: 640,
    maxHeight: '85%',
    backgroundColor: '#0c1829',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#1e3a5f',
    overflow: 'hidden',
  },
  headerBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
    backgroundColor: '#08111e',
  },
  title: {
    color: '#f8fafc',
    fontSize: 18,
    fontWeight: '700',
  },
  subtitle: {
    color: '#94a3b8',
    fontSize: 12,
    marginTop: 2,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#1e293b',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnText: {
    color: '#94a3b8',
    fontSize: 14,
    fontWeight: '700',
  },
  scrollContent: {
    padding: 20,
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyTitle: {
    color: '#f8fafc',
    fontSize: 16,
    fontWeight: '700',
  },
  emptySubtitle: {
    color: '#94a3b8',
    fontSize: 13,
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 20,
  },
  scoreCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    marginBottom: 16,
  },
  scoreCardSuccess: {
    backgroundColor: 'rgba(6, 95, 70, 0.25)',
    borderColor: '#059669',
  },
  scoreCardDanger: {
    backgroundColor: 'rgba(127, 29, 29, 0.3)',
    borderColor: '#dc2626',
  },
  scoreEmoji: {
    fontSize: 32,
  },
  scoreTitle: {
    color: '#f8fafc',
    fontSize: 15,
    fontWeight: '700',
  },
  scoreDesc: {
    color: '#cbd5e1',
    fontSize: 12,
    lineHeight: 18,
    marginTop: 4,
  },
  diagnosticsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  diagItem: {
    flex: 1,
    minWidth: 130,
    backgroundColor: '#08111e',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#1e293b',
  },
  diagTitle: {
    color: '#94a3b8',
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 4,
  },
  diagStatus: {
    fontSize: 13,
    fontWeight: '700',
  },
  statusGood: {
    color: '#10b981',
  },
  statusBad: {
    color: '#ef4444',
  },
  statusInfo: {
    color: '#38bdf8',
  },
  diagDetail: {
    color: '#64748b',
    fontSize: 10,
    marginTop: 4,
  },
  section: {
    backgroundColor: '#08111e',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#1e293b',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    color: '#38bdf8',
    fontSize: 13,
    fontWeight: '700',
  },
  clearAllText: {
    color: '#ef4444',
    fontSize: 12,
    fontWeight: '600',
  },
  fishItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#0f172a',
  },
  fishThumb: {
    width: 44,
    height: 44,
    borderRadius: 8,
  },
  fishItemName: {
    color: '#f8fafc',
    fontSize: 13,
    fontWeight: '600',
  },
  fishItemSpecs: {
    color: '#94a3b8',
    fontSize: 11,
    marginTop: 2,
  },
  removeBtn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: '#1e293b',
    borderRadius: 6,
  },
  removeBtnText: {
    color: '#f87171',
    fontSize: 11,
    fontWeight: '600',
  },
  footer: {
    padding: 16,
    backgroundColor: '#08111e',
    borderTopWidth: 1,
    borderTopColor: '#1e293b',
  },
  closeFooterBtn: {
    backgroundColor: '#0284c7',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  closeFooterBtnText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
});
