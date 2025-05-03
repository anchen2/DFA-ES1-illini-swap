import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  SafeAreaView,
} from 'react-native';
import { OffersContext } from './OffersContext';
const STATUS_COLORS = {
  pending:  '#FFA07A',
  approved: '#429D88',
  declined: '#ED5B5B',
};

export default function PendingOrders({ navigation }) {
  const { offers, updateOfferStatus } = useContext(OffersContext);
  const [activeTab, setActiveTab] = useState('sent');  // 'sent' or 'received'

  const sent   = offers.filter(o => o.direction === 'sent');
  const recv   = offers.filter(o => o.direction === 'received');
  const data   = activeTab === 'sent' ? sent : recv;

  const renderItem = ({ item }) => {
    const timeAgoHrs = Math.floor((Date.now() - new Date(item.timestamp)) / 3600000);
    return (
        <TouchableOpacity
            style={styles.row}
            onPress={() => navigation.navigate('OfferDetail', { id: item.id })}
        >
        <Image
          source={ item.image || require('./icons/profile.png') }
          style={styles.avatar}
        />
        <View style={styles.textWrap}>
          <Text style={styles.name}>
            { activeTab === 'sent' ? item.seller.name : item.seller.name }
          </Text>
          <Text style={styles.sub}>
            { activeTab === 'sent' ? 'Sent ' : 'Received ' }{timeAgoHrs}h ago
          </Text>
        </View>
        <View
          style={[
            styles.badge,
            { backgroundColor: STATUS_COLORS[item.status] }
          ]}
        >
          <Text style={styles.badgeText}>
            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
          </Text>
        </View>
        </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Pending Orders</Text>

      <View style={styles.tabs}>
        {['sent','received'].map(tab => (
          <TouchableOpacity
            key={tab}
            style={[
              styles.tab,
              activeTab === tab && styles.tabActive
            ]}
            onPress={() => setActiveTab(tab)}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab && styles.tabTextActive
              ]}
            >
              {tab === 'sent' ? 'Sent Offers' : 'Received Offers'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={data}
        keyExtractor={i => i.id}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View style={styles.sep} />}
        contentContainerStyle={{ padding: 16 }}
      />

      {/* Bottom Nav Bar */}
      <View style={styles.navBar}>
        <TouchableOpacity onPress={() => navigation.navigate("SellItem")}>
            <Image source={require("./icons/tag-icon.png")} style={[styles.navIcon, { tintColor: "#FAF7E8" }]} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Favorites")}>
          <Image source={require("./icons/nav-heart.png")} style={styles.icon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Home")}>
            <Image source={require("./icons/home-icon.png")} style={styles.icon} />
        </TouchableOpacity>
        <Image source={require("./icons/pending.png")} style={[styles.navIcon, { tintColor: "#FCA26E" }]} />
        <Image source={require("./icons/nav-user-square.png")} style={styles.icon} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
    container:    { flex: 1, backgroundColor: '#FAF7E8' },
    header:       { fontSize: 32, fontWeight: '600', textAlign: 'center', marginTop: 16, color: '#13281F' },
    tabs:         {
      flexDirection: 'row',
      marginTop: 16,
      borderBottomWidth: 1,
      borderBottomColor: '#64817D',
      marginHorizontal: 16,
    },
    tab:          { flex: 1, alignItems: 'center', paddingVertical: 12 },
    tabActive:    { borderBottomWidth: 2, borderBottomColor: '#13281F' },
    tabText:      { fontSize: 16, color: '#64817D' },
    tabTextActive:{ color: '#13281F', fontWeight: '600' },
    row:          { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
    avatar:       { width: 40, height: 40, borderRadius: 20, backgroundColor: '#DDD' },
    textWrap:     { flex: 1, marginLeft: 12 },
    name:         { fontSize: 16, fontWeight: '600', color: '#13281F' },
    sub:          { fontSize: 14, color: '#777', marginTop: 4 },
    badge:        { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
    badgeText:    { color: '#FFF', fontWeight: '600' },
    sep:          { height: 1, backgroundColor: '#CCC', marginVertical: 8 },
  navBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 75,
    backgroundColor: "#13281F",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingTop: 14,
    paddingBottom: 22,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingHorizontal: 8,
  },
  navIcon: { width: 33, height: 33 },
});

