import { Test, TestingModule } from '@nestjs/testing'
import { PartyGroupService } from '../party-group/party-group.service'
import { BillsDao } from './bills.dao'
import { BillsService } from './bills.service'
import { BillCreateInput } from './models/bills.input'

describe('BillsService', () => {
	let service: BillsService

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				BillsService,
				{ provide: PartyGroupService, useValue: groupServiceMock },
				{ provide: BillsDao, useValue: daoMock },
			],
		}).compile()

		service = module.get<BillsService>(BillsService)
	})

	afterEach(jest.clearAllMocks)
	afterAll(jest.resetAllMocks)

	describe('billCreate', () => {
		const input = {
			groupCode: 'code',
		} as BillCreateInput
		it('should call service and dao', async () => {
			groupServiceMock.findGroupByCode.mockImplementationOnce(() => ({
				uuid: 'groupUuid',
			}))

			await service.billCreate(input)

			expect(groupServiceMock.findGroupByCode).toBeCalledTimes(1)
			expect(groupServiceMock.findGroupByCode).toBeCalledWith('code')
			expect(daoMock.create).toBeCalledTimes(1)
			expect(daoMock.create).toBeCalledWith({
				name: input.name,
				price: input.price,
				Payer: { connect: { uuid: input.payedBy } },
				Group: { connect: { uuid: 'groupUuid' } },
			})
		})
	})

	describe('billGetForGroupUser', () => {
		it('should call service and dao', async () => {
			groupServiceMock.findGroupByCode.mockImplementationOnce(() => ({
				uuid: 'groupUuid',
			}))

			await service.billGetForGroupUser('code', 'userUuid')

			expect(groupServiceMock.findGroupByCode).toBeCalledTimes(1)
			expect(groupServiceMock.findGroupByCode).toBeCalledWith('code')
			expect(daoMock.findByGroupUser).toBeCalledTimes(1)
			expect(daoMock.findByGroupUser).toBeCalledWith('groupUuid', 'userUuid')
		})
	})

	const groupServiceMock = {
		findGroupByCode: jest.fn(),
	}
	const daoMock = {
		create: jest.fn(),
		findByGroupUser: jest.fn(),
	}
})
