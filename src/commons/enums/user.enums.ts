/* eslint-disable no-unused-vars */
import { registerEnumType } from "@nestjs/graphql"

export enum USER_TYPE {
	ADMIN = "ADMIN",
	REGULAR = "REGULAR",
	GUEST = "GUEST",
}

registerEnumType(USER_TYPE, {
	name: "USER_TYPE",
	description: "Enumeration used to specify user type.",
})
