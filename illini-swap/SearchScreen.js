import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  FlatList,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFavorites } from "./FavoritesContext";
import { KeyboardAvoidingView, Platform } from "react-native";

/** ------------------------------------------------------------------
 *  SearchScreen
 *  ------------------------------------------------------------------
 *  • Opens when the user taps the magnifying‑glass icon on HomeScreen.
 *  • TextInput auto‑focuses so the keyboard is shown immediately.
 *  • Orange “chips” under the Recommended header act as quick filters.
 *  • Results are filtered by either the active chip OR the query text.
 *  • Tapping the back arrow returns to the previous screen.
 * ------------------------------------------------------------------*/

const RECOMMENDED_TAGS = [
  "Books",
  "Skirts",
  "Shoes",
  "Accessories",
  "Vintage",
  "Glasses",
  "Fashion",
  "Tech",
];

const PAGE_SIZE = 6;

// NOTE: replace this with your real items source or a Context.
const MOCK_ITEMS = [
  { id: 1, source: require("./images/item1.png"), title: "Rest is Resistance", price: "$12", category: "Books" },
  { id: 2, source: require("./images/item2.png"), title: "Grey Cross Hoodie", price: "$35", category: "Fashion" },
  { id: 3, source: require("./images/item3.png"), title: "Wayfarer Glasses", price: "$20", category: "Glasses" },
  { id: 4, source: require("./images/item4.png"), title: "Retro Polaroid", price: "$45", category: "Tech" },
  { id: 5, source: require("./images/item1.png"), title: "Python Textbook", price: "$18", category: "Books" },
  { id: 6, source: require("./images/item2.png"), title: "Vintage Skirt", price: "$22", category: "Skirts" },
  { id: 7, source: require("./images/item3.png"), title: "Running Shoes", price: "$60", category: "Shoes" },
  { id: 8, source: require("./images/item4.png"), title: "Gold Bracelet", price: "$15", category: "Accessories" },
];

