import { Controller, UseFilters, UseGuards, Post, Get, Req, Body, Param, UnauthorizedException} from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiCookieAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
import { ExecptionFilter } from "src/common/filters/common.exception";
import { JwtAuthGuard } from "src/common/guards/common.auth.guard";
import { RolesGuards } from "src/common/guards/common.role.guard";
import { Roles } from "src/common/guards/roles.decorators";
import { OrderService } from "./order.service";
import { CreateNewOrderSwaggerTypeData, OrderSwaggerTypeData } from "src/common/types/order-types/order.types.swagger";
import { ReturnOrderTypeData } from "src/common/types/order-types/order.types";
import { type Request } from "express";
import {ValidationTypePipe} from '../common/pipes/common.pipe'
import { CreateNewOrderDto } from "src/common/types/order-types/order.dto.types";
import { Order } from "src/generated/prisma/client";
import { Throttle } from "@nestjs/throttler";



@ApiTags('order')
@Roles(['USER', 'ADMIN'])
@UseFilters(ExecptionFilter)
@UseGuards(JwtAuthGuard, RolesGuards)
@Controller('order')
@Throttle({order: {ttl: 10_000, limit: 1}})
export class OrderController {

    constructor(
        private readonly orderService: OrderService
    ) {}

    @ApiBearerAuth('mini-store-auth')
    @ApiCookieAuth()
    @ApiOperation({summary: 'create order', description: "create order with {product: Product(or productId), quantity: number}"})
    @ApiBody({type: CreateNewOrderSwaggerTypeData})
    @ApiResponse({status: 201, description: 'order was successfully created', type: OrderSwaggerTypeData})
    @Post()
    async createOrder(@Req() {user} : Request, @Body(new ValidationTypePipe()) dto: CreateNewOrderDto): Promise<ReturnOrderTypeData> {
        if (!user) throw new UnauthorizedException('you are not authorizated')
        return this.orderService.createNewOrder({user: user.id, items: dto.items})
    }

    @ApiBearerAuth('mini-store-auth')
    @ApiCookieAuth()
    @ApiOperation({summary: 'list of the orders', description: 'list of the orders of the current user'})
    @ApiResponse({type: OrderSwaggerTypeData, isArray: true, status: 200, description: 'list of the order of the current user'})
    @Get()
    async getOrders(@Req() {user}: Request): Promise<Order[]> {
        if (!user) throw new UnauthorizedException('you are not authorizated')
            console.log(user);
            
        return this.orderService.getOrdersUser(user?.id)
    }

    @ApiBearerAuth('mini-store-auth')
    @ApiCookieAuth()
    @ApiOperation({summary: 'get Order', description: 'get a certian Order based on the conveyed Id'})
    @ApiParam({name: 'id', type: String, description: 'Order Id'})
    @Get(':id')
    async getOrder(@Param('id') id: string, @Req() {user}: Request): Promise<ReturnOrderTypeData> {
        if (!user) throw new UnauthorizedException('you are not authorizated')
        return this.orderService.getOrder(Number(id), user.id)
    }
}
