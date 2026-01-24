import { Order, OrderItem, Product } from "src/generated/prisma/client"

export interface OrderItemTypeData {
    productId: number,
    quantity: number
}

export type CreateNewOrderTypeData = {
    user: number,
    items: OrderItemTypeData[]
}

export type ReturnOrderTypeData = Order & {orderItems: OrderItem[]}