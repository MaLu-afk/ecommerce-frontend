//src/components/list-reco/productList.ts
export interface Product {
  id: number;
  name: string;
  model: string;
  processor: string;
  storage: string;
  price: number;
  rating: number;
  reviewCount: number;
  image: string;
  discount?: number;
}

export const products: Product[] =[
  {
    "id": 1,
    "name": "EX DISPLAY : MSI Pro 16",
    "model": "Flex-036AU",
    "processor": "INTEL CORE I5-1135G7",
    "storage": "8GB 512G SSD",
    "price": 499.00,
    "rating": 4.5,
    "reviewCount": 234,
    "image": "https://picsum.photos/seed/laptop1/400/300"
  },
  {
    "id": 2,
    "name": "HP Pavilion 15",
    "model": "PAV-15T",
    "processor": "INTEL CORE I7-1255U",
    "storage": "16GB 1TB SSD",
    "price": 899.00,
    "rating": 4.7,
    "reviewCount": 512,
    "image": "https://picsum.photos/seed/laptop2/400/300"
  },
  {
    "id": 3,
    "name": "Dell Inspiron 14",
    "model": "INS-14X",
    "processor": "AMD RYZEN 5 5500U",
    "storage": "8GB 512GB SSD",
    "price": 649.00,
    "rating": 4.3,
    "reviewCount": 321,
    "image": "https://picsum.photos/seed/laptop3/400/300"
  },
  {
    "id": 4,
    "name": "Lenovo IdeaPad Slim 5",
    "model": "IP-SLIM5",
    "processor": "INTEL CORE I5-1240P",
    "storage": "16GB 512GB SSD",
    "price": 749.00,
    "rating": 4.6,
    "reviewCount": 412,
    "image": "https://picsum.photos/seed/laptop4/400/300"
  },
  {
    "id": 5,
    "name": "Asus ZenBook 14",
    "model": "ZEN-14",
    "processor": "INTEL CORE I7-1165G7",
    "storage": "16GB 1TB SSD",
    "price": 999.00,
    "rating": 4.8,
    "reviewCount": 654,
    "image": "https://picsum.photos/seed/laptop5/400/300"
  },
  {
    "id": 6,
    "name": "Acer Swift 3",
    "model": "SF314",
    "processor": "AMD RYZEN 7 5700U",
    "storage": "16GB 512GB SSD",
    "price": 829.00,
    "rating": 4.4,
    "reviewCount": 287,
    "image": "https://picsum.photos/seed/laptop6/400/300"
  },
  {
    "id": 7,
    "name": "Apple MacBook Air M1",
    "model": "MBA-2020",
    "processor": "APPLE M1",
    "storage": "8GB 256GB SSD",
    "price": 1099.00,
    "rating": 4.9,
    "reviewCount": 1243,
    "image": "https://picsum.photos/seed/laptop7/400/300"
  },
  {
    "id": 8,
    "name": "Apple MacBook Pro 14",
    "model": "MBP-2021",
    "processor": "APPLE M1 PRO",
    "storage": "16GB 512GB SSD",
    "price": 1999.00,
    "rating": 5.0,
    "reviewCount": 942,
    "image": "https://picsum.photos/seed/laptop8/400/300"
  },
  {
    "id": 9,
    "name": "Samsung Galaxy Book Pro",
    "model": "GB-360",
    "processor": "INTEL CORE I7-1165G7",
    "storage": "16GB 512GB SSD",
    "price": 1149.00,
    "rating": 4.6,
    "reviewCount": 502,
    "image": "https://picsum.photos/seed/laptop9/400/300"
  },
  {
    "id": 10,
    "name": "Microsoft Surface Laptop 4",
    "model": "SL-4",
    "processor": "AMD RYZEN 7 4980U",
    "storage": "16GB 512GB SSD",
    "price": 1299.00,
    "rating": 4.7,
    "reviewCount": 678,
    "image": "https://picsum.photos/seed/laptop10/400/300"
  }
  // ... sigue hasta el id 50
];