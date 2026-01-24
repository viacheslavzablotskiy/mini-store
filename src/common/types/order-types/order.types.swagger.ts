import { Order, OrderItem, Status } from "src/generated/prisma/client"

export class OrderSwaggerTypeData implements Order {
    id: number
    userId: number
    status: Status
    totalAmount: number
    createdAt: Date
    updatedAt: Date

}


export class OrderItemSwaggerTypeData {
    productId: number
    quantity: number
}
export class CreateNewOrderSwaggerTypeData {
    items: OrderItemSwaggerTypeData[]
}


