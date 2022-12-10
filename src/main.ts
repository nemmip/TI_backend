import { Logger, ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { useContainer } from 'class-validator'
import { AppModule } from './app.module'

const logger = new Logger('TI_backend')
async function bootstrap() {
	const app = await NestFactory.create(AppModule)
	app.useGlobalPipes(new ValidationPipe())
	useContainer(app.select(AppModule), { fallbackOnErrors: true })
	await app.listen(3000)
	logger.debug('Backend service successfully started!')
}
bootstrap()
