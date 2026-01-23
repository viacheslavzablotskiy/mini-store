import { NewProductTypeData } from "./product.type";
import {IsString, IsInt, IsOptional, Min} from 'class-validator'



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
}
