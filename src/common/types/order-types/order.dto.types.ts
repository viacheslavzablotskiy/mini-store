import { Type } from 'class-transformer'
import { IsArray, IsInt, Min, ValidateNested } from 'class-validator'


export class OrderItemDto {
    @IsInt()
    productId: number


    @IsInt()
    @Min(1)
    quantity: number 
}

export class CreateNewOrderDto {
    @IsArray()
    @ValidateNested({each: true})
    @Type(() => OrderItemDto)
    items: OrderItemDto[]
}