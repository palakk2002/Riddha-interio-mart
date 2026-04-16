export const initialAvailableOrders = [
  {
    id: "ORD-7721",
    customerName: "Rahul Sharma",
    address: "B-42, Shanti Nagar, Near City Hospital, Jaipur, Rajasthan",
    phone: "+91 98765 43210",
    sellerLocation: "Elite Interiors, Mansarovar, Jaipur",
    items: [
      { name: "Modern Velvet Cushion", quantity: 2, price: 1200 },
      { name: "Ceramic Flower Vase", quantity: 1, price: 850 }
    ],
    totalBill: 3250,
    paymentMode: "Prepaid",
    dateTime: "06 Apr 2026, 11:30 AM",
    status: "Pending"
  },
  {
    id: "ORD-9934",
    customerName: "Priya Patel",
    address: "Flat 402, Sunshine Residency, Vaishali Nagar, Jaipur",
    phone: "+91 87654 32109",
    sellerLocation: "Classic Marble Co., VKI Area, Jaipur",
    items: [
      { name: "Classic Italian Tile (Box)", quantity: 5, price: 2500 }
    ],
    totalBill: 12500,
    paymentMode: "Cash on Delivery",
    dateTime: "06 Apr 2026, 12:15 PM",
    status: "Pending"
  },
  {
    id: "ORD-3312",
    customerName: "Amit Verma",
    address: "H-12, Malviya Nagar, Sector 4, Jaipur",
    phone: "+91 76543 21098",
    sellerLocation: "Urban Decor Store, Tonk Road, Jaipur",
    items: [
      { name: "Macrame Wall Hanging", quantity: 1, price: 1500 },
      { name: "Scented Candle Set", quantity: 1, price: 600 }
    ],
    totalBill: 2100,
    paymentMode: "Prepaid",
    dateTime: "06 Apr 2026, 10:45 AM",
    status: "Pending"
  }
];

export const initialMyOrders = [
  {
    id: "ORD-5541",
    customerName: "Sneha Gupta",
    address: "C-110, Everest Colony, Lalkothi, Jaipur",
    phone: "+91 65432 10987",
    sellerLocation: "Royal Furniture, Raja Park, Jaipur",
    items: [
      { name: "Oak Wood Side Table", quantity: 1, price: 4500 }
    ],
    totalBill: 4500,
    paymentMode: "Prepaid",
    dateTime: "06 Apr 2026, 09:30 AM",
    status: "Accepted"
  }
];

export const earningsData = {
  today: 450,
  thisWeek: 3150,
  total: 12840,
  perOrderCommission: 150,
  recentEarnings: [
    { date: "06 Apr 2026", orders: 3, amount: 450 },
    { date: "05 Apr 2026", orders: 4, amount: 600 },
    { date: "04 Apr 2026", orders: 2, amount: 300 },
    { date: "03 Apr 2026", orders: 5, amount: 750 }
  ]
};

export const profileData = {
  name: "Vikram Singh",
  phone: "+91 90000 11111",
  vehicleType: "Two Wheeler (Bike)",
  isOnline: true
};
