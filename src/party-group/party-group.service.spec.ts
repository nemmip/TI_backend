import { Test, TestingModule } from '@nestjs/testing'
import { PartyGroup, User } from '@prisma/client'
import { BillsService } from '../bills/bills.service'
import { PartyGroupCreateInput } from './models/party-group.input'
import { PartyGroupDao } from './party-group.dao'
import { PartyGroupService } from './party-group.service'

describe('PartyGroupService', () => {
	let service: PartyGroupService

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				PartyGroupService,
				{ provide: PartyGroupDao, useValue: daoMock },
				{ provide: BillsService, useValue: billsServiceMock },
			],
		}).compile()

		service = module.get<PartyGroupService>(PartyGroupService)
	})

	afterEach(jest.clearAllMocks)
	afterAll(jest.resetAllMocks)

	describe('partyGroupCreate', () => {
		jest.useFakeTimers().setSystemTime(new Date('2005-05-02'))
		it('should call dao', async () => {
			const input = {} as PartyGroupCreateInput
			await service.partyGroupCreate(input)
			const code = new Date('2005-05-02').valueOf().toString()

			expect(daoMock.createPartyGroup).toBeCalledTimes(1)
			expect(daoMock.createPartyGroup).toBeCalledWith({
				...input,
				code: code.slice(code.length - 8),
			})
		})
	})
	describe('partyGroupGetForUser', () => {
		it('should call dao', async () => {
			await service.partyGroupGetForUser('uuid')
			expect(daoMock.getAllForUser).toBeCalledTimes(1)
			expect(daoMock.getAllForUser).toBeCalledWith('uuid')
		})
	})
	describe('partyGroupDelete', () => {
		it('should call dao', async () => {
			await service.partyGroupDelete('uuid', 'userUuid')
			expect(daoMock.deletePartyGroup).toBeCalledTimes(1)
			expect(daoMock.deletePartyGroup).toBeCalledWith('uuid', 'userUuid')
		})
	})
	describe('findGroupByCode', () => {
		it('should call dao', async () => {
			daoMock.findGroupByCode.mockImplementationOnce(
				() => ({ uuid: 'uuid' } as PartyGroup)
			)

			await service.findGroupByCode('code')
			expect(daoMock.findGroupByCode).toBeCalledTimes(1)
			expect(daoMock.findGroupByCode).toBeCalledWith('code')
		})
		describe('errors', () => {
			it('should throw when group not found', async () => {
				await expect(service.findGroupByCode('code')).rejects.toThrowError(
					'Group with code code not found.'
				)
			})
		})
	})
	describe('partyGroupMembers', () => {
		it('should call dao', async () => {
			daoMock.findGroupByCode.mockImplementationOnce(
				() => ({ uuid: 'uuid' } as PartyGroup)
			)

			await service.partyGroupMembers('code')

			expect(daoMock.findGroupByCode).toBeCalledTimes(1)
			expect(daoMock.findGroupByCode).toBeCalledWith('code')
			expect(daoMock.getGroupMembers).toBeCalledTimes(1)
			expect(daoMock.getGroupMembers).toBeCalledWith('uuid')
		})
		describe('errors', () => {
			it('should throw when group not found', async () => {
				await expect(service.partyGroupMembers('code')).rejects.toThrowError(
					'Group with code code not found.'
				)
			})
		})
	})
	describe('partyGroupAddUser', () => {
		it('should call dao', async () => {
			daoMock.findGroupByCode.mockImplementationOnce(
				() => ({ uuid: 'uuid' } as PartyGroup)
			)

			await service.partyGroupAddUser('code', 'userUuid')

			expect(daoMock.findGroupByCode).toBeCalledTimes(1)
			expect(daoMock.findGroupByCode).toBeCalledWith('code')
			expect(daoMock.addMemberToGroup).toBeCalledTimes(1)
			expect(daoMock.addMemberToGroup).toBeCalledWith('uuid', 'userUuid')
		})
		describe('errors', () => {
			it('should throw when group not found', async () => {
				await expect(
					service.partyGroupAddUser('code', 'userUuid')
				).rejects.toThrowError('Group with code code not found.')
			})
		})
	})
	describe('partyGroupSummary', () => {
		it('should call dao and compute summary', async () => {
			daoMock.findGroupByCode.mockImplementation(
				() => ({ uuid: 'uuid' } as PartyGroup)
			)
			daoMock.getGroupMembers.mockImplementationOnce(() => [
				{ uuid: 'uuid' } as User,
			])

			const response = await service.partyGroupSummary('code')

			expect(daoMock.findGroupByCode).toBeCalledTimes(2)
			expect(daoMock.findGroupByCode).toBeCalledWith('code')
			expect(daoMock.getGroupMembers).toBeCalledTimes(1)
			expect(daoMock.getGroupMembers).toBeCalledWith('uuid')
			expect(billsServiceMock.billGetForGroupUser).toBeCalledTimes(1)
			expect(billsServiceMock.billGetForGroupUser).toBeCalledWith(
				'code',
				'uuid'
			)
			expect(response).toMatchObject({
				group: { uuid: 'uuid' },
				billsSummary: [
					{
						member: { uuid: 'uuid' },
						sumOfBills: 0,
					},
				],
			})
		})
		describe('errors', () => {
			it('should throw when group not found', async () => {
				daoMock.findGroupByCode.mockImplementationOnce(() => null)
				await expect(service.partyGroupSummary('code')).rejects.toThrowError(
					'Group with code code not found.'
				)
			})
		})
	})
	describe('splitPartyGroup', () => {
		it('should call dao and compute summary', async () => {
			daoMock.findGroupByCode.mockImplementation(
				() => ({ uuid: 'uuid' } as PartyGroup)
			)
			daoMock.getGroupMembers.mockImplementationOnce(() => [
				{ uuid: 'uuid', name: 'name' } as User,
			])

			const response = await service.splitPartyGroup('code')

			expect(daoMock.findGroupByCode).toBeCalledTimes(2)
			expect(daoMock.findGroupByCode).toBeCalledWith('code')
			expect(daoMock.getGroupMembers).toBeCalledTimes(1)
			expect(daoMock.getGroupMembers).toBeCalledWith('uuid')
			expect(billsServiceMock.billGetForGroupUser).toBeCalledTimes(1)
			expect(billsServiceMock.billGetForGroupUser).toBeCalledWith(
				'code',
				'uuid'
			)
			expect(response).toMatchObject([
				{
					name: 'name',
					pay: 0,
				},
			])
		})
		describe('errors', () => {
			it('should throw when group not found', async () => {
				daoMock.findGroupByCode.mockImplementationOnce(() => null)

				await expect(service.splitPartyGroup('code')).rejects.toThrowError(
					'Group with code code not found.'
				)
			})
		})
	})

	const daoMock = {
		createPartyGroup: jest.fn(),
		getAllForUser: jest.fn(),
		deletePartyGroup: jest.fn(),
		findGroupByCode: jest.fn(),
		getGroupMembers: jest.fn(),
		addMemberToGroup: jest.fn(),
	}

	const billsServiceMock = {
		billGetForGroupUser: jest.fn(),
	}
})
