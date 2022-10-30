import { Test, TestingModule } from '@nestjs/testing'
import { PartyGroupService } from './party-group.service'

describe('PartyGroupService', () => {
	let service: PartyGroupService

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [PartyGroupService],
		}).compile()

		service = module.get<PartyGroupService>(PartyGroupService)
	})

	it('should be defined', () => {
		expect(service).toBeDefined()
	})
})
