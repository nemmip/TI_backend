import { Module } from "@nestjs/common"
import { PassportModule } from "@nestjs/passport"
import { UsersModule } from "src/users/users.module"
import { AuthService } from "./auth.service"
import { AuthResolver } from "./auth.resolver"
import { JwtModule } from "@nestjs/jwt"
import { JwtStrategy } from "./jwt.strategy"
import { PartyGroupModule } from "src/party-group/party-group.module"

@Module({
	imports: [
		UsersModule,
		PassportModule,
		JwtModule.register({
			secret: process.env.SECRET,
			signOptions: { expiresIn: "30m" },
		}),
		PartyGroupModule,
	],
	providers: [AuthService, AuthResolver, JwtStrategy],
})
export class AuthModule {}
