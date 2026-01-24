import { Test, TestingModule } from "@nestjs/testing"
import { PrismaService } from "../prisma/prisma.service"
import { ProductService } from "./product.service"
import { NotFoundException } from "@nestjs/common"

describe('ProductService', () => {
    let productService: ProductService
    let prisma: jest.Mocked<PrismaService>


    beforeEach(async () => {
        const app: TestingModule = await Test.createTestingModule({
            providers: [
                ProductService,
                {provide: PrismaService, useValue: {product: {create: jest.fn(), findMany: jest.fn(),
                findFirst: jest.fn(), updateMany: jest.fn()}}}
            ]
        }).compile()

        productService = app.get<ProductService>(ProductService)
        prisma = app.get(PrismaService)
    })

    afterEach(() => {
        jest.clearAllMocks()
    })



    it('get Products', async () => {
        jest.spyOn(prisma.product, 'findMany').mockResolvedValue([{id: 1, category: 'CLOTHES', name: 'trousers', price: 10, stock: 10, description: '', isDeleted: false, createdAt: new Date('2024-01-01T00:00:00.000Z'), updatedAt: new Date('2024-01-01T00:00:00.000Z')}])
        const result = await productService.getProducts('CLOTHES')

        expect(result).toEqual([{id: 1, category: 'CLOTHES', name: 'trousers', price: 10, stock: 10, description: '', isDeleted: false, createdAt: new Date('2024-01-01T00:00:00.000Z'), updatedAt: new Date('2024-01-01T00:00:00.000Z')}])
        expect(prisma.product.findMany).toHaveBeenCalledWith(expect.objectContaining({
            where: expect.objectContaining({category: 'CLOTHES', isDeleted: false}), take: 20, orderBy: {id: 'asc'}
        }))
    })

    it('getProductById should throw error if not found', async () => {
        jest.spyOn(prisma.product, 'findFirst').mockResolvedValue(null)
        await expect(productService.getProductById(1)).rejects.toThrow(NotFoundException)
    })

    it('createNew Product hould call prisma.create', async () => {
        jest.spyOn(prisma.product, 'create').mockResolvedValue({id: 1, name: 'trousers', description: 'nothing interesting', price: 10, stock: 10, isDeleted: false, category: 'CLOTHES', createdAt: new Date('2024-01-01T00:00:00.000Z'), updatedAt: new Date('2024-01-01T00:00:00.000Z')})
        const resule = await productService.createNewProduct({name: 'trousers', description: 'nothing interesting', stock: 10, price: 10, category: 'CLOTHES'})

        expect(prisma.product.create).toHaveBeenCalledWith(expect.objectContaining({data: {name: 'trousers', description: 'nothing interesting', stock: 10, price: 10, category: 'CLOTHES'}}))
        expect(resule).toEqual({id: 1, name: 'trousers', description: 'nothing interesting', price: 10, stock: 10, isDeleted: false, category: 'CLOTHES', createdAt: new Date('2024-01-01T00:00:00.000Z'), updatedAt: new Date('2024-01-01T00:00:00.000Z')})
    })

    it('methos updateProduct should throw error if count === 0', async () => {
        jest.spyOn(prisma.product, 'updateMany').mockResolvedValue({count: 0})
        await expect(productService.updateProduct(1, {name: 't-short'})).rejects.toThrow(NotFoundException)
    })

    it('methos updateProduct should return update Product if count > 0', async () => {
        jest.spyOn(prisma.product, 'updateMany').mockResolvedValue({count: 1})
        jest.spyOn(productService, 'getProductById').mockResolvedValue({id: 1, name: 't-short', description: 'nothing interesting', price: 10, stock: 10, isDeleted: false, category: 'CLOTHES', createdAt: new Date('2024-01-01T00:00:00.000Z'), updatedAt: new Date('2024-01-01T00:00:00.000Z')})
        const result = await productService.updateProduct(1, {name: 't-short'})
        expect(result).toEqual({id: 1, name: 't-short', description: 'nothing interesting', price: 10, stock: 10, isDeleted: false, category: 'CLOTHES', createdAt: new Date('2024-01-01T00:00:00.000Z'), updatedAt: new Date('2024-01-01T00:00:00.000Z')})
    })

    it('method deleteProduct should throw error if count === 0', async () => {
        jest.spyOn(prisma.product, 'updateMany').mockResolvedValue({count: 0})
        await expect(productService.deleteProduct(1)).rejects.toThrow(NotFoundException)
    })
})