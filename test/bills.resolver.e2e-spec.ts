import { Test, TestingModule } from '@nestjs/testing'
import { HttpServer, INestApplication } from '@nestjs/common'
import { AppModule } from './../src/app.module'
import { jwtEncoder, sendGqlQuery } from './utils'
import { USER_TYPE } from '../src/commons/enums/user.enums'
import { PrismaService } from '../src/commons/prisma/prisma.service'
import { CURRENCY } from '../src/commons/enums/currency.enums'

describe('BillsResolver (e2e)', () => {
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

	describe('billCreate', () => {
		const mutation = `mutation billCreate($input: BillCreateInput!){
  billCreate(input: $input) {
    uuid
    name
    price
    payedBy
  }
}`

		it('should create bill for logged user', async () => {
			const user = await db.user.create({
				data: {
					name: 'name',
					email: 'test@mail.com',
					password: 'Pass',
					type: USER_TYPE.REGULAR,
					groups: {
						create: {
							partyGroup: {
								create: {
									name: 'group',
									code: 'code',
									currency: CURRENCY.PLN,
								},
							},
						},
					},
				},
			})
			const input = {
				name: 'test',
				price: 21.37,
			}
			const header = jwtEncoder({ ...user, groupCode: 'code' })

			const { body } = await sendGqlQuery(server, mutation, { input }, header)

			expect(body.data.billCreate).toMatchObject({
				uuid: expect.stringMatching(/.*/),
				name: input.name,
				price: input.price,
				payedBy: user.uuid,
			})
		})
	})

	describe('billGetForGroupUser', () => {
		const mutation = `mutation billGetForGroupUser{
  billGetForGroupUser {
    uuid
    name
    price
    payedBy
    groupUuid
  }
}`

		it('should create bill for logged user', async () => {
			const user = await db.user.create({
				data: {
					name: 'name',
					email: 'test@mail.com',
					password: 'Pass',
					type: USER_TYPE.REGULAR,
					groups: {
						create: {
							partyGroup: {
								create: {
									name: 'group',
									code: 'code',
									currency: CURRENCY.PLN,
								},
							},
						},
					},
				},
				include: { groups: true },
			})
			const bill = await db.bill.create({
				data: {
					name: 'test',
					price: 21.37,
					payedBy: user.uuid,
					groupUuid: user.groups[0].groupUuid,
				},
			})
			const header = jwtEncoder({ ...user, groupCode: 'code' })

			const { body } = await sendGqlQuery(server, mutation, undefined, header)
			expect(body.data.billGetForGroupUser).toMatchObject([
				{
					uuid: bill.uuid,
					name: bill.name,
					price: bill.price,
					payedBy: bill.payedBy,
					groupUuid: bill.groupUuid,
				},
			])
		})
	})
})
