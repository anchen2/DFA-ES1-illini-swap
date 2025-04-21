import React from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Picker } from "@react-native-picker/picker";

const itemImages = [
  require("./images/item1.png"),
  require("./images/item2.png"),
  require("./images/item3.png"),
  require("./images/item4.png"),
];

const FavoritesScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header */}
        <View style={styles.headerWrapper}>
          <Text style={styles.headerText}>Favorites</Text>
          <Image source={require("./icons/filter.png")} style={styles.filterIcon} />
        </View>

        {/* Sort by Category Dropdown */}
        <View style={styles.sortWrapper}>
          <Text style={styles.sortLabel}>Sort by Category</Text>
          <View style={styles.pickerWrapper}>
            <Picker style={styles.picker}>
              <Picker.Item label="Select an Option" value="" />
              <Picker.Item label="Clothing" value="clothing" />
              <Picker.Item label="Books" value="books" />
              <Picker.Item label="Tech" value="tech" />
              <Picker.Item label="Misc" value="misc" />
            </Picker>
          </View>
        </View>

        {/* Listings Grid */}
        <View style={styles.listingsContainer}>
          {itemImages.map((img, idx) => (
            <TouchableOpacity
              key={idx}
              style={[styles.listingBox, { marginRight: 16, marginBottom: 16 }]}
              onPress={() => console.log("Go to item")}
            >
              <Image source={img} style={styles.listingImage} resizeMode="cover" />
              <Text style={styles.listingTitle}>Listing Name</Text>
              <View style={styles.priceRow}>
                <Text style={styles.listingPrice}>$10</Text>
                <Image
                  source={require("./icons/filled_heart.png")}
                  style={styles.heartIcon}
                />
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Bottom Nav Bar */}
      <View style={styles.navBar}>
        <Image source={require("./icons/nav-tag.png")} style={styles.icon} />
        <Image source={require("./icons/nav-heart.png")} style={[styles.navIcon, { tintColor: "#FCA26E" }]} />
        <TouchableOpacity onPress={() => navigation.navigate("Home")}>
          <Image source={require("./icons/home-icon.png")} style={[styles.navIcon, { tintColor: "#FAF7E8" }]} />
        </TouchableOpacity>
        <Image source={require("./icons/nav-pending.png")} style={styles.icon} />
        <Image source={require("./icons/nav-user-square.png")} style={styles.icon} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAF7E8",
  },
  scrollContainer: {
    paddingBottom: 140,
    flexGrow: 1,
  },
  headerWrapper: {
    alignItems: "center",
    position: "relative",
    marginTop: 16,
    marginBottom: 6,
  },
  headerText: {
    fontSize: 36,
    fontWeight: "500",
    fontFamily: "Gimlet Display",
    color: "#13281F",
  },
  filterIcon: {
    position: "absolute",
    right: 24,
    top: 4,
    width: 31,
    height: 31,
    resizeMode: "contain",
  },
  sortWrapper: {
    width: 343,
    alignSelf: "center",
    marginTop: 18,
  },
  sortLabel: {
    fontSize: 16,
    fontWeight: "500",
    fontFamily: "Montserrat",
    color: "#13281F",
    marginBottom: 6,
  },
  pickerWrapper: {
    borderWidth: 2,
    borderColor: "#64817D",
    borderRadius: 10,
    width: "100%",
    height: 44,
    justifyContent: "center",
    overflow: "hidden",
  },
  picker: {
    width: "100%",
    height: "100%",
    paddingLeft: 20,
  },
  listingsContainer: {
    marginTop: 24,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  listingBox: {
    width: 164,
    paddingTop: 19,
    paddingBottom: 19,
  },
  listingImage: {
    width: "100%",
    height: 203,
    borderRadius: 10,
  },
  listingTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#13281F",
    textAlign: "center",
    marginTop: 6,
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 4,
    marginTop: 2,
  },
  listingPrice: {
    fontSize: 16,
    fontWeight: "500",
    color: "#64817D",
  },
  heartIcon: {
    width: 21,
    height: 21,
    resizeMode: "contain",
  },
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
  icon: {
    width: 33,
    height: 33,
  },
});

export default FavoritesScreen;
