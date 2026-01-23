import { Controller, Delete, Get, Param, Patch, Post, Query, Req, UseFilters, UseGuards, Body } from "@nestjs/common";
import { ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Request } from "express";
import { ExecptionFilter } from "src/common/filters/common.exception";
import { JwtAuthGuard } from "src/common/guards/common.auth.guard";
import { RolesGuards } from "src/common/guards/common.role.guard";
import { Roles } from "src/common/guards/roles.decorators";
import { ProductSwaggerTypeData, UpdateProductSwaggerTypeData, NewProductSwaggerTypeData } from "src/common/types/product-types/product.types.swagger";
import { ProductService } from "./product.service";
import { Product } from "src/generated/prisma/client";
import {ValidationTypePipe} from '../common/pipes/common.pipe'
import { NewProductDto, UpdateProductDto } from "src/common/types/product-types/product.dto.type";


@ApiTags('product')
@Roles(['USER'])
@UseGuards(JwtAuthGuard, RolesGuards)
@UseFilters(ExecptionFilter)
@Controller('product')
export class ProductController {

    constructor(
        private readonly productService: ProductService
    ) {}

    @ApiOperation({summary: 'get products', description: 'get products according to the lastId'}) 
    @ApiQuery({type: String, name: 'lastId', required: false, description: 'from what porduct i should start'})  
    @ApiResponse({type: ProductSwaggerTypeData, isArray: true, status: 200, description: 'list of the products:'})
    @Get('')
    async getPosts(@Query('lastId') lastId: string): Promise<Product[]> {
        if (lastId) {
            return this.productService.getProductsAfter(Number(lastId))
        }
        return this.productService.getProducts()
    }

    @ApiOperation({summary: 'get product', description: 'get product according the conveyed id'})
    @ApiParam({type: String, name: 'id', description: 'product Id'})
    @ApiResponse({type: ProductSwaggerTypeData, status: 200, description: 'prodict with youe id'})
    @Get(':id')
    async getPost(@Param('id') id: string): Promise<Product> {
        return this.productService.getProductById(Number(id))
    }


    @ApiOperation({summary: 'new Product', description: 'create new Product with your data'})
    @ApiBody({type: NewProductSwaggerTypeData})
    @ApiResponse({type: ProductSwaggerTypeData, status: 201, description: 'product was successfully created'})
    @Roles(['ADMIN'])
    @Post()
    async createPost(@Body(new ValidationTypePipe()) dto: NewProductDto): Promise<Product> {
        return this.productService.createNewProduct(dto)
    }

    @ApiOperation({summary: 'update Porduct', description: 'update some product with provided id'})
    @ApiBody({type: UpdateProductSwaggerTypeData})
    @ApiParam({name: 'id', type: String, description: 'Product Id'})
    @ApiResponse({type: ProductSwaggerTypeData, status: 200, description: 'product was successfully created'})
    @Roles(['ADMIN'])
    @Patch(':id')
    async updatePost(@Param('id') id: string, @Body(new ValidationTypePipe()) dto: UpdateProductDto): Promise<Product> {
        return this.productService.updateProduct(Number(id), dto)
    }

    @ApiOperation({summary: 'delete Product', description: 'delete Product with certian Id'})
    @ApiParam({name: 'id', type: String, description: 'Product Id'})
    @ApiResponse({status: 204, description: 'you product was succesfully deleted'})
    @Roles(['ADMIN'])
    @Delete(':id')
    async deletePost(@Param('id') id: string): Promise<any> {
        return this.productService.deleteProduct(Number(id))
    }
}
