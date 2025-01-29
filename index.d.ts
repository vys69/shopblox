export interface Store {
  id: string;
  userId: string;
  groupId: string;
  name: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
}
