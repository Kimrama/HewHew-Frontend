export type StoreType = {
  state: boolean;
  image: { uri: string };
  name: string;
  canteen: string;
};

export const sampleStores: StoreType[] = [
  {
    state: true,
    image: { uri: "https://img.freepik.com/free-photo/stir-fried-basil-chicken-rice-with-fried-egg-thai-food_1150-28054.jpg" },
    name: "ร้านอาหารตามสั่ง",
    canteen: "โรงอาหารพระเทพ",
  },
  {
    state: true,
    image: { uri: "https://img.freepik.com/free-photo/stir-fried-basil-chicken-rice-with-fried-egg-thai-food_1150-28054.jpg" },
    name: "ร้านอาหารตามใจ",
    canteen: "โรงอาหารพระใคร",
  },
  {
    state: false,
    image: { uri: "https://img.freepik.com/free-photo/close-up-delicious-noodle-soup_23-2148945682.jpg" },
    name: "ร้านก๋วยเตี๋ยวเรือ",
    canteen: "โรงอาหารกลาง",
  },
  {
    state: true,
    image: { uri: "https://img.freepik.com/free-photo/fresh-salmon-sushi-rolls-plate_1150-28385.jpg" },
    name: "ร้านญี่ปุ่น",
    canteen: "โรงอาหารใต้",
  },
  {
    state: true,
    image: { uri: "https://img.freepik.com/free-photo/front-view-burger-fries-plate_140725-8965.jpg" },
    name: "ร้านเบอร์เกอร์",
    canteen: "โรงอาหารวิศวะ",
  },
  {
    state: true,
    image: { uri: "https://img.freepik.com/free-photo/sweet-pastry-dessert-with-custard-cream_114579-24657.jpg" },
    name: "ร้านเบเกอรี่",
    canteen: "โรงอาหารศิลปศาสตร์",
  },
  {
    state: false,
    image: { uri: "https://img.freepik.com/free-photo/som-tam-thai-food_1150-27367.jpg" },
    name: "ร้านส้มตำ",
    canteen: "โรงอาหารพระเทพ",
  },
  {
    state: true,
    image: { uri: "https://img.freepik.com/free-photo/tomyum-thai-spicy-soup-seafood_1150-28312.jpg" },
    name: "ร้านอาหารอีสาน",
    canteen: "โรงอาหารกลาง",
  },
  {
    state: true,
    image: { uri: "https://img.freepik.com/free-photo/close-up-delicious-korean-food_23-2149184912.jpg" },
    name: "ร้านอาหารเกาหลี",
    canteen: "โรงอาหารวิศวะ",
  },
];