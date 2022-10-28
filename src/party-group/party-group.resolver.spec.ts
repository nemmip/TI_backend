import { Test, TestingModule } from '@nestjs/testing';
import { PartyGroupResolver } from './party-group.resolver';

describe('PartyGroupResolver', () => {
  let resolver: PartyGroupResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PartyGroupResolver],
    }).compile();

    resolver = module.get<PartyGroupResolver>(PartyGroupResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
