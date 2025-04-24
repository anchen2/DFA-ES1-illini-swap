import React from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const itemImages = [
  require("./images/item1.png"),
  require("./images/item2.png"),
  require("./images/item3.png"),
  require("./images/item4.png"),
];

const HomeScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Top Header */}
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>Home</Text>
        </View>

        {/* Top Right Icons */}
        <View style={styles.topIconsContainer}>
          <TouchableOpacity
                  onPress={() => navigation.navigate("Search")}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }} // optional: enlarges tap area
          >
              <Image
                source={require("./icons/search.png")}
                style={[styles.icon, { marginRight: 16 }]}
              />
          </TouchableOpacity>
          <Image
            source={require("./icons/comment-lines.png")}
            style={styles.icon}
          />
        </View>

        {/* Environmental Fact Box */}
        <View style={styles.factBox}>
          <Text style={styles.factTitle}>Environmental Fact</Text>
          <Text style={styles.factText}>
            Every year, around 92 million tons of clothing are discarded globally,
            equivalent to one garbage truck of clothes being dumped in a landfill every second.
          </Text>
        </View>

        {/* Categories */}
        <Text style={styles.categoriesTitle}>Categories</Text>
        <View style={styles.categoriesContainer}>
          {["Clothing", "Books", "Tech", "Misc"].map((label, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.categoryButton, { marginRight: 13, marginBottom: 13 }]}
            >
              <Text style={styles.categoryText}>{label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Listings Grid */}
        <View style={styles.listingsContainer}>
          {itemImages.map((img, idx) => (
            <TouchableOpacity
              key={idx}
              style={[styles.listingBox, { marginRight: 16, marginBottom: 16 }]}
              onPress={() =>
                navigation.navigate("Item", {
                  image: img,
                  title: "Item Name",
                  price: "$20.00",
                  seller: {
                    name: "Lucas Ness",
                    rating: 4,
                    sold: 15,
                    active: "Active Today",
                  },
                })
              }
            >
              <Image source={img} style={styles.listingImage} resizeMode="cover" />
              <Text style={styles.listingTitle}>Listing Name</Text>
              <Text style={styles.listingPrice}>$10</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Bottom Nav Bar */}
      <View style={styles.navBar}>
        <Image source={require("./icons/nav-tag.png")} style={styles.icon} />
        <Image source={require("./icons/nav-heart.png")} style={styles.icon} />
        <Image source={require("./icons/nav-home.png")} style={styles.icon} />
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
  headerContainer: {
    marginTop: 16,
    alignItems: "center",
  },
  headerText: {
    fontSize: 36,
    fontWeight: "500",
    color: "#000000",
    fontFamily: "Georgia",
  },
  topIconsContainer: {
    position: "absolute",
    right: 16,
    top: 16,
    flexDirection: "row",
  },
  icon: {
    width: 33,
    height: 33,
  },
  factBox: {
    backgroundColor: "#1F4035",
    width: 342,
    height: 180,
    borderRadius: 20,
    padding: 16,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginTop: 24,
  },
  factTitle: {
    color: "white",
    fontSize: 22,
    fontWeight: "600",
  },
  factText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
    marginTop: 8,
  },
  categoriesTitle: {
    fontSize: 22,
    fontWeight: "600",
    color: "#13281F",
    textAlign: "center",
    marginTop: 24,
  },
  categoriesContainer: {
    marginTop: 12,
    paddingHorizontal: 24,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  categoryButton: {
    backgroundColor: "#FCA26E",
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingVertical: 8,
  },
  categoryText: {
    color: "black",
    fontWeight: "500",
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
    padding: 19,
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
  listingPrice: {
    fontSize: 16,
    fontWeight: "500",
    color: "#13281F",
    textAlign: "center",
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
});

export default HomeScreen;
