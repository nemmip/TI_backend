import { Field, ObjectType } from "@nestjs/graphql"
import { GraphQLID } from "graphql"

@ObjectType({ description: "Represents one single contact" })
export class Contact {
	@Field(() => GraphQLID, { description: "Uuid of external user." })
	uuid: string

	@Field(() => GraphQLID, { description: "Uuid of contact head." })
	contactUuid: string
}
