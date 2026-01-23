import { User } from "src/generated/prisma/client";


export type RegisterTypData = Pick<User, 'login' | 'email' | 'password'>
export type LoginTypeData = Pick<User, "email" | 'password'>

export interface ReturnLoginType {
    user: User,
    accessToken: string,
    refreshToken: string
}


export type ReturnLoginTypeData = Omit<ReturnLoginType, 'refreshToken'>