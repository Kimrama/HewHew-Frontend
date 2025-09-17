import { SafeAreaView, StyleSheet, ScrollView, View, Pressable, Image, FlatList, ListRenderItem } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { ThemedText } from '@/components/ThemedText';
import { SearchBar } from '@/components/SearchBar';
import { StoreBlock } from '@/components/StoreBlock';

const width = 335;

const styles = StyleSheet.create({
  page: { flex: 1 },
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
  },
  advert: {
    marginTop: 20,
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
});

const sampleStores = [
  {
    image: { uri: 'https://cdn.shopify.com/s/files/1/0027/1866/2714/files/american-shrimp-fried-rice-served-with-chili-fish-sauce-thai-food.jpg?v=1746772616' },
    name: 'ร้านอาหารตามสั่ง',
    canteen: 'โรงอาหารพระเทพ',
    onPress: () => console.log('ร้านอาหารตามสั่ง'),
  },
  {
    image: { uri: 'https://cdn.shopify.com/s/files/1/0027/1866/2714/files/american-shrimp-fried-rice-served-with-chili-fish-sauce-thai-food.jpg?v=1746772616' },
    name: 'ร้านก๋วยเตี๋ยว',
    canteen: 'โรงอาหารกลาง',
    onPress: () => console.log('ร้านก๋วยเตี๋ยว'),
  },
  {
    image: { uri: 'https://cdn.shopify.com/s/files/1/0027/1866/2714/files/american-shrimp-fried-rice-served-with-chili-fish-sauce-thai-food.jpg?v=1746772616' },
    name: 'ร้านเบเกอรี่',
    canteen: 'โรงอาหารใต้',
    onPress: () => console.log('ร้านเบเกอรี่'),
  },
  {
    image: { uri: 'https://cdn.shopify.com/s/files/1/0027/1866/2714/files/american-shrimp-fried-rice-served-with-chili-fish-sauce-thai-food.jpg?v=1746772616' },
    name: 'ร้านอาหารตามสั่ง',
    canteen: 'โรงอาหารพระเทพ',
    onPress: () => console.log('ร้านอาหารตามสั่ง'),
  },
  {
    image: { uri: 'https://cdn.shopify.com/s/files/1/0027/1866/2714/files/american-shrimp-fried-rice-served-with-chili-fish-sauce-thai-food.jpg?v=1746772616' },
    name: 'ร้านก๋วยเตี๋ยว',
    canteen: 'โรงอาหารกลาง',
    onPress: () => console.log('ร้านก๋วยเตี๋ยว'),
  },
  {
    image: { uri: 'https://cdn.shopify.com/s/files/1/0027/1866/2714/files/american-shrimp-fried-rice-served-with-chili-fish-sauce-thai-food.jpg?v=1746772616' },
    name: 'ร้านเบเกอรี่',
    canteen: 'โรงอาหารใต้',
    onPress: () => console.log('ร้านเบเกอรี่'),
  },
];

export default function Index() {
  const renderStore: ListRenderItem<typeof sampleStores[0]> = ({ item }) => (
    <StoreBlock {...item} />
  );

  return (
    <LinearGradient
      colors={Colors.bg}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{paddingVertical: 30, paddingLeft: 30}}>
        {/* <ScrollView contentContainerStyle={{ paddingVertical: 30, paddingLeft: 30}}> */}
          {/* header */}
          <View style={styles.headerRow}>
            <ThemedText type="titleLarge">HewHew</ThemedText>
            <Pressable style={styles.notiButton}>
              <MaterialIcons name="notifications" size={25} color={Colors.secondary} />
            </Pressable>
          </View>

          {/* search bar */}
          <SearchBar placeholder="Search Menu, Store or Canteen" style={{ marginTop: 20 }} />

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
          <ThemedText type="subtitle" style={{ marginTop: 20, marginBottom: 10 }}>Recommend Store</ThemedText>
          <FlatList
            data={sampleStores}
            renderItem={renderStore}
            keyExtractor={(_, index) => index.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
          />

          {/* For You */}
          <ThemedText type="subtitle" style={{ marginTop: 20, marginBottom: 10 }}>For You</ThemedText>
          <FlatList
            data={sampleStores}
            renderItem={renderStore}
            keyExtractor={(_, index) => index.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
          />
        {/* </ScrollView> */}
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}