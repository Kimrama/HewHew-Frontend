import { SafeAreaView, StyleSheet, FlatList, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/Colors';
import { StatusBlock } from "@/components/StatusBlock";
import { sampleStatus } from "@/sampleData/sampleStatus";

export default function myOrder() {
  return (
    <LinearGradient
      colors={Colors.bg}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={{ flex: 1 , alignItems: 'center'}}>
        <FlatList
          data={sampleStatus}
          keyExtractor={(item, index) => `${item.name}-${index}`}
          contentContainerStyle={{ paddingVertical: 10 }}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={<View style={{marginBottom: 50}}></View>}
          renderItem={({ item }) => (
            <StatusBlock
              name={item.name}
              canteen={item.canteen}
              store={item.store}
              appointmentTime={item.appointmentTime}
              deliveryMethod={item.dropOffMethod}
              amount={item.amount}
              price={item.price}
              status={item.status}
              type='receiver'
            />
          )}
        />
      </SafeAreaView>
    </LinearGradient>
  );
}
