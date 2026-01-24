import { Category } from "src/generated/prisma/enums";
import { NewProductTypeData } from "./product.type";
import {IsString, IsInt, IsOptional, Min, IsEnum} from 'class-validator'



export class NewProductDto {
    @IsString()
    name: string

    @IsOptional()
    @IsString()
    description: string | null

    @IsInt()
    @Min(0)
    stock: number

    @IsInt()
    @Min(0)
    price: number

    @IsEnum(Category)
    category: Category
}


export class UpdateProductDto {
    @IsString()
    @IsOptional()
    name?: string

    @IsString()
    @IsOptional()
    description?: string | null

    @IsInt()
    @Min(0)
    @IsOptional()
    stock?: number

    @IsInt()
    @Min(0)
    @IsOptional()
    price?: number

    @IsEnum(Category)
    @IsOptional()
    category?: Category
}
