import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';

const OfferCard = ({
  expanded,
  onToggle,
  itemName,
  itemImage,
  price,
  location,
  availability,
  status,
  showViewButton = true,
  showApproveButton = false,
  onApprove,
}) => {
  const getStatusStyle = () => {
    switch (status) {
      case 'Approved':
        return styles.approved;
      case 'Declined':
        return styles.declined;
      default:
        return styles.pending;
    }
  };

  return (
    <View style={styles.wrapper}>
      <TouchableOpacity style={styles.header} onPress={onToggle}>
        <Text style={styles.headerText}>{itemName}</Text>
        <Text style={styles.chevron}>{expanded ? '⌃' : '⌄'}</Text>
      </TouchableOpacity>

      {expanded && (
        <View style={styles.card}>
          <View style={styles.topRow}>
            {itemImage ? (
              <Image source={{ uri: itemImage }} style={styles.itemImage} />
            ) : (
              <View style={styles.placeholderImage} />
            )}

            <View style={styles.itemInfo}>
              <Text style={styles.itemTitle}>{itemName}</Text>
              <View style={styles.priceRow}>
                <Text style={styles.price}>${price}</Text>
                {showViewButton && (
                  <TouchableOpacity style={styles.viewBtn}>
                    <Text style={styles.viewBtnText}>View</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>

          <Text style={styles.label}>Preferred Meeting Place</Text>
          <View style={styles.infoPill}>
            <Text style={styles.infoText}>{location}</Text>
          </View>

          <Text style={styles.label}>Availability</Text>
          <View style={styles.infoPill}>
            <Text style={styles.infoText}>{availability}</Text>
          </View>

          <View style={styles.bottomRow}>
            <View style={[styles.statusPill, getStatusStyle()]}>
              <Text style={styles.statusText}>{status}</Text>
            </View>

            {showApproveButton && status === 'Pending' && (
              <TouchableOpacity style={styles.approveBtn} onPress={onApprove}>
                <Text style={styles.approveBtnText}>Approve</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 14,
  },
  header: {
    backgroundColor: '#173528',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerText: {
    color: '#FFF8E7',
    fontSize: 15,
    fontWeight: '600',
  },
  chevron: {
    color: '#FFF8E7',
    fontSize: 18,
  },
  card: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#173528',
    borderRadius: 12,
    padding: 12,
    backgroundColor: '#FAF7E8',
  },
  topRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  itemImage: {
    width: 72,
    height: 72,
    borderRadius: 8,
    marginRight: 10,
  },
  placeholderImage: {
    width: 72,
    height: 72,
    borderRadius: 8,
    marginRight: 10,
    backgroundColor: '#E3E3E3',
  },
  itemInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#173528',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  price: {
    color: '#F08C57',
    fontSize: 14,
    fontWeight: '600',
  },
  viewBtn: {
    backgroundColor: '#F08C57',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 999,
  },
  viewBtnText: {
    color: '#173528',
    fontSize: 12,
    fontWeight: '600',
  },
  label: {
    fontSize: 11,
    color: '#173528',
    marginBottom: 4,
    marginTop: 6,
  },
  infoPill: {
    backgroundColor: '#F4A26A',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 6,
  },
  infoText: {
    color: '#173528',
    fontSize: 12,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    alignItems: 'center',
  },
  statusPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  pending: {
    backgroundColor: '#F4A26A',
  },
  approved: {
    backgroundColor: '#52B788',
  },
  declined: {
    backgroundColor: '#E85D5D',
  },
  statusText: {
    color: '#173528',
    fontSize: 12,
    fontWeight: '600',
  },
  approveBtn: {
    borderWidth: 1,
    borderColor: '#F08C57',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
  },
  approveBtnText: {
    color: '#F08C57',
    fontSize: 12,
    fontWeight: '600',
  },
});

export default OfferCard;