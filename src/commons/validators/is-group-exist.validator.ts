import {
	ValidatorConstraint,
	ValidatorConstraintInterface,
	ValidationArguments,
	registerDecorator,
	ValidationOptions,
} from 'class-validator'
import { PrismaService } from '../prisma/prisma.service'

@ValidatorConstraint({ async: true })
export class IsGroupExistsConstraint implements ValidatorConstraintInterface {
	constructor(private readonly db: PrismaService) {}

	async validate(uuid: string, _args: ValidationArguments) {
		const group = await this.db.partyGroup.findUnique({
			where: {
				uuid,
			},
		})
		return !!group
	}
	defaultMessage(_validationArguments?: ValidationArguments): string {
		return 'Group not found with given uuid.'
	}
}

export function IsGroupExists(validationOptions?: ValidationOptions) {
	return function (object: Object, propertyName: string) {
		registerDecorator({
			target: object.constructor,
			propertyName: propertyName,
			options: validationOptions,
			constraints: [],
			validator: IsGroupExistsConstraint,
			async: true,
		})
	}
}
