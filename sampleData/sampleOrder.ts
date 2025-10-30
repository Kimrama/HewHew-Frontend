export type MenuItem = {
    name: string;
    detail: string;
    price: number;
}

export type OrderType = {
  store: string;
  amount: number;
  canteen: string;
  menus: MenuItem[];
  orderPrice: number;
  name: string;
  address: string;
  deliveryMethod: string;
  appointmentTime: string;
  riderEarn: number;
};

export const sampleOrder: OrderType[] = [
  {
    store: "ชาบูบ้านเพื่อน",
    amount: 2,
    canteen: "ศูนย์อาหารกลาง",
    menus: [
      { name: "ชุดชาบูหมู", detail: "หมูสไลซ์ + ผัก + เส้น + น้ำซุป", price: 129 },
      { name: "น้ำชาเขียว", detail: "รีฟิลได้ไม่อั้น", price: 25 }
    ],
    orderPrice: 154,
    name: "กิตติศักดิ์ อินทราชัย",
    address: "หอพัก B5 ห้อง 102",
    deliveryMethod: "dropOff",
    appointmentTime: "2025-10-11T18:00:00Z",
    riderEarn: 0
  },
  {
    store: "ก๋วยเตี๋ยวเรืออยุธยา",
    amount: 4,
    canteen: "โรงอาหารคณะวิศวกรรม",
    menus: [
      { name: "ก๋วยเตี๋ยวเรือหมูน้ำตก", detail: "เส้นเล็ก หมู น้ำตกเข้มข้น", price: 40 },
      { name: "กากหมูเจียว", detail: "เพิ่มความกรอบอร่อย", price: 10 },
      { name: "ลูกชิ้นลวก", detail: "เสิร์ฟพร้อมน้ำจิ้มรสเด็ด", price: 25 },
      { name: "โค้กกระป๋อง", detail: "เย็นชื่นใจ", price: 20 }
    ],
    orderPrice: 95,
    name: "วาริน หวัง",
    address: "หอพัก D3 ห้อง 205",
    deliveryMethod: "FaceToFace",
    appointmentTime: "2025-10-11T13:00:00Z",
    riderEarn: 20
  }
];