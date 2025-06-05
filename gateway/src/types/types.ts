export type JwtPayload = {
	sub: string
	contactId: string
	name: string
	exp:number
	roles: string[]
}