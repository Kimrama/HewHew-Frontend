import { SafeAreaView, StyleSheet, ScrollView, View, Pressable, Image, FlatList, ListRenderItem } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { ThemedText } from '@/components/ThemedText';
import { SearchBar } from '@/components/SearchBar';
import { StoreBlock } from '@/components/StoreBlock';
import { useRouter } from 'expo-router';
import { sampleStores } from "@/sampleData/sample";
import { CanteenList } from "@/components/CanteenList";
import { useRef, useState } from "react";

const width = 350;
const router = useRouter();

const styles = StyleSheet.create({
  RowSpBw: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: width,
  },
});

export default function Search() {
  const renderStore: ListRenderItem<typeof sampleStores[0]> = ({ item }) => (
    <StoreBlock {...item} widthSize={165} heightSize={130}/>
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCanteen, setSelectedCanteen] = useState<string | null>(null);

  const filteredStores = sampleStores.filter((store) => {
    const matchesSearch =
      searchQuery === "" ||
      store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      store.canteen.toLowerCase().includes(searchQuery.toLowerCase()) //||
      // store.menus.some((f) => f.name.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCanteen =
      !selectedCanteen || store.canteen === selectedCanteen;

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
          <ScrollView style={{paddingTop: 50, paddingBottom: 30, paddingLeft: 30}}>
            {/* search bar */}
            <View style={styles.RowSpBw}>
              <Pressable>
                <MaterialIcons name="arrow-back-ios" size={25} color={Colors.black} onPress={() => router.push("/(tabs)/home")}/>
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
            <ThemedText type="subtitle" style={{ marginTop: 20, marginBottom: 10 }}>Store</ThemedText>
            <FlatList style={{width: width}}
              data={filteredStores}
              renderItem={renderStore}
              keyExtractor={(item, index) => item.name + index}
              numColumns={2}
              columnWrapperStyle={{ justifyContent: "space-between", marginBottom: 15 }}
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
              ListFooterComponent={<View style={{ height: 50 }} />}
              
              // ถ้าไม่มีผลลัพธ์ที่ตรง
              ListEmptyComponent={
                <View style={{ alignItems: "center", marginTop: 20 }}>
                  <Image source={require('@/assets/images/searchStoreNotFound.png')} style={{width: 160, height: 160}}/>
                  <ThemedText type="subtitle" style={{ marginTop: 20 }}>No results found</ThemedText>
                  <ThemedText style={{marginTop: 10, color: Colors.gray}}>{`Try checking your spelling or
searching for something else.`}</ThemedText>
                </View>
              }
            />
          </ScrollView>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}