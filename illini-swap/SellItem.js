import React, {useState, useEffect} from "react";
import {
   View,
   Text,
   TextInput,
   Image,
   ScrollView,
   TouchableOpacity,
   StyleSheet,
   ActivityIndicator,
   Platform,
   Modal,           // ← add
  FlatList,        // ← add
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import RNPickerSelect from "react-native-picker-select";
import * as ImagePicker from "expo-image-picker";

const SellItem = () => {
 // Initialize navigation to allow going back or navigating to other screens
 const navigation = useNavigation();
//
//
const [images, setImages] = useState([]);  
 const [title, setTitle] = useState("");
 const [price, setPrice] = useState("");
 const [description, setDescription] = useState("");
 const [category, setCategory] = useState("");
 const [condition, setCondition] = useState("");
 const availableTags = ["Clothing", "Books", "Tech", "Misc"];
  const [selectedTags, setSelectedTags] = useState([]);
  const [showTagsModal, setShowTagsModal] = useState(false);
  const [imageUri, setImageUri] = useState(null);
  const [successModalVisible, setSuccessModalVisible] = useState(false);
const [pendingListing, setPendingListing] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Required", "We need media library permissions!");
      }
    })();
  }, []);

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,  // ← use the old constant for now
        allowsMultipleSelection: true,
        quality: 0.7,
        allowsEditing: false,
      });
  
      const uris = result.assets
        ? result.assets.map(a => a.uri)
        : result.uri
          ? [result.uri]
          : [];
  
      setImages(prev => {
        const all = [...prev, ...uris];
        return Array.from(new Set(all));
      });
    } catch (err) {
      console.error("launchImageLibraryAsync failed:", err);
      Alert.alert("Error", "Could not open image picker.");
    }
  };

  const removeImage = (uri) => {
    setImages((prev) => prev.filter((u) => u !== uri));
  };

  const onPost = () => {
    // prepend $ if needed...
    const listingPrice = price.trim()
      ? price.trim().startsWith("$")
        ? price.trim()
        : `$${price.trim()}`
      : "";

      setPendingListing({
        images,
        title,
        price: listingPrice,
        description,
        category,
      });
      setSuccessModalVisible(true);
  };

  

 return (
   <SafeAreaView style={styles.container}>
       {/* 1) Header on dark background */}
       <View style={styles.headerContainer}>
         <Text style={styles.headerTitle}>Sell an Item</Text>
       </View>

       {/* 2) All form fields in one cream "card" */}
       <View style={styles.formBackground}>
         <ScrollView
           contentContainerStyle={styles.scrollContainer}
           showsVerticalScrollIndicator={false}>
           {/* Upload Photos */}
        {/* 1) Multi‑image picker */}
        <Text style={styles.subHeading}>Upload Photos</Text>
        <TouchableOpacity onPress={pickImage} style={styles.uploadPlaceholder}>
        <Image
                  source={require("./icons/upload_pic.png")}
                  style={styles.uploadIcon}
                />
        </TouchableOpacity>

        {/* Show thumbnails */}
        <ScrollView horizontal style={styles.thumbContainer}>
          {images.map((uri) => (
            <View key={uri} style={styles.thumbWrapper}>
              <Image source={{ uri }} style={styles.thumb} />
              <TouchableOpacity
                style={styles.removeBtn}
                onPress={() => removeImage(uri)}
              >
                <Text style={styles.removeText}>×</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>


           {/* Title Input */}
           <View style={styles.formGroup}>
             <Text style={styles.subHeading}>Title</Text>
             <TextInput
               style={styles.input}
               placeholder="Name your listing..."
               placeholderTextColor="#999"
               value={title}
               onChangeText={setTitle}
             />
           </View>

           {/* Description Input */}
           <View style={styles.formGroup}>
             <Text style={styles.subHeading}>Description</Text>
             <TextInput
               style={[styles.input, styles.multilineInput]}
               placeholder="Tell shoppers more about your product…"
               placeholderTextColor="#999"
               value={description}
               onChangeText={setDescription}
               multiline
             />
           </View>


           {/* Select Category */}
           <View style={styles.formGroup}>
             <RNPickerSelect
               onValueChange={setCategory}
               value={category}
               placeholder={{ label: "Select Category", value: "" , color: "#1F4035"}}
               items={[
                 { label: "Clothing",      value: "clothing" },
                 { label: "Books",         value: "books" },
                 { label: "Tech",          value: "tech" },
                 { label: "Miscellaneous", value: "misc" },
               ]}
               style={{
                 inputIOS:    styles.pickerInput,
                 inputAndroid:styles.pickerInput,
                 placeholder:   { color: "#1F4035" },
                 iconContainer: styles.iconContainer,
               }}
               Icon={() => (
                 <Image
                   source={require("./icons/chevron-down.png")}
                   style={styles.chevron}
                 />
               )}
             />
           </View>

             {/* Select Condition */}
             <View style={styles.formGroup}>
               <RNPickerSelect
                 onValueChange={setCondition}
                 value={condition}
                 placeholder={{ label: "Select Condition", value: "" , color: "#1F4035"}}
                 items={[
                   { label: "New",      value: "new" },
                   { label: "Like New", value: "like-new" },
                   { label: "Used",     value: "used" },
                   { label: "For Parts",value: "parts" },
                 ]}
                 style={{
                   inputIOS:    styles.pickerInput,
                   inputAndroid:styles.pickerInput,
                   placeholder:   { color: "#1F4035" },
                   iconContainer: styles.iconContainer,
                 }}
                 Icon={() => (
                   <Image
                     source={require("./icons/chevron-down.png")}
                     style={styles.chevron}
                   />
                 )}
               />
             </View>

           {/* Add Tags */}
           <View style={styles.formGroup}>
        <Text style={styles.subHeading}>Add tags</Text>

        {/* 2a) show selected tags as badges */}
        <View style={styles.tagsContainer}>
          {selectedTags.map((tag) => (
            <View key={tag} style={styles.tagBadge}>
              <Text style={styles.tagBadgeText}>{tag}</Text>
            </View>
          ))}
        </View>

        {/* 2b) opener for the modal */}
        <TouchableOpacity
          style={styles.dropdown}
          onPress={() => setShowTagsModal(true)}
        >
          <Text style={styles.dropdownText}>Add or select tags</Text>
          <Image
            source={require("./icons/chevron-down.png")}
            style={styles.icon}
          />
        </TouchableOpacity>
      </View>

      {/* 3) Tag selection modal */}
      <Modal
        visible={showTagsModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowTagsModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Tags</Text>
            <FlatList
              data={availableTags}
              keyExtractor={(item) => item}
              renderItem={({ item }) => {
                const isSelected = selectedTags.includes(item);
                return (
                  <TouchableOpacity
                    style={[
                      styles.modalItem,
                      isSelected && styles.modalItemSelected,
                    ]}
                    onPress={() => {
                      if (isSelected) {
                        setSelectedTags((tags) =>
                          tags.filter((t) => t !== item)
                        );
                      } else {
                        setSelectedTags((tags) => [...tags, item]);
                      }
                    }}
                  >
                    <Text
                      style={[
                        styles.modalItemText,
                        isSelected && styles.modalItemTextSelected,
                      ]}
                    >
                      {item}
                    </Text>
                  </TouchableOpacity>
                );
              }}
            />
            <TouchableOpacity
              style={styles.modalDoneButton}
              onPress={() => setShowTagsModal(false)}
            >
              <Text style={styles.modalDoneButtonText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Price Input */}
      <View style={styles.formGroup}>
         <Text style={styles.subHeading}>Price</Text>
          <TextInput
            style={styles.input}
            placeholder="$0.00"
            placeholderTextColor="#999"
            keyboardType="numeric"
            value={price}
            onChangeText={setPrice}
          />
       </View>
      <View>
      <TouchableOpacity style={styles.postButton} onPress={onPost}>
          <Text style={styles.postButtonText}>Post</Text>
        </TouchableOpacity>
        </View>
         </ScrollView>
       </View>


     {/* Bottom Navigation Bar (reuse your existing style) */}
     <View style={styles.navBar}>
       {/* Tag icon (active screen) */}
       <TouchableOpacity onPress={() => console.log("Stay on TagScreen")}>
         <Image
           source={require("./icons/tag-icon.png")}
           style={[styles.navIcon, { tintColor: "#FCA26E" }]}
         />
       </TouchableOpacity>


       {/* Heart icon */}
       <TouchableOpacity onPress={() => navigation.navigate("Favorites")}>
         <Image
           source={require("./icons/nav-heart.png")}
           style={styles.navIcon}
         />
       </TouchableOpacity>


       {/* Home icon */}
       <TouchableOpacity onPress={() => navigation.navigate("Home")}>
          <Image source={require("./icons/home-icon.png")} style={[styles.navIcon, { tintColor: "#FAF7E8" }]} />
       </TouchableOpacity>


       {/* Pending icon */}
       <TouchableOpacity onPress={() => console.log("Go to Pending")}>
         <Image
           source={require("./icons/nav-pending.png")}
           style={styles.navIcon}
         />
       </TouchableOpacity>


       {/* User icon */}
       <TouchableOpacity onPress={() => console.log("Go to Profile")}>
         <Image
           source={require("./icons/nav-user-square.png")}
           style={styles.navIcon}
         />
       </TouchableOpacity>
      </View>
      <Modal
  visible={successModalVisible}
  transparent
  animationType="fade"
>
  <View style={styles.successOverlay}>
    <View style={styles.successBox}>
      {/* ✕ button */}
      <TouchableOpacity
        style={styles.successClose}
        onPress={() => {
          setSuccessModalVisible(false);
          // now navigate, passing the listing
          navigation.navigate("Home", { newListing: pendingListing });
        }}
      >
        <Text style={styles.successCloseText}>×</Text>
      </TouchableOpacity>

      <Text style={styles.successTitle}>Item Listed!</Text>
      <Text style={styles.successSubtitle}>
        The environment thanks you!
      </Text>
    </View>
  </View>
</Modal>
   </SafeAreaView>
 );
};




//styles
const styles = StyleSheet.create({


 container: {
   flex: 1,
   backgroundColor: "#13281F",
 },

 thumbContainer: {
  flexDirection: "row",
  marginTop: 12,
  marginBottom: 24,
},
thumbWrapper: {
  position: "relative",
  marginRight: 12,
},
thumb: {
  width: 80,
  height: 80,
  borderRadius: 8,
},
removeBtn: {
  position: "absolute",
  top: -6,
  right: -6,
  backgroundColor: "rgba(0,0,0,0.6)",
  borderRadius: 12,
  width: 24,
  height: 24,
  alignItems: "center",
  justifyContent: "center",
},
removeText: { color: "#FFF", fontSize: 18, lineHeight: 18 },
formGroup: { marginBottom: 16 },
input: {
  backgroundColor: "#FAF7E8",
  borderColor: "#64817D",
  borderWidth: 2,
  borderRadius: 8,
  padding: 12,
  fontSize: 16,
  color: "#13281F",
  marginTop: 8,
},
multilineInput: { height: 100, textAlignVertical: "top" },
postButton: {
  backgroundColor: "#FCA26E",
  paddingVertical: 14,
  borderRadius: 12,
  alignItems: "center",
  marginTop: 24,
},
 /* Container that holds the entire screen */
  /* Allows ScrollView content to go behind the nav bar if necessary */
 scrollContainer: {
   paddingBottom: 100,
   paddingHorizontal: 24,
 },
 /* Main header/title */
 headerContainer: {
    marginTop: 20,
    marginLeft: 100,
    width: 190,
    height: 42,
 },
 headerTitle: {
   fontSize: 36,
   fontWeight: "500",
   color: "#FAF7E8",
   fontFamily: "Gimlet Display",
   textAlign: "center",
 },
 /* Upload Section */
 formBackground: {
     flex: 1,
     backgroundColor: "#FAF7E8",
     borderTopLeftRadius: 30,
     borderTopRightRadius: 30,
     paddingHorizontal: 10,
     paddingTop: 20,
     marginTop: 20,
   },
 uploadSection: {
     marginBottom: 24,
     marginTop: 10,
   },
 subHeading: {
   fontSize: 22,
   fontWeight: "600",
   color: "#1F4035",
   //marginBottom: 8,
   fontFamily: "Montserrat",
 },
 uploadPlaceholder: {
   width: 123,
   height: 114,
   backgroundColor: "#FF9457",
   borderRadius: 20,
   alignItems: "center",
   justifyContent: "center",
   marginTop: 10,

 },
 icon: {
     width: 33,
     height: 33,
     tintColor: "#64817D",
   },
 uploadIcon: {
   width: 38,
   height: 38,
   //tintColor: "#FFF", // make the icon white or remove if your icon is pre-colored
 },
 /* Form Group Container */
 formGroup: {
   marginBottom: 24,
 },
 input: {
   backgroundColor: "#FAF7E8",
   borderColor: "#64817D",
   borderWidth: 2,
   borderRadius: 8,
   paddingHorizontal: 16,
   paddingVertical: 12,
   marginTop: 10,
   fontSize: 16,
   color: "#1F4035",
 },
 /* Multiline text input for the description */
 multilineInput: {
   height: 100,
   textAlignVertical: "top",
 },
 /* Dropdown placeholder style */
 dropdown: {
   flexDirection: "row",
   alignItems: "center",
   justifyContent: "space-between",
   backgroundColor: "#FAF7E8",
   borderColor: "#64817D",
   borderWidth: 2,
   borderRadius: 8,
   paddingHorizontal: 16,
   paddingVertical: 8,
   marginTop: 10,
 },
 dropdownText: {
   fontSize: 16,
   color: "#13281F",
 },
 dropdownIcon: {
   width: 17,
   height: 10,

   tintColor: "#64817D", // adjust as needed
 },
 pickerWrapper: {
   backgroundColor:   "#FAF7E8",
   borderColor:       "#64817D",
   borderWidth:       2,
   borderRadius:      8,
   marginTop:         10,
   // on iOS the Picker expands automatically; on Android it needs a fixed height:
   height: 50,
   justifyContent:    "center",
   overflow:          "hidden",
 },
 picker: {
   width:  "100%",
   height: "100%",
   color:  "#13281F",
 },
 pickerInput: {
     fontSize: 16,
     color: "#13281F",
     paddingVertical: Platform.OS === "ios" ? 14 : 10,
     paddingHorizontal: 16,
     backgroundColor: "#FAF7E8",
     borderWidth: 2,
     borderColor: "#64817D",
     borderRadius: 8,
   },
   iconContainer: {
     top: Platform.OS === "ios" ? 18 : 14,
     right: 12,
   },
   chevron: {
     width: 30,
     height: 20,
     tintColor: "#64817D",
   },
   tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 10,
  },
  tagBadge: {
    backgroundColor: "#FCA26E",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginRight: 8,
    marginBottom: 8,
  },
  tagBadgeText: {
    color: "#13281F",
    fontWeight: "500",
  },
  
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    maxHeight: "70%",
    backgroundColor: "#FAF7E8",
    borderRadius: 20,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 16,
    textAlign: "center",
  },
  modalItem: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  modalItemSelected: {
    backgroundColor: "#64817D",
  },
  modalItemText: {
    fontSize: 16,
    color: "#13281F",
  },
  modalItemTextSelected: {
    color: "#FAF7E8",
    fontWeight: "600",
  },
  modalDoneButton: {
    marginTop: 12,
    backgroundColor: "#13281F",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  modalDoneButtonText: {
    color: "#FAF7E8",
    fontSize: 16,
    fontWeight: "600",
  },
  uploadedPhoto: {
    width:  "100%",        // fill the placeholder
    height: "100%",
    borderRadius: 20,      // match your orange box
    resizeMode: "cover",   // scale & crop to fill
  },
  postButton: {
    backgroundColor: "#FCA26E",
    marginHorizontal: 24,
    marginVertical: 16,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  postButtonText: {
    color: "#13281F",
    fontWeight: "600",
    fontSize: 18,
  },
  successOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  successBox: {
    width: 300,
    padding: 24,
    backgroundColor: "#1F4035",
    borderRadius: 20,
    alignItems: "center",
    position: "relative",
  },
  successClose: {
    position: "absolute",
    top: 12,
    right: 12,
    padding: 4,
  },
  successCloseText: {
    color: "#FAF7E8",
    fontSize: 20,
    lineHeight: 20,
  },
  successTitle: {
    fontSize: 28,
    color: "#FAF7E8",
    fontWeight: "600",
    marginBottom: 8,
    textAlign: "center",
  },
  successSubtitle: {
    fontSize: 16,
    color: "#FAF7E8",
    textAlign: "center",
  },
//   /* Bottom nav bar reusing a style similar to your HomeScreen */
//   navBar: {
//     position: "absolute",
//     bottom: 0,
//     left: 0,
//     right: 0,
//     height: 75,
//     backgroundColor: "#13281F",
//     borderTopLeftRadius: 25,
//     borderTopRightRadius: 25,
//     paddingTop: 14,
//     paddingBottom: 22,
//     flexDirection: "row",
//     justifyContent: "space-around",
//     alignItems: "center",
//     paddingHorizontal: 8,
//   },
//   navIcon: {
//     width: 33,
//     height: 33,
//     tintColor: "#FFF",
//   },
// //  scrollContainer: {
// //    paddingBottom: 140, // Increased padding for nav bar
// //    flexGrow: 1, // Enables scroll when content is short
// //  },






//   headerContainer: {
//     marginTop: 16,
//     alignItems: "center",
//   },
//   headerText: {
//     fontSize: 36,
//     fontWeight: "500",
//     color: "#000000",
//     fontFamily: "Georgia",
//   },
//   photoBox: {
//     marginTop:70,
//     left: 30,
//     width: 123,
//     height: 114.36,
//   },
//   sellContainer: {
//     marginTop: 123,
//     width: 390,
//     height: 721,
//   },




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

export default SellItem;