import { Test, TestingModule } from '@nestjs/testing';
import { PolesController } from './poles.controller';
import { PolesService } from './poles.service';
import { Pole, PoleSchema } from '../../models/pole.schema';
import { MongooseModule, getModelToken } from '@nestjs/mongoose';

describe('Poles Controller', () => {
  let controller: PolesController;
  let service: PolesService

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PolesController],
      providers: [
        PolesService, {
          provide: getModelToken('Poles'),
          useValue: PoleSchema
        }
      ],
    }).compile();

    service = module.get<PolesService>(PolesService)
    controller = module.get<PolesController>(PolesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined()
  })


  it('should return a list of poles', async () => {
    
    let result: Promise<Pole[]>
    jest.spyOn(service, 'findAll').mockReturnValue(result)

    expect(await service.findAll()).toBe(result)

  });
});
