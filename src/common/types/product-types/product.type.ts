import { Product } from "src/generated/prisma/client";




export type NewProductTypeData = Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'isDeleted'>
export type UpdateProductTypeData = Partial<Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'isDeleted'>>
