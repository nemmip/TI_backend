import { Test, TestingModule } from '@nestjs/testing'
import { HttpServer, INestApplication } from '@nestjs/common'
import { AppModule } from '../src/app.module'
import { jwtEncoder, sendGqlQuery } from './utils'
import { USER_TYPE } from '../src/commons/enums/user.enums'
import { PrismaService } from '../src/commons/prisma/prisma.service'
import { randomUUID } from 'crypto'
import { CURRENCY } from '../src/commons/enums/currency.enums'

describe('PartyGroup Resolver (e2e)', () => {
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

	describe('partyGroupCreate', () => {
		const mutation = `
			mutation partyGroupCreate($input: PartyGroupCreateInput!){
  partyGroupCreate(input: $input) {
    uuid
    name
    code
    currency
  }
}
		`

		it('should create party group', async () => {
			const input = {
				name: 'Name',
				currency: 'PLN',
			}
			const user = await db.user.create({
				data: {
					name: 'name',
					email: 'test@mail.com',
					password: 'password',
					type: USER_TYPE.REGULAR,
				},
			})
			const header = jwtEncoder(user)
			const { body } = await sendGqlQuery(server, mutation, { input }, header)

			expect(body.data.partyGroupCreate).toMatchObject({
				uuid: expect.stringMatching(/.*/),
				name: input.name,
				code: expect.stringMatching(/.*/),
				currency: 'PLN',
			})
		})
	})

	describe('partyGroupGetForUser', () => {
		const mutation = `
			mutation partyGroupGetForUser {
  partyGroupGetForUser {
    uuid
    name
    code
    currency
  }
}
		`
		it('should return party for logged user', async () => {
			const userUuid = randomUUID()
			const user = await db.user.create({
				data: {
					uuid: userUuid,
					name: 'name',
					email: 'test@mail.com',
					password: 'pass',
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
			const group = await db.partyGroup.findFirst({
				where: { uuid: user.groups[0].groupUuid },
			})
			const header = jwtEncoder(user)

			const { body } = await sendGqlQuery(server, mutation, undefined, header)

			expect(body.data.partyGroupGetForUser).toMatchObject([
				{
					uuid: group.uuid,
					name: group.name,
					code: group.code,
					currency: 'PLN',
				},
			])
		})
	})

	describe('partyGroupDelete', () => {
		const mutation = `
			mutation partyGroupDelete($input: PartyGroupDeleteInput!){
  partyGroupDelete(input: $input)
}`

		it('should delete party for logged user', async () => {
			const userUuid = randomUUID()
			const user = await db.user.create({
				data: {
					uuid: userUuid,
					name: 'name',
					email: 'test@mail.com',
					password: 'pass',
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
			const group = await db.partyGroup.findFirst({
				where: { uuid: user.groups[0].groupUuid },
			})
			const header = jwtEncoder(user)
			const input = { groupUuid: group.uuid }

			await sendGqlQuery(server, mutation, { input }, header)

			expect(
				await db.partyGroupOnUser.count({
					where: {
						userUuid: user.uuid,
					},
				})
			).toBe(0)
		})
	})

	describe('partyGroupSummary', () => {
		const mutation = `query partyGroupSummary{
  partyGroupSummary {
    group {
      uuid
      name
      code
      currency
    }
    billsSummary {
      member {
        name
        payedBills {
          name
          price
        }
      }
      sumOfBills
    }
  }
}`

		it('should summarize party for logged in party user', async () => {
			const userUuid = randomUUID()
			const user = await db.user.create({
				data: {
					uuid: userUuid,
					name: 'name',
					email: 'test@mail.com',
					password: 'pass',
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
					Payer: { connect: { uuid: user.uuid } },
					name: 'Restaurant',
					price: 21.37,
					Group: { connect: { uuid: user.groups[0].groupUuid } },
				},
			})
			const group = await db.partyGroup.findFirst({
				where: { uuid: user.groups[0].groupUuid },
			})
			const header = jwtEncoder({ ...user, groupCode: group.code })

			const { body } = await sendGqlQuery(server, mutation, undefined, header)
			const expected = {
				group: {
					uuid: group.uuid,
					name: group.name,
					code: group.code,
					currency: 'PLN',
				},
				billsSummary: [
					{
						member: {
							name: user.name,
							payedBills: [
								{
									name: bill.name,
									price: bill.price,
								},
							],
						},
						sumOfBills: bill.price,
					},
				],
			}
			expect(body.data.partyGroupSummary).toMatchObject(expected)
		})
	})

	describe('partyGroupAddUser', () => {
		const mutation = `mutation partyGroupAddUser($input: PartyGroupAddUserInput!){
  partyGroupAddUser(input: $input ) {
    uuid
    name
  }
}`
		it('should add another user to logged party', async () => {
			const userUuid = randomUUID()
			const user = await db.user.create({
				data: {
					uuid: userUuid,
					name: 'name',
					email: 'test@mail.com',
					password: 'pass',
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
			const anotherUser = await db.user.create({
				data: {
					name: 'Name1',
					email: 'another@mail.com',
					password: 'Pass',
					type: USER_TYPE.REGULAR,
				},
			})
			const group = await db.partyGroup.findFirst({
				where: { uuid: user.groups[0].groupUuid },
			})
			const header = jwtEncoder({ ...user, groupCode: group.code })
			const input = {
				userUuid: anotherUser.uuid,
			}

			const { body } = await sendGqlQuery(server, mutation, { input }, header)
			const expected = {
				uuid: anotherUser.uuid,
				name: anotherUser.name,
			}
			expect(body.data.partyGroupAddUser).toMatchObject(expected)
		})
	})

	describe('splitPartyGroup', () => {
		const mutation = `query splitPartyGroup {
  splitPartyGroup {
    name
    pay
  }
}`

		it('should split logged party', async () => {
			const userUuid = randomUUID()
			const user = await db.user.create({
				data: {
					uuid: userUuid,
					name: 'name',
					email: 'test@mail.com',
					password: 'pass',
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

			const group = await db.partyGroup.findFirst({
				where: { uuid: user.groups[0].groupUuid },
			})
			const header = jwtEncoder({ ...user, groupCode: group.code })

			const { body } = await sendGqlQuery(server, mutation, undefined, header)
			const expected = [
				{
					name: user.name,
					pay: 0,
				},
			]
			expect(body.data.splitPartyGroup).toMatchObject(expected)
		})
	})
})
