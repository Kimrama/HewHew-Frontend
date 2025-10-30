import { SafeAreaView, StyleSheet, View, FlatList } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/Colors';
import { ThemedText } from '@/components/ThemedText';
import { useRouter } from 'expo-router';
import { OrderType, sampleOrder } from '@/sampleData/sampleOrder';
import { OrderBlock } from '@/components/OrderBlock';
import { ThemedButton } from '@/components/ThemedButton';
import Toast from "react-native-toast-message";

export default function ConfirmOrder() {
  const router = useRouter();

  const showSuccess = () => {
    Toast.show({
      type: "customSuccess",
      text1: "ดำเนินการสำเร็จ!",
      text2: "คุณได้ยืนยันการจัดส่งแล้ว",
      position: 'top',
      visibilityTime: 2000,
      autoHide: true,
      props: { instant: true },
    });

    setTimeout(() => router.push("/(pages)/myDelivery"), 2000);
  };

  const renderItem = ({ item, index }: { item: OrderType; index: number }) => (
    <OrderBlock
      store={item.store}
      amount={item.amount}
      canteen={item.canteen}
      menus={item.menus}
      orderPrice={item.orderPrice}
      name={item.name}
      address={item.address}
      deliveryMethod={item.deliveryMethod}
      appointmentTime={item.appointmentTime}
      riderEarn={item.riderEarn}
      index={index + 1}
      type="confirmOrder"
    />
  );

  return (
    <LinearGradient
      colors={Colors.bg}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={{ flex: 1, paddingHorizontal: 31, paddingTop: 20 }}>
        
        {/* Header */}
        <View style={[styles.row, { justifyContent: 'space-between', paddingBottom: 10 }]}>
          <View style={styles.canteen}>
            <ThemedText>{sampleOrder[0].canteen}</ThemedText>
          </View>
        </View>

        {/* can del when add wrong order?? */}
        {/* List of Orders */}
        <FlatList
          data={sampleOrder}
          keyExtractor={(_, index) => index.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 120 }}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => (
            <View
              style={{
                height: 1,
                backgroundColor: Colors.gray1 ?? "#E0E0E0",
                marginVertical: 10,
              }}
            />
          )}
        />

        {/* Confirm Button */}
        <View style={styles.button}>
          <ThemedButton
            title="ยืนยันการจัดส่ง"
            variant="primary"
            onPress={showSuccess}
          />
        </View>

        {/* Success Toast */}
        <Toast
          config={{
            customSuccess: ({ text1, text2 }) => (
              <View
                style={{
                  backgroundColor: Colors.white,
                  borderColor: Colors.primary,
                  borderWidth: 1,
                  borderLeftWidth: 6,
                  borderRadius: 12,
                  padding: 16,
                  width: 350,
                  alignSelf: 'center',
                  shadowColor: "#000",
                  shadowOpacity: 0.2,
                  shadowOffset: { width: 0, height: 2 },
                  shadowRadius: 4,
                  elevation: 3,
                }}
              >
                <ThemedText type='subtitle'>{text1}</ThemedText>
                <ThemedText>{text2}</ThemedText>
              </View>
            ),
          }}
        />
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  canteen: {
    height: 25,
    paddingHorizontal: 10,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: Colors.primary,
    borderWidth: 1,
    backgroundColor: Colors.white,
  },
  button: {
    marginVertical: 30,
    position: 'absolute',
    left: 30,
    bottom: 30,
  },
});
