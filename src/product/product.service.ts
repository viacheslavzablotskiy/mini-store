import { HttpException, Injectable, NotFoundException } from "@nestjs/common";
import { NewProductTypeData, UpdateProductTypeData } from "src/common/types/product-types/product.type";
import { Prisma, Product } from "src/generated/prisma/client";
import { PrismaService } from "src/prisma/prisma.service";



@Injectable()
export class ProductService {
    
    constructor(
        private readonly prisma: PrismaService
    ) {}

    async getProducts(): Promise<Product[]> {
        return this.prisma.product.findMany({
            where: {isDeleted: false}, take: 20, orderBy: {id: 'asc'}
        })
    }

    async getProductsAfter(lastId: number): Promise<Product[]> {
        return this.prisma.product.findMany({
            where: {id: {gt: lastId}, isDeleted: false}, take: 20, orderBy: {id: 'asc'}
        })
    }

    async getProductById(productId: number): Promise<Product> {
        const product = await this.prisma.product.findFirst({
            where: {id: productId, isDeleted: false}
        })
        if (!product) throw new NotFoundException(`Product with id ${productId} not found`)
        return product
    }

    async createNewProduct(data: NewProductTypeData): Promise<Product> {
        return this.prisma.product.create({data})
    }


    async updateProduct(productId: number, data: UpdateProductTypeData): Promise<Product> {
            const updatedProduct = await this.prisma.product.updateMany({
            where: {id: productId, isDeleted: false}, data: data
        })  
            if (updatedProduct.count === 0) {
                throw new NotFoundException(`Product with id ${productId} not found`)
            }
            return this.getProductById(productId)
        
        }
    

    async deleteProduct(productId: number): Promise<void> {
        const deleteProduct = await this.prisma.product.updateMany({where: {id: productId}, data: {isDeleted: true}})
        if (deleteProduct.count === 0) throw new NotFoundException(`Product with id ${productId} not found`)
    }
}