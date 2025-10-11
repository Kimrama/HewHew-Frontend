import { getMenu, Menu } from "@/api/store";
import { SafeAreaView, StyleSheet, ScrollView, View, Pressable, Image, FlatList, ListRenderItem } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { ThemedText } from '@/components/ThemedText';
import { ThemedButton } from '@/components/ThemedButton';
import { useRouter, useLocalSearchParams, router } from 'expo-router';
import { useRef, useState, useEffect } from "react";
import { SearchBar } from '@/components/SearchBar';
import { HorizontalTags } from "@/components/HorizontalTags";
import { MenuBlock } from "@/components/MenuBlock";
import { sampleMenu } from "@/sampleData/sampleMenu";

const width = 412;
const default_image = require('@/assets/images/default-featured-image.jpg')

const styles = StyleSheet.create({
    headerImg: {
        height: 100,
        width: width,
        position: "relative"
    },
    storeImg: {
        height: "100%",
        width: "100%"
    },
    Overlay: {
        height: "100%",
        width: "100%",
        position: "absolute",
        top: 0,
        left: 0,
        backgroundColor: "rgba(0,0,0,0.4)"
    },
    headerName: {
        position: "absolute",
        top: 15,
        left: 30,
        color: Colors.white
    },
    headerIcon: {
        color: Colors.secondary,
        marginRight: 20,
        position: "absolute",
        top: 50,
        left: 30
    },
    headerCanteen: {
        position: "absolute",
        top: 55,
        left: 60,
        color: Colors.white
    },
    button: {
        marginVertical: 30,
        position: 'absolute',
        left: 30,
        bottom: 30
    }
});

export default function MenuPage() {
    const router = useRouter();
    const { states, image, name , canteen } = useLocalSearchParams();
    const imgUri = Array.isArray(image) ? image[0] : image;
    const isOpen = states === "true";
    const [searchText, setSearchText] = useState("");
    const [selected, setSelected] = useState<string | null>(null);
    const [menuCounts, setMenuCounts] = useState<{ [key: string]: number }>({});
    const [menus, setMenus] = useState<Menu[]>([])

    // menu -> tagID -> api -> tag name
    const tags = ["Popular", "Noodle", "Spicy", "Curry", "Dessert", "Sweet", "Soup", "Rice", "Quick", "Egg", "Budget"]

    // menu -> name
    // menu -> tagID -> api -> menu in tag

    // const filteredMenu = menus.filter(item => {
    // const matchesSearch = item.Name.toLowerCase().includes(searchText.toLowerCase());
    // const matchesTag = selected ? item.Tag1ID === selected || item.Tag2ID === selected : true;
    // return matchesSearch && matchesTag;
    // });
    const filteredMenu = sampleMenu.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchText.toLowerCase());
    const matchesTag = selected ? item.tag1 === selected || item.tag2 === selected : true;
    return matchesSearch && matchesTag;
    });

    // useEffect(() => {
    //     const fetchData = async () => {
    //         try {
    //         const response = await getMenu();
    //         setMenus(response);
    //         } catch (err) {
    //         console.error(err);
    //         }
    //     };
    //     fetchData();
    // }, []);

    const handleCountChange = (menuName: string, newCount: number) => {
    setMenuCounts(prev => ({
        ...prev,
        [menuName]: newCount,
        }));
    };

    // const getMenuLine = () => {
    //     return sampleMenu
    //     .filter(item => (menuCounts[item.name] ?? 0) > 0)
    //     .map(item => ({
    //         ...item,
    //         quantity: menuCounts[item.name],
    //     }));
    // };

    return (
        <LinearGradient
          colors={Colors.bg}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={{ flex: 1 }}
        >
        <SafeAreaView style={{ flex: 1}}>
        <View style={styles.headerImg}>
            <Image
                source={{ uri: imgUri }}
                style={styles.storeImg}
            />
            <View style={styles.Overlay}></View>
            <ThemedText type='titleMd' style={styles.headerName}>{name}</ThemedText>
            <MaterialIcons
                name="location-pin"
                size={25}
                style={styles.headerIcon}
            />
            <ThemedText style={styles.headerCanteen}>{canteen}</ThemedText>
        </View>

        {/* search bar + tag */}
        <View style={{paddingVertical: 20, alignItems: 'center'}}>
            <SearchBar placeholder="Search Menu" value={searchText} onChangeText={setSearchText}/>
        </View>
        <View style={{paddingLeft: 20, paddingBottom: 15}}>
            <HorizontalTags
                tags={tags}
                selectedTag={selected}
                onPressTag={(tag) => setSelected(tag === selected ? null : tag)}
            />
        </View>
        {/* <FlatList
            data={filteredMenu}
            keyExtractor={(item, idx) => `${item.Name}-${idx}`}
            contentContainerStyle={{ alignItems: "center" }}
            ListFooterComponent={<View style={{marginBottom: 120}}></View>}
            renderItem={({ item }) => (
                <MenuBlock
                name={item.Name}
                price={item.Price}
                imageUrl={
                    item.ImageURL && item.ImageURL.trim() !== ""
                    ? item.ImageURL
                    : default_image
                }
                tag1={item.Tag1ID}??
                tag2={item.Tag2ID}??
                count={menuCounts[item.Name] || 0}
                onCountChange={handleCountChange}
                />
            )}
        /> */}
        <FlatList
            data={filteredMenu}
            keyExtractor={(item, idx) => `${item.name}-${idx}`}
            contentContainerStyle={{ alignItems: "center" }}
            ListFooterComponent={<View style={{marginBottom: 120}}></View>}
            renderItem={({ item }) => (
                <MenuBlock
                name={item.name}
                info={item.info}
                price={item.price}
                imageUrl={item.imageUrl}
                tag1={item.tag1}
                tag2={item.tag2}
                count={menuCounts[item.name] || 0}
                onCountChange={handleCountChange}
                />
            )}
        />

        <View style={styles.button}>
            <ThemedButton title="{} รายการ" title2="฿ {}" variant="primary" onPress={() => router.push('/(pages)/cart')} />
        </View>
        </SafeAreaView>
    </LinearGradient>
    );
}