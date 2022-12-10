import {
	ValidatorConstraint,
	ValidatorConstraintInterface,
	ValidationArguments,
	registerDecorator,
	ValidationOptions,
} from 'class-validator'
import { PrismaService } from '../prisma/prisma.service'

@ValidatorConstraint({ async: true })
export class IsExistingByUuidConstraint
implements ValidatorConstraintInterface
{
	constructor(private readonly db: PrismaService) {}

	async validate(uuid: string, _args: ValidationArguments) {
		const user = await this.db.user.findUnique({
			where: {
				uuid,
			},
		})
		return !!user
	}
	defaultMessage(_validationArguments?: ValidationArguments): string {
		return 'User not found with given uuid.'
	}
}

export function IsExistingByUuid(validationOptions?: ValidationOptions) {
	return function (object: Object, propertyName: string) {
		registerDecorator({
			target: object.constructor,
			propertyName: propertyName,
			options: validationOptions,
			constraints: [],
			validator: IsExistingByUuidConstraint,
			async: true,
		})
	}
}
