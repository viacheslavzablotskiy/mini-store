import { Controller, UseFilters, UseGuards, Post, Get, Req, Body, Param} from "@nestjs/common";
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
import { ExecptionFilter } from "src/common/filters/common.exception";
import { JwtAuthGuard } from "src/common/guards/common.auth.guard";
import { RolesGuards } from "src/common/guards/common.role.guard";
import { Roles } from "src/common/guards/roles.decorators";
import { OrderService } from "./order.service";
import { CreateNewOrderSwaggerTypeData, OrderSwaggerTypeData } from "src/common/types/order-types/order.types.swagger";
import { type Request } from "express";
import {ValidationTypePipe} from '../common/pipes/common.pipe'
import { CreateNewOrderDto } from "src/common/types/order-types/order.dto.types";
import { Order } from "src/generated/prisma/client";



@ApiTags('order')
@Roles(['USER'])
@UseGuards(JwtAuthGuard, RolesGuards)
@UseFilters(ExecptionFilter)
@Controller('order')
export class OrderController {

    constructor(
        private readonly orderService: OrderService
    ) {}

    @ApiOperation({summary: 'create order', description: "create order with {product: Product(or productId), quantity: number}"})
    @ApiBody({type: CreateNewOrderSwaggerTypeData})
    @ApiResponse({status: 201, description: 'order was successfully created', type: OrderSwaggerTypeData})
    @Post()
    async createOrder(@Req() {user} : Request, @Body(new ValidationTypePipe()) dto: CreateNewOrderDto): Promise<any> {
    }


    @ApiOperation({summary: 'list of the orders', description: 'list of the orders of the current user'})
    @ApiResponse({type: OrderSwaggerTypeData, isArray: true, status: 200, description: 'list of the order of the current user'})
    @Get()
    async getOrders(@Req() {user}: Request): Promise<any> {}


    @ApiOperation({summary: 'get Order', description: 'get a certian Order based on the conveyed Id'})
    @ApiParam({name: 'id', type: String, description: 'Order Id'})
    @Get()
    async getOrder(@Param('id') id: string): Promise<any> {}
}
