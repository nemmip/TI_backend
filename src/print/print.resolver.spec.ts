import { Test, TestingModule } from '@nestjs/testing';
import { PrintResolver } from './print.resolver';

describe('PrintResolver', () => {
  let resolver: PrintResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrintResolver],
    }).compile();

    resolver = module.get<PrintResolver>(PrintResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
