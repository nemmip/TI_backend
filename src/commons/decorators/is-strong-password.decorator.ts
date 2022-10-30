import {
	ValidatorConstraint,
	ValidatorConstraintInterface,
	ValidationArguments,
	registerDecorator,
	ValidationOptions,
} from "class-validator"

@ValidatorConstraint({ async: true })
export class IsStrongPasswordConstraint
	implements ValidatorConstraintInterface
{
	validate(password: any, _args: ValidationArguments) {
		const hasProperLength = 8 <= password.length && password.length <= 20
		const isStrongRegex = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])/

		return hasProperLength && !!password.match(isStrongRegex)
	}
}

export function IsStrongPassword(validationOptions?: ValidationOptions) {
	return function (object: Object, propertyName: string) {
		registerDecorator({
			target: object.constructor,
			propertyName: propertyName,
			options: validationOptions,
			constraints: [],
			validator: IsStrongPasswordConstraint,
		})
	}
}
