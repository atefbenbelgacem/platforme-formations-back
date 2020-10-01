import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { PolesModule } from './components/poles/poles.module';
import { AuthModule } from './components/auth/auth.module';
import { TrainingModule } from './components/training/training.module';
import { EventModule } from './components/events/event/event.module';
import { PizzaUModule } from './components/events/pizza-u/pizza-u.module';
import { VeilleTechnoModule } from './components/Events/veille-event/veille-event.module';
import { QuestionsModule } from './components/questions/questions.module';
import { QuizzResultModule } from './components/quizz-result/quizz-result.module';
import { UsersModule } from './components/users/users.module';

@Module({
  imports: [
    UsersModule,
    MongooseModule.forRoot('mongodb://localhost:27017/plateforme-formation',{
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true
    }),
    PolesModule,
    AuthModule,
    TrainingModule,
    EventModule,
    PizzaUModule,
    VeilleTechnoModule,
    QuestionsModule,
    QuizzResultModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }