export type StoreType = {
  image: { uri: string };
  name: string;
  canteen: string;
  menus: { name: string; price: number }[];  // 👈 เพิ่ม menus
  onPress: () => void;
};


export const sampleStores = [
  {
    image: { uri: 'https://img.freepik.com/free-photo/stir-fried-basil-chicken-rice-with-fried-egg-thai-food_1150-28054.jpg' },
    name: 'ร้านอาหารตามสั่ง',
    canteen: 'โรงอาหารพระเทพ',
    menus: [
      { name: 'ข้าวกะเพราไก่ไข่ดาว', price: 50 },
      { name: 'ข้าวผัดหมู', price: 45 },
      { name: 'ข้าวราดผัดพริกแกงหมูกรอบ', price: 55 },
    ],
    onPress: () => console.log('ร้านอาหารตามสั่ง'),
  },
  {
    image: { uri: 'https://img.freepik.com/free-photo/stir-fried-basil-chicken-rice-with-fried-egg-thai-food_1150-28054.jpg' },
    name: 'ร้านอาหารตามใจ',
    canteen: 'โรงอาหารพระใคร',
    menus: [
      { name: 'ข้าวกะเพราไก่ไข่ดาว', price: 50 },
      { name: 'ข้าวผัดหมู', price: 45 },
      { name: 'ข้าวราดผัดพริกแกงหมูกรอบ', price: 55 },
    ],
    onPress: () => console.log('ร้านอาหารตามสั่ง'),
  },
  {
    image: { uri: 'https://img.freepik.com/free-photo/close-up-delicious-noodle-soup_23-2148945682.jpg' },
    name: 'ร้านก๋วยเตี๋ยวเรือ',
    canteen: 'โรงอาหารกลาง',
    menus: [
      { name: 'ก๋วยเตี๋ยวเรือหมูน้ำตก', price: 40 },
      { name: 'ก๋วยเตี๋ยวเรือเนื้อสด', price: 50 },
      { name: 'ลวกจิ้มหมู', price: 60 },
    ],
    onPress: () => console.log('ร้านก๋วยเตี๋ยวเรือ'),
  },
  {
    image: { uri: 'https://img.freepik.com/free-photo/fresh-salmon-sushi-rolls-plate_1150-28385.jpg' },
    name: 'ร้านญี่ปุ่น',
    canteen: 'โรงอาหารใต้',
    menus: [
      { name: 'แซลมอนซาซิมิ', price: 120 },
      { name: 'ข้าวหน้าแซลมอน', price: 99 },
      { name: 'โรลปูอัด', price: 80 },
    ],
    onPress: () => console.log('ร้านญี่ปุ่น'),
  },
  {
    image: { uri: 'https://img.freepik.com/free-photo/front-view-burger-fries-plate_140725-8965.jpg' },
    name: 'ร้านเบอร์เกอร์',
    canteen: 'โรงอาหารวิศวะ',
    menus: [
      { name: 'ชีสเบอร์เกอร์', price: 85 },
      { name: 'เฟรนช์ฟรายส์', price: 40 },
      { name: 'ดับเบิ้ลชีสเบอร์เกอร์', price: 120 },
    ],
    onPress: () => console.log('ร้านเบอร์เกอร์'),
  },
  {
    image: { uri: 'https://img.freepik.com/free-photo/sweet-pastry-dessert-with-custard-cream_114579-24657.jpg' },
    name: 'ร้านเบเกอรี่',
    canteen: 'โรงอาหารศิลปศาสตร์',
    menus: [
      { name: 'ครัวซองต์', price: 35 },
      { name: 'ชีสเค้ก', price: 65 },
      { name: 'บราวนี่', price: 45 },
    ],
    onPress: () => console.log('ร้านเบเกอรี่'),
  },
  {
    image: { uri: 'https://img.freepik.com/free-photo/som-tam-thai-food_1150-27367.jpg' },
    name: 'ร้านส้มตำ',
    canteen: 'โรงอาหารพระเทพ',
    menus: [
      { name: 'ส้มตำไทย', price: 40 },
      { name: 'ไก่ย่าง', price: 70 },
      { name: 'ข้าวเหนียว', price: 15 },
    ],
    onPress: () => console.log('ร้านส้มตำ'),
  },
  {
    image: { uri: 'https://img.freepik.com/free-photo/tomyum-thai-spicy-soup-seafood_1150-28312.jpg' },
    name: 'ร้านอาหารอีสาน',
    canteen: 'โรงอาหารกลาง',
    menus: [
      { name: 'ต้มแซ่บกระดูกหมูอ่อน', price: 65 },
      { name: 'ลาบหมู', price: 55 },
      { name: 'น้ำตกหมู', price: 55 },
    ],
    onPress: () => console.log('ร้านอาหารอีสาน'),
  },
  {
    image: { uri: 'https://img.freepik.com/free-photo/close-up-delicious-korean-food_23-2149184912.jpg' },
    name: 'ร้านอาหารเกาหลี',
    canteen: 'โรงอาหารวิศวะ',
    menus: [
      { name: 'บิบิมบับ', price: 110 },
      { name: 'ต๊อกบกกี', price: 95 },
      { name: 'คิมบับ', price: 75 },
    ],
    onPress: () => console.log('ร้านอาหารเกาหลี'),
  },
];
