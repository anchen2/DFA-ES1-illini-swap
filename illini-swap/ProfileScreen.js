import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image,
  SafeAreaView,
  Switch,
} from 'react-native';
import { Ionicons, Feather, MaterialCommunityIcons, AntDesign } from '@expo/vector-icons';

const Stack = createNativeStackNavigator();

const COLORS = {
  bg: '#F4F1E7',
  card: '#EFEBDC',
  dark: '#163C33',
  accent: '#F4A261',
  border: '#7E9089',
  muted: '#5E6E68',
  lightGray: '#D9D9D9',
  danger: '#F05D5E',
};

const dummyUser = {
  name: 'Evan Rafol',
  rating: 5,
  sold: 15,
  active: 'Active Today',
  username: 'name123',
  email: 'Fname123@illinois.edu',
  password: 'Fname123',
  firstName: 'name',
  lastName: 'lname',
  interest: "Women's Wear",
  bio: 'Hi, my name is name and I love sustainable fashion at UIUC.',
  year: 'Sophomore',
  about:
    'Illini Swap is a fashion resale platform designed for the UIUC community. Inspired by the circular fashion movement, our mission is to make fashion sustainable, accessible, stylish, and community-driven.',
  interests: ['Athletic', 'Jewelry', 'Bows'],
  impact: {
    carbon: 22,
    water: 16,
  },
  items: [
    {
      id: '1',
      name: 'Cream Graphic Tee',
      price: 10,
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400',
    },
    {
      id: '2',
      name: 'Perfume Bottle',
      price: 10,
      image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400',
    },
    {
      id: '3',
      name: 'Blue Loafers',
      price: 10,
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
    },
    {
      id: '4',
      name: 'Neutral Bag',
      price: 18,
      image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400',
    },
  ],
};

function AppHeader({ title, onBack, rightIcon, onRightPress }) {
  return (
    <View style={styles.headerRow}>
      <TouchableOpacity onPress={onBack}>
        <Ionicons name="arrow-back-circle-outline" size={28} color={COLORS.dark} />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>{title}</Text>
      {rightIcon ? (
        <TouchableOpacity onPress={onRightPress}>
          <Feather name={rightIcon} size={20} color={COLORS.dark} />
        </TouchableOpacity>
      ) : (
        <View style={{ width: 20 }} />
      )}
    </View>
  );
}

function BottomNav() {
  return (
    <View style={styles.bottomNav}>
      <Feather name="tag" size={22} color="#FFF" />
      <Feather name="shopping-bag" size={22} color="#FFF" />
      <Feather name="home" size={22} color="#FFF" />
      <Feather name="message-circle" size={22} color="#FFF" />
      <Feather name="user" size={22} color={COLORS.accent} />
    </View>
  );
}

function SectionTitle({ children, right }) {
  return (
    <View style={styles.sectionTitleRow}>
      <Text style={styles.sectionTitle}>{children}</Text>
      {right}
    </View>
  );
}

function ImpactBar({ label, value, max, unit }) {
  const widthPct = `${(value / max) * 100}%`;
  return (
    <View style={{ marginBottom: 12 }}>
      <Text style={styles.impactLabel}>{label}</Text>
      <View style={styles.impactOuter}>
        <View style={[styles.impactInner, { width: widthPct }]} />
        <Text style={styles.impactBadge}>L2</Text>
      </View>
      <Text style={styles.impactTicks}>{unit}</Text>
    </View>
  );
}

function ProfileScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.phoneShell}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.screenContent}>
        <View style={styles.profileTopCard}>
          <TouchableOpacity style={styles.settingsButton} onPress={() => navigation.navigate('Settings')}>
            <Feather name="settings" size={20} color="#FFF" />
          </TouchableOpacity>

          <View style={styles.profileRow}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300' }}
              style={styles.avatar}
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.profileName}>{dummyUser.name}</Text>
              <Text style={styles.ratingText}>★★★★★ (5)</Text>
              <Text style={styles.profileMeta}>{dummyUser.sold} sold • {dummyUser.active}</Text>
            </View>
            <TouchableOpacity style={styles.editButton}>
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.profileBodyCard}>
          <SectionTitle
            right={
              <TouchableOpacity onPress={() => navigation.navigate('YourItems')}>
                <AntDesign name="arrowright" size={18} color={COLORS.accent} />
              </TouchableOpacity>
            }
          >
            Your Items
          </SectionTitle>

          <TouchableOpacity style={styles.itemsPreviewBox} onPress={() => navigation.navigate('YourItems')}>
            {dummyUser.items.slice(0, 3).map((item) => (
              <Image key={item.id} source={{ uri: item.image }} style={styles.previewImage} />
            ))}
          </TouchableOpacity>

          <SectionTitle
            right={<Ionicons name="information-circle-outline" size={18} color={COLORS.muted} />}
          >
            Your Impact
          </SectionTitle>
          <ImpactBar label="Carbon Emissions Reduced (g)" value={dummyUser.impact.carbon} max={60} unit="10     20     30     40     50     60" />
          <ImpactBar label="Water Saved (gal)" value={dummyUser.impact.water} max={40} unit="5      10      15      20      30      40" />

          <SectionTitle
            right={
              <TouchableOpacity style={styles.plusBubble}>
                <Feather name="plus" size={16} color={COLORS.dark} />
              </TouchableOpacity>
            }
          >
            Your Interests
          </SectionTitle>
          <View style={styles.tagRow}>
            {dummyUser.interests.map((interest) => (
              <View key={interest} style={styles.tagPill}>
                <Text style={styles.tagText}>{interest}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
      <BottomNav />
    </SafeAreaView>
  );
}

function YourItemsScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.phoneShellLight}>
      <View style={styles.screenContent}>
        <AppHeader title="Your Items" onBack={() => navigation.goBack()} />

        <Text style={styles.sortLabel}>Sort by Category</Text>
        <View style={styles.filterRow}>
          <TouchableOpacity style={styles.selectBox}>
            <Text style={styles.selectText}>Select an Option</Text>
            <Feather name="chevron-down" size={18} color={COLORS.dark} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.addButton}>
            <Text style={styles.addButtonText}>Add Item</Text>
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.itemGrid}>
            {dummyUser.items.map((item) => (
              <View key={item.id} style={styles.itemCard}>
                <TouchableOpacity style={styles.deleteButton}>
                  <Feather name="x" size={16} color="#FFF" />
                </TouchableOpacity>
                <Image source={{ uri: item.image }} style={styles.itemImage} />
                <Text style={styles.itemName}>{item.name}</Text>
                <View style={styles.itemPriceRow}>
                  <Text style={styles.itemPrice}>${item.price}</Text>
                  <Feather name="heart" size={16} color={COLORS.accent} />
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
      <BottomNav />
    </SafeAreaView>
  );
}

function SettingsScreen({ navigation }) {
  const options = [
    { label: 'Account', icon: 'user', screen: 'Account' },
    { label: 'Notifications', icon: 'tag', screen: 'Notifications' },
    { label: 'Privacy and Security', icon: 'lock', screen: null },
    { label: 'Help Center', icon: 'headphones', screen: null },
    { label: 'About', icon: 'info', screen: 'About' },
  ];

  return (
    <SafeAreaView style={styles.phoneShellLight}>
      <View style={styles.screenContent}>
        <AppHeader title="Settings" onBack={() => navigation.goBack()} />
        <View style={styles.searchBox}>
          <TextInput placeholder="Search Settings" placeholderTextColor={COLORS.muted} style={{ flex: 1 }} />
          <Feather name="search" size={18} color={COLORS.muted} />
        </View>

        <View style={styles.settingsList}>
          {options.map((option, index) => (
            <TouchableOpacity
              key={option.label}
              style={[styles.settingsRow, index === options.length - 1 && { borderBottomWidth: 0 }]}
              onPress={() => option.screen && navigation.navigate(option.screen)}
            >
              <View style={styles.settingsLeft}>
                <Feather name={option.icon} size={16} color={COLORS.dark} />
                <Text style={styles.settingsText}>{option.label}</Text>
              </View>
              <Feather name={option.label === 'About' ? 'chevron-down' : 'chevron-right'} size={16} color={COLORS.dark} />
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <BottomNav />
    </SafeAreaView>
  );
}

function AccountScreen({ navigation }) {
  const rows = [
    ['Username', dummyUser.username],
    ['Email', dummyUser.email],
    ['Password', dummyUser.password],
    ['First Name', dummyUser.firstName],
    ['Last Name', dummyUser.lastName],
    ['Interest', dummyUser.interest],
    ['Bio', 'Hi, my name is n...'],
    ['Year', dummyUser.year],
  ];

  return (
    <SafeAreaView style={styles.phoneShellLight}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.screenContent}>
        <AppHeader title="Account" onBack={() => navigation.goBack()} rightIcon="edit-2" />

        <Text style={styles.subsectionHeader}>User Details</Text>
        {rows.slice(0, 3).map(([label, value]) => (
          <View key={label} style={styles.infoRow}>
            <Text style={styles.infoLabel}>{label}</Text>
            <View style={styles.infoValueRow}>
              <Text style={styles.infoValue}>{value}</Text>
              {label !== 'Password' && <Feather name="chevron-right" size={14} color={COLORS.muted} />}
            </View>
          </View>
        ))}

        <Text style={styles.subsectionHeader}>About Me</Text>
        {rows.slice(3).map(([label, value]) => (
          <View key={label} style={styles.infoRow}>
            <Text style={styles.infoLabel}>{label}</Text>
            <View style={styles.infoValueRow}>
              <Text style={styles.infoValue}>{value}</Text>
              <Feather name="chevron-right" size={14} color={COLORS.muted} />
            </View>
          </View>
        ))}

        <Text style={styles.subsectionHeader}>Manage</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Delete Account</Text>
          <Feather name="chevron-right" size={14} color={COLORS.muted} />
        </View>

        <TouchableOpacity style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </ScrollView>
      <BottomNav />
    </SafeAreaView>
  );
}

function NotificationsScreen({ navigation }) {
  const [values, setValues] = React.useState({
    general: false,
    messages: true,
    likes: false,
    meetup: false,
    updates: false,
  });

  const items = [
    ['General Notifications', 'general'],
    ['Messages', 'messages'],
    ['Item Likes & Offers', 'likes'],
    ['Meetup Reminders', 'meetup'],
    ['Policy & Updates', 'updates'],
  ];

  return (
    <SafeAreaView style={styles.phoneShellLight}>
      <View style={styles.screenContent}>
        <AppHeader title="Notifications" onBack={() => navigation.goBack()} />
        <Text style={styles.subsectionHeader}>Manage Notifications</Text>
        {items.map(([label, key]) => (
          <View key={key} style={styles.notificationRow}>
            <Text style={styles.infoLabel}>{label}</Text>
            <Switch
              value={values[key]}
              onValueChange={(next) => setValues((prev) => ({ ...prev, [key]: next }))}
              trackColor={{ false: '#D1D4CC', true: '#A4B7AF' }}
              thumbColor="#FFFFFF"
            />
          </View>
        ))}
      </View>
      <BottomNav />
    </SafeAreaView>
  );
}

function AboutScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.phoneShellLight}>
      <View style={styles.screenContent}>
        <AppHeader title="Settings" onBack={() => navigation.goBack()} />
        <View style={styles.searchBox}>
          <TextInput placeholder="Search Settings" placeholderTextColor={COLORS.muted} style={{ flex: 1 }} />
          <Feather name="search" size={18} color={COLORS.muted} />
        </View>

        <View style={styles.settingsList}>
          {['Account', 'Notifications', 'Privacy and Security', 'Help Center', 'About'].map((label, index) => (
            <View key={label} style={[styles.settingsRow, index === 4 && { borderBottomWidth: 0 }]}>
              <View style={styles.settingsLeft}>
                <Feather
                  name={
                    label === 'Account'
                      ? 'user'
                      : label === 'Notifications'
                      ? 'tag'
                      : label === 'Privacy and Security'
                      ? 'lock'
                      : label === 'Help Center'
                      ? 'headphones'
                      : 'info'
                  }
                  size={16}
                  color={COLORS.dark}
                />
                <Text style={styles.settingsText}>{label}</Text>
              </View>
              <Feather name={label === 'About' ? 'chevron-up' : 'chevron-right'} size={16} color={COLORS.dark} />
            </View>
          ))}
        </View>

        <View style={styles.aboutCard}>
          <Text style={styles.aboutText}>{dummyUser.about}</Text>
          <TouchableOpacity>
            <Text style={styles.learnMore}>Learn More</Text>
          </TouchableOpacity>
        </View>
      </View>
      <BottomNav />
    </SafeAreaView>
  );
}

