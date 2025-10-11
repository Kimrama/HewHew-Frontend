import { getStore, Store } from "@/api/store";
import { SearchBar } from '@/components/SearchBar';
import { StoreBlock } from '@/components/StoreBlock';
import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { FlatList, Image, ListRenderItem, Pressable, SafeAreaView, StyleSheet, View, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const width = 350;
const itemWidth = 370;
const default_image = require('@/assets/images/default-featured-image.jpg')


const styles = StyleSheet.create({
  brand: {
    top: 10,
    fontSize: 30,
    fontFamily: "KaushanScript_400Regular",
    color: "#0A6847",
  },
  notiButton: {
    backgroundColor: '#fff',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    marginTop: 20,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: width,
    marginLeft: 30
  },
  advert: {
    marginTop: 20,
    marginBottom: 10,
    marginLeft: 30,
    width: width,
    height: 150,
    borderRadius: 20,     
    overflow: 'hidden',
    elevation: 5,          
    position: 'relative', 
  },
  image: {
    width: '100%',
    height: '100%',
  },
  advertText: {
    position: 'absolute',
    left: 16,
    top: 16,
    color: '#fff',    
    zIndex: 1,          
  },
  orderButton: {
    position: 'absolute',
    left: 16,
    bottom: 16,
    backgroundColor: Colors.green,
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 16,
    zIndex: 1,   
  },
  seeAllButton: {
    backgroundColor: '#fff',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
  },
  cartButton: {
    position: 'absolute',
    right: 31,
    bottom: 5,
    backgroundColor: Colors.primary,
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  }
});

export default function Index() {
  const insets = useSafeAreaInsets();
  const fixSupabaseUrl = (url: string | null | undefined) => {
  if (!url || url.trim() === "") return "";
    return url.replace("/render/image/", "/object/");
  };

  const renderStore: ListRenderItem<Store> = ({ item }) => {
    const imageSource =
      item.ImageURL && item.ImageURL.trim() !== ""
        ? { uri: fixSupabaseUrl(item.ImageURL) }
        : default_image;
    return (
      <StoreBlock
        state={item.State}
        image={imageSource}
        name={item.Name}
        canteen={item.CanteenName}
      />
    );
  };


  const recommendRef = useRef<FlatList<Store>>(null);
  const forYouRef = useRef<FlatList<Store>>(null);
  const [recommendOffset, setRecommendOffset] = useState(0);
  const [forYouOffset, setForYouOffset] = useState(0);
  const [stores, setStores] = useState<Store[]>([])
  const router = useRouter();

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

  const handleScrollRecommend = () => {
    const newOffset = recommendOffset + itemWidth;
    if (recommendRef.current) {
      recommendRef.current.scrollToOffset({ offset: newOffset, animated: true });
      setRecommendOffset(newOffset);
    }
  };

  const handleScrollForYou = () => {
    const newOffset = forYouOffset + itemWidth;
    if (forYouRef.current) {
      forYouRef.current.scrollToOffset({ offset: newOffset, animated: true });
      setForYouOffset(newOffset);
    }
  };

  return (
    <LinearGradient
      colors={Colors.bg}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={{ flex: 1, paddingBottom: 60 + insets.bottom }}>
        <View style={{paddingVertical: 30}}>
          {/* header */}
          <View style={styles.headerRow}>
            <Text style={styles.brand}>HewHew</Text>
            <Pressable style={styles.notiButton} onPress={() => {router.push("/(pages)/notifications");}}>
              <MaterialIcons name="notifications" size={25} color={Colors.secondary} />
            </Pressable>
          </View>

          {/* search bar */}
          <SearchBar navigateOnPress placeholder="Search Menu, Store or Canteen" style={{ marginTop: 20, marginLeft: 30 }} />

          {/* advert */}
          <View style={styles.advert}>
            <Image
              source={{ uri: 'https://blog.texasoralsurgery.com/hs-fs/hubfs/iStock-1416417320.jpg?width=900&name=iStock-1416417320.jpg' }}
              style={styles.image}
            />
            <View style={styles.advertText}>
              <ThemedText type="default">
                Taste Made Easy,{"\n"}Anytime You Want!
              </ThemedText>
            </View>
            <Pressable style={styles.orderButton} onPress={()=>router.push("/(pages)/cart")}>
              <ThemedText type="default" style={{ color: Colors.white }}>Order Now</ThemedText>
            </Pressable>
          </View>

          {/* Recommend Store */}
          <View style={styles.headerRow}>
              <ThemedText type="subtitle" style={{ marginTop: 20, marginBottom: 10 }}>Recommend Store</ThemedText>
              <Pressable style={styles.seeAllButton} onPress={handleScrollRecommend}>
                <MaterialIcons name="arrow-forward" size={20} color={Colors.black} />
              </Pressable>
          </View>
          {stores && (
            <FlatList 
                ref={recommendRef}
                data={stores}
                renderItem={renderStore}
                keyExtractor={(_, index) => index.toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
                ItemSeparatorComponent={() => <View style={{ width: 15 }} />}
                ListHeaderComponent={<View style={{ width: 30 }} />}
                ListFooterComponent={<View style={{ width: 10, marginBottom: 10 }} />}
                onScroll={e => setRecommendOffset(e.nativeEvent.contentOffset.x)}
                scrollEventThrottle={16}
            />
          )}

          {/* For You */}
          <View style={styles.headerRow}>
              <ThemedText type="subtitle" style={{ marginTop: 20, marginBottom: 10 }}>For You</ThemedText>
              <Pressable style={styles.seeAllButton} onPress={handleScrollForYou}>
                <MaterialIcons name="arrow-forward" size={20} color={Colors.black} />
              </Pressable>
          </View>

          {stores && (
            <FlatList 
                ref={forYouRef}
                data={stores}
                renderItem={renderStore}
                keyExtractor={(_, index) => index.toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
                ItemSeparatorComponent={() => <View style={{ width: 15 }} />}
                ListHeaderComponent={<View style={{ width: 30 }} />}
                ListFooterComponent={<View style={{ width: 10, marginBottom: 10 }} />}
                onScroll={e => setForYouOffset(e.nativeEvent.contentOffset.x)}
                scrollEventThrottle={16}
            />
          )}
          
          {/* cart button */}
          <Pressable style={styles.cartButton}  onPress={() => {router.push("/(pages)/cart");}}>
            <MaterialIcons name="shopping-cart" size={30} color={Colors.white} />
          </Pressable>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}