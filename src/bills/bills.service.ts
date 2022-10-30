import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { PartyGroupService } from 'src/party-group/party-group.service'
import { BillsDao } from './bills.dao'
import { BillCreateInput } from './models/bills.input'

@Injectable()
export class BillsService {
	constructor(
		private readonly dao: BillsDao,
		@Inject(forwardRef(() => PartyGroupService))
		private readonly groupsService: PartyGroupService
	) {}

	async billCreate(input: BillCreateInput) {
		const group = await this.groupsService.findGroupByCode(input.groupCode)
		return await this.dao.create({
			name: input.name,
			price: input.price,
			Payer: { connect: { uuid: input.payedBy } },
			Group: { connect: { uuid: group.uuid } },
		})
	}

	async billGetForGroupUser(code: string, userUuid: string) {
		const group = await this.groupsService.findGroupByCode(code)

		return await this.dao.findByGroupUser(group.uuid, userUuid)
	}
}
