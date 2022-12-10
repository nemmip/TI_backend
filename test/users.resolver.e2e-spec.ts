import { Test, TestingModule } from '@nestjs/testing'
import { HttpServer, INestApplication } from '@nestjs/common'
import { AppModule } from './../src/app.module'
import { jwtEncoder, sendGqlQuery } from './utils'
import { USER_TYPE } from '../src/commons/enums/user.enums'
import { PrismaService } from '../src/commons/prisma/prisma.service'
import { createHash } from 'crypto'

describe('UsersResolver (e2e)', () => {
	let app: INestApplication
	let server: HttpServer
	let db: PrismaService

	beforeEach(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
		}).compile()
		app = moduleFixture.createNestApplication()
		db = moduleFixture.get<PrismaService>(PrismaService)
		await app.init()
		server = app.getHttpServer()
	})

	afterAll(async () => {
		await db.$disconnect()
		app && (await app.close())
	})

	describe('createRegularUser', () => {
		const mutation = `
			mutation createRegularUser($input: UserCreateInput!) {
				createRegularUser(input: $input) {
					uuid
					name
					email
					type
				}
			}
		`

		it('should create user', async () => {
			const input = {
				name: 'Name',
				email: 'test1@mail.com',
				password: 'SomeTestPass#1',
			}
			const { body } = await sendGqlQuery(server, mutation, { input })
			expect(body.data.createRegularUser).toMatchObject({
				uuid: expect.stringMatching(/.*/),
				name: input.name,
				email: input.email,
				type: USER_TYPE.REGULAR,
			})
		})
	})

	describe('me', () => {
		const hashedPass = 'password'
		const query = `
			query me {
				me {
					uuid
					name
					email
					type
				}
			}
		`
		it('should return information about logged user', async () => {
			const user = await db.user.create({
				data: {
					name: 'name',
					email: 'test@mail.com',
					password: createHash('sha256').update(hashedPass).digest('base64'),
					type: USER_TYPE.REGULAR,
				},
			})
			const header = jwtEncoder(user)

			const { body } = await sendGqlQuery(server, query, undefined, header)

			expect(body.data.me).toMatchObject({
				uuid: expect.stringMatching(/.*/),
				name: 'name',
				email: 'test@mail.com',
				type: USER_TYPE.REGULAR,
			})
		})
		describe('errors', () => {
			it('should require user to be logged in', async () => {
				const { body } = await sendGqlQuery(server, query, undefined)
				expect(body.errors[0].message).toBe('Unauthorized')
			})
			it('should throw when user not found', async () => {
				const header = jwtEncoder({
					uuid: 'uuid',
					type: USER_TYPE.REGULAR,
				})
				const { body } = await sendGqlQuery(server, query, undefined, header)
				expect(body.errors[0].message).toBe('User with uuid: uuid not found!')
			})
		})
	})
})
