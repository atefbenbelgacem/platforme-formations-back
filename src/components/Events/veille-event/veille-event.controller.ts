import { Controller, UseGuards, Post, UsePipes, Headers, ValidationPipe, Body, Get, Param, Put, Delete } from '@nestjs/common';
import { VeilleEventService } from './veille-event.service';
import { JwtAuthGuard } from 'src/components/auth/jwt-auth.guard';
import { AdminGuard } from 'src/shared/gards/admin.gard';
import { CreateVeilleDto } from '../DTOs/createVeille.dto';
import { VeilleEvent } from 'src/models/veille-event.schema';


@UseGuards(JwtAuthGuard)
@Controller('veille')
export class VeilleEventController {

    constructor(private readonly veilleService: VeilleEventService) { }

    @UseGuards(AdminGuard)
    @Post()
    @UsePipes(new ValidationPipe())
    async addVeille(@Body() createVeilleDto: CreateVeilleDto) {
        const newVeille = await this.veilleService.create(createVeilleDto)
        return newVeille
    }

    @UseGuards(AdminGuard)
    @Get()
    async FindAll() {
        const veilles = await this.veilleService.findAll()
        return veilles
    }

    @Get(':id')
    async findById(@Param('id') veilleId: string) {
        return await this.veilleService.findById(veilleId)
    }

    @Get('pole/:id')
    async findByPoleId(@Param('id') poleId: string) {
        const result = await this.veilleService.findByPoleId(poleId)
        return result
    }

    @UseGuards(AdminGuard)
    @Put(':id')
    async updateVeille(@Param('id') veilleId: string, @Body() updateData: VeilleEvent) {
        const result = await this.veilleService.updateVeille(veilleId, updateData)
        return result
    }

    @UseGuards(AdminGuard)
    @Delete(':id')
    async deleteVeille(@Param('id') veilleId: string) {
        const result = await this.veilleService.deleteVeille(veilleId)
        return result
    }

}
