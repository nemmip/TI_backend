import { createParamDecorator, ExecutionContext } from "@nestjs/common"
import { GqlExecutionContext } from "@nestjs/graphql"

export const Group = createParamDecorator(
	(_data: any, context: ExecutionContext) => {
		const ctx = GqlExecutionContext.create(context)
		const gqlCtx = ctx.getContext()
		return gqlCtx.req.user.groupCode
	}
)
