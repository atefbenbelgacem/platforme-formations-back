import { Controller, Post, UsePipes, ValidationPipe, Body, Get, UseGuards, Param, Put, Request, Headers, Delete } from '@nestjs/common';
import { PizzaUService } from './pizza-u.service';
import { CreatePizzaUDto } from '../DTOs/createPizzaU.dto';
import { JwtAuthGuard } from 'src/components/auth/jwt-auth.guard';
import { AdminGuard } from 'src/shared/gards/admin.gard';
import { PizzaUEvent } from 'src/models/pizza-u.schema';

@UseGuards(JwtAuthGuard)
@Controller('pizza-u')
export class PizzaUController {

    constructor(private readonly pizzaService: PizzaUService) { }

    @UseGuards(AdminGuard)
    @Post()
    @UsePipes(new ValidationPipe())
    async addPizzaU(@Body() createPizzaDto: CreatePizzaUDto) {
        const newPizza = await this.pizzaService.create(createPizzaDto)
        return newPizza
    }

    @UseGuards(AdminGuard)
    @Get()
    async FindAll() {
        const pizzas = await this.pizzaService.findAll()
        return pizzas
    }

    @Get(':id')
    async findById(@Param('id') pizzaId: string) {
        return await this.pizzaService.findPizzaUById(pizzaId)
    }

    @UseGuards(AdminGuard)
    @Put(':id')
    async updatePizza(@Param('id') pizzaId: string, @Body() updateData: PizzaUEvent) {
        const result = await this.pizzaService.updatePizza(pizzaId, updateData)
        return result
    }

    @Get('subscribe/:id')
    async subscribe(@Param('id') pizzaId: string, @Request() req) {
        const userId = req.user.user._id
        const result = await this.pizzaService.subscribe(pizzaId, userId)
        return result
    }

    @Get('unSubscribe/:id')
    async unSubscribe(@Param('id') pizzaId: string, @Request() req) {
        const userId = req.user.user._id
        const result = await this.pizzaService.unSubscribe(pizzaId, userId)
        return result
    }

    @UseGuards(AdminGuard)
    @Put('adminSubscribe/:id')
    async adminSubscribe(@Param('id') pizzaId: string, @Body() user: any) {
        //const userId = req.user.user._id
        const result = await this.pizzaService.subscribe(pizzaId, user.userId)
        return result
    }

    @UseGuards(AdminGuard)
    @Put('adminUnSubscribe/:id')
    async adminUnSubscribe(@Param('id') pizzaId: string, @Body() user: any) {
        //const userId = req.user.user._id
        const result = await this.pizzaService.unSubscribe(pizzaId, user.userId)
        return result
    }

    @UseGuards(AdminGuard)
    @Delete(':id')
    async deletePizza(@Param('id') pizzaId: string) {
        const result = await this.pizzaService.deletePizza(pizzaId)
        return result
    }
}
