import { SearchBar } from '@/components/SearchBar';
import { StoreBlock } from '@/components/StoreBlock';
import { useRef, useState, useEffect } from "react";
import { StoreType, sampleStores } from "@/sampleData/sample";
import { getStore } from "@/api/store";
import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { FlatList, Image, ListRenderItem, Pressable, SafeAreaView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const width = 335;
const itemWidth = 355;
const default_image = require('../../../assets/images/default-featured-image.jpg');


const styles = StyleSheet.create({
  notiButton: {
    backgroundColor: '#fff',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
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
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
    elevation: 5,
  },
  orderButton: {
    position: 'absolute',
    left: 16,
    bottom: 16,
    backgroundColor: Colors.green,
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  advertText: {
    position: 'absolute',
    left: 16,
    top: 16,
  },
  seeAllButton: {
    backgroundColor: '#fff',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  }
});

export default function Index() {
  const insets = useSafeAreaInsets();
  const renderStore: ListRenderItem<typeof sampleStores[0]> = ({ item }) => (
    <StoreBlock {...item} onPress={item.onPress}/>
  );

  const recommendRef = useRef<FlatList<StoreType>>(null);
  const forYouRef = useRef<FlatList<StoreType>>(null);
  const [recommendOffset, setRecommendOffset] = useState(0);
  const [forYouOffset, setForYouOffset] = useState(0);
  const [storeName, setStoreName] = useState<string | null>(null);
  const [canteen, setCanteen] = useState<string | null>(null);
  const [state, setState] = useState(false);
  const [storeImage, setStoreImage] = useState<string>(default_image);

  useEffect(() => {
        const fetchData = async () => {
            const store = await getStore();
            console.log(store);
            setStoreName(store.name);
            setCanteen(store.canteen_name);
            setState(store.state);
            setStoreImage(store.shopimg || default_image);
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
        {/* <ScrollView contentContainerStyle={{ paddingVertical: 30, paddingLeft: 30}}> */}
          {/* header */}
          <View style={styles.headerRow}>
            <ThemedText type="titleLarge">HewHew</ThemedText>
            <Pressable style={styles.notiButton}>
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
            <Pressable style={styles.orderButton}>
              <ThemedText type="default" style={{ color: Colors.white }}>Order Now</ThemedText>
            </Pressable>
          </View>

          {/* Recommend Store */}
          <View style={styles.headerRow}>
              <ThemedText type="subtitle" style={{ marginTop: 20, marginBottom: 10 }}>Recommend Store</ThemedText>
              <Pressable style={styles.seeAllButton} onPress={handleScrollRecommend}>
                <MaterialIcons name="arrow-forward-ios" size={15} color={Colors.black} />
              </Pressable>
          </View>
          <FlatList 
              ref={recommendRef}
              data={sampleStores}
              renderItem={renderStore}
              keyExtractor={(_, index) => index.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              ItemSeparatorComponent={() => <View style={{ width: 10 }} />}
              ListHeaderComponent={<View style={{ width: 30 }} />}
              ListFooterComponent={<View style={{ width: 10, marginBottom: 10 }} />}
              onScroll={e => setRecommendOffset(e.nativeEvent.contentOffset.x)}
              scrollEventThrottle={16}
          />

          {/* For You */}
          <View style={styles.headerRow}>
              <ThemedText type="subtitle" style={{ marginTop: 20, marginBottom: 10 }}>For You</ThemedText>
              <Pressable style={styles.seeAllButton} onPress={handleScrollForYou}>
                <MaterialIcons name="arrow-forward-ios" size={15} color={Colors.black} />
              </Pressable>
          </View>
          <FlatList 
              ref={forYouRef}
              data={sampleStores}
              renderItem={renderStore}
              keyExtractor={(_, index) => index.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              ItemSeparatorComponent={() => <View style={{ width: 10 }} />}
              ListHeaderComponent={<View style={{ width: 30 }} />}
              ListFooterComponent={<View style={{ width: 10, marginBottom: 10 }} />}
              onScroll={e => setForYouOffset(e.nativeEvent.contentOffset.x)}
              scrollEventThrottle={16}
          />
        {/* </ScrollView> */}
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}