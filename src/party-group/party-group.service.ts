import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { PartyGroupDao } from './party-group.dao'
import { PartyGroupCreateInput } from './models/party-group.input'
import { UserInputError } from 'apollo-server-express'
import { BillsService } from '../bills/bills.service'

@Injectable()
export class PartyGroupService {
	constructor(
		private readonly dao: PartyGroupDao,
		@Inject(forwardRef(() => BillsService))
		private readonly billsService: BillsService
	) {}
	async partyGroupCreate(input: PartyGroupCreateInput) {
		const currentTime = new Date().valueOf().toString()
		const code = currentTime.slice(currentTime.length - 8)

		return await this.dao.createPartyGroup({ ...input, code })
	}

	async partyGroupGetForUser(uuid: string) {
		return await this.dao.getAllForUser(uuid)
	}

	async partyGroupDelete(uuid: string, userUuid: string) {
		return await this.dao.deletePartyGroup(uuid, userUuid)
	}

	async findGroupByCode(code: string) {
		const group = await this.dao.findGroupByCode(code)
		if (group) {
			return group
		}
		throw new UserInputError(`Group with code ${code} not found.`)
	}

	async partyGroupMembers(code: string) {
		const group = await this.findGroupByCode(code)

		return await this.dao.getGroupMembers(group.uuid)
	}

	async partyGroupAddUser(code: string, userUuid: string) {
		const group = await this.findGroupByCode(code)

		return await this.dao.addMemberToGroup(group.uuid, userUuid)
	}

	async partyGroupSummary(code: string) {
		const group = await this.findGroupByCode(code)
		const members = await this.partyGroupMembers(code)
		const membersBillsSummary = members.map(async (member) => {
			const memberBills = await this.billsService.billGetForGroupUser(
				code,
				member.uuid
			)

			return {
				member: {
					...member,
					payedBills: memberBills,
				},
				sumOfBills:
					memberBills && memberBills.length > 0
						? memberBills
							.map((bill) => bill.price)
							.reduce((prev, next) => prev + next)
						: 0,
			}
		})

		return {
			group,
			billsSummary: await Promise.all(membersBillsSummary),
		}
	}

	async splitPartyGroup(code: string) {
		const groupSummary = await this.partyGroupSummary(code)
		const allBills = groupSummary.billsSummary
			.map((billsSum) => billsSum.sumOfBills)
			.reduce((prev, next) => prev + next)

		const division = allBills ? allBills / groupSummary.billsSummary.length : 0
		return groupSummary.billsSummary.map((bill) => ({
			name: bill.member.name,
			pay: bill.sumOfBills - division,
		}))
	}
}
