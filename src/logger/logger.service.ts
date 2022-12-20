import { Injectable } from '@nestjs/common'
import { createWriteStream, lstatSync } from 'fs'

@Injectable()
export class LoggerService {
	async addLoginEntry(date: Date, userUuid: string) {
		const exist = lstatSync('./log_stamps.csv', {
			throwIfNoEntry: false,
		})?.isFile()
		const header = exist ? '' : 'Login_date;UUID;\n'
		const fileStream = createWriteStream('./log_stamps.csv', {
			encoding: 'utf8',
			flags: 'a',
		})
		const logMessage = header + `${date.toISOString()};${userUuid}\n`
		fileStream.write(logMessage)
	}
}
