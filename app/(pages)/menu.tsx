import { getMenubyId, getStorebyId, Menu, Store } from "@/api/store";
import { HorizontalTags } from "@/components/HorizontalTags";
import { MenuBlock } from "@/components/MenuBlock";
import { SearchBar } from "@/components/SearchBar";
import { ThemedButton } from "@/components/ThemedButton";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { AuthContext } from "@/store/auth-context";
import { useCart } from "@/store/cart-context";
import { MaterialIcons } from "@expo/vector-icons";
import Ionicons from "@expo/vector-icons/Ionicons";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useContext, useEffect, useState } from "react";
import { FlatList, Image, StyleSheet, View } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

const default_image = require("@/assets/images/default-featured-image.jpg");

export default function MenuPage() {
  const router = useRouter();
  const { storeId } = useLocalSearchParams();
  const [store, setStore] = useState<Store>();
  const [searchText, setSearchText] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [menus, setMenus] = useState<Menu[]>([]);
  const { isAuthenticated } = useContext(AuthContext);
  const { updateQuantity, getCartItemQuantity, totalItems, addToCart } =
    useCart();
  const insets = useSafeAreaInsets();

  const fixSupabaseUrl = (url: string | null | undefined) => {
    if (!url || url.trim() === "") return "";
    return url.replace("/render/image/", "/object/");
  };

  const imageSource = store?.shop_image_url
    ? { uri: fixSupabaseUrl(store.shop_image_url) }
    : default_image;

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!storeId) return;
        const id = Array.isArray(storeId) ? storeId[0] : storeId;
        const response = await getStorebyId(id);
        setStore(response);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [storeId]);

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        if (!store?.menus || store.menus.length === 0) {
          setMenus([]);
          return;
        }
        const menuDetails = await Promise.all(
          store.menus.map((id: string) => getMenubyId(id))
        );
        setMenus(menuDetails);
      } catch (err) {
        console.error("Error fetching menus:", err);
      }
    };
    fetchMenus();
  }, [store]);

  const handleTagPress = (tag: string) => {
    if (selectedTag === tag) {
      setSelectedTag(null);
    } else {
      setSelectedTag(tag);
    }
  };

  const filteredMenu = menus.filter((item) => {
    const matchesSearch = item.name
      ?.toLowerCase()
      .includes(searchText.toLowerCase());
    const matchesTag = selectedTag ? item.tags.includes(selectedTag) : true;
    return matchesSearch && matchesTag;
  });

  const allTags = Array.from(new Set(menus.flatMap((item) => item.tags)));

  const handleCheckout = () => {
    if (!isAuthenticated) {
      router.push("/(auth)/login");
      return;
    }
    router.push("/(pages)/cart");
  };

  return (
    <LinearGradient
      colors={Colors.bg as any}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.container}
    >
      {store?.state === false ? (
        <>
          <View style={styles.closedBanner}>
            <MaterialIcons name='store' size={24} style={{color: Colors.white}}></MaterialIcons>
            <ThemedText type='subtitle' style={{color: Colors.white}}>ปิดให้บริการในขณะนี้</ThemedText>
          </View>
          <View style={styles.headerImg}>
            <Image source={imageSource} style={styles.storeImg} />
            <View style={styles.Overlay} />

            <ThemedText type="titleMd" style={styles.headerName}>
              {store?.name}
            </ThemedText>
            <MaterialIcons
              name="location-pin"
              size={25}
              style={styles.headerIcon}
            />

            <ThemedText style={styles.headerCanteen}>
              {store?.canteen_name}
            </ThemedText>

            <View style={styles.headerOverlay}></View>
          </View>
        </>
      ) : (
        <>
          <View style={styles.headerImg}>
            <Image source={imageSource} style={styles.storeImg} />
            <View style={styles.Overlay} />

            <ThemedText type="titleMd" style={styles.headerName}>
              {store?.name}
            </ThemedText>

            <MaterialIcons
              name="location-pin"
              size={25}
              style={styles.headerIcon}
            />

            <ThemedText style={styles.headerCanteen}>
              {store?.canteen_name}
            </ThemedText>
          </View>
        </>
      )}

      <View style={styles.menuContainer}>
        <View style={styles.searchAndTags}>
          <View style={{ marginVertical: 15, alignItems: "center" }}>
              <SearchBar
                placeholder="Search Menu"
                value={searchText}
                onChangeText={setSearchText}
              />
          </View>
          <View style={{ marginLeft: 10 }}>
            <HorizontalTags
              tags={allTags}
              selectedTag={selectedTag}
              onPressTag={handleTagPress}
            />
          </View>
        </View>

        <View style={{alignItems: "center" }}>
          <FlatList
            data={filteredMenu}
            keyExtractor={(item) => item.menu_id}
            renderItem={({ item }) => (
              <MenuBlock
                name={item.name}
                info={item.detail}
                price={item.price}
                status={
                  item.status === 'unavailable' || store?.state === false
                    ? 'unavailable'
                    : item.status
                }
                imageUrl={fixSupabaseUrl(item.image_url)}
                count={getCartItemQuantity(item.menu_id)}
                onCountChange={(newCount) => {
                  if (newCount > getCartItemQuantity(item.menu_id)) {
                    addToCart(item.menu_id, store?.name);
                  } else {
                    updateQuantity(item.menu_id, newCount);
                  }
                }}
              />
            )}
            contentContainerStyle={[
              styles.listContentContainer,
              { paddingBottom: insets.bottom + (totalItems > 0 ? 80 : 20) },
            ]}
          />
        </View>
      </View>

      {totalItems > 0 && (
        <View
          style={[
            styles.checkoutButtonContainer,
            { paddingBottom: insets.bottom + 10 },
          ]}
        >
          <ThemedButton
            title={`เริ่มต้นคำสั่งซื้อ (${totalItems} รายการ)`}
            onPress={handleCheckout}
            variant="primary"
            style={{ width: "100%" }}
          />
        </View>
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: 150,
    backgroundColor: "#000",
  },
  headerImage: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  headerContent: {
    flex: 1,
    paddingHorizontal: 15,
    justifyContent: "flex-end",
    paddingBottom: 20,
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 15,
    zIndex: 10,
    padding: 5,
  },
  storeInfo: {},
  storeName: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.white,
    marginBottom: 5,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  storeLocation: {
    fontSize: 16,
    color: Colors.white,
    marginLeft: 5,
  },
  menuContainer: {
    flex: 1,
    backgroundColor: "transparent",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -20,
    paddingTop: 20,
  },
  searchAndTags: {
    alignContent: "center",
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  listContentContainer: {
    paddingHorizontal: 15,
  },
  checkoutButtonContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingTop: 10,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  checkoutPrice: {
    position: "absolute",
    right: 20,
    color: Colors.white,
    fontWeight: "bold",
    fontSize: 16,
  },
  headerImg: {
    height: 100,
    width: 412,
    position: "relative",
  },
  headerOverlay: {
    height: 100,
    width: 412,
    position: "absolute",
    top: 0,
    left: 0,
    backgroundColor: "rgba(195, 195, 195, 0.5)",
    zIndex: 10,
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
  closedBanner: {
    flexDirection: "row",
    gap: 10,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
    backgroundColor: Colors.red,
    // borderTopLeftRadius: 20,
    // borderTopRightRadius: 20,
    height: 45,
  }
});
