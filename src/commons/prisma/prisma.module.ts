import { Module } from '@nestjs/common'
import { IsExistingByEmailConstraint } from '../validators/is-existing-by-email.validator'
import { IsExistingByUuidConstraint } from '../validators/is-existing-by-uuid.validator'
import { IsGroupExistsConstraint } from '../validators/is-group-exist.validator'
import { PrismaService } from './prisma.service'

@Module({
	providers: [
		PrismaService,
		IsExistingByEmailConstraint,
		IsExistingByUuidConstraint,
		IsGroupExistsConstraint,
	],
	exports: [PrismaService],
})
export class AppPrismaModule {}
