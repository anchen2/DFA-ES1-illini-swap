// AvailabilityScreen.js
import React, { useState, useRef } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  PanResponder,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation, useRoute } from '@react-navigation/native';

const getNextTwoWeeks = () => {
  const arr = [];
  const today = new Date();
  for (let i = 0; i < 14; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    arr.push({
      key: `${i}`,
      label: d.toLocaleDateString('en-US', { weekday: 'short' }),
      day: d.getDate(),
    });
  }
  return arr;
};

const { width } = Dimensions.get('window');
const DATE_BOX_SIZE = (width - 32 - 6 * 8) / 7;

const AvailabilityScreen = () => {
  const navigation = useNavigation();
  const { title, price, seller } = useRoute().params;

  const allDates = useRef(getNextTwoWeeks()).current;
  const [weekOffset, setWeekOffset] = useState(0);
  const [selectedDate, setSelectedDate] = useState(0);
  const [slots, setSlots] = useState(new Set());
  const listTop = useRef(0);

  const dates = allDates.slice(weekOffset, weekOffset + 7);

  const times = [];
  for (let h = 9; h < 24; h++) {
    ['00', '30'].forEach(min => {
      const date = new Date();
      date.setHours(h, parseInt(min), 0);
      const hours12 = date.getHours() % 12 === 0 ? 12 : date.getHours() % 12;
      const ampm = date.getHours() < 12 ? 'AM' : 'PM';
      times.push(`${hours12}:${min} ${ampm}`);
    });
  }

  const toggleSlot = i => {
    const key = `${selectedDate}-${i}`;
    const copy = new Set(slots);
    copy.has(key) ? copy.delete(key) : copy.add(key);
    setSlots(copy);
  };

  const prevWeek = () => setWeekOffset(o => Math.max(o - 7, 0));
  const nextWeek = () => setWeekOffset(o => Math.min(o + 7, allDates.length - 7));

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: e => handleDrag(e.nativeEvent),
      onPanResponderMove: e => handleDrag(e.nativeEvent),
    })
  ).current;

  const handleDrag = ({ pageY }) => {
    const offsetY = pageY - listTop.current;
    const idx = Math.floor(offsetY / 40);
    if (idx >= 0 && idx < times.length) toggleSlot(idx);
  };

  // ✅ This will always push to ReviewOfferScreen
  const onSave = () => {
    navigation.navigate('ReviewOffer', {
      title,
      price,
      seller,
      availability: Array.from(slots),
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconBtn}>
          <Ionicons name="chevron-back" size={24} color="#13281F" />
        </TouchableOpacity>
        <Text style={styles.title}>Availability</Text>
        <View style={styles.iconRow}>
          <TouchableOpacity onPress={prevWeek} style={styles.iconBtn}>
            <Ionicons name="chevron-back-outline" size={24} color="#13281F" />
          </TouchableOpacity>
          <TouchableOpacity onPress={nextWeek} style={styles.iconBtn}>
            <Ionicons name="chevron-forward-outline" size={24} color="#13281F" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.datesRow}
      >
        {dates.map((d, i) => {
          const idx = weekOffset + i;
          const sel = idx === selectedDate;
          return (
            <TouchableOpacity
              key={d.key}
              style={[styles.dateBox, sel && styles.dateBoxSel]}
              onPress={() => setSelectedDate(idx)}
            >
              <Text style={styles.dateLabel}>{d.label}</Text>
              <Text style={styles.dateNum}>{d.day}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <Text style={styles.meetingInfo}>10 min meeting</Text>

      <ScrollView
        style={styles.timesList}
        onLayout={({ nativeEvent }) => {
          listTop.current = nativeEvent.layout.y;
        }}
        {...panResponder.panHandlers}
      >
        {times.map((label, i) => {
          const key = `${selectedDate}-${i}`;
          const sel = slots.has(key);
          return (
            <View key={key} style={styles.timeRow}>
              <Text style={styles.timeLabel}>{label}</Text>
              <TouchableOpacity
                style={[styles.slotBox, sel && styles.slotSel]}
                activeOpacity={0.7}
                onPress={() => toggleSlot(i)}
              />
            </View>
          );
        })}
      </ScrollView>

      <TouchableOpacity style={styles.saveBtn} onPress={onSave}>
        <Text style={styles.saveTxt}>Save</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAF7E8' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 16,
  },
  iconBtn: { width: 24, height: 24 },
  iconRow: { flexDirection: 'row', alignItems: 'center', width: 64, justifyContent: 'space-between' },
  title: { fontFamily: 'Gimlet Display', fontWeight: '500', fontSize: 36, color: '#13281F' },
  datesRow: { paddingHorizontal: 16, paddingVertical: 8 },
  dateBox: {
    width: DATE_BOX_SIZE,
    height: 56,
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  dateBoxSel: { backgroundColor: '#DCE5E2' },
  dateLabel: { fontFamily: 'Montserrat', fontSize: 12, color: '#13281F' },
  dateNum: { fontFamily: 'Montserrat', fontSize: 16, fontWeight: '600', color: '#13281F', marginTop: 2 },
  meetingInfo: { textAlign: 'center', fontSize: 12, color: '#444', marginVertical: 8 },
  timesList: { flex: 1, paddingHorizontal: 16 },
  timeRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  timeLabel: { fontFamily: 'Montserrat', width: 70, fontSize: 14, color: '#13281F' },
  slotBox: { flex: 1, height: 30, borderWidth: 1, borderColor: '#CCC', borderRadius: 10 },
  slotSel: { backgroundColor: '#DCE5E2' },
  saveBtn: { backgroundColor: '#1F4035', paddingVertical: 14, margin: 16, borderRadius: 14, alignItems: 'center' },
  saveTxt: { color: '#FFF', fontSize: 18, fontWeight: '600' },
});

export default AvailabilityScreen;
