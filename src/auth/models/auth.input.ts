import { Field, InputType } from "@nestjs/graphql"
import { IsEmail, IsOptional, IsUUID, Length } from "class-validator"
import { GraphQLID } from "graphql"

@InputType()
export class AuthLoginInput {
	@Field(() => String)
	@IsEmail()
	email: string

	@Field(() => String)
	password: string
}

@InputType()
export class GroupLoginInput {
	@Field(() => GraphQLID, {
		description: "Uuid of user to join, might be null",
		nullable: true,
	})
	@IsOptional()
	@IsUUID()
	uuid?: string

	@Field(() => String, { description: "Name of user to join group" })
	name: string

	@Field({ description: "Code of group to join" })
	@Length(8, 8)
	code: string
}
