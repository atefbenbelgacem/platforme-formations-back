import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { CreateUserDto } from 'src/components/users/createUser.dto';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('should (GET) Hello world', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });


  let user: CreateUserDto = {
    name: "test",
    lastName: "test",
    email: "test@test.com",
    password: "test123",
    pole: "abc",
    roleName: "Colab"
  }

  test('should (Post) a user', () => {
    return request(app.getHttpServer())
      .post('api/users')
      .send(user)
      .set('Accept', 'application/json')
      .expect(201)
      .expect('Content-Type', /json/)
  });

  afterAll(async () => {
    await app.close()
  });
});
