import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { EventService } from './event.service';
import { JwtAuthGuard } from 'src/components/auth/jwt-auth.guard';
import { AdminGuard } from 'src/shared/gards/admin.gard';

@UseGuards(JwtAuthGuard, AdminGuard)
@Controller('event')
export class EventController {

    constructor(private readonly eventsService: EventService) { }

    @Get()
    async FindAll() {
        const events = await this.eventsService.findAll()
        return events
    }

    @Get(':id')
    async findById(@Param('id') EventId: string) {
        return await this.eventsService.findEventById(EventId)
    }
}
