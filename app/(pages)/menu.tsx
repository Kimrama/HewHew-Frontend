import { getStorebyId, Store, getMenubyId, Menu } from "@/api/store";
import { HorizontalTags } from "@/components/HorizontalTags";
import { MenuBlock } from "@/components/MenuBlock";
import { SearchBar } from "@/components/SearchBar";
import { ThemedButton } from "@/components/ThemedButton";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { sampleMenu } from "@/sampleData/sampleMenu";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState, useRef, useContext, useEffect } from "react";
import { FlatList, Image, StyleSheet, View } from "react-native";
import { AuthContext } from "@/store/auth-context";
import { SafeAreaView } from "react-native-safe-area-context";

const width = 412;
const default_image = require("@/assets/images/default-featured-image.jpg");

export default function MenuPage() {
  const router = useRouter();
  const { storeId } = useLocalSearchParams();
  const [stores, setStores] = useState<Store>();
  // const imgUri = Array.isArray(image) ? image[0] : image;
  // const isOpen = states === "true";
  const [searchText, setSearchText] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const [menuCounts, setMenuCounts] = useState<{ [key: string]: number }>({});
  const [menus, setMenus] = useState<Menu[]>([]);
  const { isAuthenticated, logout, token } = useContext(AuthContext);
  const fixSupabaseUrl = (url: string | null | undefined) => {
    if (!url || url.trim() === "") return "";
    return url.replace("/render/image/", "/object/");
  };
  const imageSource = stores?.shop_image_url && stores?.shop_image_url.trim() !== ""
        ? { uri: fixSupabaseUrl(stores?.shop_image_url) }
        : default_image;

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!storeId) return;
        const id = Array.isArray(storeId) ? storeId[0] : storeId;
        const response = await getStorebyId(id);
        console.log(response)


        setStores(response);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [storeId]);

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        if (!stores?.menus || stores.menus.length === 0) {
          console.log("No menus found for this store");
          return;
        }

        console.log("Fetching menus for IDs:", stores.menus);

        const menuDetails = await Promise.all(
          stores.menus.map((id: string) => getMenubyId(id))
        );

        console.log("menuDetails:", menuDetails);
        setMenus(menuDetails);
      } catch (err) {
        console.error("Error fetching menus:", err);
      }
    };
    fetchMenus();
  }, [stores]);

    const filteredMenu = menus.filter((item) => {
    const matchesSearch = item.name
      ?.toLowerCase()
      .includes(searchText.toLowerCase());

    const matchesTag = selected
      ? item.tag1_id === selected || item.tag2_id === selected
      : true;

    return matchesSearch && matchesTag;
  });


  const clickButton = () => {
    if (!isAuthenticated) {
        router.push("/(auth)/login");
        return;
    } else {
      const cartItems = getCartItems();
      console.log(cartItems);

      router.push({
        pathname: "/(pages)/cart",
        params: {
          cart: JSON.stringify(cartItems),
        },
      });
    }
  }

  const handleCountChange = (menuName: string, newCount: number) => {
    setMenuCounts((prev) => ({
      ...prev,
      [menuName]: newCount,
    }));
  };

  const getCartItems = () => {
    return menus
      .filter((item) => (menuCounts[item.name] ?? 0) > 0)
      .map((item) => ({
        name: item.name,
        info: item.detail,
        price: item.price,
        imageUrl: item.image_url,
        count: menuCounts[item.name],
      }));
  };

  const totalItems = Object.values(menuCounts).reduce((sum, c) => sum + c, 0);

  const totalPrice = menus.reduce((sum, item) => {
    const count = menuCounts[item.name] ?? 0;
    return sum + item.price * count;
  }, 0);

  return (
    <LinearGradient
      colors={Colors.bg}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={{ flex: 1 }}
    >
      {/* <SafeAreaView style={{ flex: 1 }}> */}
        <View style={styles.headerImg}>
          <Image source={imageSource}
            style={styles.storeImg}
          />
          <View style={styles.Overlay}></View>
          <ThemedText type="titleMd" style={styles.headerName}>
            {stores?.name}
          </ThemedText>
          <MaterialIcons
            name="location-pin"
            size={25}
            style={styles.headerIcon}
          />
          <ThemedText style={styles.headerCanteen}>{stores?.canteen_name}</ThemedText>
        </View>

        {/* search bar + tag */}
        <View style={{ paddingVertical: 20, alignItems: "center" }}>
          <SearchBar
            placeholder="Search Menu"
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>
        <View style={{ paddingLeft: 20, paddingBottom: 15 }}>
          <HorizontalTags
            tags={stores?.tags}
            selectedTag={selected}
            onPressTag={(tag) => setSelected(tag === selected ? null : tag)}
          />
        </View>
        
        <FlatList
          data={filteredMenu}
          keyExtractor={(item, idx) => `${item.name}-${idx}`}
          contentContainerStyle={{ alignItems: "center" }}
          ListFooterComponent={<View style={{ marginBottom: 120 }}></View>}
          renderItem={({ item }) => (
            <MenuBlock
              name={item.name}
              info={item.detail}
              price={item.price}
              imageUrl={item.image_url}
              tag1={item.tag1_id}
              tag2={item.tag2_id}
              count={menuCounts[item.name] || 0}
              onCountChange={handleCountChange}
            />
          )}
        />

        <View style={styles.button}>
          <ThemedButton
            title={`${totalItems} รายการ`}
            title2={`${totalPrice} ฿`}
            variant="primary"
            onPress={clickButton}
          />
        </View>
      {/* </SafeAreaView> */}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  headerImg: {
    height: 100,
    width: width,
    position: "relative",
  },
  storeImg: {
    height: "100%",
    width: "100%",
  },
  Overlay: {
    height: "100%",
    width: "100%",
    position: "absolute",
    top: 0,
    left: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  headerName: {
    position: "absolute",
    top: 15,
    left: 30,
    color: Colors.white,
  },
  headerIcon: {
    color: Colors.secondary,
    marginRight: 20,
    position: "absolute",
    top: 50,
    left: 30,
  },
  headerCanteen: {
    position: "absolute",
    top: 55,
    left: 60,
    color: Colors.white,
  },
  button: {
    marginVertical: 30,
    position: "absolute",
    left: 30,
    bottom: 30,
  },
});
