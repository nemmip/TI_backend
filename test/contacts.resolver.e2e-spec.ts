import { Test, TestingModule } from '@nestjs/testing'
import { HttpServer, INestApplication } from '@nestjs/common'
import { AppModule } from './../src/app.module'
import { jwtEncoder, sendGqlQuery } from './utils'
import { USER_TYPE } from '../src/commons/enums/user.enums'
import { PrismaService } from '../src/commons/prisma/prisma.service'

describe('ContactsResolver (e2e)', () => {
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

	describe('contactsGetByUser', () => {
		const mutation = `mutation contactsGetByUser {
        contactsGetByUser {
            uuid
            savedContacts {
                uuid
                contactUuid
            }
        }
    }
`

		it('should get list of contacts for logged user', async () => {
			const contactUser = await db.user.create({
				data: {
					name: 'name1',
					email: 'test1@mail.com',
					password: 'Pass',
					type: USER_TYPE.REGULAR,
				},
			})

			const user = await db.user.create({
				data: {
					name: 'name',
					email: 'test@mail.com',
					password: 'Pass',
					type: USER_TYPE.REGULAR,
					savedContacts: {
						create: {
							uuid: contactUser.uuid,
						},
					},
				},
			})
			const header = jwtEncoder(user)

			const { body } = await sendGqlQuery(server, mutation, undefined, header)

			expect(body.data.contactsGetByUser).toMatchObject({
				uuid: user.uuid,
				savedContacts: [{ uuid: contactUser.uuid, contactUuid: user.uuid }],
			})
		})
	})

	describe('contactAdd', () => {
		const mutation = `mutation contactAdd ($input: ContactAddInput!){
  contactAdd(input: $input) {
    uuid
    name
    email
    type
    savedContacts {
      uuid
      contactUuid
    }
  }
}`

		it('should add new contact for logged user', async () => {
			const contactUser = await db.user.create({
				data: {
					name: 'name1',
					email: 'test1@mail.com',
					password: 'Pass',
					type: USER_TYPE.REGULAR,
				},
			})

			const user = await db.user.create({
				data: {
					name: 'name',
					email: 'test@mail.com',
					password: 'Pass',
					type: USER_TYPE.REGULAR,
				},
			})
			const header = jwtEncoder(user)
			const input = { contactEmail: contactUser.email }

			const { body } = await sendGqlQuery(server, mutation, { input }, header)
			expect(body.data.contactAdd).toMatchObject({
				uuid: user.uuid,
				savedContacts: [{ uuid: contactUser.uuid, contactUuid: user.uuid }],
			})
		})
	})

	describe('contactDelete', () => {
		const mutation = `mutation contactDeleta ($input: ContactDeleteInput!){
  contactDelete(input: $input)
}`

		it('should delete contact for logged user', async () => {
			const contactUser = await db.user.create({
				data: {
					name: 'name1',
					email: 'test1@mail.com',
					password: 'Pass',
					type: USER_TYPE.REGULAR,
				},
			})

			const user = await db.user.create({
				data: {
					name: 'name',
					email: 'test@mail.com',
					password: 'Pass',
					type: USER_TYPE.REGULAR,
					savedContacts: {
						create: {
							uuid: contactUser.uuid,
						},
					},
				},
			})
			const header = jwtEncoder(user)
			const input = {
				contactUuid: contactUser.uuid,
			}
			const { body } = await sendGqlQuery(server, mutation, { input }, header)

			expect(body.data.contactDelete).toBe(contactUser.uuid)
		})
	})
})
