import { Test, TestingModule } from '@nestjs/testing'
import { User } from '@prisma/client'
import { UsersService } from '../users/users.service'
import { ContactsDao } from './contacts.dao'
import { ContactsService } from './contacts.service'

describe('ContactsService', () => {
	let service: ContactsService

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				ContactsService,
				{ provide: ContactsDao, useValue: daoMock },
				{ provide: UsersService, useValue: usersServiceMock },
			],
		}).compile()

		service = module.get<ContactsService>(ContactsService)
	})

	afterEach(jest.clearAllMocks)
	afterAll(jest.resetAllMocks)

	describe('contactsGetByUser', () => {
		it('should call dao and users service', async () => {
			usersServiceMock.findManyUsers.mockImplementationOnce(() => [
				{ uuid: 'uuid' } as User,
			])

			await service.contactsGetByUser('userUuid')

			expect(usersServiceMock.getUserByUuid).toBeCalledTimes(1)
			expect(usersServiceMock.getUserByUuid).toBeCalledWith('userUuid', {
				savedContacts: true,
			})
		})
	})
	describe('contactAdd', () => {
		it('should call users service', async () => {
			usersServiceMock.getUserByEmail.mockImplementationOnce(() => ({
				uuid: 'newContactUuid',
			}))
			usersServiceMock.getUserByUuid.mockImplementationOnce(() => ({
				uuid: 'uuid',
			}))

			await service.contactAdd('uuid', 'test@mail.com')

			expect(usersServiceMock.getUserByEmail).toBeCalledTimes(1)
			expect(usersServiceMock.getUserByEmail).toBeCalledWith('test@mail.com')
			expect(usersServiceMock.getUserByUuid).toBeCalledTimes(1)
			expect(usersServiceMock.getUserByUuid).toBeCalledWith('uuid')
			expect(usersServiceMock.updateUser).toBeCalledTimes(1)
			expect(usersServiceMock.updateUser).toBeCalledWith({
				where: { uuid: 'uuid' },
				data: {
					uuid: 'uuid',
					savedContacts: {
						create: {
							uuid: 'newContactUuid',
						},
					},
					groups: undefined,
				},
				include: { savedContacts: true },
			})
		})
	})

	describe('contactDelete', () => {
		it('should call dao', async () => {
			await service.contactDelete('contactUuid', 'uuid')

			expect(daoMock.removeContact).toBeCalledTimes(1)
			expect(daoMock.removeContact).toBeCalledWith('contactUuid', 'uuid')
		})
	})

	const daoMock = {
		removeContact: jest.fn(),
	}
	const usersServiceMock = {
		getUserByUuid: jest.fn(),
		findManyUsers: jest.fn(),
		getUserByEmail: jest.fn(),
		updateUser: jest.fn(),
	}
})
