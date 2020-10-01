import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  UsePipes,
  ValidationPipe,
  Headers,
} from '@nestjs/common';
import { User } from 'src/models/user.schema';
import { AdminGuard } from 'src/shared/gards/admin.gard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateUserDto } from './createUser.dto';
import { UsersService } from './users.service';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @UseGuards(AdminGuard)
  @Post()
  @UsePipes(new ValidationPipe())
  async addUser(@Body() data: CreateUserDto) {
    const user = await this.userService.create(data);
    return user;
  }

  @UseGuards(AdminGuard)
  @Get()
  async findAll() {
    const users = await this.userService.findAll();
    return users;
  }

  @Put(':id')
  async update(@Param('id') userId: string, @Body() updateData: User) {
    const updatedUser = await this.userService.updateUser(userId, updateData);
    return updatedUser;
  }

  @UseGuards(AdminGuard)
  @Delete(':id')
  async delete(@Param('id') userId: string) {
    const deletedUser = await this.userService.deleteUser(userId);
    return deletedUser;
  }

  @UseGuards(AdminGuard)
  @Post('emails')
  async findUsersByEmails(@Body() data: any) {
    const users = await this.userService.findUsersByEmails(data);
    return users;
  }

  @Get('email')
  async elasticSerach(@Headers('email') email: string) {
    const users = await this.userService.elasticSearch(email);
    return users;
  }
}