const SearchScreen = ({ navigation }) => {
  const inputRef = useRef(null);
  const [query, setQuery] = useState("");
  const [activeTag, setActiveTag] = useState(null);
  const [page, setPage] = useState(1);
  const { favorites, toggleFavorite } = useFavorites();

  // Auto‑focus search bar when screen mounts
  useEffect(() => {
    const timer = setTimeout(() => inputRef.current?.focus(), 100);
    return () => clearTimeout(timer);
  }, []);

  // When search changes, reset pagination
  useEffect(() => {
    setPage(1);
  }, [query, activeTag]);

  // ------------------------------------------------------------------
  // Filtering logic
  // ------------------------------------------------------------------
  const lowerQuery = query.trim().toLowerCase();
  const filtered = MOCK_ITEMS.filter((item) => {
    const matchesTag = activeTag ? item.category === activeTag : true;
    const matchesQuery = lowerQuery.length
      ? item.title.toLowerCase().includes(lowerQuery)
      : true;
    return matchesTag && matchesQuery;
  });

  const paginated = filtered.slice(0, page * PAGE_SIZE);
  const hasMore = paginated.length < filtered.length;
  const loadMore = () => {
    if (hasMore) setPage((p) => p + 1);
  };


  // ------------------------------------------------------------------
  // UI helpers
  // ------------------------------------------------------------------
  const renderChip = (tag) => {
    const selected = activeTag === tag;
    return (
      <TouchableOpacity
        key={tag}
        style={[styles.chip, selected && styles.chipSelected]}
        onPress={() => setActiveTag(selected ? null : tag)}
      >
        <Text style={styles.chipText}>{tag}</Text>
      </TouchableOpacity>
    );
  };

  const renderItem = ({ item, index }) => {
    const imgSrc = typeof item.source === "string" ? { uri: item.source } : item.source;
    const isRightColumn = index % 2 === 1;
  
    
  //   (
  //   <View style={styles.resultRow}>
  //     <Text style={styles.resultText}>{item.title}</Text>
  //     <Text style={styles.resultCat}>{item.category}</Text>
  //   </View>
  // );

  return (
      <TouchableOpacity
        style={[styles.listingBox, isRightColumn && styles.listingBoxRight]}
        onPress={() =>
          navigation.navigate("Item", {
            image: imgSrc,
            title: item.title,
            price: item.price,
            description: item.description,
            seller: { name: "Illini Swap User", rating: 4, sold: 10, active: "Active Today" },
          })
        }
      >
        <Image source={imgSrc} style={styles.listingImage} resizeMode="cover" />
        <Text style={styles.listingTitle} numberOfLines={1}>{item.title}</Text>
        <View style={styles.priceRow}>
          <Text style={styles.listingPrice}>{item.price}</Text>
          <TouchableOpacity onPress={() => toggleFavorite(item.id)}>
            <Image
              source={
                favorites[item.id]
                  ? require("./icons/filled_heart.png")
                  : require("./icons/hollow-heart.png")
              }
              style={styles.heartIcon}
            />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  const ListHeader = () => (
    <View>
      {/* Search bar */}
      <View style={styles.searchBox}>
        <TextInput
          ref={inputRef}
          placeholder="Search"
          placeholderTextColor="#8C8C8C"
          value={query}
          onChangeText={setQuery}
          style={styles.input}
          returnKeyType="search"
          clearButtonMode="while-editing"
        />
        <Image source={require("./icons/search.png")} style={styles.searchIcon} />
      </View>

      {/* Recommended tags */}
      <Text style={styles.recommendedTitle}>Recommended</Text>
      <View style={styles.chipWrap}>{RECOMMENDED_TAGS.map(renderChip)}</View>

      {/* Results count */}
      {(query.length > 0 || activeTag) && (
        <Text style={styles.resultsCount}>
          {filtered.length} result{filtered.length !== 1 ? "s" : ""}
          {activeTag ? ` in ${activeTag}` : ""}
        </Text>
      )}
    </View>
  );

  const ListEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyEmoji}>🔍</Text>
      <Text style={styles.emptyTitle}>No items found</Text>
      <Text style={styles.emptySubtitle}>
        Try a different search term or category
      </Text>
    </View>
  );

  const ListFooter = () => {
    if (!hasMore || filtered.length === 0) return null;
    return (
      <TouchableOpacity style={styles.loadMoreButton} onPress={loadMore}>
        <Text style={styles.loadMoreText}>Load More</Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={0}
      >
        {/* Header row with back arrow */}
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image source={require("./icons/arrow-left.png")} style={styles.icon} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Search</Text>
          <View style={styles.icon} />{/* spacer to center title */}
        </View>

        {/* Results grid */}
        <FlatList
          data={paginated}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          numColumns={2}
          ListHeaderComponent={ListHeader}
          ListEmptyComponent={ListEmpty}
          ListFooterComponent={ListFooter}
          onEndReached={loadMore}
          onEndReachedThreshold={0.4}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.listContent}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};


// ------------------------------------------------------------------
// Styles
// ------------------------------------------------------------------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAF7E8",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 8,
  },
  icon: {
    width: 32,
    height: 32,
  },
  searchBox: {
    marginTop: 24,
    marginHorizontal: 24,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#1F4035",
    borderRadius: 12,
    paddingLeft: 16,
  },
  input: {
    flex: 1,
    fontSize: 16,
    height: 44,
    color: "#000",
  },
  searchIcon: {
    width: 24,
    height: 24,
    marginHorizontal: 12,
  },
  recommendedTitle: {
    marginTop: 32,
    fontSize: 24,
    fontWeight: "600",
    color: "#13281F",
    textAlign: "center",
  },
  chipWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginTop: 16,
    paddingHorizontal: 12,
  },
  chip: {
    backgroundColor: "#FCA26E",
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingVertical: 8,
    margin: 6,
  },
  chipSelected: {
    backgroundColor: "#FA8740",
  },
  chipText: {
    fontWeight: "500",
    color: "#000",
  },
  listContent: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 120,
  },
  resultRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  resultText: {
    fontSize: 16,
    color: "#13281F",
    flexShrink: 1,
  },
  resultCat: {
    fontSize: 14,
    color: "#555",
  },
  noResults: {
    textAlign: "center",
    marginTop: 40,
    color: "#555",
  },
});

export default SearchScreen;
