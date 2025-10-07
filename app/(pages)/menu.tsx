import { SafeAreaView, StyleSheet, ScrollView, View, Pressable, Image, FlatList, ListRenderItem } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { ThemedText } from '@/components/ThemedText';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useRef, useState } from "react";
import { SearchBar } from '@/components/SearchBar';
import { HorizontalTags } from "@/components/HorizontalTags";
import { MenuBlock } from "@/components/MenuBlock";
import { sampleMenu } from "@/sampleData/sampleMenu";

const width = 412;

const styles = StyleSheet.create({
    headerImg: {
        height: 150,
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
        top: 35,
        left: 30,
        color: Colors.white
    },
    headerIcon: {
        color: Colors.secondary,
        marginRight: 20,
        position: "absolute",
        top: 80,
        left: 30
    },
    headerCanteen: {
        position: "absolute",
        top: 85,
        left: 60,
        color: Colors.white
    }
});

export default function Menu() {
    const { states, image, name , canteen } = useLocalSearchParams();
    const imgUri = Array.isArray(image) ? image[0] : image;
    const isOpen = states === "true";
    const [selected, setSelected] = useState<string | null>(null);

    const tags = ["Popular", "Noodle", "Spicy", "Curry", "Dessert", "Sweet", "Soup", "Rice", "Quick", "Egg", "Budget"]
    const [searchText, setSearchText] = useState("");

    const filteredMenu = sampleMenu.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchText.toLowerCase());
    const matchesTag = selected ? item.tag1 === selected || item.tag2 === selected : true;
    return matchesSearch && matchesTag;
    });

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
        <FlatList
            data={filteredMenu}
            keyExtractor={(item, idx) => `${item.name}-${idx}`}
            contentContainerStyle={{ paddingBottom: 30, alignItems: "center" }}
            renderItem={({ item }) => (
                <MenuBlock
                name={item.name}
                price={item.price}
                imageUrl={item.imageUrl}
                tag1={item.tag1} 
                tag2={item.tag2}
                />
            )}
        />
        </SafeAreaView>
    </LinearGradient>
    );
}