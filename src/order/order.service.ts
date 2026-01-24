import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { CreateNewOrderTypeData } from "src/common/types/order-types/order.types";
import { ReturnOrderTypeData } from "src/common/types/order-types/order.types";
import { Order, Status, OrderItem } from "src/generated/prisma/client";
import { PrismaService } from "src/prisma/prisma.service";



@Injectable()
export class OrderService {
    constructor(
        private readonly prisma: PrismaService
    ) {}


    async createNewOrder(data: CreateNewOrderTypeData): Promise<ReturnOrderTypeData> {
        const transaction = await this.prisma.$transaction(async (prismaInstance) => {
            const order = await prismaInstance.order.create({
                data: {
                    userId: data.user,
                    status: Status.PENDING,
                    totalAmount: 0
                }
            })

            const productIds = data.items.map(item => item.productId)
            const products = await prismaInstance.product.findMany({
                where: {id: {in: productIds}}
            })
            const productMap = new Map(products.map(product => [product.id, product]))


            const arrayOrderItems = await Promise.all(
                data.items.map(async (item) => {
                    if (item.quantity <= 0) throw new BadRequestException('Quantity must be greater than 0')

                    const currentProduct = productMap.get(item.productId)
                    if (!currentProduct) throw new NotFoundException('there is not product with this id')
                    if (item.quantity > currentProduct.stock) throw new BadRequestException(`No enough product in the stock for ${currentProduct.name}:${currentProduct.stock}`)

                    await prismaInstance.product.update({where: {id: currentProduct.id}, data: {stock: {decrement: item.quantity}}})

                    return prismaInstance.orderItem.create({
                        data: {
                            price: currentProduct.price,
                            orderId: order.id,
                            quantity: item.quantity,
                            productId: currentProduct.id
                        }
                    })
                })
            )

            const totalAmount = arrayOrderItems.reduce((acc, orderItem) => {return acc + (orderItem.price * orderItem.quantity)}, 0)
            const updatedOrder = await prismaInstance.order.update(
                {where: {id: order.id}, data: {totalAmount: totalAmount}, include: {orderItems: true}}
            )

            return updatedOrder
        })

        return transaction
    }

    async getOrdersUser(userId: number): Promise<Order[]> {
        return this.prisma.order.findMany({where: {userId: userId}})
    }

    async getOrder(orderId: number, userId: number): Promise<ReturnOrderTypeData> {
        const order = await this.prisma.order.findFirst({where: {id: orderId, userId: userId}, include: {orderItems: true}})
        if (!order) throw new NotFoundException('there is not order with that id')
        return order
    }
}