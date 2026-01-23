import { Role, User } from "src/generated/prisma/client"
import {ReturnLoginTypeData} from './auth.types'
export class RegistSwaggerTypeData {
    login: string 
    email: string
    password: string
}

export class LoginSwaggerTypeData {
    email: string
    password: string
}

export class RegistSwaggerReturnTypeData implements User {
    id: number
    login: string
    email: string
    password: string
    role: Role
    updatedAt: Date
    createdAt: Date
}


export class LoginSwaggerReturnTypeData implements ReturnLoginTypeData {
    user: { id: number; email: string; password: string; login: string; role: Role; createdAt: Date; updatedAt: Date }
    accessToken: string
} 