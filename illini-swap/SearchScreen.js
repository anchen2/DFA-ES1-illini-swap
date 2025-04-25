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

// NOTE: replace this with your real items source or a Context.
const MOCK_ITEMS = [
  { id: 1, title: "Rest is Resistance", category: "Books" },
  { id: 2, title: "Grey Cross Hoodie", category: "Fashion" },
  { id: 3, title: "Wayfarer Glasses", category: "Glasses" },
  { id: 4, title: "Retro Polaroid", category: "Tech" },
  // ...
];

const SearchScreen = ({ navigation }) => {
  const inputRef = useRef(null);
  const [query, setQuery] = useState("");
  const [activeTag, setActiveTag] = useState(null);

  // Auto‑focus search bar when screen mounts
  useEffect(() => {
    const timer = setTimeout(() => inputRef.current?.focus(), 100);
    return () => clearTimeout(timer);
  }, []);

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

  const renderItem = ({ item }) => (
    <View style={styles.resultRow}>
      <Text style={styles.resultText}>{item.title}</Text>
      <Text style={styles.resultCat}>{item.category}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header row */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={require("./icons/arrow-left.png")} style={styles.icon} />
        </TouchableOpacity>
      </View>

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
        />
        <Image source={require("./icons/search.png")} style={styles.searchIcon} />
      </View>

      {/* Recommended tags */}
      <Text style={styles.recommendedTitle}>Recommended</Text>
      <View style={styles.chipWrap}>{RECOMMENDED_TAGS.map(renderChip)}</View>

      {/* Results list */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        ListEmptyComponent={() => (
          <Text style={styles.noResults}>No matching items.</Text>
        )}
        contentContainerStyle={styles.listContent}
      />
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
