import { Test, TestingModule } from '@nestjs/testing'
import { Prisma, User } from '@prisma/client'
import { USER_TYPE } from '../commons/enums/user.enums'
import { UserCreateInput } from './models/users.inputs'
import { UsersDao } from './users.dao'
import { UsersService } from './users.service'

describe('UsersService', () => {
	let service: UsersService

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [UsersService, { provide: UsersDao, useValue: daoMock }],
		}).compile()

		service = module.get<UsersService>(UsersService)
	})

	afterEach(jest.clearAllMocks)
	afterAll(jest.resetAllMocks)

	describe('createRegularUser', () => {
		const input: UserCreateInput = {
			name: 'name',
			email: 'email@mail.com',
			password: 'password',
		}
		it('should hash password and call dao', async () => {
			await service.createRegularUser(input)
			expect(daoMock.createUser).toBeCalledTimes(1)
			expect(daoMock.createUser).toBeCalledWith({
				...input,
				password: expect.stringMatching(/.*/),
				type: USER_TYPE.REGULAR,
			})
		})
	})

	describe('getUserByUuid', () => {
		const input = 'uuid'
		it('should call dao', async () => {
			daoMock.findUserByUuid.mockImplementationOnce(
				() => ({ uuid: input } as User)
			)

			await service.getUserByUuid(input)

			expect(daoMock.findUserByUuid).toBeCalledTimes(1)
			expect(daoMock.findUserByUuid).toBeCalledWith(input, undefined)
		})

		describe('errors', () => {
			it('should throw when user not found', async () => {
				await expect(service.getUserByUuid(input)).rejects.toThrowError(
					`User with uuid: ${input} not found!`
				)
			})
		})
	})

	describe('getUserByEmail', () => {
		const input = 'mail@mail.com'
		it('should call dao', async () => {
			daoMock.findUserByEmail.mockImplementationOnce(
				() => ({ email: input } as User)
			)

			await service.getUserByEmail(input)

			expect(daoMock.findUserByEmail).toBeCalledTimes(1)
			expect(daoMock.findUserByEmail).toBeCalledWith(input)
		})

		describe('errors', () => {
			it('should throw when user not found', async () => {
				await expect(service.getUserByEmail(input)).rejects.toThrowError(
					`User with email: ${input} not found!`
				)
			})
		})
	})

	describe('findManyUsers', () => {
		const input = ['uuid1', 'uuid2']
		it('should call dao', async () => {
			await service.findManyUsers(input)
			expect(daoMock.findManyUsers).toBeCalledTimes(1)
			expect(daoMock.findManyUsers).toBeCalledWith(input, undefined)
		})
	})

	describe('updateUser', () => {
		const input = {} as Prisma.UserUpdateArgs
		it('should call dao', async () => {
			await service.updateUser(input)
			expect(daoMock.updateUser).toBeCalledTimes(1)
			expect(daoMock.updateUser).toBeCalledWith(input)
		})
	})

	describe('createGuestUser', () => {
		const input = {
			name: 'name',
			groupUuid: 'uuid',
		}
		it('should call dao', async () => {
			await service.createGuestUser(input.name, input.groupUuid)

			expect(daoMock.createUser).toBeCalledTimes(1)
			expect(daoMock.createUser).toBeCalledWith({
				name: 'name',
				email: expect.stringMatching(/.*/),
				password: expect.stringMatching(/.*/),
				type: USER_TYPE.GUEST,
				groupUuid: 'uuid',
			})
		})
	})

	const daoMock = {
		createUser: jest.fn(),
		findUserByUuid: jest.fn(),
		findUserByEmail: jest.fn(),
		findManyUsers: jest.fn(),
		updateUser: jest.fn(),
	}
})
