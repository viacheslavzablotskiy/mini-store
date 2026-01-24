import { Test, TestingModule } from "@nestjs/testing"
import { OrderService } from "./order.service"
import { PrismaService } from "../prisma/prisma.service"
import { BadRequestException, NotFoundException } from "@nestjs/common"


describe('OrderService', () => {
    let orderService: OrderService
    let prisma: jest.Mocked<PrismaService>

    beforeEach(async () => {
        const app: TestingModule = await Test.createTestingModule({
            providers: [
                OrderService,
                {provide: PrismaService, useValue:
                    {   $transaction: jest.fn(),
                        order: {findMany: jest.fn(), findFirst: jest.fn(), create: jest.fn(), update: jest.fn()},
                        product: {findMany: jest.fn(), update: jest.fn()},
                        orderItem: {create: jest.fn()}
                    }
            }
            ]
        }).compile()

        orderService = app.get<OrderService>(OrderService)
        prisma = app.get(PrismaService)
    })

    afterEach(() => {
        jest.clearAllMocks()
    })


    it('should create new order successfully', async () => {
        jest.spyOn(prisma, '$transaction').mockImplementation(async (cb) => {return cb(prisma)})
        jest.spyOn(prisma.order, 'create').mockResolvedValue({id: 1, userId: 1, status: 'PENDING', totalAmount: 0, createdAt: new Date('2024-01-01T00:00:00.000Z'), updatedAt: new Date('2024-01-01T00:00:00.000Z')})
        jest.spyOn(prisma.product, 'findMany').mockResolvedValue([{id: 1, category: 'CLOTHES', name: 't-short', price: 10, stock: 10, description: '', isDeleted: false, createdAt: new Date('2024-01-01T00:00:00.000Z'), updatedAt: new Date('2024-01-01T00:00:00.000Z')}])
        jest.spyOn(prisma.product, 'update').mockResolvedValue({id: 1, category: 'CLOTHES', name: 't-short', price: 10, stock: 8, description: '', isDeleted: false, createdAt: new Date('2024-01-01T00:00:00.000Z'), updatedAt: new Date('2024-01-01T00:00:00.000Z')})
        jest.spyOn(prisma.orderItem, 'create').mockResolvedValue({id: 1, price: 10, quantity: 2, productId: 1, orderId: 1, createdAt: new Date('2024-01-01T00:00:00.000Z'), updatedAt: new Date('2024-01-01T00:00:00.000Z')})
        jest.spyOn(prisma.order, 'update').mockResolvedValue({id: 1, userId: 1, status: 'PENDING', totalAmount: 20, createdAt: new Date('2024-01-01T00:00:00.000Z'), updatedAt: new Date('2024-01-01T00:00:00.000Z')})

        const result = await orderService.createNewOrder({user: 1, items: [{productId: 1, quantity: 2}]})
        expect(result.totalAmount).toBe(20)
        expect(prisma.product.update).toHaveBeenCalledWith(expect.objectContaining({where: {id: 1}, data: {stock: {decrement: 2}}}))
        expect(prisma.order.update).toHaveBeenCalledWith(expect.objectContaining({where: {id: 1}, data: {totalAmount: 20}}))
        expect(prisma.orderItem.create).toHaveBeenCalled()
    })

    it('should throw BadRequestException if quantity <= 0', async () => {
        jest.spyOn(prisma, '$transaction').mockImplementation(async (cb) => {return cb(prisma)})
        jest.spyOn(prisma.order, 'create').mockResolvedValue({id: 1, userId: 1, status: 'PENDING', totalAmount: 0, createdAt: new Date('2024-01-01T00:00:00.000Z'), updatedAt: new Date('2024-01-01T00:00:00.000Z')})
        jest.spyOn(prisma.product, 'findMany').mockResolvedValue([{id: 1, category: 'CLOTHES', name: 't-short', price: 10, stock: 10, description: '', isDeleted: false, createdAt: new Date('2024-01-01T00:00:00.000Z'), updatedAt: new Date('2024-01-01T00:00:00.000Z')}])

        await expect(orderService.createNewOrder({user: 1, items: [{productId: 1, quantity: 0}]})).rejects.toThrow(BadRequestException)
        expect(prisma.product.update).not.toHaveBeenCalled();
        expect(prisma.orderItem.create).not.toHaveBeenCalled();
    })

    it('should thorw error if product is not founded', async () => {
        jest.spyOn(prisma, '$transaction').mockImplementation(async (cb) => {return cb(prisma)})
        jest.spyOn(prisma.order, 'create').mockResolvedValue({id: 1, userId: 1, status: 'PENDING', totalAmount: 0, createdAt: new Date('2024-01-01T00:00:00.000Z'), updatedAt: new Date('2024-01-01T00:00:00.000Z')})
        jest.spyOn(prisma.product, 'findMany').mockResolvedValue([])

        await expect(orderService.createNewOrder({user: 1, items: [{productId: 100, quantity: 4}]})).rejects.toThrow(NotFoundException)
    })

    it('should throw error if product in the stock is not enough', async () => {
        jest.spyOn(prisma, '$transaction').mockImplementation(async (cb) => {return cb(prisma)})
        jest.spyOn(prisma.order, 'create').mockResolvedValue({id: 1, userId: 1, status: 'PENDING', totalAmount: 0, createdAt: new Date('2024-01-01T00:00:00.000Z'), updatedAt: new Date('2024-01-01T00:00:00.000Z')})
        jest.spyOn(prisma.product, 'findMany').mockResolvedValue([{id: 1, category: 'CLOTHES', name: 't-short', price: 10, stock: 10, description: '', isDeleted: false, createdAt: new Date('2024-01-01T00:00:00.000Z'), updatedAt: new Date('2024-01-01T00:00:00.000Z')}])

        await expect(orderService.createNewOrder({user: 1, items: [{productId: 1, quantity: 100}]})).rejects.toThrow(BadRequestException)
    })

    it('getOrders should return orders', async () => {
        jest.spyOn(prisma.order, "findMany").mockResolvedValue([
            {id: 1, userId: 1, status: 'PENDING', totalAmount: 20, createdAt: new Date('2024-01-01T00:00:00.000Z'), updatedAt: new Date('2024-01-01T00:00:00.000Z')},
            {id: 2, userId: 1, status: 'PENDING', totalAmount: 20, createdAt: new Date('2024-01-01T00:00:00.000Z'), updatedAt: new Date('2024-01-01T00:00:00.000Z')}
        ])
        const result = await orderService.getOrdersUser(1)
        expect(result).toEqual([
            {id: 1, userId: 1, status: 'PENDING', totalAmount: 20, createdAt: new Date('2024-01-01T00:00:00.000Z'), updatedAt: new Date('2024-01-01T00:00:00.000Z')},
            {id: 2, userId: 1, status: 'PENDING', totalAmount: 20, createdAt: new Date('2024-01-01T00:00:00.000Z'), updatedAt: new Date('2024-01-01T00:00:00.000Z')}
        ])
    })

    it('orderDetails should throw error if he was not found', async () => {
        jest.spyOn(prisma.order, 'findFirst').mockResolvedValue(null)

        await expect(orderService.getOrder(10, 9)).rejects.toThrow(new NotFoundException('there is not order with that id'))
    })  
})