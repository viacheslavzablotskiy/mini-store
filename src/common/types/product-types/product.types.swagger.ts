import { Product } from "src/generated/prisma/client";
import { NewProductTypeData, UpdateProductTypeData } from "./product.type";

export class ProductSwaggerTypeData implements Omit<Product, 'isDeleted'> {
    name: string;
    id: number;
    description: string | null;
    price: number;
    stock: number;
    createdAt: Date;
    updatedAt: Date;
}

export class NewProductSwaggerTypeData implements NewProductTypeData{
    name: string;
    description: string | null;
    stock: number;
    price: number;
}

export class UpdateProductSwaggerTypeData implements UpdateProductTypeData {
    name?: string | undefined;
    stock?: number | undefined;
    description?: string | null | undefined;
    price?: number | undefined;
}