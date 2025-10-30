type StatusType = {
  name: string;
  canteen: string;
  store: string;
  appointmentTime: string;
  dropOffMethod: string;
  amount: number;
  price: number;
  status: string;
};

export const sampleStatus: StatusType[] = [
  {
    name: "Warin Wang",
    canteen: "Canteen A",
    store: "Fresh Burger",
    appointmentTime: "2025-10-07T10:30:00Z",
    dropOffMethod: "FacetoFace",
    amount: 2,
    price: 100,
    status: "delivered",
  },
  {
    name: "Nisa Chaiyawan",
    canteen: "Canteen B",
    store: "Sushi Express",
    appointmentTime: "2025-10-07T11:00:00Z",
    dropOffMethod: "dropOff",
    amount: 1,
    price: 100,
    status: "pending",
  },
  {
    name: "Somchai Lek",
    canteen: "Canteen C",
    store: "Pizza Corner",
    appointmentTime: "2025-10-07T12:15:00Z",
    dropOffMethod: "FacetoFace",
    amount: 3,
    price: 100,
    status: "searching",
  },
  {
    name: "Ploy Sukhum",
    canteen: "Canteen A",
    store: "Vegan Salad",
    appointmentTime: "2025-10-07T13:00:00Z",
    dropOffMethod: "dropOff",
    amount: 1,
    price: 100,
    status: "delivered",
  },
  {
    name: "Krit Phong",
    canteen: "Canteen B",
    store: "Noodle House",
    appointmentTime: "2025-10-07T14:30:00Z",
    dropOffMethod: "FacetoFace",
    amount: 4,
    price: 100,
    status: "pending",
  },
];
