import React from "react";
import { View, Text, Image, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const itemImages = [
  require("./images/item1.png"),
  require("./images/item2.png"),
  require("./images/item3.png"),
  require("./images/item4.png"),
];

const HomeScreen = () => {
  return (
    <SafeAreaView className="flex-1 bg-[#FAF7E8]">
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Top Header */}
        <View className="items-center mt-4">
          <Text
            className="text-[36px] font-medium text-black"
            style={{ fontFamily: "Georgia" }} // GimletDisplay font replacement
          >
            Home
          </Text>
        </View>

        {/* Top Right Icons */}
        <View className="absolute right-4 top-4 flex-row space-x-4">
          <Image source={require("./icons/search.png")} className="w-[33px] h-[33px]" />
          <Image source={require("./icons/comment-lines.png")} className="w-[33px] h-[33px]" />
        </View>

        {/* Environmental Fact Box */}
        <View className="bg-[#1F4035] mx-auto mt-6 w-[342px] h-[180px] rounded-[20px] p-4 items-center justify-center">
          <Text className="text-white font-semibold text-[22px]">Environmental Fact</Text>
          <Text className="text-white font-medium text-[16px] mt-2 text-center">
            Every year, around 92 million tons of clothing are discarded globally,
            equivalent to one garbage truck of clothes being dumped in a landfill every second.
          </Text>
        </View>

        {/* Categories */}
        <Text className="text-[22px] font-semibold text-[#13281F] text-center mt-6">Categories</Text>
        <View className="mt-3 px-6 flex-row flex-wrap gap-x-[13px]">
          {["Clothing", "Books", "Tech", "Misc"].map((label, index) => (
            <TouchableOpacity key={index} className="bg-[#FCA26E] rounded-[20px] px-[18px] py-[8px]">
              <Text className="text-black font-medium">{label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Listings Grid */}
        <View className="mt-6 flex-row flex-wrap justify-center gap-x-4 gap-y-4 px-4">
          {itemImages.map((img, idx) => (
            <TouchableOpacity
              key={idx}
              className="w-[164px] p-[19px]"
              onPress={() => console.log("Go to item")}
            >
              <Image
                source={img}
                className="w-full h-[203px] rounded-[10px]"
                resizeMode="cover"
              />
              <Text className="mt-[6px] font-medium text-[#13281F] text-[16px] text-center">
                Listing Name
              </Text>
              <Text className="font-medium text-[#13281F] text-[16px] text-center">$10</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Bottom Nav Bar */}
      <View className="absolute bottom-0 left-0 right-0 h-[75px] bg-[#13281F] flex-row justify-around items-center rounded-t-[25px] px-2">
        <Image source={require("./icons/nav-tag.png")} className="w-[33px] h-[33px]" />
        <Image source={require("./icons/nav-heart.png")} className="w-[33px] h-[33px]" />
        <Image source={require("./icons/nav-home.png")} className="w-[33px] h-[33px]" />
        <Image source={require("./icons/nav-pending.png")} className="w-[33px] h-[33px]" />
        <Image source={require("./icons/nav-user-square.png")} className="w-[33px] h-[33px]" />
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;