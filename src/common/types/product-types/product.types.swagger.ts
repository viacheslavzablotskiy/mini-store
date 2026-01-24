import { Category, Product } from "src/generated/prisma/client";
import { NewProductTypeData, UpdateProductTypeData } from "./product.type";
import { ApiProperty } from "@nestjs/swagger";

export class ProductSwaggerTypeData implements Product{
    name: string;
    id: number;
    description: string | null;
    price: number;
    stock: number;
    category: Category;
    isDeleted: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export class NewProductSwaggerTypeData implements NewProductTypeData{
    name: string;
    description: string | null;
    stock: number;
    price: number;
    @ApiProperty({enum: Category, default: Category.CLOTHES})
    category: Category
}

export class UpdateProductSwaggerTypeData implements UpdateProductTypeData {
    name?: string | undefined;
    stock?: number | undefined;
    @ApiProperty({type: String, required: false, nullable: true})
    description?: string | null 
    price?: number | undefined;
    @ApiProperty({enum: Category, default: Category.CLOTHES})
    category: Category
}