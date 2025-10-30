import { getCanteen, Canteen } from "@/api/store";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { MaterialIcons } from "@expo/vector-icons";
import React, { useState, useEffect } from "react";
import { FlatList, Pressable, StyleSheet, View } from "react-native";

type CanteenListProps = {
  onSelect: (canteen: string | null) => void; // callback ส่งชื่อ canteen
};

export const CanteenList: React.FC<CanteenListProps> = ({ onSelect }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [selectedCanteen, setSelectedCanteen] = useState<string | null>(null);
  const [canteens, setCanteens] = useState<Canteen[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getCanteen();
        setCanteens(response);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  const uniqueCanteens = Array.from(
    new Set(canteens.map((c) => c.CanteenName))
  ).map((CanteenName) => ({ canteen: CanteenName }));

  const toggleExpand = () => {
    setIsExpanded((prev) => !prev);
  };

  const handleSelectCanteen = (canteen: string) => {
    if (selectedCanteen === canteen) {
      // ถ้ากดซ้ำ → ยกเลิก
      setSelectedCanteen(null);
      onSelect(null); // reset filter
    } else {
      setSelectedCanteen(canteen);
      onSelect(canteen);
    }
  };

  const renderCanteen = ({ item }: { item: { canteen: string } }) => {
    const isSelected = selectedCanteen === item.canteen;
    return (
      <Pressable onPress={() => handleSelectCanteen(item.canteen)}>
        <View
          style={[
            styles.Selected,
            {
              backgroundColor: isSelected ? Colors.white : "transparent",
              borderColor: isSelected ? Colors.green : "transparent",
            },
          ]}
        >
          <MaterialIcons
            name="location-pin"
            size={20}
            style={{ color: Colors.primary, marginRight: 20 }}
          />
          <ThemedText>{item.canteen}</ThemedText>
        </View>
      </Pressable>
    );
  };

  return (
    <View>
      <View style={styles.RowSpBw}>
        <ThemedText type="subtitle">Canteen</ThemedText>
        <Pressable onPress={toggleExpand}>
          <View style={styles.dropDownButton}>
            <MaterialIcons
              name={isExpanded ? "keyboard-arrow-up" : "keyboard-arrow-down"}
              size={20}
              color="#000"
            />
          </View>
        </Pressable>
      </View>

      {isExpanded ? (
        // เปิด list
        <FlatList
          style={{marginTop: 10}}
          data={uniqueCanteens}
          renderItem={renderCanteen}
          keyExtractor={(item, index) => item.canteen + index}
          scrollEnabled={false}
        />
      ) : (
        // ปิด list + selected
        selectedCanteen && (
          <View
            style={[styles.Selected, {marginTop: 12}]}>
            <MaterialIcons
              name="location-pin"
              size={20}
              style={{ color: Colors.primary, marginRight: 20 }}
            />
            <ThemedText>{selectedCanteen}</ThemedText>
          </View>
        )
      )}
    </View>
  );
};



const styles = StyleSheet.create({
    RowSpBw: {
      marginTop: 20,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: 350,
    },
    Row: {
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center',
      paddingVertical: 10
    },
    Selected: {
      width: 350,
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center',
      borderWidth: 1,
      paddingVertical: 6,
      paddingHorizontal: 10,
      marginVertical: 2,
      borderRadius: 25,
      backgroundColor: Colors.white,
      borderColor: Colors.green,
    },
    dropDownButton: {
      backgroundColor: '#fff',
      width: 30,
      height: 30,
      borderRadius: 15,
      justifyContent: 'center',
      alignItems: 'center',
      elevation: 5,
    }
});