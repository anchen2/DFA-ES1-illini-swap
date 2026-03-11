import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFavorites } from "./FavoritesContext"; // <== Import context!


import { useNavigation, useRoute, useFocusEffect } from "@react-navigation/native";

const itemImages = [
  { id: 1, source: require("./images/item1.png"), title: "Listing Name", price: "$10" },
  { id: 2, source: require("./images/item2.png"), title: "Listing Name", price: "$10" },
  { id: 3, source: require("./images/item3.png"), title: "Listing Name", price: "$10" },
  { id: 4, source: require("./images/item4.png"), title: "Listing Name", price: "$10" },
]; 


const itemData = [
  { id: 1, image: require("./images/item1.png"), title: "Item 1" },
  { id: 2, image: require("./images/item2.png"), title: "Item 2" },
  { id: 3, image: require("./images/item3.png"), title: "Item 3" },
  { id: 4, image: require("./images/item4.png"), title: "Item 4" },

];

const HomeScreen = () => {
  const navigation = useNavigation();

  const route = useRoute();

  const { favorites, toggleFavorite } = useFavorites(); // <== Use context!


  // now this useState comes from React
  const [listings, setListings] = useState(itemImages);

  useFocusEffect(
    useCallback(() => {
      if (route.params?.newListing) {
      //   setListings((prev) => [
      //     ...prev,
      //     {
      //       images: route.params.newListing.images,
      //       title: route.params.newListing.title,
      //       price: route.params.newListing.price,
      //     },
      //   ]);
      //   navigation.setParams({ newListing: undefined });
      // }
      const newItem = {
        id: Date.now().toString(),
        ...route.params.newListing,
      };
      setListings(prev => [...prev, newItem]);
      navigation.setParams({ newListing: undefined });
    }
    }, [route.params?.newListing])
  );
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
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Image
              source={require("./icons/search.png")}
              style={[styles.icon, { marginRight: 16 }]}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate("Messages")}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Image 
              source={require("./icons/comment-lines.png")} 
              style={styles.icon} 
            />
          </TouchableOpacity>
          
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
        {listings.map(item => {
            const firstImage = item.images?.[0] ?? item.source;
            const imgSrc = typeof firstImage === 'string'
              ? { uri: firstImage }
              : firstImage;
            const sellerInfo = item.seller ?? { name: 'Lucas Ness', rating: 4, sold: 15, active: 'Active Today' };

            return (
              <TouchableOpacity
                key={item.id}
                style={[styles.listingBox, { marginRight: 16, marginBottom: 16 }]}
                onPress={() => navigation.navigate('Item', {
                  image: imgSrc,
                  title: item.title,
                  price: item.price,
                  description: item.description,
                  seller: sellerInfo,
                })}
              >
                <Image source={imgSrc} style={styles.listingImage} resizeMode="cover" />
                <Text style={styles.listingTitle}>{item.title}</Text>
                <View style={styles.priceRow}>
                  <Text style={styles.listingPrice}>{item.price}</Text>
                  <TouchableOpacity onPress={() => toggleFavorite(item.id)}>
                    <Image
                      source={
                        favorites[item.id]
                          ? require("./icons/filled_heart.png")
                          : require("./icons/hollow-heart.png")
                      }
                      style={{ width: 21, height: 21, resizeMode: "contain" }}
                    />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            );
          })}
          {/* {listings.map((item, idx) => {
            const firstImage = item.images?.[0] ?? item.source;
            const imgSrc = typeof firstImage === "string"
              ? { uri: firstImage }
              : firstImage;
            return (
              <TouchableOpacity key={idx} style={[styles.listingBox, { marginRight: 16, marginBottom: 16 }]}>
                <Image
                  source={imgSrc}
                  style={styles.listingImage}
                  resizeMode="cover"
                />
                <Text style={styles.listingTitle}>{item.title}</Text>
                <Text style={styles.listingPrice}>{item.price}</Text>
              </TouchableOpacity>
            );
            })} */}
          {/* {itemImages.map((item) => 
            {
              const firstImage = item.images?.[0] ?? item.source;
              return (
                <TouchableOpacity
              key={item.id}
              style={[styles.listingBox, { marginRight: 16, marginBottom: 16 }]}
              onPress={() =>
                navigation.navigate("Item", {
                  image: firstImage,
                  title: item.title,
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
              <Image source={firstImage} style={styles.listingImage} resizeMode="cover" />
              <Text style={styles.listingTitle}>{item.title}</Text>
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 2 }}>
                <Text style={styles.listingPrice}>$10</Text>
                <TouchableOpacity onPress={() => toggleFavorite(item.id)}>
                  <Image
                    source={
                      favorites[item.id]
                        ? require("./icons/filled_heart.png")
                        : require("./icons/hollow-heart.png")
                    }
                    style={{ width: 21, height: 21, resizeMode: "contain" }}
                  />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
              );
              })} */}

        </View>
      </ScrollView>

      {/* Bottom Nav Bar */}
      <View style={styles.navBar}>
        <TouchableOpacity onPress={() => navigation.navigate("SellItem")}>
            <Image source={require("./icons/tag-icon.png")} style={[styles.navIcon, { tintColor: "#FAF7E8" }]} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Favorites")}>
          <Image source={require("./icons/nav-heart.png")} style={styles.icon} />
        </TouchableOpacity>

        <Image source={require("./icons/home-icon.png")} style={[styles.navIcon, { tintColor: "#FCA26E" }]} />
        <TouchableOpacity onPress={() => navigation.navigate("Pending")}>
          <Image source={require("./icons/nav-pending.png")} style={styles.icon} />
        </TouchableOpacity>
        <Image source={require("./icons/nav-user-square.png")} style={styles.icon} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FAF7E8" },
  scrollContainer: { paddingBottom: 140, flexGrow: 1 },
  headerContainer: { marginTop: 16, alignItems: "center" },
  headerText: { fontSize: 36, fontWeight: "500", color: "#000", fontFamily: "Georgia" },
  topIconsContainer: { position: "absolute", right: 16, top: 16, flexDirection: "row" },
  icon: { width: 33, height: 33 },
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
  factTitle: { color: "white", fontSize: 22, fontWeight: "600" },
  factText: { color: "white", fontSize: 16, fontWeight: "500", textAlign: "center", marginTop: 8 },
  categoriesTitle: { fontSize: 22, fontWeight: "600", color: "#13281F", textAlign: "center", marginTop: 24 },
  categoriesContainer: { marginTop: 12, paddingHorizontal: 24, flexDirection: "row", flexWrap: "wrap" },
  categoryButton: { backgroundColor: "#FCA26E", borderRadius: 20, paddingHorizontal: 18, paddingVertical: 8 },
  categoryText: { color: "black", fontWeight: "500" },
  listingsContainer: { marginTop: 24, flexDirection: "row", flexWrap: "wrap", justifyContent: "center", paddingHorizontal: 16 },
  listingBox: { width: 164, padding: 19 },
  listingImage: { width: "100%", height: 203, borderRadius: 10 },
  listingTitle: { fontSize: 16, fontWeight: "500", color: "#13281F", textAlign: "center", marginTop: 6 },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 4,
    marginTop: 2,
  },
  listingPrice: { fontSize: 16, fontWeight: "500", color: "#13281F" },
  heartIcon: { width: 21, height: 21, resizeMode: "contain" },
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

export default HomeScreen;
