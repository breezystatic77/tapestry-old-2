import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	PrimaryColumn,
	OneToMany,
	Generated,
	ManyToMany
} from 'typeorm'
import { validate, IsEmail } from 'class-validator'
import * as argon2 from 'argon2'
import * as Jwt from 'jsonwebtoken'
import { Character } from './Character'
import config from '../../util/config'
import { idArrayToObject } from '../../util/utils'
import { userInfo } from 'os'

export enum UserStatus {
	Unverified = 0,
	Verified = 1,
	Suspended = 2,
	Banned = 3
}

@Entity()
export class User {
	@PrimaryColumn()
	@IsEmail()
	email: string

	@Column({ select: true }) // select: false?
	passHash: string

	@Column({ type: 'int' })
	status: UserStatus

	@Column({ type: 'int' })
	characterLimit: number = 50

	@Generated('uuid')
	verifyCode: string

	@OneToMany(
		type => Character,
		character => character.owner
	)
	characters: Promise<Character[]>

	@ManyToMany(
		type => Character,
		character => character.blockedBy
	)
	blocked: Promise<Character[]>

	async validate(): Promise<void> {
		const errors = await validate(this)
		if (errors.length > 0) {
			throw new Error(`Validation failed: ${errors}`)
		}
	}

	isVerified(): boolean {
		return this.status === UserStatus.Verified
	}

	async hashPassword(pass: string): Promise<void> {
		const res = await argon2.hash(pass)
		this.passHash = res
	}

	async checkPassword(pass: string): Promise<boolean> {
		// console.log(`checking ${this.passHash} against ${pass}`)
		const res = await argon2.verify(this.passHash, pass)
		return res
	}

	async toApiUser(): Promise<Tapestry.ApiUser> {
		return {
			email: this.email,
			status: this.status,
			characterLimit: this.characterLimit,
			characters: idArrayToObject(
				(await this.characters).map(c => c.toApiCharacter())
			)
		}
	}

	createJwt(): string {
		return Jwt.sign(
			{
				email: this.email
			},
			config.JWT_SECRET
		)
	}

	async ownsCharacter(character: Character): Promise<boolean> {
		try {
			const chars = await this.characters
			return chars.includes(character)
		} catch (err) {
			return false
		}
	}
}
