import { HttpServer } from '@nestjs/common'
import { createHmac } from 'crypto'
import { DocumentNode } from 'graphql'
import * as request from 'supertest'

export const sendGqlMutation = (
	server: HttpServer,
	mutation: DocumentNode,
	variables: any,
	headers?: string
) => {
	return request(server)
		.post('/graphql')
		.send({
			mutation,
			variables,
		})
		.set('Authorization', headers ?? '')
}

export const sendGqlQuery = (
	server: HttpServer,
	query: string,
	variables: any,
	headers?: string
) => {
	return request(server)
		.post('/graphql')
		.send({
			query,
			variables,
		})
		.set('Authorization', headers ?? '')
}

export const jwtEncoder = (payload: any) => {
	const header = {
		alg: 'HS256',
		typ: 'JWT',
	}
	const b64Header = toBase64(header)
	const jwtB64Header = replaceSpecialChars(b64Header)
	const b64Payload = toBase64(payload)
	const jwtB64Payload = replaceSpecialChars(b64Payload)
	const secret = 'sluchamymyszyjakniktnieslyszy'
	const signature = createSignature(jwtB64Header, jwtB64Payload, secret)
	return jwtB64Header + '.' + jwtB64Payload + '.' + signature
}

const toBase64 = (obj: any) => {
	const str = JSON.stringify(obj)
	return Buffer.from(str).toString('base64')
}

const replaceSpecialChars = (message: string) => {
	return message.replace(/[=+/]/g, (charToBeReplaced) => {
		switch (charToBeReplaced) {
		case '=':
			return ''
		case '+':
			return '-'
		case '/':
			return '_'
		}
	})
}
const createSignature = (jwtB64Header, jwtB64Payload, secret) => {
	const signature = createHmac('sha256', secret)
		.update(jwtB64Header + '.' + jwtB64Payload)
		.digest('base64')

	return replaceSpecialChars(signature)
}

export const DATABASE_URL =
	'postgresql://username:password@localhost:5432/testdb'
