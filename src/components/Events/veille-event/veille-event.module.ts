import { Module } from '@nestjs/common';
import { VeilleEventController } from './veille-event.controller';
import { VeilleEventService } from './veille-event.service';
import { VeilleProviders } from './veille-event.provider';
import { EventModule } from '../event/event.module';
import { NodeMailerService } from 'src/shared/services/node-mailer.service';
import { UsersModule } from 'src/components/users/users.module';

@Module({
  imports: [EventModule, UsersModule],
  controllers: [VeilleEventController],
  providers: [VeilleEventService, ...VeilleProviders, NodeMailerService],
  exports: [VeilleEventService, ...VeilleProviders]
})
export class VeilleTechnoModule {}
