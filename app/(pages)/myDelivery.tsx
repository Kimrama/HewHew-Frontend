// import { SafeAreaView, StyleSheet, FlatList, View } from 'react-native';
// import { LinearGradient } from 'expo-linear-gradient';
// import { Colors } from '@/constants/Colors';
// import { StatusBlock } from "@/components/StatusBlock";
// import { useEffect, useState } from 'react';
// import { getMyDelivery, Order, OrderbyId, User } from '@/api/order';

// export default function MyDelivery() {
//   const [myDelivery, setMyDelivery] = useState<(Order & { User?: User; OrderbyId?: OrderbyId })[]>([]);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await getMyDelivery();
//         console.log(response);
//         setMyDelivery(response);
//       } catch (err) {
//         console.error(err);
//       }
//     };
//     fetchData();
//   }, []);

//   return (
//     <LinearGradient
//       colors={Colors.bg}
//       start={{ x: 0, y: 0 }}
//       end={{ x: 0, y: 1 }}
//       style={{ flex: 1 }}
//     >
//       <View style={{ flex: 1, alignItems: 'center' }}>
//         <FlatList
//           data={myDelivery}
//           keyExtractor={(item, index) => `${item.OrderID}-${index}`}
//           contentContainerStyle={{ paddingVertical: 10 }}
//           showsVerticalScrollIndicator={false}
//           ListFooterComponent={<View style={{ marginBottom: 50 }} />}
//           renderItem={({ item }) => {
//             const totalQuantity = item.MenuQuantity?.reduce(
//               (sum, menu) => sum + (menu.Quantity ?? 0),
//               0
//             ) ?? 0;

//             return (
//               <StatusBlock
//                 name={item.User.username}
//                 canteen={item.OrderbyId?.canteen_name}
//                 store={item.OrderbyId?.shop_name}
//                 appointmentTime={item.AppointmentTime}
//                 deliveryMethod={item.DeliveryMethod}
//                 amount={totalQuantity}
//                 price={item.TransactionLog.Amount ?? 0}
//                 status={item.Status}
//                 type='rider'
//               />
//             );
//           }}
//         />
//       </View>
//     </LinearGradient>
//   );
// }
