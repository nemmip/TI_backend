import { USER_TYPE } from "src/commons/enums/user.enums"
import { UserCreateInput } from "./users.inputs"

export interface UserCreateArgs extends UserCreateInput {
	type: USER_TYPE
	groupUuid?: string
}
