import { Injectable, OnModuleInit } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'
import knex, { Knex } from 'knex'

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
	public readonly queryBuilder: Knex
	constructor() {
		super()
		this.queryBuilder = knex({
			client: 'pg',
			connection: {
				host: '127.0.0.1',
				port: 5432,
				user: 'username',
				password: 'password',
				database: 'testdb',
			},
		})
	}
	async onModuleInit() {
		await this.$connect()
	}
}