export {
  ProfileScreen,
  YourItemsScreen as YourItems,
  SettingsScreen as Settings,
  AccountScreen as Account,
  NotificationsScreen as Notifications,
  AboutScreen as About,
};

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Profile">
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="YourItems" component={YourItemsScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="Account" component={AccountScreen} />
        <Stack.Screen name="Notifications" component={NotificationsScreen} />
        <Stack.Screen name="About" component={AboutScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  phoneShell: {
    flex: 1,
    backgroundColor: COLORS.dark,
  },
  phoneShellLight: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  screenContent: {
    paddingHorizontal: 18,
    paddingTop: 14,
    paddingBottom: 90,
  },
  profileTopCard: {
    backgroundColor: COLORS.dark,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 20,
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  settingsButton: {
    alignSelf: 'flex-end',
    marginBottom: 10,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
  },
  profileName: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: '700',
  },
  ratingText: {
    color: '#FFB347',
    marginTop: 2,
  },
  profileMeta: {
    color: '#E5ECE8',
    fontSize: 12,
    marginTop: 2,
  },
  editButton: {
    backgroundColor: COLORS.accent,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  editButtonText: {
    color: '#FFF',
    fontWeight: '600',
  },
  profileBodyCard: {
    backgroundColor: COLORS.bg,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    marginTop: -10,
    padding: 18,
    minHeight: '100%',
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    marginTop: 6,
  },
  sectionTitle: {
    color: COLORS.dark,
    fontSize: 18,
    fontWeight: '700',
  },
  itemsPreviewBox: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  previewImage: {
    width: 76,
    height: 76,
    borderRadius: 14,
  },
  impactLabel: {
    color: COLORS.dark,
    fontSize: 13,
    marginBottom: 6,
  },
  impactOuter: {
    borderWidth: 1.5,
    borderColor: COLORS.accent,
    borderRadius: 16,
    height: 26,
    position: 'relative',
    overflow: 'hidden',
    justifyContent: 'center',
  },
  impactInner: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: COLORS.accent,
    borderRadius: 16,
  },
  impactBadge: {
    position: 'absolute',
    right: 8,
    color: COLORS.dark,
    fontSize: 12,
    fontWeight: '600',
  },
  impactTicks: {
    marginTop: 4,
    color: COLORS.dark,
    fontSize: 11,
    paddingHorizontal: 6,
  },
  plusBubble: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#C8D1CC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tagPill: {
    backgroundColor: COLORS.accent,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 18,
  },
  tagText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '600',
  },
  bottomNav: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: COLORS.dark,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 14,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.dark,
  },
  sortLabel: {
    color: COLORS.dark,
    fontSize: 13,
    marginBottom: 8,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 18,
  },
  selectBox: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectText: {
    color: COLORS.muted,
    fontSize: 13,
  },
  addButton: {
    backgroundColor: COLORS.accent,
    paddingHorizontal: 18,
    justifyContent: 'center',
    borderRadius: 20,
  },
  addButtonText: {
    color: '#FFF',
    fontWeight: '600',
  },
  itemGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 18,
  },
  itemCard: {
    width: '47%',
    position: 'relative',
  },
  deleteButton: {
    position: 'absolute',
    right: -8,
    top: -8,
    zIndex: 1,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.danger,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemImage: {
    width: '100%',
    height: 145,
    borderRadius: 14,
    backgroundColor: COLORS.lightGray,
  },
  itemName: {
    marginTop: 8,
    color: COLORS.dark,
    fontWeight: '600',
  },
  itemPriceRow: {
    marginTop: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemPrice: {
    color: COLORS.muted,
  },
  searchBox: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },
  settingsList: {
    borderWidth: 1,
    borderColor: '#B9C2BC',
    borderRadius: 10,
    overflow: 'hidden',
  },
  settingsRow: {
    paddingHorizontal: 14,
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#B9C2BC',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  settingsLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  settingsText: {
    color: COLORS.dark,
    fontSize: 15,
  },
  subsectionHeader: {
    color: COLORS.dark,
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 10,
    marginTop: 6,
  },
  infoRow: {
    paddingVertical: 9,
    borderBottomWidth: 1,
    borderBottomColor: '#AAB4AE',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoLabel: {
    color: COLORS.dark,
    fontSize: 14,
  },
  infoValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  infoValue: {
    color: '#6F827B',
    fontSize: 14,
  },
  saveButton: {
    backgroundColor: COLORS.dark,
    borderRadius: 14,
    alignItems: 'center',
    paddingVertical: 14,
    marginTop: 28,
    marginHorizontal: 24,
  },
  saveButtonText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 18,
  },
  notificationRow: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#AAB4AE',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  aboutCard: {
    borderWidth: 1,
    borderColor: '#B9C2BC',
    borderRadius: 8,
    marginTop: 14,
    padding: 14,
  },
  aboutText: {
    color: COLORS.dark,
    fontSize: 12,
    lineHeight: 18,
  },
  learnMore: {
    color: COLORS.dark,
    textAlign: 'center',
    marginTop: 10,
    textDecorationLine: 'underline',
    fontWeight: '600',
  },
});
