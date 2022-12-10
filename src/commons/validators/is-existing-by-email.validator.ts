import {
	ValidatorConstraint,
	ValidatorConstraintInterface,
	ValidationArguments,
	registerDecorator,
	ValidationOptions,
} from 'class-validator'
import { PrismaService } from '../prisma/prisma.service'

@ValidatorConstraint({ async: true })
export class IsExistingByEmailConstraint
implements ValidatorConstraintInterface
{
	constructor(private readonly db: PrismaService) {}

	async validate(email: string, _args: ValidationArguments) {
		const user = await this.db.user.findUnique({
			where: {
				email,
			},
		})
		return !!user
	}
	defaultMessage(_validationArguments?: ValidationArguments): string {
		return 'User not found with given email.'
	}
}

export function IsExistingByEmail(validationOptions?: ValidationOptions) {
	return function (object: Object, propertyName: string) {
		registerDecorator({
			target: object.constructor,
			propertyName: propertyName,
			options: validationOptions,
			constraints: [],
			validator: IsExistingByEmailConstraint,
			async: true,
		})
	}
}
