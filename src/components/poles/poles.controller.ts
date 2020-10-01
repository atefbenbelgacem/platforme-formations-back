import { Controller, Post, UsePipes, ValidationPipe, Body, Get, Param, UseGuards, Put, Delete } from '@nestjs/common';
import { PolesService } from './poles.service';
import { CreatePoleDto } from './createPole.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdminGuard } from 'src/shared/gards/admin.gard';
import { Pole } from 'src/models/pole.schema';

@UseGuards(JwtAuthGuard, AdminGuard)
@Controller('poles')
export class PolesController {

    constructor(private readonly polesService: PolesService) { }

    @Post()
    @UsePipes(new ValidationPipe())
    async addPoles(@Body() data: CreatePoleDto) {
        const generatedPole = await this.polesService.create(data)
        return generatedPole
    }

    @Get()
    async getAllPoles() {
        const poles = await this.polesService.findAll()
        return poles
    }

    @Get(':id')
    async getPole(@Param('id') poleId: string) {
        return await this.polesService.findSinglePole(poleId)
    }

    @Put(':id')
    async updatePole(@Param('id') poleId: string, @Body() updateData: Pole) {
        const result = await this.polesService.updatePole(poleId, updateData)
        return result
    }

    @Delete(':id')
    async deletePole(@Param('id') poleId: string) {
        const result = await this.polesService.deletePole(poleId)
        return result
    }
}
