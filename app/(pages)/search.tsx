import { getStore, Stores } from "@/api/store";
import { CanteenList } from "@/components/CanteenList";
import { SearchBar } from "@/components/SearchBar";
import { StoreBlock } from "@/components/StoreBlock";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  ListRenderItem,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const width = 350;
const router = useRouter();
const default_image = require("@/assets/images/default-featured-image.jpg");

const styles = StyleSheet.create({
  RowSpBw: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: width,
  },
});

export default function Search() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCanteen, setSelectedCanteen] = useState<string | null>(null);
  const [stores, setStores] = useState<Stores[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getStore();
        setStores(response);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  const renderStore: ListRenderItem<Stores> = ({ item }) => {
    const imageSource =
      item.shopimage_url && item.shopimage_url.trim() !== ""
        ? { uri: item.shopimage_url }
        : default_image;

    return (
      <StoreBlock
        storeId={item.shop_id}
        state={item.state}
        image={imageSource}
        name={item.name}
        canteen={item.canteen_name}
        widthSize={165}
        heightSize={130}
      />
    );
  };

  const filteredStores = stores.filter((store) => {
    const matchesSearch =
      searchQuery === "" ||
      store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      store.canteen_name.toLowerCase().includes(searchQuery.toLowerCase()); //||

    const matchesCanteen =
      !selectedCanteen || store.canteen_name === selectedCanteen;

    return matchesSearch && matchesCanteen;
  });

  return (
    <LinearGradient
      colors={Colors.bg}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <View>
          <ScrollView
            style={{ paddingTop : 30, paddingBottom: 30, paddingLeft: 30 }}
          >
            {/* search bar */}
            <View style={styles.RowSpBw}>
              <Pressable>
                <MaterialIcons
                  name="arrow-back"
                  size={25}
                  color={Colors.black}
                  onPress={() => router.push("/(tabs)/home")}
                />
              </Pressable>
              <SearchBar
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Search Menu, Store or Canteen"
                style={{ width: 300 }}
              />
            </View>

            {/* Canteen */}
            <View style={{ flex: 1 }}>
              <CanteenList onSelect={setSelectedCanteen} />
            </View>

            {/* Store */}
            <ThemedText
              type="subtitle"
              style={{ marginTop: 20, marginBottom: 10 }}
            >
              Store
            </ThemedText>
            <FlatList
              style={{ width: width }}
              data={filteredStores}
              renderItem={renderStore}
              keyExtractor={(item, index) => item.name + index}
              numColumns={2}
              columnWrapperStyle={{
                justifyContent: "space-between",
                marginBottom: 15,
              }}
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
              ListFooterComponent={<View style={{ marginBottom: 100 }} />}

              // ถ้าไม่มีผลลัพธ์ที่ตรง
              ListEmptyComponent={
                <View style={{ alignItems: "center", marginTop: 20 }}>
                  <Image
                    source={require("@/assets/images/searchStoreNotFound.png")}
                    style={{ width: 160, height: 160 }}
                  />
                  <ThemedText type="subtitle" style={{ marginTop: 20 }}>ไม่พบผลลัพธ์</ThemedText>
                  <ThemedText
                    style={{ marginTop: 10, color: Colors.gray1 }}
                  >{`ลองตรวจสอบคำที่พิมพ์หรือลองค้นหาคำอื่นดู`}</ThemedText>
                </View>
              }
            />
          </ScrollView>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}
