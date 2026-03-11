import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const ApprovalModal = ({ visible, onClose, onConfirm }) => {
  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modalCard}>
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>

          <Text style={styles.title}>Before you approve the offer...</Text>
          <Text style={styles.subtitle}>
            Confirm with the buyer the price, meeting place, and the meeting time.
          </Text>

          <TouchableOpacity style={styles.confirmBtn} onPress={onConfirm}>
            <Text style={styles.confirmText}>I Understand</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.28)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  modalCard: {
    width: '100%',
    backgroundColor: '#173528',
    borderRadius: 18,
    paddingHorizontal: 22,
    paddingVertical: 28,
    alignItems: 'center',
  },
  closeBtn: {
    position: 'absolute',
    right: 14,
    top: 12,
    zIndex: 10,
  },
  closeText: {
    color: '#FAF7E8',
    fontSize: 18,
    fontWeight: '700',
  },
  title: {
    color: '#FAF7E8',
    fontSize: 28,
    textAlign: 'center',
    fontWeight: '600',
    marginTop: 10,
    marginBottom: 16,
  },
  subtitle: {
    color: '#FAF7E8',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  confirmBtn: {
    backgroundColor: '#F4A26A',
    borderRadius: 999,
    paddingHorizontal: 24,
    paddingVertical: 10,
  },
  confirmText: {
    color: '#173528',
    fontWeight: '600',
  },
});

export default ApprovalModal;