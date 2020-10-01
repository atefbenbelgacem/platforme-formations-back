import { InternalServerErrorException } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { PolesService } from '../components/poles/poles.service';
import { UsersService } from '../components/users/users.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  let usersService: UsersService;
  let polesService: PolesService;
  try {
    usersService = await app.get(UsersService);
    polesService = await app.get(PolesService);
  } catch (error) {
    throw new InternalServerErrorException('could not retreive the service');
  }

  const firstPole = {
    name: 'ESS',
  };

  const createdPole = await polesService.create(firstPole);

  const firstAdmin = {
    name: 'admin',
    lastName: 'admin',
    email: 'admin@gmail.com',
    password: 'admin123',
    pole: createdPole.id,
    roleName: 'Admin',
  };

  await app.close();
}
bootstrap();
