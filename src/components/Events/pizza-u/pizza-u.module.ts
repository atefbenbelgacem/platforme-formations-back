import { Module } from '@nestjs/common';
import { PizzaUService } from './pizza-u.service';
import { PizzaUController } from './pizza-u.controller';
import { EventModule } from '../event/event.module';
import { pizzaUProviders } from './pizza-u.provider';
import { NodeMailerService } from 'src/shared/services/node-mailer.service';
import { UsersModule } from 'src/components/users/users.module';

@Module({
  imports: [EventModule, UsersModule],
  providers: [PizzaUService, ...pizzaUProviders, NodeMailerService],
  controllers: [PizzaUController],
  exports: [PizzaUService, ...pizzaUProviders]
})
export class PizzaUModule {}
